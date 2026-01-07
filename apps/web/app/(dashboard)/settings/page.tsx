import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Settings as SettingsIcon, User, CreditCard, Key, Webhook } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Profile",
      description: "Manage your account details and preferences",
      icon: User,
      href: "/dashboard/settings/profile",
    },
    {
      title: "Subscription",
      description: "View and manage your billing and plan",
      icon: CreditCard,
      href: "/dashboard/settings/subscription",
    },
    {
      title: "API Keys",
      description: "Create and manage API keys for integrations",
      icon: Key,
      href: "/dashboard/settings/api-keys",
    },
    {
      title: "Webhooks",
      description: "Configure webhook endpoints for events",
      icon: Webhook,
      href: "/dashboard/settings/webhooks",
    },
  ]
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-medium">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon
          return (
            <Link key={section.href} href={section.href}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription className="mt-1">{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Additional Settings</CardTitle>
          <CardDescription>More configuration options coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <p className="text-sm max-w-md">
              Additional settings pages will be implemented based on the requirements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
