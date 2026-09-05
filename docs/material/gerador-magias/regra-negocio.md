# Especificação de Regras de Negócio — Gerador de Magias

> **Documento de referência para desenvolvimento do Gerador de Magias e do Grimório de Zandia.**
>
> Este documento deve ser considerado a fonte de verdade para as regras de negócio do gerador. Alterações no código, na interface ou na estrutura do JSON devem preservar estas regras, salvo decisão explícita de alteração deste documento.

---

## 1. Objetivo

O projeto consiste em um **Gerador de Magias** para o sistema mágico de Zandia, compatível com o **Grimório**, atualmente implementado em JavaScript e utilizando um arquivo JSON como banco de dados das magias.

O gerador deve permitir:

1. Criar novas magias;
2. Editar magias existentes;
3. Importar o JSON antigo;
4. Exportar magias para o formato utilizado pelo Grimório;
5. Calcular automaticamente os modificadores dos parâmetros;
6. Calcular a penalidade final da magia;
7. Identificar inconsistências em magias importadas sem destruir ou sobrescrever automaticamente os dados originais;
8. Manter compatibilidade com o `grimorio.js` existente.

---

## 2. Princípios fundamentais

### 2.1. O gerador é estruturado

Sempre que uma regra possuir uma tabela ou uma progressão definida, o usuário deve selecionar ou informar o parâmetro de maneira estruturada.

Não utilizar campos de texto livre quando o valor puder ser determinado por uma tabela oficial.

---

### 2.2. O modificador é calculado pelo gerador

Sempre que possível, o usuário escolhe o efeito desejado e o gerador determina automaticamente:

* o valor correspondente;
* o modificador de penalidade;
* eventuais modificadores derivados.

O usuário não deve precisar digitar manualmente o modificador de um parâmetro que possa ser calculado pela tabela.

---

### 2.3. Valor e modificador possuem funções diferentes

O campo `valor` representa **o efeito ou valor efetivo do parâmetro**.

O campo `modificador` representa **exclusivamente a contribuição daquele parâmetro para a penalidade de conjuração**.

Essas duas informações não devem ser confundidas.

Exemplo:

```json
"dano": {
    "valor": "3d6-3",
    "tipo": "Perfurante",
    "modificador": -6
}
```

Nesse exemplo:

* `3d6-3` é o dano efetivamente produzido;
* `Perfurante` é o tipo de dano;
* `-6` é a penalidade de conjuração correspondente ao parâmetro Dano.

O gerador **não deve recalcular o modificador a partir do texto de `valor` durante a importação**. O `modificador` é o dado autoritativo para representar a penalidade armazenada.

Caso os dados sejam incompatíveis, o gerador deve sinalizar a inconsistência.

---

## 3. Estrutura geral da magia

A estrutura principal deve permanecer compatível com o `grimorio.js`.

```json
{
    "id": "id-unico",
    "nome": "Nome da Magia",
    "dominio": "Ar",
    "nivel": 3,
    "nivel_nome": "Manipulação",
    "categoria": "Feitiço",
    "efeito": "Descrição completa do efeito.",
    "parametros": {},
    "penalidade": -10,
    "observacao": ""
}
```

### 3.1. Campos principais

#### `id`

Identificador único da magia.

Deve ser preservado durante a edição.

Ao criar uma nova magia, o gerador deve criar um identificador único.

---

#### `nome`

Nome da magia.

Obrigatório.

---

#### `dominio`

Domínio mágico ao qual a magia pertence.

Obrigatório.

Domínios atualmente existentes:

* Água
* Ar
* Artefatos
* Bestas
* Conhecimento
* Cura
* Destino
* Diabolismo
* Dimensão
* Escuridão
* Flora
* Fogo
* Gravidade
* Ilusão
* Luz
* Magia
* Mente
* Necromancia
* Sangue
* Som
* Terra

---

#### `nivel`

Nível da magia.

Obrigatório.

Valores:

| Nível | Nome          |
| ----: | ------------- |
|     1 | Percepção     |
|     2 | Influência    |
|     3 | Manipulação   |
|     4 | Transformação |
|     5 | Domínio       |

---

#### `nivel_nome`

Nome textual correspondente ao `nivel`.

O gerador deve **derivar esse campo a partir de `nivel`**.

O valor importado de `nivel_nome` não deve ser considerado a fonte de verdade.

---

#### `categoria`

Categoria da magia.

Valores possíveis:

* Truque
* Feitiço
* Ritual

A categoria possui relação direta com o tempo de conjuração.

---

#### `efeito`

Descrição geral do efeito da magia.

É texto livre.

Serve para explicar o funcionamento da magia em linguagem natural.

O texto de `efeito` não deve ser utilizado para calcular automaticamente os parâmetros estruturados quando estes já estiverem presentes.

---

#### `parametros`

Objeto contendo os parâmetros estruturados da magia.

---

#### `penalidade`

Penalidade final da magia.

É calculada a partir dos modificadores estruturais dos parâmetros e do tempo de conjuração.

A penalidade final **nunca pode ser positiva**.

Se a soma dos modificadores for positiva:

```text
penalidade final = 0
```

Os bônus servem apenas para cancelar ou reduzir penalidades.

---

#### `observacao`

Campo de texto livre destinado a observações especiais da magia.

Pode conter regras específicas que não precisam ser transformadas em parâmetros estruturados.

---

## 4. Parâmetros obrigatórios

Toda magia deve possuir obrigatoriamente:

* `alcance`
* `duracao`

Mesmo que ambos tenham modificador `0`.

Exemplo:

```json
"parametros": {
    "alcance": {
        "valor": "<3 m",
        "modificador": 0
    },
    "duracao": {
        "valor": "Momentânea",
        "modificador": 0
    }
}
```

Os demais parâmetros são opcionais.

---

## 5. Cálculo da penalidade

A penalidade da magia é determinada pela soma dos modificadores estruturais.

Participam do cálculo:

* Alcance;
* Área de Efeito;
* Atribulação;
* Características Alteradas;
* Cura;
* Dano;
* Invocação;
* Massa/Volume;
* Metamorfose;
* Modificadores de Ataque;
* Múltiplos Alvos;
* Tamanho;
* Velocidade;
* Duração;
* Tempo de Conjuração;
* demais parâmetros estruturados que possuam `modificador`.

A regra geral é:

```text
Penalidade bruta = soma de todos os modificadores
```

Depois:

```text
Penalidade final = menor entre a penalidade bruta e 0
```

Portanto:

```text
soma = +4
final = 0
```

```text
soma = -7
final = -7
```

