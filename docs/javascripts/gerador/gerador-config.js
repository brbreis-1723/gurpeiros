/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const URL_TABELAS =
    "/regras/magia/modificadores_tabelas.json";

const URL_PROGRESSOES =
    "/regras/magia/progressoes_Regras.json";


const NIVEIS = {
    1: "Percepção",
    2: "Influência",
    3: "Manipulação",
    4: "Transformação",
    5: "Domínio"
};


const DOMINIOS = [
    "Água",
    "Ar",
    "Artefatos",
    "Bestas",
    "Conhecimento",
    "Cura",
    "Destino",
    "Diabolismo",
    "Dimensão",
    "Escuridão",
    "Flora",
    "Fogo",
    "Gravidade",
    "Ilusão",
    "Luz",
    "Magia",
    "Mente",
    "Necromancia",
    "Sangue",
    "Som",
    "Terra"
];


const CATEGORIAS = [
    "Truque",
    "Feitiço",
    "Ritual"
];


const PARAMETROS = [
    "alcance",
    "area_efeito",
    "atribulacao",
    "caracteristicas_alteradas",
    "conceder_bonus",
    "cura",
    "dano",
    "duracao",
    "invocacao",
    "massa_volume",
    "metamorfose",
    "modificadores_ataque",
    "multiplos_alvos",
    "tamanho",
    "tempo_conjuracao",
    "velocidade"
];


const PARAMETROS_MULTIPLOS = [
    "atribulacao",
    "caracteristicas_alteradas",
    "conceder_bonus",
    "cura",
    "dano",
    "modificadores_ataque"
];


const PARAMETROS_OBRIGATORIOS = [
    "alcance",
    "duracao",
    "tempo_conjuracao"
];


const ALIASES_PARAMETROS = {
    area: "area_efeito",
    caracteristicas: "caracteristicas_alteradas",
    volume: "massa_volume"
};


const NOMES_PARAMETROS = {
    alcance: "Alcance",
    area_efeito: "Área de efeito",
    atribulacao: "Atribulação",
    caracteristicas_alteradas: "Características alteradas",
    conceder_bonus: "Conceder Bônus / Redutor",
    cura: "Cura",
    dano: "Dano",
    duracao: "Duração",
    invocacao: "Invocação Direta",
    massa_volume: "Massa / Volume do alvo",
    metamorfose: "Metamorfose",
    modificadores_ataque: "Modificadores de ataque",
    multiplos_alvos: "Múltiplos alvos",
    tamanho: "Tamanho",
    tempo_conjuracao: "Tempo de conjuração",
    velocidade: "Velocidade"
};


const CHAVES_TABELAS = {
    alcance: "Alcance",
    area_efeito: "Área de efeito",
    atribulacao: "Atribulação",
    caracteristicas_alteradas: "Características alteradas",
    conceder_bonus: "Conceder Bônus ou Impor Redutores",
    cura: "Cura",
    dano: "Dano",
    duracao: "Duração",
    invocacao: "Invocação Direta",
    massa_volume: "Massa/Volume do alvo",
    metamorfose: "Metamorfose",
    modificadores_ataque: "Modificadores de ataque",
    multiplos_alvos: "Múltiplos Alvos",
    tamanho: "Tamanho",
    tempo_conjuracao: "Tempo de conjuração",
    velocidade: "Velocidade"
};


const CAMPOS_TOPO = [
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
];