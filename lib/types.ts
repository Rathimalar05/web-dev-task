export interface User {
  _id: string
  name: string
  email: string
  role: "student" | "faculty"
  createdAt: string
  updatedAt: string
}

export interface LeaveRequest {
  _id: string
  userId: string
  userName?: string
  reason: string
  details?: string
  fromDate: string
  toDate: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

export interface ApiResponse {
  success: boolean
  message?: string
  data?: any
}
