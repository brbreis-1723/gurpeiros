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
                    /^(\d+)/
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


    if (
        nome ===
        "conceder_bonus"
    ) {

        return renderizarItemConcederBonus(
            item,
            indice,
            multiplos,
            opcoes
        );
    }


    if (nome === "cura") {

        return renderizarItemCura(
            item,
            indice,
            multiplos,
            opcoes
        );
    }


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


    // Regra de bloqueio dinâmico para tempo de conjuração em Truques
    const magiaAtual = (indiceEdicao !== null && magias[indiceEdicao]) ? magias[indiceEdicao] : null;
    const ehTruque = (magiaAtual && magiaAtual.categoria === "Truque");
    const tempoInibido = (nome === "tempo_conjuracao" && ehTruque);


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
                    ${tempoInibido ? "disabled title='Definido automaticamente para Truques'" : ""}
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
   CONCEDER BÔNUS / REDUTOR
   ========================================================= */

function renderizarItemConcederBonus(
    item,
    indice,
    multiplos,
    opcoes
) {

    const detalhes =
        item.detalhes || {};


    const existeNaTabela =
        opcoes.some(
            opcao =>
                String(opcao.valor) ===
                String(item.valor)
        );


    const calculado =
        calcularModificadorItem(
            "conceder_bonus",
            item
        );


    return `

        <div
            class="gm-item-parametro"
            data-item-parametro="conceder_bonus"
            data-indice="${indice}"
        >

            <div class="gm-grid">

                <div class="gm-campo gm-campo-largo">

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


                <div class="gm-campo gm-campo-largo">

                    <label class="gm-label">
                        Detalhe (Perícia / Habilidades)
                    </label>


                    <input
                        type="text"
                        class="gm-input"
                        data-detalhe="alvo"
                        value="${
                            escaparHTML(
                                detalhes.alvo ??
                                detalhes.detalhe ??
                                ""
                            )
                        }"
                        placeholder="Ex.: Perícias de Combate, Espada, Testes de DX..."
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
                            data-remover-item="conceder_bonus"
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


    let qtdExibicao = quantidade;

    if (
        (qtdExibicao === undefined || qtdExibicao === "") &&
        typeof item.valor === "string"
    ) {
        const match = item.valor.match(/^(\d+)/);
        if (match) {
            qtdExibicao = Number(match[1]);
        }
    }


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
                                qtdExibicao ??
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


    const valorString =
        String(item.valor || "");


    const ciclico =
        valorString
            .toLowerCase()
            .includes("cíclico") ||
        valorString
            .toLowerCase()
            .includes("ciclico");


    const fragmentacao =
        valorString
            .toLowerCase()
            .includes("fragmentação") ||
        valorString
            .toLowerCase()
            .includes("fragmentacao");


    const cone =
        valorString
            .toLowerCase()
            .startsWith("cone");


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
                                                valorString
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


                ${
                    fragmentacao
                        ? `
                            <div class="gm-campo">

                                <label class="gm-label">
                                    Dados de Fragmentação (d6)
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    class="gm-input"
                                    data-detalhe="quantidade_d6"
                                    value="${
                                        escaparHTML(
                                            detalhes.quantidade_d6 ??
                                            ""
                                        )
                                    }"
                                >

                            </div>
                        `
                        : ""
                }


                ${
                    cone
                        ? `
                            <div class="gm-campo">

                                <label class="gm-label">
                                    Base do cone (metros)
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    class="gm-input"
                                    data-detalhe="base_metros"
                                    value="${
                                        escaparHTML(
                                            detalhes.base_metros ??
                                            1
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