```text
soma = +2 - 5
final = -3
```

O gerador deve exibir, quando possível, a composição da penalidade para facilitar a conferência.

---

## 6. Custo mínimo de PM

O custo mínimo de uma magia é igual ao seu nível.

| Nível | Custo mínimo |
| ----: | -----------: |
|     1 |         1 PM |
|     2 |         2 PM |
|     3 |         3 PM |
|     4 |         4 PM |
|     5 |         5 PM |

É possível gastar menos PM que o mínimo, mas cada PM que deixar de ser gasto gera:

```text
-5 NH efetivo por PM não gasto
```

Essa regra é de execução/conjuração e **não precisa ser armazenada no JSON da magia**.

---

## 7. Tempo de Conjuração

O tempo de conjuração é um parâmetro estrutural.

Nunca deve ser um campo de texto livre.

O usuário deve selecionar um valor da tabela.

| Modificador | Tempo       |
| ----------: | ----------- |
|          +0 | 1 segundo   |
|          +1 | 2 segundos  |
|          +2 | 3 segundos  |
|          +3 | 5 segundos  |
|          +4 | 10 segundos |
|          +5 | 30 segundos |
|          +6 | 1 minuto    |
|          +7 | 2 minutos   |
|          +8 | 5 minutos   |
|          +9 | 10 minutos  |
|         +10 | 30 minutos  |
|         +11 | 1 hora      |
|         +12 | 3 horas     |
|         +13 | 6 horas     |
|         +14 | 12 horas    |
|         +15 | 24 horas    |
|         +16 | 3 dias      |
|         +17 | 5 dias      |
|         +18 | 10 dias     |
|         +19 | 20 dias     |
|         +20 | 1 mês       |

O parâmetro fica dentro de:

```json
"parametros": {
    "tempo_conjuracao": {
        "valor": "10 segundos",
        "modificador": 4
    }
}
```

O `grimorio.js` atualmente trata o tempo separadamente na exibição, mas ele continua sendo parte dos parâmetros estruturais.

---

## 8. Categoria e tempo de conjuração

### Truque

* Sempre dura exatamente 1 segundo.
* Modificador: `+0`.
* A seleção de Truque deve bloquear o tempo em 1 segundo.

Não deve ser possível escolher outro tempo para um Truque.

---

### Feitiço

Pode utilizar:

* 1 segundo
* 2 segundos
* 3 segundos
* 5 segundos
* 10 segundos
* 30 segundos

Qualquer tempo a partir de 1 minuto caracteriza Ritual.

---

### Ritual

Tempo mínimo:

```text
1 minuto
```

Modificador:

```text
+6
```

Pode utilizar qualquer tempo da tabela a partir de 1 minuto.

---

## 9. Alcance

O alcance é obrigatório.

Tabela:

| Alcance | Modificador |
| ------: | ----------: |
|   Toque |          +2 |
|   < 3 m |           0 |
|     3 m |          -1 |
|     5 m |          -2 |
|     7 m |          -3 |
|    10 m |          -4 |
|    15 m |          -5 |
|    20 m |          -6 |
|    30 m |          -7 |
|    50 m |          -8 |
|    70 m |          -9 |
|   100 m |         -10 |
|   150 m |         -11 |
|   200 m |         -12 |
|   300 m |         -13 |
|   500 m |         -14 |
|   700 m |         -15 |
|    1 km |         -16 |
|  1,5 km |         -17 |
|    2 km |         -18 |
|    3 km |         -19 |
|    5 km |         -20 |

Após -20, a progressão continua:

```text
7 km
10 km
15 km
20 km
30 km
50 km
...
```

Cada novo passo aplica `-1` adicional.

#### Regras especiais

Alvo do próprio conjurador:

```text
Toque
```

Teleportes utilizam a soma:

```text
conjurador → alvo
+
alvo → destino
```

Se o próprio conjurador for o alvo:

```text
conjurador → destino
```

A regra de teleporte pode permanecer na descrição/observação da magia. O JSON possui apenas um parâmetro `alcance`.

---

## 10. Área de Efeito

A área representa uma região espacial.

Não deve ser confundida com Tamanho.

|  Raio | Modificador |
| ----: | ----------: |
|   1 m |           0 |
|   2 m |          -1 |
|   3 m |          -2 |
|   4 m |          -3 |
|   5 m |          -4 |
|   7 m |          -5 |
|  10 m |          -6 |
|  14 m |          -7 |
|  20 m |          -8 |
|  30 m |          -9 |
|  40 m |         -10 |
|  50 m |         -11 |
|  70 m |         -12 |
| 100 m |         -13 |
| 140 m |         -14 |
| 200 m |         -15 |
| 300 m |         -16 |
| 400 m |         -17 |
| 500 m |         -18 |
| 700 m |         -19 |
|  1 km |         -20 |

Após -20, a progressão continua utilizando:

```text
1 → 1,4 → 2 → 3 → 4 → 5 → 7 → 10
```

repetindo-se em ordens de grandeza maiores.

#### Geometria

1 m corresponde ao hexágono central.

2 m inclui o hexágono central e o anel adjacente.

A área é medida a partir do **conjurador até a borda mais próxima da área**, e não até o centro geométrico.

---

## 11. Atribulação

| Efeito          | Modificador |
| --------------- | ----------: |
| Atordoamento    |          -3 |
| Embriagado      |          -5 |
| Bêbado          |          -6 |
| Dor Moderada    |          -6 |
| Tosse           |          -6 |
| Euforia         |          -7 |
| Nauseado        |          -7 |
| Dor Severa      |          -8 |
| Dor Terrível    |          -9 |
| Alucinação      |         -10 |
| Ansia           |         -10 |
| Torpor          |         -10 |
| Vômito          |         -10 |
| Agonia          |         -12 |
| Epilepsia       |         -12 |
| Asfixia         |         -12 |
| Êxtase          |         -12 |
| Paralisia       |         -14 |
| Sono            |         -14 |
| Ataque Cardíaco |         -20 |
| Coma            |         -20 |

O gerador deve permitir selecionar o efeito e obter automaticamente o modificador.

---

## 12. Características Alteradas

Utilizado para modificar características do alvo.

Tipos:

* Reduzir atributo;
* Aumentar atributo;
* Conceder vantagem;
* Conceder desvantagem;
* Suprimir desvantagem;
* Negar vantagem.

### Regra de cálculo

A penalidade é determinada pelo custo efetivo em pontos.

```text
Penalidade = -ceil(|custo em pontos| / 5)
```

Exemplos:

