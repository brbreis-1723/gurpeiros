# Esquema JSON do Grimório

## 1. Objetivo

O JSON do Grimório deve utilizar uma estrutura **única, previsível e consistente** para todas as magias.

O objetivo é permitir que:

* o `grimorio.js` leia todas as magias de maneira uniforme;
* o editor possa criar e alterar magias sem depender de estruturas diferentes para cada parâmetro;
* o importador consiga preservar informações existentes;
* novos parâmetros possam ser adicionados sem alterar a estrutura fundamental do JSON;
* o JSON exportado seja determinístico e fácil de validar.

---

## 2. Estrutura geral

Cada magia possui a seguinte estrutura:

```json
{
  "id": "...",
  "nome": "...",
  "dominio": "...",
  "nivel": 1,
  "nivel_nome": "...",
  "categoria": "...",
  "efeito": "...",
  "parametros": {},
  "penalidade": 0,
  "observacao": ""
}
```

### Campos principais

| Campo        | Tipo    | Obrigatório | Descrição                        |
| ------------ | ------- | ----------: | -------------------------------- |
| `id`         | string  |         Sim | Identificador único da magia     |
| `nome`       | string  |         Sim | Nome da magia                    |
| `dominio`    | string  |         Sim | Domínio ao qual a magia pertence |
| `nivel`      | inteiro |         Sim | Nível da magia, de 1 a 5         |
| `nivel_nome` | string  |         Sim | Nome correspondente ao nível     |
| `categoria`  | string  |         Sim | Truque, Feitiço ou Ritual        |
| `efeito`     | string  |         Sim | Descrição do efeito da magia     |
| `parametros` | objeto  |         Sim | Parâmetros utilizados pela magia |
| `penalidade` | inteiro |         Sim | Penalidade final de conjuração   |
| `observacao` | string  |         Sim | Observações adicionais           |

---

## 3. Nível da magia

O campo `nivel` é a **fonte de verdade** para o nível da magia.

| Nível | Nome          |
| ----: | ------------- |
|     1 | Percepção     |
|     2 | Influência    |
|     3 | Manipulação   |
|     4 | Transformação |
|     5 | Domínio       |

O campo `nivel_nome` existe para facilitar a leitura do JSON, mas deve ser derivado de `nivel`.

Por exemplo:

```json
{
  "nivel": 3,
  "nivel_nome": "Manipulação"
}
```

O gerador deve ser capaz de reconstruir `nivel_nome` a partir de `nivel`.

Caso um JSON importado contenha:

```json
{
  "nivel": 3,
  "nivel_nome": "Transformação"
}
```

isso deve ser tratado como **divergência a ser sinalizada**, e não como motivo para sobrescrever silenciosamente o valor importado.

---

## 4. Parâmetros

Todos os parâmetros ficam dentro de:

```json
"parametros": {}
```

Os parâmetros disponíveis são:

```text
alcance
area_efeito
atribulacao
caracteristicas_alteradas
conceder_bonus
cura
dano
duracao
invocacao
massa_volume
metamorfose
modificadores_ataque
multiplos_alvos
tamanho
tempo_conjuracao
velocidade
```

### 4.1. Regra fundamental: todos os parâmetros usam arrays

Para manter uma estrutura realmente uniforme, **todo parâmetro é representado por uma lista de objetos**, mesmo quando só existe um valor.

Exemplo:

```json
"alcance": [
  {
    "valor": "30 m",
    "modificador": -7
  }
]
```

E não:

```json
"alcance": {
  "valor": "30 m",
  "modificador": -7
}
```

Essa decisão elimina a necessidade de o programa descobrir se determinado parâmetro é um objeto único ou uma lista.

---

## 5. Parâmetro individual

Cada item de parâmetro possui a mesma estrutura básica:

```json
{
  "valor": "...",
  "modificador": 0
}
```

Também pode possuir informações estruturadas adicionais:

```json
{
  "valor": "...",
  "modificador": 0,
  "detalhes": {}
}
```

### Campos

| Campo         | Tipo    | Obrigatório | Descrição                                   |
| ------------- | ------- | ----------: | ------------------------------------------- |
| `valor`       | string  |         Sim | Valor textual apresentado ao usuário        |
| `modificador` | inteiro |         Sim | Contribuição do parâmetro para a penalidade |
| `detalhes`    | objeto  |         Não | Dados estruturados adicionais               |

