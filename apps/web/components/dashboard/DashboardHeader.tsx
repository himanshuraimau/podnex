"use client"

import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface BreadcrumbSegment {
  label: string
  href?: string
}

export function DashboardHeader() {
  const pathname = usePathname()
  
  const segments: BreadcrumbSegment[] = []
  
  if (pathname === '/dashboard') {
    segments.push({ label: 'Dashboard' })
  } else if (pathname.startsWith('/dashboard/podcasts/new')) {
    segments.push({ label: 'Podcasts', href: '/dashboard/podcasts' })
    segments.push({ label: 'New Podcast' })
  } else if (pathname.startsWith('/dashboard/podcasts')) {
    segments.push({ label: 'Podcasts' })
  } else if (pathname.startsWith('/dashboard/analytics')) {
    segments.push({ label: 'Analytics' })
  } else if (pathname.startsWith('/dashboard/settings')) {
    segments.push({ label: 'Settings' })
  }
  
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, index) => (
              <div key={segment.label} className="flex items-center gap-2">
                <BreadcrumbItem>
                  {segment.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={segment.href}>{segment.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < segments.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
