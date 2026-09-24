# Plan de modificaciones — Sistema de Gameplay

## Objetivo

Refactorizar el sistema de generación de ejercicios para que:

- No genere ejercicios redundantes como `ありがとう → escribe ありがとう`.
- Separe correctamente **tipo de contenido**, **tipo de conocimiento evaluado** y **modo de dificultad**.
- Permita los modos **Aprendiz** y **Maestro**.
- Mantenga `1× XP` en Aprendiz y `1.5× XP` en Maestro.
- Prepare la arquitectura para una futura adaptación automática basada en maestría.
- Mantenga la lógica lingüística fuera de `GamePage.jsx`.

---

# 1. Mantener `item_type` como tipo de contenido

Mantener:

```text
item_type
├── kana
├── kanji
└── vocabulary
```

`item_type` describe **qué es el contenido**, no cómo se pregunta.

Ejemplo:

```js
{
  item_type: "vocabulary",
  target_question_type: "reading",
  difficultyMode: "master"
}
```

Significa:

> Es una palabra de vocabulario → se evalúa su lectura → se presenta en modo Maestro.

---

# 2. Crear una capa central de generación de ejercicios

Archivo:

```text
src/utils/gameplayLogic.js
```

Crear estas funciones:

```js
detectItemScript(japanese)
resolveQuestionInstruction(item, mode)
generateDistractors(currentWord, allWords, count = 3)
createExercise(item, allWords, mode)
validateExercise(exercise, item)
calculateAwardXp(baseXp, difficultyMode)
normalizeAcceptedAnswers(item)
```

La función principal será:

```js
createExercise(item, allWords, mode)
```

Debe devolver un ejercicio completo.

Ejemplo:

```js
{
  id: "123",

  questionType: "meaning",

  instruction: "¿Qué significa 「ありがとう」?",

  expectedAnswers: [
    "gracias"
  ],

  presentation: "multiple_choice",

  options: [
    "Gracias",
    "Hola",
    "Adiós",
    "Por favor"
  ],

  xpMultiplier: 1
}
```

Para Maestro:

```js
{
  id: "123",

  questionType: "romaji",

  instruction: "Escribe la lectura en romaji",

  expectedAnswers: [
    "arigatou"
  ],

  presentation: "open_input",

  options: null,

  xpMultiplier: 1.5
}
```

La idea es que `GamePage.jsx` solamente renderice el ejercicio recibido.

---

# 3. `target_question_type` debe representar el conocimiento evaluado

Valores recomendados:

```text
reading
meaning
romaji
kunyomi
onyomi
```

No utilizar:

```text
apprentice
master
multiple_choice
open_input
```

porque esos valores describen la **presentación/dificultad**, no el conocimiento.

Ejemplo:

```json
{
  "item_type": "kanji",
  "target_question_type": "kunyomi"
}
```

---

# 4. Regla crítica: nunca pedir información que ya está mostrada

Esta debe ser una regla obligatoria del generador.

## Incorrecto

```text
ありがとう

Escribe en japonés:
[ __________ ]
```

La respuesta puede copiarse directamente del estímulo.

## Correcto

```text
ありがとう

Escribe la lectura en romaji:
[ __________ ]
```

Respuesta:

```text
arigatou
```

O:

```text
¿Qué significa 「ありがとう」?

[ Gracias ]
[ Hola ]
[ Adiós ]
[ Por favor ]
```

---

# 5. Crear `validateExercise()`

La función:

```js
validateExercise(exercise, item)
```

debe impedir ejercicios redundantes.

Debe normalizar los valores antes de comparar.

Ejemplo:

```text
prompt = "ありがとう"
answer = "ありがとう"
```

Resultado:

```text
INVALIDO
```

Mientras:

```text
prompt = "ありがとう"
answer = "arigatou"
```

Resultado:

```text
VÁLIDO
```

También debe detectar variantes equivalentes cuando corresponda.

La validación debe ejecutarse antes de presentar el ejercicio al usuario.

Si el ejercicio es inválido, `createExercise()` debe generar otra combinación válida en lugar de mostrarlo.

---

# 6. Lógica para `kana`

Hay que tener cuidado con los datos actuales porque existen elementos como:

```text
か
から
```

dentro de `item_type: "kana"`.

Por eso no asumir que `kana` significa exclusivamente "un único carácter kana".

La lógica debe considerar también:

