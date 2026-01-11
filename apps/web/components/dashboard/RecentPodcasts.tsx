import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { ArrowRight, Play, Clock, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { Podcast } from "@/lib/types/podcast.types"

export function RecentPodcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPodcasts = async () => {
      try {
        const response = await fetch('/api/podcasts?limit=5&sort=createdAt_desc');
        if (response.ok) {
          const data = await response.json();
          setPodcasts(data);
        }
      } catch (error) {
        console.error('Error fetching recent podcasts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPodcasts();
  }, []);

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
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : podcasts.length === 0 ? (
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
