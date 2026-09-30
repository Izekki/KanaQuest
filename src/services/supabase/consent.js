import { supabase } from './client';

export const CURRENT_LEGAL_VERSION = 'v1.0-2026';

/**
 * Registra de forma auditable en la base de datos Supabase un consentimiento legal
 * (Términos y Condiciones, Aviso de Privacidad, Cookies, Confirmación de Tutor o Marketing)
 * conforme a los requerimientos de la LFPDPPP y el Código de Comercio de México.
 */
export async function recordUserConsent({
  userId = null,
  consentType,
  documentVersion = CURRENT_LEGAL_VERSION,
  accepted = true,
  metadata = {},
}) {
  if (!consentType) return { error: new Error('consentType es requerido') };

  try {
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Server/Node';
    
    // Si no se proporcionó userId, intentar obtenerlo de la sesión activa
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const { data } = await supabase.auth.getSession();
      effectiveUserId = data?.session?.user?.id ?? null;
    }

    const { data, error } = await supabase.from('user_consents').insert({
      user_id: effectiveUserId,
      consent_type: consentType,
      document_version: documentVersion,
      accepted,
      user_agent: userAgent,
      metadata: {
        ...metadata,
        client_timestamp: new Date().toISOString(),
        origin: typeof window !== 'undefined' ? window.location.origin : '',
      },
    }).select().maybeSingle();

    if (error) {
      console.warn('Registro de consentimiento en BD no completado (puede requerir migración SQL):', error.message);
      return { error };
    }

    return { data };
  } catch (err) {
    console.warn('Excepción al registrar consentimiento legal:', err);
    return { error: err };
  }
}

/**
 * Consulta si un usuario ha aceptado una versión específica de documento
 */
export async function checkUserConsent(userId, consentType, documentVersion = CURRENT_LEGAL_VERSION) {
  if (!userId || !consentType) return { accepted: false };

  try {
    const { data, error } = await supabase
      .from('user_consents')
      .select('accepted, document_version, created_at')
      .eq('user_id', userId)
      .eq('consent_type', consentType)
      .eq('document_version', documentVersion)
      .eq('accepted', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return { accepted: false, error };
    }

    return { accepted: !!data, consent: data };
  } catch (err) {
    return { accepted: false, error: err };
  }
}