- contenido japonés
- script detectado
- `part_of_speech`
- información disponible en `accepted_answers`

## Ejemplo: `か`

### Aprendiz

```text
¿Qué sonido representa 「か」?

[ Ka ]
[ Sa ]
[ Ta ]
[ Na ]
```

### Maestro

```text
Escribe el sonido en romaji:

[ __________ ]
```

Respuesta:

```text
ka
```

---

# 7. Lógica para vocabulary

Ejemplo:

```text
ありがとう
```

## Aprendiz

```text
¿Qué significa 「ありがとう」?

[ Gracias ]
[ Hola ]
[ Adiós ]
[ Por favor ]
```

## Maestro

```text
Escribe la lectura en romaji:

[ __________ ]
```

Respuesta:

```text
arigatou
```

También puede evaluarse significado:

```text
¿Qué significa 「ありがとう」?

[ __________ ]
```

Pero nunca:

```text
Escribe en japonés:

[ ありがとう ]
```

cuando `ありがとう` ya está mostrado.

---

# 8. Vocabulary con kanji

Ejemplo:

```text
小さい
```

Datos:

```text
hiragana: ちいさい
romaji: chiisai
translation: pequeño / pequeña
```

## Aprendiz

Opción de significado:

```text
¿Qué significa 「小さい」?

[ Pequeño ]
[ Grande ]
[ Rápido ]
[ Nuevo ]
```

O lectura:

```text
¿Cómo se lee 「小さい」?

[ ちいさい ]
[ おおきい ]
[ はやい ]
[ あたらしい ]
```

## Maestro

```text
Escribe la lectura:

[ __________ ]
```

Respuesta:

```text
ちいさい,
chiisai
```

O:

```text
Escribe la traducción:

[ __________ ]
```

Respuesta:

```text
pequeño
```

---

# 9. Tratamiento especial para Kanji

No aceptar automáticamente todas las lecturas de un kanji.

Ejemplo:

```text
水
```

Puede tener:

```text
Kunyomi → みず → mizu
Onyomi → すい → sui
```

Por eso el tipo de pregunta determina qué respuestas son válidas.

## `target_question_type = kunyomi`

```text
Escribe la lectura KUNYOMI de 「水」:

[ __________ ]
```

Aceptar:

```text
mizu
みず
```

No aceptar:

```text
sui
すい
```

como respuesta correcta.

## `target_question_type = onyomi`

```text
Escribe la lectura ONYOMI de 「水」:

[ __________ ]
```

Aceptar:

```text
sui
すい
```

## `target_question_type = reading`

Si la pregunta es deliberadamente genérica:

```text
Escribe una lectura de 「水」:

[ __________ ]
```

pueden aceptarse las lecturas válidas correspondientes.

El feedback debe explicar las lecturas disponibles cuando sea útil.

Ejemplo:

```text
✓ Correcto

「水」 tiene varias lecturas:

Kunyomi: みず (mizu)
Onyomi: すい (sui)
```

---

# 10. Normalizar `accepted_answers`

Actualmente existen diferentes formatos.

Ejemplo:

```json
["kara"]
```

También:

```json
{
  "recognize": ["ちいさい", "chiisai"],
  "translate": ["pequeño", "pequeña"]
}
```

Y:

```json
{
  "reading": ["おと", "おん", "ね", "oto", "on", "ne"],
  "meaning": ["sonido", "ruido"]
}
```

Crear:

```js
normalizeAcceptedAnswers(item)
```

para convertir los formatos actuales a una estructura interna consistente.

Formato interno recomendado:

```json
{
  "reading": [],
  "romaji": [],
  "kunyomi": [],
  "onyomi": [],
  "meaning": []
}
```

La migración de la base de datos no tiene que hacerse de golpe.

Primero se puede normalizar en `gameplayLogic.js` y posteriormente migrar los datos si resulta conveniente.

---

# 11. Modo Aprendiz

Mantener:

```text
🟢 Aprendiz
```

Características:

- Multiple choice.
- 4 opciones.
- 1 respuesta correcta.
- 3 distractores.
- `1× XP`.
- Enfoque de reconocimiento.
- Pensado para principiantes y aprendizaje guiado.

Ejemplo:

```text
┌──────────────┐  ┌──────────────┐
│   Gracias    │  │     Hola     │
└──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│    Adiós     │  │   Por favor  │
└──────────────┘  └──────────────┘
```

---

# 12. `MultipleChoiceGrid.jsx`

