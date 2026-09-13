/* =========================================================
   UTILITÁRIOS
   ========================================================= */

function escaparHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function clone(obj) {

    return JSON.parse(
        JSON.stringify(obj)
    );
}


function gerarId() {

    return (
        "magia-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}


function valorVazio(valor) {

    return (
        valor === undefined ||
        valor === null ||
        String(valor).trim() === ""
    );
}


function numero(valor, padrao = 0) {

    const n = Number(valor);

    return Number.isFinite(n)
        ? n
        : padrao;
}


function nomeParametro(nome) {

    return (
        NOMES_PARAMETROS[nome] ||
        nome
    );
}


function normalizarNomeParametro(nome) {

    return (
        ALIASES_PARAMETROS[nome] ||
        nome
    );
}


function escaparSeletor(valor) {

    if (
        window.CSS &&
        typeof CSS.escape === "function"
    ) {
        return CSS.escape(valor);
    }

    return String(valor).replace(
        /[^a-zA-Z0-9_-]/g,
        "\\$&"
    );
}


function formatarNumero(valor) {

    const n = Number(valor);

    if (!Number.isFinite(n)) {
        return String(valor ?? "—");
    }

    return Number.isInteger(n)
        ? String(n)
        : String(n).replace(".", ",");
}


function formatarModificador(modificador) {

    const n = Number(modificador);

    if (!Number.isFinite(n)) {
        return String(modificador ?? "—");
    }

    return n > 0
        ? `+${n}`
        : String(n);
}


function ceilDiv(valor, divisor) {

    return Math.ceil(
        Math.max(0, Number(valor)) /
        divisor
    );
}


/* =========================================================
   STATUS
   ========================================================= */

function mostrarStatus(
    mensagem,
    tipo = "info"
) {

    const status =
        document.getElementById(
            "gm-status"
        );


    if (!status) {
        return;
    }


    status.className =
        `gm-status gm-status-${tipo}`;


    status.textContent =
        mensagem;


    clearTimeout(
        mostrarStatus.timer
    );


    mostrarStatus.timer =
        setTimeout(
            () => {

                status.textContent =
                    "";

                status.className =
                    "gm-status";

            },
            6000
        );
}