# Tabelas de Penalidades (Magia de Domínio)

## Alcance

Corresponde à distância entre o conjurador e o alvo ou objetivo da magia. Aplique as penalidades de distância apresentadas na tabela abaixo, seguindo a progressão padrão de distância de GURPS:

<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="width: 15%;">Mod.</th>
      <th style="width: 35%;">Distância</th>
      <th style="width: 15%;">Mod.</th>
      <th style="width: 35%;">Distância</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>0</strong></td><td>0 m</td><td><strong>–10</strong></td><td>100 m</td></tr>
    <tr><td><strong>–1</strong></td><td>3 m</td><td><strong>–11</strong></td><td>150 m</td></tr>
    <tr><td><strong>–2</strong></td><td>5 m</td><td><strong>–12</strong></td><td>200 m</td></tr>
    <tr><td><strong>–3</strong></td><td>7 m</td><td><strong>–13</strong></td><td>300 m</td></tr>
    <tr><td><strong>–4</strong></td><td>10 m</td><td><strong>–14</strong></td><td>500 m</td></tr>
    <tr><td><strong>–5</strong></td><td>15 m</td><td><strong>–15</strong></td><td>700 m</td></tr>
    <tr><td><strong>–6</strong></td><td>20 m</td><td><strong>–16</strong></td><td>1 km</td></tr>
    <tr><td><strong>–7</strong></td><td>30 m</td><td><strong>–17</strong></td><td>1,5 km</td></tr>
    <tr><td><strong>–8</strong></td><td>50 m</td><td><strong>–18</strong></td><td>2 km</td></tr>
    <tr><td><strong>–9</strong></td><td>70 m</td><td><strong>–19</strong></td><td>3 km</td></tr>
    <tr><td></td><td></td><td><strong>–20</strong></td><td>5 km</td></tr>
  </tbody>
</table>

