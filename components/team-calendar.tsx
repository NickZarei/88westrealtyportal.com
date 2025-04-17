"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Cake,
  Building,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import type { Agent } from "./team-portal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Simple event type
interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  eventType: "birthday" | "office" | "event"
  color?: string
  attendees?: string[] // "all" or specific user IDs
  notificationStatus?: {
    initial: boolean
    dayBefore: boolean
    thirtyMinBefore: boolean
  }
  customPhoneNumbers?: string[]
  customEmails?: string[]
  rsvpStatus?: {
    [key: string]: "yes" | "no" | "maybe" | "pending"
  }
  organizer?: string
  createdBy?: string
  createdAt?: string
}

// Sample events
const SAMPLE_EVENTS = [
  {
    id: "event1",
    title: "Monthly Team Meeting",
    description: "Review of monthly goals and achievements",
    date: "2025-05-15",
    time: "15:00",
    location: "Main Conference Room",
    eventType: "office",
    color: "#10b981",
  },
  {
    id: "event2",
    title: "Training Session",
    description: "Learn how to use our new CRM system",
    date: "2025-05-20",
    time: "10:00",
    location: "Training Room B",
    eventType: "event",
    color: "#0891b2",
  },
  {
    id: "event3",
    title: "Jane's Birthday",
    description: "Cake and celebration in the break room",
    date: "2025-05-18",
    time: "16:00",
    location: "Break Room",
    eventType: "birthday",
    color: "#f97316",
  },
]

interface TeamCalendarProps {
  currentUser: Agent
  agents: Agent[]
  onSendNotification?: (
    message: string,
    recipients: string[],
    customNumbers?: string[],
    customEmails?: string[],
    type?: string,
  ) => void
}

