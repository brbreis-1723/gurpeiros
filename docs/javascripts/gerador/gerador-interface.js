/* =========================================================
   INTERFACE PRINCIPAL
   ========================================================= */

function renderizar() {

    const container =
        document.getElementById("gerador-magias");

    if (!container) {
        return;
    }

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


                <button
                    type="button"
                    class="gm-btn gm-btn-secundario"
                    id="gm-grimorio"
                >
                    Visualizar Grimório
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
                id="gm-lista"
            >
                <!-- Preenchido dinamicamente -->
            </aside>

            <main
                class="gm-editor"
                id="gm-editor"
            >
                <!-- Preenchido dinamicamente -->
            </main>

        </div>
    `;

    configurarEventos();

    renderizarLista();

    if (
        magias.length > 0 &&
        indiceEdicao === null
    ) {
        selecionarMagia(0);
    } else {
        renderizarEditor();
    }
}


/* =========================================================
   LISTA LATERAL DE MAGIAS
   ========================================================= */

function renderizarLista() {

    const lista =
        document.getElementById(
            "gm-lista"
        );


    if (!lista) {
        return;
    }


    const filtradas =
        magias
            .map((magia, indice) => ({
                magia,
                indice
            }))
            .filter(({ magia }) => {

                if (!filtroLista) {
                    return true;
                }


                const texto =
                    `${magia.nome} ${magia.dominio} ${magia.nivel} ${magia.categoria}`
                        .toLowerCase();


                return texto.includes(
                    filtroLista.toLowerCase()
                );
            });


    if (
        magias.length === 0
    ) {

        lista.innerHTML = `
            <div class="gm-lista-cabecalho">
                <strong>Grimório</strong>
                <span class="gm-contador">0</span>
            </div>
            <div class="gm-lista-vazia">
                Nenhuma magia criada.
            </div>
        `;

        return;
    }


    let html = `
        <div class="gm-lista-cabecalho">
            <strong>Grimório</strong>
            <span class="gm-contador">
                ${filtradas.length}
            </span>
        </div>
    `;


    if (
        filtradas.length === 0
    ) {

        html += `
            <div class="gm-lista-vazia">
                Nenhuma magia encontrada.
            </div>
        `;

        lista.innerHTML = html;

        return;
    }


    html += filtradas
        .map(({ magia, indice }) => {

            const selecionada =
                indice === indiceEdicao;


            const validacao =
                validarMagia(magia);


            let classeSimbolo =
                "gm-item-ok";

            let simbolo = "✓";


            if (
                validacao.erros.length > 0
            ) {

                classeSimbolo =
                    "gm-item-erro";

                simbolo = "✕";

            } else if (
                validacao.avisos.length > 0
            ) {

                classeSimbolo =
                    "gm-item-aviso";

                simbolo = "⚠";
            }


            return `
                <button
                    type="button"
                    class="gm-item-magia ${
                        selecionada
                            ? "gm-item-selecionada"
                            : ""
                    } ${classeSimbolo}"
                    data-indice="${indice}"
                >
                    <span class="gm-item-simbolo">
                        ${simbolo}
                    </span>

                    <span class="gm-item-conteudo">
                        <strong>
                            ${
                                escaparHTML(
                                    magia.nome ||
                                    "Magia sem nome"
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
                            • Nível ${
                                magia.nivel
                            }
                            • ${
                                escaparHTML(
                                    magia.categoria ||
                                    "Sem categoria"
                                )
                            }
                        </small>
                    </span>
                </button>
            `;
        })
        .join("");


    lista.innerHTML = html;


    lista.querySelectorAll(
        ".gm-item-magia"
    )
    .forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                const indice =
                    Number(
                        botao.dataset
                            .indice
                    );

                selecionarMagia(
                    indice
                );
            }
        );
    });
}


/* =========================================================
   EDITOR DE MAGIAS
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
        indiceEdicao === null ||
        !magias[indiceEdicao]
    ) {

        editor.innerHTML = `
            <div class="gm-editor-vazio">
                <h2>Nenhuma magia selecionada</h2>
                <p>Crie uma nova magia ou selecione uma existente na lista ao lado.</p>
                <button
                    type="button"
                    class="gm-btn gm-btn-primario gm-btn-adicionar"
                    onclick="novaMagia()"
                >
                    + Criar nova magia
                </button>
            </div>
        `;

        return;
    }


    const magia =
        magias[indiceEdicao];


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
                <p class="gm-subtitulo">
                    Edite os parâmetros, verifique o custo e valide as regras de domínio.
                </p>
            </div>

            <div class="gm-acoes-editor">
                <button
                    type="button"
                    class="gm-btn gm-btn-secundario"
                    id="gm-duplicar"
                >
                    Duplicar
                </button>

                <button
                    type="button"
                    class="gm-btn gm-btn-perigo gm-btn-remover"
                    id="gm-excluir"
                >
                    Excluir
                </button>

                <button
                    type="button"
                    class="gm-btn gm-btn-primario"
                    id="gm-salvar"
                >
                    Salvar alterações
                </button>
            </div>
        </div>

        <form class="gm-form" onsubmit="return false;">
            ${renderizarDadosBasicos(magia)}
            ${renderizarResumo(magia)}
            ${renderizarParametrosOpcionais(magia)}
            ${renderizarSecaoValidacao(magia)}
        </form>
    `;

    configurarEventosEditor();

    renderizarValidacao();
}


/* =========================================================
   DADOS BÁSICOS (Com suporte a Nível 0 / Sem nível para Truques)
   ========================================================= */

function renderizarDadosBasicos(
    magia
) {
    const eTruque = magia.categoria === "Truque" || magia.categoria === "truque" || Number(magia.nivel) === 0;

    let nivelNum = Number(magia.nivel);
    let nomeNivelAutomatico = "";

    if (eTruque) {
        magia.nivel = 0;
        magia.nivel_nome = "Sem nível";
        nivelNum = 0;
        nomeNivelAutomatico = "Sem nível";
    } else {
        if (!Number.isInteger(nivelNum) || nivelNum < 1 || nivelNum > 5) {
            nivelNum = 1;
            magia.nivel = 1;
        }
        nomeNivelAutomatico = NIVEIS[nivelNum] || magia.nivel_nome || "";
        magia.nivel_nome = nomeNivelAutomatico;
    }

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
                        ${eTruque ? "disabled title='Truques possuem nível fixo Sem nível'" : ""}
                    >

                        ${
                            eTruque
                                ? `<option value="0" selected>0 — Sem nível</option>`
                                : Object.entries(NIVEIS)
                                    .map(([nivel, nome]) => `
                                        <option
                                            value="${nivel}"
                                            ${Number(magia.nivel) === Number(nivel) ? "selected" : ""}
                                        >
                                            ${nivel} —${escaparHTML(nome)}
                                        </option>
                                    `)
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
                                nomeNivelAutomatico
                            )
                        }"
                        readonly
                        title="Preenchido automaticamente pelo nível selecionado"
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


            <div class="gm-campo gm-campo-largo">

                <label
                    for="gm-efeito"
                    class="gm-label"
                >
                    Efeito / Descrição
                </label>


                <textarea
                    id="gm-efeito"
                    class="gm-input gm-textarea"
                >${
                    escaparHTML(
                        magia.efeito
                    )
                }</textarea>

            </div>


            <div class="gm-campo gm-campo-largo" style="margin-top: 14px;">

                <label
                    for="gm-observacao"
                    class="gm-label"
                >
                    Observações (Opcional)
                </label>


                <textarea
                    id="gm-observacao"
                    class="gm-input gm-textarea"
                    placeholder="Notas adicionais sobre a execução, restrições ou lore da magia..."
                >${
                    escaparHTML(
                        magia.observacao ||
                        ""
                    )
                }</textarea>

            </div>

        </section>
    `;
}


/* =========================================================
   RESUMO
   ========================================================= */

function renderizarResumo(magia) {

    const pmMinimo =
        calcularPMMinimo(magia);


    const penalidadeCalculada =
        calcularPenalidade(magia);


    const penalidadeArmazenada =
        numero(
            magia.penalidade
        );


    const penalidadeOk =
        penalidadeArmazenada ===
        penalidadeCalculada;


    return `

        <section class="gm-secao">

            <h3>
                Resumo e Custos
            </h3>

            <p>
                Valores calculados automaticamente com base no nível e nos parâmetros configurados.
            </p>


            <div class="gm-resumo">

                <div class="gm-resumo-item">
                    <span>Nível</span>
                    <strong>${
                        magia.categoria === "Truque" ? "Sem nível" : magia.nivel
                    }</strong>
                </div>

                <div class="gm-resumo-item">
                    <span>Custo PM Mínimo</span>
                    <strong>${pmMinimo}</strong>
                </div>

                <div class="gm-resumo-item ${
                    penalidadeOk
                        ? "gm-resumo-ok"
                        : "gm-resumo-aviso"
                }">
                    <span>Penalidade Armazenada</span>
                    <strong>${
                        magia.penalidade
                    }</strong>
                </div>

                <div class="gm-resumo-item">
                    <span>Penalidade Calculada</span>
                    <strong>${
                        penalidadeCalculada
                    }</strong>
                </div>

            </div>


            <div style="margin-top: 14px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <button
                    type="button"
                    class="gm-btn gm-btn-secundario"
                    id="gm-aplicar-penalidade"
                >
                    Aplicar penalidade calculada (${penalidadeCalculada})
                </button>

                <small style="opacity: 0.7;">
                    Clique para sincronizar a penalidade armazenada com o valor calculado pelos parâmetros.
                </small>
            </div>

        </section>
    `;
}


/* =========================================================
   PARÂMETROS OPCIONAIS
   ========================================================= */

function renderizarParametrosOpcionais(
    magia
) {

    const parametrosAtuais =
        magia.parametros || {};


    const disponiveis =
        PARAMETROS.filter(
            nome =>
                !parametrosAtuais[nome]
        );


    return `

        <section class="gm-secao-parametros">

            <h3>
                Parâmetros da Magia
            </h3>

            <p>
                Os parâmetros obrigatórios (Alcance, Duração e Tempo de Conjuração) e opcionais adicionados compõem o perfil da magia.
            </p>


            <div class="gm-parametros-opcionais">
                ${
                    PARAMETROS
                        .map(nome => {

                            const lista =
                                parametrosAtuais[
                                    nome
                                ];


                            if (
                                lista === undefined
                            ) {
                                return "";
                            }


                            const obrigatorio =
                                PARAMETROS_OBRIGATORIOS
                                    .includes(
                                        nome
                                    );


                            return renderizarBlocoParametro(
                                nome,
                                lista,
                                obrigatorio,
                                magia
                            );
                        })
                        .join("")
                }
            </div>


            <div style="margin-top: 20px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">

                <select
                    id="gm-seletor-parametro"
                    class="gm-input"
                    style="max-width: 280px;"
                >
                    <option value="">
                        Selecione um parâmetro para adicionar...
                    </option>

                    ${
                        disponiveis
                            .map(
                                nome => `
                                    <option
                                        value="${nome}"
                                    >
                                        ${
                                            escaparHTML(
                                                nomeParametro(
                                                    nome
                                                )
                                            )
                                        }
                                    </option>
                                `
                            )
                            .join("")
                    }

                </select>


                <button
                    type="button"
                    class="gm-btn gm-btn-secundario"
                    id="gm-adicionar-parametro"
                >
                    + Adicionar parâmetro
                </button>

            </div>

        </section>
    `;
}


function renderizarBlocoParametro(
    nome,
    lista,
    obrigatorio,
    magia
) {

    const ehTruque = magia.categoria === "Truque" || magia.categoria === "truque";
    const titulo =
        nomeParametro(nome);


    let alertaHtml = "";

    const tabela =
        tabelas[
            CHAVES_TABELAS[nome]
        ];


    if (
        !tabela &&
        nome !== "dano"
    ) {

        alertaHtml = `
            <div class="gm-parametro-alerta">
                <span class="gm-alerta-icone">⚠</span>
                <span>Tabela de referência para "${escaparHTML(titulo)}" não encontrada em modificadores_tabelas.json.</span>
            </div>
        `;
    }


    const multiplo =
        PARAMETROS_MULTIPLOS
            .includes(nome);


    return `
        <div
            class="gm-parametro ${
                lista.length === 0
                    ? "gm-parametro-ausente"
                    : ""
            }"
            data-parametro="${escaparSeletor(
                nome
            )}"
        >

            <div class="gm-parametro-cabecalho">

                <div>
                    <h4>
                        ${escaparHTML(
                            titulo
                        )}
                    </h4>

                    ${
                        obrigatorio
                            ? '<span class="gm-tag-obrigatorio">Obrigatório</span>'
                            : ""
                    }
                </div>


                ${
                    !obrigatorio
                        ? `
                            <button
                                type="button"
                                class="gm-btn gm-btn-perigo gm-btn-remover"
                                data-remover-parametro="${escaparSeletor(
                                    nome
                                )}"
                            >
                                Remover
                            </button>
                        `
                        : ""
                }

            </div>


            ${alertaHtml}


            <div class="gm-itens-parametro">
                ${
                    lista.length === 0
                        ? `
                            <div class="gm-parametro-vazio">
                                Nenhum item configurado.
                            </div>
                        `
                        : lista
                            .map(
                                (
                                    item,
                                    indice
                                ) =>
                                    renderizarItemParametro(
                                        nome,
                                        item,
                                        indice,
                                        tabela,
                                        ehTruque && nome === "tempo_conjuracao"
                                    )
                            )
                            .join("")
                }
            </div>


            ${
                multiplo
                    ? `
                        <div style="margin-top: 10px;">
                            <button
                                type="button"
                                class="gm-btn gm-btn-secundario"
                                data-adicionar-item="${escaparSeletor(
                                    nome
                                )}"
                            >
                                + Adicionar item em ${escaparHTML(
                                    titulo
                                )}
                            </button>
                        </div>
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
    tabela,
    tempoInibidoTruque = false
) {

    let opcoesHtml = "";

    if (
        tabela &&
        Array.isArray(
            tabela.opcoes
        )
    ) {

        opcoesHtml =
            tabela.opcoes
                .map(opcao => {

                    const texto =
                        opcao.opcao ??
                        "";


                    return `
                        <option
                            value="${escaparHTML(
                                texto
                            )}"
                            ${
                                item.valor ===
                                texto
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${escaparHTML(
                                texto
                            )}
                        </option>
                    `;
                })
                .join("");
    }


    let campoValorHtml = "";


    if (
        nome === "dano"
    ) {

        const qtdD6 =
            item.detalhes
                ?.quantidade_d6 ??
            (
                typeof item.valor ===
                "number"
                    ? item.valor
                    : 1
            );


        campoValorHtml = `
            <div class="gm-campo">
                <label class="gm-label">Quantidade de d6</label>
                <input
                    type="number"
                    min="1"
                    class="gm-input"
                    data-detalhe="quantidade_d6"
                    value="${qtdD6}"
                >
            </div>
        `;

    } else if (
        tabela &&
        Array.isArray(
            tabela.opcoes
        ) &&
        tabela.opcoes.length > 0
    ) {

        campoValorHtml = `
            <div class="gm-campo">
                <label class="gm-label">Opção da Tabela</label>
                <select
                    class="gm-input"
                    data-campo="valor"
                >
                    <option value="">
                        Selecione...
                    </option>
                    ${opcoesHtml}
                </select>
            </div>
        `;

    } else {

        campoValorHtml = `
            <div class="gm-campo">
                <label class="gm-label">Valor</label>
                <input
                    type="text"
                    class="gm-input"
                    data-campo="valor"
                    value="${escaparHTML(
                        item.valor ?? ""
                    )}"
                    ${tempoInibidoTruque ? "disabled title='Definido automaticamente para Truques'" : ""}
                >
            </div>
        `;
    }


    const detalhesHtml =
        renderizarDetalhesItem(
            nome,
            item
        );


    const calculado =
        calcularModificadorItem(
            nome,
            item
        );


    const valorModificador =
        calculado !== null
            ? calculado
            : numero(
                item.modificador,
                0
            );


    return `
        <div
            class="gm-item-parametro"
            data-item-parametro="${escaparSeletor(
                nome
            )}"
            data-indice="${indice}"
        >
            ${campoValorHtml}

            ${detalhesHtml}

            <div class="gm-campo gm-campo-modificador">
                <label class="gm-label">Modificador</label>
                <input
                    type="number"
                    class="gm-input"
                    data-campo="modificador"
                    value="${valorModificador}"
                    readonly
                    title="Calculado automaticamente"
                >
            </div>

            ${
                indice > 0 ||
                PARAMETROS_MULTIPLOS.includes(
                    nome
                )
                    ? `
                        <button
                            type="button"
                            class="gm-btn gm-btn-perigo gm-btn-remover-item"
                            data-remover-item="${escaparSeletor(
                                nome
                            )}"
                            data-indice="${indice}"
                            title="Remover item"
                        >
                            ✕
                        </button>
                    `
                    : '<div style="width: 34px;"></div>'
            }
        </div>
    `;
}


function renderizarDetalhesItem(
    nome,
    item
) {

    const detalhes =
        item.detalhes || {};


    if (
        nome ===
        "caracteristicas_alteradas"
    ) {

        return `
            <div class="gm-campo">
                <label class="gm-label">Pontos (5 pts = -1)</label>
                <input
                    type="number"
                    min="1"
                    class="gm-input"
                    data-detalhe="pontos"
                    value="${
                        detalhes.pontos ??
                        ""
                    }"
                >
            </div>
            <div class="gm-campo">
                <label class="gm-label">Atributo / Alvo</label>
                <input
                    type="text"
                    class="gm-input"
                    data-detalhe="alvo"
                    value="${escaparHTML(
                        detalhes.alvo ??
                        ""
                    )}"
                    placeholder="Ex: Força, Destreza..."
                >
            </div>
        `;
    }


    if (
        nome === "conceder_bonus"
    ) {

        return `
            <div class="gm-campo">
                <label class="gm-label">Detalhe / Perícia</label>
                <input
                    type="text"
                    class="gm-input"
                    data-detalhe="alvo"
                    value="${escaparHTML(
                        detalhes.alvo ??
                        ""
                    )}"
                    placeholder="Ex: Perícia Acrobacia"
                >
            </div>
        `;
    }


    if (
        nome === "cura"
    ) {

        const opcao =
            encontrarOpcao(
                nome,
                item.valor
            );


        const texto =
            String(
                opcao?.modificador ??
                ""
            );


        if (
            texto.includes(
                "2 PF"
            )
        ) {

            return `
                <div class="gm-campo">
                    <label class="gm-label">Qtd PF</label>
                    <input
                        type="number"
                        min="1"
                        class="gm-input"
                        data-detalhe="qtd_pf"
                        value="${
                            detalhes.qtd_pf ??
                            detalhes.quantidade ??
                            1
                        }"
                    >
                </div>
            `;
        }


        if (
            texto.includes(
                "1d6 PV"
            )
        ) {

            return `
                <div class="gm-campo">
                    <label class="gm-label">PV (d6)</label>
                    <input
                        type="number"
                        min="1"
                        class="gm-input"
                        data-detalhe="pv_d6"
                        value="${
                            detalhes.pv_d6 ??
                            detalhes.quantidade ??
                            1
                        }"
                    >
                </div>
            `;
        }
    }


    if (
        nome ===
        "modificadores_ataque"
    ) {

        const valorString =
            String(
                item.valor || ""
            ).toLowerCase();


        if (
            valorString.startsWith("cone")
        ) {

            return `
                <div class="gm-campo">
                    <label class="gm-label">Base (metros)</label>
                    <input
                        type="number"
                        min="1"
                        class="gm-input"
                        data-detalhe="base_metros"
                        value="${
                            detalhes.base_metros ??
                            1
                        }"
                    >
                </div>
            `;
        }


        if (
            valorString.includes(
                "fragmentação"
            ) ||
            valorString.includes(
                "fragmentacao"
            )
        ) {

            return `
                <div class="gm-campo">
                    <label class="gm-label">Qtd d6</label>
                    <input
                        type="number"
                        min="1"
                        class="gm-input"
                        data-detalhe="quantidade_d6"
                        value="${
                            detalhes.quantidade_d6 ??
                            1
                        }"
                    >
                </div>
            `;
        }


        const opcao =
            encontrarOpcao(
                nome,
                item.valor
            );


        const texto =
            String(
                opcao?.modificador ??
                ""
            );


        if (
            texto
                .toLowerCase()
                .includes("ciclo")
        ) {

            return `
                <div class="gm-campo">
                    <label class="gm-label">Ciclos</label>
                    <input
                        type="number"
                        min="1"
                        class="gm-input"
                        data-detalhe="quantidade_ciclos"
                        value="${
                            detalhes.quantidade_ciclos ??
                            detalhes.quantidade ??
                            1
                        }"
                    >
                </div>
            `;
        }
    }


    return "";
}


/* =========================================================
   VALIDAÇÃO NA INTERFACE
   ========================================================= */

function renderizarSecaoValidacao(
    magia
) {

    const validacao =
        validarMagia(magia);


    let classeCaixa =
        "gm-caixa-ok";

    let tituloCaixa =
        "Magia válida";


    if (
        validacao.erros.length > 0
    ) {

        classeCaixa =
            "gm-caixa-erro";

        tituloCaixa =
            "Erros encontrados";

    } else if (
        validacao.avisos.length > 0
    ) {

        classeCaixa =
            "gm-caixa-aviso";

        tituloCaixa =
            "Avisos de consistência";
    }


    return `

        <section class="gm-secao gm-validacao">

            <h3>
                Validação de Regras
            </h3>

            <p>
                Verificação automática das regras do sistema de magia de domínio.
            </p>


            <div
                class="gm-caixa-validacao ${classeCaixa}"
            >
                <strong>${tituloCaixa}</strong>

                ${
                    validacao.erros.length > 0
                        ? `
                            <ul>
                                ${
                                    validacao.erros
                                        .map(
                                            erro =>
                                                `<li>${escaparHTML(
                                                    erro
                                                )}</li>`
                                        )
                                        .join("")
                                }
                            </ul>
                        `
                        : ""
                }

                ${
                    validacao.avisos.length > 0
                        ? `
                            <ul style="margin-top: ${
                                validacao.erros
                                    .length > 0
                                        ? "6px"
                                        : "0"
                            };">
                                ${
                                    validacao.avisos
                                        .map(
                                            aviso =>
                                                `<li>${escaparHTML(
                                                    aviso
                                                )}</li>`
                                        )
                                        .join("")
                                }
                            </ul>
                        `
                        : ""
                }

                ${
                    validacao.erros.length === 0 &&
                    validacao.avisos.length === 0
                        ? '<p style="margin: 8px 0 0;">Nenhum erro ou aviso detectado. A magia está pronta para uso no grimório.</p>'
                        : ""
                }
            </div>

        </section>
    `;
}

function renderizarValidacao() {

    const container =
        document.querySelector(
            ".gm-validacao"
        );


    if (
        !container ||
        indiceEdicao === null
    ) {
        return;
    }


    const magia =
        magias[indiceEdicao];


    const novaSecao =
        document.createElement(
            "div"
        );


    novaSecao.innerHTML =
        renderizarSecaoValidacao(
            magia
        );


    container.replaceWith(
        novaSecao.firstElementChild
    );


    renderizarLista();
}