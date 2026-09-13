/* =========================================================
   CÁLCULO DOS MODIFICADORES
   ========================================================= */

function calcularModificadorItem(nome, item) {
    if (!item) return null;

    const detalhes = item.detalhes || {};

    if (nome === "dano") {
        let quantidade = detalhes.quantidade_d6;

        if (quantidade === undefined && typeof item.valor === "number") {
            quantidade = item.valor;
        }

        if (quantidade === undefined && typeof item.valor === "string") {
            const match = item.valor.match(/^(\d+)/);
            if (match) {
                quantidade = Number(match[1]);
            }
        }

        if (quantidade === undefined || quantidade === "") return null;

        quantidade = Number(quantidade);
        if (!Number.isFinite(quantidade) || quantidade < 0) return null;

        return -Math.ceil(quantidade);
    }

    if (nome === "caracteristicas_alteradas") {
        const pontos = Number(detalhes.pontos);
        if (!Number.isFinite(pontos) || pontos <= 0) return null;

        return -Math.ceil(pontos / 5);
    }

    if (nome === "cura") {
        const opcao = encontrarOpcao(nome, item.valor);
        if (!opcao) return null;

        const texto = String(opcao.modificador ?? "");

        if (texto.includes("1d6 PV") || String(item.valor).toLowerCase().includes("vitalidade: recuperar pv")) {
            const quantidade = Number(detalhes.pv_d6 ?? detalhes.quantidade);
            if (!Number.isFinite(quantidade)) return null;
            return -Math.ceil(Math.max(0, quantidade));
        }

        if (texto.includes("2 PF") || String(item.valor).toLowerCase().includes("fadiga: recuperar pf")) {
            const quantidade = Number(detalhes.qtd_pf ?? detalhes.quantidade);
            if (!Number.isFinite(quantidade)) return null;
            return -Math.ceil(Math.max(0, quantidade) / 2);
        }

        if (typeof opcao.modificador === "number") return opcao.modificador;
        return null;
    }

    if (nome === "modificadores_ataque") {
        const valorString = String(item.valor || "").toLowerCase();

        // CONE: -5 base + (-1 por metro de base) -> 1m = -6, 2m = -7...
        if (valorString.startsWith("cone")) {
            const baseMetros = Number(detalhes.base_metros ?? 1);
            if (!Number.isFinite(baseMetros) || baseMetros < 1) return null;
            return -5 - Math.ceil(baseMetros);
        }

        // FRAGMENTAÇÃO: -2 por dado de d6
        if (valorString.includes("fragmentação") || valorString.includes("fragmentacao")) {
            const quantidade = Number(detalhes.quantidade_d6);
            if (!Number.isFinite(quantidade) || quantidade <= 0) return null;
            return -2 * Math.ceil(quantidade);
        }

        // CÍCLICO: Modificador por ciclo
        const opcao = encontrarOpcao(nome, item.valor);
        if (!opcao) return null;

        const texto = String(opcao.modificador ?? "");
        if (texto.toLowerCase().includes("ciclo")) {
            const match = texto.match(/(-\d+)\s*\/\s*ciclo/i);
            if (!match) return null;
            const porCiclo = Number(match[1]);
            const ciclos = Number(detalhes.quantidade_ciclos ?? detalhes.quantidade);
            if (!Number.isFinite(ciclos)) return null;
            return porCiclo * Math.max(0, ciclos);
        }

        if (typeof opcao.modificador === "number") return opcao.modificador;
        return null;
    }

    const opcao = encontrarOpcao(nome, item.valor);
    if (!opcao) return null;
    if (typeof opcao.modificador === "number") return opcao.modificador;

    return null;
}

function calcularPenalidade(magia) {
    let total = 0;
    const parametros = magia?.parametros || {};

    Object.values(parametros).forEach(lista => {
        if (!Array.isArray(lista)) return;
        lista.forEach(item => {
            const modificador = Number(item?.modificador);
            if (Number.isFinite(modificador)) {
                total += modificador;
            }
        });
    });

    return Math.min(total, 0);
}

function recalcularItens(magia) {
    let alterados = 0;
    Object.entries(magia.parametros || {}).forEach(([nome, lista]) => {
        if (!Array.isArray(lista)) return;
        lista.forEach(item => {
            const calculado = calcularModificadorItem(nome, item);
            if (calculado !== null && calculado !== numero(item.modificador, 0)) {
                item.modificador = calculado;
                alterados++;
            }
        });
    });
    return alterados;
}

function calcularPMMinimo(magia) {
    const nivel = Number(magia?.nivel);
    return (Number.isInteger(nivel) && nivel >= 1 && nivel <= 5) ? nivel : "—";
}