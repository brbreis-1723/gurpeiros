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

    if (nome === "dano") {
        return [];
    }


    let tabela =
        obterTabela(nome);


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