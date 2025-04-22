"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getAllLeaveApplications, updateLeaveStatus } from "@/lib/leave-service"
import type { LeaveRequest } from "@/lib/types"
import { CalendarDays, CheckCircle, Download, Search, XCircle } from "lucide-react"

export default function LeaveApplicationsPage() {
  const { toast } = useToast()
  const [applications, setApplications] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getAllLeaveApplications()
        setApplications(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch leave applications",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [toast])

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.userName && app.userName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      const result = await updateLeaveStatus(id, status)

      if (result.success) {
        setApplications(applications.map((app) => (app._id === id ? { ...app, status } : app)))

        toast({
          title: `Application ${status}`,
          description: `The leave application has been ${status} successfully`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: result.message || "Failed to update leave status",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "An error occurred while updating the leave status",
      })
    }
  }

  const exportToCSV = () => {
    toast({
      title: "Export initiated",
      description: "Leave applications are being exported to CSV",
    })
    // In a real implementation, this would generate and download a CSV
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Leave Applications</h1>
        <Button onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Leave Applications</CardTitle>
          <CardDescription>Review and manage all student leave applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name or reason..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="flex flex-col md:flex-row md:items-center justify-between border p-4 rounded-lg"
                >
                  <div className="space-y-2 mb-4 md:mb-0">
                    <div className="font-medium text-lg">{application.reason}</div>
                    <div className="text-sm font-medium">By {application.userName || "Student"}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      {new Date(application.fromDate).toLocaleDateString()} -{" "}
                      {new Date(application.toDate).toLocaleDateString()}
                    </div>
                    {application.details && <div className="text-sm mt-2">{application.details}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      {application.status === "pending" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => handleStatusUpdate(application._id, "rejected")}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="h-8"
                            onClick={() => handleStatusUpdate(application._id, "approved")}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                        </>
                      ) : (
                        <Badge
                          variant={application.status === "approved" ? "success" : "destructive"}
                          className="capitalize"
                        >
                          {application.status}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Applied on {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No leave applications found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
