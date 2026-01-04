"use client"

import Link from "next/link"
import Navigation from "@/components/landing-page/Navigation"
import { authClient } from "@/lib/auth-client"
import { handleApiError } from "@/lib/api"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
      })
      router.push("/dashboard")
    } catch (err: any) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError("")
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })
    } catch (err: any) {
      setError(handleApiError(err))
    }
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen felt-bg flex items-center justify-center p-4 pt-32 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brass/10 rounded-full blur-3xl" />

        <div className="w-full max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: Marketing Content */}
            <div className="hidden lg:block space-y-6">
              <div className="brass-badge inline-block px-4 py-2 rounded-full mb-4">
                <span className="font-mono text-sm text-wood-dark font-bold tracking-wider">
                  GET STARTED
                </span>
              </div>
              
              <h1 className="font-heading text-5xl font-bold text-embossed leading-tight">
                Build Your
                <br />
                <span className="text-gold-foil">Podcast Studio</span>
              </h1>
              
              <p className="font-body text-lg text-debossed leading-relaxed">
                Join thousands of creators using professional tools to create, edit, and distribute amazing podcasts.
              </p>

              {/* Features */}
              <div className="space-y-4 pt-4">
                {[
                  { icon: "🎙️", title: "Studio-Grade Recording", desc: "Crystal clear audio quality" },
                  { icon: "⚡", title: "AI-Powered Editing", desc: "Edit in minutes, not hours" },
                  { icon: "🌐", title: "Global Distribution", desc: "50+ platforms instantly" },
                  { icon: "🔧", title: "Powerful API", desc: "Build custom integrations" },
                ].map((item, index) => (
                  <div key={index} className="wood-panel rounded-lg p-4 flex items-start gap-4">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <div className="font-body font-semibold text-embossed">{item.title}</div>
                      <div className="font-body text-sm text-debossed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Sign Up Form */}
            <div className="w-full">
              <div className="leather-panel rounded-2xl p-1 relative">
                {/* Stitching effect */}
                <div className="absolute inset-2 border-2 border-dashed border-foreground/10 rounded-xl pointer-events-none" />

                {/* Brass Corner Pieces */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-brass rounded-tl-sm" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-brass rounded-tr-sm" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-brass rounded-bl-sm" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-brass rounded-br-sm" />

                <div className="p-8 md:p-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="font-heading text-3xl font-bold text-gold-foil mb-2">
                      Create Account
                    </h2>
                    <p className="font-body text-sm text-debossed">
                      Start your podcasting journey today
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 font-body text-sm">
                      {error}
                    </div>
                  )}

                  {/* Email/Password Form */}
                  <form onSubmit={handleEmailSignUp} className="space-y-4 mb-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-background/50 border-2 border-foreground/10 focus:border-brass focus:outline-none font-body"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-background/50 border-2 border-foreground/10 focus:border-brass focus:outline-none font-body"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="Password (min 8 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-background/50 border-2 border-foreground/10 focus:border-brass focus:outline-none font-body"
                        required
                        minLength={8}
                        disabled={loading}
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full btn-skeuo px-8 py-4 rounded-xl font-body font-bold text-lg text-foreground disabled:opacity-50"
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-foreground/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-debossed font-body">Or</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <button 
                      onClick={handleGoogleSignUp}
                      className="w-full btn-skeuo px-8 py-4 rounded-xl font-body font-bold text-lg text-foreground flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </button>

                    <p className="text-center font-body text-sm text-foreground/60 mt-2">
                      Already have an account?{" "}
                      <Link
                        href="/signin"
                        className="text-brass hover:text-primary font-semibold transition-colors"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
