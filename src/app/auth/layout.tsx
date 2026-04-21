export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at top, #1a1030 0%, #0D0F1A 60%)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-black gradient-text tracking-tight">
            ViralKit
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            AI Video Content Generator
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
