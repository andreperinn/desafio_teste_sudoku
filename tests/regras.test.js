const SudokuBinario = require('../src/SudokuBinario');
const { SOLUCAO, PUZZLE } = require('./helpers/grades');

/** Cria uma partida sem casas fixas e faz as jogadas [linha, coluna, valor] informadas. */
function montar(jogadas) {
  const jogo = new SudokuBinario();
  jogadas.forEach(([l, c, valor]) => jogo.jogar(l, c, valor));
  return jogo;
}

/** Gera as jogadas para preencher uma linha inteira (null = deixar vazia). */
function linha(l, valores) {
  return valores
    .map((valor, c) => [l, c, valor])
    .filter(([, , valor]) => valor !== null);
}

/** Gera as jogadas para preencher uma coluna inteira (null = deixar vazia). */
function coluna(c, valores) {
  return valores
    .map((valor, l) => [l, c, valor])
    .filter(([, , valor]) => valor !== null);
}

describe('Regra 1 - no máximo dois números iguais seguidos', () => {
  test('CT25 - três números iguais seguidos em uma linha devem ser detectados', () => {
    const jogo = montar(linha(2, [1, 1, 1, null, null, null]));

    expect(jogo.possuiTresIguaisSeguidos()).toBe(true);
    expect(jogo.possuiExcessoDeDigitos()).toBe(false);
    expect(jogo.possuiLinhasOuColunasRepetidas()).toBe(false);
  });

  test('CT26 - três números iguais seguidos em uma coluna devem ser detectados', () => {
    const jogo = montar(coluna(4, [null, 0, 0, 0, null, null]));

    expect(jogo.possuiTresIguaisSeguidos()).toBe(true);
    expect(jogo.possuiExcessoDeDigitos()).toBe(false);
  });

  test('CT27 - três números iguais seguidos no fim da linha e no fim da coluna devem ser detectados', () => {
    const fimDaLinha = montar(linha(5, [null, null, null, 0, 0, 0]));
    const fimDaColuna = montar(coluna(0, [null, null, null, 1, 1, 1]));

    expect(fimDaLinha.possuiTresIguaisSeguidos()).toBe(true);
    expect(fimDaColuna.possuiTresIguaisSeguidos()).toBe(true);
  });

  test('CT28 - dois iguais seguidos, ou iguais separados por outro número ou por casa vazia, não devem ser detectados', () => {
    const jogo = montar([
      ...linha(0, [1, 1, 0, 1, 0, 0]),
      ...linha(1, [1, 1, null, 1, null, null]),
    ]);

    expect(jogo.possuiTresIguaisSeguidos()).toBe(false);
    expect(jogo.estaValida()).toBe(true);
  });
});

describe('Regra 2 - quantidade igual de 0 e 1 em cada linha e coluna', () => {
  test('CT29 - quatro números 1 na mesma linha devem ser detectados como excesso', () => {
    const jogo = montar(linha(1, [1, 1, 0, 1, 1, null]));

    expect(jogo.possuiExcessoDeDigitos()).toBe(true);
    expect(jogo.possuiTresIguaisSeguidos()).toBe(false);
  });

  test('CT30 - quatro números 0 na mesma coluna devem ser detectados como excesso', () => {
    const jogo = montar(coluna(3, [0, 0, null, 0, 0, null]));

    expect(jogo.possuiExcessoDeDigitos()).toBe(true);
    expect(jogo.possuiTresIguaisSeguidos()).toBe(false);
  });

  test('CT31 - até três números iguais em uma linha ou coluna não devem ser excesso', () => {
    const parcial = montar(linha(0, [1, 0, 1, 0, 1, null]));
    const completa = new SudokuBinario(SOLUCAO);

    expect(parcial.possuiExcessoDeDigitos()).toBe(false);
    expect(completa.possuiExcessoDeDigitos()).toBe(false);
  });
});

describe('Regra 3 - não pode haver linhas iguais nem colunas iguais', () => {
  test('CT32 - duas linhas completas iguais devem ser detectadas', () => {
    const jogo = montar([
      ...linha(0, [0, 1, 0, 0, 1, 1]),
      ...linha(3, [0, 1, 0, 0, 1, 1]),
    ]);

    expect(jogo.possuiLinhasOuColunasRepetidas()).toBe(true);
    expect(jogo.possuiTresIguaisSeguidos()).toBe(false);
    expect(jogo.possuiExcessoDeDigitos()).toBe(false);
  });

  test('CT33 - duas colunas completas iguais devem ser detectadas', () => {
    const jogo = montar([
      ...coluna(1, [1, 0, 0, 1, 1, 0]),
      ...coluna(4, [1, 0, 0, 1, 1, 0]),
    ]);

    expect(jogo.possuiLinhasOuColunasRepetidas()).toBe(true);
    expect(jogo.possuiTresIguaisSeguidos()).toBe(false);
    expect(jogo.possuiExcessoDeDigitos()).toBe(false);
  });

  test('CT34 - linhas ou colunas iguais que ainda estão incompletas não devem ser detectadas', () => {
    const linhasIncompletas = montar([
      ...linha(0, [0, 1, 0, 0, 1, null]),
      ...linha(3, [0, 1, 0, 0, 1, null]),
    ]);
    const colunasIncompletas = montar([
      ...coluna(1, [1, 0, 0, 1, 1, null]),
      ...coluna(4, [1, 0, 0, 1, 1, null]),
    ]);

    expect(linhasIncompletas.possuiLinhasOuColunasRepetidas()).toBe(false);
    expect(colunasIncompletas.possuiLinhasOuColunasRepetidas()).toBe(false);
  });

  test('CT35 - uma linha igual a uma coluna não deve ser considerada repetição', () => {
    // Na SOLUCAO, a linha 1 é igual à coluna 0: [1, 1, 0, 0, 1, 0].
    const jogo = new SudokuBinario(SOLUCAO);
    const grade = jogo.obterGrade();
    const coluna0 = grade.map((l) => l[0]);

    expect(grade[1]).toEqual(coluna0);
    expect(jogo.possuiLinhasOuColunasRepetidas()).toBe(false);
  });
});

describe('Validação geral da grade', () => {
  test('CT36 - uma grade completa que respeita as regras não deve ter nenhuma violação', () => {
    const jogo = new SudokuBinario(SOLUCAO);

    expect(jogo.possuiTresIguaisSeguidos()).toBe(false);
    expect(jogo.possuiExcessoDeDigitos()).toBe(false);
    expect(jogo.possuiLinhasOuColunasRepetidas()).toBe(false);
    expect(jogo.estaValida()).toBe(true);
  });

  test('CT37 - a grade inicial do puzzle deve ser válida', () => {
    const jogo = new SudokuBinario(PUZZLE);

    expect(jogo.estaValida()).toBe(true);
  });

  test('CT38 - a grade deve ficar inválida quando qualquer uma das três regras for quebrada', () => {
    const tresIguais = montar(linha(2, [1, 1, 1, null, null, null]));
    const excesso = montar(linha(1, [1, 1, 0, 1, 1, null]));
    const repetidas = montar([
      ...linha(0, [0, 1, 0, 0, 1, 1]),
      ...linha(3, [0, 1, 0, 0, 1, 1]),
    ]);

    expect(tresIguais.estaValida()).toBe(false);
    expect(excesso.estaValida()).toBe(false);
    expect(repetidas.estaValida()).toBe(false);
  });
});
