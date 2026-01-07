import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { FileText } from "lucide-react"

export default function NewPodcastPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-medium">Create New Podcast</h2>
        <p className="text-muted-foreground mt-1">Turn your text into an engaging audio conversation</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Podcast Creator</CardTitle>
          <CardDescription>Multi-step form with content input, configuration, and review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <p className="font-medium text-foreground mb-2">Form Coming Soon</p>
            <p className="text-sm max-w-md">
              The podcast creation form will include content input, duration selection,
              voice configuration, and preview before generation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
