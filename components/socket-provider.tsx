"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Socket } from "socket.io-client"

type SocketContextType = {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // For demo purposes, we'll simulate socket connection
    // In a real app, you would connect to your Socket.io server
    const simulatedSocket = {
      on: (event: string, callback: Function) => {
        if (event === "connect") {
          setTimeout(() => {
            callback()
          }, 1000)
        }
        return simulatedSocket
      },
      emit: (event: string, data: any) => {
        console.log(`Emitted ${event} with data:`, data)
        return simulatedSocket
      },
      disconnect: () => {
        setIsConnected(false)
      },
    } as unknown as Socket

    setSocket(simulatedSocket as Socket)

    // Simulate connection
    setTimeout(() => {
      setIsConnected(true)
    }, 1000)

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}
