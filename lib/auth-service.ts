"use client"

import type { User } from "./types"

// Mock data for demo purposes
const USERS = [
  {
    _id: "1",
    name: "Student User",
    email: "student@example.com",
    password: "student123",
    role: "student",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "faculty",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
]

export async function loginUser({ email, password }: { email: string; password: string }) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = USERS.find((u) => u.email === email && u.password === password)

  if (user) {
    const { password, ...userWithoutPassword } = user
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    return { success: true, user: userWithoutPassword }
  }

  return { success: false, message: "Invalid credentials" }
}

export async function registerUser({
  name,
  email,
  password,
  role,
}: { name: string; email: string; password: string; role: string }) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  if (USERS.some((u) => u.email === email)) {
    return { success: false, message: "User with this email already exists" }
  }

  // In a real app, this would create a new user in the database
  return { success: true }
}

export async function getCurrentUser(): Promise<User | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const userJson = localStorage.getItem("user")
  if (!userJson) return null

  return JSON.parse(userJson) as User
}

export async function logout() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  localStorage.removeItem("user")
  return { success: true }
}
