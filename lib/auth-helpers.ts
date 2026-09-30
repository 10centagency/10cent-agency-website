import { supabase } from './supabase'

export async function getAuthenticatedClient() {
  const { data: { session }, error } =
    await supabase.auth.getSession()

  if (!session) {
    window.location.replace('/auth')
    return null
  }

  return supabase
}

export async function refreshSession() {
  const { data: { session } } =
    await supabase.auth.getSession()

  if (!session) {
    const { data } = await supabase.auth.refreshSession()
    return data.session
  }

  return session
}