```text
20 pontos → -4
24 pontos → -5
25 pontos → -5
26 pontos → -6
```

O arredondamento é sempre para cima.

#### Estrutura da interface

Primeiro selecionar a ação.

Depois informar a característica e seu valor.

Exemplo:

```text
Aumentar Atributo
ST +2
20 pontos
```

O JSON exportado deve utilizar:

```json
"caracteristicas_alteradas": [
    {
        "valor": "Aumentar Atributo: ST+2 (20 pontos)",
        "modificador": -4
    }
]
```

O campo `modificador` representa exclusivamente a penalidade de conjuração.

#### Limite racial

Quando um atributo ultrapassa o limite racial, cada incremento adicional sofre uma penalidade progressivamente dobrada.

Exemplo:

```text
20 → 21: -8
21 → 22: -16
```

Essa regra deve ser aplicada ao custo efetivo antes do cálculo final da penalidade.

---

## 13. Conceder Bônus / Impor Redutores

Esse parâmetro representa bônus ou penalidades aplicados a testes específicos.

### Escopos

#### Único

Uma tarefa específica ou uma perícia específica.

Exemplo:

```text
Escalar
```

#### Moderado

Um grupo relacionado.

Exemplo:

```text
Furtividade
Visão
```

#### Amplo

Uma grande variedade de testes relacionados.

Exemplo:

```text
Defesas Ativas
Sentidos
Perícias wildcard
```

### Tabela

| Bônus/Redutor | Único | Moderado | Amplo |
| ------------: | ----: | -------: | ----: |
|            ±1 |    -2 |       -3 |    -4 |
|            ±2 |    -4 |       -6 |    -8 |
|            ±3 |    -6 |       -9 |   -12 |
|            ±4 |    -8 |      -12 |   -16 |
|            ±5 |   -10 |      -15 |   -20 |
|            ±6 |   -12 |      -18 |   -24 |
|            ±7 |   -14 |      -21 |   -28 |
|            ±8 |   -16 |      -24 |   -32 |
|            ±9 |   -18 |      -27 |   -36 |
|           ±10 |   -20 |      -30 |   -40 |

Não pode conceder bônus:

* à própria magia;
* à perícia usada para conjurar;
* a qualquer teste necessário para conjurar a própria magia;
* diretamente ao efeito da magia;
* diretamente à resistência contra a própria magia.

O bônus deve especificar quais testes são afetados.

---

## 14. Cura

Cura representa restauração ou regeneração.

Pode ser utilizada para:

* seres vivos;
* objetos;
* construtos;
* elementais;
* mortos-vivos;
* demônios;

desde que o domínio utilizado seja apropriado.

Domínios relacionados:

* Vida: Bestas, Flora, Sangue;
* Artefatos/Terra e outros: objetos, construtos, elementais etc.;
* Necromancia: mortos-vivos;
* Diabolismo: demônios.

### Estrutura

Cura é uma exceção aos parâmetros simples porque o gerador precisa conhecer o **tipo de cura**.

Estrutura:

```json
"cura": {
    "tipo": "Vitalidade",
    "efeito": "Recuperar HP",
    "valor": "12d6",
    "modificador": -12
}
```

Quando houver vários efeitos:

```json
"cura": [
    {
        "tipo": "Vitalidade",
        "efeito": "Recuperar HP",
        "valor": "12d6",
        "modificador": -12
    },
    {
        "tipo": "Consciência",
        "efeito": "Trauma leve",
        "valor": "Recuperar consciência",
        "modificador": -5
    }
]
```

As penalidades de efeitos diferentes normalmente são somadas, salvo quando a própria tabela disser o contrário.

---

### Cura — Fadiga

Recuperar FP:

```text
-1 para cada 2 FP recuperados
```

---

### Cura — Vitalidade

Recuperar HP:

```text
-1 para cada 1d6 HP
```

Parar sangramento/recuperar 1 HP:

```text
0
```

---

### Cura — Consciência

| Situação                      | Modificador |
| ----------------------------- | ----------: |
| Trauma leve / HP positivo     |           0 |
| Inconsciência                 |          -1 |
| Trauma moderado: 0 a -1×HP    |          -2 |
| Trauma grave: abaixo de -1×HP |          -4 |

---

### Cura — Membros e Órgãos

| Condição                            | Modificador |
| ----------------------------------- | ----------: |
| Membro menor temporário             |          -5 |
| Membro maior temporário             |         -10 |
| Membro menor permanente             |          -8 |
| Membro maior permanente             |         -15 |
| Regenerar membro perdido em 30 dias |         -20 |
| Em 24 horas                         |         -25 |
| Em 1 hora                           |         -30 |
| Instantâneo                         |         -40 |

---

### Cura — Sentidos

| Condição           | Modificador |
| ------------------ | ----------: |
| Sentido temporário |          -5 |
| Sentido permanente |         -10 |
| Fala temporária    |         -10 |
| Fala permanente    |         -20 |

---

### Cura — Doenças

| Condição                  | Modificador |
| ------------------------- | ----------: |
| Trivial                   |          -1 |
| Leve                      |          -3 |
| Moderada                  |          -5 |
| Severa                    |          -8 |
| Crônica                   |         -12 |
| Degenerativa              |         -16 |
| Incurável                 |         -20 |
| Incurável por magia comum |         -25 |
| Terminal                  |         -30 |
| Terminal avançada         |         -40 |
| Sobrenatural              |         -50 |
| Terminal sobrenatural     |         -60 |
| Corpo + essência          |         -75 |

Quando mais de uma categoria se aplicar, utiliza-se **a categoria mais alta aplicável**, e não a soma.

---

### Cura — Atribulações

Utiliza a tabela de Atribulação quando a magia remove uma atribulação.

Casos especiais:

| Condição                                 |     Modificador |
| ---------------------------------------- | --------------: |
| Atribulação comum                        | conforme tabela |
| Maldição sobrenatural permanente         |             -30 |
| Petrificação ou transformação semelhante |             -40 |
| Transformação corporal reversível        |             -25 |
| Transformação corporal permanente        |             -40 |

---

### Cura — Mente

| Condição                                               | Modificador |
| ------------------------------------------------------ | ----------: |
| Confusão                                               |          -2 |
| Medo/pânico                                            |          -3 |
| Distúrbio mental temporário                            |          -5 |
| Trauma leve / remover Quirk                            |          -5 |
| Trauma moderado / remover desvantagem até 10 pontos    |         -10 |
| Trauma severo / remover desvantagem acima de 10 pontos |         -20 |
| Loucura temporária                                     |         -10 |
| Loucura permanente                                     |         -25 |
| Restaurar personalidade profundamente alterada         |         -30 |
| Restaurar memórias perdidas                            |         -30 |
| Restaurar identidade / mente severamente danificada    |         -40 |
| Reconstruir mente destruída                            |         -50 |

