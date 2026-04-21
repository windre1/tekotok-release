'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) throw error
      toast.success('Akun dibuat! Cek email untuk konfirmasi.')
      router.push('/auth/login')
    } catch (err: any) {
      toast.error(err.message || 'Registrasi gagal')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'var(--card2)',
    border: '1px solid var(--border)',
    color: '#F0F2FF',
  }

  return (
    <div className="glass-card p-6">
      <h2 className="font-display text-xl font-bold mb-1">Daftar Gratis</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
        10 kredit gratis untuk memulai
      </p>

      <form onSubmit={handleRegister} className="space-y-4">
        {[
          { label: 'NAMA LENGKAP', type: 'text', value: name, setValue: setName, placeholder: 'Nama kamu' },
          { label: 'EMAIL', type: 'email', value: email, setValue: setEmail, placeholder: 'kamu@email.com' },
          { label: 'PASSWORD', type: 'password', value: password, setValue: setPassword, placeholder: '••••••••' },
        ].map(({ label, type, value, setValue, placeholder }) => (
          <div key={label}>
            <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: 'var(--muted)' }}>
              {label}
            </label>
            <input
              type={type}
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={placeholder}
              required
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--pink), #C8006A)',
            color: '#fff',
            border: 'none',
          }}
        >
          {loading ? 'Membuat akun...' : 'DAFTAR GRATIS'}
        </button>
      </form>

      <p className="text-center text-sm mt-5" style={{ color: 'var(--muted)' }}>
        Sudah punya akun?{' '}
        <Link href="/auth/login" className="font-semibold" style={{ color: 'var(--cyan)' }}>
          Masuk
        </Link>
      </p>
    </div>
  )
}
