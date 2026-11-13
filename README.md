# Desafio de Teste — Sudoku Binário

Casos de teste automatizados, escritos em **JavaScript** com **Jest**, para testar um jogo de **Sudoku binário** de tamanho **6 x 6** também escrito em JavaScript.

Este repositório contém **somente os casos de teste**. O código do jogo não faz parte da entrega: ele deve ser implementado a partir da especificação abaixo e passar em todos os testes.

---

## 1. Especificação do desafio

### Tabuleiro

| Item | Valor |
| --- | --- |
| Tamanho | 6 x 6 (36 casas) |
| Linhas e colunas | índices de `0` a `5` |
| Valores possíveis | `0` ou `1` |
| Casa vazia | `null` |

As coordenadas são sempre informadas como `(linha, coluna)`, começando em `0`.

### Regras do Sudoku binário

Para o puzzle estar resolvido, todas as casas devem estar preenchidas com `0` ou `1` respeitando as três regras:

1. **No máximo dois números iguais seguidos:** não pode haver três `0` ou três `1` seguidos na mesma linha ou na mesma coluna (`000` e `111` são proibidos).
2. **Quantidade igual de 0 e 1:** cada linha e cada coluna deve ter três `0` e três `1`. Durante a partida, uma linha ou coluna com mais de três `0` ou mais de três `1` já quebra essa regra.
3. **Sem linhas iguais e sem colunas iguais:** duas linhas completas não podem ser iguais, e duas colunas completas não podem ser iguais. Só são comparadas linhas e colunas **completas**, e uma linha nunca é comparada com uma coluna.

### Funcionamento da partida

1. **Criação:** a partida pode começar sem grade (todas as casas vazias) ou com uma grade inicial 6 x 6 contendo `0`, `1` ou `null`. As casas preenchidas na grade inicial são **fixas**. A grade inicial é copiada: alterar o array original depois não altera o jogo. O construtor lança erro se a grade tiver formato inválido, valor diferente de `0`, `1` ou `null`, ou se já quebrar alguma das três regras.
2. **Jogar:** coloca `0` ou `1` em uma casa que não é fixa, substituindo o valor que estiver nela. Qualquer outro valor (inclusive `null`, `'1'` e `true`) lança erro. Jogar em casa fixa lança erro. Uma jogada que quebra uma regra é **aceita**: a grade apenas passa a ficar inválida.
3. **Limpar:** deixa vazia (`null`) uma casa que não é fixa. Limpar uma casa vazia não faz nada. Limpar uma casa fixa lança erro.
4. **Vitória:** o estado passa a ser `'resolvido'` quando a grade está completa e respeita as três regras. Vale qualquer grade completa válida, não só uma resposta guardada. Uma grade inicial já completa e válida começa resolvida.
5. **Depois de resolvido:** `jogar` e `limpar` lançam erro e a grade não muda mais.
6. **Reiniciar:** apaga todas as jogadas, mantendo as casas fixas, e o estado volta a ser `'jogando'` (a não ser que a grade inicial já esteja completa e válida, caso da regra 4).
7. **Resolver automaticamente:** calcula uma solução usando **somente as casas fixas** (as jogadas do jogador são ignoradas). Retorna uma nova grade 6 x 6 completa, ou `null` se o puzzle não tiver solução. Não altera a partida.
8. **Coordenadas inválidas:** fora do tabuleiro, não inteiras ou não numéricas lançam erro em todos os métodos que recebem coordenadas, sem alterar a partida.

### Interface esperada

O jogo deve ficar no arquivo `src/SudokuBinario.js`, exportando a classe com `module.exports = SudokuBinario;`.

| Membro | Tipo | Descrição |
| --- | --- | --- |
| `new SudokuBinario()` | construtor | Cria a partida com todas as casas vazias e nenhuma fixa. |
| `new SudokuBinario(grade)` | construtor | Cria a partida a partir de uma matriz 6 x 6 com `0`, `1` ou `null`. Lança erro nos casos da regra de criação. |
| `tamanho` | propriedade | `6` |
| `obterGrade()` | método | Retorna uma **nova** matriz 6 x 6 com o estado atual (`0`, `1` ou `null`). |
| `obterValor(linha, coluna)` | método | Valor da casa: `0`, `1` ou `null`. |
| `ehFixa(linha, coluna)` | método | `true` se a casa veio preenchida na grade inicial. |
| `jogar(linha, coluna, valor)` | método | Coloca `0` ou `1` na casa. |
| `limpar(linha, coluna)` | método | Deixa a casa vazia. |
| `reiniciar()` | método | Volta para a grade inicial. |
| `estaCompleta()` | método | `true` se nenhuma casa está vazia. |
| `possuiTresIguaisSeguidos()` | método | `true` se alguma linha ou coluna tem três números iguais seguidos (regra 1). |
| `possuiExcessoDeDigitos()` | método | `true` se alguma linha ou coluna tem mais de três `0` ou mais de três `1` (regra 2). |
| `possuiLinhasOuColunasRepetidas()` | método | `true` se existem duas linhas completas iguais ou duas colunas completas iguais (regra 3). |
| `estaValida()` | método | `true` se a grade atual não quebra nenhuma das três regras. |
| `obterEstado()` | método | `'jogando'` ou `'resolvido'`. |
| `resolver()` | método | Retorna uma nova matriz com uma solução, ou `null` se não houver solução. |