---

## 6. `valor`

O campo `valor` representa o **resultado efetivo ou a descrição final do parâmetro**.

Exemplo:

```json
{
  "valor": "3d6-3",
  "modificador": -6
}
```

No caso de Dano, por exemplo:

* `valor` = dano efetivamente causado;
* `modificador` = penalidade de conjuração correspondente ao parâmetro.

Portanto, esses dois conceitos não devem ser confundidos.

---

## 7. `modificador`

O campo `modificador` representa exclusivamente a **contribuição daquele parâmetro para a penalidade da magia**.

Ele não representa necessariamente uma alteração no efeito produzido.

Por exemplo:

```json
{
  "valor": "3d6-3",
  "modificador": -6
}
```

O `-3` dentro do dano representa o efeito efetivo sobre o dano.

Já o `-6` representa a penalidade de conjuração produzida pelo parâmetro Dano.

---

## 8. `detalhes`

O campo `detalhes` é opcional.

Ele deve ser utilizado quando o editor ou o sistema precisar preservar informações estruturadas que não devem ser extraídas novamente do texto de `valor`.

Exemplo:

```json
{
  "valor": "3d6-3",
  "modificador": -6,
  "detalhes": {
    "quantidade": 3,
    "tipo": "Perfurante"
  }
}
```

Assim, o sistema não precisa tentar descobrir que `"3d6-3"` significa três dados de dano perfurante.

O texto exibido e os dados utilizados pelo editor podem coexistir.

---

## 9. Parâmetros únicos

Alguns parâmetros só podem aparecer uma vez em uma magia.

Eles continuam sendo representados como arrays, mas o array deve possuir exatamente um elemento.

São eles:

```text
alcance
area_efeito
duracao
invocacao
massa_volume
metamorfose
multiplos_alvos
tamanho
tempo_conjuracao
velocidade
```

Exemplo:

```json
"alcance": [
  {
    "valor": "30 m",
    "modificador": -7
  }
]
```

Isso significa:

> `alcance` é estruturalmente uma lista, mas neste parâmetro a lista deve conter exatamente um item.

---

## 10. Parâmetros múltiplos

Alguns parâmetros podem aparecer várias vezes na mesma magia.

São eles:

```text
atribulacao
caracteristicas_alteradas
conceder_bonus
cura
dano
modificadores_ataque
```

Exemplo:

```json
"dano": [
  {
    "valor": "3d6",
    "modificador": -3,
    "detalhes": {
      "quantidade": 3,
      "tipo": "Fogo"
    }
  },
  {
    "valor": "2d6",
    "modificador": -4,
    "detalhes": {
      "quantidade": 2,
      "tipo": "Elétrico"
    }
  }
]
```

Cada item é independente e sua penalidade participa da soma final.

---

## 11. `atribulacao`

O nome correto e definitivo do parâmetro é:

```text
atribulacao
```

Sem acento.

**`atribuicao` está incorreto e não deve ser utilizado.**

Exemplo:

```json
"atribulacao": [
  {
    "valor": "Paralisia",
    "modificador": -14
  }
]
```

Essa nomenclatura deve ser utilizada de forma consistente em:

* JSON;
* JSON Schema;
* `grimorio.js`;
* editor;
* importador;
* exportador;
* documentação;
* exemplos.

---

## 12. Parâmetros obrigatórios

Toda magia deve possuir:

```text
alcance
duracao
tempo_conjuracao
```

Cada um deve possuir exatamente um elemento.

Exemplo:

```json
"parametros": {
  "alcance": [
    {
      "valor": "30 m",
      "modificador": -7
    }
  ],
  "duracao": [
    {
      "valor": "Momentânea",
      "modificador": 0
    }
  ],
  "tempo_conjuracao": [
    {
      "valor": "1 segundo",
      "modificador": 0
    }
  ]
}
```

Os demais parâmetros são opcionais.

---

## 13. Ausência de parâmetro

Um parâmetro opcional que não participa da magia **não deve ser incluído** no JSON.

Correto:

