"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getAdminDashboardData } from "@/lib/leave-service"
import type { LeaveRequest } from "@/lib/types"
import { CalendarDays, CheckCircle, Clock, FileText, Users, XCircle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { toast } = useToast()
  const [dashboardData, setDashboardData] = useState<{
    totalStudents: number
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
        const data = await getAdminDashboardData()
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/admin/applications">
            <FileText className="mr-2 h-4 w-4" />
            View All Applications
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalStudents || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leaves</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalLeaves || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.pendingLeaves || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.approvedLeaves || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.rejectedLeaves || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leave Applications</CardTitle>
          <CardDescription>Most recent leave applications requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData?.recentLeaves && dashboardData.recentLeaves.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentLeaves.map((leave) => (
                <div key={leave._id} className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="font-medium">{leave.reason}</div>
                    <div className="text-sm text-muted-foreground">By {leave.userName || "Student"}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {leave.status === "pending" ? (
                      <>
                        <Button size="sm" variant="outline" className="h-8">
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                        <Button size="sm" className="h-8">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      </>
                    ) : (
                      <div
                        className={`text-sm font-medium ${
                          leave.status === "approved" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">No pending leave applications found.</div>
          )}

          <div className="mt-6">
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/admin/applications">View All Applications</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
