"use client"

import type { User } from "./types"
import { getCurrentUser } from "./auth-service"

// Mock data for demo purposes
const STUDENTS: User[] = [
  {
    _id: "1",
    name: "Student User",
    email: "student@example.com",
    role: "student",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    _id: "3",
    name: "John Doe",
    email: "john@example.com",
    role: "student",
    createdAt: "2023-01-05T00:00:00.000Z",
    updatedAt: "2023-01-05T00:00:00.000Z",
  },
  {
    _id: "4",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "student",
    createdAt: "2023-01-10T00:00:00.000Z",
    updatedAt: "2023-01-10T00:00:00.000Z",
  },
  {
    _id: "5",
    name: "Michael Johnson",
    email: "michael@example.com",
    role: "student",
    createdAt: "2023-01-15T00:00:00.000Z",
    updatedAt: "2023-01-15T00:00:00.000Z",
  },
  {
    _id: "6",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "student",
    createdAt: "2023-01-20T00:00:00.000Z",
    updatedAt: "2023-01-20T00:00:00.000Z",
  },
]

export async function getAllStudents() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = await getCurrentUser()
  if (!user || user.role !== "faculty") throw new Error("Unauthorized")

  return STUDENTS
}