---

### Cura — Veneno e Toxinas

| Condição                       | Modificador |
| ------------------------------ | ----------: |
| Leve                           |          -2 |
| Moderada                       |          -5 |
| Potente                        |         -10 |
| Letal                          |         -15 |
| Extremamente complexa          |         -20 |
| Sobrenatural/mágica            |         -30 |
| Altera permanentemente o corpo |         -40 |

---

### Cura — Morte Iminente

| Efeito                                               | Modificador |
| ---------------------------------------------------- | ----------: |
| Estabilizar ferimento fatal                          |          -5 |
| Impedir morte iminente                               |         -10 |
| Ressurreição após ataque cardíaco/asfixia/afogamento |         -15 |

A prevenção de morte iminente possui limite de até 5 HP, conforme a regra original.

---

### Ressurreição Imperfeita

| Condição                                     | Modificador |
| -------------------------------------------- | ----------: |
| Até 10 min                                   |      -25 XP |
| Até 24 h                                     | -25 XP, -60 |
| Corpo deteriorado após dias/semanas          |         -75 |
| Corpo parcialmente destruído após meses/anos |         -90 |
| Sem corpo adequado                           |        -120 |

---

### Ressurreição Perfeita

| Condição                                      |  Modificador |
| --------------------------------------------- | -----------: |
| Até 10 min                                    |         -300 |
| Até 24 h                                      |         -325 |
| Dias/semanas                                  |         -350 |
| Meses/anos                                    |         -400 |
| Corpo severamente destruído, abaixo de -10×HP |         -450 |
| Corpo completamente destruído                 |         -500 |
| Corpo + essência dispersos                    | -600 ou mais |

Valores extremamente altos podem exigir recursos excepcionais.

---

### Regra de compra de pontos

A cura definitiva de problemas crônicos ou semelhantes somente é definitiva se as respectivas desvantagens forem recompradas em pontos de personagem antes da conclusão do ritual.

Essa regra pertence ao funcionamento do sistema e não precisa ser transformada em um campo adicional do JSON.

---

## 15. Dano

Dano também é uma exceção estrutural porque possui:

* quantidade;
* tipo;
* modificador de conjuração.

Estrutura:

```json
"dano": {
    "valor": "3d6-3",
    "tipo": "Perfurante",
    "modificador": -6
}
```

Podem existir vários danos:

```json
"dano": [
    {
        "valor": "3d6",
        "tipo": "Fogo",
        "modificador": -3
    },
    {
        "valor": "2d6",
        "tipo": "Elétrico",
        "modificador": -4
    }
]
```

---

### Dano básico

|     Dano | Modificador |
| -------: | ----------: |
| 2 pontos |           0 |
|      1d6 |          -1 |
|      2d6 |          -2 |
|      3d6 |          -3 |
|      ... |         ... |
|     10d6 |         -10 |

A progressão continua além de 10d6.

---

### Tipos de dano

#### Contusivo

Aumenta o dano efetivo:

```text
+1 por dado
```

O modificador de conjuração recebe o bônus correspondente.

Exemplo:

```text
3d6 contusivo
```

Dano efetivo:

```text
3d6+3
```

---

#### Perfurante

Penalidade adicional:

```text
-1 por dado
```

O modificador de dano é dobrado.

Exemplo:

```text
3d6 perfurante
```

Dano efetivo:

```text
3d6-3
```

Penalidade de conjuração:

```text
-6
```

---

#### Elétrico

Penalidade:

```text
-1 por dado
```

Além disso:

* armadura metálica possui RD 1 contra eletricidade;
* pode provocar atordoamento.

Exemplo:

```text
5d6 elétrico
```

Dano:

```text
5d6-5
```

Penalidade:

```text
-10
```

---

#### Fogo

Possui as regras próprias de fogo, inclusive ignição de materiais inflamáveis.

Exemplo:

```text
3d6 fogo
```

Dano:

```text
3d6
```

Penalidade:

```text
-3
```

---

### Dano direto e indireto

#### Dano direto

Ignora o teste de Resistência/Durabilidade do alvo quando a regra da magia assim determinar.

A magia deve possuir alcance definido.

#### Dano indireto

Exige teste de Ataque Inato.

A RD do alvo é aplicada normalmente.

---

### Regra importante de importação

O gerador não deve interpretar:

```text
"valor": "3d6-3"
```

para descobrir a penalidade.

O valor:

```text
"modificador": -6
```

é a informação responsável pela penalidade.

Se houver divergência, ela deve ser apresentada ao usuário para correção manual.

---

## 16. Invocação Direta

A dificuldade depende da relação entre os pontos totais da criatura e os pontos totais atuais do conjurador.

O gerador não precisa armazenar os pontos do conjurador ou da criatura.

O dado relevante armazenado é a **porcentagem da criatura em relação ao conjurador**.

Estrutura:

```json
"invocacao": {
    "valor": "75%",
    "modificador": -6
}
```

### Tabela

|      Relação | Modificador |
| -----------: | ----------: |
| 1 ponto / 5% |           0 |
|      até 25% |          -2 |
|       26–50% |          -4 |
|       51–75% |          -6 |
|      76–100% |          -8 |
|     101–125% |         -10 |
|     126–150% |         -12 |
|     151–175% |         -14 |
|     176–200% |         -16 |
|     201–250% |         -18 |
|     251–300% |         -20 |

Acima de 300% dos pontos do conjurador:

```text
não pode ser diretamente invocado
```

A exceção de 1 ponto corresponde a um animal de estimação básico e possui penalidade 0.

---

## 17. Massa / Volume

Representa a massa ou volume máximo do alvo.

|      Valor | Modificador |
| ---------: | ----------: |
| 1 kg / 1 L |           0 |
|          2 |          -1 |
|          3 |          -2 |
|          5 |          -3 |
|          7 |          -4 |
|         10 |          -5 |
|         20 |          -6 |
|         30 |          -7 |
|         50 |          -8 |
|         70 |          -9 |
|        100 |         -10 |
|        200 |         -11 |
|        300 |         -12 |
|        500 |         -13 |
|        700 |         -14 |
|      1.000 |         -15 |
|      2.000 |         -16 |
|      3.000 |         -17 |
|      5.000 |         -18 |
|      7.000 |         -19 |
|     10.000 |         -20 |

