/* =========================================================
   VISUALIZAR E IMPRIMIR GRIMÓRIO (FORMATO PLANILHA)
   ========================================================= */

function visualizarGrimorio() {
    if (!magias.length) {
        mostrarStatus("Não há magias para gerar o grimório.", "aviso");
        return;
    }

    const janelaVisualizacao = window.open("", "_blank");
    if (!janelaVisualizacao) {
        mostrarStatus("Permita pop-ups no navegador para visualizar o grimório.", "erro");
        return;
    }

    const linhasTabela = magias.map((magia) => {
        const params = magia.parametros || {};
        
        const obterDadoObrigatorio = (chave) => {
            if (params[chave] && params[chave][0]) {
                const item = params[chave][0];
                return `${item.valor} (${formatarModificador(item.modificador)})`;
            }
            return "—";
        };

        const alcanceStr = obterDadoObrigatorio("alcance");
        const duracaoStr = obterDadoObrigatorio("duracao");
        const tempoStr = obterDadoObrigatorio("tempo_conjuracao");

        let outrosTextos = [];
        const obrigatorios = ["alcance", "duracao", "tempo_conjuracao"];
        
        Object.keys(params).forEach(pKey => {
            if (!obrigatorios.includes(pKey)) {
                const listaItens = params[pKey];
                if (Array.isArray(listaItens)) {
                    listaItens.forEach(item => {
                        let detalheStr = "";
                        if (item.detalhes) {
                            const detalhesParts = Object.entries(item.detalhes)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(", ");
                            if (detalhesParts) detalheStr = ` (${detalhesParts})`;
                        }
                        outrosTextos.push(`${nomeParametro(pKey)}: ${item.valor}${detalheStr} [${formatarModificador(item.modificador)}]`);
                    });
                }
            }
        });

        // Adiciona a observação ao final dos demais parâmetros se estiver preenchida
        let textoDemaisParametros = outrosTextos.length ? outrosTextos.join("; ") : "";
        if (magia.observacao && magia.observacao.trim() !== "") {
            const obsFormatada = `. Obs: ${magia.observacao.trim()}`;
            textoDemaisParametros = textoDemaisParametros ? `${textoDemaisParametros}${obsFormatada}` : obsFormatada.substring(2); // Remove o ponto inicial se não houver outros parâmetros
        }

        return `
            <tr>
                <td><strong>${escaparHTML(magia.nome || "Sem Nome")}</strong></td>
                <td>${escaparHTML(magia.dominio || "—")}</td>
                <td>${magia.nivel || 1} (${escaparHTML(magia.nivel_nome || "—")})</td>
                <td>${escaparHTML(magia.categoria || "—")}</td>
                <td style="text-align: center;">${calcularPMMinimo(magia)}</td>
                <td style="text-align: center;">${magia.penalidade}</td>
                <td style="font-size: 11px;">${alcanceStr}</td>
                <td style="font-size: 11px;">${duracaoStr}</td>
                <td style="font-size: 11px;">${tempoStr}</td>
                <td style="font-size: 11px;">${textoDemaisParametros || "—"}</td>
                <td>${escaparHTML(magia.efeito || "—")}</td>
            </tr>
        `;
    }).join("");

    janelaVisualizacao.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Grimório de Magias - Visualização</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #111;
                    background: #fff;
                    margin: 15px;
                    font-size: 12px;
                }
                .topo-acoes {
                    background: #f4f4f4;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .topo-acoes h1 {
                    margin: 0;
                    font-size: 18px;
                }
                .btn-imprimir {
                    background: #000;
                    color: #fff;
                    border: none;
                    padding: 10px 20px;
                    font-size: 14px;
                    font-weight: bold;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .btn-imprimir:hover {
                    background: #333;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                th, td {
                    border: 1px solid #ccc;
                    padding: 6px 8px;
                    text-align: left;
                    vertical-align: top;
                }
                th {
                    background: #eaeaea;
                    font-weight: bold;
                    font-size: 11px;
                }
                tr:nth-child(even) {
                    background: #fafafa;
                }
                @media print {
                    .topo-acoes { display: none; }
                    body { margin: 0; font-size: 10px; }
                    th, td { padding: 4px 6px; }
                }
            </style>
        </head>
        <body>
            <div class="topo-acoes">
                <div>
                    <h1>Grimório de Magias</h1>
                    <p style="margin: 5px 0 0 0; color: #555;">Total de magias cadastradas: ${magias.length}</p>
                </div>
                <button class="btn-imprimir" onclick="window.print()">Imprimir / Salvar PDF</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Magia</th>
                        <th>Domínio</th>
                        <th>Nível</th>
                        <th>Categoria</th>
                        <th>PM</th>
                        <th>Penal.</th>
                        <th>Alcance</th>
                        <th>Duração</th>
                        <th>Tempo</th>
                        <th>Demais Parâmetros</th>
                        <th>Efeito</th>
                    </tr>
                </thead>
                <tbody>
                    ${linhasTabela}
                </tbody>
            </table>
        </body>
        </html>
    `);
    janelaVisualizacao.document.close();
}