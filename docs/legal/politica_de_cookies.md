# Política de Cookies — KanaQuest

**Última actualización:** 30 de marzo de 2026  
**Versión:** 1.0 (México)  
**Marco Normativo:** Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y mejores prácticas internacionales

La presente Política de Cookies explica de manera transparente qué son las cookies y tecnologías de almacenamiento local, cuáles utilizamos en **KanaQuest**, con qué fines y cómo puede usted gestionarlas, personalizarlas o deshabilitarlas en cualquier momento.

---

## 1. ¿Qué son las Cookies y Tecnologías Similares?

Una cookie es un pequeño archivo de texto que un sitio web almacena en su navegador o dispositivo al visitarlo. Las tecnologías similares incluyen:
- **Almacenamiento Local (*localStorage* y *sessionStorage*):** Espacio de almacenamiento en su navegador que permite guardar información de forma persistente o temporal sin enviar datos innecesarios al servidor en cada petición HTTP.
- **Tokens de Sesión:** Cadenas de caracteres criptográficos que identifican de forma segura su sesión autenticada.

En KanaQuest priorizamos la eficiencia técnica y la privacidad del usuario; por ello, no utilizamos cookies invasivas de publicidad comportamental ni rastreadores de redes sociales que recopilen datos personales a través de múltiples sitios web.

---

## 2. Tipos de Cookies y Tecnologías Utilizadas en KanaQuest

Clasificamos las tecnologías que utilizamos en tres categorías claras:

### 2.1 Cookies Técnicas y Estrictamente Esenciales (Obligatorias)
Son indispensables para el funcionamiento correcto y seguro de la Plataforma. Sin estas cookies, no sería posible prestarle el servicio de aprendizaje ni mantenerlo conectado.

- **Finalidad:**
  - Mantener activa su sesión de usuario autenticado mediante Supabase Auth (`sb-*-auth-token`).
  - Prevenir ataques informáticos como Cross-Site Request Forgery (CSRF).
  - Almacenar temporalmente el estado del ejercicio o ronda de juego en curso para evitar pérdida de respuestas en caso de recarga accidental.
- **Base Legal:** Cumplimiento de la relación jurídica y prestación del servicio solicitado (Art. 10 y 16 LFPDPPP).
- **Consentimiento:** No requieren consentimiento previo al ser técnicamente necesarias para la existencia del servicio.

| Nombre / Clave | Proveedor / Origen | Tipo y Duración | Finalidad |
|---|---|---|---|
| `sb-<ref>-auth-token` | KanaQuest / Supabase | LocalStorage / Cookie segura (Sesión o hasta cierre de sesión) | Mantiene el token criptográfico JWT para autenticación segura en la base de datos. |
| `kanaquest_cookie_consent_v1` | KanaQuest | LocalStorage (Permanente o hasta borrado) | Registra la elección del usuario en el banner de cookies para no volver a mostrarlo de forma intrusiva. |

---

### 2.2 Cookies y Almacenamiento de Preferencias y Gamificación (Opcionales)
Permiten recordar las elecciones que usted realiza para brindarle una experiencia más personalizada y cómoda dentro de las dinámicas lúdicas.

- **Finalidad:**
  - Recordar si el audio de efectos sonoros está silenciado o activo (`kanaquest-sound-muted`).
  - Recordar la última vista o filtro seleccionado en el catálogo de vocabulario.
  - Almacenar instantáneas de perfil en caché local para acelerar la carga visual del avatar y nivel en el encabezado.
- **Base Legal:** Consentimiento del usuario.

| Nombre / Clave | Proveedor | Tipo y Duración | Finalidad |
|---|---|---|---|
| `kanaquest-sound-muted` | KanaQuest | LocalStorage | Guarda el estado de sonido (activado/silenciado) del sintetizador de efectos lúdicos. |
| `kanaquest_profile_snapshot:*` | KanaQuest | LocalStorage (Caché local) | Almacena temporalmente datos cosméticos (avatar, título) para reducir peticiones a la red. |
| `kanaquest-streak:*` | KanaQuest | LocalStorage | Resguardo local de la racha diaria de práctica. |

---

### 2.3 Cookies de Rendimiento y Analítica Agregada (Opcionales)
Nos ayudan a entender de forma global y anónima cómo interactúan los usuarios con la Plataforma para detectar fallas y optimizar los tiempos de carga.

- **Finalidad:** Medir el rendimiento de respuesta de las rutas, tiempos de renderizado de kanji y errores de ejecución en el navegador.
- **Características:** No recopilan nombres, correos ni datos que permitan la identificación directa del usuario.
- **Base Legal:** Consentimiento expreso del usuario a través del banner o panel de configuración.

---

## 3. ¿Cómo Gestionar o Modificar sus Preferencias en KanaQuest?

Usted tiene el control total sobre las cookies no esenciales:

1. **Banner de Consentimiento en Primera Visita:**
   Al acceder por primera vez a KanaQuest, se muestra un banner inferior no intrusivo con tres opciones:
   - **Aceptar todas:** Habilita las cookies esenciales, de preferencias y analíticas.
   - **Solo esenciales:** Bloquea todas las cookies y almacenamiento no estrictamente necesarios.
   - **Personalizar:** Abre un panel modal donde puede activar o desactivar cada categoría de forma independiente.

2. **Panel de Configuración Permanente (Footer):**
   Puede modificar o revocar su consentimiento en cualquier momento haciendo clic en el enlace **"Configuración de cookies"** situado en el pie de página de cualquier pantalla de KanaQuest.

---

## 4. ¿Cómo Deshabilitar las Cookies desde su Navegador Web?

Además de las herramientas que KanaQuest pone a su disposición, usted puede bloquear, deshabilitar o eliminar las cookies instaladas en su navegador mediante la configuración del mismo:

- **Brave Browser:** Menú ➔ Configuración ➔ Escudos y Privacidad (Shields & Privacy) ➔ Cookies y datos del sitio.
- **Google Chrome:** Configuración ➔ Privacidad y seguridad ➔ Cookies de terceros y datos de sitios.
- **Mozilla Firefox:** Opciones / Ajustes ➔ Privacidad y Seguridad ➔ Cookies y datos del sitio.
- **Microsoft Edge:** Configuración ➔ Cookies y permisos del sitio ➔ Administrar y eliminar cookies.
- **Apple Safari (macOS / iOS):** Ajustes ➔ Safari ➔ Privacidad y Seguridad ➔ Bloquear todas las cookies.

*Nota:* Si decide bloquear todas las cookies (incluidas las esenciales) desde la configuración de su navegador, es posible que la autenticación de usuario y el guardado de progreso en KanaQuest no funcionen adecuadamente.

---

## 5. Actualizaciones a la Política de Cookies

Podemos actualizar esta Política de Cookies para reflejar cambios en las tecnologías empleadas o en las directrices emitidas por la Secretaría Anticorrupción y Buen Gobierno u organismos afines en México. Toda actualización indicará la versión y fecha de entrada en vigor.

---

## 6. Dudas y Contacto

Si tiene alguna pregunta sobre el uso de cookies en nuestra Plataforma, puede contactar al equipo responsable en:
- **Correo Electrónico:** `KanaQuest@izekki.me`
