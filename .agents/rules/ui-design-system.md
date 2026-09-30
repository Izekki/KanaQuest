---
trigger: always_on
---

# KanaQuest UI/UX Design System & Estándares de Arquitectura de Producto

Este documento establece las reglas obligatorias de diseño, composición visual, experiencia de usuario, interacción lúdica y arquitectura de componentes para el frontend de KanaQuest.

---

## 1. Filosofía Central: "Less UI, More Product"

1. **El aprendizaje/juego es el PRODUCTO; la UI es solo el soporte**:
   $$\text{CONTENIDO INTERACTIVO} > \text{CONTEXTO} > \text{PROGRESO} > \text{INFORMACIÓN SECUNDARIA}$$
   El usuario interactúa para aprender japonés, no para admirar tarjetas ni dashboards administrativos.
2. **Cero contenedores gigantes innecesarios**:
   Está estrictamente prohibido envolver una pantalla o página entera dentro de una gran card blanca (`section.w-full.bg-white.border.p-8`). El contenido debe respirar directamente sobre el fondo cálido global de KanaQuest (`--color-background: 252 248 244` con su sutil patrón Seigaiha de olas tradicionales).
3. **No todo debe ser una card**:
   Una tarjeta debe existir únicamente si necesita agrupar una entidad interactiva autónoma. Si un elemento puede resolverse como contenido plano, una fila, una lista, un divisor sutil o un bloque tipográfico, **no debe encerrarse en una caja**.
4. **Prueba de los 3 segundos (Claridad de Pantalla)**:
   Al ingresar a cualquier pantalla de KanaQuest, el usuario debe poder responder inmediatamente sin leer bloques densos:
   - ¿Dónde estoy?
   - ¿Qué tengo que hacer?
   - ¿Cuál es el elemento principal?
   - ¿Cómo interactúo?
   - ¿Qué progreso llevo?
   - ¿Qué pasa después?

---

## 2. Lenguaje Visual: Minimalismo Japonés Contemporáneo

1. **Inspiración editorial y papelería japonesa**:
   La personalidad de KanaQuest proviene de proporciones equilibradas, uso intencional del espacio en blanco (*Ma*), tipografía dual de alto contraste y detalles cuidados.
2. **Cero caricaturas decorativas**:
   Evitar el cliché de sobrecargar la pantalla con toriis, cerezos (sakura) flotantes invasivos, kanjis gigantes sin significado o estética anime saturada. La influencia japonesa debe sentirse en la serenidad visual, calidez y orden.
3. **Mascota (Rimuru) como elemento de apoyo**:
   La mascota y avatares son soporte de identidad, empatía y feedback lúdico, nunca otro widget complejo que compita con el ejercicio.

---

## 3. Paleta de Colores, Tokens y Roles Semánticos

Toda interfaz debe utilizar armoniosamente la paleta definida en `src/styles/global.css`:

| Rol Semántico | Token / Hex | Propósito en la Experiencia |
|---|---|---|
| **PRIMARY / ACCENT** | `#6b2832` (Hover: `#581f27`) | Botones primarios de acción, títulos principales, nivel y elementos de máximo foco. |
| **BACKGROUND** | `rgb(252 248 244)` / `#fcf8f4` | Base global cálida con textura Seigaiha en trazo de 0.038 de opacidad. |
| **SURFACE** | `#ffffff` o `#fdfbf7` / `.bg-washi` | Superficies de lectura limpia, cards necesarias con textura sutil Washi. |
| **BORDER / DIVIDER** | `#eaded6`, `#f0e4de`, `#ebdcd3` | Separadores estructurales finos de 1px sin sombras pesadas. |
| **ACCENT ASAGI (Cian)** | `#1e8289` / `#228b92` | Silabario Katakana, botones complementarios táctiles (`btn-game-asagi`). |
| **ACCENT OCRE / ORO** | `#c98a2c` / `#d4993a` | Caracteres Kanji, estrellas de maestría, insignias y logros desbloqueados. |
| **ACCENT ESMERALDA** | `#15803d` / `#166534` | Vocablos dominados, estados correctos y feedback de éxito. |
| **TEXT PRIMARY** | `rgb(45 28 30)` / `#2d1c1e` | Texto principal con alto contraste y máxima legibilidad. |
| **TEXT MUTED** | `#2d1c1e` al 60% / `#6b2832` al 70% | Subtítulos cortos, hints y metadata secundaria. |