A progressão continua:

```text
1 → 2 → 3 → 5 → 7 → 10
```

repetindo-se nas ordens de grandeza seguintes.

O parâmetro deve representar massa ou volume de maneira clara.

---

## 18. Metamorfose

A penalidade depende dos pontos da **forma assumida**, e não dos pontos totais do personagem.

### Exceção

Transformação puramente cosmética:

```text
0
```

### Tabela

Cada 25 pontos da forma:

```text
-1
```

| Pontos da forma | Modificador |
| --------------: | ----------: |
|       Cosmética |           0 |
|            1–25 |          -1 |
|           26–50 |          -2 |
|           51–75 |          -3 |
|          76–100 |          -4 |
|         101–125 |          -5 |
|         126–150 |          -6 |
|             ... |         ... |

A progressão continua.

O gerador deve preferencialmente utilizar um campo numérico aberto.

Exemplo:

```json
"metamorfose": {
    "valor": "150 pontos",
    "modificador": -6
}
```

A regra referente à Inteligência da forma é geral do sistema e permanece na documentação, não sendo necessário criar um campo específico para ela.

---

## 19. Modificadores de Ataque

Esse parâmetro somente deve aparecer para magias de ataque que causam dano.

Pode conter vários modificadores simultaneamente.

Cada item possui:

```json
{
    "valor": "...",
    "modificador": -5
}
```

### Modificadores

| Modificador                         |             Penalidade |
| ----------------------------------- | ---------------------: |
| Afeta Insubstancial                 |                     -2 |
| Aura                                |                     -8 |
| Assinatura baixa                    |                     -1 |
| Assinatura inexistente              |                     -2 |
| Cíclico — 1 dia                     |                     -1 |
| Cíclico — 1 hora                    |                     -2 |
| Cíclico — 1 minuto                  |                     -4 |
| Cíclico — 10 segundos               |                     -5 |
| Cíclico — 1 segundo                 |                    -10 |
| Cone                                | -5 + -1 por metro/base |
| Divisor de Armadura 2               |                     -5 |
| Divisor de Armadura 3               |                    -10 |
| Divisor de Armadura 5               |                    -15 |
| Divisor de Armadura 10              |                    -20 |
| Fogo contínuo CDT 2                 |                     -4 |
| CDT 3                               |                     -6 |
| CDT 4                               |                     -8 |
| CDT 5                               |                    -10 |
| CDT 6                               |                    -12 |
| CDT 7–8                             |                    -15 |
| CDT 9–10                            |                    -20 |
| Fragmentação                        |            -2 por dado |
| Jato                                |                      0 |
| Apenas projeção                     |                      0 |
| Projeção dobrada                    |                     -2 |
| Retardo fixo                        |                      0 |
| Retardo variável — 0–10 turnos      |                     -1 |
| Retardo variável — qualquer período |                     -2 |
| Guiado                              |                     -5 |
| Teleguiado — visão normal           |                     -8 |
| Teleguiado — visão noturna          |                     -9 |
| Teleguiado — infravisão             |                    -10 |
| Teleguiado — visão no escuro        |                    -12 |

A interface deve primeiro selecionar o tipo e somente depois apresentar os campos adicionais necessários.

Exemplos:

* Divisor → selecionar 2, 3, 5 ou 10;
* Cone → informar comprimento;
* Cíclico → selecionar intervalo;
* Teleguiado → selecionar tipo de visão.

---

## 20. Múltiplos Alvos

Utilizado quando uma única magia afeta simultaneamente vários alvos individuais.

Não deve ser utilizado para representar Área de Efeito.

O próprio mago possui regra especial:

```text
0
```

Tabela:

|        Alvos | Modificador |
| -----------: | ----------: |
| Próprio mago |           0 |
|            1 |          -1 |
|            2 |          -2 |
|            3 |          -3 |
|            4 |          -4 |
|            5 |          -5 |
|            6 |          -6 |
|            8 |          -7 |
|           10 |          -8 |
|           15 |          -9 |
|           20 |         -10 |
|           30 |         -11 |
|           50 |         -12 |
|           75 |         -13 |
|          100 |         -14 |
|          150 |         -15 |
|          200 |         -16 |
|          300 |         -17 |
|          500 |         -18 |
|          750 |         -19 |
|        1.000 |         -20 |

Exemplo:

```json
"multiplos_alvos": {
    "valor": "10 alvos",
    "modificador": -8
}
```

O próprio mago pode ser incluído entre os alvos sem alterar a penalidade.

---

## 21. Tamanho

Tamanho é utilizado quando a magia precisa afetar **uma criatura ou objeto inteiro**.

Não deve ser utilizado para afetar somente uma parte do corpo.

Não substitui Área de Efeito.

A tabela utiliza o maior comprimento/dimensão necessário conforme o Modificador de Tamanho (MT).

|            MT | Dimensão | Modificador |
| ------------: | -------: | ----------: |
| MT 0 ou menor |      2 m |           0 |
|         MT +1 |      3 m |          -2 |
|         MT +2 |      5 m |          -4 |
|         MT +3 |      7 m |          -6 |
|         MT +4 |     10 m |          -8 |
|         MT +5 |     15 m |         -10 |
|         MT +6 |     20 m |         -12 |
|         MT +7 |     30 m |         -14 |
|         MT +8 |     50 m |         -16 |
|         MT +9 |     70 m |         -18 |
|        MT +10 |    100 m |         -20 |
|        MT +11 |    150 m |         -22 |
|        MT +12 |    200 m |         -24 |
|        MT +13 |    300 m |         -26 |
|        MT +14 |    500 m |         -28 |
|        MT +15 |    700 m |         -30 |
|        MT +16 |     1 km |         -32 |
|        MT +17 |   1,5 km |         -34 |
|        MT +18 |     2 km |         -36 |
|        MT +19 |     3 km |         -38 |
|        MT +20 |     5 km |         -40 |

Estrutura:

```json
"tamanho": {
    "valor": "MT +4 — 10 m",
    "modificador": -8
}
```

O gerador deve permitir progressão além da tabela caso necessário.

---

## 22. Velocidade

