import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('🚀 Iniciando activación de consentimientos para usuarios ya registrados...');

  // 1. Obtener los perfiles existentes
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('user_id, username');

  if (profilesError) {
    console.error('❌ Error al consultar la tabla `profiles`:', profilesError.message);
    process.exit(1);
  }

  console.log(`📋 Total de usuarios registrados encontrados: ${profiles.length}`);

  // 2. Intentar verificar si existe la tabla user_consents
  const { data: testCheck, error: testError } = await supabase
    .from('user_consents')
    .select('id')
    .limit(1);

  if (testError && testError.message.includes('relation "public.user_consents" does not exist')) {
    console.log('⚠️ La tabla `public.user_consents` aún no ha sido creada en la base de datos de Supabase.');
    console.log('👉 Se requiere ejecutar primero el script SQL en el SQL Editor de Supabase.');
    return;
  }

  // 3. Para cada usuario existente, registrar términos y cookies si no existen
  let activatedCount = 0;
  for (const profile of profiles) {
    const { user_id, username } = profile;
    if (!user_id) continue;

    const consentsToInsert = [
      {
        user_id,
        consent_type: 'terms_and_privacy',
        document_version: 'v1.0-2026',
        accepted: true,
        user_agent: 'Migration Script (Grandfathered Existing Users)',
        metadata: { username, note: 'Usuario previo a la implementación del apartado legal' },
      },
      {
        user_id,
        consent_type: 'cookies_all',
        document_version: 'v1.0-2026',
        accepted: true,
        user_agent: 'Migration Script (Grandfathered Existing Users)',
        metadata: {
          username,
          categories: { essential: true, preferences: true, analytics: true },
          note: 'Activación automática de cookies para usuarios existentes',
        },
      },
    ];

    const { error: insertError } = await supabase
      .from('user_consents')
      .upsert(consentsToInsert, { onConflict: 'user_id, consent_type, document_version', ignoreDuplicates: true });

    if (!insertError) {
      activatedCount++;
    }
  }

  console.log(`✅ Activación procesada para ${activatedCount} usuarios registrados.`);
}

run();
