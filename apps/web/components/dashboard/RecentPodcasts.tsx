import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { ArrowRight, Play, Clock, FileText } from "lucide-react"

export function RecentPodcasts() {
  // This would fetch from API
  const podcasts = [] // Empty for now

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Podcasts</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/podcasts">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {podcasts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
             <div className="bg-secondary/50 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 opacity-50" />
             </div>
             <p className="font-medium text-foreground mb-1">No podcasts generated yet</p>
             <p className="text-sm mb-4 max-w-xs">Create your first AI podcast by entering a topic or pasting content.</p>
             <Button asChild>
                <Link href="/dashboard/podcasts/new">Create Podcast</Link>
             </Button>
          </div>
        ) : (
          <div className="space-y-4">
             {/* List would go here */}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
