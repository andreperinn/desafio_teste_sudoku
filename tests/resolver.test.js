const SudokuBinario = require('../src/SudokuBinario');
const {
  SOLUCAO,
  PUZZLE,
  PUZZLE_SEM_SOLUCAO,
  casasVazias,
  respeitaRegras,
} = require('./helpers/grades');

describe('Resolver automaticamente', () => {
  test('CT49 - deve encontrar a solução única do puzzle', () => {
    const jogo = new SudokuBinario(PUZZLE);

    expect(jogo.resolver()).toEqual(SOLUCAO);
  });

  test('CT50 - para a grade vazia, deve retornar uma grade completa que respeita todas as regras', () => {
    const jogo = new SudokuBinario();
    const solucao = jogo.resolver();

    expect(respeitaRegras(solucao)).toBe(true);
  });

  test('CT51 - deve retornar null quando o puzzle não tem solução', () => {
    const jogo = new SudokuBinario(PUZZLE_SEM_SOLUCAO);

    expect(jogo.resolver()).toBeNull();
  });

  test('CT52 - resolver não deve alterar a partida', () => {
    const jogo = new SudokuBinario(PUZZLE);
    jogo.jogar(2, 2, 0);
    const antes = jogo.obterGrade();

    const solucao = jogo.resolver();
    solucao[0][0] = 0;

    expect(jogo.obterGrade()).toEqual(antes);
    expect(jogo.obterValor(0, 0)).toBeNull();
    expect(jogo.obterEstado()).toBe('jogando');
  });

  test('CT53 - resolver deve considerar só as casas fixas e ignorar as jogadas do jogador', () => {
    const jogo = new SudokuBinario(PUZZLE);
    jogo.jogar(2, 0, 1); // na solução, essa casa é 0

    expect(jogo.resolver()).toEqual(SOLUCAO);
  });

  test('CT54 - jogar os valores retornados pelo resolver deve resolver o puzzle', () => {
    const jogo = new SudokuBinario(PUZZLE);
    const solucao = jogo.resolver();

    casasVazias(PUZZLE).forEach(([l, c]) => jogo.jogar(l, c, solucao[l][c]));

    expect(jogo.obterEstado()).toBe('resolvido');
  });
});
