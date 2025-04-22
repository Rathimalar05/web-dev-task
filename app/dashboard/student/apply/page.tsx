"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { applyForLeave } from "@/lib/leave-service"
import { Info } from "lucide-react"
import { Tabs, TabsList } from "@/components/ui/tabs"
import { useSocket } from "@/components/socket-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ApplyLeavePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected } = useSocket()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState({
    leaveType: "",
    reason: "",
    fromDate: "",
    toDate: "",
    details: "",
    contactInfo: "",
    documents: [] as File[],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...newFiles],
      }))
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.leaveType) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a leave type",
      })
      return
    }
    
    if (!formData.reason) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a reason for your leave",
      })
      return
    }
    
    if (!formData.fromDate || !formData.toDate) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select both from and to dates",
      })
      return
    }
    
    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      toast({
        variant: "destructive",
        title: "Invalid date range",
        description: "From date cannot be after to date",
      })
      return
    }
    
    setIsLoading(true)

    try {
      const result = await applyForLeave(formData)

      if (result.success) {
        toast({
          title: "Leave application submitted",
          description: "Your leave application has been submitted successfully",
          variant: "success",
        })
        router.push("/dashboard/student/history")
      } else {
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: result.message || "Failed to submit leave application",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "An error occurred while submitting your leave application",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextTab = () => {
    if (activeTab === "basic") {
      if (!formData.leaveType || !formData.reason || !formData.fromDate || !formData.toDate) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill in all required fields before proceeding",
        })
        return
      }
      setActiveTab("details")
    } else if (activeTab === "details") {
      setActiveTab("documents")
    }
  }

  const prevTab = () => {
    if (activeTab === "details") {
      setActiveTab("basic")
    } else if (activeTab === "documents") {
      setActiveTab("details")
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Apply for Leave
      </h1>

      <Card className="card-hover-effect">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Leave Application Form</CardTitle>
            <CardDescription>Fill in the details below to submit your leave application</CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected && (
              <Alert className="mb-6 bg-warning/10 border-warning/50">
                <Info className="h-4 w-4 text-warning" />
                <AlertTitle>Connection Status</AlertTitle>
                <AlertDescription>
                  You appear to be offline. Your application will be submitted when you reconnect.
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full\