Archivo:

```text
src/components/gameplay/MultipleChoiceGrid.jsx
```

Implementar:

- Grid responsive 2×2.
- Botones táctiles.
- `min-height: 52px`.
- Animación al seleccionar.
- Estado correcto/incorrecto.
- Feedback visual.
- Soporte de teclado:
  - `1` → opción 1
  - `2` → opción 2
  - `3` → opción 3
  - `4` → opción 4
- Accesibilidad mediante teclado y lectores de pantalla.
- No duplicar lógica lingüística aquí.

El componente debe recibir algo similar a:

```js
{
  options,
  correctAnswer,
  onAnswer
}
```

o una estructura equivalente.

---

# 13. Modo Maestro

Mantener:

```text
⚡ Maestro (+50% XP)
```

Características:

- Input abierto.
- WanaKana cuando corresponda.
- No mostrar directamente la respuesta.
- Validación contra `expectedAnswers`.
- `1.5× XP`.
- Feedback educativo.

Ejemplo:

```text
ありがとう

Escribe la lectura en romaji:

┌─────────────────────────┐
│                         │
└─────────────────────────┘

        [ Comprobar ]
```

Crear, si no existe, un componente:

```text
src/components/gameplay/OpenAnswerInput.jsx
```

---

# 14. Maestro no significa simplemente "escribir"

`difficultyMode` describe **cómo se evalúa**, no qué conocimiento se evalúa.

Por ejemplo, el mismo `questionType` puede presentarse de dos formas.

## Aprendiz

```text
¿Cómo se lee 水?

[ mizu ]
[ yama ]
[ hi ]
[ ki ]
```

## Maestro

```text
Escribe la lectura:

[ __________ ]
```

Por lo tanto:

```text
questionType
    ↓
qué conocimiento evaluamos

difficultyMode
    ↓
cómo lo evaluamos
```

---

# 15. Distractores inteligentes

No utilizar simplemente:

```js
randomWords.slice(0, 3)
```

Los distractores deben ser relevantes.

Priorizar:

1. Mismo `item_type`.
2. Mismo nivel.
3. Dificultad similar.
4. Mismo `questionType`.
5. Respuesta diferente.
6. Evitar duplicados.
7. Evitar distractores absurdos o claramente ajenos.

Ejemplo:

```text
ありがとう → Gracias
```

Buenos distractores:

```text
Hola
Adiós
Por favor
```

No:

```text
Martillo
Elefante
Estación espacial
```

---

# 16. `generateDistractors()`

Implementar:

```js
generateDistractors(currentWord, allWords, count = 3)
```

La función debe:

- excluir el elemento actual;
- excluir la respuesta correcta;
- evitar respuestas duplicadas;
- priorizar elementos semánticamente/lingüísticamente cercanos;
- devolver exactamente `count` cuando existan suficientes candidatos;
- tener fallback seguro si la base de datos no tiene suficientes candidatos.

---

# 17. Refactorizar `GamePage.jsx`

Archivo:

```text
src/pages/Game/GamePage.jsx
```

Debe administrar principalmente:

```js
const [difficultyMode, setDifficultyMode] = useState(
  localStorage.getItem("difficultyMode") || "apprentice"
);
```

Toggle:

```text
🟢 Aprendiz | ⚡ Maestro (+50% XP)
```

Guardar automáticamente:

```js
localStorage.setItem(
  "difficultyMode",
  difficultyMode
);
```

Después:

```js
const exercise = createExercise(
  currentWord,
  allWords,
  difficultyMode
);
```

Renderizar según:

```js
exercise.presentation
```

Por ejemplo:

```js
if (exercise.presentation === "multiple_choice") {
  // MultipleChoiceGrid
}

if (exercise.presentation === "open_input") {
  // OpenAnswerInput
}
```

`GamePage.jsx` no debe contener reglas como:

```js
if (item.item_type === "kanji") ...
```

La lógica lingüística debe permanecer en:

```text
gameplayLogic.js
```

---

# 18. XP

Mantener:

```text
Aprendiz = 1×
Maestro = 1.5×
```

Ejemplo:

```text
Base XP = 10

Aprendiz → 10 XP
Maestro  → 15 XP
```

Implementar:

```js
calculateAwardXp(baseXp, difficultyMode)
```

Ejemplo conceptual:

