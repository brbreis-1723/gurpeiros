# Readme Modularização do Gerador de magias

## Mapa definitivo do sistema

```text
javascripts/
│
├── gerador-magias.js
│
└── gerador/
    │
    ├── gerador-config.js
    ├── gerador-estado.js
    ├── gerador-utilitarios.js
    ├── gerador-tabelas.js
    ├── gerador-normalizacao.js
    ├── gerador-calculos.js
    ├── gerador-validacao.js
    ├── gerador-interface.js
    ├── gerador-parametros.js
    ├── gerador-detalhes.js
    ├── gerador-eventos.js
    ├── gerador-operacoes.js
    └── gerador-importacao-exportacao.js
```

## Responsabilidade de cada arquivo

| Arquivo                            | Responsabilidade                                         |
| ---------------------------------- | -------------------------------------------------------- |
| `gerador-config.js`                | URLs, níveis, domínios, categorias, nomes e configuração |
| `gerador-estado.js`                | estado global do gerador                                 |
| `gerador-utilitarios.js`           | funções auxiliares                                       |
| `gerador-tabelas.js`               | carregamento e consulta das tabelas                      |
| `gerador-normalizacao.js`          | conversão/normalização do JSON                           |
| `gerador-calculos.js`              | **todas as regras matemáticas e penalidades**            |
| `gerador-validacao.js`             | erros e avisos                                           |
| `gerador-interface.js`             | estrutura geral da tela                                  |
| `gerador-parametros.js`            | parâmetros das magias                                    |
| `gerador-detalhes.js`              | campos internos dos parâmetros                           |
| `gerador-eventos.js`               | eventos e interação da tela                              |
| `gerador-operacoes.js`             | nova magia, salvar, duplicar, excluir etc.               |
| `gerador-importacao-exportacao.js` | importar e exportar JSON                                 |
| `gerador-magias.js`                | **arquivo principal**, apenas inicializa o sistema       |
