document.addEventListener("DOMContentLoaded", async () => {

    const container =
        document.getElementById("gerador-magias");

    if (!container) {
        return;
    }


    /* =========================================================
       CARREGAMENTO DAS TABELAS E INICIALIZAÇÃO
       ========================================================= */

    async function carregarJSON(
        url
    ) {

        const resposta =
            await fetch(
                url
            );


        if (
            !resposta.ok
        ) {

            throw new Error(
                `${resposta.status} ${resposta.statusText}`
            );
        }


        return resposta.json();
    }


    async function inicializarDados() {

        try {

            tabelas =
                await carregarJSON(
                    URL_TABELAS
                );

        } catch (erro) {

            tabelas = {};


            console.warn(
                "Não foi possível carregar modificadores_tabelas.json:",
                erro
            );
        }


        try {

            progressoes =
                await carregarJSON(
                    URL_PROGRESSOES
                );

        } catch (erro) {

            progressoes = {};


            console.info(
                "Arquivo de progressões não encontrado. As progressões incorporadas serão utilizadas quando aplicável."
            );
        }


        renderizar();
    }


    await inicializarDados();

});