```js
function calculateAwardXp(baseXp, difficultyMode) {
  return difficultyMode === "master"
    ? Math.round(baseXp * 1.5)
    : baseXp;
}
```

---

# 19. El frontend no debe tener autoridad sobre el XP final

React puede enviar:

```json
{
  "word_id": "...",
  "difficulty_mode": "master"
}
```

Pero el RPC/backend debe calcular el XP final.

No confiar en:

```js
xp = 999999;
```

enviado por el cliente.

El servidor debe:

1. Obtener el `experience_reward` real de `words`.
2. Validar `difficulty_mode`.
3. Aplicar el multiplicador correspondiente.
4. Registrar el resultado.

---

# 20. `progress` debe manejar la maestría del usuario

No usar:

```text
words.difficulty
```

para saber si el usuario domina una palabra.

`words.difficulty` describe el contenido:

```text
beginner
intermediate
advanced
```

`progress` debe manejar la evolución individual.

Campos recomendados:

```text
mastery
correct_streak
incorrect_streak
review_count
last_reviewed_at
next_review_at
```

Opcionalmente:

```text
ease_factor
```

---

# 21. Preparar adaptación futura

Aunque actualmente el usuario seleccionará manualmente:

```text
Aprendiz / Maestro
```

la arquitectura debe permitir reemplazar posteriormente la selección manual.

Ahora:

```text
Usuario
   ↓
Toggle
   ↓
difficultyMode
   ↓
createExercise()
```

Futuro:

```text
Usuario
   ↓
progress.mastery
   ↓
selectModeFromMastery()
   ↓
difficultyMode
   ↓
createExercise()
```

No implementar todavía la adaptación automática salvo que sea necesaria.

Simplemente evitar que `createExercise()` dependa directamente del estado de React.

---

# 22. Ejemplos de aceptación

## `ありがとう`

### Aprendiz

```text
¿Qué significa 「ありがとう」?

[ Gracias ]
[ Hola ]
[ Adiós ]
[ Por favor ]
```

### Maestro

```text
Escribe la lectura en romaji:

[ __________ ]
```

Esperado:

```text
arigatou
```

Nunca:

```text
Escribe ありがとう
```

---

# 23. Ejemplo `水`

### Aprendiz

```text
¿Qué significa 「水」?

[ Agua ]
[ Fuego ]
[ Árbol ]
[ Tierra ]
```

### Maestro — Kunyomi

```text
Escribe la lectura KUNYOMI:

[ __________ ]
```

Esperado:

```text
mizu
```

### Maestro — Onyomi

```text
Escribe la lectura ONYOMI:

[ __________ ]
```

Esperado:

```text
sui
```

---

# 24. Ejemplo `小さい`

### Aprendiz

```text
¿Cómo se lee 「小さい」?

[ ちいさい ]
[ おおきい ]
[ はやい ]
[ あたらしい ]
```

### Maestro

```text
Escribe la lectura:

[ __________ ]
```

Esperado:

```text
ちいさい,
chiisai
```

---

# 25. Arquitectura final

```text
src/
├── utils/
│   └── gameplayLogic.js
│
├── components/
│   └── gameplay/
│       ├── MultipleChoiceGrid.jsx
│       └── OpenAnswerInput.jsx
│
└── pages/
    └── Game/
        └── GamePage.jsx
```

Flujo:

```text
                    words
                      │
                      ▼
              createExercise()
                      │
             ┌────────┴────────┐
             │                 │
       questionType      difficultyMode
             │                 │
      ┌──────┼──────┐     ┌────┴─────┐
      │      │      │     │          │
   reading meaning ...  apprentice  master
                            │          │
                            ▼          ▼
                           MC      Open Input
```

---

# 26. Criterios de aceptación finales

La implementación se considera correcta cuando:

