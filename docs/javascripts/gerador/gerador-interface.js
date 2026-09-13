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