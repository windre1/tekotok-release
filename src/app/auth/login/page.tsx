'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-6">
      <h2 className="font-display text-xl font-bold mb-1">Masuk</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
        Selamat datang kembali
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: 'var(--muted)' }}>
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="kamu@email.com"
            required
            className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
            style={{
              background: 'var(--card2)',
              border: '1px solid var(--border)',
              color: '#F0F2FF',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: 'var(--muted)' }}>
            PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
            style={{
              background: 'var(--card2)',
              border: '1px solid var(--border)',
              color: '#F0F2FF',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: loading ? 'var(--card2)' : 'linear-gradient(135deg, var(--pink), #C8006A)',
            color: '#fff',
            border: 'none',
          }}
        >
          {loading ? 'Memproses...' : 'MASUK'}
        </button>
      </form>

      <p className="text-center text-sm mt-5" style={{ color: 'var(--muted)' }}>
        Belum punya akun?{' '}
        <Link href="/auth/register" className="font-semibold" style={{ color: 'var(--cyan)' }}>
          Daftar gratis
        </Link>
      </p>
    </div>
  )
}
