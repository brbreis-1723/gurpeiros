# Manual Operacional Passo a Passo — Sistema Gerador de Magias

Este documento detalha o procedimento operacional padrão para utilizar o sistema de criação, edição, validação, exportação e visualização de magias.

## 1. Visão Geral da Interface Inicial

* Ao acessar a página do gerador no navegador, o sistema realiza a carga dos arquivos de tabelas e progressões.
* O painel principal divide-se em duas colunas: a barra lateral esquerda (contendo o campo de pesquisa e a listagem de magias em edição) e a área principal de trabalho à direita (editor e visualização de status).
* O cabeçalho superior abriga os botões de ação global: **Importar JSON**, **+ Nova magia**, **Exportar JSON** e **Visualizar Grimório**.


## 2. Importação de um Arquivo JSON

**Objetivo**: Carregar uma base de magias existente para continuar o trabalho ou realizar auditorias.

**Procedimento**: 

1. Clique no botão **Importar JSON** localizado no topo da interface.
2. Uma janela nativa de seleção de arquivos do Windows será aberta. Selecione o arquivo no formato `.json` desejado.
3. O sistema fará a leitura, validará a estrutura dos registros e normalizará os dados automaticamente.
4. Uma mensagem de status será exibida no topo indicando o sucesso da importação e o número de magias carregadas (bem como eventuais avisos de campos legados ou ignorados).


## 3. Inclusão e Edição de uma Magia

**Objetivo**: Criar do zero uma nova magia ou modificar uma existente.

**Procedimento**:

1. Clique no botão **+ Nova magia** no topo da tela.
2. A nova magia será adicionada à lista e o editor será carregado automaticamente com o foco no campo **Nome**.
3. Preencha os **Dados básicos**: Insira o nome, selecione o *Domínio* mágico correspondente, escolha o *Nível* (de 1 a 5) e defina a *Categoria* (`Truque`, `Feitiço` ou `Ritual`).
4. Preencha o campo de texto livre **Efeito** descrevendo detalhadamente a mecânica da magia.

## 4. Seleção e Gerenciamento de Parâmetros

**Objetivo**: Configurar os parâmetros obrigatórios e opcionais que compõem o custo e as restrições da magia.

**Procedimento**:

1. **Parâmetros Obrigatórios**: Ao criar uma magia, os parâmetros de *Alcance*, *Duração* e *Tempo de Conjuração* já vêm inseridos por padrão.
2. **Regra de Categoria e Tempo de Conjuração**: Caso a categoria selecionada seja *Truque*, o campo de valor do tempo de conjuração nascerá fixado em *1 segundo* e ficará bloqueado para edição na interface. Se alterar para *Ritual*, o valor ajusta-se para *1 minuto*.
3. **Adicionando Parâmetros Opcionais**: Utilize o seletor na seção de parâmetros para escolher itens adicionais (como *Dano*, *Cura* ou *Modificadores de Ataque*) e clique em **Adicionar**.
4. **Modificadores Automáticos**: Ao selecionar um valor nas caixas de seleção, o sistema calcula e atualiza o modificador correspondente de forma retroativa para o cômputo da penalidade.

## 5. Exportação do JSON

**Objetivo**: Salvar o trabalho atual em um arquivo estruturado para backup ou publicação no site.

**Procedimento**:

1. Certifique-se de que os dados estão corretos. O motor de validação auditará a integridade da magia em tempo real.
2. Clique no botão **Exportar JSON** no topo da tela.
3. Se houver erros críticos de validação, o sistema emitirá um alerta solicitando confirmação, permitindo salvar os dados atuais em memória.
4. O arquivo `grimorio-gerado.json` será baixado automaticamente para o diretório de downloads do seu computador.


## 6. Visualização e Impressão do Grimório

**Objetivo**: Gerar um relatório limpo em formato de planilha para consulta rápida e impressão física.

**Procedimento**:

1. Com as magias cadastradas, clique no botão **Visualizar Grimório** no topo da interface.
2. Uma nova aba do navegador será aberta contendo a tabela completa de consulta rápida.
3. A listagem exibirá colunas dedicadas para *Magia*, *Domínio*, *Nível*, *Categoria*, *PM Mínimo*, *Penalidade*, além de colunas separadas para os parâmetros obrigatórios (*Alcance*, *Duração*, *Tempo*) e uma coluna consolidada para os *Demais Parâmetros* (incluindo notas de observação formatadas como `. Obs: ...` quando preenchidas).
4. Para gerar a cópia física em papel ou salvar em PDF através dos recursos nativos do Windows, clique no botão superior **Imprimir / Salvar PDF** dentro da página do grimório.