document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("gerador-magias");

    if (!container) {
        return;
    }

    /* =========================================================
       CONFIGURAÇÃO
       ========================================================= */

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

    const NOMES_PARAMETROS = {
        alcance: "Alcance",
        area_efeito: "Área de efeito",
        atribulacao: "Atribulação",
        caracteristicas_alteradas: "Características alteradas",
        conceder_bonus: "Conceder bônus",
        cura: "Cura",
        dano: "Dano",
        duracao: "Duração",
        invocacao: "Invocação",
        massa_volume: "Massa / Volume",
        metamorfose: "Metamorfose",
        modificadores_ataque: "Modificadores de ataque",
        multiplos_alvos: "Múltiplos alvos",
        tamanho: "Tamanho",
        tempo_conjuracao: "Tempo de conjuração",
        velocidade: "Velocidade"
    };

    /* =========================================================
       ESTADO
       ========================================================= */

    let magias = [];
    let indiceEdicao = null;


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

    function gerarId() {
        return (
            "magia-" +
            Date.now().toString(36) +
            "-" +
            Math.random().toString(36).substring(2, 8)
        );
    }

    function nomeParametro(nome) {
        return NOMES_PARAMETROS[nome] || nome;
    }

    function normalizarNomeParametro(nome) {
        return ALIASES_PARAMETROS[nome] || nome;
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /* =========================================================
       NORMALIZAÇÃO
       ========================================================= */

    function normalizarItem(item) {

        if (!item || typeof item !== "object") {
            return {
                valor: "",
                modificador: 0
            };
        }

        const resultado = {
            valor: "",
            modificador: 0
        };

        if (item.valor !== undefined) {
            resultado.valor = item.valor;
        }
        else if (item.efeito !== undefined) {
            resultado.valor = item.efeito;
        }
        else if (item.descricao !== undefined) {
            resultado.valor = item.descricao;
        }

        if (
            item.modificador !== undefined &&
            item.modificador !== null &&
            item.modificador !== ""
        ) {
            const numero = Number(item.modificador);

            resultado.modificador =
                Number.isNaN(numero) ? 0 : numero;
        }

        if (
            item.detalhes &&
            typeof item.detalhes === "object"
        ) {
            resultado.detalhes = clone(item.detalhes);
        }

        const camposDetalhes = [
            "tipo",
            "direto",
            "quantidade"
        ];

        camposDetalhes.forEach(campo => {

            if (item[campo] !== undefined) {

                if (!resultado.detalhes) {
                    resultado.detalhes = {};
                }

                if (
                    resultado.detalhes[campo] === undefined
                ) {
                    resultado.detalhes[campo] = item[campo];
                }
            }
        });

        return resultado;
    }

    function normalizarParametro(valor) {

        if (
            valor === undefined ||
            valor === null
        ) {
            return [];
        }

        if (Array.isArray(valor)) {
            return valor.map(normalizarItem);
        }

        return [normalizarItem(valor)];
    }

    function normalizarMagia(magia) {

        const resultado = {
            id: magia.id || gerarId(),

            nome: magia.nome || "",

            dominio: magia.dominio || "",

            nivel:
                magia.nivel !== undefined
                    ? Number(magia.nivel)
                    : "",

            nivel_nome:
                magia.nivel_nome || "",

            categoria:
                magia.categoria || "",

            efeito:
                magia.efeito || "",

            parametros: {},

            penalidade:
                typeof magia.penalidade === "number"
                    ? magia.penalidade
                    : Number(magia.penalidade) || 0,

            observacao:
                magia.observacao || ""
        };

        const parametrosOriginais =
            magia.parametros &&
            typeof magia.parametros === "object"
                ? magia.parametros
                : {};

        Object.keys(parametrosOriginais).forEach(nome => {

            const nomeCanonico =
                normalizarNomeParametro(nome);

            if (!PARAMETROS.includes(nomeCanonico)) {
                return;
            }

            resultado.parametros[nomeCanonico] =
                normalizarParametro(
                    parametrosOriginais[nome]
                );
        });

        return resultado;
    }

    function criarMagiaVazia() {

        return {

            id: gerarId(),

            nome: "",

            dominio: "",

            nivel: 1,

            nivel_nome: NIVEIS[1],

            categoria: "Truque",

            efeito: "",

            parametros: {

                alcance: [
                    {
                        valor: "",
                        modificador: 0
                    }
                ],

                duracao: [
                    {
                        valor: "",
                        modificador: 0
                    }
                ],

                tempo_conjuracao: [
                    {
                        valor: "",
                        modificador: 0
                    }
                ]
            },

            penalidade: 0,

            observacao: ""
        };
    }

    /* =========================================================
       VALIDAÇÃO
       ========================================================= */

    function validarMagia(magia) {

        const erros = [];
        const avisos = [];

        if (
            !magia.nome ||
            !String(magia.nome).trim()
        ) {
            erros.push(
                "Nome da magia não informado."
            );
        }

        if (!DOMINIOS.includes(magia.dominio)) {

            erros.push(
                "Domínio inválido ou não informado."
            );
        }

        const nivel = Number(magia.nivel);

        if (
            !Number.isInteger(nivel) ||
            !NIVEIS[nivel]
        ) {

            erros.push(
                "Nível inválido. O nível deve estar entre 1 e 5."
            );

        }
        else if (
            magia.nivel_nome !== NIVEIS[nivel]
        ) {

            avisos.push(
                `O nível ${nivel} corresponde a "${NIVEIS[nivel]}", ` +
                `mas nivel_nome está como "${magia.nivel_nome || "(vazio)"}".`
            );
        }

        if (!CATEGORIAS.includes(magia.categoria)) {

            erros.push(
                "Categoria inválida ou não informada."
            );
        }

        if (
            !magia.efeito ||
            !String(magia.efeito).trim()
        ) {

            avisos.push(
                "A magia não possui descrição de efeito."
            );
        }

        if (
            !magia.parametros ||
            typeof magia.parametros !== "object"
        ) {

            erros.push(
                "Objeto parametros ausente ou inválido."
            );

        }
        else {

            /* -----------------------------------------
               PARÂMETROS OBRIGATÓRIOS
               ----------------------------------------- */

            PARAMETROS_OBRIGATORIOS.forEach(nome => {

                const parametro =
                    magia.parametros[nome];

                /*
                 * IMPORTANTE:
                 *
                 * Ausente ≠ estrutura inválida.
                 *
                 * Se o parâmetro não existir,
                 * informamos que ele é obrigatório,
                 * mas não geramos o erro
                 * "deve ser um array".
                 */

                if (parametro === undefined) {

                    erros.push(
                        `Parâmetro obrigatório ausente: ${nomeParametro(nome)}.`
                    );

                    return;
                }

                /*
                 * Só aqui verificamos se é array.
                 */

                if (!Array.isArray(parametro)) {

                    erros.push(
                        `O parâmetro "${nomeParametro(nome)}" deve ser um array.`
                    );

                    return;
                }

                if (parametro.length !== 1) {

                    erros.push(
                        `O parâmetro obrigatório "${nomeParametro(nome)}" ` +
                        `deve possuir exatamente um item.`
                    );
                }

                parametro.forEach(
                    (item, indice) => {

                        validarItemParametro(
                            nome,
                            item,
                            indice,
                            erros
                        );
                    }
                );
            });

            /* -----------------------------------------
               DEMAIS PARÂMETROS
               ----------------------------------------- */

            Object.keys(magia.parametros)
                .forEach(nome => {

                    if (!PARAMETROS.includes(nome)) {

                        avisos.push(
                            `Parâmetro desconhecido: "${nome}".`
                        );

                        return;
                    }

                    /*
                     * Se o parâmetro existe,
                     * ele precisa ser array.
                     */

                    if (
                        !Array.isArray(
                            magia.parametros[nome]
                        )
                    ) {

                        erros.push(
                            `O parâmetro "${nomeParametro(nome)}" ` +
                            `deve ser um array.`
                        );

                        return;
                    }

                    magia.parametros[nome]
                        .forEach(
                            (item, indice) => {

                                validarItemParametro(
                                    nome,
                                    item,
                                    indice,
                                    erros
                                );
                            }
                        );
                });
        }

        const penalidadeCalculada =
            calcularPenalidade(magia);

        if (
            Number(magia.penalidade) !==
            penalidadeCalculada
        ) {

            avisos.push(
                `A penalidade armazenada (${magia.penalidade}) ` +
                `é diferente da penalidade calculada ` +
                `(${penalidadeCalculada}).`
            );
        }

        return {

            valido:
                erros.length === 0,

            erros,

            avisos,

            penalidadeCalculada
        };
    }

    function validarItemParametro(
        nome,
        item,
        indice,
        erros
    ) {

        if (
            !item ||
            typeof item !== "object"
        ) {

            erros.push(
                `${nomeParametro(nome)}: ` +
                `item ${indice + 1} inválido.`
            );

            return;
        }

        if (
            item.valor === undefined ||
            item.valor === null ||
            String(item.valor).trim() === ""
        ) {

            erros.push(
                `${nomeParametro(nome)}: ` +
                `valor não informado ` +
                `(item ${indice + 1}).`
            );
        }

        if (
            item.modificador === undefined ||
            item.modificador === null ||
            item.modificador === "" ||
            Number.isNaN(
                Number(item.modificador)
            )
        ) {

            erros.push(
                `${nomeParametro(nome)}: ` +
                `modificador inválido ` +
                `(item ${indice + 1}).`
            );
        }
    }

    /* =========================================================
       PENALIDADE
       ========================================================= */

    function calcularPenalidade(magia) {

        let total = 0;

        if (
            !magia.parametros ||
            typeof magia.parametros !== "object"
        ) {
            return 0;
        }

        Object.values(magia.parametros)
            .forEach(parametro => {

                if (!Array.isArray(parametro)) {
                    return;
                }

                parametro.forEach(item => {

                    const modificador =
                        Number(item?.modificador);

                    if (
                        !Number.isNaN(modificador)
                    ) {
                        total += modificador;
                    }
                });
            });

        /*
         * A penalidade nunca pode ser positiva.
         * Bônus apenas cancelam penalidades.
         */

        return Math.min(total, 0);
    }

    function calcularPMMinimo(magia) {

        const nivel = Number(magia.nivel);

        if (
            Number.isInteger(nivel) &&
            nivel >= 1 &&
            nivel <= 5
        ) {
            return nivel;
        }

        return "—";
    }

    /* =========================================================
       INTERFACE PRINCIPAL
       ========================================================= */

    function renderizar() {

        container.innerHTML = `

            <div class="gm-cabecalho">

                <div>

                    <h2>Gerador de Magias</h2>

                    <p class="gm-subtitulo">
                        Crie, edite, valide, importe e exporte
                        as magias do grimório.
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
            ></div>

            <div class="gm-layout">

                <aside class="gm-lista">

                    <div class="gm-lista-cabecalho">

                        <strong>Magias carregadas</strong>

                        <span
                            id="gm-contador"
                            class="gm-contador"
                        >
                            0
                        </span>

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

    /* =========================================================
       EVENTOS
       ========================================================= */

    function configurarEventos() {

        document
            .getElementById("gm-importar")
            .addEventListener(
                "click",
                () => {

                    document
                        .getElementById("gm-input-arquivo")
                        .click();
                }
            );

        document
            .getElementById("gm-input-arquivo")
            .addEventListener(
                "change",
                importarArquivo
            );

        document
            .getElementById("gm-nova-magia")
            .addEventListener(
                "click",
                novaMagia
            );

        document
            .getElementById("gm-exportar")
            .addEventListener(
                "click",
                exportarJSON
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

        contador.textContent =
            magias.length;

        if (magias.length === 0) {

            lista.innerHTML = `
                <div class="gm-lista-vazia">
                    Nenhuma magia carregada.
                </div>
            `;

            return;
        }

        lista.innerHTML =
            magias.map((magia, indice) => {

                const validacao =
                    validarMagia(magia);

                let classeStatus =
                    "gm-item-ok";

                let simbolo =
                    "✓";

                if (
                    validacao.erros.length > 0
                ) {

                    classeStatus =
                        "gm-item-erro";

                    simbolo =
                        "!";
                }
                else if (
                    validacao.avisos.length > 0
                ) {

                    classeStatus =
                        "gm-item-aviso";

                    simbolo =
                        "⚠";
                }

                return `

                    <button
                        type="button"
                        class="gm-item-magia
                        ${indice === indiceEdicao
                            ? "gm-item-selecionada"
                            : ""}
                        ${classeStatus}"
                        data-indice="${indice}"
                    >

                        <span class="gm-item-simbolo">
                            ${simbolo}
                        </span>

                        <span class="gm-item-conteudo">

                            <strong>
                                ${escaparHTML(
                                    magia.nome ||
                                    "(sem nome)"
                                )}
                            </strong>

                            <small>
                                ${escaparHTML(
                                    magia.dominio ||
                                    "Sem domínio"
                                )}
                                ·
                                Nível
                                ${escaparHTML(
                                    magia.nivel
                                )}
                            </small>

                        </span>

                    </button>
                `;

            }).join("");

        lista
            .querySelectorAll(
                ".gm-item-magia"
            )
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        indiceEdicao =
                            Number(
                                botao.dataset.indice
                            );

                        renderizarLista();

                        renderizarEditor();
                    }
                );
            });
    }

    /* =========================================================
       EDITOR
       ========================================================= */

    function renderizarEditor() {

        const editor =
            document.getElementById(
                "gm-editor"
            );

        if (indiceEdicao === null) {

            editor.innerHTML = `

                <div class="gm-editor-vazio">

                    <h2>Gerador de Magias</h2>

                    <p>
                        Selecione uma magia na lista
                        ou crie uma nova magia.
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
                .getElementById("gm-nova-vazia")
                .addEventListener(
                    "click",
                    novaMagia
                );

            return;
        }

        const magia =
            magias[indiceEdicao];

        if (!magia) {

            indiceEdicao = null;

            renderizarEditor();

            return;
        }

        editor.innerHTML = `

            <div class="gm-editor-cabecalho">

                <div>

                    <h2>
                        ${escaparHTML(
                            magia.nome ||
                            "Nova magia"
                        )}
                    </h2>

                    <div
                        id="gm-status-magia"
                        class="gm-status-magia"
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

                <section class="gm-secao-parametros">

                    <div class="gm-secao-titulo">

                        <div>

                            <h3>Parâmetros obrigatórios</h3>

                            <p>
                                Estes parâmetros devem possuir
                                exatamente um item.
                            </p>

                        </div>

                    </div>

                    ${PARAMETROS_OBRIGATORIOS
                        .map(nome =>
                            renderizarParametro(
                                magia,
                                nome,
                                true
                            )
                        )
                        .join("")}

                </section>

                ${renderizarParametrosAdicionais(magia)}

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
                    >${escaparHTML(
                        magia.observacao
                    )}</textarea>

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

    function renderizarDadosBasicos(magia) {

        return `

            <section class="gm-secao">

                <h3>Dados básicos</h3>

                <div class="gm-grid">

                    <div class="gm-campo gm-campo-largo">

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
                            value="${escaparHTML(
                                magia.nome
                            )}"
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

                            ${DOMINIOS.map(dominio => `
                                <option
                                    value="${escaparHTML(dominio)}"
                                    ${magia.dominio === dominio
                                        ? "selected"
                                        : ""}
                                >
                                    ${escaparHTML(dominio)}
                                </option>
                            `).join("")}

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

                            ${Object.entries(NIVEIS)
                                .map(([nivel, nome]) => `
                                    <option
                                        value="${nivel}"
                                        ${Number(magia.nivel) === Number(nivel)
                                            ? "selected"
                                            : ""}
                                    >
                                        ${nivel} — ${escaparHTML(nome)}
                                    </option>
                                `)
                                .join("")}

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
                            value="${escaparHTML(
                                magia.nivel_nome
                            )}"
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

                            ${CATEGORIAS
                                .map(categoria => `
                                    <option
                                        value="${escaparHTML(categoria)}"
                                        ${magia.categoria === categoria
                                            ? "selected"
                                            : ""}
                                    >
                                        ${escaparHTML(categoria)}
                                    </option>
                                `)
                                .join("")}

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
                    >${escaparHTML(
                        magia.efeito
                    )}</textarea>

                </div>

            </section>
        `;
    }

    /* =========================================================
       RESUMO
       ========================================================= */

    function renderizarResumo(magia) {

        const calculada =
            calcularPenalidade(magia);

        const pm =
            calcularPMMinimo(magia);

        const armazenada =
            Number(magia.penalidade);

        let classe =
            armazenada === calculada
                ? "gm-resumo-ok"
                : "gm-resumo-aviso";

        return `

            <section class="gm-resumo">

                <div class="gm-resumo-item">

                    <span>
                        Nível
                    </span>

                    <strong>
                        ${escaparHTML(
                            magia.nivel
                        )}
                    </strong>

                </div>

                <div class="gm-resumo-item">

                    <span>
                        PM mínimo
                    </span>

                    <strong>
                        ${escaparHTML(pm)}
                    </strong>

                </div>

                <div class="gm-resumo-item ${classe}">

                    <span>
                        Penalidade armazenada
                    </span>

                    <strong>
                        ${escaparHTML(
                            magia.penalidade
                        )}
                    </strong>

                </div>

                <div class="gm-resumo-item">

                    <span>
                        Penalidade calculada
                    </span>

                    <strong>
                        ${escaparHTML(
                            calculada
                        )}
                    </strong>

                </div>

            </section>
        `;
    }

    /* =========================================================
       PARÂMETROS ADICIONAIS
       ========================================================= */

    function renderizarParametrosAdicionais(magia) {

        const existentes =
            new Set(
                Object.keys(
                    magia.parametros || {}
                )
            );

        const disponiveis =
            PARAMETROS.filter(nome =>
                !existentes.has(nome)
            );

        return `

            <section class="gm-secao-parametros">

                <div class="gm-secao-titulo">

                    <div>

                        <h3>Parâmetros adicionais</h3>

                        <p>
                            Adicione somente os parâmetros
                            utilizados pela magia.
                        </p>

                    </div>

                </div>

                <div class="gm-botoes-adicionar">

                    ${
                        disponiveis.length === 0
                            ? `
                                <span class="gm-todos-adicionados">
                                    Todos os parâmetros estão adicionados.
                                </span>
                              `
                            : disponiveis
                                .map(nome => `
                                    <button
                                        type="button"
                                        class="gm-btn gm-btn-adicionar"
                                        data-adicionar-parametro="${nome}"
                                    >
                                        + ${escaparHTML(
                                            nomeParametro(nome)
                                        )}
                                    </button>
                                `)
                                .join("")
                    }

                </div>

                <div class="gm-parametros-opcionais">

                    ${PARAMETROS
                        .filter(nome =>
                            !PARAMETROS_OBRIGATORIOS
                                .includes(nome) &&
                            existentes.has(nome)
                        )
                        .map(nome =>
                            renderizarParametro(
                                magia,
                                nome,
                                false
                            )
                        )
                        .join("")}

                </div>

            </section>
        `;
    }

    /* =========================================================
       PARÂMETRO
       ========================================================= */

    function renderizarParametro(
        magia,
        nome,
        obrigatorio
    ) {

        const existe =
            magia.parametros &&
            Object.prototype.hasOwnProperty.call(
                magia.parametros,
                nome
            );

        /*
         * Parâmetro obrigatório ausente:
         * mostramos a situação e um botão
         * para corrigir diretamente.
         */

        if (!existe) {

            return `

                <div
                    class="gm-parametro gm-parametro-ausente"
                    data-parametro="${nome}"
                >

                    <div class="gm-parametro-cabecalho">

                        <div>

                            <h4>
                                ${escaparHTML(
                                    nomeParametro(nome)
                                )}
                            </h4>

                            <span class="gm-tag-obrigatorio">
                                Obrigatório
                            </span>

                        </div>

                    </div>

                    <div class="gm-parametro-alerta">

                        <span class="gm-alerta-icone">
                            ⚠
                        </span>

                        <span>
                            Parâmetro obrigatório ausente.
                        </span>

                    </div>

                    <button
                        type="button"
                        class="gm-btn gm-btn-adicionar"
                        data-adicionar-parametro="${nome}"
                    >
                        + Adicionar ${escaparHTML(
                            nomeParametro(nome)
                        )}
                    </button>

                </div>
            `;
        }

        const itens =
            Array.isArray(
                magia.parametros[nome]
            )
                ? magia.parametros[nome]
                : [];

        const multiplos =
            PARAMETROS_MULTIPLOS.includes(nome);

        return `

            <div
                class="gm-parametro"
                data-parametro="${nome}"
            >

                <div class="gm-parametro-cabecalho">

                    <div>

                        <h4>
                            ${escaparHTML(
                                nomeParametro(nome)
                            )}
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

                    ${
                        !obrigatorio
                            ? `
                                <button
                                    type="button"
                                    class="gm-btn gm-btn-remover"
                                    data-remover-parametro="${nome}"
                                >
                                    Remover
                                </button>
                              `
                            : ""
                    }

                </div>

                <div class="gm-itens-parametro">

                    ${
                        itens.length === 0
                            ? `
                                <div class="gm-parametro-vazio">
                                    Nenhum item informado.
                                </div>
                              `
                            : itens
                                .map(
                                    (item, indice) =>
                                        renderizarItemParametro(
                                            nome,
                                            item,
                                            indice,
                                            multiplos
                                        )
                                )
                                .join("")
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

    function renderizarItemParametro(
        nome,
        item,
        indice,
        multiplos
    ) {

        return `

            <div
                class="gm-item-parametro"
                data-item-parametro="${nome}"
                data-indice="${indice}"
            >

                <div class="gm-campo">

                    <label class="gm-label">
                        Valor
                    </label>

                    <input
                        type="text"
                        class="gm-input"
                        data-campo="valor"
                        value="${escaparHTML(
                            item.valor
                        )}"
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
                        value="${escaparHTML(
                            item.modificador
                        )}"
                    >

                </div>

                ${
                    multiplos
                        ? `
                            <button
                                type="button"
                                class="gm-btn gm-btn-remover-item"
                                data-remover-item="${nome}"
                                data-indice="${indice}"
                                title="Remover este item"
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

        const campos =
            editor.querySelectorAll(
                "input, textarea, select"
            );

        campos.forEach(campo => {

            campo.addEventListener(
                "input",
                atualizarMagiaDoFormulario
            );

            campo.addEventListener(
                "change",
                atualizarMagiaDoFormulario
            );
        });

        editor
            .querySelectorAll(
                "[data-adicionar-parametro]"
            )
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        adicionarParametro(
                            botao.dataset
                                .adicionarParametro
                        );
                    }
                );
            });

        editor
            .querySelectorAll(
                "[data-remover-parametro]"
            )
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        removerParametro(
                            botao.dataset
                                .removerParametro
                        );
                    }
                );
            });

        editor
            .querySelectorAll(
                "[data-adicionar-item]"
            )
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        adicionarItemParametro(
                            botao.dataset
                                .adicionarItem
                        );
                    }
                );
            });

        editor
            .querySelectorAll(
                "[data-remover-item]"
            )
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        removerItemParametro(
                            botao.dataset
                                .removerItem,
                            Number(
                                botao.dataset.indice
                            )
                        );
                    }
                );
            });

        document
            .getElementById("gm-salvar")
            .addEventListener(
                "click",
                salvarMagia
            );

        document
            .getElementById("gm-excluir")
            .addEventListener(
                "click",
                excluirMagia
            );
    }

    /* =========================================================
       ATUALIZAR FORMULÁRIO
       ========================================================= */

    function atualizarMagiaDoFormulario() {

        if (indiceEdicao === null) {
            return;
        }

        const magia =
            magias[indiceEdicao];

        if (!magia) {
            return;
        }

        magia.nome =
            document.getElementById(
                "gm-nome"
            )?.value || "";

        magia.dominio =
            document.getElementById(
                "gm-dominio"
            )?.value || "";

        magia.nivel =
            Number(
                document.getElementById(
                    "gm-nivel"
                )?.value
            );

        magia.nivel_nome =
            document.getElementById(
                "gm-nivel-nome"
            )?.value || "";

        magia.categoria =
            document.getElementById(
                "gm-categoria"
            )?.value || "";

        magia.efeito =
            document.getElementById(
                "gm-efeito"
            )?.value || "";

        magia.observacao =
            document.getElementById(
                "gm-observacao"
            )?.value || "";

        /*
         * Atualiza os itens de parâmetros
         * existentes no formulário.
         */

        document
            .querySelectorAll(
                "#gm-editor [data-item-parametro]"
            )
            .forEach(bloco => {

                const nome =
                    bloco.dataset.itemParametro;

                const indice =
                    Number(
                        bloco.dataset.indice
                    );

                if (
                    !magia.parametros[nome] ||
                    !magia.parametros[nome][indice]
                ) {
                    return;
                }

                const valor =
                    bloco.querySelector(
                        '[data-campo="valor"]'
                    );

                const modificador =
                    bloco.querySelector(
                        '[data-campo="modificador"]'
                    );

                magia.parametros[nome][indice]
                    .valor =
                    valor?.value || "";

                magia.parametros[nome][indice]
                    .modificador =
                    Number(
                        modificador?.value
                    );

                if (
                    Number.isNaN(
                        magia.parametros[nome][indice]
                            .modificador
                    )
                ) {

                    magia.parametros[nome][indice]
                        .modificador = 0;
                }
            });

        atualizarResumoSemRecriar();
    }

    function atualizarResumoSemRecriar() {

        const magia =
            magias[indiceEdicao];

        if (!magia) {
            return;
        }

        const calculada =
            calcularPenalidade(magia);

        const pm =
            calcularPMMinimo(magia);

        const resumo =
            document.querySelector(
                "#gm-editor .gm-resumo"
            );

        if (!resumo) {
            return;
        }

        const valores =
            resumo.querySelectorAll(
                ".gm-resumo-item strong"
            );

        if (valores[0]) {
            valores[0].textContent =
                magia.nivel;
        }

        if (valores[1]) {
            valores[1].textContent =
                pm;
        }

        if (valores[2]) {
            valores[2].textContent =
                magia.penalidade;

            valores[2]
                .parentElement
                .classList.toggle(
                    "gm-resumo-ok",
                    Number(magia.penalidade) ===
                    calculada
                );

            valores[2]
                .parentElement
                .classList.toggle(
                    "gm-resumo-aviso",
                    Number(magia.penalidade) !==
                    calculada
                );
        }

        if (valores[3]) {
            valores[3].textContent =
                calculada;
        }

        renderizarValidacao();
    }

    /* =========================================================
       ADICIONAR / REMOVER PARÂMETRO
       ========================================================= */

    function adicionarParametro(nome) {

        if (!PARAMETROS.includes(nome)) {
            return;
        }

        const magia =
            magias[indiceEdicao];

        if (!magia) {
            return;
        }

        if (
            magia.parametros[nome] !== undefined
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
    }

    function removerParametro(nome) {

        const magia =
            magias[indiceEdicao];

        if (!magia) {
            return;
        }

        /*
         * Parâmetros obrigatórios não podem
         * ser removidos.
         */

        if (
            PARAMETROS_OBRIGATORIOS.includes(nome)
        ) {
            return;
        }

        delete magia.parametros[nome];

        renderizarEditor();
    }

    /* =========================================================
       ITENS
       ========================================================= */

    function adicionarItemParametro(nome) {

        const magia =
            magias[indiceEdicao];

        if (!magia) {
            return;
        }

        if (
            !PARAMETROS_MULTIPLOS.includes(nome)
        ) {
            return;
        }

        if (!Array.isArray(
            magia.parametros[nome]
        )) {
            magia.parametros[nome] = [];
        }

        magia.parametros[nome].push({

            valor: "",

            modificador: 0

        });

        renderizarEditor();
    }

    function removerItemParametro(
        nome,
        indice
    ) {

        const magia =
            magias[indiceEdicao];

        if (!magia) {
            return;
        }

        if (
            !Array.isArray(
                magia.parametros[nome]
            )
        ) {
            return;
        }

        if (
            indice < 0 ||
            indice >=
                magia.parametros[nome].length
        ) {
            return;
        }

        magia.parametros[nome]
            .splice(indice, 1);

        renderizarEditor();
    }

    /* =========================================================
       VALIDAÇÃO VISUAL
       ========================================================= */

    function renderizarValidacao() {

        if (indiceEdicao === null) {
            return;
        }

        const magia =
            magias[indiceEdicao];

        if (!magia) {
            return;
        }

        const resultado =
            validarMagia(magia);

        const area =
            document.getElementById(
                "gm-validacao"
            );

        const status =
            document.getElementById(
                "gm-status-magia"
            );

        if (!area || !status) {
            return;
        }

        let classe;
        let titulo;

        if (resultado.erros.length > 0) {

            classe =
                "gm-validacao-erro";

            titulo =
                "Magia com erros";

        }
        else if (
            resultado.avisos.length > 0
        ) {

            classe =
                "gm-validacao-aviso";

            titulo =
                "Magia válida com avisos";

        }
        else {

            classe =
                "gm-validacao-ok";

            titulo =
                "Magia válida";
        }

        status.className =
            `gm-status-magia ${classe}`;

        status.textContent =
            titulo;

        let html = "";

        if (resultado.erros.length > 0) {

            html += `

                <div class="gm-caixa-validacao gm-caixa-erro">

                    <strong>
                        Erros
                    </strong>

                    <ul>
                        ${resultado.erros
                            .map(erro => `
                                <li>
                                    ${escaparHTML(erro)}
                                </li>
                            `)
                            .join("")}
                    </ul>

                </div>
            `;
        }

        if (resultado.avisos.length > 0) {

            html += `

                <div class="gm-caixa-validacao gm-caixa-aviso">

                    <strong>
                        Avisos
                    </strong>

                    <ul>
                        ${resultado.avisos
                            .map(aviso => `
                                <li>
                                    ${escaparHTML(aviso)}
                                </li>
                            `)
                            .join("")}
                    </ul>

                </div>
            `;
        }

        if (
            resultado.erros.length === 0 &&
            resultado.avisos.length === 0
        ) {

            html = `

                <div class="gm-caixa-validacao gm-caixa-ok">

                    <strong>
                        ✓ Todos os dados estão válidos.
                    </strong>

                </div>
            `;
        }

        area.innerHTML = html;
    }

    /* =========================================================
       NOVA MAGIA
       ========================================================= */

    function novaMagia() {

        const magia =
            criarMagiaVazia();

        magias.push(magia);

        indiceEdicao =
            magias.length - 1;

        renderizarLista();

        renderizarEditor();

        mostrarStatus(
            "Nova magia criada.",
            "sucesso"
        );
    }

    /* =========================================================
       SALVAR
       ========================================================= */

    function salvarMagia() {

        if (indiceEdicao === null) {
            return;
        }

        atualizarMagiaDoFormulario();

        const magia =
            magias[indiceEdicao];

        const resultado =
            validarMagia(magia);

        /*
         * Não impedimos o salvamento por avisos,
         * mas erros impedem a exportação.
         */

        renderizarLista();

        renderizarEditor();

        if (resultado.erros.length > 0) {

            mostrarStatus(
                "Alterações salvas em memória, mas a magia possui erros.",
                "erro"
            );

        }
        else if (
            resultado.avisos.length > 0
        ) {

            mostrarStatus(
                "Alterações salvas com avisos.",
                "aviso"
            );

        }
        else {

            mostrarStatus(
                "Magia salva e validada.",
                "sucesso"
            );
        }
    }

    /* =========================================================
       EXCLUIR
       ========================================================= */

    function excluirMagia() {

        if (indiceEdicao === null) {
            return;
        }

        const magia =
            magias[indiceEdicao];

        const nome =
            magia?.nome ||
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
            null;

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

    async function importarArquivo(evento) {

        const arquivo =
            evento.target.files?.[0];

        if (!arquivo) {
            return;
        }

        try {

            const texto =
                await arquivo.text();

            const dados =
                JSON.parse(texto);

            let lista;

            if (Array.isArray(dados)) {

                lista = dados;

            }
            else if (
                dados &&
                Array.isArray(dados.magias)
            ) {

                lista =
                    dados.magias;

            }
            else {

                throw new Error(
                    "O JSON não contém um array de magias."
                );
            }

            magias =
                lista.map(normalizarMagia);

            indiceEdicao =
                magias.length > 0
                    ? 0
                    : null;

            renderizarLista();

            renderizarEditor();

            mostrarStatus(
                `${magias.length} magia(s) importada(s).`,
                "sucesso"
            );

        }
        catch (erro) {

            console.error(erro);

            mostrarStatus(
                "Erro ao importar JSON: " +
                erro.message,
                "erro"
            );

        }
        finally {

            evento.target.value = "";
        }
    }

    /* =========================================================
       EXPORTAÇÃO
       ========================================================= */

    function exportarJSON() {

        if (magias.length === 0) {

            mostrarStatus(
                "Não há magias para exportar.",
                "aviso"
            );

            return;
        }

        /*
         * Atualiza a magia atualmente editada
         * antes da exportação.
         */

        if (indiceEdicao !== null) {
            atualizarMagiaDoFormulario();
        }

        let totalErros = 0;
        let totalAvisos = 0;

        magias.forEach(magia => {

            const resultado =
                validarMagia(magia);

            totalErros +=
                resultado.erros.length;

            totalAvisos +=
                resultado.avisos.length;
        });

        if (totalErros > 0) {

            const continuar =
                confirm(
                    `Existem ${totalErros} erro(s) ` +
                    `de validação em ${magias.length} magia(s).\n\n` +
                    `Deseja exportar mesmo assim?`
                );

            if (!continuar) {
                return;
            }
        }

        const dados =
            magias.map(magia =>
                prepararParaExportacao(magia)
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
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "grimorio-gerado.json";

        document
            .body
            .appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

        mostrarStatus(
            `JSON exportado com ${magias.length} magia(s). ` +
            (
                totalAvisos > 0
                    ? `${totalAvisos} aviso(s) foram detectados.`
                    : ""
            ),
            totalErros > 0
                ? "aviso"
                : "sucesso"
        );
    }

    function prepararParaExportacao(magia) {

        const resultado = {
            id: magia.id,
            nome: magia.nome,
            dominio: magia.dominio,
            nivel: magia.nivel,
            nivel_nome: magia.nivel_nome,
            categoria: magia.categoria,
            efeito: magia.efeito,
            parametros: {},
            penalidade: magia.penalidade,
            observacao: magia.observacao
        };

        Object.keys(magia.parametros || {})
            .forEach(nome => {

                if (
                    !PARAMETROS.includes(nome)
                ) {
                    return;
                }

                const parametro =
                    magia.parametros[nome];

                /*
                 * Só exporta parâmetros presentes.
                 * Parâmetros ausentes não são inventados.
                 */

                if (!Array.isArray(parametro)) {
                    return;
                }

                resultado.parametros[nome] =
                    parametro.map(item => {

                        const novoItem = {
                            valor:
                                item.valor ?? "",
                            modificador:
                                Number(
                                    item.modificador
                                ) || 0
                        };

                        if (
                            item.detalhes &&
                            typeof item.detalhes ===
                                "object"
                        ) {

                            novoItem.detalhes =
                                clone(
                                    item.detalhes
                                );
                        }

                        return novoItem;
                    });
            });

        return resultado;
    }

    /* =========================================================
       STATUS GLOBAL
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
            setTimeout(() => {

                status.textContent =
                    "";

                status.className =
                    "gm-status";

            }, 5000);
    }

    
    /* =========================================================
       INICIALIZAÇÃO
       ========================================================= */

    renderizar();

});