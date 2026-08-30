
document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("grimorio");
    const detalhes = document.getElementById("detalhes-magia");

    if (!container) {
        return;
    }

    fetch("/regras/magia/grimorio.json")
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Não foi possível carregar grimorio.json"
                );
            }

            return response.json();

        })
        .then(magias => {

            /*
             * ==============================
             * ÁREA DE FILTROS
             * ==============================
             */

            const dominios = [
                ...new Set(
                    magias
                        .map(magia => magia.dominio)
                        .filter(Boolean)
                )
            ].sort();

            const niveis = [
                ...new Set(
                    magias
                        .map(magia => magia.nivel)
                        .filter(nivel => nivel !== undefined)
                )
            ].sort((a, b) => a - b);

            const categorias = [
                ...new Set(
                    magias
                        .map(magia => magia.categoria)
                        .filter(Boolean)
                )
            ].sort();


            const filtrosHTML = `

                <div class="filtros-grimorio">

                    <div class="filtro-grupo">

                        <label for="filtro-busca">
                            Buscar
                        </label>

                        <input
                            type="text"
                            id="filtro-busca"
                            placeholder="Nome da magia..."
                        >

                    </div>


                    <div class="filtro-grupo">

                        <label for="filtro-dominio">
                            Domínio
                        </label>

                        <select id="filtro-dominio">

                            <option value="">
                                Todos
                            </option>

                            ${dominios.map(dominio => `
                                <option value="${dominio}">
                                    ${dominio}
                                </option>
                            `).join("")}

                        </select>

                    </div>


                    <div class="filtro-grupo">

                        <label for="filtro-nivel">
                            Nível
                        </label>

                        <select id="filtro-nivel">

                            <option value="">
                                Todos
                            </option>

                            ${niveis.map(nivel => `
                                <option value="${nivel}">
                                    ${nivel}
                                </option>
                            `).join("")}

                        </select>

                    </div>


                    <div class="filtro-grupo">

                        <label for="filtro-categoria">
                            Categoria
                        </label>

                        <select id="filtro-categoria">

                            <option value="">
                                Todas
                            </option>

                            ${categorias.map(categoria => `
                                <option value="${categoria}">
                                    ${categoria}
                                </option>
                            `).join("")}

                        </select>

                    </div>


                    <div class="filtro-acoes">

                        <button
                            type="button"
                            id="limpar-filtros"
                        >
                            Limpar filtros
                        </button>

                    </div>

                </div>


                <div
                    id="contador-magias"
                    class="contador-magias"
                ></div>

            `;


            container.innerHTML = filtrosHTML + `
                <div id="tabela-grimorio"></div>
            `;


            const tabelaContainer =
                document.getElementById("tabela-grimorio");

            const filtroBusca =
                document.getElementById("filtro-busca");

            const filtroDominio =
                document.getElementById("filtro-dominio");

            const filtroNivel =
                document.getElementById("filtro-nivel");

            const filtroCategoria =
                document.getElementById("filtro-categoria");

            const limparFiltros =
                document.getElementById("limpar-filtros");

            const contador =
                document.getElementById("contador-magias");


            /*
             * ==============================
             * RENDERIZAÇÃO DA TABELA
             * ==============================
             */

            function renderizarTabela(lista) {

                let html = `

                    <table>

                        <thead>

                            <tr>
                                <th>Nome</th>
                                <th>Domínio</th>
                                <th>Nível</th>
                                <th>Categoria</th>
                                <th>Penalidade</th>
                            </tr>

                        </thead>

                        <tbody>
                `;


                if (lista.length === 0) {

                    html += `

                        <tr>

                            <td
                                colspan="5"
                                style="text-align: center;"
                            >
                                Nenhuma magia encontrada.
                            </td>

                        </tr>

                    `;

                }


                lista.forEach(magia => {

                    html += `

                        <tr>

                            <td>

                                <a
                                    href="#${magia.id}"
                                    class="magia-link"
                                    data-id="${magia.id}"
                                >
                                    ${magia.nome}
                                </a>

                            </td>

                            <td>
                                ${magia.dominio}
                            </td>

                            <td>
                                ${magia.nivel}
                            </td>

                            <td>
                                ${magia.categoria}
                            </td>

                            <td>
                                ${magia.penalidade}
                            </td>

                        </tr>

                    `;

                });


                html += `

                        </tbody>

                    </table>

                `;


                tabelaContainer.innerHTML = html;


                /*
                 * Atualiza contador
                 */

                contador.textContent =
                    `${lista.length} ${
                        lista.length === 1
                            ? "magia encontrada"
                            : "magias encontradas"
                    }`;


                /*
                 * Eventos dos links
                 */

                document
                    .querySelectorAll(".magia-link")
                    .forEach(link => {

                        link.addEventListener(
                            "click",
                            function (event) {

                                event.preventDefault();

                                const id =
                                    this.dataset.id;

                                const magia =
                                    magias.find(
                                        magia =>
                                            magia.id === id
                                    );

                                if (magia) {

                                    mostrarDetalhes(magia);

                                    history.pushState(
                                        null,
                                        "",
                                        "#" + magia.id
                                    );

                                }

                            }
                        );

                    });

            }


            /*
             * ==============================
             * APLICAÇÃO DOS FILTROS
             * ==============================
             */

            function aplicarFiltros() {

                const busca =
                    filtroBusca.value
                        .trim()
                        .toLowerCase();

                const dominio =
                    filtroDominio.value;

                const nivel =
                    filtroNivel.value;

                const categoria =
                    filtroCategoria.value;


                const filtradas =
                    magias.filter(magia => {

                        if (
                            busca &&
                            !magia.nome
                                .toLowerCase()
                                .includes(busca)
                        ) {
                            return false;
                        }


                        if (
                            dominio &&
                            magia.dominio !== dominio
                        ) {
                            return false;
                        }


                        if (
                            nivel &&
                            String(magia.nivel) !== nivel
                        ) {
                            return false;
                        }


                        if (
                            categoria &&
                            magia.categoria !== categoria
                        ) {
                            return false;
                        }


                        return true;

                    });


                renderizarTabela(filtradas);

            }


            /*
             * ==============================
             * EVENTOS DOS FILTROS
             * ==============================
             */

            filtroBusca.addEventListener(
                "input",
                aplicarFiltros
            );

            filtroDominio.addEventListener(
                "change",
                aplicarFiltros
            );

            filtroNivel.addEventListener(
                "change",
                aplicarFiltros
            );

            filtroCategoria.addEventListener(
                "change",
                aplicarFiltros
            );


            limparFiltros.addEventListener(
                "click",
                function () {

                    filtroBusca.value = "";
                    filtroDominio.value = "";
                    filtroNivel.value = "";
                    filtroCategoria.value = "";

                    aplicarFiltros();

                }
            );


            /*
             * ==============================
             * EXIBE UMA MAGIA
             * ==============================
             */

            function mostrarDetalhes(magia) {

                if (!detalhes) {
                    return;
                }

                detalhes.innerHTML =
                    criarFicha(magia);

                detalhes.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }


            /*
             * ==============================
             * CRIA A FICHA DA MAGIA
             * ==============================
             */

            function criarFicha(magia) {

                let html = `

                    <article
                        id="${magia.id}"
                        class="ficha-magia"
                    >

                        <div class="ficha-cabecalho">

                            <h2>
                                ${magia.nome}
                            </h2>

                            <div class="ficha-meta">

                                <span>
                                    <strong>Domínio:</strong>
                                    ${magia.dominio}
                                </span>

                                <span>
                                    <strong>Nível:</strong>
                                    ${magia.nivel}
                                    —
                                    ${magia.nivel_nome}
                                </span>

                                <span>
                                    <strong>Categoria:</strong>
                                    ${magia.categoria}
                                </span>

                            </div>

                        </div>


                        <section class="ficha-secao">

                            <h3>Efeito</h3>

                            <p>
                                ${magia.efeito}
                            </p>

                        </section>


                        <section class="ficha-secao">

                            <h3>Parâmetros</h3>

                            <table class="ficha-parametros">

                                <thead>

                                    <tr>
                                        <th>Parâmetro</th>
                                        <th>Valor</th>
                                        <th>Modificador</th>
                                    </tr>

                                </thead>

                                <tbody>

                `;


                /*
                 * ==============================
                 * PARÂMETROS
                 * ==============================
                 */

                for (
                    const [nome, parametro]
                    of Object.entries(
                        magia.parametros || {}
                    )
                ) {

                    /*
                     * Tempo de conjuração possui
                     * uma seção própria.
                     */

                    if (
                        nome === "tempo_conjuracao"
                    ) {
                        continue;
                    }


                    /*
                     * Parâmetro com vários itens
                     *
                     * Cada item recebe sua própria
                     * linha, mantendo Valor e
                     * Modificador separados.
                     */

                    if (Array.isArray(parametro)) {

                        parametro.forEach(item => {

                            html += `

                                <tr>

                                    <td>
                                        ${formatarNomeParametro(nome)}
                                    </td>

                                    <td>
                                        ${formatarValorItem(item)}
                                    </td>

                                    <td>
                                        ${item?.modificador ?? ""}
                                    </td>

                                </tr>

                            `;

                        });

                        continue;

                    }


                    /*
                     * Parâmetro normal
                     */

                    html += `

                        <tr>

                            <td>
                                ${formatarNomeParametro(nome)}
                            </td>

                            <td>
                                ${formatarValorParametro(parametro)}
                            </td>

                            <td>
                                ${parametro?.modificador ?? ""}
                            </td>

                        </tr>

                    `;

                }


                html += `

                                </tbody>

                            </table>

                        </section>

                `;


                /*
                 * ==============================
                 * TEMPO DE CONJURAÇÃO
                 * ==============================
                 */

                if (
                    magia.parametros?.tempo_conjuracao
                ) {

                    const tempo =
                        magia.parametros
                            .tempo_conjuracao;

                    html += `

                        <section class="ficha-secao">

                            <h3>
                                Tempo de Conjuração
                            </h3>

                            <table
                                class="ficha-parametros"
                            >

                                <thead>

                                    <tr>
                                        <th>Valor</th>
                                        <th>Modificador</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    <tr>

                                        <td>
                                            ${tempo.valor ?? ""}
                                        </td>

                                        <td>
                                            ${tempo.modificador ?? ""}
                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </section>

                    `;

                }


                /*
                 * ==============================
                 * DANO
                 * ==============================
                 */

                /*
                 * O dano agora é tratado como
                 * parâmetro normal na tabela.
                 *
                 * Não criamos uma seção adicional.
                 */


                /*
                 * ==============================
                 * PENALIDADE FINAL
                 * ==============================
                 */

                html += `

                    <div class="penalidade-final">

                        <strong>
                            Penalidade do feitiço:
                        </strong>

                        ${magia.penalidade}

                    </div>

                `;


                /*
                 * ==============================
                 * OBSERVAÇÃO
                 * ==============================
                 */

                if (magia.observacao) {

                    html += `

                        <div class="ficha-observacao">

                            <blockquote>
                                ${magia.observacao}
                            </blockquote>

                        </div>

                    `;

                }


                /*
                 * ==============================
                 * VOLTAR PARA A TABELA
                 * ==============================
                 */

                html += `

                        <div class="ficha-voltar">

                            <a
                                href="#grimorio"
                                onclick="voltarParaTabela(event)"
                            >
                                ↑ Voltar ao início do Grimório
                            </a>

                        </div>

                    </article>

                `;


                return html;

            }


            /*
             * ==============================
             * NOME DOS PARÂMETROS
             * ==============================
             */

            function formatarNomeParametro(nome) {

                const nomes = {

                    alcance:
                        "Alcance",

                    area:
                        "Área",

                    atribulacao:
                        "Atribulação",

                    caracteristicas:
                        "Características",

                    cura:
                        "Cura",

                    dano:
                        "Dano",

                    duracao:
                        "Duração",

                    invocacao:
                        "Invocação",

                    massa_volume:
                        "Massa / Volume",

                    metamorfose:
                        "Metamorfose",

                    modificadores_ataque:
                        "Modificadores de ataque",

                    tamanho:
                        "Tamanho",

                    velocidade:
                        "Velocidade",

                    volume:
                        "Volume"

                };

                return nomes[nome] || nome;

            }


            /*
             * ==============================
             * FORMATA ITEM DE LISTA
             * ==============================
             */

            function formatarValorItem(item) {

                if (!item) {
                    return "";
                }


                /*
                 * Se possui efeito + valor,
                 * mostra os dois juntos na coluna
                 * Valor.
                 */

                if (
                    item.efeito &&
                    item.valor !== undefined
                ) {

                    return `
                        ${item.efeito}: ${item.valor}
                    `;

                }


                /*
                 * Se possui apenas efeito.
                 */

                if (item.efeito) {

                    return item.efeito;

                }


                /*
                 * Se possui apenas valor.
                 */

                if (item.valor !== undefined) {

                    return item.valor;

                }


                return "";

            }


            /*
             * ==============================
             * FORMATA PARÂMETRO NORMAL
             * ==============================
             */

            function formatarValorParametro(parametro) {

                if (!parametro) {
                    return "";
                }


                /*
                 * Valor + tipo
                 */

                if (
                    parametro.valor !== undefined
                ) {

                    if (parametro.tipo) {

                        return `
                            ${parametro.valor}
                            (${parametro.tipo})
                        `;

                    }

                    return parametro.valor;

                }


                /*
                 * Metamorfose
                 */

                if (
                    parametro.poder_forma
                ) {

                    const poder =
                        parametro.poder_forma;

                    return `

                        ${parametro.descricao ||
                            "Forma alterada"}

                        — Poder da forma:
                        ${poder.pontos ?? ""}
                        pontos

                    `;

                }


                /*
                 * Invocação
                 */

                if (
                    parametro.pontos_criatura !==
                    undefined
                ) {

                    return `

                        ${parametro.pontos_criatura}
                        pontos

                        ${
                            parametro.relacao
                                ? "(" +
                                  parametro.relacao +
                                  ")"
                                : ""
                        }

                    `;

                }


                /*
                 * Tamanho
                 */

                if (
                    parametro.mt !== undefined ||
                    parametro.dimensao !== undefined
                ) {

                    return `

                        MT ${parametro.mt ?? ""}

                        ${
                            parametro.dimensao
                                ? " — " +
                                  parametro.dimensao
                                : ""
                        }

                    `;

                }


                /*
                 * Descrição simples
                 */

                if (
                    parametro.descricao
                ) {

                    return parametro.descricao;

                }


                return "";

            }


            /*
             * ==============================
             * ABRIR MAGIA PELA URL
             * ==============================
             */

            function abrirMagiaDaURL() {

                const id =
                    window.location.hash
                        .substring(1);

                if (
                    !id ||
                    id === "grimorio"
                ) {
                    return;
                }


                const magia =
                    magias.find(
                        magia =>
                            magia.id === id
                    );


                if (magia) {
                    mostrarDetalhes(magia);
                }

            }


            /*
             * ==============================
             * RENDERIZAÇÃO INICIAL
             * ==============================
             */

            renderizarTabela(magias);


            /*
             * ==============================
             * ABRE MAGIA PELA URL
             * ==============================
             */

            abrirMagiaDaURL();


            /*
             * ==============================
             * NAVEGAÇÃO VOLTAR / AVANÇAR
             * ==============================
             */

            window.addEventListener(
                "popstate",
                abrirMagiaDaURL
            );

        })
        .catch(error => {

            console.error(error);

            container.innerHTML = `

                <p>

                    <strong>Erro:</strong>

                    não foi possível carregar
                    o grimório.

                </p>

            `;

        });

});


/*
 * ==============================
 * VOLTAR PARA A TABELA
 * ==============================
 */

function voltarParaTabela(event) {

    event.preventDefault();

    history.pushState(
        null,
        "",
        "#grimorio"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    const detalhes =
        document.getElementById(
            "detalhes-magia"
        );


    if (detalhes) {
        detalhes.innerHTML = "";
    }

}