---

## 4. Tipografía, Densidad y Regla de Reducción de Copy

1. **Tipografía Dual Oficial**:
   - **Interfaz, métricas y texto occidental**: **Inter** (`font-sans`).
   - **Caracteres japoneses, kanjis y lecturas**: **Noto Serif JP** / **Noto Sans JP** mediante la clase `.font-jp`.
2. **Jerarquía Tipográfica Estricta**:
   - Un único `H1` por página con personalidad y peso (`font-extrabold`).
   - Subheading corto (máximo 1 línea de microcopy).
   - CTA dominante o área de juego directa.
3. **Regla de Reducción Radical de Texto**:
   - Si una frase puede resumirse en 3 a 6 palabras, **debe resumirse**.
   - Prohibido el copy explicativo redundante que describa lo que la interfaz ya muestra por sí misma.
   - *Ejemplo incorrecto*: "Desafíos visuales interactivos, rondas de lectura inmediata y un sistema de gamificación probado con repetición espaciada para que domines el vocabulario..."
   - *Ejemplo KanaQuest*: "Practica. Repite. Domina."

---

## 5. Sistema de Espaciado (8px Grid) y Jerarquía de Acciones (CTA)

1. **Escala de Espaciado Oficial**:
   Todos los márgenes y paddings deben adherirse a múltiplos de 4px / 8px:
   `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `80px`.
2. **El espacio vacío (*Ma*) es intencional**:
   Prohibido rellenar espacios vacíos con tarjetas ficticias, badges o widgets aleatorios para "ocupar espacio".
3. **Jerarquía de Botones**:
   - **Primary**: Fondo vino `#6b2832`, texto blanco, sombra táctil suave (`.btn-game-primary` o `hover:bg-[#581f27] active:scale-98`). Un solo Primary por bloque de acción.
   - **Secondary**: Borde `#eaded6`, fondo blanco o `#fdfbf7`, texto `#6b2832`, hover `#faf4f2`.
   - **Tertiary / Danger**: Enlaces de texto discretos o botones sutiles para acciones destructivas (`text-rose-700 hover:bg-rose-50`), **nunca** un botón rojo prominente al lado del botón Guardar.
   - **Text Link**: `text-xs font-semibold hover:underline underline-offset-2`.

---

## 6. Arquitectura Específica por Modo y Pantalla

### 6.1 Página de Perfil (`/profile` - Espacio Personal)
- **Separación de Identidad y Configuración**: La identidad es protagonista; los formularios de edición se abren mediante un modal bajo demanda.
- **Hero de Identidad**: Avatar de gran escala (96px móvil / 112px desktop) con aro cálido, nombre de usuario grande, título equipado destacado y barra visual de progreso de nivel (`currentLevelXP / 100 XP`).
- **Tira de Progreso Ligera**: Racha, XP y Palabras Dominadas en un bloque continuo sin cards pesadas redundantes.
- **Tu Aprendizaje con datos 100% reales**: Barras de progreso precisas calculadas contra el catálogo activo (Hiragana, Katakana, Kanji). Cero métricas ficticias.
- **Continúa Aprendiendo**: CTA contextual enlazado a la última sesión del usuario mediante `fetchRecentProgress`.

