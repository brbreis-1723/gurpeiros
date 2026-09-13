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