```json
"parametros": {
  "alcance": [...],
  "duracao": [...],
  "tempo_conjuracao": [...],
  "dano": [...]
}
```

Não é necessário criar:

```json
"cura": []
```

nem:

```json
"metamorfose": null
```

Portanto:

> parâmetro inexistente = propriedade ausente.

---

## 14. Penalidade final

O campo:

```json
"penalidade": -10
```

representa a **penalidade final da magia**.

A penalidade é obtida pela soma das contribuições dos parâmetros estruturais.

Exemplo:

```text
Alcance       -7
Dano          -3
Duração        0
Conjuração     0
----------------
Total        -10
```

Resultado:

```json
"penalidade": -10
```

### Penalidade nunca pode ser positiva

Modificadores positivos servem para cancelar penalidades negativas.

Por exemplo:

```text
Alcance       -7
Outro efeito  +3
----------------
Total         -4
```

Resultado:

```json
"penalidade": -4
```

Se a soma ultrapassar zero:

```text
-3 + 5 = +2
```

a penalidade final será:

```json
"penalidade": 0
```

Portanto:

> **A penalidade final de uma magia nunca pode ser positiva.**

---

## 15. Exemplo completo

```json
{
  "id": "exemplo01",
  "nome": "Golpe de Fogo",
  "dominio": "Fogo",
  "nivel": 3,
  "nivel_nome": "Manipulação",
  "categoria": "Feitiço",
  "efeito": "O alvo sofre dano de fogo.",
  "parametros": {

    "alcance": [
      {
        "valor": "30 m",
        "modificador": -7
      }
    ],

    "duracao": [
      {
        "valor": "Momentânea",
        "modificador": 0
      }
    ],

    "tempo_conjuracao": [
      {
        "valor": "1 segundo",
        "modificador": 0
      }
    ],

    "dano": [
      {
        "valor": "3d6",
        "modificador": -3,
        "detalhes": {
          "quantidade": 3,
          "tipo": "Fogo"
        }
      }
    ]

  },
  "penalidade": -10,
  "observacao": ""
}
```

---

## 16. Exemplo com múltiplos parâmetros repetíveis

Uma magia pode possuir vários efeitos do mesmo tipo.

```json
{
  "parametros": {

    "alcance": [
      {
        "valor": "10 m",
        "modificador": -4
      }
    ],

    "duracao": [
      {
        "valor": "1 minuto",
        "modificador": -3
      }
    ],

    "tempo_conjuracao": [
      {
        "valor": "3 segundos",
        "modificador": 2
      }
    ],

    "atribulacao": [
      {
        "valor": "Dor Severa",
        "modificador": -8
      },
      {
        "valor": "Nauseado",
        "modificador": -7
      }
    ]

  }
}
```

Nesse caso, os modificadores dos dois efeitos de `atribulacao` participam da penalidade da magia.

---

## 17. Regra especial para Dano

O parâmetro `dano` possui:

```json
{
  "valor": "3d6-3",
  "modificador": -6,
  "detalhes": {
    "quantidade": 3,
    "tipo": "Perfurante"
  }
}
```

A interpretação é:

* `quantidade`: 3 dados;
* `tipo`: Perfurante;
* `valor`: dano efetivo = `3d6-3`;
* `modificador`: penalidade de conjuração = `-6`.

O importador **não deve interpretar o texto de `valor` para recalcular a penalidade**.

O `modificador` armazenado no JSON é o valor que deve ser preservado.

Caso exista uma divergência entre o `valor`, `detalhes` e `modificador`, ela deve ser **sinalizada para correção**, e não corrigida silenciosamente.

---

## 18. Regra geral de importação

O importador deve ser **não destrutivo**.

Isso significa que:

1. valores existentes devem ser preservados;
2. divergências devem ser identificadas;
3. valores calculados pelo sistema não devem substituir automaticamente valores armazenados;
4. correções devem poder ser feitas manualmente;
5. o importador não deve presumir que o JSON antigo esteja errado simplesmente porque não corresponde exatamente às regras atuais.

Especialmente importante:

```text
valor armazenado ≠ valor recalculado
```

O sistema pode informar:

> "O valor armazenado diverge do valor esperado pelas regras atuais."

Mas não deve simplesmente substituir o valor.

---

## 19. Compatibilidade

