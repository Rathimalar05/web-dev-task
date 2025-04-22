"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, Clock, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSocket } from "@/components/socket-provider"

interface Notification {
  id: string
  title: string
  message: string
  type: "leave" | "message" | "system"
  status: "unread" | "read"
  timestamp: string
}

export function NotificationCenter({ onClose }: { onClose: () => void }) {
  const { socket } = useSocket()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Leave Approved",
      message: "Your leave request for April 10-12 has been approved.",
      type: "leave",
      status: "unread",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: "2",
      title: "New Message",
      message: "Admin: Please provide medical certificate for your leave.",
      type: "message",
      status: "unread",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: "3",
      title: "System Update",
      message: "Campus Desk will be under maintenance on Sunday.",
      type: "system",
      status: "unread",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
  ])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Listen for new notifications (simulated)
    const timer = setTimeout(() => {
      const newNotification = {
        id: "4",
        title: "Real-time Notification",
        message: "This is a real-time notification example.",
        type: "system",
        status: "unread",
        timestamp: new Date().toISOString(),
      }
      setNotifications((prev) => [newNotification, ...prev])
    }, 5000)

    return () => clearTimeout(timer)
  }, [socket])

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, status: "read" } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, status: "read" })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    return notification.type === activeTab
  })

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    }
  }

  return (
    <Card className="absolute right-0 top-12 w-80 md:w-96 z-50 shadow-lg animate-slide-in-up">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex-1">
              Leaves
            </TabsTrigger>
            <TabsTrigger value="message" className="flex-1">
              Messages
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="m-0">
          <div className="max-h-80 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border  => (
                <div
                  key={notification.id}
                  className={\`p-4 border-b last:border-b-0 ${notification.status === "unread" ? "bg-primary/5" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {notification.type === "leave" ? (
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                        ) : notification.type === "message" ? (
                          <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Bell className="h-4 w-4 text-secondary" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                            <Bell className="h-4 w-4 text-accent" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {notification.status === "unread" && (
                            <Badge variant="accent" className="h-1.5 w-1.5 rounded-full p-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {notification.status === "unread" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">No notifications found</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="leave" className="m-0">
          <div className="max-h-80 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b last:border-b-0 ${notification.status === "unread" ? "bg-primary/5" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {notification.status === "unread" && (
                            <Badge variant="accent" className="h-1.5 w-1.5 rounded-full p-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {notification.status === "unread" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">No leave notifications found</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="message" className="m-0">
          <div className="max-h-80 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b last:border-b-0 ${notification.status === "unread" ? "bg-primary/5" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                          <Bell className="h-4 w-4 text-secondary" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {notification.status === "unread" && (
                            <Badge variant="accent" className="h-1.5 w-1.5 rounded-full p-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {notification.status === "unread" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">No message notifications found</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