---

## 2. Funcionamento dos casos de teste

### Como executar

Requisitos: Node.js 18.14 ou superior (recomendado usar uma versão LTS: 20, 22 ou 24).

```bash
npm install
npm test
```

Enquanto `src/SudokuBinario.js` não existir, todos os testes falham com `Cannot find module '../src/SudokuBinario'`. Esse é o comportamento esperado: os testes só passam quando o jogo é implementado.

### Organização

```
tests/
├── helpers/grades.js   # grades prontas e funções auxiliares
├── criacao.test.js     # CT01 a CT12 - criação da partida e validação da grade inicial
├── jogadas.test.js     # CT13 a CT24 - jogar, limpar e coordenadas
├── regras.test.js      # CT25 a CT38 - detecção de cada uma das três regras
├── vitoria.test.js     # CT39 a CT48 - puzzle resolvido e reiniciar
└── resolver.test.js    # CT49 a CT54 - resolver automaticamente
```

### Grades usadas nos testes

As grades ficam em `tests/helpers/grades.js` (`_` representa uma casa vazia):

```
PUZZLE (9 casas fixas)        SOLUCAO (única solução do PUZZLE)
_ _ _ 1 _ _                   1 0 1 1 0 0
1 _ _ _ 1 _                   1 1 0 0 1 0
_ _ _ _ _ _                   0 1 0 0 1 1
_ _ 1 1 _ 1                   0 0 1 1 0 1
_ 0 _ _ _ 0                   1 0 1 0 1 0
_ _ _ 1 _ _                   0 1 0 1 0 1
```

- **`PUZZLE_SEM_SOLUCAO`:** não quebra nenhuma regra no início, mas não pode ser completado.
- **`preencher(jogo, gradeInicial, respostas)`:** joga, em todas as casas vazias da grade inicial, os valores de `respostas`.
- **`inverter(grade)`:** troca todos os `0` por `1` e vice-versa. A inversão de uma grade válida também é válida, o que permite testar que a vitória depende das regras e não de uma resposta guardada.
- **`respeitaRegras(grade)`:** confere as três regras de forma independente do jogo, para validar a grade devolvida por `resolver()`.

Os testes de regras (CT25 a CT38) montam grades com jogadas a partir de um tabuleiro vazio, porque o construtor não aceita grades iniciais que quebram regras.

### Casos de teste

#### Criação da partida — `criacao.test.js`

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT01 | Criar uma partida | `tamanho` = 6 e `obterGrade()` com 6 linhas de 6 colunas |
| CT02 | Criar sem grade inicial | Todas as casas `null` e nenhuma fixa |
| CT03 | Criar com o `PUZZLE` | A grade começa igual ao `PUZZLE` |
| CT04 | Criar com o `PUZZLE` | Casas preenchidas são fixas; casas vazias não |
| CT05 | Alterar a grade usada na criação | O jogo não é alterado |
| CT06 | Alterar a matriz retornada por `obterGrade()` | O jogo não é alterado |
| CT07 | Grade com 5 ou 7 linhas, linha com 5 ou 7 colunas, texto, número ou linha que não é array | Lança erro |
| CT08 | Grade com valor `2`, `-1`, `'1'`, `true` ou `0.5` | Lança erro |
| CT09 | Grade inicial com três `1` seguidos | Lança erro |
| CT10 | Grade inicial com quatro `1` em uma linha ou quatro `0` em uma coluna | Lança erro |
| CT11 | Grade inicial com duas linhas ou duas colunas completas iguais | Lança erro |
| CT12 | Grades iniciais incompletas e válidas (`PUZZLE` e `PUZZLE_SEM_SOLUCAO`) | São aceitas; estado `'jogando'` |