- [ ] `ありがとう` nunca genera una pregunta donde la respuesta sea simplemente `ありがとう`.
- [ ] `createExercise()` devuelve una estructura completa y consistente.
- [ ] `questionType` y `difficultyMode` están separados.
- [ ] Aprendiz usa 4 opciones.
- [ ] Maestro usa input abierto.
- [ ] Maestro otorga 1.5× XP.
- [ ] Aprendiz otorga 1× XP.
- [ ] Los distractores no son aleatorios sin contexto.
- [ ] `水` distingue correctamente kunyomi y onyomi.
- [ ] `mizu` no se acepta como respuesta correcta cuando se pregunta específicamente onyomi.
- [ ] `sui` no se acepta como respuesta correcta cuando se pregunta específicamente kunyomi.
- [ ] Las variantes hiragana/romaji válidas se normalizan correctamente.
- [ ] `accepted_answers` puede seguir utilizando los formatos actuales mediante normalización.
- [ ] `GamePage.jsx` no contiene la lógica lingüística principal.
- [ ] El XP final es validado/calculado en el backend/RPC.
- [ ] El modo seleccionado se guarda en `localStorage`.
- [ ] La arquitectura permite implementar adaptación por `progress.mastery` posteriormente.
- [ ] El layout de opciones funciona correctamente en móvil.
- [ ] Las opciones tienen al menos `52px` de altura.
- [x] Las teclas `1–4` funcionan en Multiple Choice.
- [x] Los ejercicios inválidos son rechazados antes de mostrarse al usuario.

---

# 27. Modo de juego: Traducir (Aprendiz y Maestro)

## Objetivo

Ampliar la lógica pedagógica para el modo de juego **Traducir** (`translate`), manteniendo simetría arquitectónica con **Reconocer** (`recognize`):

| Modo | Dirección | Modo Aprendiz | Modo Maestro |
|---|---|---|---|
| **Reconocer** | JP → ES / Lectura | Prompt japonés, 4 opciones en español/romaji | Prompt japonés, input abierto para lectura/romaji |
| **Traducir** | ES → JP | Prompt en español, 4 opciones en **japonés** | Prompt en español, **input abierto** para japonés (kana/kanji/romaji) |

## Especificación por Tipo de Contenido en "Traducir"

### 1. Vocabulario (`item_type: 'vocabulary'`)

Ejemplo: `japanese: "ありがとう"`, `translation: "gracias"`, `romaji: "arigatou"`

- **Prompt**: `"gracias"`
- **Categoría**: `Traducción • Vocabulario`
- **Modo Aprendiz**:
  - Consigna: `¿Cómo se dice 「gracias」 en japonés?`
  - 4 opciones en japonés: `[ ありがとう (correcta) ]`, `[ 行く ]`, `[ 見る ]`, `[ 食べる ]`
- **Modo Maestro**:
  - Consigna: `Escribe la palabra en japonés o romaji`
  - Input abierto: usuario escribe `arigatou`, `arigato` o `ありがとう`
  - Respuestas aceptadas: `item.japanese`, `item.hiragana`, `item.romaji`, variantes romaji y lectura.

### 2. Kanji (`item_type: 'kanji'`)

Ejemplo: `japanese: "水"`, `translation: "agua"`, `kunyomi: ["みず"]`, `onyomi: ["スイ"]`

- **Prompt**: `"agua"`
- **Categoría**: `Traducción • Kanji`
- **Modo Aprendiz**:
  - Consigna: `¿Cuál es el kanji para 「agua」?`
  - 4 opciones en kanji: `[ 水 (correcta) ]`, `[ 火 ]`, `[ 木 ]`, `[ 金 ]`
- **Modo Maestro**:
  - Consigna: `Escribe el kanji o su lectura (kana/romaji)`
  - Input abierto: acepta `水`, `みず`, `mizu`, `スイ`, `sui`

### 3. Kana Silabario (`item_type: 'kana'`)

Ejemplo: `japanese: "あ"`, `romaji: "a"`, `translation: null`

- **Prompt**: `Sonido "a"`
- **Categoría**: `Traducción • Kana`
- **Modo Aprendiz**:
  - Consigna: `¿Qué carácter corresponde a 「Sonido "a"」?`
  - 4 opciones en kana: `[ あ (correcta) ]`, `[ い ]`, `[ う ]`, `[ え ]`
- **Modo Maestro**:
  - Consigna: `Escribe el kana o romaji para 「Sonido "a"」`
  - Input abierto: acepta `あ`, `a`

## Validación de Respuestas Abiertas (Wanakana Cross-Matching)

En modo Maestro, la función `isAnswerCorrect(userInput, exercise)` compara el texto del usuario:
1. Normalizado (minúsculas, sin tildes, trim).
2. Como Hiragana vía `toHiragana(userInput)` (ej. `arigatou` → `ありがとう`).
3. Como Romaji vía `toRomaji(userInput)` (ej. `ありがとう` → `arigatou`).

Esto garantiza compatibilidad total tanto para teclados en español/inglés (escribiendo en romaji) como para teclados con IME japonés activado.

