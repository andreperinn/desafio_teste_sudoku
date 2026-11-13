const SudokuBinario = require('../src/SudokuBinario');
const { PUZZLE } = require('./helpers/grades');

describe('Jogadas', () => {
  let jogo;

  beforeEach(() => {
    jogo = new SudokuBinario(PUZZLE);
  });

  test('CT13 - deve colocar 0 ou 1 em uma casa vazia', () => {
    jogo.jogar(2, 2, 0);
    jogo.jogar(0, 0, 1);

    expect(jogo.obterValor(2, 2)).toBe(0);
    expect(jogo.obterValor(0, 0)).toBe(1);
    expect(jogo.obterGrade()[2][2]).toBe(0);
    expect(jogo.obterGrade()[0][0]).toBe(1);
  });

  test('CT14 - jogar de novo na mesma casa deve substituir o valor', () => {
    jogo.jogar(2, 2, 0);
    jogo.jogar(2, 2, 1);

    expect(jogo.obterValor(2, 2)).toBe(1);
  });

  test('CT15 - uma casa preenchida pelo jogador não deve virar fixa', () => {
    jogo.jogar(2, 2, 0);

    expect(jogo.ehFixa(2, 2)).toBe(false);
  });

  test('CT16 - jogar em uma casa fixa deve lançar erro e não alterar o valor', () => {
    expect(() => jogo.jogar(0, 3, 0)).toThrow();
    expect(jogo.obterValor(0, 3)).toBe(1);
  });

  test.each([[2], [-1], ['0'], ['1'], [null], [undefined], [true], [0.5]])(
    'CT17 - jogar um valor diferente de 0 ou 1 deve lançar erro: %p',
    (valorInvalido) => {
      expect(() => jogo.jogar(2, 2, valorInvalido)).toThrow();
      expect(jogo.obterValor(2, 2)).toBeNull();
    }
  );

  test('CT18 - limpar uma casa preenchida pelo jogador deve deixá-la vazia', () => {
    jogo.jogar(2, 2, 1);
    jogo.limpar(2, 2);

    expect(jogo.obterValor(2, 2)).toBeNull();
  });

  test('CT19 - limpar uma casa que já está vazia não deve mudar nada nem lançar erro', () => {
    expect(() => jogo.limpar(2, 2)).not.toThrow();
    expect(jogo.obterGrade()).toEqual(PUZZLE);
  });

  test('CT20 - limpar uma casa fixa deve lançar erro e manter o valor', () => {
    expect(() => jogo.limpar(0, 3)).toThrow();
    expect(jogo.obterValor(0, 3)).toBe(1);
  });

  test('CT21 - uma jogada que quebra uma regra deve ser aceita e a grade deve ficar inválida', () => {
    const livre = new SudokuBinario();

    livre.jogar(0, 0, 1);
    livre.jogar(0, 1, 1);
    expect(() => livre.jogar(0, 2, 1)).not.toThrow();

    expect(livre.obterValor(0, 2)).toBe(1);
    expect(livre.possuiTresIguaisSeguidos()).toBe(true);
    expect(livre.estaValida()).toBe(false);

    livre.limpar(0, 2);

    expect(livre.possuiTresIguaisSeguidos()).toBe(false);
    expect(livre.estaValida()).toBe(true);
  });
});

describe('Validação de coordenadas', () => {
  const COORDENADAS_INVALIDAS = [
    [-1, 0],
    [0, -1],
    [6, 0],
    [0, 6],
    [1.5, 0],
    [0, 2.5],
    ['1', 0],
    [undefined, undefined],
  ];

  test.each(['obterValor', 'ehFixa', 'jogar', 'limpar'])(
    'CT22 - %s deve lançar erro para coordenadas fora do tabuleiro ou inválidas',
    (metodo) => {
      const jogo = new SudokuBinario(PUZZLE);

      COORDENADAS_INVALIDAS.forEach(([l, c]) => {
        expect(() => jogo[metodo](l, c, 0)).toThrow();
      });
    }
  );

  test('CT23 - uma jogada com coordenada inválida não deve alterar a grade', () => {
    const jogo = new SudokuBinario(PUZZLE);

    expect(() => jogo.jogar(6, 0, 1)).toThrow();
    expect(() => jogo.limpar(0, 6)).toThrow();

    expect(jogo.obterGrade()).toEqual(PUZZLE);
  });

  test('CT24 - as quatro casas dos cantos devem ser aceitas como coordenadas válidas', () => {
    const jogo = new SudokuBinario(PUZZLE);

    expect(() => jogo.jogar(0, 0, 1)).not.toThrow();
    expect(() => jogo.jogar(0, 5, 0)).not.toThrow();
    expect(() => jogo.jogar(5, 0, 0)).not.toThrow();
    expect(() => jogo.jogar(5, 5, 1)).not.toThrow();
    expect(jogo.obterValor(5, 5)).toBe(1);
  });
});