#### Jogadas e coordenadas — `jogadas.test.js`

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT13 | Jogar `0` e `1` em casas vazias | Os valores aparecem em `obterValor` e `obterGrade` |
| CT14 | Jogar de novo na mesma casa | O valor é substituído |
| CT15 | Casa preenchida pelo jogador | Não vira fixa |
| CT16 | Jogar em casa fixa | Lança erro e o valor não muda |
| CT17 | Jogar `2`, `-1`, `'0'`, `'1'`, `null`, `undefined`, `true` ou `0.5` | Lança erro e a casa continua vazia |
| CT18 | Limpar casa preenchida pelo jogador | A casa fica `null` |
| CT19 | Limpar casa vazia | Nada muda e nenhum erro é lançado |
| CT20 | Limpar casa fixa | Lança erro e o valor não muda |
| CT21 | Jogar o terceiro `1` seguido | A jogada é aceita, a grade fica inválida; ao limpar, volta a ser válida |
| CT22 | `obterValor`, `ehFixa`, `jogar` e `limpar` com coordenadas inválidas (`-1`, `6`, `1.5`, `'1'`, `undefined`) | Todos lançam erro |
| CT23 | Jogar e limpar com coordenada inválida | A grade não muda |
| CT24 | Jogar nas 4 casas dos cantos | São aceitas |

#### Regras — `regras.test.js`

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT25 | Três `1` seguidos em uma linha | `possuiTresIguaisSeguidos()` = `true` |
| CT26 | Três `0` seguidos em uma coluna | `possuiTresIguaisSeguidos()` = `true` |
| CT27 | Três iguais nas últimas casas da linha e da coluna | `possuiTresIguaisSeguidos()` = `true` |
| CT28 | Dois iguais seguidos, ou iguais separados por outro número ou por casa vazia | `possuiTresIguaisSeguidos()` = `false` |
| CT29 | Quatro `1` na mesma linha | `possuiExcessoDeDigitos()` = `true` |
| CT30 | Quatro `0` na mesma coluna | `possuiExcessoDeDigitos()` = `true` |
| CT31 | Três números iguais em uma linha (parcial ou completa) | `possuiExcessoDeDigitos()` = `false` |
| CT32 | Duas linhas completas iguais | `possuiLinhasOuColunasRepetidas()` = `true` |
| CT33 | Duas colunas completas iguais | `possuiLinhasOuColunasRepetidas()` = `true` |
| CT34 | Linhas ou colunas iguais, mas incompletas | `possuiLinhasOuColunasRepetidas()` = `false` |
| CT35 | Linha igual a uma coluna (`SOLUCAO`: linha 1 = coluna 0) | `possuiLinhasOuColunasRepetidas()` = `false` |
| CT36 | `SOLUCAO` | Nenhuma violação e `estaValida()` = `true` |
| CT37 | `PUZZLE` | `estaValida()` = `true` |
| CT38 | Grades que quebram cada uma das três regras | `estaValida()` = `false` |

#### Vitória e reiniciar — `vitoria.test.js`

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT39 | Início da partida | Estado `'jogando'` e grade incompleta |
| CT40 | Preencher o `PUZZLE` com a `SOLUCAO` | Estado `'resolvido'` |
| CT41 | Faltando uma casa | Estado continua `'jogando'` |
| CT42 | Grade completa quebrando uma regra; depois, corrigir a casa errada | Primeiro `'jogando'`; depois da correção, `'resolvido'` |
| CT43 | Tabuleiro vazio preenchido com a `SOLUCAO` invertida | Estado `'resolvido'` |
| CT44 | Grade inicial já completa e válida | Começa `'resolvido'` |
| CT45 | Jogar depois de resolvido | Lança erro e a grade não muda |
| CT46 | Limpar depois de resolvido | Lança erro |
| CT47 | Reiniciar | Jogadas apagadas, fixas mantidas, estado `'jogando'` |
| CT48 | Reiniciar depois de resolvido | Estado `'jogando'` e novas jogadas são aceitas |

#### Resolver — `resolver.test.js`

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT49 | Resolver o `PUZZLE` | Retorna a `SOLUCAO` |
| CT50 | Resolver o tabuleiro vazio | Retorna uma grade completa que respeita as três regras |
| CT51 | Resolver o `PUZZLE_SEM_SOLUCAO` | Retorna `null` |
| CT52 | Resolver e alterar a matriz retornada | A partida não é alterada |
| CT53 | Resolver depois de uma jogada errada | Retorna a `SOLUCAO` (jogadas do jogador são ignoradas) |
| CT54 | Jogar os valores retornados por `resolver()` | Estado `'resolvido'` |

---

## 3. Colaboradores

| Colaborador | GitHub |
| --- | --- |
| andreperinn | [@andreperinn](https://github.com/andreperinn) |
