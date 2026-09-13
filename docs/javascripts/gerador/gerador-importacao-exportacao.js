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