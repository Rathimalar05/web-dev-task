"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getLeaveHistory } from "@/lib/leave-service"
import type { LeaveRequest } from "@/lib/types"
import { CalendarDays, Download, Search } from "lucide-react"

export default function LeaveHistoryPage() {
  const { toast } = useToast()
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const data = await getLeaveHistory()
        setLeaveHistory(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch leave history",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveHistory()
  }, [toast])

  const filteredLeaves = leaveHistory.filter((leave) => {
    const matchesSearch = leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || leave.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportToPDF = () => {
    toast({
      title: "Export initiated",
      description: "Your leave history is being exported to PDF",
    })
    // In a real implementation, this would generate and download a PDF
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
        <h1 className="text-3xl font-bold tracking-tight">Leave History</h1>
        <Button onClick={exportToPDF}>
          <Download className="mr-2 h-4 w-4" />
          Export to PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Leave Applications</CardTitle>
          <CardDescription>View and track all your leave applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reason..."
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

          {filteredLeaves.length > 0 ? (
            <div className="space-y-4">
              {filteredLeaves.map((leave) => (
                <div
                  key={leave._id}
                  className="flex flex-col md:flex-row md:items-center justify-between border p-4 rounded-lg"
                >
                  <div className="space-y-2 mb-4 md:mb-0">
                    <div className="font-medium text-lg">{leave.reason}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </div>
                    {leave.details && <div className="text-sm mt-2">{leave.details}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={
                        leave.status === "approved"
                          ? "success"
                          : leave.status === "rejected"
                            ? "destructive"
                            : "outline"
                      }
                      className="capitalize"
                    >
                      {leave.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Applied on {new Date(leave.createdAt).toLocaleDateString()}
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
