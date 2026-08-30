
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
             * ORDENAÇÃO
             * ==============================
             */

            let ordenacao = {
                campo: null,
                direcao: "asc"
            };


            function ordenarLista(lista) {

                if (!ordenacao.campo) {
                    return lista;
                }

                const listaOrdenada = [...lista];

                listaOrdenada.sort((a, b) => {

                    let valorA;
                    let valorB;

                    switch (ordenacao.campo) {

                        case "nome":
                            valorA = a.nome || "";
                            valorB = b.nome || "";
                            break;

                        case "dominio":
                            valorA = a.dominio || "";
                            valorB = b.dominio || "";
                            break;

                        case "nivel":
                            valorA = Number(a.nivel);
                            valorB = Number(b.nivel);
                            break;

                        case "categoria":
                            valorA = a.categoria || "";
                            valorB = b.categoria || "";
                            break;

                        case "penalidade":
                            valorA = Number(a.penalidade);
                            valorB = Number(b.penalidade);
                            break;

                        default:
                            return 0;

                    }


                    /*
                     * Campos numéricos
                     */
                    if (
                        ordenacao.campo === "nivel" ||
                        ordenacao.campo === "penalidade"
                    ) {

                        const resultado =
                            valorA - valorB;

                        return ordenacao.direcao === "asc"
                            ? resultado
                            : -resultado;

                    }


                    /*
                     * Campos de texto
                     */
                    const resultado =
                        String(valorA).localeCompare(
                            String(valorB),
                            "pt-BR",
                            {
                                sensitivity: "base"
                            }
                        );

                    return ordenacao.direcao === "asc"
                        ? resultado
                        : -resultado;

                });

                return listaOrdenada;

            }


            /*
             * Indicador visual da ordenação
             */
            function indicadorOrdenacao(campo) {

                if (ordenacao.campo !== campo) {
                    return "";
                }

                return ordenacao.direcao === "asc"
                    ? " ↑"
                    : " ↓";

            }


            /*
             * ==============================
             * RENDERIZAÇÃO DA TABELA
             * ==============================
             */

            function renderizarTabela(lista) {

                const listaOrdenada =
                    ordenarLista(lista);


                let html = `

                    <table>

                        <thead>

                            <tr>

                                <th
                                    class="ordenavel"
                                    data-ordenar="nome"
                                    title="Ordenar por nome"
                                >
                                    Nome${indicadorOrdenacao("nome")}
                                </th>

                                <th
                                    class="ordenavel"
                                    data-ordenar="dominio"
                                    title="Ordenar por domínio"
                                >
                                    Domínio${indicadorOrdenacao("dominio")}
                                </th>

                                <th
                                    class="ordenavel"
                                    data-ordenar="nivel"
                                    title="Ordenar por nível"
                                >
                                    Nível${indicadorOrdenacao("nivel")}
                                </th>

                                <th
                                    class="ordenavel"
                                    data-ordenar="categoria"
                                    title="Ordenar por categoria"
                                >
                                    Categoria${indicadorOrdenacao("categoria")}
                                </th>

                                <th
                                    class="ordenavel"
                                    data-ordenar="penalidade"
                                    title="Ordenar por penalidade"
                                >
                                    Penalidade${indicadorOrdenacao("penalidade")}
                                </th>

                            </tr>

                        </thead>

                        <tbody>
                `;


                if (listaOrdenada.length === 0) {

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


                listaOrdenada.forEach(magia => {

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
                    `${listaOrdenada.length} ${
                        listaOrdenada.length === 1
                            ? "magia encontrada"
                            : "magias encontradas"
                    }`;


                /*
                 * Eventos dos cabeçalhos
                 */
                document
                    .querySelectorAll(".ordenavel")
                    .forEach(cabecalho => {

                        cabecalho.addEventListener(
                            "click",
                            function () {

                                const campo =
                                    this.dataset.ordenar;


                                if (
                                    ordenacao.campo === campo
                                ) {

                                    ordenacao.direcao =
                                        ordenacao.direcao === "asc"
                                            ? "desc"
                                            : "asc";

                                } else {

                                    ordenacao.campo = campo;
                                    ordenacao.direcao = "asc";

                                }


                                aplicarFiltros();

                            }
                        );

                    });


                /*
                 * Recria os eventos dos links
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

                        /*
                         * Busca pelo nome
                         */
                        if (
                            busca &&
                            !magia.nome
                                .toLowerCase()
                                .includes(busca)
                        ) {
                            return false;
                        }


                        /*
                         * Domínio
                         */
                        if (
                            dominio &&
                            magia.dominio !== dominio
                        ) {
                            return false;
                        }


                        /*
                         * Nível
                         */
                        if (
                            nivel &&
                            String(magia.nivel) !== nivel
                        ) {
                            return false;
                        }


                        /*
                         * Categoria
                         */
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
                 * Parâmetros
                 */
                for (
                    const [nome, parametro]
                    of Object.entries(
                        magia.parametros || {}
                    )
                ) {

                    if (
                        nome ===
                        "tempo_conjuracao"
                    ) {
                        continue;
                    }


                    html += `

                        <tr>

                            <td>
                                ${formatarNomeParametro(nome)}
                            </td>

                            <td>
                                ${formatarValor(parametro)}
                            </td>

                            <td>
                                ${formatarModificador(parametro)}
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
                 * Tempo de conjuração
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
                 * Penalidade final
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
                 * Observação
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
                 * Voltar para a tabela
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
             * NOMES DOS PARÂMETROS
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
             * FORMATAÇÃO DOS VALORES
             * ==============================
             */

            function formatarValor(parametro) {

                if (!parametro) {
                    return "";
                }


                /*
                 * Listas de efeitos
                 */
                if (Array.isArray(parametro)) {

                    return parametro

                        .map(item => {

                            if (
                                item &&
                                item.efeito &&
                                item.valor !== undefined
                            ) {

                                return `
                                    ${item.efeito}
                                `;

                            }

                            if (
                                item &&
                                item.efeito
                            ) {

                                return item.efeito;

                            }

                            return "";

                        })

                        .filter(
                            valor => valor !== ""
                        )

                        .join("<br>");

                }


                /*
                 * Parâmetros simples
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

                        <br>

                        Poder da forma:
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
             * FORMATAÇÃO DOS MODIFICADORES
             * ==============================
             */

            function formatarModificador(parametro) {

                if (!parametro) {
                    return "";
                }


                /*
                 * Listas de efeitos
                 */
                if (Array.isArray(parametro)) {

                    return parametro

                        .map(item => {

                            if (
                                item &&
                                item.modificador !== undefined
                            ) {

                                return item.modificador;

                            }

                            return "";

                        })

                        .filter(
                            valor => valor !== ""
                        )

                        .join("<br>");

                }


                /*
                 * Metamorfose
                 */
                if (
                    parametro.poder_forma &&
                    parametro.poder_forma.modificador !==
                    undefined
                ) {

                    return parametro
                        .poder_forma
                        .modificador;

                }


                /*
                 * Invocação
                 */
                if (
                    parametro.modificador !==
                    undefined
                ) {

                    return parametro.modificador;

                }


                /*
                 * Tamanho
                 */
                if (
                    parametro.modificador !==
                    undefined
                ) {

                    return parametro.modificador;

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
             * Renderização inicial
             */
            renderizarTabela(magias);


            /*
             * Abre magia através da URL
             */
            abrirMagiaDaURL();


            /*
             * Navegação voltar/avançar
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
