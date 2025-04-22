"use client"

import type { LeaveRequest } from "./types"
import { getCurrentUser } from "./auth-service"

// Mock data for demo purposes
let LEAVE_REQUESTS: LeaveRequest[] = [
  {
    _id: "1",
    userId: "1",
    userName: "Student User",
    reason: "Medical Leave",
    details: "I have a doctor's appointment",
    fromDate: "2023-04-10",
    toDate: "2023-04-12",
    status: "approved",
    createdAt: "2023-04-05T00:00:00.000Z",
    updatedAt: "2023-04-06T00:00:00.000Z",
  },
  {
    _id: "2",
    userId: "1",
    userName: "Student User",
    reason: "Family Emergency",
    details: "Need to attend a family event",
    fromDate: "2023-05-15",
    toDate: "2023-05-18",
    status: "rejected",
    createdAt: "2023-05-10T00:00:00.000Z",
    updatedAt: "2023-05-11T00:00:00.000Z",
  },
  {
    _id: "3",
    userId: "1",
    userName: "Student User",
    reason: "Personal Leave",
    details: "Personal matters to attend to",
    fromDate: "2023-06-20",
    toDate: "2023-06-22",
    status: "pending",
    createdAt: "2023-06-15T00:00:00.000Z",
    updatedAt: "2023-06-15T00:00:00.000Z",
  },
]

export async function getStudentDashboardData() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = await getCurrentUser()
  if (!user) throw new Error("User not authenticated")

  // Filter leave requests for the current user
  const userLeaves = LEAVE_REQUESTS.filter((leave) => leave.userId === user._id)

  return {
    totalLeaves: userLeaves.length,
    pendingLeaves: userLeaves.filter((leave) => leave.status === "pending").length,
    approvedLeaves: userLeaves.filter((leave) => leave.status === "approved").length,
    rejectedLeaves: userLeaves.filter((leave) => leave.status === "rejected").length,
    recentLeaves: userLeaves.slice(0, 5), // Get 5 most recent leaves
  }
}

export async function getAdminDashboardData() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = await getCurrentUser()
  if (!user || user.role !== "faculty") throw new Error("Unauthorized")

  return {
    totalStudents: 15, // Mock data
    totalLeaves: LEAVE_REQUESTS.length,
    pendingLeaves: LEAVE_REQUESTS.filter((leave) => leave.status === "pending").length,
    approvedLeaves: LEAVE_REQUESTS.filter((leave) => leave.status === "approved").length,
    rejectedLeaves: LEAVE_REQUESTS.filter((leave) => leave.status === "rejected").length,
    recentLeaves: LEAVE_REQUESTS.slice(0, 5), // Get 5 most recent leaves
  }
}

export async function getLeaveHistory() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = await getCurrentUser()
  if (!user) throw new Error("User not authenticated")

  // Filter leave requests for the current user
  return LEAVE_REQUESTS.filter((leave) => leave.userId === user._id)
}

export async function getUpcomingLeaves() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = await getCurrentUser()
  if (!user) throw new Error("User not authenticated")

  // Get current date
  const today = new Date()

  // Filter leave requests for the current user that are approved and have a future start date
  const upcomingLeaves = LEAVE_REQUESTS.filter(
    (leave) => leave.userId === user._id && leave.status === "approved" && new Date(leave.fromDate) >= today,
  )

  // Sort by start date (ascending)
  return upcomingLeaves.sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime())
}

export async function getAllLeaveApplications() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = await getCurrentUser()
  if (!user || user.role !== "faculty") throw new Error("Unauthorized")

  return LEAVE_REQUESTS
}

export async function applyForLeave(leaveData: {
  reason: string
  fromDate: string
  toDate: string
  details?: string
}) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const user = await getCurrentUser()
  if (!user) throw new Error("User not authenticated")

  // Create a new leave request
  const newLeave: LeaveRequest = {
    _id: (LEAVE_REQUESTS.length + 1).toString(),
    userId: user._id,
    userName: user.name,
    reason: leaveData.reason,
    details: leaveData.details,
    fromDate: leaveData.fromDate,
    toDate: leaveData.toDate,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Add to the mock database
  LEAVE_REQUESTS = [newLeave, ...LEAVE_REQUESTS]

  return { success: true, data: newLeave }
}

export async function updateLeaveStatus(leaveId: string, status: "approved" | "rejected") {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = await getCurrentUser()
  if (!user || user.role !== "faculty") throw new Error("Unauthorized")

  // Find and update the leave request
  const leaveIndex = LEAVE_REQUESTS.findIndex((leave) => leave._id === leaveId)

  if (leaveIndex === -1) {
    return { success: false, message: "Leave request not found" }
  }

  LEAVE_REQUESTS[leaveIndex] = {
    ...LEAVE_REQUESTS[leaveIndex],
    status,
    updatedAt: new Date().toISOString(),
  }

  return { success: true }
}