O esquema deve ser utilizado como estrutura **canônica para novas magias**.

Para magias antigas, o importador deve ser capaz de reconhecer estruturas anteriores quando possível e convertê-las para a estrutura canônica.

A conversão deve preservar os dados originais.

A estrutura canônica, entretanto, deve ser sempre:

```text
parâmetro
└── array
    └── objeto
        ├── valor
        ├── modificador
        └── detalhes (opcional)
```

---

## 20. JSON Schema

O esquema formal correspondente é:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Grimório de Zandia",
  "type": "object",

  "required": [
    "id",
    "nome",
    "dominio",
    "nivel",
    "nivel_nome",
    "categoria",
    "efeito",
    "parametros",
    "penalidade",
    "observacao"
  ],

  "properties": {

    "id": {
      "type": "string"
    },

    "nome": {
      "type": "string"
    },

    "dominio": {
      "type": "string"
    },

    "nivel": {
      "type": "integer",
      "minimum": 1,
      "maximum": 5
    },

    "nivel_nome": {
      "type": "string"
    },

    "categoria": {
      "type": "string",
      "enum": [
        "Truque",
        "Feitiço",
        "Ritual"
      ]
    },

    "efeito": {
      "type": "string"
    },

    "parametros": {
      "type": "object",

      "required": [
        "alcance",
        "duracao",
        "tempo_conjuracao"
      ],

      "properties": {

        "alcance": {
          "$ref": "#/$defs/parametroUnico"
        },

        "area_efeito": {
          "$ref": "#/$defs/parametroUnico"
        },

        "atribulacao": {
          "$ref": "#/$defs/parametroMultiplo"
        },

        "caracteristicas_alteradas": {
          "$ref": "#/$defs/parametroMultiplo"
        },

        "conceder_bonus": {
          "$ref": "#/$defs/parametroMultiplo"
        },

        "cura": {
          "$ref": "#/$defs/parametroMultiplo"
        },

        "dano": {
          "$ref": "#/$defs/parametroMultiplo"
        },

        "duracao": {
          "$ref": "#/$defs/parametroUnico"
        },

        "invocacao": {
          "$ref": "#/$defs/parametroUnico"
        },

        "massa_volume": {
          "$ref": "#/$defs/parametroUnico"
        },

        "metamorfose": {
          "$ref": "#/$defs/parametroUnico"
        },

        "modificadores_ataque": {
          "$ref": "#/$defs/parametroMultiplo"
        },

        "multiplos_alvos": {
          "$ref": "#/$defs/parametroUnico"
        },

        "tamanho": {
          "$ref": "#/$defs/parametroUnico"
        },

        "tempo_conjuracao": {
          "$ref": "#/$defs/parametroUnico"
        },

        "velocidade": {
          "$ref": "#/$defs/parametroUnico"
        }
      },

      "additionalProperties": false
    },

    "penalidade": {
      "type": "integer",
      "maximum": 0
    },

    "observacao": {
      "type": "string"
    }
  },

  "$defs": {

    "parametro": {
      "type": "object",

      "required": [
        "valor",
        "modificador"
      ],

      "properties": {

        "valor": {
          "type": "string"
        },

        "modificador": {
          "type": "integer"
        },

        "detalhes": {
          "type": "object"
        }
      },

      "additionalProperties": false
    },

    "parametroUnico": {
      "type": "array",
      "minItems": 1,
      "maxItems": 1,

      "items": {
        "$ref": "#/$defs/parametro"
      }
    },

    "parametroMultiplo": {
      "type": "array",
      "minItems": 1,

      "items": {
        "$ref": "#/$defs/parametro"
      }
    }
  },

  "additionalProperties": false
}
```

---

## 21. Princípio fundamental

A regra estrutural que deve orientar o desenvolvimento do Grimório é:

> **Todo parâmetro possui a mesma estrutura externa: uma lista de itens, e cada item possui `valor`, `modificador` e, opcionalmente, `detalhes`.**

Isso permite que o código trate os parâmetros de forma uniforme, enquanto `detalhes` permite armazenar as informações específicas necessárias para parâmetros mais complexos.

A nomenclatura **`atribulacao`** é parte dessa estrutura canônica e deve ser preservada exatamente dessa forma.
