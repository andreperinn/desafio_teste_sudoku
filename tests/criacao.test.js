const SudokuBinario = require('../src/SudokuBinario');
const {
  _,
  PUZZLE,
  PUZZLE_SEM_SOLUCAO,
  gradeVazia,
  copiar,
} = require('./helpers/grades');

describe('Criação da partida', () => {
  test('CT01 - o tabuleiro deve ter tamanho 6 x 6', () => {
    const jogo = new SudokuBinario(PUZZLE);
    const grade = jogo.obterGrade();

    expect(jogo.tamanho).toBe(6);
    expect(grade).toHaveLength(6);
    grade.forEach((linha) => expect(linha).toHaveLength(6));
  });

  test('CT02 - sem grade inicial, todas as casas devem começar vazias e nenhuma deve ser fixa', () => {
    const jogo = new SudokuBinario();

    expect(jogo.obterGrade()).toEqual(gradeVazia());
    for (let l = 0; l < 6; l++) {
      for (let c = 0; c < 6; c++) {
        expect(jogo.obterValor(l, c)).toBeNull();
        expect(jogo.ehFixa(l, c)).toBe(false);
      }
    }
  });

  test('CT03 - com grade inicial, o tabuleiro deve começar com os mesmos valores', () => {
    const jogo = new SudokuBinario(PUZZLE);

    expect(jogo.obterGrade()).toEqual(PUZZLE);
    expect(jogo.obterValor(0, 3)).toBe(1);
    expect(jogo.obterValor(4, 1)).toBe(0);
    expect(jogo.obterValor(2, 2)).toBeNull();
  });

  test('CT04 - as casas preenchidas na grade inicial devem ser fixas e as vazias não', () => {
    const jogo = new SudokuBinario(PUZZLE);

    for (let l = 0; l < 6; l++) {
      for (let c = 0; c < 6; c++) {
        expect(jogo.ehFixa(l, c)).toBe(PUZZLE[l][c] !== null);
      }
    }
  });

  test('CT05 - alterar a grade usada na criação não deve alterar o jogo', () => {
    const grade = copiar(PUZZLE);
    const jogo = new SudokuBinario(grade);

    grade[0][3] = 0;
    grade[2][2] = 1;

    expect(jogo.obterValor(0, 3)).toBe(1);
    expect(jogo.obterValor(2, 2)).toBeNull();
  });

  test('CT06 - alterar a grade retornada por obterGrade não deve alterar o jogo', () => {
    const jogo = new SudokuBinario(PUZZLE);
    const grade = jogo.obterGrade();

    grade[0][3] = 0;
    grade[2][2] = 1;

    expect(jogo.obterValor(0, 3)).toBe(1);
    expect(jogo.obterValor(2, 2)).toBeNull();
  });

  test.each([
    ['5 linhas', gradeVazia().slice(0, 5)],
    ['7 linhas', [...gradeVazia(), Array(6).fill(null)]],
    ['linha com 5 colunas', gradeVazia().map((linha, i) => (i === 2 ? linha.slice(0, 5) : linha))],
    ['linha com 7 colunas', gradeVazia().map((linha, i) => (i === 2 ? [...linha, null] : linha))],
    ['um texto no lugar da grade', 'grade'],
    ['um número no lugar da grade', 6],
    ['uma linha que não é array', gradeVazia().map((linha, i) => (i === 0 ? 'linha' : linha))],
  ])('CT07 - deve lançar erro para grade com formato inválido: %s', (_descricao, grade) => {
    expect(() => new SudokuBinario(grade)).toThrow();
  });

  test.each([[2], [-1], ['1'], [true], [0.5]])(
    'CT08 - deve lançar erro para grade com valor inválido: %p',
    (valorInvalido) => {
      const grade = gradeVazia();
      grade[3][3] = valorInvalido;

      expect(() => new SudokuBinario(grade)).toThrow();
    }
  );

  test('CT09 - deve lançar erro se a grade inicial tiver três números iguais seguidos', () => {
    const grade = gradeVazia();
    grade[2] = [1, 1, 1, _, _, _];

    expect(() => new SudokuBinario(grade)).toThrow();
  });

  test('CT10 - deve lançar erro se a grade inicial tiver mais de três números iguais em uma linha ou coluna', () => {
    const linhaComQuatroUns = gradeVazia();
    linhaComQuatroUns[1] = [1, 1, 0, 1, 1, _];

    const colunaComQuatroZeros = gradeVazia();
    [0, 1, 3, 4].forEach((l) => {
      colunaComQuatroZeros[l][3] = 0;
    });

    expect(() => new SudokuBinario(linhaComQuatroUns)).toThrow();
    expect(() => new SudokuBinario(colunaComQuatroZeros)).toThrow();
  });

  test('CT11 - deve lançar erro se a grade inicial tiver duas linhas ou duas colunas completas iguais', () => {
    const linhasIguais = gradeVazia();
    linhasIguais[0] = [0, 1, 0, 0, 1, 1];
    linhasIguais[3] = [0, 1, 0, 0, 1, 1];

    const colunasIguais = gradeVazia();
    [1, 0, 0, 1, 1, 0].forEach((valor, l) => {
      colunasIguais[l][1] = valor;
      colunasIguais[l][4] = valor;
    });

    expect(() => new SudokuBinario(linhasIguais)).toThrow();
    expect(() => new SudokuBinario(colunasIguais)).toThrow();
  });

  test('CT12 - deve aceitar grades iniciais incompletas que não quebram nenhuma regra', () => {
    expect(() => new SudokuBinario(PUZZLE)).not.toThrow();
    expect(() => new SudokuBinario(PUZZLE_SEM_SOLUCAO)).not.toThrow();
    expect(new SudokuBinario(PUZZLE).obterEstado()).toBe('jogando');
  });
});
