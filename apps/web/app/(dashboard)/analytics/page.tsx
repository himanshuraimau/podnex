import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { BarChart2 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-medium">Analytics</h2>
        <p className="text-muted-foreground mt-1">Track your podcast engagement and usage patterns</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Podcasts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">All time generated</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0m</div>
            <p className="text-xs text-muted-foreground mt-1">Audio duration</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground mt-1">Completion rate</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usage Over Time</CardTitle>
          <CardDescription>Charts and detailed analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <BarChart2 className="h-8 w-8" />
            </div>
            <p className="font-medium text-foreground mb-2">Analytics Coming Soon</p>
            <p className="text-sm max-w-md">
              View detailed charts, usage patterns, and insights about your podcast generation activity.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
