document.addEventListener("DOMContentLoaded", async () => {

    const container =
        document.getElementById("gerador-magias");

    if (!container) {
        return;
    }


    /* =========================================================
       CONFIGURAÇÃO
       ========================================================= */

    const URL_TABELAS =
        "/regras/magia/modificadores_tabelas.json";

    const URL_PROGRESSOES =
        "/regras/magia/progressoes_Regras.json";


    const NIVEIS = {
        1: "Percepção",
        2: "Influência",
        3: "Manipulação",
        4: "Transformação",
        5: "Domínio"
    };


    const DOMINIOS = [
        "Água",
        "Ar",
        "Artefatos",
        "Bestas",
        "Conhecimento",
        "Cura",
        "Destino",
        "Diabolismo",
        "Dimensão",
        "Escuridão",
        "Flora",
        "Fogo",
        "Gravidade",
        "Ilusão",
        "Luz",
        "Magia",
        "Mente",
        "Necromancia",
        "Sangue",
        "Som",
        "Terra"
    ];


    const CATEGORIAS = [
        "Truque",
        "Feitiço",
        "Ritual"
    ];


    const PARAMETROS = [
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
    ];


    const PARAMETROS_MULTIPLOS = [
        "atribulacao",
        "caracteristicas_alteradas",
        "conceder_bonus",
        "cura",
        "dano",
        "modificadores_ataque"
    ];


    const PARAMETROS_OBRIGATORIOS = [
        "alcance",
        "duracao",
        "tempo_conjuracao"
    ];


    const ALIASES_PARAMETROS = {
        area: "area_efeito",
        caracteristicas: "caracteristicas_alteradas",
        volume: "massa_volume"
    };


    /*
     * Nome exibido na interface.
     *
     * ATENÇÃO:
     * "conceder_bonus" continua sendo o nome interno.
     */
    const NOMES_PARAMETROS = {
        alcance: "Alcance",
        area_efeito: "Área de efeito",
        atribulacao: "Atribulação",
        caracteristicas_alteradas: "Características alteradas",
        conceder_bonus: "Conceder Bônus / Redutor",
        cura: "Cura",
        dano: "Dano",
        duracao: "Duração",
        invocacao: "Invocação Direta",
        massa_volume: "Massa / Volume do alvo",
        metamorfose: "Metamorfose",
        modificadores_ataque: "Modificadores de ataque",
        multiplos_alvos: "Múltiplos alvos",
        tamanho: "Tamanho",
        tempo_conjuracao: "Tempo de conjuração",
        velocidade: "Velocidade"
    };


    /*
     * Nome real das tabelas dentro de
     * modificadores_tabelas.json.
     *
     * Isso evita problemas quando o nome
     * exibido é diferente do nome da tabela.
     */
    const CHAVES_TABELAS = {
        alcance: "Alcance",
        area_efeito: "Área de efeito",
        atribulacao: "Atribulação",
        caracteristicas_alteradas: "Características alteradas",
        conceder_bonus: "Conceder Bônus ou Impor Redutores",
        cura: "Cura",
        dano: "Dano",
        duracao: "Duração",
        invocacao: "Invocação Direta",
        massa_volume: "Massa/Volume do alvo",
        metamorfose: "Metamorfose",
        modificadores_ataque: "Modificadores de ataque",
        multiplos_alvos: "Múltiplos Alvos",
        tamanho: "Tamanho",
        tempo_conjuracao: "Tempo de conjuração",
        velocidade: "Velocidade"
    };


    const CAMPOS_TOPO = [
        "id",
        "nome",
        "dominio",
        "nivel",
        "nivel_nome",
        "categoria",
        "efeito",
        "parametros",
        "penalidade",
        "observacao"
    ];


    /* =========================================================
       ESTADO
       ========================================================= */

    let magias = [];

    let indiceEdicao = null;

    let tabelas = {};

    let progressoes = {};

    let filtroLista = "";


    /* =========================================================
       UTILITÁRIOS
       ========================================================= */

    function escaparHTML(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function clone(obj) {

        return JSON.parse(
            JSON.stringify(obj)
        );
    }


    function gerarId() {

        return (
            "magia-" +
            Date.now().toString(36) +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
        );
    }


    function valorVazio(valor) {

        return (
            valor === undefined ||
            valor === null ||
            String(valor).trim() === ""
        );
    }


    function numero(valor, padrao = 0) {

        const n = Number(valor);

        return Number.isFinite(n)
            ? n
            : padrao;
    }


    function nomeParametro(nome) {

        return (
            NOMES_PARAMETROS[nome] ||
            nome
        );
    }


    function normalizarNomeParametro(nome) {

        return (
            ALIASES_PARAMETROS[nome] ||
            nome
        );
    }


    function escaparSeletor(valor) {

        if (
            window.CSS &&
            typeof CSS.escape === "function"
        ) {
            return CSS.escape(valor);
        }

        return String(valor).replace(
            /[^a-zA-Z0-9_-]/g,
            "\\$&"
        );
    }


    function formatarNumero(valor) {

        const n = Number(valor);

        if (!Number.isFinite(n)) {
            return String(valor ?? "—");
        }

        return Number.isInteger(n)
            ? String(n)
            : String(n).replace(".", ",");
    }


    function formatarModificador(modificador) {

        const n = Number(modificador);

        if (!Number.isFinite(n)) {
            return String(modificador ?? "—");
        }

        return n > 0
            ? `+${n}`
            : String(n);
    }


    function ceilDiv(valor, divisor) {

        return Math.ceil(
            Math.max(0, Number(valor)) /
            divisor
        );
    }


    /* =========================================================
       TABELAS
       ========================================================= */

    function obterTabela(nome) {

        const chave =
            CHAVES_TABELAS[nome];

        if (!chave) {
            return [];
        }

        const tabela =
            tabelas[chave];

        return Array.isArray(tabela)
            ? tabela
            : [];
    }


    /*
     * Alcance:
     *
     * A tabela base termina em 5 km / -20.
     * A progressão seguinte é fixa.
     */
    const ALCANCE_EXTRA = [
        ["7 km", -21],
        ["10 km", -22],
        ["15 km", -23],
        ["20 km", -24],
        ["30 km", -25],
        ["50 km", -26],
        ["100 km", -27],
        ["150 km", -28],
        ["200 km", -29],
        ["300 km", -30],
        ["500 km", -31],
        ["700 km", -32],
        ["1000 km", -33],
        ["1500 km", -34],
        ["2000 km", -35],
        ["3000 km", -36],
        ["5000 km", -37],
        ["7000 km", -38],
        ["10000 km", -39],
        ["15000 km", -40]
    ];


    /*
     * Área de efeito:
     *
     * A tabela base termina em 1 km / -20.
     */
    const AREA_EXTRA = [
        ["1,4 km", -21],
        ["2 km", -22],
        ["3 km", -23],
        ["4 km", -24],
        ["5 km", -25],
        ["7 km", -26],
        ["10 km", -27],
        ["14 km", -28],
        ["20 km", -29],
        ["30 km", -30],
        ["40 km", -31],
        ["50 km", -32],
        ["70 km", -33],
        ["100 km", -34],
        ["140 km", -35],
        ["200 km", -36],
        ["300 km", -37],
        ["400 km", -38],
        ["500 km", -39],
        ["700 km", -40]
    ];


    /*
     * Tempo de conjuração.
     *
     * É incorporado aqui para que o gerador
     * continue funcionando mesmo se a tabela
     * ainda estiver sem essa chave.
     */
    const TEMPO_CONJURACAO_PADRAO = [
        ["1 segundo", 0],
        ["2 segundos", 1],
        ["3 segundos", 2],
        ["5 segundos", 3],
        ["10 segundos", 4],
        ["30 segundos", 5],
        ["1 minuto", 6],
        ["2 minutos", 7],
        ["5 minutos", 8],
        ["10 minutos", 9],
        ["30 minutos", 10],
        ["1 hora", 11],
        ["3 horas", 12],
        ["6 horas", 13],
        ["12 horas", 14],
        ["24 horas", 15],
        ["3 dias", 16],
        ["5 dias", 17],
        ["10 dias", 18],
        ["20 dias", 19],
        ["1 mês", 20]
    ];


    function obterOpcoesParametro(nome) {

        /*
         * DANO é tratado de forma própria.
         * Não usamos a lista de d6 do JSON.
         */
        if (nome === "dano") {
            return [];
        }


        let tabela =
            obterTabela(nome);


        /*
         * Tempo de conjuração possui
         * fallback incorporado.
         */
        if (
            nome === "tempo_conjuracao" &&
            !tabela.length
        ) {

            tabela =
                TEMPO_CONJURACAO_PADRAO.map(
                    ([valor, modificador]) => ({
                        valor,
                        modificador
                    })
                );
        }


        const resultado =
            tabela.map(clone);


        /*
         * ALCANCE
         */
        if (nome === "alcance") {

            const valoresExistentes =
                new Set(
                    resultado.map(
                        item =>
                            String(item.valor)
                    )
                );


            ALCANCE_EXTRA.forEach(
                ([valor, modificador]) => {

                    if (
                        !valoresExistentes.has(
                            valor
                        )
                    ) {

                        resultado.push({
                            valor,
                            modificador
                        });
                    }
                }
            );
        }


        /*
         * ÁREA DE EFEITO
         */
        if (nome === "area_efeito") {

            const valoresExistentes =
                new Set(
                    resultado.map(
                        item =>
                            String(item.valor)
                    )
                );


            AREA_EXTRA.forEach(
                ([valor, modificador]) => {

                    if (
                        !valoresExistentes.has(
                            valor
                        )
                    ) {

                        resultado.push({
                            valor,
                            modificador
                        });
                    }
                }
            );
        }


        return resultado;
    }


    function encontrarOpcao(nome, valor) {

        return obterOpcoesParametro(nome)
            .find(
                opcao =>
                    String(opcao.valor) ===
                    String(valor)
            );
    }


    /* =========================================================
       NORMALIZAÇÃO
       ========================================================= */

    function normalizarItem(item) {

        if (
            !item ||
            typeof item !== "object" ||
            Array.isArray(item)
        ) {

            return {
                valor: "",
                modificador: 0
            };
        }


        const resultado = {

            valor:
                item.valor ??
                item.efeito ??
                item.descricao ??
                "",

            modificador:
                numero(
                    item.modificador,
                    0
                )
        };


        if (
            item.detalhes &&
            typeof item.detalhes ===
                "object" &&
            !Array.isArray(item.detalhes)
        ) {

            resultado.detalhes =
                clone(item.detalhes);
        }


        /*
         * Compatibilidade com estruturas
         * anteriores.
         */
        [
            "tipo",
            "direto",
            "quantidade",
            "pontos",
            "limite_racial",
            "base_metros",
            "quantidade_d6",
            "quantidade_ciclos",
            "unidade"
        ].forEach(campo => {

            if (
                item[campo] !== undefined
            ) {

                if (
                    !resultado.detalhes
                ) {
                    resultado.detalhes = {};
                }

                if (
                    resultado.detalhes[campo] ===
                    undefined
                ) {

                    resultado.detalhes[campo] =
                        item[campo];
                }
            }
        });


        /*
         * Compatibilidade especial para Dano.
         *
         * Se o valor antigo era "10d6",
         * transformamos em quantidade_d6.
         */
        if (
            resultado.valor !== undefined &&
            typeof resultado.valor === "string"
        ) {

            const match =
                resultado.valor.match(
                    /^(\d+)\s*d6$/i
                );

            if (match) {

                if (
                    !resultado.detalhes
                ) {
                    resultado.detalhes = {};
                }

                if (
                    resultado.detalhes
                        .quantidade_d6 ===
                    undefined
                ) {

                    resultado.detalhes
                        .quantidade_d6 =
                        Number(match[1]);
                }
            }
        }


        return resultado;
    }


    function normalizarParametro(valor) {

        if (
            valor === undefined ||
            valor === null
        ) {
            return undefined;
        }


        if (Array.isArray(valor)) {

            return valor.map(
                normalizarItem
            );
        }


        return [
            normalizarItem(valor)
        ];
    }


    function normalizarMagia(magia) {

        const resultado = {

            id:
                magia?.id ||
                gerarId(),

            nome:
                magia?.nome ||
                "",

            dominio:
                magia?.dominio ||
                "",

            nivel:
                magia?.nivel !== undefined &&
                magia?.nivel !== ""
                    ? numero(
                        magia.nivel,
                        ""
                    )
                    : "",

            nivel_nome:
                magia?.nivel_nome ||
                "",

            categoria:
                magia?.categoria ||
                "",

            efeito:
                magia?.efeito ||
                "",

            parametros: {},

            penalidade:
                numero(
                    magia?.penalidade,
                    0
                ),

            observacao:
                magia?.observacao ||
                ""
        };


        const originais =
            magia?.parametros &&
            typeof magia.parametros ===
                "object" &&
            !Array.isArray(
                magia.parametros
            )
                ? magia.parametros
                : {};


        Object.keys(originais)
            .forEach(nome => {

                const canonico =
                    normalizarNomeParametro(
                        nome
                    );


                if (
                    !PARAMETROS.includes(
                        canonico
                    )
                ) {
                    return;
                }


                if (
                    Object.hasOwn(
                        resultado.parametros,
                        canonico
                    )
                ) {
                    return;
                }


                const parametro =
                    normalizarParametro(
                        originais[nome]
                    );


                if (
                    parametro !== undefined
                ) {

                    resultado.parametros[
                        canonico
                    ] = parametro;
                }
            });


        return resultado;
    }


    function criarMagiaVazia() {

        return {

            id:
                gerarId(),

            nome:
                "",

            dominio:
                "",

            nivel:
                1,

            nivel_nome:
                NIVEIS[1],

            categoria:
                "Truque",

            efeito:
                "",

            parametros:
                {},

            penalidade:
                0,

            observacao:
                ""
        };
    }


    /* =========================================================
       CÁLCULO DOS MODIFICADORES
       ========================================================= */

    function calcularModificadorItem(
        nome,
        item
    ) {

        if (!item) {
            return null;
        }


        const detalhes =
            item.detalhes || {};


        /*
         * -----------------------------------------------------
         * DANO
         * -----------------------------------------------------
         *
         * Cada d6 = -1.
         */
        if (nome === "dano") {

            let quantidade =
                detalhes.quantidade_d6;


            if (
                quantidade ===
                    undefined &&
                typeof item.valor ===
                    "number"
            ) {
                quantidade =
                    item.valor;
            }


            if (
                quantidade ===
                    undefined &&
                typeof item.valor ===
                    "string"
            ) {

                const match =
                    item.valor.match(
                        /^(\d+)\s*d6$/i
                    );

                if (match) {
                    quantidade =
                        Number(match[1]);
                }
            }


            if (
                quantidade ===
                    undefined ||
                quantidade === ""
            ) {
                return null;
            }


            quantidade =
                Number(quantidade);


            if (
                !Number.isFinite(
                    quantidade
                ) ||
                quantidade < 0
            ) {
                return null;
            }


            return -Math.ceil(
                quantidade
            );
        }


        /*
         * -----------------------------------------------------
         * CARACTERÍSTICAS ALTERADAS
         * -----------------------------------------------------
         *
         * Cada 5 pontos = -1.
         *
         * A partir do limite racial,
         * cada passo adicional vale o dobro.
         */
        if (
            nome ===
            "caracteristicas_alteradas"
        ) {

            const pontos =
                Number(
                    detalhes.pontos
                );


            if (
                !Number.isFinite(
                    pontos
                )
            ) {
                return null;
            }


            if (pontos <= 0) {
                return 0;
            }


            const limite =
                Number(
                    detalhes.limite_racial
                );


            /*
             * Sem limite racial informado:
             * progressão normal.
             */
            if (
                !Number.isFinite(
                    limite
                )
            ) {

                return -
                    Math.ceil(
                        pontos / 5
                    );
            }


            if (
                pontos <= limite
            ) {

                return -
                    Math.ceil(
                        pontos / 5
                    );
            }


            const antes =
                Math.ceil(
                    limite / 5
                );


            const depois =
                Math.ceil(
                    (pontos - limite) / 5
                );


            return -(
                antes +
                depois * 2
            );
        }


        /*
         * -----------------------------------------------------
         * CURA
         * -----------------------------------------------------
         */
        if (nome === "cura") {

            const opcao =
                encontrarOpcao(
                    nome,
                    item.valor
                );


            if (!opcao) {
                return null;
            }


            const texto =
                String(
                    opcao.modificador ??
                    ""
                );


            /*
             * Vitalidade: Recuperar PV
             *
             * Cada d6 = -1.
             */
            if (
                texto.includes(
                    "1d6 PV"
                ) ||
                String(item.valor)
                    .toLowerCase()
                    .includes(
                        "vitalidade: recuperar pv"
                    )
            ) {

                const quantidade =
                    Number(
                        detalhes.pv_d6 ??
                        detalhes.quantidade
                    );


                if (
                    !Number.isFinite(
                        quantidade
                    )
                ) {
                    return null;
                }


                return -
                    Math.ceil(
                        Math.max(
                            0,
                            quantidade
                        )
                    );
            }


            /*
             * Fadiga: Recuperar PF
             *
             * Cada 2 PF = -1,
             * arredondando para cima.
             */
            if (
                texto.includes(
                    "2 PF"
                ) ||
                String(item.valor)
                    .toLowerCase()
                    .includes(
                        "fadiga: recuperar pf"
                    )
            ) {

                const quantidade =
                    Number(
                        detalhes.qtd_pf ??
                        detalhes.quantidade
                    );


                if (
                    !Number.isFinite(
                        quantidade
                    )
                ) {
                    return null;
                }


                return -
                    Math.ceil(
                        Math.max(
                            0,
                            quantidade
                        ) / 2
                    );
            }


            if (
                typeof opcao.modificador ===
                "number"
            ) {
                return opcao.modificador;
            }


            return null;
        }


        /*
         * -----------------------------------------------------
         * MODIFICADORES DE ATAQUE
         * -----------------------------------------------------
         *
         * Cíclico:
         * modificador por ciclo × quantidade.
         */
        if (
            nome ===
            "modificadores_ataque"
        ) {

            const opcao =
                encontrarOpcao(
                    nome,
                    item.valor
                );


            if (!opcao) {
                return null;
            }


            const texto =
                String(
                    opcao.modificador ??
                    ""
                );


            if (
                texto
                    .toLowerCase()
                    .includes("ciclo")
            ) {

                const match =
                    texto.match(
                        /(-\d+)\s*\/\s*ciclo/i
                    );


                if (!match) {
                    return null;
                }


                const porCiclo =
                    Number(match[1]);


                const ciclos =
                    Number(
                        detalhes.quantidade_ciclos ??
                        detalhes.quantidade
                    );


                if (
                    !Number.isFinite(
                        ciclos
                    )
                ) {
                    return null;
                }


                return (
                    porCiclo *
                    Math.max(
                        0,
                        ciclos
                    )
                );
            }


            if (
                typeof opcao.modificador ===
                "number"
            ) {
                return opcao.modificador;
            }


            return null;
        }


        /*
         * -----------------------------------------------------
         * DEMAIS PARÂMETROS
         * -----------------------------------------------------
         */
        const opcao =
            encontrarOpcao(
                nome,
                item.valor
            );


        if (!opcao) {
            return null;
        }


        if (
            typeof opcao.modificador ===
            "number"
        ) {
            return opcao.modificador;
        }


        return null;
    }


    function calcularPenalidade(magia) {

        let total = 0;


        const parametros =
            magia?.parametros || {};


        Object.values(parametros)
            .forEach(lista => {

                if (
                    !Array.isArray(lista)
                ) {
                    return;
                }


                lista.forEach(item => {

                    const modificador =
                        Number(
                            item?.modificador
                        );


                    if (
                        Number.isFinite(
                            modificador
                        )
                    ) {

                        total +=
                            modificador;
                    }
                });
            });


        /*
         * A penalidade nunca pode
         * ser positiva.
         */
        return Math.min(
            total,
            0
        );
    }


    function recalcularItens(magia) {

        let alterados = 0;


        Object.entries(
            magia.parametros || {}
        ).forEach(
            ([nome, lista]) => {

                if (
                    !Array.isArray(lista)
                ) {
                    return;
                }


                lista.forEach(item => {

                    const calculado =
                        calcularModificadorItem(
                            nome,
                            item
                        );


                    if (
                        calculado !== null &&
                        calculado !==
                            numero(
                                item.modificador,
                                0
                            )
                    ) {

                        item.modificador =
                            calculado;

                        alterados++;
                    }
                });
            }
        );


        return alterados;
    }


    function calcularPMMinimo(magia) {

        const nivel =
            Number(
                magia?.nivel
            );


        return (
            Number.isInteger(nivel) &&
            nivel >= 1 &&
            nivel <= 5
        )
            ? nivel
            : "—";
    }


    /* =========================================================
       VALIDAÇÃO
       ========================================================= */

    function validarMagia(magia) {

        const resultado = {

            erros: [],

            avisos: [],

            campos: [],

            penalidadeCalculada:
                calcularPenalidade(
                    magia
                )
        };


        /*
         * Nome
         */
        if (
            valorVazio(
                magia.nome
            )
        ) {

            resultado.erros.push(
                "Nome da magia não informado."
            );

            resultado.campos.push({
                tipo: "erro",
                seletor: "#gm-nome"
            });
        }


        /*
         * Domínio
         */
        if (
            !DOMINIOS.includes(
                magia.dominio
            )
        ) {

            resultado.erros.push(
                "Domínio inválido ou não informado."
            );

            resultado.campos.push({
                tipo: "erro",
                seletor: "#gm-dominio"
            });
        }


        /*
         * Nível
         */
        const nivel =
            Number(
                magia.nivel
            );


        if (
            !Number.isInteger(nivel) ||
            !NIVEIS[nivel]
        ) {

            resultado.erros.push(
                "Nível inválido. O nível deve estar entre 1 e 5."
            );

            resultado.campos.push({
                tipo: "erro",
                seletor: "#gm-nivel"
            });

        } else if (
            magia.nivel_nome !==
            NIVEIS[nivel]
        ) {

            resultado.avisos.push(
                `O nível ${nivel} corresponde a "${NIVEIS[nivel]}", mas nivel_nome está como "${magia.nivel_nome || "(vazio)"}".`
            );

            resultado.campos.push({
                tipo: "aviso",
                seletor: "#gm-nivel-nome"
            });
        }


        /*
         * Categoria
         */
        if (
            !CATEGORIAS.includes(
                magia.categoria
            )
        ) {

            resultado.erros.push(
                "Categoria inválida ou não informada."
            );

            resultado.campos.push({
                tipo: "erro",
                seletor: "#gm-categoria"
            });
        }


        /*
         * Efeito
         */
        if (
            valorVazio(
                magia.efeito
            )
        ) {

            resultado.avisos.push(
                "A magia não possui descrição de efeito."
            );

            resultado.campos.push({
                tipo: "aviso",
                seletor: "#gm-efeito"
            });
        }


        /*
         * Parâmetros obrigatórios
         */
        PARAMETROS_OBRIGATORIOS
            .forEach(nome => {

                const lista =
                    magia.parametros?.[
                        nome
                    ];


                if (
                    lista === undefined
                ) {

                    resultado.erros.push(
                        `Parâmetro obrigatório ausente: ${nomeParametro(nome)}.`
                    );

                    return;
                }


                if (
                    !Array.isArray(lista)
                ) {

                    resultado.erros.push(
                        `O parâmetro "${nomeParametro(nome)}" deve ser um array.`
                    );

                    return;
                }


                if (
                    lista.length !== 1
                ) {

                    resultado.erros.push(
                        `O parâmetro obrigatório "${nomeParametro(nome)}" deve possuir exatamente um item.`
                    );
                }


                lista.forEach(
                    (item, indice) =>
                        validarItemParametro(
                            nome,
                            item,
                            indice,
                            resultado
                        )
                );
            });


        /*
         * Todos os parâmetros presentes
         */
        Object.keys(
            magia.parametros || {}
        ).forEach(nome => {

            if (
                !PARAMETROS.includes(
                    nome
                )
            ) {

                resultado.avisos.push(
                    `Parâmetro desconhecido: "${nome}".`
                );

                return;
            }


            const lista =
                magia.parametros[nome];


            if (
                !Array.isArray(lista)
            ) {

                resultado.erros.push(
                    `O parâmetro "${nomeParametro(nome)}" deve ser um array.`
                );

                return;
            }


            if (
                lista.length === 0
            ) {

                resultado.avisos.push(
                    `O parâmetro "${nomeParametro(nome)}" está vazio; ele será omitido na exportação.`
                );
            }


            lista.forEach(
                (item, indice) =>
                    validarItemParametro(
                        nome,
                        item,
                        indice,
                        resultado
                    )
            );
        });


        /*
         * Penalidade armazenada × calculada
         */
        if (
            numero(
                magia.penalidade
            ) !==
            resultado.penalidadeCalculada
        ) {

            resultado.avisos.push(
                `A penalidade armazenada (${magia.penalidade}) é diferente da penalidade calculada (${resultado.penalidadeCalculada}).`
            );
        }


        return resultado;
    }


    function validarItemParametro(
        nome,
        item,
        indice,
        resultado
    ) {

        const caminho =
            `${nomeParametro(nome)} — item ${indice + 1}`;


        const seletor =
            `[data-item-parametro="${escaparSeletor(nome)}"][data-indice="${indice}"]`;


        if (
            !item ||
            typeof item !== "object" ||
            Array.isArray(item)
        ) {

            resultado.erros.push(
                `${caminho}: item inválido.`
            );

            return;
        }


        /*
         * Dano usa quantidade_d6
         * como dado principal.
         */
        if (nome === "dano") {

            const quantidade =
                Number(
                    item?.detalhes
                        ?.quantidade_d6
                );


            if (
                !Number.isFinite(
                    quantidade
                ) ||
                quantidade < 1
            ) {

                resultado.erros.push(
                    `${caminho}: quantidade de d6 não informada.`
                );

                resultado.campos.push({
                    tipo: "erro",
                    seletor:
                        `${seletor} [data-detalhe="quantidade_d6"]`
                });
            }


        } else if (
            nome ===
            "caracteristicas_alteradas"
        ) {

            const pontos =
                Number(
                    item?.detalhes?.pontos
                );


            if (
                !Number.isFinite(
                    pontos
                ) ||
                pontos < 1
            ) {

                resultado.erros.push(
                    `${caminho}: Pontos não informados.`
                );

                resultado.campos.push({
                    tipo: "erro",
                    seletor:
                        `${seletor} [data-detalhe="pontos"]`
                });
            }


            if (
                valorVazio(
                    item?.detalhes
                        ?.alvo
                )
            ) {

                resultado.avisos.push(
                    `${caminho}: informe o atributo, vantagem ou desvantagem afetado.`
                );

                resultado.campos.push({
                    tipo: "aviso",
                    seletor:
                        `${seletor} [data-detalhe="alvo"]`
                });
            }


        } else if (
            nome === "cura"
        ) {

            const opcao =
                encontrarOpcao(
                    nome,
                    item.valor
                );


            if (!opcao) {

                if (
                    valorVazio(
                        item.valor
                    )
                ) {

                    resultado.erros.push(
                        `${caminho}: valor não informado.`
                    );

                    resultado.campos.push({
                        tipo: "erro",
                        seletor:
                            `${seletor} [data-campo="valor"]`
                    });
                }

            } else {

                const texto =
                    String(
                        opcao.modificador ??
                        ""
                    );


                if (
                    texto.includes(
                        "2 PF"
                    )
                ) {

                    const pf =
                        Number(
                            item.detalhes
                                ?.qtd_pf
                        );


                    if (
                        !Number.isFinite(
                            pf
                        ) ||
                        pf < 1
                    ) {

                        resultado.erros.push(
                            `${caminho}: Qtd PF não informada.`
                        );

                        resultado.campos.push({
                            tipo: "erro",
                            seletor:
                                `${seletor} [data-detalhe="qtd_pf"]`
                        });
                    }


                } else if (
                    texto.includes(
                        "1d6 PV"
                    )
                ) {

                    const d6 =
                        Number(
                            item.detalhes
                                ?.pv_d6
                        );


                    if (
                        !Number.isFinite(
                            d6
                        ) ||
                        d6 < 1
                    ) {

                        resultado.erros.push(
                            `${caminho}: PV (d6) não informado.`
                        );

                        resultado.campos.push({
                            tipo: "erro",
                            seletor:
                                `${seletor} [data-detalhe="pv_d6"]`
                        });
                    }
                }
            }


        } else if (
            nome ===
            "modificadores_ataque"
        ) {

            const opcao =
                encontrarOpcao(
                    nome,
                    item.valor
                );


            if (opcao) {

                const texto =
                    String(
                        opcao.modificador ??
                        ""
                    );


                if (
                    texto
                        .toLowerCase()
                        .includes("ciclo")
                ) {

                    const ciclos =
                        Number(
                            item.detalhes
                                ?.quantidade_ciclos
                        );


                    if (
                        !Number.isFinite(
                            ciclos
                        ) ||
                        ciclos < 1
                    ) {

                        resultado.erros.push(
                            `${caminho}: quantidade de ciclos não informada.`
                        );

                        resultado.campos.push({
                            tipo: "erro",
                            seletor:
                                `${seletor} [data-detalhe="quantidade_ciclos"]`
                        });
                    }
                }
            }
        }


        /*
         * Valor normal
         */
        if (
            nome !== "dano" &&
            valorVazio(
                item.valor
            )
        ) {

            resultado.erros.push(
                `${caminho}: valor não informado.`
            );

            resultado.campos.push({
                tipo: "erro",
                seletor:
                    `${seletor} [data-campo="valor"]`
            });
        }


        /*
         * Modificador
         */
        if (
            !Number.isFinite(
                Number(
                    item.modificador
                )
            )
        ) {

            resultado.erros.push(
                `${caminho}: modificador inválido.`
            );

            resultado.campos.push({
                tipo: "erro",
                seletor:
                    `${seletor} [data-campo="modificador"]`
            });
        }


        const calculado =
            calcularModificadorItem(
                nome,
                item
            );


        if (
            calculado === null
        ) {

            if (
                nome !== "dano" &&
                !valorVazio(
                    item.valor
                )
            ) {

                resultado.avisos.push(
                    `${caminho}: o valor não foi encontrado na tabela ou exige detalhes adicionais para calcular o modificador.`
                );
            }


        } else if (
            numero(
                item.modificador
            ) !== calculado
        ) {

            resultado.avisos.push(
                `${caminho}: modificador informado (${item.modificador}) difere do modificador calculado (${calculado}).`
            );

            resultado.campos.push({
                tipo: "aviso",
                seletor:
                    `${seletor} [data-campo="modificador"]`
            });
        }
    }


    /* =========================================================
       INTERFACE PRINCIPAL
       ========================================================= */

    function renderizar() {

        container.innerHTML = `

            <div class="gm-cabecalho">

                <div>

                    <h2>
                        Gerador de Magias
                    </h2>

                    <p class="gm-subtitulo">
                        Crie, edite, valide, importe e exporte magias.
                    </p>

                </div>


                <div class="gm-acoes-principais">

                    <button
                        type="button"
                        class="gm-btn gm-btn-secundario"
                        id="gm-importar"
                    >
                        Importar JSON
                    </button>


                    <button
                        type="button"
                        class="gm-btn gm-btn-primario"
                        id="gm-nova-magia"
                    >
                        + Nova magia
                    </button>


                    <button
                        type="button"
                        class="gm-btn gm-btn-exportar"
                        id="gm-exportar"
                    >
                        Exportar JSON
                    </button>

                </div>


                <input
                    type="file"
                    id="gm-input-arquivo"
                    accept=".json,application/json"
                    hidden
                >

            </div>


            <div
                id="gm-status"
                class="gm-status"
                role="status"
                aria-live="polite"
            ></div>


            <div class="gm-layout">

                <aside
                    class="gm-lista"
                    aria-label="Lista de magias"
                >

                    <div class="gm-lista-cabecalho">

                        <strong>
                            Magias em edição
                        </strong>

                        <span
                            id="gm-contador"
                            class="gm-contador"
                        >
                            0
                        </span>

                    </div>


                    <div class="gm-filtro-lista">

                        <label
                            for="gm-busca"
                            class="gm-label"
                        >
                            Pesquisar
                        </label>

                        <input
                            type="search"
                            id="gm-busca"
                            class="gm-input"
                            placeholder="Nome, domínio ou nível..."
                            autocomplete="off"
                        >

                    </div>


                    <div id="gm-lista-magias"></div>

                </aside>


                <main
                    id="gm-editor"
                    class="gm-editor"
                ></main>

            </div>
        `;


        configurarEventos();

        renderizarLista();

        renderizarEditor();
    }


    function configurarEventos() {

        document
            .getElementById(
                "gm-importar"
            )
            ?.addEventListener(
                "click",
                () =>
                    document
                        .getElementById(
                            "gm-input-arquivo"
                        )
                        ?.click()
            );


        document
            .getElementById(
                "gm-input-arquivo"
            )
            ?.addEventListener(
                "change",
                importarArquivo
            );


        document
            .getElementById(
                "gm-nova-magia"
            )
            ?.addEventListener(
                "click",
                novaMagia
            );


        document
            .getElementById(
                "gm-exportar"
            )
            ?.addEventListener(
                "click",
                exportarJSON
            );


        document
            .getElementById(
                "gm-busca"
            )
            ?.addEventListener(
                "input",
                evento => {

                    filtroLista =
                        evento.target.value ||
                        "";

                    renderizarLista();
                }
            );
    }


    /* =========================================================
       LISTA
       ========================================================= */

    function renderizarLista() {

        const lista =
            document.getElementById(
                "gm-lista-magias"
            );


        const contador =
            document.getElementById(
                "gm-contador"
            );


        if (
            !lista ||
            !contador
        ) {
            return;
        }


        const termo =
            filtroLista
                .trim()
                .toLocaleLowerCase(
                    "pt-BR"
                );


        const indices =
            magias
                .map(
                    (magia, indice) => ({
                        magia,
                        indice
                    })
                )
                .filter(
                    ({ magia }) => {

                        if (!termo) {
                            return true;
                        }


                        const texto =
                            `${magia.nome} ${magia.dominio} ${magia.nivel} ${magia.categoria}`
                                .toLocaleLowerCase(
                                    "pt-BR"
                                );


                        return texto.includes(
                            termo
                        );
                    }
                );


        contador.textContent =
            termo
                ? `${indices.length}/${magias.length}`
                : magias.length;


        if (
            !indices.length
        ) {

            lista.innerHTML = `

                <div class="gm-lista-vazia">

                    ${
                        magias.length
                            ? "Nenhuma magia corresponde à pesquisa."
                            : "Nenhuma magia criada ou importada."
                    }

                </div>
            `;

            return;
        }


        lista.innerHTML =
            indices
                .map(
                    ({
                        magia,
                        indice
                    }) => {

                        const validacao =
                            validarMagia(
                                magia
                            );


                        const possuiErro =
                            validacao.erros.length >
                            0;


                        const possuiAviso =
                            !possuiErro &&
                            validacao.avisos.length >
                            0;


                        return `

                            <button
                                type="button"
                                class="gm-item-magia
                                    ${
                                        indice === indiceEdicao
                                            ? "gm-item-selecionada"
                                            : ""
                                    }
                                    ${
                                        possuiErro
                                            ? "gm-item-erro"
                                            : possuiAviso
                                                ? "gm-item-aviso"
                                                : "gm-item-ok"
                                    }"
                                data-indice="${indice}"
                            >

                                <span
                                    class="gm-item-simbolo"
                                    aria-hidden="true"
                                >
                                    ${
                                        possuiErro
                                            ? "!"
                                            : possuiAviso
                                                ? "⚠"
                                                : "✓"
                                    }
                                </span>


                                <span class="gm-item-conteudo">

                                    <strong>
                                        ${
                                            escaparHTML(
                                                magia.nome ||
                                                "(sem nome)"
                                            )
                                        }
                                    </strong>


                                    <small>
                                        ${
                                            escaparHTML(
                                                magia.dominio ||
                                                "Sem domínio"
                                            )
                                        }
                                        · Nível
                                        ${
                                            escaparHTML(
                                                magia.nivel
                                            )
                                        }
                                        ·
                                        ${
                                            escaparHTML(
                                                magia.categoria ||
                                                "Sem categoria"
                                            )
                                        }
                                    </small>

                                </span>

                            </button>
                        `;
                    }
                )
                .join("");


        lista
            .querySelectorAll(
                ".gm-item-magia"
            )
            .forEach(
                botao => {

                    botao.addEventListener(
                        "click",
                        () => {

                            if (
                                indiceEdicao !== null
                            ) {
                                atualizarMagiaDoFormulario();
                            }


                            indiceEdicao =
                                Number(
                                    botao.dataset.indice
                                );


                            renderizarLista();

                            renderizarEditor();
                        }
                    );
                }
            );
    }


    /* =========================================================
       EDITOR
       ========================================================= */

    function renderizarEditor() {

        const editor =
            document.getElementById(
                "gm-editor"
            );


        if (!editor) {
            return;
        }


        if (
            indiceEdicao === null
        ) {

            editor.innerHTML = `

                <div class="gm-editor-vazio">

                    <h2>
                        Gerador de Magias
                    </h2>

                    <p>
                        Crie uma nova magia ou importe um JSON
                        quando quiser continuar um trabalho anterior.
                    </p>


                    <button
                        type="button"
                        class="gm-btn gm-btn-primario"
                        id="gm-nova-vazia"
                    >
                        + Nova magia
                    </button>

                </div>
            `;


            document
                .getElementById(
                    "gm-nova-vazia"
                )
                ?.addEventListener(
                    "click",
                    novaMagia
                );


            return;
        }


        const magia =
            magias[indiceEdicao];


        if (!magia) {

            indiceEdicao =
                null;

            renderizarEditor();

            return;
        }


        editor.innerHTML = `

            <div class="gm-editor-cabecalho">

                <div>

                    <h2>
                        ${
                            escaparHTML(
                                magia.nome ||
                                "Nova magia"
                            )
                        }
                    </h2>


                    <div
                        id="gm-status-magia"
                        class="gm-status-magia"
                        role="status"
                        aria-live="polite"
                    ></div>

                </div>


                <div class="gm-acoes-editor">

                    <button
                        type="button"
                        class="gm-btn gm-btn-primario"
                        id="gm-salvar"
                    >
                        Salvar alterações
                    </button>


                    <button
                        type="button"
                        class="gm-btn gm-btn-secundario"
                        id="gm-aplicar-penalidade"
                    >
                        Aplicar penalidade calculada
                    </button>


                    <button
                        type="button"
                        class="gm-btn gm-btn-perigo"
                        id="gm-duplicar"
                    >
                        Duplicar
                    </button>


                    <button
                        type="button"
                        class="gm-btn gm-btn-perigo"
                        id="gm-excluir"
                    >
                        Excluir
                    </button>

                </div>

            </div>


            <div class="gm-form">

                ${renderizarDadosBasicos(magia)}

                ${renderizarResumo(magia)}

                ${renderizarParametros(magia)}


                <section class="gm-secao">

                    <label
                        for="gm-observacao"
                        class="gm-label"
                    >
                        Observação
                    </label>


                    <textarea
                        id="gm-observacao"
                        class="gm-input gm-textarea"
                        rows="4"
                        placeholder="Observações internas..."
                    >${
                        escaparHTML(
                            magia.observacao
                        )
                    }</textarea>

                </section>


                <section
                    id="gm-validacao"
                    class="gm-validacao"
                ></section>

            </div>
        `;


        configurarEventosEditor();

        renderizarValidacao();
    }


    /* =========================================================
       DADOS BÁSICOS
       ========================================================= */

    function renderizarDadosBasicos(
        magia
    ) {

        return `

            <section class="gm-secao">

                <h3>
                    Dados básicos
                </h3>


                <div class="gm-grid">

                    <div
                        class="gm-campo gm-campo-largo"
                    >

                        <label
                            for="gm-nome"
                            class="gm-label"
                        >
                            Nome
                        </label>


                        <input
                            type="text"
                            id="gm-nome"
                            class="gm-input"
                            value="${
                                escaparHTML(
                                    magia.nome
                                )
                            }"
                            autocomplete="off"
                        >

                    </div>


                    <div class="gm-campo">

                        <label
                            for="gm-dominio"
                            class="gm-label"
                        >
                            Domínio
                        </label>


                        <select
                            id="gm-dominio"
                            class="gm-input"
                        >

                            <option value="">
                                Selecione...
                            </option>

                            ${
                                DOMINIOS
                                    .map(
                                        dominio => `

                                            <option
                                                value="${escaparHTML(dominio)}"
                                                ${
                                                    magia.dominio ===
                                                    dominio
                                                        ? "selected"
                                                        : ""
                                                }
                                            >
                                                ${
                                                    escaparHTML(
                                                        dominio
                                                    )
                                                }
                                            </option>
                                        `
                                    )
                                    .join("")
                            }

                        </select>

                    </div>


                    <div class="gm-campo">

                        <label
                            for="gm-nivel"
                            class="gm-label"
                        >
                            Nível
                        </label>


                        <select
                            id="gm-nivel"
                            class="gm-input"
                        >

                            ${
                                Object.entries(
                                    NIVEIS
                                )
                                    .map(
                                        ([
                                            nivel,
                                            nome
                                        ]) => `

                                            <option
                                                value="${nivel}"
                                                ${
                                                    Number(
                                                        magia.nivel
                                                    ) ===
                                                    Number(
                                                        nivel
                                                    )
                                                        ? "selected"
                                                        : ""
                                                }
                                            >
                                                ${nivel}
                                                —
                                                ${
                                                    escaparHTML(
                                                        nome
                                                    )
                                                }
                                            </option>
                                        `
                                    )
                                    .join("")
                            }

                        </select>

                    </div>


                    <div class="gm-campo">

                        <label
                            for="gm-nivel-nome"
                            class="gm-label"
                        >
                            Nome do nível
                        </label>


                        <input
                            type="text"
                            id="gm-nivel-nome"
                            class="gm-input"
                            value="${
                                escaparHTML(
                                    magia.nivel_nome
                                )
                            }"
                        >

                    </div>


                    <div class="gm-campo">

                        <label
                            for="gm-categoria"
                            class="gm-label"
                        >
                            Categoria
                        </label>


                        <select
                            id="gm-categoria"
                            class="gm-input"
                        >

                            ${
                                CATEGORIAS
                                    .map(
                                        categoria => `

                                            <option
                                                value="${escaparHTML(categoria)}"
                                                ${
                                                    magia.categoria ===
                                                    categoria
                                                        ? "selected"
                                                        : ""
                                                }
                                            >
                                                ${
                                                    escaparHTML(
                                                        categoria
                                                    )
                                                }
                                            </option>
                                        `
                                    )
                                    .join("")
                            }

                        </select>

                    </div>

                </div>


                <div class="gm-campo">

                    <label
                        for="gm-efeito"
                        class="gm-label"
                    >
                        Efeito
                    </label>


                    <textarea
                        id="gm-efeito"
                        class="gm-input gm-textarea"
                        rows="5"
                    >${
                        escaparHTML(
                            magia.efeito
                        )
                    }</textarea>

                </div>

            </section>
        `;
    }


    /* =========================================================
       RESUMO
       ========================================================= */

    function renderizarResumo(
        magia
    ) {

        const calculada =
            calcularPenalidade(
                magia
            );


        const armazenada =
            numero(
                magia.penalidade
            );


        const classe =
            armazenada === calculada
                ? "gm-resumo-ok"
                : "gm-resumo-aviso";


        return `

            <section
                class="gm-resumo"
                aria-label="Resumo da magia"
            >

                <div class="gm-resumo-item">

                    <span>
                        Nível
                    </span>

                    <strong>
                        ${
                            escaparHTML(
                                magia.nivel
                            )
                        }
                    </strong>

                </div>


                <div class="gm-resumo-item">

                    <span>
                        PM mínimo
                    </span>

                    <strong>
                        ${
                            escaparHTML(
                                calcularPMMinimo(
                                    magia
                                )
                            )
                        }
                    </strong>

                </div>


                <div
                    class="gm-resumo-item ${classe}"
                >

                    <span>
                        Penalidade armazenada
                    </span>

                    <strong>
                        ${
                            escaparHTML(
                                magia.penalidade
                            )
                        }
                    </strong>

                </div>


                <div class="gm-resumo-item">

                    <span>
                        Penalidade calculada
                    </span>

                    <strong>
                        ${
                            escaparHTML(
                                calculada
                            )
                        }
                    </strong>

                </div>

            </section>
        `;
    }


    /* =========================================================
       PARÂMETROS
       ========================================================= */

    function renderizarParametros(
        magia
    ) {

        const presentes =
            PARAMETROS.filter(
                nome =>
                    Object.hasOwn(
                        magia.parametros || {},
                        nome
                    )
            );


        const faltantes =
            PARAMETROS.filter(
                nome =>
                    !Object.hasOwn(
                        magia.parametros || {},
                        nome
                    )
            );


        return `

            <section class="gm-secao-parametros">

                <div class="gm-secao-titulo">

                    <div>

                        <h3>
                            Parâmetros
                        </h3>

                        <p>
                            Somente os parâmetros utilizados
                            pela magia são exibidos.
                        </p>

                    </div>

                </div>


                <div
                    class="gm-parametros-presentes"
                >

                    ${
                        presentes.length
                            ? presentes
                                .map(
                                    nome =>
                                        renderizarParametro(
                                            magia,
                                            nome
                                        )
                                )
                                .join("")
                            : `
                                <div class="gm-parametro-vazio">
                                    Nenhum parâmetro adicionado.
                                </div>
                            `
                    }

                </div>


                <div
                    class="gm-adicionar-parametro"
                >

                    <label
                        for="gm-seletor-parametro"
                        class="gm-label"
                    >
                        Adicionar parâmetro
                    </label>


                    <div
                        class="gm-adicionar-parametro-linha"
                    >

                        <select
                            id="gm-seletor-parametro"
                            class="gm-input"
                        >

                            <option value="">
                                Selecione...
                            </option>


                            ${
                                faltantes
                                    .map(
                                        nome => `

                                            <option
                                                value="${escaparHTML(nome)}"
                                            >
                                                ${
                                                    escaparHTML(
                                                        nomeParametro(
                                                            nome
                                                        )
                                                    )
                                                }
                                                ${
                                                    PARAMETROS_OBRIGATORIOS.includes(
                                                        nome
                                                    )
                                                        ? " — obrigatório"
                                                        : ""
                                                }
                                            </option>
                                        `
                                    )
                                    .join("")
                            }

                        </select>


                        <button
                            type="button"
                            class="gm-btn gm-btn-adicionar"
                            id="gm-adicionar-parametro"
                        >
                            Adicionar
                        </button>

                    </div>

                </div>

            </section>
        `;
    }


    function renderizarParametro(
        magia,
        nome
    ) {

        const obrigatorio =
            PARAMETROS_OBRIGATORIOS.includes(
                nome
            );


        const itens =
            Array.isArray(
                magia.parametros[nome]
            )
                ? magia.parametros[nome]
                : [];


        const multiplos =
            PARAMETROS_MULTIPLOS.includes(
                nome
            );


        return `

            <div
                class="gm-parametro"
                data-parametro="${nome}"
            >

                <div
                    class="gm-parametro-cabecalho"
                >

                    <div>

                        <h4>
                            ${
                                escaparHTML(
                                    nomeParametro(
                                        nome
                                    )
                                )
                            }
                        </h4>


                        ${
                            obrigatorio
                                ? `
                                    <span class="gm-tag-obrigatorio">
                                        Obrigatório
                                    </span>
                                `
                                : ""
                        }

                    </div>


                    <button
                        type="button"
                        class="gm-btn gm-btn-remover"
                        data-remover-parametro="${nome}"
                    >
                        Remover parâmetro
                    </button>

                </div>


                <div
                    class="gm-itens-parametro"
                >

                    ${
                        itens.length
                            ? itens
                                .map(
                                    (
                                        item,
                                        indice
                                    ) =>
                                        renderizarItemParametro(
                                            nome,
                                            item,
                                            indice,
                                            multiplos
                                        )
                                )
                                .join("")
                            : `
                                <div class="gm-parametro-vazio">
                                    Nenhum item informado.
                                </div>
                            `
                    }

                </div>


                ${
                    multiplos
                        ? `
                            <button
                                type="button"
                                class="gm-btn gm-btn-adicionar gm-btn-adicionar-item"
                                data-adicionar-item="${nome}"
                            >
                                + Adicionar item
                            </button>
                        `
                        : ""
                }

            </div>
        `;
    }


    /* =========================================================
       ITEM DE PARÂMETRO
       ========================================================= */

    function renderizarItemParametro(
        nome,
        item,
        indice,
        multiplos
    ) {

        const detalhes =
            item.detalhes || {};


        const opcoes =
            obterOpcoesParametro(
                nome
            );


        const existeNaTabela =
            opcoes.some(
                opcao =>
                    String(opcao.valor) ===
                    String(item.valor)
            );


        const opcao =
            opcoes.find(
                opcao =>
                    String(opcao.valor) ===
                    String(item.valor)
            );


        const calculado =
            calcularModificadorItem(
                nome,
                item
            );


        let valorInicial =
            item.valor;


        /*
         * Dano:
         *
         * O valor exportado é numérico.
         * Durante edição mostramos a quantidade
         * no campo específico.
         */
        if (nome === "dano") {

            let quantidade =
                detalhes.quantidade_d6;


            if (
                quantidade ===
                    undefined &&
                typeof item.valor ===
                    "number"
            ) {
                quantidade =
                    item.valor;
            }


            if (
                quantidade ===
                    undefined &&
                typeof item.valor ===
                    "string"
            ) {

                const match =
                    item.valor.match(
                        /^(\d+)\s*d6$/i
                    );

                if (match) {
                    quantidade =
                        Number(match[1]);
                }
            }


            return renderizarItemDano(
                item,
                indice,
                multiplos,
                quantidade
            );
        }


        /*
         * Características alteradas
         */
        if (
            nome ===
            "caracteristicas_alteradas"
        ) {

            return renderizarItemCaracteristicas(
                item,
                indice,
                multiplos,
                opcoes
            );
        }


        /*
         * Cura
         */
        if (nome === "cura") {

            return renderizarItemCura(
                item,
                indice,
                multiplos,
                opcoes
            );
        }


        /*
         * Modificadores de ataque
         */
        if (
            nome ===
            "modificadores_ataque"
        ) {

            return renderizarItemAtaque(
                item,
                indice,
                multiplos,
                opcoes
            );
        }


        /*
         * Parâmetros normais.
         */
        return `

            <div
                class="gm-item-parametro"
                data-item-parametro="${nome}"
                data-indice="${indice}"
            >

                <div
                    class="gm-campo gm-campo-largo"
                >

                    <label class="gm-label">
                        Valor
                    </label>


                    <select
                        class="gm-input"
                        data-campo="valor"
                    >

                        <option value="">
                            Selecione...
                        </option>


                        ${
                            !existeNaTabela &&
                            !valorVazio(
                                item.valor
                            )
                                ? `
                                    <option
                                        value="${escaparHTML(item.valor)}"
                                        selected
                                    >
                                        ⚠
                                        ${
                                            escaparHTML(
                                                item.valor
                                            )
                                        }
                                        (importado)
                                    </option>
                                `
                                : ""
                        }


                        ${
                            opcoes
                                .map(
                                    opcao => `

                                        <option
                                            value="${escaparHTML(opcao.valor)}"
                                            ${
                                                String(
                                                    opcao.valor
                                                ) ===
                                                String(
                                                    item.valor
                                                )
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            ${
                                                escaparHTML(
                                                    opcao.valor
                                                )
                                            }
                                            (
                                            ${
                                                formatarModificador(
                                                    opcao.modificador
                                                )
                                            }
                                            )
                                        </option>
                                    `
                                )
                                .join("")
                        }

                    </select>

                </div>


                <div
                    class="gm-campo gm-campo-modificador"
                >

                    <label class="gm-label">
                        Modificador
                    </label>


                    <input
                        type="number"
                        class="gm-input"
                        data-campo="modificador"
                        value="${
                            escaparHTML(
                                calculado !== null
                                    ? calculado
                                    : item.modificador
                            )
                        }"
                        readonly
                    >

                </div>


                ${
                    nome ===
                    "tempo_conjuracao"
                        ? `
                            <div class="gm-campo">
                                <small>
                                    O modificador do tempo
                                    de conjuração entra no
                                    cálculo da penalidade.
                                </small>
                            </div>
                        `
                        : ""
                }


                ${
                    multiplos
                        ? `
                            <button
                                type="button"
                                class="gm-btn gm-btn-remover-item"
                                data-remover-item="${nome}"
                                data-indice="${indice}"
                                title="Remover este item"
                                aria-label="Remover item"
                            >
                                ×
                            </button>
                        `
                        : ""
                }

            </div>
        `;
    }


    /* =========================================================
       DANO
       ========================================================= */

    function renderizarItemDano(
        item,
        indice,
        multiplos,
        quantidade
    ) {

        const detalhes =
            item.detalhes || {};


        return `

            <div
                class="gm-item-parametro"
                data-item-parametro="dano"
                data-indice="${indice}"
            >

                <div class="gm-grid">

                    <div class="gm-campo">

                        <label class="gm-label">
                            Qtde de d6
                        </label>


                        <input
                            type="number"
                            min="1"
                            step="1"
                            class="gm-input"
                            data-detalhe="quantidade_d6"
                            value="${
                                escaparHTML(
                                    quantidade ??
                                    ""
                                )
                            }"
                        >

                    </div>


                    <div class="gm-campo">

                        <label class="gm-label">
                            Tipo
                        </label>


                        <input
                            type="text"
                            class="gm-input"
                            data-detalhe="tipo"
                            value="${
                                escaparHTML(
                                    detalhes.tipo ??
                                    ""
                                )
                            }"
                            placeholder="Fogo, elétrico, físico..."
                        >

                    </div>


                    <div class="gm-campo gm-campo-modificador">

                        <label class="gm-label">
                            Modificador
                        </label>


                        <input
                            type="number"
                            class="gm-input"
                            data-campo="modificador"
                            value="${
                                escaparHTML(
                                    calcularModificadorItem(
                                        "dano",
                                        item
                                    ) ??
                                    item.modificador ??
                                    0
                                )
                            }"
                            readonly
                        >

                    </div>

                </div>


                ${
                    multiplos
                        ? `
                            <button
                                type="button"
                                class="gm-btn gm-btn-remover-item"
                                data-remover-item="dano"
                                data-indice="${indice}"
                                title="Remover este item"
                                aria-label="Remover item"
                            >
                                ×
                            </button>
                        `
                        : ""
                }

            </div>
        `;
    }


    /* =========================================================
       CARACTERÍSTICAS ALTERADAS
       ========================================================= */

    function renderizarItemCaracteristicas(
        item,
        indice,
        multiplos,
        opcoes
    ) {

        const detalhes =
            item.detalhes || {};


        const calculado =
            calcularModificadorItem(
                "caracteristicas_alteradas",
                item
            );


        return `

            <div
                class="gm-item-parametro"
                data-item-parametro="caracteristicas_alteradas"
                data-indice="${indice}"
            >

                <div class="gm-grid">

                    <div class="gm-campo">

                        <label class="gm-label">
                            Operação
                        </label>


                        <select
                            class="gm-input"
                            data-campo="valor"
                        >

                            <option value="">
                                Selecione...
                            </option>


                            ${
                                opcoes
                                    .map(
                                        opcao => `

                                            <option
                                                value="${escaparHTML(opcao.valor)}"
                                                ${
                                                    String(
                                                        opcao.valor
                                                    ) ===
                                                    String(
                                                        item.valor
                                                    )
                                                        ? "selected"
                                                        : ""
                                                }
                                            >
                                                ${
                                                    escaparHTML(
                                                        opcao.valor
                                                    )
                                                }
                                            </option>
                                        `
                                    )
                                    .join("")
                            }

                        </select>

                    </div>


                    <div class="gm-campo">

                        <label class="gm-label">
                            Atributo / Vantagem / Desvantagem
                        </label>


                        <input
                            type="text"
                            class="gm-input"
                            data-detalhe="alvo"
                            value="${
                                escaparHTML(
                                    detalhes.alvo ??
                                    ""
                                )
                            }"
                            placeholder="Ex.: ST, Visão Noturna..."
                        >

                    </div>


                    <div class="gm-campo">

                        <label class="gm-label">
                            Pontos
                        </label>


                        <input
                            type="number"
                            min="1"
                            step="1"
                            class="gm-input"
                            data-detalhe="pontos"
                            value="${
                                escaparHTML(
                                    detalhes.pontos ??
                                    ""
                                )
                            }"
                        >

                    </div>


                    <div class="gm-campo">

                        <label class="gm-label">
                            Limite racial
                        </label>


                        <input
                            type="number"
                            min="0"
                            step="1"
                            class="gm-input"
                            data-detalhe="limite_racial"
                            value="${
                                escaparHTML(
                                    detalhes.limite_racial ??
                                    ""
                                )
                            }"
                        >

                    </div>


                    <div class="gm-campo gm-campo-modificador">

                        <label class="gm-label">
                            Modificador
                        </label>


                        <input
                            type="number"
                            class="gm-input"
                            data-campo="modificador"
                            value="${
                                escaparHTML(
                                    calculado ??
                                    item.modificador ??
                                    0
                                )
                            }"
                            readonly
                        >

                    </div>

                </div>


                ${
                    multiplos
                        ? `
                            <button
                                type="button"
                                class="gm-btn gm-btn-remover-item"
                                data-remover-item="caracteristicas_alteradas"
                                data-indice="${indice}"
                                title="Remover este item"
                                aria-label="Remover item"
                            >
                                ×
                            </button>
                        `
                        : ""
                }

            </div>
        `;
    }


    /* =========================================================
       CURA
       ========================================================= */

    function renderizarItemCura(
        item,
        indice,
        multiplos,
        opcoes
    ) {

        const detalhes =
            item.detalhes || {};


        const opcao =
            opcoes.find(
                op =>
                    String(op.valor) ===
                    String(item.valor)
            );


        const texto =
            String(
                opcao?.modificador ??
                ""
            );


        const recuperaPF =
            texto.includes(
                "2 PF"
            );


        const recuperaPV =
            texto.includes(
                "1d6 PV"
            );


        const calculado =
            calcularModificadorItem(
                "cura",
                item
            );


        return `

            <div
                class="gm-item-parametro"
                data-item-parametro="cura"
                data-indice="${indice}"
            >

                <div class="gm-grid">

                    <div
                        class="gm-campo gm-campo-largo"
                    >

                        <label class="gm-label">
                            Tipo de cura
                        </label>


                        <select
                            class="gm-input"
                            data-campo="valor"
                        >

                            <option value="">
                                Selecione...
                            </option>


                            ${
                                opcoes
                                    .map(
                                        opcao => `

                                            <option
                                                value="${escaparHTML(opcao.valor)}"
                                                ${
                                                    String(
                                                        opcao.valor
                                                    ) ===
                                                    String(
                                                        item.valor
                                                    )
                                                        ? "selected"
                                                        : ""
                                                }
                                            >
                                                ${
                                                    escaparHTML(
                                                        opcao.valor
                                                    )
                                                }
                                                (
                                                ${
                                                    formatarModificador(
                                                        opcao.modificador
                                                    )
                                                }
                                                )
                                            </option>
                                        `
                                    )
                                    .join("")
                            }

                        </select>

                    </div>


                    ${
                        recuperaPF
                            ? `
                                <div class="gm-campo">

                                    <label class="gm-label">
                                        Qtd PF
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        class="gm-input"
                                        data-detalhe="qtd_pf"
                                        value="${
                                            escaparHTML(
                                                detalhes.qtd_pf ??
                                                ""
                                            )
                                        }"
                                    >

                                </div>
                            `
                            : ""
                    }


                    ${
                        recuperaPV
                            ? `
                                <div class="gm-campo">

                                    <label class="gm-label">
                                        PV (d6)
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        class="gm-input"
                                        data-detalhe="pv_d6"
                                        value="${
                                            escaparHTML(
                                                detalhes.pv_d6 ??
                                                ""
                                            )
                                        }"
                                    >

                                </div>
                            `
                            : ""
                    }


                    <div
                        class="gm-campo gm-campo-modificador"
                    >

                        <label class="gm-label">
                            Modificador
                        </label>


                        <input
                            type="number"
                            class="gm-input"
                            data-campo="modificador"
                            value="${
                                escaparHTML(
                                    calculado ??
                                    item.modificador ??
                                    0
                                )
                            }"
                            readonly
                        >

                    </div>

                </div>


                ${
                    multiplos
                        ? `
                            <button
                                type="button"
                                class="gm-btn gm-btn-remover-item"
                                data-remover-item="cura"
                                data-indice="${indice}"
                                title="Remover este item"
                                aria-label="Remover item"
                            >
                                ×
                            </button>
                        `
                        : ""
                }

            </div>
        `;
    }


    /* =========================================================
       MODIFICADORES DE ATAQUE
       ========================================================= */

    function renderizarItemAtaque(
        item,
        indice,
        multiplos,
        opcoes
    ) {

        const detalhes =
            item.detalhes || {};


        const opcao =
            opcoes.find(
                op =>
                    String(op.valor) ===
                    String(item.valor)
            );


        const ciclico =
            String(
                opcao?.modificador ??
                ""
            )
                .toLowerCase()
                .includes("ciclo");


        const calculado =
            calcularModificadorItem(
                "modificadores_ataque",
                item
            );


        return `

            <div
                class="gm-item-parametro"
                data-item-parametro="modificadores_ataque"
                data-indice="${indice}"
            >

                <div class="gm-grid">

                    <div
                        class="gm-campo gm-campo-largo"
                    >

                        <label class="gm-label">
                            Modificador de ataque
                        </label>


                        <select
                            class="gm-input"
                            data-campo="valor"
                        >

                            <option value="">
                                Selecione...
                            </option>


                            ${
                                opcoes
                                    .map(
                                        opcao => `

                                            <option
                                                value="${escaparHTML(opcao.valor)}"
                                                ${
                                                    String(
                                                        opcao.valor
                                                    ) ===
                                                    String(
                                                        item.valor
                                                    )
                                                        ? "selected"
                                                        : ""
                                                }
                                            >
                                                ${
                                                    escaparHTML(
                                                        opcao.valor
                                                    )
                                                }
                                                (
                                                ${
                                                    formatarModificador(
                                                        opcao.modificador
                                                    )
                                                }
                                                )
                                            </option>
                                        `
                                    )
                                    .join("")
                            }

                        </select>

                    </div>


                    ${
                        ciclico
                            ? `
                                <div class="gm-campo">

                                    <label class="gm-label">
                                        Quantidade de ciclos
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        class="gm-input"
                                        data-detalhe="quantidade_ciclos"
                                        value="${
                                            escaparHTML(
                                                detalhes.quantidade_ciclos ??
                                                ""
                                            )
                                        }"
                                    >

                                </div>
                            `
                            : ""
                    }


                    <div
                        class="gm-campo gm-campo-modificador"
                    >

                        <label class="gm-label">
                            Modificador
                        </label>


                        <input
                            type="number"
                            class="gm-input"
                            data-campo="modificador"
                            value="${
                                escaparHTML(
                                    calculado ??
                                    item.modificador ??
                                    0
                                )
                            }"
                            readonly
                        >

                    </div>

                </div>


                ${
                    multiplos
                        ? `
                            <button
                                type="button"
                                class="gm-btn gm-btn-remover-item"
                                data-remover-item="modificadores_ataque"
                                data-indice="${indice}"
                                title="Remover este item"
                                aria-label="Remover item"
                            >
                                ×
                            </button>
                        `
                        : ""
                }

            </div>
        `;
    }


    /* =========================================================
       EVENTOS DO EDITOR
       ========================================================= */

    function configurarEventosEditor() {

        const editor =
            document.getElementById(
                "gm-editor"
            );


        if (!editor) {
            return;
        }


        editor
            .querySelectorAll(
                "input, textarea, select"
            )
            .forEach(
                campo => {

                    campo.addEventListener(
                        "input",
                        () => {

                            atualizarMagiaDoFormulario();

                            atualizarModificadoresVisuais();
                        }
                    );


                    campo.addEventListener(
                        "change",
                        () => {

                            if (
                                campo.matches(
                                    '[data-campo="valor"]'
                                )
                            ) {

                                aplicarModificadorSelecionado(
                                    campo
                                );

                                return;
                            }


                            atualizarMagiaDoFormulario();

                            atualizarModificadoresVisuais();
                        }
                    );
                }
            );


        document
            .getElementById(
                "gm-adicionar-parametro"
            )
            ?.addEventListener(
                "click",
                () => {

                    const nome =
                        document
                            .getElementById(
                                "gm-seletor-parametro"
                            )
                            ?.value;


                    if (nome) {

                        adicionarParametro(
                            nome
                        );
                    }
                }
            );


        editor
            .querySelectorAll(
                "[data-remover-parametro]"
            )
            .forEach(
                botao => {

                    botao.addEventListener(
                        "click",
                        () =>
                            removerParametro(
                                botao.dataset
                                    .removerParametro
                            )
                    );
                }
            );


        editor
            .querySelectorAll(
                "[data-adicionar-item]"
            )
            .forEach(
                botao => {

                    botao.addEventListener(
                        "click",
                        () =>
                            adicionarItemParametro(
                                botao.dataset
                                    .adicionarItem
                            )
                    );
                }
            );


        editor
            .querySelectorAll(
                "[data-remover-item]"
            )
            .forEach(
                botao => {

                    botao.addEventListener(
                        "click",
                        () =>
                            removerItemParametro(
                                botao.dataset
                                    .removerItem,
                                Number(
                                    botao.dataset
                                        .indice
                                )
                            )
                    );
                }
            );


        document
            .getElementById(
                "gm-salvar"
            )
            ?.addEventListener(
                "click",
                salvarMagia
            );


        document
            .getElementById(
                "gm-aplicar-penalidade"
            )
            ?.addEventListener(
                "click",
                aplicarPenalidadeCalculada
            );


        document
            .getElementById(
                "gm-duplicar"
            )
            ?.addEventListener(
                "click",
                duplicarMagia
            );


        document
            .getElementById(
                "gm-excluir"
            )
            ?.addEventListener(
                "click",
                excluirMagia
            );
    }


    /* =========================================================
       ATUALIZAÇÃO VISUAL DOS MODIFICADORES
       ========================================================= */

    function atualizarModificadoresVisuais() {

        if (
            indiceEdicao === null
        ) {
            return;
        }


        const magia =
            magias[indiceEdicao];


        if (!magia) {
            return;
        }


        document
            .querySelectorAll(
                "#gm-editor [data-item-parametro]"
            )
            .forEach(bloco => {

                const nome =
                    bloco.dataset
                        .itemParametro;


                const indice =
                    Number(
                        bloco.dataset
                            .indice
                    );


                const item =
                    magia.parametros
                        ?.[nome]
                        ?.[indice];


                if (!item) {
                    return;
                }


                const calculado =
                    calcularModificadorItem(
                        nome,
                        item
                    );


                const campo =
                    bloco.querySelector(
                        '[data-campo="modificador"]'
                    );


                if (
                    campo &&
                    calculado !== null
                ) {

                    campo.value =
                        calculado;
                }
            });


        atualizarResumoSemRecriar();

        renderizarValidacao();
    }


    /* =========================================================
       APLICA MODIFICADOR AO SELECIONAR VALOR
       ========================================================= */

    function aplicarModificadorSelecionado(
        campo
    ) {

        const bloco =
            campo.closest(
                "[data-item-parametro]"
            );


        if (
            !bloco ||
            indiceEdicao === null
        ) {
            return;
        }


        const nome =
            bloco.dataset
                .itemParametro;


        const indice =
            Number(
                bloco.dataset
                    .indice
            );


        const magia =
            magias[indiceEdicao];


        const item =
            magia?.parametros?.[
                nome
            ]?.[indice];


        if (!item) {
            return;
        }


        item.valor =
            campo.value;


        /*
         * Ao mudar a opção, alguns parâmetros
         * precisam de campos adicionais.
         *
         * Por isso recriamos o editor.
         */
        renderizarEditor();


        focarItem(
            nome,
            indice
        );
    }


    /* =========================================================
       FORMULÁRIO → OBJETO
       ========================================================= */

    function atualizarMagiaDoFormulario() {

        if (
            indiceEdicao === null
        ) {
            return;
        }


        const magia =
            magias[indiceEdicao];


        if (!magia) {
            return;
        }


        /*
         * Dados básicos
         */
        magia.nome =
            document
                .getElementById(
                    "gm-nome"
                )
                ?.value ||
            "";


        magia.dominio =
            document
                .getElementById(
                    "gm-dominio"
                )
                ?.value ||
            "";


        magia.nivel =
            numero(
                document
                    .getElementById(
                        "gm-nivel"
                    )
                    ?.value,
                ""
            );


        magia.nivel_nome =
            document
                .getElementById(
                    "gm-nivel-nome"
                )
                ?.value ||
            "";


        magia.categoria =
            document
                .getElementById(
                    "gm-categoria"
                )
                ?.value ||
            "";


        magia.efeito =
            document
                .getElementById(
                    "gm-efeito"
                )
                ?.value ||
            "";


        magia.observacao =
            document
                .getElementById(
                    "gm-observacao"
                )
                ?.value ||
            "";


        /*
         * Parâmetros
         */
        document
            .querySelectorAll(
                "#gm-editor [data-item-parametro]"
            )
            .forEach(
                bloco => {

                    const nome =
                        bloco.dataset
                            .itemParametro;


                    const indice =
                        Number(
                            bloco.dataset
                                .indice
                        );


                    const item =
                        magia
                            .parametros
                            ?.[nome]
                            ?.[indice];


                    if (!item) {
                        return;
                    }


                    const valorCampo =
                        bloco.querySelector(
                            '[data-campo="valor"]'
                        );


                    /*
                     * Dano não usa valor como
                     * texto "10d6".
                     */
                    if (
                        valorCampo &&
                        nome !== "dano"
                    ) {

                        item.valor =
                            valorCampo.value;
                    }


                    const detalhes = {};


                    /*
                     * Preserva detalhes antigos
                     * enquanto atualiza os campos
                     * visíveis.
                     */
                    if (
                        item.detalhes &&
                        typeof item.detalhes ===
                            "object"
                    ) {

                        Object.assign(
                            detalhes,
                            item.detalhes
                        );
                    }


                    bloco
                        .querySelectorAll(
                            "[data-detalhe]"
                        )
                        .forEach(
                            campo => {

                                const chave =
                                    campo.dataset
                                        .detalhe;


                                if (
                                    campo.value ===
                                    ""
                                ) {

                                    delete detalhes[
                                        chave
                                    ];

                                    return;
                                }


                                /*
                                 * Campos textuais
                                 */
                                if (
                                    campo.type ===
                                        "text" ||
                                    campo.tagName ===
                                        "TEXTAREA"
                                ) {

                                    detalhes[
                                        chave
                                    ] =
                                        campo.value;

                                    return;
                                }


                                /*
                                 * Campos numéricos.
                                 */
                                const valor =
                                    Number(
                                        campo.value
                                    );


                                detalhes[
                                    chave
                                ] =
                                    Number.isFinite(
                                        valor
                                    )
                                        ? valor
                                        : campo.value;
                            }
                        );


                    /*
                     * Dano:
                     * valor canônico = quantidade
                     * numérica de d6.
                     */
                    if (
                        nome === "dano"
                    ) {

                        const quantidade =
                            Number(
                                detalhes
                                    .quantidade_d6
                            );


                        if (
                            Number.isFinite(
                                quantidade
                            )
                        ) {

                            item.valor =
                                quantidade;

                            detalhes.unidade =
                                "d6";
                        }
                    }


                    if (
                        Object.keys(
                            detalhes
                        ).length
                    ) {

                        item.detalhes =
                            detalhes;

                    } else {

                        delete item.detalhes;
                    }


                    /*
                     * Recalcula automaticamente
                     * quando houver fórmula.
                     */
                    const calculado =
                        calcularModificadorItem(
                            nome,
                            item
                        );


                    if (
                        calculado !== null
                    ) {

                        item.modificador =
                            calculado;
                    }
                }
            );


        atualizarResumoSemRecriar();
    }


    function atualizarResumoSemRecriar() {

        const magia =
            magias[indiceEdicao];


        const resumo =
            document.querySelector(
                "#gm-editor .gm-resumo"
            );


        if (
            !magia ||
            !resumo
        ) {
            return;
        }


        const valores =
            resumo.querySelectorAll(
                ".gm-resumo-item strong"
            );


        const calculada =
            calcularPenalidade(
                magia
            );


        if (valores[0]) {
            valores[0].textContent =
                magia.nivel;
        }


        if (valores[1]) {

            valores[1].textContent =
                calcularPMMinimo(
                    magia
                );
        }


        if (valores[2]) {

            valores[2].textContent =
                magia.penalidade;
        }


        if (valores[3]) {

            valores[3].textContent =
                calculada;
        }


        const itensResumo =
            resumo.querySelectorAll(
                ".gm-resumo-item"
            );


        const armazenada =
            itensResumo[2];


        if (armazenada) {

            armazenada.classList.toggle(
                "gm-resumo-ok",
                numero(
                    magia.penalidade
                ) === calculada
            );


            armazenada.classList.toggle(
                "gm-resumo-aviso",
                numero(
                    magia.penalidade
                ) !== calculada
            );
        }
    }


    /* =========================================================
       ADICIONAR / REMOVER
       ========================================================= */

    function adicionarParametro(
        nome
    ) {

        if (
            !PARAMETROS.includes(
                nome
            ) ||
            indiceEdicao === null
        ) {
            return;
        }


        const magia =
            magias[indiceEdicao];


        if (!magia) {
            return;
        }


        if (
            Object.hasOwn(
                magia.parametros,
                nome
            )
        ) {
            return;
        }


        magia.parametros[nome] = [
            {
                valor: "",
                modificador: 0
            }
        ];


        renderizarEditor();


        focarItem(
            nome,
            0
        );
    }


    function removerParametro(
        nome
    ) {

        if (
            indiceEdicao === null
        ) {
            return;
        }


        const magia =
            magias[indiceEdicao];


        if (
            !magia ||
            !Object.hasOwn(
                magia.parametros,
                nome
            )
        ) {
            return;
        }


        delete magia.parametros[
            nome
        ];


        renderizarEditor();
    }


    function adicionarItemParametro(
        nome
    ) {

        if (
            indiceEdicao === null ||
            !PARAMETROS_MULTIPLOS.includes(
                nome
            )
        ) {
            return;
        }


        const magia =
            magias[indiceEdicao];


        if (!magia) {
            return;
        }


        if (
            !Array.isArray(
                magia.parametros[
                    nome
                ]
            )
        ) {

            magia.parametros[
                nome
            ] = [];
        }


        magia.parametros[
            nome
        ].push({
            valor: "",
            modificador: 0
        });


        const novoIndice =
            magia.parametros[
                nome
            ].length - 1;


        renderizarEditor();


        focarItem(
            nome,
            novoIndice
        );
    }


    function removerItemParametro(
        nome,
        indice
    ) {

        if (
            indiceEdicao === null
        ) {
            return;
        }


        const magia =
            magias[indiceEdicao];


        if (
            !Array.isArray(
                magia?.parametros?.[
                    nome
                ]
            )
        ) {
            return;
        }


        magia.parametros[
            nome
        ].splice(
            indice,
            1
        );


        if (
            magia.parametros[
                nome
            ].length === 0
        ) {

            delete magia.parametros[
                nome
            ];
        }


        renderizarEditor();
    }


    function focarItem(
        nome,
        indice
    ) {

        requestAnimationFrame(
            () => {

                document
                    .querySelector(
                        `[data-item-parametro="${escaparSeletor(nome)}"][data-indice="${indice}"] [data-campo="valor"]`
                    )
                    ?.focus();
            }
        );
    }


    /* =========================================================
       PENALIDADE
       ========================================================= */

    function aplicarPenalidadeCalculada() {

        if (
            indiceEdicao === null
        ) {
            return;
        }


        atualizarMagiaDoFormulario();


        const magia =
            magias[indiceEdicao];


        if (!magia) {
            return;
        }


        magia.penalidade =
            calcularPenalidade(
                magia
            );


        renderizarLista();

        renderizarEditor();


        mostrarStatus(
            `Penalidade armazenada atualizada para ${magia.penalidade}.`,
            "sucesso"
        );
    }


    /* =========================================================
       VALIDAÇÃO VISUAL
       ========================================================= */

    function aplicarMarcacaoCampos(
        resultado
    ) {

        const editor =
            document.getElementById(
                "gm-editor"
            );


        if (!editor) {
            return;
        }


        editor
            .querySelectorAll(
                ".gm-campo-erro, .gm-campo-aviso"
            )
            .forEach(
                elemento => {

                    elemento.classList.remove(
                        "gm-campo-erro",
                        "gm-campo-aviso"
                    );
                }
            );


        resultado.campos.forEach(
            item => {

                try {

                    const campo =
                        editor.querySelector(
                            item.seletor
                        );


                    if (!campo) {
                        return;
                    }


                    campo.classList.add(
                        item.tipo === "erro"
                            ? "gm-campo-erro"
                            : "gm-campo-aviso"
                    );

                } catch (_) {
                    /*
                     * Ignora seletor inválido.
                     */
                }
            }
        );
    }


    function renderizarValidacao() {

        if (
            indiceEdicao === null
        ) {
            return;
        }


        const magia =
            magias[indiceEdicao];


        const area =
            document.getElementById(
                "gm-validacao"
            );


        const status =
            document.getElementById(
                "gm-status-magia"
            );


        if (
            !magia ||
            !area ||
            !status
        ) {
            return;
        }


        const resultado =
            validarMagia(
                magia
            );


        const possuiErro =
            resultado.erros.length >
            0;


        const possuiAviso =
            !possuiErro &&
            resultado.avisos.length >
            0;


        status.className =
            `gm-status-magia ${
                possuiErro
                    ? "gm-validacao-erro"
                    : possuiAviso
                        ? "gm-validacao-aviso"
                        : "gm-validacao-ok"
            }`;


        status.textContent =
            possuiErro
                ? `! Magia com ${resultado.erros.length} erro(s)`
                : possuiAviso
                    ? `⚠ Magia válida com ${resultado.avisos.length} aviso(s)`
                    : "✓ Magia válida";


        let html = "";


        if (
            resultado.erros.length
        ) {

            html += `

                <div
                    class="gm-caixa-validacao gm-caixa-erro"
                    role="alert"
                >

                    <strong>
                        Erros
                    </strong>


                    <ul>

                        ${
                            resultado.erros
                                .map(
                                    erro =>
                                        `<li>${escaparHTML(erro)}</li>`
                                )
                                .join("")
                        }

                    </ul>

                </div>
            `;
        }


        if (
            resultado.avisos.length
        ) {

            html += `

                <div
                    class="gm-caixa-validacao gm-caixa-aviso"
                >

                    <strong>
                        Avisos
                    </strong>


                    <ul>

                        ${
                            resultado.avisos
                                .map(
                                    aviso =>
                                        `<li>${escaparHTML(aviso)}</li>`
                                )
                                .join("")
                        }

                    </ul>

                </div>
            `;
        }


        if (!html) {

            html = `

                <div
                    class="gm-caixa-validacao gm-caixa-ok"
                >

                    <strong>
                        ✓ Todos os dados estão válidos.
                    </strong>

                </div>
            `;
        }


        area.innerHTML =
            html;


        aplicarMarcacaoCampos(
            resultado
        );
    }


    /* =========================================================
       NOVA MAGIA
       ========================================================= */

    function novaMagia() {

        if (
            indiceEdicao !== null
        ) {

            atualizarMagiaDoFormulario();
        }


        const magia =
            criarMagiaVazia();


        magias.push(
            magia
        );


        indiceEdicao =
            magias.length - 1;


        renderizarLista();

        renderizarEditor();


        mostrarStatus(
            "Nova magia criada.",
            "sucesso"
        );


        requestAnimationFrame(
            () =>
                document
                    .getElementById(
                        "gm-nome"
                    )
                    ?.focus()
        );
    }


    /* =========================================================
       SALVAR
       ========================================================= */

    function salvarMagia() {

        if (
            indiceEdicao === null
        ) {
            return;
        }


        atualizarMagiaDoFormulario();


        const magia =
            magias[indiceEdicao];


        if (!magia) {
            return;
        }


        magia.penalidade =
            calcularPenalidade(
                magia
            );


        const resultado =
            validarMagia(
                magia
            );


        renderizarLista();

        renderizarEditor();


        if (
            resultado.erros.length
        ) {

            mostrarStatus(
                "Alterações salvas em memória. A penalidade foi atualizada, mas ainda existem erros.",
                "erro"
            );

        } else if (
            resultado.avisos.length
        ) {

            mostrarStatus(
                "Alterações salvas em memória e penalidade atualizada. Ainda existem avisos.",
                "aviso"
            );

        } else {

            mostrarStatus(
                "Magia salva e validada. Penalidade armazenada atualizada.",
                "sucesso"
            );
        }
    }


    /* =========================================================
       DUPLICAR
       ========================================================= */

    function duplicarMagia() {

        if (
            indiceEdicao === null
        ) {
            return;
        }


        atualizarMagiaDoFormulario();


        const copia =
            clone(
                magias[indiceEdicao]
            );


        copia.id =
            gerarId();


        copia.nome =
            copia.nome
                ? `${copia.nome} (cópia)`
                : "Nova magia (cópia)";


        magias.splice(
            indiceEdicao + 1,
            0,
            copia
        );


        indiceEdicao++;


        renderizarLista();

        renderizarEditor();


        mostrarStatus(
            "Magia duplicada.",
            "sucesso"
        );
    }


    /* =========================================================
       EXCLUIR
       ========================================================= */

    function excluirMagia() {

        if (
            indiceEdicao === null
        ) {
            return;
        }


        atualizarMagiaDoFormulario();


        const nome =
            magias[
                indiceEdicao
            ]?.nome ||
            "esta magia";


        if (
            !confirm(
                `Deseja realmente excluir "${nome}"?`
            )
        ) {
            return;
        }


        magias.splice(
            indiceEdicao,
            1
        );


        indiceEdicao =
            magias.length
                ? Math.min(
                    indiceEdicao,
                    magias.length - 1
                )
                : null;


        renderizarLista();

        renderizarEditor();


        mostrarStatus(
            "Magia excluída.",
            "sucesso"
        );
    }


    /* =========================================================
       IMPORTAÇÃO
       ========================================================= */

    async function importarArquivo(
        evento
    ) {

        const arquivo =
            evento.target.files?.[0];


        if (!arquivo) {
            return;
        }


        try {

            const dados =
                JSON.parse(
                    await arquivo.text()
                );


            const lista =
                Array.isArray(dados)
                    ? dados
                    : Array.isArray(
                        dados?.magias
                    )
                        ? dados.magias
                        : null;


            if (!lista) {

                throw new Error(
                    "O JSON não contém um array de magias."
                );
            }


            const avisos = [];


            lista.forEach(
                (
                    magia,
                    indice
                ) => {

                    if (
                        !magia ||
                        typeof magia !==
                            "object" ||
                        Array.isArray(magia)
                    ) {

                        avisos.push(
                            `Registro ${indice + 1}: inválido.`
                        );

                        return;
                    }


                    /*
                     * Campos desconhecidos.
                     */
                    Object.keys(
                        magia
                    ).forEach(
                        campo => {

                            if (
                                !CAMPOS_TOPO.includes(
                                    campo
                                )
                            ) {

                                avisos.push(
                                    `Magia ${indice + 1}: campo desconhecido "${campo}" foi ignorado.`
                                );
                            }
                        }
                    );


                    /*
                     * Campos legados.
                     */
                    if (
                        magia.duracao !==
                        undefined
                    ) {

                        avisos.push(
                            `Magia ${indice + 1}: campo legado "duracao" foi ignorado; use parametros.duracao.`
                        );
                    }


                    if (
                        magia.alcance_maximo !==
                        undefined
                    ) {

                        avisos.push(
                            `Magia ${indice + 1}: campo legado "alcance_maximo" foi ignorado; use parametros.alcance.`
                        );
                    }


                    /*
                     * Parâmetros.
                     */
                    Object.keys(
                        magia.parametros ||
                        {}
                    ).forEach(
                        nome => {

                            const canonico =
                                normalizarNomeParametro(
                                    nome
                                );


                            if (
                                !PARAMETROS.includes(
                                    canonico
                                )
                            ) {

                                avisos.push(
                                    `Magia ${indice + 1}: parâmetro desconhecido "${nome}" foi ignorado.`
                                );

                            } else if (
                                canonico !==
                                nome
                            ) {

                                avisos.push(
                                    `Magia ${indice + 1}: parâmetro legado "${nome}" foi convertido para "${canonico}".`
                                );
                            }
                        }
                    );


                    /*
                     * nivel_nome divergente:
                     * não corrigimos automaticamente.
                     */
                    const nivel =
                        Number(
                            magia.nivel
                        );


                    if (
                        Number.isInteger(
                            nivel
                        ) &&
                        NIVEIS[nivel] &&
                        magia.nivel_nome &&
                        magia.nivel_nome !==
                            NIVEIS[nivel]
                    ) {

                        avisos.push(
                            `Magia ${indice + 1}: nivel_nome "${magia.nivel_nome}" não corresponde ao nível ${nivel} ("${NIVEIS[nivel]}").`
                        );
                    }
                }
            );


            /*
             * A penalidade original é preservada.
             */
            magias =
                lista.map(
                    normalizarMagia
                );


            indiceEdicao =
                magias.length
                    ? 0
                    : null;


            filtroLista =
                "";


            renderizar();


            mostrarStatus(
                `${magias.length} magia(s) importada(s).${
                    avisos.length
                        ? ` ${avisos.length} aviso(s) de estrutura.`
                        : ""
                }`,
                avisos.length
                    ? "aviso"
                    : "sucesso"
            );

        } catch (erro) {

            console.error(
                erro
            );


            mostrarStatus(
                `Erro ao importar JSON: ${erro.message}`,
                "erro"
            );

        } finally {

            evento.target.value =
                "";
        }
    }


    /* =========================================================
       EXPORTAÇÃO
       ========================================================= */

    function prepararItemParaExportacao(
        nome,
        item
    ) {

        const resultado = {

            valor:
                item?.valor ??
                "",

            modificador:
                numero(
                    item?.modificador,
                    0
                )
        };


        const detalhes =
            item?.detalhes &&
            typeof item.detalhes ===
                "object" &&
            !Array.isArray(
                item.detalhes
            )
                ? clone(
                    item.detalhes
                )
                : {};


        /*
         * Dano:
         *
         * NÃO exportamos "10d6".
         * O valor é a quantidade numérica
         * de d6.
         */
        if (
            nome === "dano"
        ) {

            let quantidade =
                detalhes.quantidade_d6;


            if (
                quantidade ===
                    undefined &&
                typeof item.valor ===
                    "number"
            ) {

                quantidade =
                    item.valor;
            }


            if (
                quantidade ===
                    undefined &&
                typeof item.valor ===
                    "string"
            ) {

                const match =
                    item.valor.match(
                        /^(\d+)\s*d6$/i
                    );


                if (match) {

                    quantidade =
                        Number(
                            match[1]
                        );
                }
            }


            if (
                Number.isFinite(
                    Number(
                        quantidade
                    )
                )
            ) {

                resultado.valor =
                    Number(
                        quantidade
                    );


                detalhes.quantidade_d6 =
                    Number(
                        quantidade
                    );


                detalhes.unidade =
                    "d6";
            }
        }


        /*
         * Remove marcadores internos.
         */
        delete detalhes._json_invalido;

        delete detalhes._valor_invalido;


        if (
            Object.keys(
                detalhes
            ).length
        ) {

            resultado.detalhes =
                detalhes;
        }


        return resultado;
    }


    function prepararMagiaParaExportacao(
        magia
    ) {

        const resultado = {

            id:
                magia.id,

            nome:
                magia.nome,

            dominio:
                magia.dominio,

            nivel:
                magia.nivel,

            nivel_nome:
                magia.nivel_nome,

            categoria:
                magia.categoria,

            efeito:
                magia.efeito,

            parametros:
                {},

            penalidade:
                magia.penalidade,

            observacao:
                magia.observacao
        };


        PARAMETROS.forEach(
            nome => {

                const parametro =
                    magia
                        .parametros
                        ?.[nome];


                if (
                    !Array.isArray(
                        parametro
                    ) ||
                    parametro.length ===
                        0
                ) {
                    return;
                }


                resultado
                    .parametros[
                        nome
                    ] =
                    parametro.map(
                        item =>
                            prepararItemParaExportacao(
                                nome,
                                item
                            )
                    );
            }
        );


        return resultado;
    }


    function exportarJSON() {

        if (
            !magias.length
        ) {

            mostrarStatus(
                "Não há magias para exportar.",
                "aviso"
            );

            return;
        }


        if (
            indiceEdicao !== null
        ) {

            atualizarMagiaDoFormulario();
        }


        const resultados =
            magias.map(
                validarMagia
            );


        const totalErros =
            resultados.reduce(
                (
                    soma,
                    resultado
                ) =>
                    soma +
                    resultado.erros.length,
                0
            );


        const totalAvisos =
            resultados.reduce(
                (
                    soma,
                    resultado
                ) =>
                    soma +
                    resultado.avisos.length,
                0
            );


        if (
            totalErros
        ) {

            const continuar =
                confirm(
                    `Existem ${totalErros} erro(s) de validação.\n\nO JSON será exportado mesmo assim, preservando os dados atuais.\n\nDeseja continuar?`
                );


            if (!continuar) {
                return;
            }
        }


        const dados =
            magias.map(
                prepararMagiaParaExportacao
            );


        const json =
            JSON.stringify(
                dados,
                null,
                2
            );


        const blob =
            new Blob(
                [json],
                {
                    type:
                        "application/json;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "grimorio-gerado.json";


        document.body.appendChild(
            link
        );


        link.click();

        link.remove();


        URL.revokeObjectURL(
            url
        );


        mostrarStatus(
            `JSON exportado com ${magias.length} magia(s).${
                totalAvisos
                    ? ` ${totalAvisos} aviso(s) foram detectados.`
                    : ""
            }`,
            totalErros || totalAvisos
                ? "aviso"
                : "sucesso"
        );
    }


    /* =========================================================
       CARREGAMENTO DAS TABELAS
       ========================================================= */

    async function carregarJSON(
        url
    ) {

        const resposta =
            await fetch(
                url
            );


        if (
            !resposta.ok
        ) {

            throw new Error(
                `${resposta.status} ${resposta.statusText}`
            );
        }


        return resposta.json();
    }


    async function inicializarDados() {

        /*
         * Carrega somente as tabelas.
         *
         * NÃO carrega grimorio.json.
         */
        try {

            tabelas =
                await carregarJSON(
                    URL_TABELAS
                );

        } catch (erro) {

            tabelas = {};


            console.warn(
                "Não foi possível carregar modificadores_tabelas.json:",
                erro
            );
        }


        /*
         * Progressões são auxiliares.
         */
        try {

            progressoes =
                await carregarJSON(
                    URL_PROGRESSOES
                );

        } catch (erro) {

            progressoes = {};


            console.info(
                "Arquivo de progressões não encontrado. As progressões incorporadas serão utilizadas quando aplicável."
            );
        }


        renderizar();
    }


    /* =========================================================
       STATUS
       ========================================================= */

    function mostrarStatus(
        mensagem,
        tipo = "info"
    ) {

        const status =
            document.getElementById(
                "gm-status"
            );


        if (!status) {
            return;
        }


        status.className =
            `gm-status gm-status-${tipo}`;


        status.textContent =
            mensagem;


        clearTimeout(
            mostrarStatus.timer
        );


        mostrarStatus.timer =
            setTimeout(
                () => {

                    status.textContent =
                        "";

                    status.className =
                        "gm-status";

                },
                6000
            );
    }


    /* =========================================================
       INICIALIZAÇÃO
       ========================================================= */

    await inicializarDados();

});