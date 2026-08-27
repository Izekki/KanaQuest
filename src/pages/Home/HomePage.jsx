import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[1.75rem] border border-[#eaded6] bg-white p-8 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-[rgb(var(--color-accent))]/70">Inicio</p>
        <h1 className="mt-4 text-3xl font-semibold text-[rgb(var(--color-accent))] md:text-5xl">KanaQuest</h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-[rgb(var(--color-neutral))]/75 md:text-lg">
          Aprende japonés mediante pequeñas rondas de práctica enfocadas: reconoce kanji y kana,
          traduce palabras, construye oraciones gramaticales y repasa lo que ya has aprendido. Lleva registro de tu progreso,
          gana experiencia y mejora tu racha diaria.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/game" className="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--color-accent))] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity">Comenzar</Link>
          <Link to="/historial" className="inline-flex items-center justify-center rounded-2xl border border-[#eaded6] bg-white px-5 py-3 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm hover:bg-[#fbf7f4] transition-colors">Ver historial</Link>
        </div>
      </section>

      <section className="rounded-[1.2rem] border border-[#eaded6] bg-white p-6 text-sm text-[rgb(var(--color-neutral))]/75 shadow-[0_10px_28px_rgba(128,43,56,0.06)]">
        <h2 className="text-lg font-semibold text-[rgb(var(--color-accent))]">¿Qué hago aquí?</h2>
        <ul className="mt-3 list-disc pl-5 space-y-1.5">
          <li><strong>Practica reconocimiento:</strong> muestra un kanji/kana y escribe su lectura/significado.</li>
          <li><strong>Practica traducción:</strong> escribe la palabra en japonés desde su significado en español.</li>
          <li><strong>Constructor de oraciones:</strong> arrastra y ordena fichas interactivas para formar frases japonesas reales organizadas por temáticas y niveles.</li>
          <li><strong>Revisa tu historial:</strong> consulta tu progreso diario; el sistema guarda tus aciertos, errores y racha de estudio.</li>
        </ul>
      </section>

      <footer className="mt-6 rounded-[1rem] border border-[#eaded6] bg-white p-4 text-center text-sm text-[rgb(var(--color-neutral))]/70 shadow-[0_8px_20px_rgba(128,43,56,0.04)]">
        @2026 KanaQuest. Todos los derechos reservados. | <a href="https://github.com/Izekki/KanaQuest" className="text-[rgb(var(--color-accent))] hover:underline">GitHub</a>
      </footer>
    </div>
  );
}
