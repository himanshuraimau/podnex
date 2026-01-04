"use client"

import { useSession } from "@/lib/auth-client"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin")
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="min-h-screen felt-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brass mx-auto mb-4"></div>
          <p className="font-body text-debossed">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/signin")
  }

  return (
    <div className="min-h-screen felt-bg">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="leather-panel rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold text-gold-foil mb-2">
                Welcome Back!
              </h1>
              <p className="font-body text-debossed">
                {session.user.name || session.user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-brass"
                />
              )}
              <button
                onClick={handleSignOut}
                className="btn-skeuo px-6 py-3 rounded-lg font-body font-bold text-foreground"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="wood-panel rounded-xl p-6">
            <h3 className="font-heading text-xl font-bold text-embossed mb-2">
              Profile
            </h3>
            <div className="space-y-2 font-body text-sm">
              <p className="text-debossed">
                <span className="font-semibold text-foreground">Name:</span>{" "}
                {session.user.name || "Not set"}
              </p>
              <p className="text-debossed">
                <span className="font-semibold text-foreground">Email:</span>{" "}
                {session.user.email}
              </p>
              <p className="text-debossed">
                <span className="font-semibold text-foreground">Verified:</span>{" "}
                {session.user.emailVerified ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          </div>

          <div className="wood-panel rounded-xl p-6">
            <h3 className="font-heading text-xl font-bold text-embossed mb-2">
              Quick Stats
            </h3>
            <div className="space-y-2 font-body text-sm">
              <p className="text-debossed">
                <span className="font-semibold text-foreground">Podcasts:</span> 0
              </p>
              <p className="text-debossed">
                <span className="font-semibold text-foreground">Episodes:</span> 0
              </p>
              <p className="text-debossed">
                <span className="font-semibold text-foreground">Storage:</span> 0 MB
              </p>
            </div>
          </div>

          <div className="wood-panel rounded-xl p-6">
            <h3 className="font-heading text-xl font-bold text-embossed mb-2">
              Session Info
            </h3>
            <div className="space-y-2 font-body text-sm">
              <p className="text-debossed">
                <span className="font-semibold text-foreground">User ID:</span>{" "}
                {session.user.id.slice(0, 8)}...
              </p>
              <p className="text-debossed">
                <span className="font-semibold text-foreground">Status:</span>{" "}
                🟢 Active
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-6 brass-badge rounded-xl p-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-wood-dark mb-2">
            🎙️ Your Studio Dashboard Coming Soon
          </h2>
          <p className="font-body text-wood-dark/80">
            We're building amazing features for you. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  )
}
