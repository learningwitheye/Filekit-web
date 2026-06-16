import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const cookieStore = await cookies() 
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    
    // ✅ Yahan humne jasoosi wale logs lagaye hain
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.log("❌ LOGIN ERROR:", error.message) // Agar fail hua toh yeh terminal mein aayega
    } else {
      console.log("✅ LOGIN SUCCESS:", data?.user?.email) // Agar paas hua toh email print hoga
      return NextResponse.redirect(`${origin}/`)
    }
  }

  // Agar koi error aaye toh wapas home page par bhej do
  return NextResponse.redirect(`${origin}/`)
}