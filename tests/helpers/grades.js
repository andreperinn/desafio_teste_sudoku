// Grades prontas e funções auxiliares usadas pelos casos de teste.
// "_" representa uma casa vazia (null).

const _ = null;
const TAMANHO = 6;

// Grade completa que respeita todas as regras.
const SOLUCAO = [
  [1, 0, 1, 1, 0, 0],
  [1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 1],
  [0, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1],
];

// Puzzle com 9 casas fixas e uma única solução: SOLUCAO.
const PUZZLE = [
  [_, _, _, 1, _, _],
  [1, _, _, _, 1, _],
  [_, _, _, _, _, _],
  [_, _, 1, 1, _, 1],
  [_, 0, _, _, _, 0],
  [_, _, _, 1, _, _],
];

// Puzzle que não quebra nenhuma regra no início, mas não tem solução.
const PUZZLE_SEM_SOLUCAO = [
  [0, _, _, _, _, _],
  [_, 1, _, _, _, 1],
  [_, 1, _, 1, _, _],
  [_, _, _, _, 1, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, 1],
];

/** Cria uma grade 6 x 6 só com casas vazias. */
function gradeVazia() {
  return Array.from({ length: TAMANHO }, () => Array(TAMANHO).fill(null));
}

/** Copia uma grade (cada linha é um novo array). */
function copiar(grade) {
  return grade.map((linha) => linha.slice());
}

/** Inverte todos os 0 e 1 de uma grade (a inversão de uma grade válida também é válida). */
function inverter(grade) {
  return grade.map((linha) => linha.map((v) => (v === null ? null : 1 - v)));
}

/** Lista as coordenadas [linha, coluna] das casas vazias de uma grade. */
function casasVazias(grade) {
  const lista = [];
  grade.forEach((linha, l) => {
    linha.forEach((valor, c) => {
      if (valor === null) lista.push([l, c]);
    });
  });
  return lista;
}

/**
 * Preenche, no jogo, todas as casas que estavam vazias na grade inicial
 * com os valores da grade de respostas.
 */
function preencher(jogo, gradeInicial, respostas) {
  casasVazias(gradeInicial).forEach(([l, c]) => {
    jogo.jogar(l, c, respostas[l][c]);
  });
}

/**
 * Confere, de forma independente do jogo, se uma grade completa respeita
 * todas as regras do Sudoku binário 6 x 6.
 */
function respeitaRegras(grade) {
  if (!Array.isArray(grade) || grade.length !== TAMANHO) return false;
  if (!grade.every((linha) => Array.isArray(linha) && linha.length === TAMANHO)) return false;
  if (!grade.every((linha) => linha.every((v) => v === 0 || v === 1))) return false;

  const colunas = grade[0].map((_valor, c) => grade.map((linha) => linha[c]));

  for (const linha of [...grade, ...colunas]) {
    if (linha.filter((v) => v === 0).length !== 3) return false;
    for (let i = 0; i + 2 < TAMANHO; i++) {
      if (linha[i] === linha[i + 1] && linha[i] === linha[i + 2]) return false;
    }
  }

  if (new Set(grade.map((l) => l.join(''))).size !== TAMANHO) return false;
  if (new Set(colunas.map((c) => c.join(''))).size !== TAMANHO) return false;

  return true;
}

module.exports = {
  _,
  TAMANHO,
  SOLUCAO,
  PUZZLE,
  PUZZLE_SEM_SOLUCAO,
  gradeVazia,
  copiar,
  inverter,
  casasVazias,
  preencher,
  respeitaRegras,
};
