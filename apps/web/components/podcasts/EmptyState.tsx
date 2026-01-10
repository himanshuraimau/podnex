import { Button } from "@workspace/ui/components/button";
import { Mic } from "lucide-react";

interface EmptyStateProps {
  onCreateNew?: () => void;
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative rounded-full bg-card border-2 border-border p-8">
          <Mic className="h-16 w-16 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text */}
      <h3 className="font-serif text-2xl font-medium mb-3 text-foreground">
        No podcasts yet
      </h3>
      <p className="text-muted-foreground font-sans max-w-md mb-8">
        Create your first AI-powered podcast from your notes. Transform your ideas
        into engaging audio content in minutes.
      </p>

      {/* CTA */}
      <Button onClick={onCreateNew} size="lg" className="font-sans">
        <Mic className="h-5 w-5 mr-2" />
        Create Your First Podcast
      </Button>
    </div>
  );
}
