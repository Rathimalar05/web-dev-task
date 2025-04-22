"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, Clock } from "lucide-react"
import { getUpcomingLeaves } from "@/lib/leave-service"
import type { LeaveRequest } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function UpcomingLeaves() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUpcomingLeaves = async () => {
      try {
        const result = await getUpcomingLeaves()
        setLeaves(result)
      } catch (error) {
        console.error("Failed to fetch upcoming leaves:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUpcomingLeaves()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (leaves.length === 0) {
    return <div className="flex h-[200px] items-center justify-center text-muted-foreground">No upcoming leaves</div>
  }

  return (
    <div className="space-y-4">
      {leaves.map((leave) => (
        <div
          key={leave._id}
          className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{leave.reason}</p>
              <Badge variant="success" className="text-xs">
                Approved
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>
                {format(new Date(leave.fromDate), "MMM d")} - {format(new Date(leave.toDate), "MMM d, yyyy")}
              </span>
            </div>
            {leave.details && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{leave.details}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
