const SudokuBinario = require('../src/SudokuBinario');
const {
  SOLUCAO,
  PUZZLE,
  gradeVazia,
  copiar,
  inverter,
  casasVazias,
  preencher,
} = require('./helpers/grades');

describe('Vitória (puzzle resolvido)', () => {
  let jogo;

  beforeEach(() => {
    jogo = new SudokuBinario(PUZZLE);
  });

  test('CT39 - a partida deve começar com o estado "jogando" e a grade incompleta', () => {
    expect(jogo.obterEstado()).toBe('jogando');
    expect(jogo.estaCompleta()).toBe(false);
  });

  test('CT40 - preencher todas as casas corretamente deve resolver o puzzle', () => {
    preencher(jogo, PUZZLE, SOLUCAO);

    expect(jogo.estaCompleta()).toBe(true);
    expect(jogo.estaValida()).toBe(true);
    expect(jogo.obterEstado()).toBe('resolvido');
    expect(jogo.obterGrade()).toEqual(SOLUCAO);
  });

  test('CT41 - enquanto houver casa vazia a partida deve continuar', () => {
    casasVazias(PUZZLE)
      .filter(([l, c]) => !(l === 2 && c === 2))
      .forEach(([l, c]) => jogo.jogar(l, c, SOLUCAO[l][c]));

    expect(jogo.estaCompleta()).toBe(false);
    expect(jogo.obterEstado()).toBe('jogando');
  });

  test('CT42 - grade completa que quebra uma regra não deve resolver; ao corrigir, deve resolver', () => {
    const respostasComErro = copiar(SOLUCAO);
    respostasComErro[2][0] = 1;

    preencher(jogo, PUZZLE, respostasComErro);

    expect(jogo.estaCompleta()).toBe(true);
    expect(jogo.estaValida()).toBe(false);
    expect(jogo.obterEstado()).toBe('jogando');

    jogo.jogar(2, 0, 0);

    expect(jogo.obterEstado()).toBe('resolvido');
  });

  test('CT43 - qualquer grade completa que respeite as regras deve vencer, não só uma resposta guardada', () => {
    const livre = new SudokuBinario();

    preencher(livre, gradeVazia(), inverter(SOLUCAO));

    expect(livre.obterEstado()).toBe('resolvido');
  });

  test('CT44 - uma grade inicial já completa e válida deve começar resolvida', () => {
    const completa = new SudokuBinario(SOLUCAO);

    expect(completa.estaCompleta()).toBe(true);
    expect(completa.obterEstado()).toBe('resolvido');
  });

  test('CT45 - depois de resolvido, jogar deve lançar erro e a grade não deve mudar', () => {
    preencher(jogo, PUZZLE, SOLUCAO);

    expect(() => jogo.jogar(2, 2, 1)).toThrow();
    expect(jogo.obterValor(2, 2)).toBe(0);
    expect(jogo.obterEstado()).toBe('resolvido');
  });

  test('CT46 - depois de resolvido, limpar deve lançar erro', () => {
    preencher(jogo, PUZZLE, SOLUCAO);

    expect(() => jogo.limpar(2, 2)).toThrow();
    expect(jogo.obterValor(2, 2)).toBe(0);
  });
});

describe('Reiniciar', () => {
  test('CT47 - reiniciar deve apagar as jogadas e manter as casas fixas', () => {
    const jogo = new SudokuBinario(PUZZLE);
    jogo.jogar(2, 2, 0);
    jogo.jogar(0, 0, 1);

    jogo.reiniciar();

    expect(jogo.obterGrade()).toEqual(PUZZLE);
    expect(jogo.ehFixa(0, 3)).toBe(true);
    expect(jogo.ehFixa(2, 2)).toBe(false);
    expect(jogo.obterEstado()).toBe('jogando');
  });

  test('CT48 - reiniciar depois de resolver deve voltar ao estado "jogando" e permitir novas jogadas', () => {
    const jogo = new SudokuBinario(PUZZLE);
    preencher(jogo, PUZZLE, SOLUCAO);

    jogo.reiniciar();

    expect(jogo.obterEstado()).toBe('jogando');
    expect(() => jogo.jogar(2, 2, 1)).not.toThrow();
    expect(jogo.obterValor(2, 2)).toBe(1);
  });
});