| Velocidade | Equivalente | Modificador |
| ---------: | ----------: | ----------: |
|      1 m/s |    3,6 km/h |           0 |
|      2 m/s |    7,2 km/h |          -1 |
|      3 m/s |   10,8 km/h |          -2 |
|      5 m/s |     18 km/h |          -3 |
|      7 m/s |   25,2 km/h |          -4 |
|     10 m/s |     36 km/h |          -5 |
|     15 m/s |     54 km/h |          -6 |
|     20 m/s |     72 km/h |          -7 |
|     25 m/s |     90 km/h |          -8 |
|     30 m/s |    108 km/h |          -9 |
|     40 m/s |    144 km/h |         -10 |
|     50 m/s |    180 km/h |         -11 |
|     70 m/s |    252 km/h |         -12 |
|    100 m/s |    360 km/h |         -13 |
|    140 m/s |    504 km/h |         -14 |
|    180 m/s |    648 km/h |         -15 |
|    220 m/s |    792 km/h |         -16 |
|    250 m/s |    900 km/h |         -17 |
|    280 m/s |  1.008 km/h |         -18 |
|    315 m/s |  1.134 km/h |         -19 |
|    350 m/s |  1.260 km/h |         -20 |

Acima de -20:

```text
situação excepcional
```

A interface deve apresentar o valor em m/s e, quando possível, sua conversão em km/h.

Exemplo:

```json
"velocidade": {
    "valor": "10 m/s (36 km/h)",
    "modificador": -5
}
```

---

## 23. Duração

A duração é obrigatória.

| Duração         | Modificador |
| --------------- | ----------: |
| Momentânea      |           0 |
| Até 10 segundos |          -1 |
| Até 30 segundos |          -2 |
| Até 1 minuto    |          -3 |
| Até 3 minutos   |          -4 |
| Até 6 minutos   |          -5 |
| Até 12 minutos  |          -6 |
| Até 30 minutos  |          -8 |
| Até 1 hora      |         -10 |
| Até 3 horas     |         -12 |
| Até 6 horas     |         -13 |
| Até 12 horas    |         -14 |
| Até 1 dia       |         -15 |
| Até 2 dias*     |         -16 |
| Até 3 dias*     |         -17 |
| Até 1 semana*   |         -18 |
| Até 1 mês*      |         -19 |
| Permanente*     |         -20 |

Valores superiores a 1 dia são exclusivos de Rituais.

### Importante

O usuário deve selecionar a categoria oficial da tabela.

Exemplo:

```text
10 minutos
```

não possui uma linha própria.

Deve ser selecionado:

```text
Até 12 minutos
```

com modificador:

```text
-6
```

---

## 24. Duração permanente

Efeitos permanentes possuem regras especiais.

Um efeito permanente que conceda benefícios que aumentem os pontos do personagem deve exigir a respectiva compra em pontos antes da conclusão do efeito.

Exemplos:

* reduzir desvantagens existentes;
* aumentar atributos;
* adquirir vantagens;
* aumentar vantagens.

Magias permanentes exigem:

* Nível 5;
* NH 25+;
* decisão do GM;
* possibilidade de componentes finos ou lendários.

Essas condições pertencem às regras do sistema e não precisam ser armazenadas como parâmetros adicionais.

---

## 25. Domínios e esferas

Os 20 domínios são agrupados em cinco esferas.

### Vida

* Bestas
* Flora
* Sangue

### Matéria

* Água
* Ar
* Terra
* Artefatos

### Forças

* Fogo
* Luz
* Som
* Escuridão
* Gravidade

### Consciência

* Conhecimento
* Ilusão
* Mente

### Transcendência

* Destino
* Diabolismo
* Dimensão
* Magia
* Necromancia

---

## 26. Requisitos mágicos

O sistema utiliza:

* Magery 0 / Aptidão Mágica / Sensibilidade à Magia;
* perícia Magia Ritual;
* pelo menos uma perícia de Domínio;
* Afinidade com a Esfera correspondente;
* Taumatologia opcional.

Magery possui apenas:

```text
Magery 0
```

Não existem níveis superiores de Magery.

---

## 27. Níveis de perícia dos Domínios

|    NH | Grau                   |
| ----: | ---------------------- |
|   <12 | Aprendiz — nível 0     |
| 12–14 | Iniciante — nível 1    |
| 15–17 | Adepto — nível 2       |
| 18–20 | Especialista — nível 3 |
| 21–24 | Mestre — nível 4       |
|   25+ | Sábio — nível 5        |

Nível 0 não permite lançar magias sozinho.

O lançamento independente exige:

```text
NH 12+
```

---

## 28. Afinidade com Esfera

Cada nível de Afinidade fornece:

```text
+1 Magery efetiva
```

para todas as magias da respectiva Esfera.

Cada nível:

* possui 1 pré-requisito;
* custa 8 pontos de personagem;
* não altera o nível da perícia de Domínio.

---

## 29. Categorias de magia

O sistema utiliza três categorias:

### Truques

Execução rápida:

```text
1 segundo
```

Utilizam apenas um tipo de componente:

* gestos;
* palavras;
* ingredientes.

---

### Feitiços

Tempo maior que Truques e inferior a Ritual.

Utilizam dois tipos de componentes.

---

### Rituais

Tempo de 1 minuto ou mais.

Utilizam três tipos de componentes.

---

## 30. Componentes e penalidades

Os componentes podem eliminar penalidades.

Eles não aumentam o NH efetivo acima do NH básico.

O resultado do teste não pode ultrapassar o NH base da perícia.

---

## 31. PM

Pontos de magia podem representar:

* Fadiga;
* Reserva de Energia;
* Tensão.

Cada PM pode reduzir a penalidade:

```text
1 PM = +1 NH
```

A regra de custo mínimo e a possibilidade de sofrer -5 NH por PM não gasto pertencem à execução da magia e não precisam ser representadas no JSON.

---

## 32. Tensão Mágica e Limiar

O sistema utiliza o conceito de Tensão Mágica e Limiar.

Limiar padrão:

```text
30
```

Recuperação:

```text
8 por dia
```

Essas regras fazem parte do sistema de resolução e não precisam ser incluídas em cada magia individual.

---

## 33. Múltiplos Domínios

O domínio necessário é determinado pela **natureza do efeito**, e não simplesmente pelos elementos afetados.

Se uma magia produz um único efeito que incidentalmente afeta vários elementos, não é necessário adicionar vários Domínios somente porque os elementos estão presentes.

Exemplo conceitual:

Uma magia de Necromancia que apodrece a carne não precisa necessariamente exigir Sangue apenas porque o corpo possui sangue.

A pergunta principal é:

> São dois efeitos distintos que poderiam existir como magias separadas ou é um único efeito?

Se forem efeitos independentes, pode ser necessário outro Domínio.

Se forem consequências de um único efeito, não se adiciona automaticamente outro Domínio.

---

## 34. Equipamentos e Artefatos