### 6.2 Modo Preguntas (`/game` - Focus Mode)
- **El carácter/kanji es el protagonista absoluto**: Tipografía japonesa amplia y centrada en pantalla.
- **Área de interacción cómoda**: Campo de respuesta o botones de selección con feedback táctil inmediato.
- **Feedback Semántico Inmediato**: `✓ Correcto (まど → mado)` o `✕ Solución: mado`. No depender únicamente del color verde/rojo.
- **Sin distracciones**: El ranking global de usuarios no debe competir con el ejercicio activo (debe ser panel colapsable o drawer secundario en móviles).

### 6.3 Modo Parejas (`/pair-match` - Tablero de Memoria)
- **Tablero protagonista**: 4x3 o 4x4 en desktop; 2 columnas en mobile.
- **Métricas integradas en tira compacta**: `3 parejas · 8 intentos · 00:42` en una sola línea superior; nunca tres cards gigantes para estadísticas.
- **Microinteracciones ágiles**: Giros de cartas (*flip*) entre 150ms y 250ms con respuesta háptica.

### 6.4 Constructor de Oraciones (`/sentence-builder` - Sintaxis y Gramática)
- **Canvas de construcción dominante**: La zona donde se ensambla la oración debe dominar la mitad superior.
- **Chips de palabras como botones interactivos**: Botones táctiles que se desplazan visualmente al canvas al ser pulsados. Prohibido anidar cards dentro de cards.
- **Prioridad de lectura**: 1) Hiragana $\to$ 2) Katakana $\to$ 3) Kanji con furigana.

### 6.5 Catálogo de Vocabulario (`/vocabulary` o `/vocabulario`)
- **Buscador ágil y filtros mínimos**: `[ Buscar palabra... ]` y píldoras esenciales: `[Todos] [Aprendiendo] [Dominadas]`.
- **Grid de escaneo rápido**: 3 columnas en desktop, 2 en tablet, 1 columna o lista compacta en móvil.
- **Tarjetas limpias de palabra**: Kanji dominante, lectura kana, traducción en español e indicador de maestría. Sin badges redundantes de fecha o id.

---

## 7. Arquitectura y Estándar de Modales (`*Modal.jsx`)

Cualquier modal o ventana emergente DEBE respetar esta composición y renderizarse obligatoriamente mediante `createPortal(modalContent, document.body)` para garantizar que el backdrop cubra el 100% de la pantalla sin fugas ni interferencias con el header o contenedores padres:

```jsx
// 1. Backdrop (Directo en document.body con z-[100])
<div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
     role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={onClose}>

  // 2. Contenedor
  <div className="w-full max-w-lg (o max-w-2xl para vitrinas con tabs) max-h-[85vh] flex flex-col rounded-2xl border border-[#e8ded6] bg-[#fdfbf7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
       onClick={(e) => e.stopPropagation()}>

    // 3. Header
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0e4dd] bg-white">
      <div>
        <span className="text-[10px] font-bold tracking-wider uppercase text-[#6b2832]/70">Categoría</span>
        <h2 id="modal-title" className="text-lg font-bold text-[#6b2832]">Título del Modal</h2>
      </div>
      <button onClick={onClose} className="h-8 w-8 rounded-lg text-[#6b2832]/70 hover:bg-[#faf4f2]">✕</button>
    </div>

    // 4. Barra de Pestañas / Tabs (si aplica)
    // Usar siempre flex-wrap para que todas las pestañas permanezcan 100% legibles sin truncamiento
    <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5 border-b border-[#f0e4dd] bg-[#fbf6f2]">
      {/* Pills con estado activo en vino (#6b2832) y texto blanco */}
    </div>

    // 5. Body
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
      {/* Contenido con cards ligeras o formularios limpios */}
    </div>

    // 6. Footer
    <div className="px-5 py-3.5 border-t border-[#f0e4dd] bg-white flex items-center justify-between">
      <span className="text-xs text-[rgb(var(--color-neutral))]/65">Microcopy de ayuda</span>
      <div className="flex items-center gap-2">
        <button onClick={onClose} className="btn-secondary">Cancelar</button>
        <button className="btn-primary">Guardar cambios</button>
      </div>
    </div>
  </div>
</div>
```

