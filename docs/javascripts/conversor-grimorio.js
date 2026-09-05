document.addEventListener("DOMContentLoaded", async () => {

    const URL_GRIMORIO = "/regras/magia/grimorio.json";
    const NOME_ARQUIVO_SAIDA = "grimorio-canonico.json";

    /*
     * ============================================================
     * CONFIGURAÇÃO
     * ============================================================
     */

    const MAPA_NIVEIS = {
        1: "Percepção",
        2: "Influência",
        3: "Manipulação",
        4: "Transformação",
        5: "Domínio"
    };

    // Nomes antigos -> nomes canônicos
    const ALIASES_PARAMETROS = {
        "area": "area_efeito",
        "caracteristicas": "caracteristicas_alteradas",
        "volume": "massa_volume"
    };

    const PARAMETROS_CANONICOS = new Set([
        "alcance",
        "area_efeito",
        "atribulacao",
        "caracteristicas_alteradas",
        "conceder_bonus",
        "cura",
        "dano",
        "duracao",
        "invocacao",
        "massa_volume",
        "metamorfose",
        "modificadores_ataque",
        "multiplos_alvos",
        "tamanho",
        "tempo_conjuracao",
        "velocidade"
    ]);


    /*
     * ============================================================
     * FUNÇÕES AUXILIARES
     * ============================================================
     */

    function normalizarNomeParametro(nome) {
        return ALIASES_PARAMETROS[nome] || nome;
    }


    function clonar(objeto) {
        return JSON.parse(JSON.stringify(objeto));
    }


    /*
     * Converte:
     *
     * objeto:
     * {
     *   valor: "Toque",
     *   modificador: 2
     * }
     *
     * para:
     *
     * [
     *   {
     *     valor: "Toque",
     *     modificador: 2
     *   }
     * ]
     */
    function transformarEmArray(valor) {

        if (Array.isArray(valor)) {
            return valor;
        }

        if (valor !== null && typeof valor === "object") {
            return [valor];
        }

        return [];
    }


    /*
     * ============================================================
     * CONVERSÃO DE UM ITEM DE PARÂMETRO
     * ============================================================
     */

    function converterItem(item, nomeParametro) {

        if (item === null || typeof item !== "object") {

            return {
                valor: item,
                modificador: 0
            };
        }


        /*
         * O formato canônico começa sempre com:
         *
         * {
         *   valor: ...,
         *   modificador: ...
         * }
         */

        const novoItem = {};


        /*
         * --------------------------------------------------------
         * VALOR
         * --------------------------------------------------------
         *
         * O valor canônico já usa "valor".
         *
         * Algumas estruturas antigas utilizavam "efeito".
         */

        if (Object.prototype.hasOwnProperty.call(item, "valor")) {

            novoItem.valor = clonar(item.valor);

        } else if (Object.prototype.hasOwnProperty.call(item, "efeito")) {

            novoItem.valor = clonar(item.efeito);

        } else if (Object.prototype.hasOwnProperty.call(item, "descricao")) {

            novoItem.valor = clonar(item.descricao);

        } else {

            /*
             * Casos especiais de estruturas antigas.
             */

            if (nomeParametro === "metamorfose") {

                if (Object.prototype.hasOwnProperty.call(item, "forma")) {
                    novoItem.valor = clonar(item.forma);
                } else {
                    novoItem.valor = "";
                }

            } else if (nomeParametro === "invocacao") {

                if (Object.prototype.hasOwnProperty.call(item, "criatura")) {
                    novoItem.valor = clonar(item.criatura);
                } else {
                    novoItem.valor = "";
                }

            } else if (nomeParametro === "tamanho") {

                if (Object.prototype.hasOwnProperty.call(item, "valor")) {
                    novoItem.valor = clonar(item.valor);
                } else if (Object.prototype.hasOwnProperty.call(item, "tamanho")) {
                    novoItem.valor = clonar(item.tamanho);
                } else {
                    novoItem.valor = "";
                }

            } else {

                /*
                 * Se não encontramos um campo de valor conhecido,
                 * preservamos o objeto inteiro dentro de "valor".
                 *
                 * Isso evita perda silenciosa de informação.
                 */

                novoItem.valor = clonar(item);
            }
        }


        /*
         * --------------------------------------------------------
         * MODIFICADOR
         * --------------------------------------------------------
         *
         * "modificador" sempre representa a contribuição do
         * parâmetro para a penalidade da magia.
         *
         * NÃO é o modificador efetivo do dano/efeito.
         */

        if (
            Object.prototype.hasOwnProperty.call(item, "modificador") &&
            typeof item.modificador === "number"
        ) {

            novoItem.modificador = item.modificador;

        } else {

            novoItem.modificador = 0;
        }


        /*
         * --------------------------------------------------------
         * DETALHES
         * --------------------------------------------------------
         *
         * Tudo que era informação adicional do item antigo,
         * mas que não pertence a "valor" ou "modificador",
         * vai para "detalhes".
         */

        const detalhes = {};

        for (const chave of Object.keys(item)) {

            if (
                chave === "valor" ||
                chave === "efeito" ||
                chave === "descricao" ||
                chave === "modificador"
            ) {
                continue;
            }

            detalhes[chave] = clonar(item[chave]);
        }


        /*
         * Se o item antigo já possuía "detalhes", juntamos seu
         * conteúdo diretamente dentro de detalhes.
         */

        if (
            item.detalhes &&
            typeof item.detalhes === "object" &&
            !Array.isArray(item.detalhes)
        ) {

            Object.assign(
                detalhes,
                clonar(item.detalhes)
            );
        }


        /*
         * Não criamos "detalhes": {} desnecessariamente.
         */

        if (Object.keys(detalhes).length > 0) {
            novoItem.detalhes = detalhes;
        }


        return novoItem;
    }


    /*
     * ============================================================
     * CONVERSÃO DE UM PARÂMETRO
     * ============================================================
     */

    function converterParametro(nomeParametro, valor) {

        const nomeCanonico = normalizarNomeParametro(nomeParametro);

        const itens = transformarEmArray(valor);

        return itens.map(item =>
            converterItem(item, nomeCanonico)
        );
    }


    /*
     * ============================================================
     * CONVERSÃO DE UMA MAGIA
     * ============================================================
     */

    function converterMagia(magia, indice) {

        const novaMagia = {};

        /*
         * --------------------------------------------------------
         * CAMPOS PRINCIPAIS
         * --------------------------------------------------------
         */

        if (Object.prototype.hasOwnProperty.call(magia, "id")) {
            novaMagia.id = magia.id;
        } else {
            novaMagia.id = `magia-${indice + 1}`;
        }


        novaMagia.nome = magia.nome || magia["Nome da magia"] || "";


        novaMagia.dominio =
            magia.dominio ||
            magia["Dominio"] ||
            "";


        /*
         * "nivel" é a fonte de verdade.
         *
         * NÃO corrigimos nivel_nome automaticamente.
         */

        if (typeof magia.nivel === "number") {
            novaMagia.nivel = magia.nivel;

        } else if (
            typeof magia["Nivel necessário"] === "number"
        ) {

            novaMagia.nivel = magia["Nivel necessário"];

        } else {

            novaMagia.nivel = null;
        }


        if (
            Object.prototype.hasOwnProperty.call(
                magia,
                "nivel_nome"
            )
        ) {

            novaMagia.nivel_nome = magia.nivel_nome;

        } else {

            /*
             * Se não existe nivel_nome, podemos derivá-lo porque
             * isso não contradiz nenhuma informação existente.
             */

            novaMagia.nivel_nome =
                MAPA_NIVEIS[novaMagia.nivel] || "";
        }


        novaMagia.categoria =
            magia.categoria ||
            magia["Categoria"] ||
            "";


        novaMagia.efeito =
            magia.efeito ||
            magia["Efeito"] ||
            "";


        /*
         * --------------------------------------------------------
         * PARÂMETROS
         * --------------------------------------------------------
         */

        novaMagia.parametros = {};

        const parametrosOriginais =
            magia.parametros || {};


        for (
            const nomeOriginal of Object.keys(parametrosOriginais)
        ) {

            const nomeCanonico =
                normalizarNomeParametro(nomeOriginal);

            /*
             * Se houver, por exemplo:
             *
             * area
             * area_efeito
             *
             * os dois acabam apontando para area_efeito.
             *
             * Não apagamos silenciosamente informações:
             * caso isso aconteça, registramos no relatório.
             */

            if (
                Object.prototype.hasOwnProperty.call(
                    novaMagia.parametros,
                    nomeCanonico
                )
            ) {

                console.warn(
                    `[CONVERSOR] ${magia.nome}: ` +
                    `parâmetro duplicado após normalização: ` +
                    `"${nomeOriginal}" → "${nomeCanonico}". ` +
                    `Mantendo o parâmetro já convertido.`
                );

                continue;
            }


            novaMagia.parametros[nomeCanonico] =
                converterParametro(
                    nomeOriginal,
                    parametrosOriginais[nomeOriginal]
                );


            /*
             * Aviso para parâmetro que não pertence ao conjunto
             * canônico.
             *
             * Ele NÃO é descartado.
             */

            if (!PARAMETROS_CANONICOS.has(nomeCanonico)) {

                console.warn(
                    `[CONVERSOR] ${magia.nome}: ` +
                    `parâmetro não reconhecido: "${nomeOriginal}". ` +
                    `Mantido no JSON.`
                );
            }
        }


        /*
         * --------------------------------------------------------
         * PENALIDADE
         * --------------------------------------------------------
         *
         * Preservamos exatamente o valor existente.
         *
         * O conversor NÃO recalcula a penalidade.
         */

        if (
            typeof magia.penalidade === "number"
        ) {

            novaMagia.penalidade = magia.penalidade;

        } else {

            novaMagia.penalidade = 0;

            console.warn(
                `[CONVERSOR] ${magia.nome}: ` +
                `penalidade ausente ou inválida. ` +
                `Foi utilizado 0.`
            );
        }


        /*
         * --------------------------------------------------------
         * OBSERVAÇÃO
         * --------------------------------------------------------
         */

        if (
            Object.prototype.hasOwnProperty.call(
                magia,
                "observacao"
            )
        ) {

            novaMagia.observacao = magia.observacao;

        } else {

            novaMagia.observacao = "";
        }


        /*
         * --------------------------------------------------------
         * CAMPOS ANTIGOS FORA DA ESTRUTURA CANÔNICA
         * --------------------------------------------------------
         *
         * Não copiamos campos como:
         *
         * duracao
         * alcance_maximo
         *
         * porque eles não fazem parte da estrutura canônica.
         *
         * Mas registramos para revisão.
         */

        const CAMPOS_CONHECIDOS = new Set([
            "id",
            "nome",
            "Nome da magia",
            "dominio",
            "Dominio",
            "nivel",
            "Nivel necessário",
            "nivel_nome",
            "categoria",
            "Categoria",
            "efeito",
            "Efeito",
            "parametros",
            "penalidade",
            "observacao"
        ]);


        const camposExtras = Object.keys(magia)
            .filter(chave => !CAMPOS_CONHECIDOS.has(chave));


        if (camposExtras.length > 0) {

            console.warn(
                `[CONVERSOR] ${magia.nome}: ` +
                `campos antigos/extras não copiados:`,
                camposExtras
            );
        }


        return novaMagia;
    }


    /*
     * ============================================================
     * DOWNLOAD
     * ============================================================
     */

    function baixarJSON(dados, nomeArquivo) {

        const conteudo =
            JSON.stringify(dados, null, 2);

        const blob = new Blob(
            [conteudo],
            {
                type: "application/json;charset=utf-8"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download = nomeArquivo;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }


    /*
     * ============================================================
     * EXECUÇÃO
     * ============================================================
     */

    try {

        console.log(
            "========================================"
        );

        console.log(
            "CONVERSOR DO GRIMÓRIO"
        );

        console.log(
            "========================================"
        );


        const resposta =
            await fetch(URL_GRIMORIO);


        if (!resposta.ok) {

            throw new Error(
                `Não foi possível carregar ${URL_GRIMORIO}. ` +
                `HTTP ${resposta.status}`
            );
        }


        const grimorio =
            await resposta.json();


        if (!Array.isArray(grimorio)) {

            throw new Error(
                "O grimorio.json não contém um array de magias."
            );
        }


        console.log(
            `Magias encontradas: ${grimorio.length}`
        );


        /*
         * Conversão
         */

        const grimorioCanonico =
            grimorio.map(
                (magia, indice) =>
                    converterMagia(magia, indice)
            );


        /*
         * Verificação básica do resultado
         */

        let erros = 0;

        for (
            const magia of grimorioCanonico
        ) {

            if (!magia.id) {
                console.error(
                    "Magia sem ID:",
                    magia
                );
                erros++;
            }

            if (!magia.nome) {
                console.error(
                    "Magia sem nome:",
                    magia
                );
                erros++;
            }

            if (
                !magia.parametros ||
                typeof magia.parametros !== "object"
            ) {

                console.error(
                    `${magia.nome}: parâmetros inválidos.`
                );

                erros++;
            }


            /*
             * Verifica se todos os parâmetros agora são arrays.
             */

            for (
                const [nome, valor]
                of Object.entries(magia.parametros || {})
            ) {

                if (!Array.isArray(valor)) {

                    console.error(
                        `${magia.nome}: ` +
                        `parâmetro "${nome}" ` +
                        `não foi convertido para array.`
                    );

                    erros++;
                }


                /*
                 * Verifica estrutura dos itens.
                 */

                for (const item of valor) {

                    if (
                        !item ||
                        typeof item !== "object"
                    ) {

                        console.error(
                            `${magia.nome}: ` +
                            `item inválido em "${nome}".`
                        );

                        erros++;
                        continue;
                    }


                    if (
                        !Object.prototype.hasOwnProperty.call(
                            item,
                            "valor"
                        )
                    ) {

                        console.error(
                            `${magia.nome}: ` +
                            `"${nome}" possui item sem "valor".`
                        );

                        erros++;
                    }


                    if (
                        typeof item.modificador !== "number"
                    ) {

                        console.error(
                            `${magia.nome}: ` +
                            `"${nome}" possui modificador inválido.`
                        );

                        erros++;
                    }
                }
            }
        }


        /*
         * Relatório
         */

        console.log(
            "========================================"
        );

        console.log(
            "CONVERSÃO CONCLUÍDA"
        );

        console.log(
            "========================================"
        );

        console.log(
            `Magias convertidas: ${grimorioCanonico.length}`
        );

        console.log(
            `Erros estruturais: ${erros}`
        );


        if (erros > 0) {

            console.warn(
                "O arquivo será gerado mesmo assim, " +
                "mas existem problemas que precisam ser revisados."
            );

        } else {

            console.log(
                "Nenhum erro estrutural encontrado."
            );
        }


        /*
         * Disponibiliza também no console.
         */

        window.grimorioCanonico =
            grimorioCanonico;


        /*
         * Faz o download automaticamente.
         */

        baixarJSON(
            grimorioCanonico,
            NOME_ARQUIVO_SAIDA
        );


        console.log(
            `Arquivo gerado: ${NOME_ARQUIVO_SAIDA}`
        );

    } catch (erro) {

        console.error(
            "ERRO AO CONVERTER O GRIMÓRIO:",
            erro
        );
    }

});