export default function TeamCalendar({ currentUser, agents, onSendNotification }: TeamCalendarProps) {
  const [events, setEvents] = useState(SAMPLE_EVENTS)
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [attendees, setAttendees] = useState<string[]>(["all"])
  const [customPhoneNumbers, setCustomPhoneNumbers] = useState("")
  const [customEmails, setCustomEmails] = useState("")
  const [eventType, setEventType] = useState("office" as "birthday" | "office" | "event")
  const [addSuccess, setAddSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [viewMode, setViewMode] = useState("calendar" as "calendar" | "list" | "rsvp")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationEvent, setNotificationEvent] = useState<CalendarEvent | null>(null)
  const [notificationType, setNotificationType] = useState("initial" as "initial" | "dayBefore" | "thirtyMinBefore")
  const [filterEventType, setFilterEventType] = useState("all")
  const [isEditMode, setIsEditMode] = useState(false)
  const [showRsvpModal, setShowRsvpModal] = useState(false)
  const [rsvpStatus, setRsvpStatus] = useState("yes" as "yes" | "no" | "maybe")
  const [rsvpComment, setRsvpComment] = useState("")

  // Check if user can modify the calendar
  const canModifyCalendar = ["manager", "CEO", "admin", "marketing", "HR"].includes(currentUser.role)
  const isAdminOrCEO = ["admin", "CEO"].includes(currentUser.role)

  // Event type colors
  const eventColors = {
    office: "#10b981", // emerald
    event: "#0891b2", // cyan
    birthday: "#f97316", // orange
  }

  // Check for upcoming events that need notifications
  useEffect(() => {
    const notificationTimer = setInterval(() => {
      const now = new Date()

      events.forEach((event) => {
        const eventDateTime = new Date(`${event.date}T${event.time}`)
        const timeDiff = eventDateTime.getTime() - now.getTime()
        const dayInMs = 24 * 60 * 60 * 1000
        const thirtyMinInMs = 30 * 60 * 1000

        // Check for 24 hour reminder
        if (timeDiff > 0 && timeDiff <= dayInMs && !event.notificationStatus.dayBefore) {
          // Send 24 hour notification
          const message = `REMINDER: ${event.title} is happening tomorrow at ${event.time}. Location: ${event.location}`
          sendEventNotification(event, message, "dayBefore")
        }

        // Check for 30 minute reminder
        if (timeDiff > 0 && timeDiff <= thirtyMinInMs && !event.notificationStatus.thirtyMinBefore) {
          // Send 30 minute notification
          const message = `REMINDER: ${event.title} is starting in 30 minutes at ${event.location}`
          sendEventNotification(event, message, "thirtyMinBefore")
        }
      })
    }, 60000) // Check every minute

    return () => clearInterval(notificationTimer)
  }, [events])

  // Get days in month for calendar view
  const getDaysInMonth = () => {
    try {
      const firstDayOfMonth = startOfMonth(new Date(currentYear, currentMonth))
      const lastDayOfMonth = endOfMonth(new Date(currentYear, currentMonth))

      // Get days from previous month to fill the first week
      const startDate = new Date(firstDayOfMonth)
      startDate.setDate(startDate.getDate() - startDate.getDay())

      // Get days from next month to fill the last week
      const endDate = new Date(lastDayOfMonth)
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

      return eachDayOfInterval({ start: startDate, end: endDate })
    } catch (error) {
      console.error("Error calculating days in month:", error)
      return []
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No date"
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid date"
      return format(date, "MMM dd, yyyy")
    } catch (error) {
      return "Invalid Date"
    }
  }

  // Handle month navigation
  const handlePreviousMonth = () => {
    const newDate = subMonths(new Date(currentYear, currentMonth, 1), 1)
    setCurrentMonth(newDate.getMonth())
    setCurrentYear(newDate.getFullYear())
  }

  const handleNextMonth = () => {
    const newDate = addMonths(new Date(currentYear, currentMonth, 1), 1)
    setCurrentMonth(newDate.getMonth())
    setCurrentYear(newDate.getFullYear())
  }

  // Get month name
  const getMonthName = () => {
    return format(new Date(currentYear, currentMonth), "MMMM yyyy")
  }

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filterEventType !== "all" && event.eventType !== filterEventType) {
        return false
      }
      return true
    })
  }, [events, filterEventType])

  // Get events for a specific day
  const getEventsForDay = (day) => {
    return filteredEvents.filter((event) => {
      try {
        const eventDate = new Date(event.date)
        return isSameDay(eventDate, day)
      } catch {
        return false
      }
    })
  }

  // Get event icon based on type
  const getEventIcon = (eventType) => {
    switch (eventType) {
      case "birthday":
        return <Cake className="h-3 w-3" />
      case "office":
        return <Building className="h-3 w-3" />
      default:
        return <Calendar className="h-3 w-3" />
    }
  }

  // Handle adding/editing event
  const handleSaveEvent = () => {
    if (!title || !date || !time || !location) {
      setError("Please fill in all required fields")
      return
    }

    // Parse custom contact information
    const parsedCustomNumbers = customPhoneNumbers
      ? customPhoneNumbers
          .split(",")
          .map((num) => num.trim())
          .filter((num) => num)
      : []

    const parsedCustomEmails = customEmails
      ? customEmails
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email)
      : []

    if (isEditMode && selectedEvent) {
      // Update existing event
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title,
              description,
              date,
              time,
              location,
              eventType,
              attendees,
              customPhoneNumbers: parsedCustomNumbers.length > 0 ? parsedCustomNumbers : undefined,
              customEmails: parsedCustomEmails.length > 0 ? parsedCustomEmails : undefined,
              color: eventColors[eventType],
            }
          : event,
      )

      setEvents(updatedEvents)
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: `event${Date.now()}`,
        title,
        description,
        date,
        time,
        location,
        organizer: currentUser.username,
        attendees,
        notificationStatus: {
          initial: false, // Will be set to true after initial notification
          dayBefore: false,
          thirtyMinBefore: false,
        },
        eventType,
        customPhoneNumbers: parsedCustomNumbers.length > 0 ? parsedCustomNumbers : undefined,
        customEmails: parsedCustomEmails.length > 0 ? parsedCustomEmails : undefined,
        color: eventColors[eventType],
        rsvpStatus: {},
        createdBy: currentUser.username,
        createdAt: new Date().toISOString().split("T")[0],
      }

      // Add event to state
      setEvents([...events, newEvent])

      // Send initial notification
      setTimeout(() => {
        const initialMessage = `New event: ${newEvent.title} scheduled for ${formatDate(
          newEvent.date,
        )} at ${newEvent.time}. Location: ${newEvent.location}`
        sendEventNotification(newEvent, initialMessage, "initial")
      }, 500)
    }

    // Show success message and reset form
    setAddSuccess(true)
    setTimeout(() => {
      setAddSuccess(false)
      setShowAddEventModal(false)
      resetForm()
    }, 2000)
  }

  // Send notification for an event
  const sendEventNotification = (
    event: CalendarEvent,
    message: string,
    type: "initial" | "dayBefore" | "thirtyMinBefore",
  ) => {
    // Get recipient usernames
    const recipientUsernames = event.attendees.includes("all") ? agents.map((agent) => agent.username) : event.attendees

    // Get custom contact info
    const customNumbers = event.customPhoneNumbers || []
    const customEmails = event.customEmails || []

    // In a real app, this would send actual notifications
    if (onSendNotification) {
      onSendNotification(message, recipientUsernames, customNumbers, customEmails, type)
    }

    // Update event notification status
    const updatedEvents = events.map((e) =>
      e.id === event.id
        ? {
            ...e,
            notificationStatus: {
              ...e.notificationStatus,
              [type]: true,
            },
          }
        : e,
    )

    setEvents(updatedEvents)
  }

  // Reset form fields
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDate("")
    setTime("")
    setLocation("")
    setAttendees(["all"])
    setCustomPhoneNumbers("")
    setCustomEmails("")
    setEventType("office" as "birthday" | "office" | "event")
    setError(null)
    setIsEditMode(false)
    setSelectedEvent(null)
  }

  // Handle sending manual notifications for an event
  const handleSendNotifications = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (!event) return

    setNotificationEvent(event)
    setNotificationType("initial")
    setNotificationMessage(
      `You have an upcoming event: ${event.title} on ${formatDate(event.date)} at ${event.time}. Location: ${event.location}`,
    )
    setShowNotificationModal(true)
  }

  // Send the actual notification
  const sendNotification = () => {
    if (!notificationEvent || !notificationMessage) return

    sendEventNotification(notificationEvent, notificationMessage, notificationType)

    // Close modal
    setShowNotificationModal(false)
    setNotificationEvent(null)
    setNotificationMessage("")
  }

  // Handle editing an event
  const handleEditEvent = (event: CalendarEvent) => {
    if (!canModifyCalendar) return

    setIsEditMode(true)
    setSelectedEvent(event)
    setTitle(event.title)
    setDescription(event.description || "")
    setDate(event.date)
    setTime(event.time)
    setLocation(event.location)
    setAttendees(event.attendees)
    setCustomPhoneNumbers(event.customPhoneNumbers?.join(", ") || "")
    setCustomEmails(event.customEmails?.join(", ") || "")
    setEventType(event.eventType)
    setShowAddEventModal(true)
  }

  // Handle deleting an event
  const handleDeleteEvent = (eventId: string) => {
    if (!canModifyCalendar) return

    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== eventId))
      setSelectedEvent(null)
    }
  }

  // Handle RSVP to an event
  const handleRsvp = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setRsvpStatus((event.rsvpStatus?.[currentUser.username] || "yes") as "yes" | "no" | "maybe")
    setRsvpComment("")
    setShowRsvpModal(true)
  }

  // Submit RSVP
  const submitRsvp = () => {
    if (!selectedEvent) return

    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          rsvpStatus: {
            ...event.rsvpStatus,
            [currentUser.username]: rsvpStatus,
          },
        }
      }
      return event
    })

    setEvents(updatedEvents)
    setShowRsvpModal(false)
  }

  // View event details
  const viewEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventDetailsModal(true)
  }

  // Get RSVP counts for an event
  const getRsvpCounts = (event: CalendarEvent) => {
    if (!event.rsvpStatus) return { yes: 0, no: 0, maybe: 0, pending: 0 }

    const counts = { yes: 0, no: 0, maybe: 0, pending: 0 }

    // Count existing RSVPs
    Object.values(event.rsvpStatus).forEach((status) => {
      counts[status]++
    })

    // Count pending RSVPs (people who haven't responded)
    if (event.attendees.includes("all")) {
      counts.pending = agents.length - Object.keys(event.rsvpStatus).length
    } else {
      counts.pending = event.attendees.length - Object.keys(event.rsvpStatus).length
    }

    return counts
  }

  return (
    <div className="space-y-6">
      <Card className="border-red-200">
        <CardHeader className="bg-gradient-to-r from-red-100 to-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Team Calendar
            </CardTitle>
            <CardDescription>View and manage team events</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filterEventType} onValueChange={setFilterEventType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="office">Office Events</SelectItem>
                <SelectItem value="birthday">Birthdays</SelectItem>
                <SelectItem value="event">Other Events</SelectItem>
              </SelectContent>
            </Select>

            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "calendar" | "list" | "rsvp")}
              className="w-auto"
            >
              <TabsList className="grid grid-cols-3 w-[240px]">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
                {isAdminOrCEO && <TabsTrigger value="rsvp">RSVPs</TabsTrigger>}
              </TabsList>
            </Tabs>

            {canModifyCalendar && (
              <Button onClick={() => setShowAddEventModal(true)} className="bg-red-600 hover:bg-red-700">
                Add Event
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <TabsContent value="calendar" className="mt-0">
            <div className="mb-4 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <h2 className="text-xl font-semibold">{getMonthName()}</h2>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium py-2 bg-red-50">
                  {day}
                </div>
              ))}

              {getDaysInMonth().map((day, i) => {
                const dayEvents = getEventsForDay(day)
                const isCurrentMonth = isSameMonth(day, new Date(currentYear, currentMonth))

                return (
                  <div
                    key={i}
                    className={`min-h-[100px] border p-1 ${
                      isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
                    } ${isSameDay(day, new Date()) ? "border-red-500 border-2" : "border-gray-200"}`}
                  >
                    <div className="text-right text-sm font-medium mb-1">{format(day, "d")}</div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded truncate cursor-pointer"
                          style={{ backgroundColor: event.color }}
                        >
                          <div className="flex items-center gap-1 text-white">
                            {getEventIcon(event.eventType)}
                            <span className="truncate">{event.title}</span>
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-center text-gray-500">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="rounded-md border border-red-100">
              <Table>
                <TableHeader className="bg-red-50">
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>
                            {formatDate(event.date)} at {event.time}
                          </TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                event.eventType === "birthday"
                                  ? "bg-orange-100 text-orange-700 border-orange-200"
                                  : event.eventType === "office"
                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                    : "bg-cyan-100 text-cyan-700 border-cyan-200"
                              }
                            >
                              {getEventIcon(event.eventType)}
                              <span className="ml-1">{event.eventType}</span>
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No events found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {isAdminOrCEO && (
            <TabsContent value="rsvp" className="mt-0">
              <div className="rounded-md border border-red-100">
                <Table>
                  <TableHeader className="bg-red-50">
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>RSVP Status</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length > 0 ? (
                      filteredEvents
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((event) => {
                          const rsvpCounts = getRsvpCounts(event)
                          const createdBy = agents.find((agent) => agent.username === event.createdBy)

                          return (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium">{event.title}</TableCell>
                              <TableCell>{formatDate(event.date)}</TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      Yes: {rsvpCounts.yes}
                                    </Badge>
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                      <ThumbsDown className="h-3 w-3 mr-1" />
                                      No: {rsvpCounts.no}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                      Maybe: {rsvpCounts.maybe}
                                    </Badge>
                                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                      Pending: {rsvpCounts.pending}
                                    </Badge>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{createdBy?.name || event.createdBy || "Unknown"}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => viewEventDetails(event)}
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                  >
                                    View RSVPs
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSendNotifications(event.id)}
                                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                  >
                                    Send Reminder
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No events found for the selected filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Event Modal */}
      <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Event" : "Add New Event"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update event details" : "Create a new event for the team calendar"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select
                value={eventType}
                onValueChange={(value) => setEventType(value as "birthday" | "office" | "event")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office Event</SelectItem>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="event">Other Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Event Title*</Label>
              <Input
                id="title"
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date*</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time*</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location*</Label>
              <Input
                id="location"
                placeholder="Enter event location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees</Label>
              <Select
                value={attendees.includes("all") ? "all" : "specific"}
                onValueChange={(value) => {
                  if (value === "all") {
                    setAttendees(["all"])
                  } else {
                    setAttendees([])
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select attendees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  <SelectItem value="specific">Specific Members</SelectItem>
                </SelectContent>
              </Select>

              {!attendees.includes("all") && (
                <div className="mt-2 space-y-2">
                  {agents.map((agent) => (
                    <div key={agent.username} className="flex items-center space-x-2">
                      <Checkbox
                        id={`attendee-${agent.username}`}
                        checked={attendees.includes(agent.username)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAttendees([...attendees, agent.username])
                          } else {
                            setAttendees(attendees.filter((a) => a !== agent.username))
                          }
                        }}
                      />
                      <Label htmlFor={`attendee-${agent.username}`}>{agent.name}</Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-emails">Additional Email Recipients (comma separated)</Label>
              <Input
                id="custom-emails"
                placeholder="email1@example.com, email2@example.com"
                value={customEmails}
                onChange={(e) => setCustomEmails(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-phones">Additional Phone Numbers (comma separated)</Label>
              <Input
                id="custom-phones"
                placeholder="555-123-4567, 555-987-6543"
                value={customPhoneNumbers}
                onChange={(e) => setCustomPhoneNumbers(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {addSuccess && (
              <Alert className="border-green-500 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {isEditMode ? "Event updated successfully!" : "Event added successfully!"}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddEventModal(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEvent} className="bg-red-600 hover:bg-red-700">
              {isEditMode ? "Update Event" : "Add Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Modal */}
      <Dialog open={showEventDetailsModal} onOpenChange={setShowEventDetailsModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEvent?.eventType === "birthday" && <Cake className="h-5 w-5 text-orange-500" />}
              {selectedEvent?.eventType === "office" && <Building className="h-5 w-5 text-emerald-500" />}
              {selectedEvent?.eventType === "event" && <Calendar className="h-5 w-5 text-cyan-500" />}
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription>
              {formatDate(selectedEvent?.date || "")} at {selectedEvent?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm">{selectedEvent?.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Location</h4>
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  {selectedEvent?.location}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Organizer</h4>
                <p className="text-sm">
                  {agents.find((a) => a.username === selectedEvent?.organizer)?.name || selectedEvent?.organizer}
                </p>
              </div>
            </div>

            {isAdminOrCEO && selectedEvent?.rsvpStatus && (
              <div>
                <h4 className="text-sm font-medium mb-2">RSVP Status</h4>
                <div className="border rounded-md">
                  <ScrollArea className="h-[200px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {agents.map((agent) => {
                          const status = selectedEvent.rsvpStatus?.[agent.username] || "pending"
                          return (
                            <TableRow key={agent.username}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  {agent.name}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    status === "yes"
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : status === "no"
                                        ? "bg-red-100 text-red-700 border-red-200"
                                        : status === "maybe"
                                          ? "bg-amber-100 text-amber-700 border-amber-200"
                                          : "bg-gray-100 text-gray-700 border-gray-200"
                                  }
                                >
                                  {status === "yes" && <ThumbsUp className="h-3 w-3 mr-1" />}
                                  {status === "no" && <ThumbsDown className="h-3 w-3 mr-1" />}
                                  {status === "maybe" && <Info className="h-3 w-3 mr-1" />}
                                  {status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {canModifyCalendar && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEventDetailsModal(false)
                      handleEditEvent(selectedEvent!)
                    }}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEventDetailsModal(false)
                      handleDeleteEvent(selectedEvent!.id)
                    }}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEventDetailsModal(false)
                  handleRsvp(selectedEvent!)
                }}
              >
                RSVP
              </Button>
              <Button onClick={() => setShowEventDetailsModal(false)}>Close</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RSVP Modal */}
      <Dialog open={showRsvpModal} onOpenChange={setShowRsvpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>RSVP to Event</DialogTitle>
            <DialogDescription>
              {selectedEvent?.title} on {formatDate(selectedEvent?.date || "")} at {selectedEvent?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Will you attend?</Label>
              <RadioGroup value={rsvpStatus} onValueChange={(value) => setRsvpStatus(value as "yes" | "no" | "maybe")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2 text-green-600" />
                    Yes, I'll attend
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="flex items-center">
                    <ThumbsDown className="h-4 w-4 mr-2 text-red-600" />
                    No, I can't attend
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maybe" id="maybe" />
                  <Label htmlFor="maybe" className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-amber-600" />
                    Maybe / Not sure yet
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rsvp-comment">Comment (optional)</Label>
              <Textarea
                id="rsvp-comment"
                placeholder="Add any comments or questions about the event"
                value={rsvpComment}
                onChange={(e) => setRsvpComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRsvpModal(false)}>
              Cancel
            </Button>
            <Button onClick={submitRsvp} className="bg-red-600 hover:bg-red-700">
              Submit RSVP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Notification Modal */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>Send a notification to all attendees of this event</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notification-type">Notification Type</Label>
              <Select
                value={notificationType}
                onValueChange={(value) => setNotificationType(value as "initial" | "dayBefore" | "thirtyMinBefore")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Initial Announcement</SelectItem>
                  <SelectItem value="dayBefore">24 Hour Reminder</SelectItem>
                  <SelectItem value="thirtyMinBefore">30 Minute Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notification-message">Message</Label>
              <Textarea
                id="notification-message"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="send-email" defaultChecked />
              <Label htmlFor="send-email">Send via Email</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="send-sms" defaultChecked />
              <Label htmlFor="send-sms">Send via SMS</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotificationModal(false)}>
              Cancel
            </Button>
            <Button onClick={sendNotification} className="bg-red-600 hover:bg-red-700">
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
