document.addEventListener("DOMContentLoaded", async () => {

    const URL_GRIMORIO = "/regras/magia/grimorio.json";

    const NIVEIS_NOME = {
        1: "Percepção",
        2: "Influência",
        3: "Manipulação",
        4: "Transformação",
        5: "Domínio"
    };

    const PARAMETROS_VALIDOS = new Set([
        "alcance",
        "area_efeito",
        "duracao",
        "tempo_conjuracao",
        "atribulacao",
        "caracteristicas_alteradas",
        "conceder_bonus",
        "cura",
        "dano",
        "invocacao",
        "massa_volume",
        "metamorfose",
        "modificadores_ataque",
        "multiplos_alvos",
        "tamanho",
        "velocidade"
    ]);

    const PARAMETROS_OBRIGATORIOS = [
        "alcance",
        "duracao",
        "tempo_conjuracao"
    ];

    const NOMES_LEGADOS = {
        area: "area_efeito",
        caracteristicas: "caracteristicas_alteradas"
    };


    /*
     * ============================================================
     * CARREGAR JSON
     * ============================================================
     */

    let magias;

    try {

        const resposta = await fetch(URL_GRIMORIO);

        if (!resposta.ok) {
            throw new Error(
                `HTTP ${resposta.status}`
            );
        }

        magias = await resposta.json();

    } catch (erro) {

        console.error(
            "Não foi possível carregar o grimorio.json:",
            erro
        );

        return;
    }


    if (!Array.isArray(magias)) {

        console.error(
            "ERRO: o grimorio.json precisa conter um array de magias."
        );

        return;
    }


    /*
     * ============================================================
     * RESULTADO
     * ============================================================
     */

    const resultado = {
        total: magias.length,
        erros: [],
        avisos: [],
        antigas: [],
        novas: [],
        resumo: {
            parametrosObjeto: 0,
            parametrosArray: 0,
            nomesLegados: 0,
            parametrosObrigatoriosAusentes: 0,
            nivelNomeDivergente: 0
        }
    };


    /*
     * ============================================================
     * FUNÇÕES AUXILIARES
     * ============================================================
     */

    function adicionarErro(magia, mensagem) {

        resultado.erros.push({
            id: magia.id,
            nome: magia.nome,
            mensagem
        });

    }


    function adicionarAviso(magia, mensagem) {

        resultado.avisos.push({
            id: magia.id,
            nome: magia.nome,
            mensagem
        });

    }


    function verificarParametro(
        magia,
        nome,
        parametro
    ) {

        if (
            parametro === undefined ||
            parametro === null
        ) {
            return;
        }


        /*
         * Verifica se é array
         */
        if (Array.isArray(parametro)) {

            resultado.resumo.parametrosArray++;

        } else {

            resultado.resumo.parametrosObjeto++;

            adicionarAviso(
                magia,
                `O parâmetro "${nome}" ainda está como objeto e deverá ser convertido para array.`
            );
        }


        /*
         * Verifica itens
         */

        const itens =
            Array.isArray(parametro)
                ? parametro
                : [parametro];


        itens.forEach((item, indice) => {

            if (
                !item ||
                typeof item !== "object" ||
                Array.isArray(item)
            ) {

                adicionarErro(
                    magia,
                    `O item ${indice + 1} do parâmetro "${nome}" não é um objeto válido.`
                );

                return;
            }


            /*
             * Todo parâmetro canônico deve possuir valor.
             */
            if (
                item.valor === undefined
            ) {

                adicionarAviso(
                    magia,
                    `O item ${indice + 1} do parâmetro "${nome}" não possui "valor".`
                );

            }


            /*
             * Modificador deve ser numérico quando existir.
             */
            if (
                item.modificador !== undefined &&
                typeof item.modificador !== "number"
            ) {

                adicionarErro(
                    magia,
                    `O modificador do parâmetro "${nome}" deve ser numérico.`
                );

            }


            /*
             * detalhes, quando existir, deve ser objeto.
             */
            if (
                item.detalhes !== undefined &&
                (
                    typeof item.detalhes !== "object" ||
                    item.detalhes === null ||
                    Array.isArray(item.detalhes)
                )
            ) {

                adicionarErro(
                    magia,
                    `"detalhes" do parâmetro "${nome}" deve ser um objeto.`
                );

            }

        });

    }


    /*
     * ============================================================
     * VALIDAR CADA MAGIA
     * ============================================================
     */

    magias.forEach(magia => {

        const problemasAntes = resultado.avisos.length;


        /*
         * --------------------------------------------------------
         * CAMPOS PRINCIPAIS
         * --------------------------------------------------------
         */

        if (!magia.id) {
            adicionarErro(
                magia,
                'Campo "id" ausente.'
            );
        }

        if (!magia.nome) {
            adicionarErro(
                magia,
                'Campo "nome" ausente.'
            );
        }

        if (!magia.dominio) {
            adicionarErro(
                magia,
                'Campo "dominio" ausente.'
            );
        }

        if (magia.nivel === undefined) {

            adicionarErro(
                magia,
                'Campo "nivel" ausente.'
            );

        } else {

            const nivel =
                Number(magia.nivel);

            if (
                !NIVEIS_NOME[nivel]
            ) {

                adicionarErro(
                    magia,
                    `Nível "${magia.nivel}" não é válido.`
                );

            }

        }


        /*
         * --------------------------------------------------------
         * NIVEL × NIVEL_NOME
         * --------------------------------------------------------
         */

        if (
            magia.nivel !== undefined &&
            magia.nivel_nome !== undefined
        ) {

            const nivel =
                Number(magia.nivel);

            const nomeCorreto =
                NIVEIS_NOME[nivel];


            if (
                nomeCorreto &&
                magia.nivel_nome !== nomeCorreto
            ) {

                resultado.resumo.nivelNomeDivergente++;

                adicionarAviso(
                    magia,
                    `nivel_nome "${magia.nivel_nome}" não corresponde ao nível ${nivel}; o nome canônico seria "${nomeCorreto}".`
                );

            }

        }


        /*
         * --------------------------------------------------------
         * PARAMETROS
         * --------------------------------------------------------
         */

        if (
            !magia.parametros ||
            typeof magia.parametros !== "object"
        ) {

            adicionarErro(
                magia,
                'Campo "parametros" ausente ou inválido.'
            );

            return;
        }


        const nomesParametros =
            Object.keys(magia.parametros);


        /*
         * Detecta nomes antigos
         */

        nomesParametros.forEach(nome => {

            if (
                NOMES_LEGADOS[nome]
            ) {

                resultado.resumo.nomesLegados++;

                adicionarAviso(
                    magia,
                    `Parâmetro "${nome}" deve ser renomeado para "${NOMES_LEGADOS[nome]}".`
                );

            }

        });


        /*
         * Detecta parâmetros desconhecidos
         */

        nomesParametros.forEach(nome => {

            const nomeCanonico =
                NOMES_LEGADOS[nome] || nome;


            if (
                !PARAMETROS_VALIDOS.has(
                    nomeCanonico
                )
            ) {

                adicionarErro(
                    magia,
                    `Parâmetro desconhecido: "${nome}".`
                );

            }

        });


        /*
         * --------------------------------------------------------
         * PARÂMETROS OBRIGATÓRIOS
         * --------------------------------------------------------
         */

        PARAMETROS_OBRIGATORIOS.forEach(
            nomeObrigatorio => {

                const existe =
                    magia.parametros[
                        nomeObrigatorio
                    ] !== undefined;


                if (!existe) {

                    resultado.resumo
                        .parametrosObrigatoriosAusentes++;

                    adicionarAviso(
                        magia,
                        `Parâmetro obrigatório "${nomeObrigatorio}" está ausente dentro de "parametros".`
                    );

                }

            }
        );


        /*
         * --------------------------------------------------------
         * VALIDAR ESTRUTURA DOS PARÂMETROS
         * --------------------------------------------------------
         */

        nomesParametros.forEach(nome => {

            verificarParametro(
                magia,
                nome,
                magia.parametros[nome]
            );

        });


        /*
         * --------------------------------------------------------
         * PENALIDADE
         * --------------------------------------------------------
         */

        if (
            magia.penalidade === undefined
        ) {

            adicionarErro(
                magia,
                'Campo "penalidade" ausente.'
            );

        } else if (
            typeof magia.penalidade !== "number"
        ) {

            adicionarErro(
                magia,
                '"penalidade" deve ser numérica.'
            );

        }


        /*
         * --------------------------------------------------------
         * CLASSIFICA FORMATO
         * --------------------------------------------------------
         */

        const possuiEstruturaAntiga =
            nomesParametros.some(nome => {

                return (
                    !Array.isArray(
                        magia.parametros[nome]
                    ) ||
                    NOMES_LEGADOS[nome]
                );

            });


        if (possuiEstruturaAntiga) {

            resultado.antigas.push(magia);

        } else {

            resultado.novas.push(magia);

        }

    });


    /*
     * ============================================================
     * RELATÓRIO
     * ============================================================
     */

    console.group(
        "📖 VALIDADOR DO GRIMÓRIO"
    );


    console.log(
        `Total de magias: ${resultado.total}`
    );

    console.log(
        `Formato antigo/misto: ${resultado.antigas.length}`
    );

    console.log(
        `Formato novo: ${resultado.novas.length}`
    );


    console.log(
        "----------------------------------------"
    );


    console.log(
        "RESUMO DOS PARÂMETROS"
    );


    console.log(
        `Parâmetros como objeto: ${resultado.resumo.parametrosObjeto}`
    );

    console.log(
        `Parâmetros como array: ${resultado.resumo.parametrosArray}`
    );

    console.log(
        `Nomes legados encontrados: ${resultado.resumo.nomesLegados}`
    );

    console.log(
        `Parâmetros obrigatórios ausentes: ${resultado.resumo.parametrosObrigatoriosAusentes}`
    );

    console.log(
        `Divergências nível/nivel_nome: ${resultado.resumo.nivelNomeDivergente}`
    );


    console.log(
        "----------------------------------------"
    );


    /*
     * Erros
     */

    if (resultado.erros.length > 0) {

        console.group(
            `❌ ERROS (${resultado.erros.length})`
        );

        resultado.erros.forEach(item => {

            console.error(
                `[${item.id}] ${item.nome}: ${item.mensagem}`
            );

        });

        console.groupEnd();

    } else {

        console.log(
            "✅ Nenhum erro estrutural encontrado."
        );

    }


    /*
     * Avisos
     */

    if (resultado.avisos.length > 0) {

        console.group(
            `⚠️ AVISOS (${resultado.avisos.length})`
        );

        resultado.avisos.forEach(item => {

            console.warn(
                `[${item.id}] ${item.nome}: ${item.mensagem}`
            );

        });

        console.groupEnd();

    } else {

        console.log(
            "✅ Nenhum aviso."
        );

    }


    console.log(
        "----------------------------------------"
    );


    /*
     * Lista das magias antigas
     */

    console.group(
        `📦 MAGIAS QUE PRECISAM DE CONVERSÃO (${resultado.antigas.length})`
    );

    resultado.antigas.forEach(magia => {

        console.log(
            `${magia.id} — ${magia.nome}`
        );

    });

    console.groupEnd();


    /*
     * Lista das magias já novas
     */

    console.group(
        `✅ MAGIAS JÁ NO FORMATO NOVO (${resultado.novas.length})`
    );

    resultado.novas.forEach(magia => {

        console.log(
            `${magia.id} — ${magia.nome}`
        );

    });

    console.groupEnd();


    console.groupEnd();


    /*
     * Disponibiliza o resultado para inspeção
     * pelo console do navegador.
     */

    window.resultadoValidacaoGrimorio =
        resultado;


    console.log(
        "Resultado completo disponível em:",
        "resultadoValidacaoGrimorio"
    );

});