As regras específicas de equipamentos e Artefatos ficam fora do escopo do gerador de magias.

O gerador não deve tentar interpretar ou validar automaticamente regras específicas de equipamento.

---

## 35. Regras de interface

A interface deve ser progressiva e condicional.

Não apresentar todos os campos possíveis simultaneamente.

Exemplo:

Para Modificadores de Ataque:

```text
[Tipo de modificador]
```

Depois de selecionar:

```text
Divisor de Armadura
```

mostrar:

```text
[Divisor: 2 / 3 / 5 / 10]
```

Para Cura:

```text
[Categoria]
↓
[Efeito/subtipo]
↓
[Quantidade ou controle necessário]
```

Para Dano:

```text
[Quantidade de dados]
[Tipo de dano]
[Adicionar outro dano]
```

---

## 36. Parâmetros simples

A maioria dos parâmetros deve seguir:

```json
{
    "valor": "...",
    "modificador": -X
}
```

Exemplos:

```json
"alcance": {
    "valor": "20 m",
    "modificador": -6
}
```

```json
"duracao": {
    "valor": "Até 1 hora",
    "modificador": -10
}
```

```json
"velocidade": {
    "valor": "10 m/s (36 km/h)",
    "modificador": -5
}
```

---

## 37. Parâmetros com estrutura especial

Alguns parâmetros precisam de informações adicionais para que o gerador consiga editar/importar corretamente.

### Dano

```json
{
    "valor": "3d6-3",
    "tipo": "Perfurante",
    "modificador": -6
}
```

### Cura

```json
{
    "tipo": "Vitalidade",
    "efeito": "Recuperar HP",
    "valor": "12d6",
    "modificador": -12
}
```

### Características Alteradas

O `valor` contém a ação, descrição e custo.

```json
{
    "valor": "Aumentar Atributo: ST+2 (20 pontos)",
    "modificador": -4
}
```

Essas exceções existem porque o gerador precisa conhecer a estrutura interna do parâmetro.

---

## 38. Arrays

Parâmetros que podem ocorrer várias vezes devem utilizar arrays.

Exemplo:

```json
"dano": [
    {
        "valor": "3d6",
        "tipo": "Fogo",
        "modificador": -3
    },
    {
        "valor": "2d6",
        "tipo": "Elétrico",
        "modificador": -4
    }
]
```

O modificador total desse parâmetro será:

```text
-3 + -4 = -7
```

O mesmo princípio se aplica a outros parâmetros que permitam múltiplos efeitos.

---

## 39. Progressões abertas

Não limitar artificialmente a interface ao último valor conhecido da tabela quando a regra prevê continuidade.

Progressões abertas incluem:

* Alcance;
* Área de Efeito;
* Massa/Volume;
* Dano;
* Metamorfose;
* Invocação quando aplicável dentro do limite;
* Tamanho;
* Velocidade;
* outras progressões explicitamente contínuas.

O gerador deve calcular o modificador conforme a progressão.

---

## 40. Tabelas fechadas

Quando a regra possui valores discretos definidos, o usuário deve selecionar uma opção oficial.

Exemplos:

* Duração;
* Tempo de Conjuração;
* tipos de Atribulação;
* divisor de armadura;
* intervalos de Cíclico;
* tipos de Teleguiado.

Não transformar esses valores em campos livres.

---

## 41. Importação do JSON antigo

O gerador deve ser capaz de importar o JSON atualmente existente.

A importação deve ser **não destrutiva**.

Isso significa:

1. preservar os dados originais;
2. converter formatos antigos quando possível;
3. identificar divergências;
4. não substituir silenciosamente um valor original por um valor recalculado;
5. permitir correção manual.

---

## 42. `nivel_nome` na importação

Se o JSON importado possuir:

```json
"nivel": 3,
"nivel_nome": "Alguma Coisa"
```

o gerador deve considerar:

```text
nivel = 3
```

como fonte de verdade.

Deve reconstruir:

```text
nivel_nome = Manipulação
```

e sinalizar a divergência caso o valor antigo seja diferente.

---

## 43. Divergências de penalidade

O JSON antigo pode conter penalidades que não correspondam às tabelas atuais.

O gerador não deve sobrescrever automaticamente o valor antigo.

Deve permitir identificar:

```text
Penalidade armazenada: -10
Penalidade calculada: -12
```

e apresentar a divergência para decisão do usuário.

---

## 44. Exemplo de divergência de Dano

Importado:

```json
"dano": {
    "valor": "3d6-3",
    "tipo": "Perfurante",
    "modificador": -3
}
```

O sistema sabe que:

```text
3d6 perfurante = -6
```

Mas o `modificador` armazenado é `-3`.

O gerador deve:

1. preservar `-3`;
2. calcular que a regra atual indicaria `-6`;
3. sinalizar a inconsistência;
4. permitir ao usuário corrigir;
5. não alterar silenciosamente o valor.

---

## 45. Compatibilidade com o `grimorio.js`

O formato exportado deve continuar compatível com o `grimorio.js` atual.

Estrutura principal:

```text
id
nome
dominio
nivel
nivel_nome
categoria
efeito
parametros
penalidade
observacao
```

O gerador não deve modificar desnecessariamente essa estrutura.

Mudanças futuras no JavaScript devem ser feitas apenas quando necessárias para suportar novos formatos estruturados.

---

## 46. Cálculo de PM no Grimório

O custo de PM é derivado do nível da magia.

Não é necessário armazenar o custo de PM no JSON.

O `grimorio.js` calcula:

```text
PM = nível da magia
```

Exemplo:

```text
Nível 1 → 1 PM
Nível 2 → 2 PM
Nível 3 → 3 PM
Nível 4 → 4 PM
Nível 5 → 5 PM
```

---

## 47. Exibição da penalidade

O Grimório deve apresentar:

* penalidade final;
* parâmetros;
* modificadores;
* tempo de conjuração;
* custo em PM.

A penalidade final armazenada deve corresponder à regra atual quando a magia tiver sido criada ou atualizada pelo gerador.

---

## 48. Regras que não devem ser transformadas em parâmetros

Algumas regras pertencem à resolução da magia e não à definição estrutural da magia.

Não criar campos desnecessários para:

* custo mínimo de PM;
* penalidade por economizar PM;
* recuperação de Tensão;
* Limiar;
* penalidades circunstanciais de cura;
* compra de pontos após cura permanente;
* regras específicas do GM;
* componentes narrativos;
* regras específicas de equipamentos;
* regras de Domínio que podem ser determinadas conceitualmente.

