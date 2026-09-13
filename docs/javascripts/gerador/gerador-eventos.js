/* =========================================================
   EVENTOS DA INTERFACE PRINCIPAL
   ========================================================= */

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
            evento => {
                if (typeof importarArquivo === "function") {
                    importarArquivo(evento);
                }
            }
        );


    document
        .getElementById(
            "gm-nova-magia"
        )
        ?.addEventListener(
            "click",
            () => {
                if (typeof novaMagia === "function") {
                    novaMagia();
                }
            }
        );


    document
        .getElementById(
            "gm-exportar"
        )
        ?.addEventListener(
            "click",
            () => {
                if (typeof exportarJSON === "function") {
                    exportarJSON();
                }
            }
        );


    document
        .getElementById(
            "gm-grimorio"
        )
        ?.addEventListener(
            "click",
            () => {
                if (typeof visualizarGrimorio === "function") {
                    visualizarGrimorio();
                }
            }
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


    // Listener dinâmico para mudança de Categoria (Regra de Tempo de Conjuração Automático)
    const selectCategoria = document.getElementById("gm-categoria");
    if (selectCategoria) {
        selectCategoria.addEventListener("change", () => {
            if (indiceEdicao === null) return;
            const magia = magias[indiceEdicao];
            const novaCat = selectCategoria.value;
            magia.categoria = novaCat;

            if (magia.parametros && magia.parametros.tempo_conjuracao && magia.parametros.tempo_conjuracao[0]) {
                if (novaCat === "Truque" || novaCat === "Feitiço") {
                    magia.parametros.tempo_conjuracao[0].valor = "1 segundo";
                } else if (novaCat === "Ritual") {
                    magia.parametros.tempo_conjuracao[0].valor = "1 minuto";
                }
                magia.parametros.tempo_conjuracao[0].modificador = calcularModificadorItem("tempo_conjuracao", magia.parametros.tempo_conjuracao[0]);
            }

            renderizarEditor();
        });
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


                if (
                    valorCampo &&
                    nome !== "dano"
                ) {

                    item.valor =
                        valorCampo.value;
                }


                const detalhes = {};


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