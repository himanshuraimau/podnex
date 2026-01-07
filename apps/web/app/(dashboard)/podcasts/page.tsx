import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { Plus, Mic } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function PodcastsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-medium">My Podcasts</h2>
          <p className="text-muted-foreground mt-1">Manage and listen to your generated podcasts</p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/podcasts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Podcast
          </Link>
        </Button>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle>All Podcasts</CardTitle>
              <CardDescription>Your AI-generated podcast conversations</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted/50 p-4 rounded-full mb-4">
                      <Mic className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground mb-1">No podcasts yet</p>
                  <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                      Create your first AI-generated podcast by providing content or notes.
                  </p>
                  <Button asChild variant="outline">
                      <Link href="/dashboard/podcasts/new">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Podcast
                      </Link>
                  </Button>
              </div>
          </CardContent>
      </Card>
    </div>
  )
}