### Accesibilidad y Cobertura Obligatoria de Modales:
- Renderizado mediante **`createPortal(modal, document.body)`** para garantizar que el backdrop cubra el 100% del viewport sin que el header (`z-50`) quede por encima rompiendo el contraste.
- Backdrop con **`z-[100]`** y `bg-black/50 backdrop-blur-xs`.
- Listener de tecla **`Escape`** para cerrar automáticamente.
- Cierre al hacer clic en el backdrop exterior (`e.stopPropagation()` en el contenedor).
- Focus visible y atributos `aria-labelledby`.
- Las barras de pestañas de categorías deben usar **`flex-wrap`** y ancho suficiente (`max-w-2xl`) para asegurar que títulos como "Aventura & Lore" nunca queden cortados.

---

## 8. Estándares de Scrollbars y Sliders

1. **Cero scrollbars nativos toscos**:
   Está terminantemente prohibido dejar visibles las barras de scroll grises de 17px de Windows con botones de flecha retro.
2. **Scroll vertical fino (`.custom-scrollbar`)**:
   - Ancho: 5px - 6px.
   - Pista: Transparente.
   - Píldora (*thumb*): `#dfcfc7` con hover en `#a87880` / `#6b2832`.
   - Flechas: `::-webkit-scrollbar-button { display: none !important; }`.
3. **Tiras horizontales y tabs (`.no-scrollbar overscroll-contain`)**:
   - Pestañas de categorías, filtros horizontales o carruseles móviles **nunca deben mostrar una barra de scroll horizontal física**.
   - El desplazamiento se realiza de forma nativa mediante arrastre táctil o rueda del ratón de forma fluida e invisible.

---

## 9. Game Feel, Táctilidad y Microinteracciones

1. **Áreas táctiles mínimas**:
   Todo botón interactivo o input debe tener un área de contacto mínima de **44px** (`min-h-[44px]`).
2. **Feedback táctil háptico/visual**:
   Todo elemento interactivo debe responder con `active:scale-98 transition-all duration-100`.
3. **Cero Emojis en la UI**:
   Prohibido el uso de emojis planos del sistema operativo (`🔒`, `★`, `🔥`, `📖`). Siempre utilizar iconos vectoriales limpios SVG mediante `<Icon name="..." />` (`lock`, `sparkles`, `star-mastery`, `fire-streak`, `book-open`, etc.).
4. **Microanimaciones rápidas**:
   Duración entre **150ms y 300ms**. El usuario debe percibir respuesta instantánea, no animaciones lentas o decorativas.

---

## 10. Checklist de Anti-Patrones a Evitar ("AI UI")

- ❌ Anidar cards dentro de cards dentro de cards.
- ❌ Envolver una pantalla entera en una card gigante con fondo blanco.
- ❌ Cuatro cards exactamente idénticas compitiendo sin jerarquía.
- ❌ Píldoras, badges e iconos decorativos en cada esquina sin función real.
- ❌ Formularios administrativos permanentes en la vista principal.
- ❌ Botón rojo "Eliminar" destructivo al mismo nivel y tamaño que "Guardar".
- ❌ Inventar estadísticas o porcentajes falsos sin respaldo en la base de datos.
- ❌ Desperdiciar el viewport con espacios vacíos gigantes a 100% de zoom.
- ❌ Dejar barras de scroll nativas de Windows en modales o listas.

---

## 11. Criterios de Aceptación Responsive (100% Zoom Obligatorio)

Toda pantalla y modal DEBE validarse obligatoriamente a **100% de zoom** en los siguientes viewports:
- **Móviles**: `390x844` y `412x915` (área táctil $\ge$ 44px, stacks fluidos, cero desbordamiento horizontal).
- **Tablets**: `768x1024` (layouts equilibrados de 2 columnas o rejillas adaptativas).
- **Laptops y Monitores**: `1366x768`, `1440x900` y `1920x1080` (ancho máximo contenido: `1100px - 1280px` centrado con aire natural).