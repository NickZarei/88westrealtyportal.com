"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  AlertCircle,
  MessageSquare,
  Send,
  Inbox,
  Archive,
  Phone,
  Plus,
  Search,
  Star,
  Trash2,
  Filter,
  Download,
  Mail,
  PaperclipIcon as PaperClip,
  X,
  RefreshCw,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { Agent } from "./team-portal"

interface Message {
  id: string
  sender: string
  recipients: string[]
  customRecipients?: string[]
  subject: string
  content: string
  timestamp: string
  read: boolean
  archived: boolean
  starred: boolean
  priority: "normal" | "high" | "urgent"
  category?: string
  attachments?: {
    id: string
    name: string
    size: string
    type: string
  }[]
  type: "email" | "sms"
}

// Message categories
const MESSAGE_CATEGORIES = [
  { id: "all", name: "All Messages" },
  { id: "management", name: "Management" },
  { id: "marketing", name: "Marketing" },
  { id: "sales", name: "Sales" },
  { id: "system", name: "System" },
  { id: "clients", name: "Clients" },
  { id: "other", name: "Other" },
]

interface CommunicationInboxProps {
  currentUser: Agent
  agents: Agent[]
  apiEndpoint?: string
}

export default function CommunicationInbox({
  currentUser,
  agents,
  apiEndpoint = "/api/messages",
}: CommunicationInboxProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("inbox")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [smsOpen, setSmsOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [recipients, setRecipients] = useState<string[]>([])
  const [customRecipients, setCustomRecipients] = useState("")
  const [smsMessage, setSmsMessage] = useState("")
  const [smsRecipients, setSmsRecipients] = useState<string[]>([])
  const [smsCustomRecipients, setSmsCustomRecipients] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [messagePriority, setMessagePriority] = useState<"normal" | "high" | "urgent">("normal")
  const [messageCategory, setMessageCategory] = useState<string | undefined>(undefined)
  const [selectedRecipientType, setSelectedRecipientType] = useState<"individual" | "role" | "team" | "all">(
    "individual",
  )
  const [attachments, setAttachments] = useState<File[]>([])
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
  const [replyMode, setReplyMode] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Fetch messages from API
  useEffect(() => {
    fetchMessages()
  }, [activeTab, activeCategory, currentUser, page])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      // In a real implementation, this would be an API call
      // const response = await fetch(`${apiEndpoint}?tab=${activeTab}&category=${activeCategory}&user=${currentUser.username}&page=${page}`)
      // const data = await response.json()

      // For demo purposes, simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Here we'd typically set the messages from the API response
      // setMessages(prev => page === 1 ? data.messages : [...prev, ...data.messages])
      // setHasMore(data.hasMore)

      // For demo, just set an empty array since there's no real backend
      setMessages([])
      setHasMore(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to fetch messages:", error)
    } finally {
      setLoading(false)
    }
  }

  // Refresh messages
  const refreshMessages = () => {
    setPage(1)
    fetchMessages()
  }

  // Filter messages based on search term
  const filteredMessages = messages.filter((message) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      message.subject?.toLowerCase().includes(searchLower) ||
      message.content?.toLowerCase().includes(searchLower) ||
      message.sender?.toLowerCase().includes(searchLower)
    )
  })

  // Handle message selection
  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)

    // Mark as read if not already
    if (!message.read) {
      // In a real app, we'd call an API to mark as read
      setMessages(messages.map((m) => (m.id === message.id ? { ...m, read: true } : m)))
    }
  }

  // Handle message actions
  const handleArchive = (id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, archived: true } : m)))

    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }

    toast({
      title: "Message archived",
      description: "The message has been moved to the archive.",
    })
  }

  const handleStar = (id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)))
  }

  const handleDelete = (id: string) => {
    setMessageToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (!messageToDelete) return

    setMessages(messages.filter((m) => m.id !== messageToDelete))

    if (selectedMessage?.id === messageToDelete) {
      setSelectedMessage(null)
    }

    setDeleteConfirmOpen(false)
    setMessageToDelete(null)

    toast({
      title: "Message deleted",
      description: "The message has been permanently deleted.",
    })
  }

  // Handle compose actions
  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !content.trim() || (recipients.length === 0 && !customRecipients.trim())) {
      setError("Please fill in all required fields")
      return
    }

    setSending(true)
    setError(null)

    try {
      // In a real app, we'd send the message via API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      })

      // Reset form
      setSubject("")
      setContent("")
      setRecipients([])
      setCustomRecipients("")
      setMessagePriority("normal")
      setMessageCategory(undefined)
      setAttachments([])
      setComposeOpen(false)
      setReplyMode(false)
    } catch (error) {
      setError("Failed to send message. Please try again.")
      console.error("Failed to send message:", error)
    } finally {
      setSending(false)
    }
  }

  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!smsMessage.trim() || (smsRecipients.length === 0 && !smsCustomRecipients.trim())) {
      setError("Please fill in all required fields")
      return
    }

    setSending(true)
    setError(null)

    try {
      // In a real app, we'd send the SMS via API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "SMS sent",
        description: "Your SMS has been sent successfully.",
      })

      // Reset form
      setSmsMessage("")
      setSmsRecipients([])
      setSmsCustomRecipients("")
      setSmsOpen(false)
    } catch (error) {
      setError("Failed to send SMS. Please try again.")
      console.error("Failed to send SMS:", error)
    } finally {
      setSending(false)
    }
  }

  // Handle reply
  const handleReply = () => {
    if (!selectedMessage) return

    setReplyMode(true)
    setComposeOpen(true)
    setSubject(`Re: ${selectedMessage.subject}`)
    setRecipients([selectedMessage.sender])
    setContent(
      `\n\n-------- Original Message --------\nFrom: ${selectedMessage.sender}\nDate: ${selectedMessage.timestamp}\nSubject: ${selectedMessage.subject}\n\n${selectedMessage.content}`,
    )
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Communication Center</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshMessages} className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSmsOpen(true)} className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">SMS</span>
          </Button>
          <Button onClick={() => setComposeOpen(true)} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Compose</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
        <Card className="md:col-span-1 h-full">
          <CardHeader className="p-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Messages</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveCategory("all")}>All Messages</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {MESSAGE_CATEGORIES.slice(1).map((category) => (
                    <DropdownMenuItem key={category.id} onClick={() => setActiveCategory(category.id)}>
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="inbox" className="flex items-center gap-1">
                  <Inbox className="h-4 w-4" />
                  <span>Inbox</span>
                </TabsTrigger>
                <TabsTrigger value="starred" className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>Starred</span>
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex items-center gap-1">
                  <Archive className="h-4 w-4" />
                  <span>Archive</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="inbox">{/* Inbox content */}</TabsContent>
              <TabsContent value="starred">{/* Starred content */}</TabsContent>
              <TabsContent value="archived">{/* Archived content */}</TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0 overflow-auto max-h-[calc(100vh-20rem)]">
            {loading ? (
              <div className="p-3 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-2 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMessages.length > 0 ? (
              <div className="divide-y">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 cursor-pointer hover:bg-muted transition-colors ${
                      selectedMessage?.id === message.id ? "bg-muted" : ""
                    } ${!message.read ? "font-medium" : ""}`}
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate">{message.sender}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {message.priority === "high" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                        {message.priority === "urgent" && <AlertCircle className="h-4 w-4 text-red-500" />}
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm truncate">{message.subject}</h4>
                      <div className="flex items-center">
                        {message.attachments && message.attachments.length > 0 && (
                          <PaperClip className="h-3 w-3 text-muted-foreground" />
                        )}
                        {message.starred && <Star className="h-3 w-3 text-amber-500 ml-1" />}
                        {!message.read && <div className="h-2 w-2 rounded-full bg-blue-500 ml-1" />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">{message.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">No messages</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "No messages match your search" : "Your inbox is empty"}
                </p>
              </div>
            )}
          </CardContent>
          {hasMore && (
            <CardFooter className="p-2 flex justify-center">
              <Button variant="ghost" size="sm" onClick={() => setPage((prev) => prev + 1)} disabled={loading}>
                Load more
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card className="md:col-span-3 h-full">
          {selectedMessage ? (
            <>
              <CardHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedMessage.subject}</CardTitle>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleStar(selectedMessage.id)}>
                            <Star
                              className={`h-4 w-4 ${selectedMessage.starred ? "fill-amber-500 text-amber-500" : ""}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{selectedMessage.starred ? "Remove star" : "Star message"}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleArchive(selectedMessage.id)}>
                            <Archive className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Archive</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(selectedMessage.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button variant="outline" size="sm" onClick={handleReply} className="ml-2">
                      Reply
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>{selectedMessage.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedMessage.sender}</p>
                      <p className="text-xs text-muted-foreground">
                        To: {selectedMessage.recipients.join(", ")}
                        {selectedMessage.customRecipients &&
                          selectedMessage.customRecipients.length > 0 &&
                          `, ${selectedMessage.customRecipients.join(", ")}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(selectedMessage.timestamp).toLocaleString()}
                  </div>
                </div>
                {selectedMessage.priority !== "normal" && (
                  <Badge variant={selectedMessage.priority === "urgent" ? "destructive" : "outline"} className="mt-2">
                    {selectedMessage.priority === "urgent" ? "Urgent" : "High Priority"}
                  </Badge>
                )}
                {selectedMessage.category && (
                  <Badge variant="outline" className="mt-2 ml-2">
                    {MESSAGE_CATEGORIES.find((c) => c.id === selectedMessage.category)?.name ||
                      selectedMessage.category}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="p-4">
                <div className="prose max-w-none">
                  {selectedMessage.content.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Attachments</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedMessage.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded-md">
                          <PaperClip className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">{attachment.size}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No message selected</h3>
                <p className="text-muted-foreground mb-4">Select a message from the list to view its contents</p>
                <Button onClick={() => setComposeOpen(true)}>Compose New Message</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{replyMode ? "Reply to Message" : "Compose New Message"}</DialogTitle>
            <DialogDescription>Fill in the details below to send your message</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleComposeSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Recipient Type</Label>
                <Select value={selectedRecipientType} onValueChange={(value) => setSelectedRecipientType(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Recipients</SelectItem>
                    <SelectItem value="role">By Role</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="all">All Agents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedRecipientType === "individual" && (
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.username} value={agent.username}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Or enter email addresses (comma separated)"
                    value={customRecipients}
                    onChange={(e) => setCustomRecipients(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Message subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={messagePriority} onValueChange={(value) => setMessagePriority(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={messageCategory || ""} onValueChange={setMessageCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MESSAGE_CATEGORIES.slice(1).map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  placeholder="Type your message here"
                  className="min-h-[200px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="flex items-center gap-2">
                  <Input type="file" multiple onChange={handleFileUpload} className="flex-1" />
                </div>

                {attachments.length > 0 && (
                  <div className="border rounded-md p-2 mt-2">
                    <p className="text-sm font-medium mb-2">Selected files:</p>
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <PaperClip className="h-4 w-4" />
                            <span>{file.name}</span>
                            <span className="text-xs text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setComposeOpen(false)
                  setReplyMode(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={sending}>
                {sending ? (
                  <>
                    <span className="mr-2">Sending</span>
                    <span className="animate-spin">...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* SMS Dialog */}
      <Dialog open={smsOpen} onOpenChange={setSmsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send SMS</DialogTitle>
            <DialogDescription>Send a text message to agents or clients</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSmsSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Recipients</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.username} value={agent.username}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Or enter phone numbers (comma separated)"
                  value={smsCustomRecipients}
                  onChange={(e) => setSmsCustomRecipients(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsMessage">Message</Label>
                <Textarea
                  id="smsMessage"
                  placeholder="Type your SMS message here"
                  className="min-h-[100px]"
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground text-right">{smsMessage.length}/160 characters</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setSmsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={sending}>
                {sending ? (
                  <>
                    <span className="mr-2">Sending</span>
                    <span className="animate-spin">...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send SMS
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
