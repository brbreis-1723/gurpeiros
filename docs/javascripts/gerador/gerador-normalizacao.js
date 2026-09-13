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


    if (
        resultado.valor !== undefined &&
        typeof resultado.valor === "string"
    ) {

        const match =
            resultado.valor.match(
                /^(\d+)/
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

        parametros: {
            alcance: [{ valor: "", modificador: 0 }],
            duracao: [{ valor: "", modificador: 0 }],
            tempo_conjuracao: [{ valor: "1 segundo", modificador: 0 }]
        },

        penalidade:
            0,

        observacao:
            ""
    };
}