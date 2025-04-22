"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getStudentDashboardData } from "@/lib/leave-service"
import type { LeaveRequest } from "@/lib/types"
import { CalendarDays, CheckCircle, Clock, FileText, XCircle } from "lucide-react"
import Link from "next/link"
import { useSocket } from "@/components/socket-provider"
import { LeaveStatusChart } from "@/components/leave-status-chart"
import { UpcomingLeaves } from "@/components/upcoming-leaves"

export default function StudentDashboard() {
  const { toast } = useToast()
  const { socket, isConnected } = useSocket()
  const [dashboardData, setDashboardData] = useState<{
    totalLeaves: number
    pendingLeaves: number
    approvedLeaves: number
    rejectedLeaves: number
    recentLeaves: LeaveRequest[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getStudentDashboardData()
        setDashboardData(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch dashboard data",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for leave status updates
      const handleLeaveUpdate = (data: { leaveId: string; status: string }) => {
        toast({
          title: `Leave ${data.status}`,
          description: `Your leave application has been ${data.status}`,
          variant: data.status === "approved" ? "success" : data.status === "rejected" ? "destructive" : "default",
        })

        // Refresh dashboard data
        getStudentDashboardData().then((data) => {
          setDashboardData(data)
        })
      }

      // Simulate receiving a leave update after 8 seconds
      const timer = setTimeout(() => {
        handleLeaveUpdate({ leaveId: "3", status: "approved" })
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [socket, isConnected, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your leave applications.</p>
        </div>
        <Button asChild className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <Link href="/dashboard/student/apply">
            <FileText className="mr-2 h-4 w-4" />
            Apply for Leave
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover-effect border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leaves</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.totalLeaves || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All leave applications</p>
            <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-primary rounded-full" style={{ width: "100%" }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.pendingLeaves || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-warning rounded-full"
                style={{
                  width: `${dashboardData ? (dashboardData.pendingLeaves / dashboardData.totalLeaves) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.approvedLeaves || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Approved leaves</p>
            <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{
                  width: `${dashboardData ? (dashboardData.approvedLeaves / dashboardData.totalLeaves) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.rejectedLeaves || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Rejected applications</p>
            <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-destructive rounded-full"
                style={{
                  width: `${dashboardData ? (dashboardData.rejectedLeaves / dashboardData.totalLeaves) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 card-hover-effect">
          <CardHeader>
            <CardTitle>Leave Status Overview</CardTitle>
            <CardDescription>Summary of your leave applications</CardDescription>
          </CardHeader>
          <CardContent>
            <LeaveStatusChart
              data={[
                { name: "Approved", value: dashboardData?.approvedLeaves || 0, color: "hsl(var(--success))" },
                { name: "Pending", value: dashboardData?.pendingLeaves || 0, color: "hsl(var(--warning))" },
                { name: "Rejected", value: dashboardData?.rejectedLeaves || 0, color: "hsl(var(--destructive))" },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 card-hover-effect">
          <CardHeader>
            <CardTitle>Upcoming Leaves</CardTitle>
            <CardDescription>Your upcoming approved leaves</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingLeaves />
          </CardContent>
        </Card>
      </div>

      <Card className="card-hover-effect">
        <CardHeader>
          <CardTitle>Recent Leave Applications</CardTitle>
          <CardDescription>Your most recent leave applications and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData?.recentLeaves && dashboardData.recentLeaves.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentLeaves.map((leave) => (
                <div key={leave._id} className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="font-medium">{leave.reason}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge
                    variant={
                      leave.status === "approved" ? "success" : leave.status === "rejected" ? "destructive" : "warning"
                    }
                    className="capitalize"
                  >
                    {leave.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No leave applications found. Apply for a leave to see it here.
            </div>
          )}

          <div className="mt-6">
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/student/history">View All Leave History</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
