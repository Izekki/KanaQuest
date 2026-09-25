# 🎭 Rimuru Mascot & Panel - Módulo Exportable Independiente

Este paquete contiene todo lo necesario para utilizar a la mascota **Rimuru con la máscara de Shizue**, sus **animaciones completas de slime** (salto elástico, brote y saludo con brazo, derretimiento en 24 frames a charco plano), el **temporizador automático periódico** y su **Panel de Control Personalizador**, listo para llevarse a cualquier otro proyecto **sin ninguna dependencia rota ni afectar al proyecto original**.

---

## 📁 Estructura del Paquete (`rimuru-export/`)

| Archivo / Carpeta | Descripción |
|---|---|
| `RimuruWidget.jsx` | **Componente Todo-En-Uno**: Mascota + Sombra de suelo + Panel flotante minimizable con 1 sola línea de código. |
| `RimuruMascot.jsx` | Componente SVG completo de Rimuru con máscara de Shizue y todas las fases anatómicas y animaciones. |
| `RimuruMeltedFlat.jsx` | Componente SVG del charco plano derretido (`manyslime_08_melted_flat`). |
| `RimuruPanel.jsx` | Panel de control interactivo con previsualización, botones de salto, brazo, derretirse, frecuencias, colores y tamaños. |
| `useRimuruController.js` | Custom Hook React que gestiona el estado, los disparadores, la física de sombras y el ciclo automático con temporizador. |
| `rimuru-animations.css` | Todas las animaciones CSS (`@keyframes`), curvas de aceleración y estilos del panel (funciona con o sin Tailwind). |
| `standalone-demo.html` | Archivo HTML puro que puedes abrir directamente en tu navegador (Brave) o cargar como fuente en **OBS Studio**. |
| `raw-svgs/` | Copias exactas de los archivos SVG originales en vector puro para ilustradores o diseño web. |

---

## 🚀 Cómo usarlo en otro proyecto

### Opción 1: En un proyecto React / Next.js / Vite (Recomendada)

1. Copia la carpeta `rimuru-export` completa dentro del directorio `src/` de tu nuevo proyecto (puedes renombrarla a `components/rimuru`).
2. Úsalo directamente en cualquier vista o página:

```jsx
import { RimuruWidget } from './rimuru-export';

export default function MiPagina() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      {/* Listo: Mascota animada con sombra y panel minimizable */}
      <RimuruWidget />
    </div>
  );
}
```

#### Opciones de configuración de `<RimuruWidget />`:

```jsx
<RimuruWidget
  defaultPalette="branding"      // 'branding' (lavanda), 'branding-pink', 'branding-cyan', 'original' (azul)
  defaultSize="medium"          // 'small', 'medium', 'large'
  defaultAutoPlay={true}        // Activar animaciones periódicas automáticas
  defaultInterval={10}          // Cada cuántos segundos (ej. 8, 10, 15)
  defaultAnimType="alternate"   // 'alternate' (salto -> brazo -> derretir), 'jump', 'wave', 'melt'
  showPanelButton={true}        // Mostrar el botón 'Personalizar Mascota'
/>
```

---

### Opción 2: Uso modular y avanzado (Mascota y Panel por separado)

Si deseas colocar la Mascota en un lugar y el Panel en una barra lateral o modal:

```jsx
import { RimuruMascot, RimuruPanel, useRimuruController } from './rimuru-export';

export function MiSuperOverlay() {
  const rimuru = useRimuruController({
    defaultPalette: 'branding',
    defaultInterval: 10,
    defaultAutoPlay: true,
  });

  return (
    <div>
      {/* 1. La mascota interactiva */}
      <div onClick={rimuru.triggerJump} style={{ cursor: 'pointer' }}>
        <RimuruMascot
          variant={rimuru.paletteMode}
          isJumping={rimuru.isJumping}
          onAnimationEnd={rimuru.handleAnimationEnd}
          isArmWaving={rimuru.isArmWaving}
          isArmExtended={rimuru.isArmExtended}
          onArmAnimationEnd={rimuru.handleArmAnimationEnd}
          isMelting={rimuru.isMelting}
          isMeltedFlat={rimuru.isMeltedFlat}
          onMeltAnimationEnd={rimuru.handleMeltAnimationEnd}
          style={{ width: rimuru.sizeStyle.width, height: 'auto' }}
        />
        {/* Sombra de suelo sincronizada */}
        <div
          className={rimuru.isJumping ? 'rimuru-shadow-jump' : rimuru.isMelting ? 'rimuru-shadow-melt' : ''}
          style={{
            width: rimuru.sizeStyle.width,
            height: '10px',
            background: rimuru.shadowGradient,
            borderRadius: '9999px',
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* 2. Botones o Panel completo */}
      <RimuruPanel controller={rimuru} />
    </div>
  );
}
```

---

### Opción 3: En OBS Studio (Navegador OBS) o HTML Vanilla

1. Puedes abrir `standalone-demo.html` haciendo doble clic para probarlo en tu navegador.
2. En **OBS Studio**:
   - Agrega una nueva fuente de tipo **Navegador (Browser)**.
   - Marca la casilla **Archivo local (Local file)**.
   - Selecciona `standalone-demo.html`.
   - Dimensiones recomendadas: `1920 x 1080` (o el tamaño de tu lienzo).
   - ¡Rimuru ejecutará automáticamente sus animaciones cada 10 segundos!

---

## 🎨 Paletas de Color Disponibles

| Paleta | Valor | Descripción |
|---|---|---|
| **Rolero Pastel** | `'branding'` | Lavanda suave y púrpura pastel místico. |
| **Rosa Rolero** | `'branding-pink'` | Tono rosado pastel cute. |
| **Cyan Rolero** | `'branding-cyan'` | Tono azul cielo / cian pastel refrescante. |
| **Original Azul** | `'original'` | Rimuru azul slime oficial del anime. |

*(La máscara de Shizue y su marca roja #d8595e se mantienen fieles e intactas en todas las variantes).*

---

## 🪄 Animaciones Integradas

1. **Salto Elástico (`isJumping`)**:
   - Curva *Squash and Stretch* de 2.5 segundos con aceleración física, ápice a -76px, deformación de impacto y rebotes elásticos.
   - Bamboleo con inercia de la máscara de Shizue sincronizado.
   - Sombra de contacto que se expande al chocar y se reduce en el aire.

2. **Brote y Saludo con Brazo/Aleta (`isArmWaving` / `isArmExtended`)**:
   - 2.8 segundos a 30 fps de física viscosa de anime.
   - Brota como una ampolla de slime, se estira, da dos saludos elásticos y se reabsorbe limpiamente en el cuerpo.
   - Modo `isArmExtended` para dejar el brazo saludando en bucle continuo.

3. **Derretimiento Viscoso (`isMelting` / `isMeltedFlat`)**:
   - 4.3 segundos en 24 frames de transición.
   - Se estira verticalmente, colapsa en un *splat* líquido, la máscara cae en horizontal y se expande en el charco plano durante 1.2 segundos antes de reconstituirse.
   - Modo `isMeltedFlat` para mantenerlo como charco plano en reposo.
