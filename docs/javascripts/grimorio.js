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
             * COMPATIBILIDADE DOS PARÂMETROS
             * ==============================
             *
             * O formato antigo utiliza objetos para alguns
             * parâmetros únicos:
             *
             * "alcance": {
             *     "valor": "Toque",
             *     "modificador": 2
             * }
             *
             * O formato novo utiliza arrays para TODOS:
             *
             * "alcance": [
             *     {
             *         "valor": "Toque",
             *         "modificador": 2
             *     }
             * ]
             *
             * Estas funções permitem que os dois formatos
             * sejam utilizados simultaneamente.
             */


            /*
             * Nomes antigos dos parâmetros
             */
            function normalizarNomeParametro(nome) {

                const nomesLegados = {

                    area:
                        "area_efeito",

                    caracteristicas:
                        "caracteristicas_alteradas"

                };

                return nomesLegados[nome] || nome;

            }


            /*
             * Converte objeto único em array.
             * Se já for array, mantém.
             */
            function normalizarParametro(parametro) {

                if (
                    parametro === undefined ||
                    parametro === null
                ) {
                    return [];
                }

                if (Array.isArray(parametro)) {
                    return parametro;
                }

                return [parametro];

            }


            /*
             * Obtém todos os parâmetros com os nomes
             * convertidos para o padrão novo.
             *
             * O objeto original NÃO é alterado.
             */
            function obterParametrosNormalizados(magia) {

                const resultado = {};

                for (
                    const [nomeOriginal, parametro]
                    of Object.entries(
                        magia.parametros || {}
                    )
                ) {

                    const nome =
                        normalizarNomeParametro(
                            nomeOriginal
                        );

                    resultado[nome] =
                        normalizarParametro(
                            parametro
                        );

                }

                return resultado;

            }


            /*
             * Obtém o primeiro item de um parâmetro
             * considerado único.
             */
            function obterParametroUnico(
                magia,
                nome
            ) {

                const parametros =
                    obterParametrosNormalizados(
                        magia
                    );

                const itens =
                    parametros[nome] || [];

                return itens.length > 0
                    ? itens[0]
                    : null;

            }


            /*
             * ==============================
             * CRIA A FICHA DA MAGIA
             * ==============================
             */

            function criarFicha(magia) {

                /*
                 * O custo do feitiço é igual ao seu nível.
                 *
                 * Nível 1 = 1 PM
                 * Nível 2 = 2 PM
                 * Nível 3 = 3 PM
                 * etc.
                 *
                 * O custo não é armazenado no JSON.
                 */
                const custo =
                    Number(magia.nivel);


                /*
                 * Parâmetros normalizados.
                 *
                 * A partir daqui, TODOS os parâmetros
                 * serão tratados como arrays.
                 */
                const parametros =
                    obterParametrosNormalizados(
                        magia
                    );


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
                                    <strong>Custo:</strong>
                                    ${custo} PM
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
                    const [nome, itens]
                    of Object.entries(parametros)
                ) {

                    /*
                     * O tempo de conjuração possui
                     * uma seção própria.
                     */
                    if (
                        nome ===
                        "tempo_conjuracao"
                    ) {
                        continue;
                    }


                    /*
                     * Cada item do array vira uma linha.
                     *
                     * Isso permite, por exemplo:
                     *
                     * "dano": [
                     *     {...},
                     *     {...}
                     * ]
                     *
                     * ou:
                     *
                     * "cura": [
                     *     {...},
                     *     {...}
                     * ]
                     */
                    itens.forEach(item => {

                        html += `

                            <tr>

                                <td>
                                    ${formatarNomeParametro(
                                        nome
                                    )}
                                </td>

                                <td>
                                    ${formatarValorItem(
                                        item
                                    )}
                                </td>

                                <td>
                                    ${formatarModificadorItem(
                                        item
                                    )}
                                </td>

                            </tr>

                        `;

                    });

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

                const tempo =
                    obterParametroUnico(
                        magia,
                        "tempo_conjuracao"
                    );


                if (tempo) {

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
                                            ${formatarValorItem(
                                                tempo
                                            )}
                                        </td>

                                        <td>
                                            ${formatarModificadorItem(
                                                tempo
                                            )}
                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </section>

                    `;

                }


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
             * NOMES DOS PARÂMETROS
             * ==============================
             */

            function formatarNomeParametro(nome) {

                const nomes = {

                    alcance:
                        "Alcance",

                    area_efeito:
                        "Área de efeito",

                    atribulacao:
                        "Atribulação",

                    caracteristicas_alteradas:
                        "Características alteradas",

                    conceder_bonus:
                        "Conceder bônus",

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

                    multiplos_alvos:
                        "Múltiplos alvos",

                    tamanho:
                        "Tamanho",

                    velocidade:
                        "Velocidade"

                };


                return nomes[nome] || nome;

            }


            /*
             * ==============================
             * FORMATAÇÃO DO VALOR
             * ==============================
             */

            function formatarValorItem(item) {

                if (!item) {
                    return "";
                }


                /*
                 * ==========================
                 * FORMATO NOVO
                 * ==========================
                 *
                 * {
                 *     "valor": "3d6-3",
                 *     "modificador": -6,
                 *     "detalhes": {
                 *         "quantidade": 3,
                 *         "tipo": "Perfurante"
                 *     }
                 * }
                 */

                if (
                    item.valor !== undefined &&
                    item.valor !== null
                ) {

                    let valor =
                        String(item.valor);


                    /*
                     * Compatibilidade com o formato antigo,
                     * onde "tipo" ficava diretamente no item:
                     *
                     * "dano": {
                     *     "valor": "4d6",
                     *     "tipo": "Contusivo"
                     * }
                     */
                    if (item.tipo) {

                        valor +=
                            ` (${item.tipo})`;

                    }


                    /*
                     * Formato novo:
                     *
                     * "detalhes": {
                     *     "tipo": "Perfurante"
                     * }
                     */
                    else if (
                        item.detalhes &&
                        item.detalhes.tipo
                    ) {

                        valor +=
                            ` (${item.detalhes.tipo})`;

                    }


                    return valor;

                }


                /*
                 * ==========================
                 * COMPATIBILIDADE LEGADA
                 * ==========================
                 */

                if (
                    item.efeito !== undefined
                ) {

                    return String(
                        item.efeito
                    );

                }


                if (
                    item.descricao !== undefined
                ) {

                    return String(
                        item.descricao
                    );

                }


                /*
                 * Metamorfose antiga
                 */
                if (
                    item.poder_forma
                ) {

                    const poder =
                        item.poder_forma;


                    return `

                        ${item.descricao ||
                            "Forma alterada"}

                        <br>

                        Poder da forma:
                        ${poder.pontos ?? ""}
                        pontos

                    `;

                }


                /*
                 * Invocação antiga
                 */
                if (
                    item.pontos_criatura !==
                    undefined
                ) {

                    return `

                        ${item.pontos_criatura}
                        pontos

                        ${
                            item.relacao
                                ? "(" +
                                  item.relacao +
                                  ")"
                                : ""
                        }

                    `;

                }


                /*
                 * Tamanho antigo
                 */
                if (
                    item.mt !== undefined ||
                    item.dimensao !== undefined
                ) {

                    return `

                        MT ${item.mt ?? ""}

                        ${
                            item.dimensao
                                ? " — " +
                                  item.dimensao
                                : ""
                        }

                    `;

                }


                return "";

            }


            /*
             * ==============================
             * FORMATAÇÃO DO MODIFICADOR
             * ==============================
             */

            function formatarModificadorItem(item) {

                if (!item) {
                    return "";
                }


                /*
                 * Formato novo e formato antigo:
                 *
                 * "modificador": -4
                 */
                if (
                    item.modificador !== undefined &&
                    item.modificador !== null
                ) {

                    return item.modificador;

                }


                /*
                 * Metamorfose em formatos antigos
                 */
                if (
                    item.poder_forma &&
                    item.poder_forma.modificador !==
                    undefined
                ) {

                    return item
                        .poder_forma
                        .modificador;

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