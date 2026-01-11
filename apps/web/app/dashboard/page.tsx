"use client"

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentPodcasts } from "@/components/dashboard/RecentPodcasts";
import { Button } from "@workspace/ui/components/button";
import { Mic, Clock, Zap, Plus } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const firstName = userName.split(" ")[0];
  
  const [stats, setStats] = useState({
    totalPodcasts: 0,
    totalMinutes: 0,
    planUsage: 0,
    monthlyLimit: 5,
    monthlyUsed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/podcasts/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-medium">Welcome back, {firstName}</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your podcasts.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="lg" className="md:w-auto w-full">
              <Link href="/dashboard/podcasts/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Podcast
              </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard 
            title="Total Podcasts" 
            value={isLoading ? "..." : stats.totalPodcasts.toString()}
            icon={Mic} 
            description="Lifetime generated"
        />
        <StatsCard 
            title="Minutes Generated" 
            value={isLoading ? "..." : `${stats.totalMinutes}m`}
            icon={Clock} 
            description="Total audio duration"
        />
        <StatsCard 
            title="Plan Usage" 
            value={isLoading ? "..." : `${stats.planUsage}%`}
            icon={Zap} 
            description={`${stats.monthlyUsed}/${stats.monthlyLimit} podcasts this month`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-3">
           <RecentPodcasts />
        </div>
      </div>
    </div>
  );
}
