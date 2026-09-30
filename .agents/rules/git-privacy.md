---
trigger: always_on
---

Nunca subir secretos al repositorio

Nunca subas al repositorio (commit, merge o push) información sensible como API keys, tokens, contraseñas, claves de Supabase, cadenas de conexión, certificados, etc.

Toda credencial debe leerse desde variables de entorno definidas en .env; nunca debe estar hardcodeada en el código.

El archivo .env debe estar incluido en .gitignore y nunca debe versionarse.

Mantén un .env.example con los nombres de las variables y valores ficticios, sin datos reales.

En CI/CD, usa secretos del proveedor (GitHub Secrets, Vercel, Supabase, etc.), no archivos .env versionados.

Antes de cada commit, revisa los cambios con git diff --staged y, si es posible, usa escaneo de secretos como gitleaks o trufflehog.

Si un secreto se expone, revócalo/rótalo de inmediato y limpia el historial del repositorio si es necesario.
