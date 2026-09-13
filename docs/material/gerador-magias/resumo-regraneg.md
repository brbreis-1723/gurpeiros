# Documentação Completa do Sistema e Regras de Negócio — Gerador de Magias (GURPEIROS)

**Visão Geral da Arquitetura**
O aplicativo é um sistema modular em JavaScript estruturado para rodar de forma integrada a um site estático gerado via MkDocs. A arquitetura divide-se em arquivos dedicados à configuração, estado global, utilitários, tabelas, normalização, cálculos de modificadores, validação de regras, parâmetros, detalhes, operações de manipulação, interface visual, eventos de controle, importação/exportação, visualização do grimório e o script central de inicialização.

---

## 1. Regras de Negócio do Domínio de Magia

* **Atributos Principais**: Toda magia possui identificador único (`id`), nome, domínio mágico (escolhido entre 21 domínios oficiais), nível (de 1 a 5 associados a nomenclaturas padrão de *Percepção* até *Domínio*), categoria, efeito descritivo, penalidade armazenada e observações.
* **Parâmetros Obrigatórios**: Toda magia criada ou normalizada obrigatoriamente inclui os parâmetros de **Alcance**, **Duração** e **Tempo de Conjuração**.
* **Regras de Categoria e Tempo de Conjuração**:
* **Truques e Feitiços**: O tempo de conjuração inicial padrão é fixado em **1 segundo**.


* **Rituais**: O tempo de conjuração inicial padrão é fixado em **1 minuto**.


* **Restrição de Interface**: Quando a categoria da magia for **Truque**, o campo de seleção do valor de *Tempo de Conjuração* fica bloqueado (`disabled`) na interface, pois é governado estritamente pela regra da categoria.


* **Parâmetros Múltiplos e Opcionais**: Parâmetros como *Dano* (calculado em quantidade de dados d6), *Cura*, *Modificadores de Ataque*, *Características Alteradas* e *Conceder Bônus* suportam múltiplos itens por magia, permitindo detalhamentos granulares (como tipo de dano, alvos de perícias, ciclos ou pontos de atributos).

---

## 2. Estrutura Modular dos Scripts

* **`gerador-config.js`**: Armazena as constantes globais do sistema, como a lista de domínios permitidos, os níveis de magia (1 a 5), categorias (`Truque`, `Feitiço`, `Ritual`), parâmetros suportados, parâmetros obrigatórios (`alcance`, `duracao`, `tempo_conjuracao`) e os mapeamentos de tabelas oficiais.


* **`gerador-estado.js`**: Mantém o vetor global de `magias`, o índice da magia atualmente em edição (`indiceEdicao`), as tabelas de modificadores carregadas externamente, progressões e o filtro de busca da listagem.


* **`gerador-utilitarios.js`**: Oferece funções puras e utilitárias de suporte, incluindo escape de HTML, clonagem de objetos, geradores de ID únicos (`geradador-xxx`), validação de valores vazios, formatação de números, tratamento de modificadores com sinal (`+` ou `-`) e controle de mensagens de status na tela.


* **`gerador-tabelas.js`**: Faz a ponte de consulta com as tabelas externas carregadas via JSON (como alcances, áreas de efeito e penalidades) e injeta extensões padrão para alcances e tempos de conjuração adicionais.


* **`gerador-normalizacao.js`**: Responsável por higienizar e padronizar estruturas de dados vindas de arquivos JSON externos ou importados, além de conter a função `criarMagiaVazia()` que inicializa uma nova magia já com os parâmetros obrigatórios e o tempo de conjuração pré-configurado por categoria.


* **`gerador-calculos.js`**: Executa a matemática do sistema, calculando o modificador individual de cada item com base nas tabelas oficiais (ex: penalidade proporcional à quantidade de d6 de dano ou pontos alterados) e somando a penalidade total da magia.


* **`gerador-validacao.js`**: Audita a integridade da magia, gerando alertas de avisos (warnings) ou bloqueios de erros (erros) caso faltem campos obrigatórios, valores nas tabelas ou haja divergência entre a penalidade armazenada e a calculada.


* **`gerador-parametros.js` e `gerador-detalhes.js**`: Renderizam visualmente os blocos de parâmetros presentes na magia, aplicando restrições dinâmicas como o bloqueio do tempo de conjuração para truques e o gerenciamento de sub-campos (como quantidade de dados, tipos de dano ou alvos).


* **`gerador-operacoes.js`**: Gerencia a adição e remoção de parâmetros e itens dinâmicos dentro do editor.


* **`gerador-interface.js`**: Desenha a interface principal (painel de listagem com busca em tempo real, editor de formulários, seções de validação e botões de ação do topo).


* **`gerador-eventos.js`**: Gerencia todos os ouvintes de eventos de clique, alteração de inputs, seletores e disparos de mudança dinâmica de categoria e atualização visual de modificadores.


* **`gerador-importacao-exportacao.js`**: Controla as rotinas de leitura de arquivos JSON externos, validação de compatibilidade estrutural e exportação das magias em formato JSON estruturado (`grimorio-gerado.json`).


* **`gerador-grimorio.js`**: Módulo responsável por compilar todas as magias cadastradas em uma janela de visualização prévia no formato de tabela de consulta rápida otimizada para impressão corporativa/de mesa, discriminando colunas dedicadas para os parâmetros obrigatórios, demais parâmetros com anexação de observações (`. Obs: ...`) e o efeito correspondente.
* **`gerador-magias.js`**: Script de entrada que aguarda o carregamento da página, consome os arquivos JSON de tabelas e progressões via `fetch` e inicializa o sistema chamando a função global `renderizar()`.



---

## 3. Fluxo Operacional do Usuário

1. **Inicialização**: Ao abrir a página do gerador no site do MkDocs, o sistema baixa as tabelas de referência e desenha o painel principal.


2. **Criação de Magia**: O usuário clica em *+ Nova magia*. O sistema instancia uma nova ficha contendo os dados básicos padrão e os três parâmetros obrigatórios (*Alcance*, *Duração* e *Tempo de Conjuração* já ajustado para *1 segundo* por conta da categoria *Truque*).


3. **Edição e Regras Dinâmicas**: Conforme o usuário altera a categoria para *Ritual*, o sistema atualiza automaticamente o tempo de conjuração para *1 minuto*. Se alterar para *Truque*, o campo é devidamente inibido.


4. **Validação e Salvamento**: O motor de validação audita os campos em tempo real, recalculando penalidades e sinalizando eventuais inconsistências visuais.


5. **Consulta e Impressão (Grimório)**: O usuário clica em *Visualizar Grimório*, abrindo uma tela limpa em formato de planilha contendo colunas dedicadas para cada parâmetro obrigatório, listagem compacta dos demais parâmetros (seguidos de observações quando existentes) e a listagem de efeitos pronta para ser impressita diretamente pelo Windows.