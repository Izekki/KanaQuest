import React from 'react';
import { Link } from 'react-router-dom';
import LegalLayout from './LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Aviso de Privacidad Integral"
      subtitle="Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y las reformas legales de México (marzo 2025 y 2026)."
      documentVersion="v1.0-2026"
    >
      <div className="space-y-6 text-sm text-[rgb(var(--color-neutral))]/85 leading-relaxed">
        <div className="p-4 rounded-xl border border-[#ebdcd3] bg-[#faf0eb] text-xs text-[#6b2832] font-medium leading-relaxed">
          <strong>Resumen de Compromiso:</strong> En KanaQuest protegemos tu privacidad. No vendemos tus datos a anunciantes, no usamos rastreadores invasivos de terceros y tratamos únicamente la información necesaria para respaldar tu progreso en el aprendizaje del japonés.
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            1. Identidad y Domicilio del Responsable
          </h2>
          <p>
            <strong>KanaQuest</strong>, con domicilio en la Ciudad de México, México, y portal web accesible en{' '}
            <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-[#6b2832] font-mono text-xs">https://kanaquest.izekki.me/</code>, es el responsable del tratamiento y salvaguarda de sus datos personales.
          </p>
          <p>
            Oficial de Privacidad y atención de Derechos ARCO:{' '}
            <a href="mailto:KanaQuest@izekki.me" className="font-bold text-[#6b2832] underline">
              KanaQuest@izekki.me
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            2. Datos Personales Recabados
          </h2>
          <p>Para la prestación del servicio educativo, tratamos las siguientes categorías de datos:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Datos de Identificación y Acceso:</strong> Nombre de usuario (apodo), correo electrónico, contraseña debidamente encriptada mediante algoritmos criptográficos (vía Supabase Auth) y avatar opcional.</li>
            <li><strong>Métricas de Aprendizaje y Gamificación:</strong> Nivel alcanzado, puntos de experiencia (XP), rachas de días seguidos, tiempo de respuesta en ejercicios, aciertos, errores y palabras dominadas en el catálogo.</li>
            <li><strong>Datos Técnicos de Seguridad:</strong> Dirección IP y navegador web (almacenados temporalmente para prevención de ataques informáticos y bitácora obligatoria de consentimiento legal).</li>
          </ul>
          <p className="font-semibold text-rose-800 text-xs">
            * KanaQuest NO recaba datos personales sensibles de ninguna naturaleza.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            3. Finalidades del Tratamiento (Primarias y Secundarias)
          </h2>
          <h3 className="text-sm font-bold text-[#6b2832]">A. Finalidades Primarias (Estrictamente Necesarias)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Creación, gestión y autenticación de la cuenta de usuario.</li>
            <li>Sincronización segura de tu progreso pedagógico en la nube (PostgreSQL / Supabase).</li>
            <li>Cálculo de repetición espaciada (SRS) para programar tus repasos diarios de kanji.</li>
            <li>Soporte técnico, atención de errores y resolución de reportes de vocabulario.</li>
            <li>Conservación de la bitácora auditable de consentimiento exigida por la ley mexicana.</li>
          </ul>

          <h3 className="text-sm font-bold text-[#6b2832] pt-2">B. Finalidades Secundarias (Voluntarias y Opcionales)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Envío opcional de novedades educativas o nuevo vocabulario por correo electrónico.</li>
            <li>Elaboración de estadísticas pedagógicas anónimas y agregadas para calibrar la dificultad de los ejercicios.</li>
          </ul>
          <p className="text-xs text-[rgb(var(--color-neutral))]/70">
            Puedes manifestar en cualquier momento tu negativa para las finalidades secundarias sin que ello limite tu acceso a la práctica del idioma.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            4. Protección Reforzada de Menores de Edad
          </h2>
          <p>
            Reconociendo que los menores de edad tienen derecho a una protección reforzada en entornos digitales, KanaQuest exige que los usuarios menores de 18 años cuenten con la autorización de su padre, madre o tutor legal.
          </p>
          <p>
            Los padres o tutores pueden en todo momento acceder a los datos del menor, solicitar su rectificación, o requerir la cancelación definitiva de la cuenta escribiendo a{' '}
            <a href="mailto:KanaQuest@izekki.me" className="font-bold text-[#6b2832] underline">
              KanaQuest@izekki.me
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            5. Transferencias de Datos a Proveedores Tecnológicos
          </h2>
          <p>
            No realizamos transferencias comerciales de datos a terceros. Únicamente transferimos datos a prestadores de infraestructura indispensable conforme al artículo 37 de la LFPDPPP:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Supabase Inc. (EE.UU. - us-west-2):</strong> Base de datos relacional y autenticación con cifrado en reposo y en tránsito.</li>
            <li><strong>Vercel Inc. (Red Global):</strong> Hospedaje frontend, entrega de contenido y protección perimetral SSL.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            6. Ejercicio de los Derechos ARCO y Revocación
          </h2>
          <p>
            Usted tiene derecho de <strong>Acceso</strong>, <strong>Rectificación</strong>, <strong>Cancelación</strong> y <strong>Oposición</strong> (Derechos ARCO) respecto a sus datos personales:
          </p>
          <div className="p-4 rounded-xl border border-[#ebdcd3] bg-white space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#6b2832]">Procedimiento de Solicitud</h4>
            <ol className="list-decimal pl-5 space-y-1 text-xs text-[rgb(var(--color-neutral))]/80">
              <li>Envía un correo a <code className="text-[#6b2832] font-semibold">KanaQuest@izekki.me</code> con el asunto "Derechos ARCO".</li>
              <li>Indica tu nombre de usuario, correo de cuenta y adjunta documento que acredite tu identidad (o representación de tutor).</li>
              <li>Describe puntualmente el derecho que deseas ejercer y los datos a los que se refiere.</li>
              <li>Recibirás respuesta en un plazo máximo de <strong>20 días hábiles</strong>, haciéndose efectiva dentro de los <strong>15 días hábiles</strong> siguientes si resulta procedente.</li>
            </ol>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            7. Autoridad Garante Competente en México
          </h2>
          <p>
            Si considera que su derecho a la protección de datos personales ha sido vulnerado, puede acudir ante la autoridad competente en la materia en el sector privado:{' '}
            <strong>Secretaría Anticorrupción y Buen Gobierno</strong> (organismo facultado conforme al marco legal federal vigente en México).
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