!!! note "Observações sobre o alcance"
    <b>Progressão das distâncias:</b> a tabela segue uma progressão geométrica aproximada. A cada novo ponto de penalidade, a distância aumenta aproximadamente 1,5 vez, com os valores arredondados para números práticos. Por isso, após 5 km (–20), a progressão pode continuar seguindo a mesma lógica: 7 km, 10 km, 15 km, 20 km, 30 km, 50 km, e assim por diante.

    <b>A regra prática é:</b> para cada +1 de distância na tabela, aplique –1 adicional ao teste da magia.

    **Magias de projétil:** não aplicam as penalidades de distância desta tabela. Utilize a distância padrão de 1/2D = 10 m e Max. = 100 m, podendo esses valores ser modificados por [modificadores de ataque](../tabelas/penalidades_dominio.md#modificadores-de-ataque).

    **Magias de teleporte:** utilizam esta tabela para determinar a penalidade de distância, considerando **duas instâncias de alcance**:  
    1. a distância entre o **conjurador e o alvo** no momento da conjuração; e  
    2. a distância entre a **posição atual do alvo e seu novo destino**.
    
    As duas penalidades devem ser **somadas** para determinar a penalidade total de alcance da magia. Assim, um teleporte de um alvo localizado a 100 m do conjurador para um destino situado a 1 km de sua posição atual sofre **–10 pela primeira distância e –16 pela segunda, totalizando –26**.
    
    Quando o **próprio conjurador é o alvo do teleporte**, considera-se apenas a distância entre o conjurador e o novo destino. Nesse caso, não há uma segunda instância de alcance, pois a distância entre o conjurador e o alvo é zero.


---

## Área de efeito

Área de efeito corresponde ao raio da magia, em metros. Um raio de 1 m compreende apenas o hexágono central; um raio de 2 m compreende o hexágono central e seus adjacentes; um raio de 3 m compreende o hexágono central e os dois anéis de hexágonos ao seu redor, e assim por diante.

<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="width: 15%;">Mod.</th>
      <th style="width: 35%;">Raio</th>
      <th style="width: 15%;">Mod.</th>
      <th style="width: 35%;">Raio</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>0</strong></td><td>1 m</td><td><strong>–10</strong></td><td>40 m</td></tr>
    <tr><td><strong>–1</strong></td><td>2 m</td><td><strong>–11</strong></td><td>50 m</td></tr>
    <tr><td><strong>–2</strong></td><td>3 m</td><td><strong>–12</strong></td><td>70 m</td></tr>
    <tr><td><strong>–3</strong></td><td>4 m</td><td><strong>–13</strong></td><td>100 m</td></tr>
    <tr><td><strong>–4</strong></td><td>5 m</td><td><strong>–14</strong></td><td>140 m</td></tr>
    <tr><td><strong>–5</strong></td><td>7 m</td><td><strong>–15</strong></td><td>200 m</td></tr>
    <tr><td><strong>–6</strong></td><td>10 m</td><td><strong>–16</strong></td><td>300 m</td></tr>
    <tr><td><strong>–7</strong></td><td>14 m</td><td><strong>–17</strong></td><td>400 m</td></tr>
    <tr><td><strong>–8</strong></td><td>20 m</td><td><strong>–18</strong></td><td>500 m</td></tr>
    <tr><td><strong>–9</strong></td><td>30 m</td><td><strong>–19</strong></td><td>700 m</td></tr>
    <tr><td></td><td></td><td><strong>–20</strong></td><td>1 km</td></tr>
  </tbody>
</table>

**Progressão:** acima de –20, continue a sequência **1 → 1,4 → 2 → 3 → 4 → 5 → 7 → 10**, repetindo o mesmo padrão com cada novo ciclo multiplicado por 10. Assim, após 1 km, a sequência continua com **1,4 km, 2 km, 3 km, 4 km, 5 km, 7 km, 10 km**, depois **14 km, 20 km, 30 km...**.

---

## Atribulação

Use essa tabela para impor atordoamento, condições irritantes ou potencialmente fatais:

<table>
<thead>
<tr>
<th>Categoria</th>
<th>Efeito</th>
<th>Penalidade</th>
</tr>
</thead>
<tbody>

<tr><td rowspan="1"><strong>Atordoamento</strong></td><td>Atordoamento</td><td>-3</td></tr>
<tr><td rowspan="6"><strong>Condição irritante</strong></td><td>Embriagado</td><td>-5</td></tr>
<tr><td>Bêbado, Dor Moderada, Tosse</td><td>-6</td></tr>
<tr><td>Euforia, Nauseado</td><td>-7</td></tr>
<tr><td>Dor Severa</td><td>-8</td></tr>
<tr><td>Dor Terrível</td><td>-9</td></tr>
<tr><td>Alucinação, Ansia, Torpor, Vômito</td><td>-10</td></tr>
<tr><td rowspan="2"><strong>Condição incapacitante</strong></td><td>Agonia, Epilepsia, Asfixia, Extase</td><td>-12</td></tr>
<tr><td>Paralisia, Sono</td><td>-14</td></tr>
<tr><td rowspan="1"><strong>Condição potencialmente fatal</strong></td><td>Ataque Cardíaco, Coma</td><td>-20</td></tr>

</tbody>
</table>

---

## Características alteradas


Use essa tabela para aumento ou redução de atributos, inclusão ou remoção de vantagens e/ou desvantagens:

<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="width: 30%;">Efeito</th>
      <th style="width: 70%;">Modificador</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Reduzir atributo</strong></td>
      <td>-2 por cada -1 de redução</td>
    </tr>
    <tr>
      <td><strong>Aumentar atributo</strong></td>
      <td>-2 por cada +1 de acréscimo</td>
    </tr>
    <tr>
      <td><strong>Conceder vantagem</strong></td>
      <td>-1 por cada +5 pontos de vantagem concedida</td>
    </tr>
    <tr>
      <td><strong>Conceder desvantagem</strong></td>
      <td>-1 por cada -5 pontos de desvantagem concedida</td>
    </tr>
    <tr>
      <td><strong>Suprimir desvantagem</strong></td>
      <td>-1 por cada -5 pontos de desvantagem suprimida</td>
    </tr>
    <tr>
      <td><strong>Negar vantagem</strong></td>
      <td>-1 por cada +5 pontos de vantagem negada</td>
    </tr>
  </tbody>
</table>


!!! note "Importante:"
    A partir do limite racial do Atributo (20 para humanos por exemplo), cada acréscimo de penalidade é contada em **dobro**. Assim por exemplo, para um humano aumentar de 20 para 21 terá uma penalidade de -4 ao invés de -2; para aumentar de 21 para 22, será de -8;  e assim por diante. Estes valores são cumulativos. 


---

## Cura

As magias de Cura utilizam penalidades diferentes conforme a natureza e a extensão do efeito desejado. A penalidade representa a dificuldade de produzir a alteração, antes da aplicação dos modificadores e recursos disponíveis ao mago.

Quando uma magia produzir mais de um efeito, as penalidades correspondentes são somadas, salvo quando a própria descrição indicar o contrário.

<table>
<thead>
<tr>
<th>Categoria</th>
<th>Efeito</th>
<th>Penalidade</th>
</tr>
</thead>
<tbody>

<tr><td rowspan="1"><strong>Fadiga</strong></td><td>Recuperar PF</td><td>-1 para cada 1 PF</td></tr>

<tr><td rowspan="4"><strong>Vitalidade</strong></td><td>Recuperar PV</td><td>-1 para cada 2 PV</td></tr>
<tr><td>Estancar sangramento, recuperando 1 PV</td><td>0</td></tr>
<tr><td>Tratamento de choque, recuperando 1d6-3 PV (equivalente a NT2-3)</td><td>-1</td></tr>
<tr><td>Tratamento de choque, recuperando 1d PV (equivalente a NT8)</td><td>-2</td></tr>

<tr><td rowspan="3"><strong>Consciência</strong></td><td>Trauma leve: recuperar consciência com PV positivos. Também pode ser usado contra a atribulação <em>Inconsciência</em>.</td><td>-1</td></tr>
<tr><td>Trauma moderado: recuperar consciência com PV entre 0 e -1×PV. Também pode ser usado contra a atribulação <em>Inconsciência</em>.</td><td>-2</td></tr>
<tr><td>Trauma grave: recuperar consciência com PV menor que -1×PV. Também pode ser usado contra a atribulação <em>Inconsciência</em>.</td><td>-4</td></tr>

<tr><td rowspan="9"><strong>Membros e Órgãos</strong></td><td>Curar incapacitação temporária — membros menores (pés, mãos, olhos), recuperando PV perdidos</td><td>-10</td></tr>
<tr><td>Curar incapacitação temporária — membros maiores (braços, pernas), recuperando PV perdidos</td><td>-20</td></tr>
<tr><td>Curar incapacitação duradoura — membros menores (pés, mãos, olhos), recuperando PV perdidos</td><td>-15</td></tr>
<tr><td>Curar incapacitação duradoura — membros maiores (braços, pernas), recuperando PV perdidos</td><td>-25</td></tr>
<tr><td>Regenerar membro perdido lentamente (30 dias)</td><td>-30</td></tr>
<tr><td>Regenerar membro perdido em 24 horas</td><td>-35</td></tr>
<tr><td>Regenerar membro perdido em 1 hora</td><td>-40</td></tr>
<tr><td>Regenerar membro perdido em 10 minutos</td><td>-45</td></tr>
<tr><td>Regenerar membro perdido instantaneamente</td><td>-50</td></tr>

<tr><td rowspan="5"><strong>Sentidos</strong></td><td>Restaurar instantaneamente, mas temporariamente, um sentido (órgão intacto)</td><td>-20</td></tr>
<tr><td>Restaurar instantaneamente e permanentemente um sentido (órgão intacto)</td><td>-40</td></tr>
<tr><td>Restaurar fala temporariamente</td><td>-15</td></tr>
<tr><td>Restaurar fala permanentemente</td><td>-30</td></tr>
<tr><td>Regenerar olhos ou estruturas sensoriais destruídas</td><td>-25</td></tr>

<tr><td rowspan="13"><strong>Doenças</strong></td><td>Doença trivial</td><td>-1</td></tr>
<tr><td>Doença leve</td><td>-3</td></tr>
<tr><td>Doença moderada</td><td>-5</td></tr>
<tr><td>Doença grave</td><td>-8</td></tr>
<tr><td>Doença crônica</td><td>-12</td></tr>
<tr><td>Doença degenerativa</td><td>-16</td></tr>
<tr><td>Doença incurável</td><td>-20</td></tr>
<tr><td>Doença incurável por meios mágicos comuns</td><td>-25</td></tr>
<tr><td>Doença terminal</td><td>-30</td></tr>
<tr><td>Doença terminal avançada</td><td>-40</td></tr>
<tr><td>Doença sobrenatural</td><td>-50</td></tr>
<tr><td>Doença sobrenatural terminal</td><td>-60</td></tr>
<tr><td>Doença que afeta corpo e essência</td><td>-75</td></tr>

<tr><td rowspan="14"><strong>Atribulações</strong></td><td>Atordoamento</td><td>-3</td></tr>
<tr><td>Condição irritante: Embriagado</td><td>-5</td></tr>
<tr><td>Condição irritante: Bêbado, Dor Moderada, Tosse</td><td>-6</td></tr>
<tr><td>Condição irritante: Euforia, Nauseado</td><td>-7</td></tr>
<tr><td>Condição irritante: Dor Severa</td><td>-8</td></tr>
<tr><td>Condição irritante: Dor Terrível</td><td>-9</td></tr>
<tr><td>Condição incapacitante: Alucinação, Ansia, Torpor, Vômito</td><td>-10</td></tr>
<tr><td>Condição incapacitante: Agonia, Epilepsia, Asfixia, Extase</td><td>-12</td></tr>
<tr><td>Condição incapacitante: Paralisia, Sono</td><td>-14</td></tr>
<tr><td>Condição potencialmente fatal: Ataque Cardíaco, Coma</td><td>-20</td></tr>
<tr><td>Condição sobrenatural permanente: remover maldição</td><td>-30</td></tr>
<tr><td>Petrificação ou efeito similar</td><td>-40</td></tr>
<tr><td>Transformação corporal reversível</td><td>-25</td></tr>
<tr><td>Transformação corporal permanente</td><td>-40</td></tr>

<tr><td rowspan="12"><strong>Mente</strong></td><td>Confusão</td><td>-2</td></tr>
<tr><td>Medo ou pânico</td><td>-3</td></tr>
<tr><td>Perturbação mental temporária</td><td>-5</td></tr>
<tr><td>Trauma psicológico leve (remover peculiaridade)</td><td>-5</td></tr>
<tr><td>Trauma psicológico moderado (remover desvantagem de até 10 pontos)</td><td>-10</td></tr>
<tr><td>Trauma psicológico grave (remover desvantagem acima de 10 pontos)</td><td>-20</td></tr>
<tr><td>Loucura temporária</td><td>-10</td></tr>
<tr><td>Loucura permanente</td><td>-25</td></tr>
<tr><td>Restaurar personalidade profundamente alterada (múltiplas desvantagens)</td><td>-30</td></tr>
<tr><td>Restaurar memórias perdidas</td><td>-30</td></tr>
<tr><td>Restaurar identidade ou mente severamente danificada</td><td>-40</td></tr>
<tr><td>Reconstruir mente destruída</td><td>-50</td></tr>

<tr><td rowspan="7"><strong>Veneno e Toxinas</strong></td><td>Veneno leve</td><td>-2</td></tr>
<tr><td>Veneno moderado</td><td>-5</td></tr>
<tr><td>Veneno potente</td><td>-10</td></tr>
<tr><td>Veneno letal</td><td>-15</td></tr>
<tr><td>Toxina extremamente complexa</td><td>-20</td></tr>
<tr><td>Veneno sobrenatural ou mágico</td><td>-30</td></tr>
<tr><td>Veneno que altera permanentemente o corpo</td><td>-40</td></tr>

<tr><td rowspan="5"><strong>Morte Iminente</strong></td><td>Estabilizar ferimento fatal (menos que -5×PV, com falha em Teste de Morte)</td><td>-5</td></tr>
<tr><td>Impedir morte iminente (-5×PV): alvo ganha PV suficiente para sair do risco de morte, no máximo 5 PV</td><td>-10</td></tr>
<tr><td>Ressuscitação: reviver vítima de ataque cardíaco, asfixia ou afogamento</td><td>-15</td></tr>
<tr><td>Restaurar corpo após destruição extensa</td><td>-40</td></tr>
<tr><td>Restaurar corpo quase totalmente destruído</td><td>-60</td></tr>

<tr><td rowspan="5"><strong>Ressurreição Imperfeita</strong></td><td>Morte recente (últimos 10 minutos). O alvo perde 25 XP.</td><td><strong>-50</strong></td></tr>
<tr><td>Morte prolongada (últimas 24 horas). O alvo perde 25 XP.</td><td><strong>-60</strong></td></tr>
<tr><td>Corpo deteriorado (dias ou semanas, dependendo da decomposição). O alvo perde 25 XP.</td><td><strong>-75</strong></td></tr>
<tr><td>Corpo parcialmente destruído (meses ou anos, dependendo da decomposição). O alvo perde 25 XP.</td><td><strong>-90</strong></td></tr>
<tr><td>Sem corpo adequado. O alvo perde 25 XP.</td><td><strong>-120</strong></td></tr>

<tr><td rowspan="7"><strong>Ressurreição Perfeita</strong></td><td>Morte recente (últimos 10 minutos)</td><td><strong>-300</strong></td></tr>
<tr><td>Morte prolongada (últimas 24 horas)</td><td><strong>-325</strong></td></tr>
<tr><td>Morte há dias ou semanas, dependendo da decomposição</td><td><strong>-350</strong></td></tr>
<tr><td>Morte há meses ou anos, dependendo da decomposição</td><td><strong>-400</strong></td></tr>
<tr><td>Corpo severamente destruído (menos que -10×PV)</td><td><strong>-450</strong></td></tr>
<tr><td>Corpo completamente destruído</td><td><strong>-500</strong></td></tr>
<tr><td>Corpo e essência dispersos</td><td><strong>-600+</strong></td></tr>

</tbody>
</table>

!!! note "Observações"
    - **Cura definitiva:** Problemas de saúde crônicos incluindo Doenças terminais, Deficiencias físicas ou mentais adquiridas na criação do personagem somente poderão ser "curadas" por magia se os pontos das respectivas desvantagens forem recomprados pelo jogador antes de concluir o ritual.
    - **Efeitos combinados:** quando uma magia produz efeitos independentes, suas penalidades são somadas. Por exemplo, recuperar 20 PV e regenerar um membro perdido em 1 hora resulta em uma penalidade de -50.
    - **Doenças:** quando uma doença possuir mais de uma característica, utiliza-se a categoria mais alta aplicável; as penalidades não são somadas. Assim, uma doença sobrenatural terminal utiliza -60, e não -50 + -30.
    - **Ressurreição Imperfeita:** devolve o alvo à vida, mas a restauração da essência é incompleta. O personagem perde permanentemente **25 XP**.
    - **Ressurreição Perfeita:** restaura integralmente o corpo e a essência, sem perda de XP. Sua dificuldade excepcional representa a enorme quantidade de energia necessária.
    - **Componentes e demais modificadores:** aplicam-se normalmente às penalidades resultantes da tabela.
    - Valores muito elevados, especialmente **-300 ou mais**, representam efeitos extraordinários que podem exigir recursos, preparação e circunstâncias excepcionais.

---

## Dano

O dano causado por uma magia é determinado pelo modificador aplicado ao efeito. Quanto maior a penalidade assumida para aumentar o poder da magia, maior será o dano produzido.


<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="width: 15%;">Mod.</th>
      <th style="width: 35%;">Dano</th>
      <th style="width: 15%;">Mod.</th>
      <th style="width: 35%;">Dano</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>0</strong></td>
      <td>2 pontos</td>
      <td><strong>–6</strong></td>
      <td>6d6</td>
    </tr>
    <tr>
      <td><strong>–1</strong></td>
      <td>1d6</td>
      <td><strong>–7</strong></td>
      <td>7d6</td>
    </tr>
    <tr>
      <td><strong>–2</strong></td>
      <td>2d6</td>
      <td><strong>–8</strong></td>
      <td>8d6</td>
    </tr>
    <tr>
      <td><strong>–3</strong></td>
      <td>3d6</td>
      <td><strong>–9</strong></td>
      <td>9d6</td>
    </tr>
    <tr>
      <td><strong>–4</strong></td>
      <td>4d6</td>
      <td><strong>–10</strong></td>
      <td>10d6</td>
    </tr>
    <tr>
      <td><strong>–5</strong></td>
      <td>5d6</td>
      <td><strong>–(1)</strong></td>
      <td>+1d6</td>
    </tr>
  </tbody>
</table>


!!! note "Observações sobre o dano"
    * <b>Dano perfurante:</b> sofre <b>–1</b> para cada dado de dano. Modificador de dano dobrado.
    * <b>Dano contusivo:</b> recebe <b>+1</b> para cada dado de dano.
    * <b>Dano elétrico:</b> sofre <b>–1</b> para cada dado de dano. Armaduras metálicas fornecem <b>RD 1</b> contra esse dano. Também pode causar <b>Atordoamento</b>.
    * <b>Dano de fogo:</b> pode causar <b>ignição</b>, fazendo com que materiais inflamáveis peguem fogo.
    * <b>Dano direto:</b> requer um <b>teste de resistência</b>, mas <b>ignora a RD</b> do alvo. A magia deve possuir um <b>alcance definido</b>.
    * <b>Dano indireto:</b> requer um <b>teste para acertar</b>, utilizando <b>Ataque Inato</b>. Nesse caso, a <b>RD do alvo é considerada</b> na avaliação do dano.


---

## Duração

A duração determina por quanto tempo os efeitos da magia permanecem ativos. Quanto maior o período desejado, maior a penalidade aplicada ao teste de magia. A **Duração Momentânea** não impõe penalidade, enquanto efeitos que permanecem por períodos mais longos podem alcançar modificadores bastante elevados.

<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="width: 15%;">Modificador</th>
      <th style="width: 35%;">Duração</th>
      <th style="width: 15%;">Modificador</th>
      <th style="width: 35%;">Duração</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center;">0</td>
      <td>Momentânea</td>
      <td style="text-align: center;">−9</td>
      <td>Até 6 horas</td>
    </tr>
    <tr>
      <td style="text-align: center;">−1</td>
      <td>Até 10 segundos</td>
      <td style="text-align: center;">−10</td>
      <td>Até 12 horas</td>
    </tr>
    <tr>
      <td style="text-align: center;">−2</td>
      <td>Até 30 segundos</td>
      <td style="text-align: center;">−11</td>
      <td>Até 1 dia</td>
    </tr>
    <tr>
      <td style="text-align: center;">−3</td>
      <td>Até 1 minuto</td>
      <td style="text-align: center;">−12</td>
      <td>Até 3 dias</td>
    </tr>
    <tr>
      <td style="text-align: center;">−4</td>
      <td>Até 3 minutos</td>
      <td style="text-align: center;">−13</td>
      <td>Até 1 semana</td>
    </tr>
    <tr>
      <td style="text-align: center;">−5</td>
      <td>Até 6 minutos</td>
      <td style="text-align: center;">−14</td>
      <td>Até 2 semanas</td>
    </tr>
    <tr>
      <td style="text-align: center;">−6</td>
      <td>Até 12 minutos</td>
      <td style="text-align: center;">−15</td>
      <td>Até 1 mês</td>
    </tr>
    <tr>
      <td style="text-align: center;">−7</td>
      <td>Até 1 hora</td>
      <td style="text-align: center;">−16</td>
      <td>Até 3 meses</td>
    </tr>
    <tr>
      <td style="text-align: center;">−8</td>
      <td>Até 3 horas</td>
      <td style="text-align: center;">−17</td>
      <td>Até 6 meses</td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td style="text-align: center;">−18</td>
      <td>Até 1 ano</td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td style="text-align: center;"><strong>−20</strong></td>
      <td><strong>Permanente*</strong></td>
    </tr>
  </tbody>
</table>


!!! note "Duração Permanente"
    *Permanente* representa uma situação especial e não pode ser obtida por uma conjuração comum. Nem todos os efeitos podem ser permanentes (a ultima palavra é do GM). 
    
    Para produzir um efeito permanente, a magia deve ser realizada **por meio de um Ritual**, o conjurador deve possuir nível 5 (**NH 25 ou superior**) no domínio correspondente. O modificador de **−20** é aplicado normalmente ao teste de magia. Dependendo do tipo de efeito a ser produzido o GM poderá exigir outras condições para o ritual como por exemplo o uso de componentes **finos** ou **lendários**.

---

## Invocação Direta

Este modificador é utilizado para **invocar ou conjurar criaturas**. O poder da criatura é comparado ao **total de pontos atual do conjurador**, e não ao total inicial da campanha.

A porcentagem indica quantos pontos a criatura possui em relação ao conjurador. Quanto mais poderosa for a criatura em comparação ao conjurador, maior será a penalidade aplicada ao teste de invocação.

Uma criatura de **1 ponto** constitui uma exceção: ela representa um **pet básico**, de utilidade mínima, e não recebe penalidade. 

!!! info "Pet básico"
    Um animal de estimação pequeno e comum — gato, furão, hamster, papagaio etc. Isso equivale a um Aliado modesto, compensado por ser também um Dependente modesto, mas não é necessário calcular os pontos.

O modificador máximo é **-20**. Criaturas com mais de 300% dos pontos do conjurador não podem ser invocadas diretamente por esta regra. Caso sejam utilizadas no sistema, entidades desse nível podem ser tratadas por meio da mecânica de **Patronos**.

<table>
<thead>
<tr>
<th>Pontos da criatura</th>
<th>Relação com os pontos do conjurador</th>
<th>Modificador</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1 XP ou 5%</strong></td>
<td>Pet básico</td>
<td><strong>0</strong></td>
</tr>
<tr>
<td>Até <strong>25%</strong></td>
<td>Muito inferior</td>
<td><strong>-2</strong></td>
</tr>
<tr>
<td><strong>26–50%</strong></td>
<td>Inferior</td>
<td><strong>-4</strong></td>
</tr>
<tr>
<td><strong>51–75%</strong></td>
<td>Moderado</td>
<td><strong>-6</strong></td>
</tr>
<tr>
<td><strong>76–100%</strong></td>
<td>Equivalente</td>
<td><strong>-8</strong></td>
</tr>
<tr>
<td><strong>101–125%</strong></td>
<td>Superior</td>
<td><strong>-10</strong></td>
</tr>
<tr>
<td><strong>126–150%</strong></td>
<td>Muito superior</td>
<td><strong>-12</strong></td>
</tr>
<tr>
<td><strong>151–175%</strong></td>
<td>Extremamente superior</td>
<td><strong>-14</strong></td>
</tr>
<tr>
<td><strong>176–200%</strong></td>
<td>Poderoso</td>
<td><strong>-16</strong></td>
</tr>
<tr>
<td><strong>201–250%</strong></td>
<td>Muito poderoso</td>
<td><strong>-18</strong></td>
</tr>
<tr>
<td><strong>251–300%</strong></td>
<td>Excepcional</td>
<td><strong>-20</strong></td>
</tr>
</tbody>
</table>

> **Exemplo:** um conjurador com 200 pontos que tente invocar uma criatura de 150 pontos estará tentando conjurar uma criatura equivalente a 75% de seus próprios pontos. A invocação recebe, portanto, um modificador de **-6**.

O total de pontos utilizado para determinar a porcentagem deve ser o **total de pontos atual do conjurador**, permitindo que a capacidade de invocação acompanhe a evolução do personagem ao longo da campanha.

---

## Massa/Volume do alvo

A Escala de Massa e Volume determina a quantidade de matéria que uma magia pode afetar, criar, transformar ou manipular. Massa e volume utilizam a mesma escala de referência; entretanto, isso não significa que massa e volume sejam fisicamente equivalentes. A massa indicada corresponde a uma referência de massa, enquanto o volume indicado corresponde a uma referência volumétrica.

<table>
<thead>
<tr>
<th>Mod</th>
<th>Massa de referência</th>
<th>Volume de referência</th>
</tr>
</thead>
<tbody>
<tr><td>0</td><td>1 kg</td><td>1 L</td></tr>
<tr><td>−1</td><td>2 kg</td><td>2 L</td></tr>
<tr><td>−2</td><td>3 kg</td><td>3 L</td></tr>
<tr><td>−3</td><td>5 kg</td><td>5 L</td></tr>
<tr><td>−4</td><td>7 kg</td><td>7 L</td></tr>
<tr><td>−5</td><td>10 kg</td><td>10 L</td></tr>
<tr><td>−6</td><td>20 kg</td><td>20 L</td></tr>
<tr><td>−7</td><td>30 kg</td><td>30 L</td></tr>
<tr><td>−8</td><td>50 kg</td><td>50 L</td></tr>
<tr><td>−9</td><td>70 kg</td><td>70 L</td></tr>
<tr><td>−10</td><td>100 kg</td><td>100 L</td></tr>
<tr><td>−11</td><td>200 kg</td><td>200 L</td></tr>
<tr><td>−12</td><td>300 kg</td><td>300 L</td></tr>
<tr><td>−13</td><td>500 kg</td><td>500 L</td></tr>
<tr><td>−14</td><td>700 kg</td><td>700 L</td></tr>
<tr><td>−15</td><td>1.000 kg</td><td>1.000 L</td></tr>
<tr><td>−16</td><td>2.000 kg</td><td>2.000 L</td></tr>
<tr><td>−17</td><td>3.000 kg</td><td>3.000 L</td></tr>
<tr><td>−18</td><td>5.000 kg</td><td>5.000 L</td></tr>
<tr><td>−19</td><td>7.000 kg</td><td>7.000 L</td></tr>
<tr><td>−20</td><td>10.000 kg</td><td>10.000 L</td></tr>
</tbody>
</table>

**Progressão:** a sequência segue o padrão 1, 2, 3, 5, 7, 10, repetido em ordens de grandeza sucessivas. Assim, a cada 5 pontos de penalidade, a capacidade aumenta aproximadamente dez vezes. A progressão pode ser estendida além de −20 seguindo o mesmo padrão, embora a tabela de jogo seja limitada a −20.

### Tabela de Referências de Volume

A tabela abaixo serve apenas como referência intuitiva de escala. As dimensões apresentadas para piscinas, reservatórios e lagos são aproximações utilizadas para ajudar a visualizar o volume, não definições formais dessas categorias.

<table>
<thead>
<tr>
<th>Referência aproximada</th>
<th>Volume</th>
<th>Exemplo de dimensões</th>
</tr>
</thead>
<tbody>
<tr><td>Garrafa grande</td><td>2 L</td><td>—</td></tr>
<tr><td>Balde</td><td>10 L</td><td>—</td></tr>
<tr><td>Banheira pequena</td><td>100 L</td><td>—</td></tr>
<tr><td>Barril</td><td>200 L</td><td>—</td></tr>
<tr><td>Caixa-d'água pequena</td><td>500 L</td><td>—</td></tr>
<tr><td>Caixa-d'água grande</td><td>1.000 L</td><td>—</td></tr>
<tr><td>Pequena piscina</td><td>5.000 L</td><td>5 × 2,5 × 0,4 m</td></tr>
<tr><td>Piscina</td><td>10.000 L</td><td>5 × 4 × 0,5 m</td></tr>
<tr><td>Grande piscina</td><td>50.000 L</td><td>10 × 5 × 1 m</td></tr>
<tr><td>Reservatório pequeno</td><td>100.000 L</td><td>10 × 10 × 1 m</td></tr>
<tr><td>Reservatório grande</td><td>1.000.000 L</td><td>20 × 20 × 2,5 m</td></tr>
<tr><td>Lagoa pequena</td><td>10.000.000 L</td><td>100 × 50 × 2 m</td></tr>
<tr><td>Lago menor</td><td>100.000.000 L</td><td>250 × 200 × 2 m</td></tr>
<tr><td>Lago grande</td><td>1.000.000.000 L</td><td>500 × 500 × 4 m</td></tr>
</tbody>
</table>

---

## Metamorfose



---

## Modificadores de ataque



---

## Tamanho

Esta tabela é utilizada exclusivamente para feitiços cujo efeito precisa abranger a criatura ou o objeto como um todo. Ela não se aplica a feitiços direcionados a uma parte específica do alvo, nem substitui as regras de Área de Efeito. O mesmo princípio pode ser aplicado a objetos quando o efeito precisa abranger o objeto inteiro.

Por exemplo, uma magia de Controle Mental ou Transformação afeta a criatura inteira. Portanto, é mais difícil lançar esse tipo de feitiço sobre um gigante de 10 metros de altura do que sobre um humano de 1,80 m. Já uma magia destinada apenas a atingir a mão, a cabeça ou outra parte específica da criatura considera somente a dimensão dessa parte.

Para criaturas, determine a dimensão com base na maior dimensão do alvo, utilizando seu Modificador de Tamanho (MT). Consulte a tabela para encontrar o modificador correspondente à dimensão necessária para abranger a criatura inteira. O modificador resultante é aplicado às penalidades do feitiço.

<table>
  <thead>
    <tr>
      <th>Mod</th>
      <th>MT</th>
      <th>Dimensão</th>
      <th>Mod</th>
      <th>MT</th>
      <th>Dimensão</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0 ou menos</td>
      <td>2 m</td>
      <td>-22</td>
      <td>+11</td>
      <td>150 m</td>
    </tr>
    <tr>
      <td>-2</td>
      <td>+1</td>
      <td>3 m</td>
      <td>-24</td>
      <td>+12</td>
      <td>200 m</td>
    </tr>
    <tr>
      <td>-4</td>
      <td>+2</td>
      <td>5 m</td>
      <td>-26</td>
      <td>+13</td>
      <td>300 m</td>
    </tr>
    <tr>
      <td>-6</td>
      <td>+3</td>
      <td>7 m</td>
      <td>-28</td>
      <td>+14</td>
      <td>500 m</td>
    </tr>
    <tr>
      <td>-8</td>
      <td>+4</td>
      <td>10 m</td>
      <td>-30</td>
      <td>+15</td>
      <td>700 m</td>
    </tr>
    <tr>
      <td>-10</td>
      <td>+5</td>
      <td>15 m</td>
      <td>-32</td>
      <td>+16</td>
      <td>1 km</td>
    </tr>
    <tr>
      <td>-12</td>
      <td>+6</td>
      <td>20 m</td>
      <td>-34</td>
      <td>+17</td>
      <td>1,5 km</td>
    </tr>
    <tr>
      <td>-14</td>
      <td>+7</td>
      <td>30 m</td>
      <td>-36</td>
      <td>+18</td>
      <td>2 km</td>
    </tr>
    <tr>
      <td>-16</td>
      <td>+8</td>
      <td>50 m</td>
      <td>-38</td>
      <td>+19</td>
      <td>3 km</td>
    </tr>
    <tr>
      <td>-18</td>
      <td>+9</td>
      <td>70 m</td>
      <td>-40</td>
      <td>+20</td>
      <td>5 km</td>
    </tr>
    <tr>
      <td>-20</td>
      <td>+10</td>
      <td>100 m</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

---

## Velocidade

A velocidade define a rapidez com que um efeito mágico pode deslocar uma criatura, objeto ou força. É utilizada principalmente em feitiços de **voo, telecinese, deslocamento mágico e outros efeitos cujo resultado dependa de velocidade de movimento**.

A escala foi calibrada para manter valores relevantes para um cenário de fantasia. Os primeiros níveis abrangem velocidades humanas e animais, enquanto os níveis mais elevados representam velocidades progressivamente mais extraordinárias. Como referência, o tradicional feitiço **Voo do Falcão**, de GURPS, possui velocidade de aproximadamente **40 m/s**, valor adotado aqui como referência para o modificador **-10**.

O limite de **-20** corresponde aproximadamente à velocidade do som na atmosfera terrestre, arredondada para **350 m/s (1.260 km/h)**. Isso estabelece um teto prático para velocidades obtidas por feitiços comuns. Velocidades superiores a esse limite, caso existam, devem ser tratadas como efeitos excepcionais e não fazem parte da progressão normal da tabela.

<table>
<thead>
<tr>
<th>Mod.</th>
<th>Velocidade</th>
<th>km/h</th>
<th>Referência aproximada</th>
</tr>
</thead>
<tbody>
<tr><td>0</td><td>1 m/s</td><td>3,6</td><td>Caminhada</td></tr>
<tr><td>-1</td><td>2 m/s</td><td>7,2</td><td>Caminhada rápida</td></tr>
<tr><td>-2</td><td>3 m/s</td><td>10,8</td><td>Corrida leve</td></tr>
<tr><td>-3</td><td>5 m/s</td><td>18</td><td>Corrida</td></tr>
<tr><td>-4</td><td>7 m/s</td><td>25,2</td><td>Corrida rápida</td></tr>
<tr><td>-5</td><td>10 m/s</td><td>36</td><td>Sprint</td></tr>
<tr><td>-6</td><td>15 m/s</td><td>54</td><td>Voo rápido</td></tr>
<tr><td>-7</td><td>20 m/s</td><td>72</td><td>Voo muito rápido</td></tr>
<tr><td>-8</td><td>25 m/s</td><td>90</td><td>Voo excepcional</td></tr>
<tr><td>-9</td><td>30 m/s</td><td>108</td><td>Voo extremo</td></tr>
<tr><td><strong>-10</strong></td><td><strong>40 m/s</strong></td><td><strong>144</strong></td><td><strong>Referência: Voo do Falcão</strong></td></tr>
<tr><td>-11</td><td>50 m/s</td><td>180</td><td>Velocidade aérea excepcional</td></tr>
<tr><td>-12</td><td>70 m/s</td><td>252</td><td>Extremamente rápido</td></tr>
<tr><td>-13</td><td>100 m/s</td><td>360</td><td>Velocidade mágica extrema</td></tr>
<tr><td>-14</td><td>140 m/s</td><td>504</td><td>Velocidade lendária</td></tr>
<tr><td>-15</td><td>180 m/s</td><td>648</td><td>Extremamente lendário</td></tr>
<tr><td>-16</td><td>220 m/s</td><td>792</td><td>Próximo da barreira do som</td></tr>
<tr><td>-17</td><td>250 m/s</td><td>900</td><td>Quase supersônico</td></tr>
<tr><td>-18</td><td>280 m/s</td><td>1.008</td><td>Quase supersônico</td></tr>
<tr><td>-19</td><td>315 m/s</td><td>1.134</td><td>Próximo da velocidade do som</td></tr>
<tr><td><strong>-20</strong></td><td><strong>350 m/s</strong></td><td><strong>1.260</strong></td><td><strong>Aproximadamente a velocidade do som</strong></td></tr>
</tbody>
</table>

---

## Critérios de Aplicação: Tamanho, Massa/Volume e Área de Efeito

Os parâmetros **Modificador de Tamanho**, **Massa/Volume** e **Área de Efeito** medem aspectos diferentes da escala de uma magia e não devem ser confundidos. Ao construir um feitiço, determine primeiro **o que está sendo dimensionado pelo efeito mágico** e aplique apenas o parâmetro correspondente.

### Modificador de Tamanho

Utilize o **Modificador de Tamanho** quando a magia tiver como alvo uma **criatura ou objeto individual** e o efeito precisar abranger esse alvo como um todo.

O modificador representa a dificuldade adicional de afetar integralmente um alvo maior. Para determinar o modificador, considere a **maior dimensão física do alvo**.

Exemplos:

* transformar uma pessoa inteira;
* controlar mentalmente uma criatura;
* teleportar uma criatura inteira;
* transformar um gigante inteiro;
* proteger um objeto individual;
* tornar uma criatura invisível por completo.

Nesses casos, **não se calcula separadamente a massa ou o volume do alvo**. O tamanho do alvo já representa a escala necessária para que o efeito o abranja integralmente.

Assim, uma magia que transforma um humano de 1,80 m e um gigante de 10 m utiliza o mesmo parâmetro, mas recebe modificadores diferentes conforme o **Modificador de Tamanho** de cada alvo.

### Massa/Volume

Utilize **Massa/Volume** quando a magia manipular, criar, destruir, transformar ou afetar uma **quantidade determinada de matéria**, sem que essa quantidade seja definida simplesmente pelo tamanho de um único alvo.

Esse parâmetro responde à pergunta:

> **Quanto de matéria está envolvida no efeito?**

Exemplos:

* criar 1.000 litros de água;
* transformar 500 kg de pedra em metal;
* destruir uma quantidade de madeira;
* mover uma grande quantidade de areia;
* transformar uma quantidade de alimento;
* manipular uma quantidade determinada de sangue.

A escolha entre massa e volume depende da natureza do efeito. Utilize **massa** quando a quantidade de matéria for mais relevante em termos de peso ou massa física; utilize **volume** quando a extensão material ocupar um determinado espaço ou quando a quantidade for naturalmente expressa em unidades de volume.

Quando o alvo for uma criatura ou objeto individual e o efeito simplesmente precisar abranger o alvo inteiro, **não utilize Massa/Volume além do Modificador de Tamanho**. Isso evitaria cobrar duas vezes pela mesma escala.

### Área de Efeito

Utilize **Área de Efeito** quando a magia definir uma **região do espaço** na qual o efeito se aplica, em vez de dimensionar uma criatura, objeto ou quantidade específica de matéria.

Esse parâmetro responde à pergunta:

> **Qual extensão do espaço está sujeita ao efeito?**

Exemplos:

* criar uma zona de silêncio;
* estabelecer uma área de proteção;
* afetar todas as criaturas dentro de uma região;
* criar uma região onde determinada condição mágica se aplica;
* dissipar magia em uma área;
* produzir um efeito que se aplica indistintamente a tudo dentro de uma região.

A Área de Efeito mede a **extensão da região afetada**, não o tamanho das criaturas ou objetos que estejam dentro dela. Portanto, não se aplica automaticamente o Modificador de Tamanho de cada criatura ou objeto presente na área.

### Critério de escolha

Ao construir um feitiço, faça as seguintes perguntas, nesta ordem:

1. **O efeito precisa abranger integralmente uma criatura ou objeto individual?**
   → Utilize **Modificador de Tamanho**, considerando a maior dimensão do alvo.

2. **O efeito manipula uma quantidade determinada de matéria?**
   → Utilize **Massa/Volume**.

3. **O efeito estabelece uma região do espaço na qual suas consequências ocorrem?**
   → Utilize **Área de Efeito**.

4. **O feitiço possui mais de uma dessas características de maneira independente?**
   → Utilize cada parâmetro correspondente.

Os parâmetros só devem ser combinados quando representam **exigências diferentes do efeito**, e não quando dois parâmetros estiverem simplesmente descrevendo a mesma escala física.

### Regra prática

> **Tamanho mede o alvo. Massa/Volume mede a matéria. Área de Efeito mede a região.**

Essa distinção deve ser feita durante a **construção do feitiço**, antes de calcular as demais penalidades. O parâmetro escolhido deve representar diretamente aquilo que determina a escala do efeito, evitando que a mesma característica seja penalizada duas vezes.