Essas informações permanecem na documentação do sistema ou em `observacao` quando necessário.

---

## 49. Penalidades circunstanciais de Cura

Algumas penalidades dependem da situação durante a execução e não devem ser incorporadas automaticamente ao modificador estrutural da magia.

Exemplos:

#### Cura repetida

A mesma cura no mesmo alvo dentro de 24 horas:

```text
-3 cumulativo
```

#### Autocura

A penalidade é igual aos HP perdidos pelo próprio conjurador.

Essas penalidades são circunstanciais e devem ser aplicadas durante a resolução, não no cálculo estrutural do gerador.

---

## 50. Distinção entre regra estrutural e regra de execução

O gerador calcula aquilo que pertence à **construção da magia**.

A mesa de jogo calcula aquilo que depende da **situação concreta da conjuração**.

#### Estrutural

Exemplos:

* alcance;
* duração;
* dano;
* área;
* tempo;
* tamanho;
* velocidade;
* múltiplos alvos.

#### Execução

Exemplos:

* PM efetivamente gasto;
* penalidade por economizar PM;
* circunstâncias especiais;
* penalidades cumulativas de cura;
* decisões do GM.

---

## 51. Regra de ouro para futuras alterações

Antes de modificar qualquer parâmetro, verificar:

1. Qual é o valor efetivo?
2. Qual é o modificador de conjuração?
3. O parâmetro possui uma tabela?
4. É uma progressão aberta ou fechada?
5. Pode ocorrer mais de uma vez?
6. O importador precisa conhecer sua estrutura interna?
7. O `grimorio.js` atual consegue exibi-lo?
8. A regra pertence à construção da magia ou à execução?
9. O valor armazenado pode ser recalculado sem destruir informação histórica?
10. A alteração mantém compatibilidade com magias antigas?

---

## 52. Estrutura recomendada de uma magia completa

Exemplo conceitual:

```json
{
    "id": "exemplo-001",
    "nome": "Exemplo de Magia",
    "dominio": "Ar",
    "nivel": 3,
    "nivel_nome": "Manipulação",
    "categoria": "Feitiço",
    "efeito": "A magia produz o efeito descrito.",
    "parametros": {
        "alcance": {
            "valor": "20 m",
            "modificador": -6
        },
        "duracao": {
            "valor": "Momentânea",
            "modificador": 0
        },
        "dano": {
            "valor": "3d6-3",
            "tipo": "Perfurante",
            "modificador": -6
        },
        "tempo_conjuracao": {
            "valor": "3 segundos",
            "modificador": 2
        }
    },
    "penalidade": -10,
    "observacao": ""
}
```

Cálculo:

```text
Alcance       -6
Duração        0
Dano          -6
Tempo          +2
----------------
Total         -10
```

Penalidade final:

```text
-10
```

---

## 53. Checklist de validação da magia

Antes de exportar uma magia, o gerador deve verificar:

* [ ] Possui ID;
* [ ] Possui nome;
* [ ] Possui Domínio;
* [ ] Possui nível válido;
* [ ] `nivel_nome` corresponde ao nível;
* [ ] Possui categoria válida;
* [ ] Possui descrição;
* [ ] Possui Alcance;
* [ ] Possui Duração;
* [ ] Possui Tempo de Conjuração;
* [ ] Tempo é compatível com a categoria;
* [ ] Todos os parâmetros possuem modificadores válidos;
* [ ] Arrays possuem objetos válidos;
* [ ] Dano possui tipo, valor e modificador;
* [ ] Cura possui tipo, efeito, valor e modificador;
* [ ] Características Alteradas possui ação, descrição e custo;
* [ ] Penalidade final foi calculada;
* [ ] Penalidade final não é positiva;
* [ ] Não existem parâmetros incompatíveis com a categoria ou efeito;
* [ ] Eventuais divergências de importação foram resolvidas ou explicitamente mantidas.

---

## 54. Regra de compatibilidade

O objetivo não é criar um novo sistema independente do Grimório.

O objetivo é criar um **gerador/editor compatível com a estrutura existente**.

Portanto:

> **Preservar a estrutura existente sempre que ela for suficiente.**

Somente criar novos formatos quando a estrutura anterior não conseguir representar corretamente uma regra necessária.

---

## 55. Regra de não destruição

Durante importação, edição ou atualização:

> **Nenhuma informação existente deve ser sobrescrita automaticamente apenas porque o gerador consegue calcular um valor diferente.**

O sistema deve preferir:

```text
preservar → comparar → sinalizar → permitir correção
```

em vez de:

```text
recalcular → sobrescrever
```

Isso é especialmente importante para:

* penalidades antigas;
* dano;
* cura;
* duração;
* tempo;
* valores de parâmetros;
* formatos legados.

---

## 56. Fonte de verdade

Quando houver conflito entre informações:

### Para o nível

```text
nivel
```

é a fonte de verdade.

### Para o modificador armazenado

```text
modificador
```

é a fonte de verdade do valor atualmente armazenado.

### Para a regra atual

As tabelas deste documento são a fonte de verdade para calcular o valor que **deveria** ser utilizado atualmente.

### Em caso de divergência

O gerador deve preservar o valor antigo e sinalizar a diferença.

---

## 57. Resumo da arquitetura

A arquitetura conceitual é:

```text
USUÁRIO
   ↓
INTERFACE ESTRUTURADA
   ↓
REGRAS DE NEGÓCIO
   ↓
CÁLCULO DOS MODIFICADORES
   ↓
VALIDAÇÃO
   ↓
JSON
   ↓
GRIMÓRIO
   ↓
EXIBIÇÃO DA MAGIA
```

O gerador não deve depender de texto livre para interpretar regras que já estão formalizadas.

---

## 58. Regra final

O princípio central do projeto é:

> **O usuário escolhe o efeito que deseja produzir; o gerador transforma essa escolha em uma representação estruturada e calcula automaticamente a penalidade correspondente.**

O JSON deve armazenar tanto o **resultado efetivo do parâmetro** quanto o **modificador utilizado no cálculo da magia**, de modo que o Grimório possa exibir a magia e o gerador possa posteriormente importá-la e editá-la sem perder informação.

Quando houver múltiplos efeitos, utilizar arrays.

Quando um parâmetro exigir informação interna para ser editado corretamente, utilizar uma estrutura específica.

Quando uma regra for circunstancial ou depender da situação da mesa, mantê-la fora do cálculo estrutural da magia.

Quando houver conflito entre dados antigos e as regras atuais, **preservar, sinalizar e permitir correção manual — nunca sobrescrever silenciosamente**.
