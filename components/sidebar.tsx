"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Trophy,
  Gift,
  MessageSquare,
  Calendar,
  ClipboardCheck,
  Menu,
  X,
  LogOut,
  Megaphone,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import type { Agent } from "./team-portal"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  loggedInUser: Agent
  hasUnreadMessages: boolean
  onLogout: () => void
}

export function Sidebar({ activeTab, setActiveTab, loggedInUser, hasUnreadMessages, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [animatingTab, setAnimatingTab] = useState<string | null>(null)

  // Handle tab change with animation
  const handleTabChange = (tab: string) => {
    setAnimatingTab(tab)
    setActiveTab(tab)
    setCollapsed(false)

    // Reset animating state after animation completes
    setTimeout(() => {
      setAnimatingTab(null)
    }, 500)
  }

  // Navigation items - all users can see all pages now
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "prizes", label: "Prizes", icon: Gift },
    { id: "communication", label: "Communication", icon: MessageSquare, hasNotification: hasUnreadMessages },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "marketing", label: "Marketing", icon: Megaphone },
    {
      id: "approvals",
      label: "Approvals",
      icon: ClipboardCheck,
      restricted: loggedInUser.role !== "manager" && loggedInUser.role !== "CEO",
    },
  ]

  return (
    <>
      {/* Mobile menu button with animation */}
      <motion.div className="lg:hidden fixed top-4 left-4 z-50" whileTap={{ scale: 0.9 }}>
        <Button variant="outline" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </motion.div>

      {/* Overlay for mobile */}
      {collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setCollapsed(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r lg:translate-x-0 flex flex-col shadow-lg",
        )}
        initial={{ x: -320 }}
        animate={{ x: collapsed ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ translateX: "var(--sidebar-x)" }}
        custom-css-vars={{ "--sidebar-x": collapsed ? "0px" : "-320px" }}
      >
        <div className="p-4 border-b flex flex-col items-center">
          <div className="relative w-40 h-20 mb-2">
            <img
              src="/placeholder.svg?height=80&width=160"
              alt="88West Realty"
              className="object-contain w-full h-full"
            />
          </div>
          <div className="text-center">
            <p className="font-semibold">{loggedInUser.name}</p>
            <p className="text-xs text-muted-foreground">
              {loggedInUser.role.charAt(0).toUpperCase() + loggedInUser.role.slice(1)}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-4 px-2">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <motion.div key={item.id} whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start relative overflow-hidden",
                    activeTab === item.id && "bg-primary text-primary-foreground",
                  )}
                  onClick={() => handleTabChange(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>

                  {/* Show "View only" label for restricted pages */}
                  {item.restricted && <span className="ml-2 text-xs opacity-70">(View only)</span>}

                  {/* Notification indicator */}
                  {item.hasNotification && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
                  )}

                  {/* Animation indicator */}
                  {animatingTab === item.id && (
                    <motion.div
                      className="absolute inset-0 bg-primary/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {activeTab === item.id && <ChevronRight className="absolute right-2 h-4 w-4" />}
                </Button>
              </motion.div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
