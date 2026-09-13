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