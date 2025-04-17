"use client"

import { TabsTrigger } from "@/components/ui/tabs"

import { TabsList } from "@/components/ui/tabs"

import { TabsContent } from "@/components/ui/tabs"

import { Tabs } from "@/components/ui/tabs"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, Mail, Phone } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Prizes from "./prizes"
import RedeemedPrizes from "./redeemed-prizes"
import CommunicationInbox from "./communication-inbox"
import TeamCalendar from "./team-calendar"
import MarketingMaterials from "./marketing-materials"
import Sidebar from "./sidebar"

const SHEET_URL = "YOUR_GOOGLE_SHEET_API_ENDPOINT" // Replace with your API endpoint




export interface Agent {
  name: string
  username: string
  password: string
  email: string
  phone: string
  role: string
  reviews: number
  events: number
  videos: number
  recruitsA: number
  recruitsB: number
  community: number
  approved: boolean
  activities: Activity[]
}

// Add this new interface for activities
export interface Activity {
  type: "review" | "event" | "video" | "recruitA" | "recruitB" | "community"
  date: string
  proof: string
  notes: string
  approved: boolean
  approvalDate?: string
  fileAttachment?: string
}

type AuthStep = "login" | "signup" | "forgot-password" | "verification" | "reset-password"
\
export default function TeamPort
| "signup" | "forgot-password" | "verification" | "reset-password"

export default function TeamPortal() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loggedInUser, setLoggedInUser] = useState<Agent | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [authStep, setAuthStep] = useState<AuthStep>("login")
  const [verificationCode, setVerificationCode] = useState("")
  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "phone">("email")
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [recoveryPhone, setRecoveryPhone] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [role, setRole] = useState<"agent" | "manager" | "CEO">("agent")
  const [activityType, setActivityType] = useState<Activity["type"]>("review")
  const [activityDate, setActivityDate] = useState("")
  const [activityProof, setActivityProof] = useState("")
  const [activityNotes, setActivityNotes] = useState("")
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [approvalCode, setApprovalCode] = useState("")
  const [approvalCodeError, setApprovalCodeError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileAttachmentName, setFileAttachmentName] = useState("")
  const [redeemedPrizes, setRedeemedPrizes] = useState<string[]>([])
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      setError(null)

  
      const data = await fetchAgentsData()
      setAgents(data)
    } catch (err) {
      console.error("Error fetching agents:", err)
      setError("Failed to load agent data. Using mock data instead.")
      // Fallback to mock data on error
      setAgents(MOCK_DATA)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if there's a logged-in user in localStorage
    const savedUser = localStorage.getItem("loggedInUser")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setLoggedInUser(parsedUser)
      } catch (e) {
        console.error("Error parsing saved user:", e)
        localStorage.removeItem("loggedInUser")
      }
    }
  }, [])

  const fetchAgentsData = async () => {
    try {


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API did not return JSON. Check your API endpoint.")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error in fetchAgentsData:", error)
      throw error
    }
  }

  const updateGoogleSheet = async (updatedAgents: Agent[]) => {
    try {
      setLoading(true)

      // If using placeholder URL, just simulate an API call
      if (SHEET_URL === "YOUR_GOOGLE_SHEET_API_ENDPOINT") {
        // Use a proper promise
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve()
          }, 500)
        })

        // Update the local state
        setAgents(updatedAgents)

        // Also update the logged-in user if needed
        if (loggedInUser) {
          const updatedUser = updatedAgents.find((agent) => agent.username === loggedInUser.username)
          if (updatedUser) {
            setLoggedInUser(updatedUser)
            // Update in localStorage too
            localStorage.setItem("loggedInUser", JSON.stringify(updatedUser))
          }
        }

        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 3000)
        return
      }

      const response = await fetch(SHEET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAgents),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
    } catch (err) {
      setError("Failed to update data. Please try again.")
      console.error("Error updating sheet:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    const user = agents.find((agent) => agent.username === username && agent.password === password)
    if (user) {
      setLoggedInUser(user)
      // Save user to localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(user))
      setUsername("")
      setPassword("")
    } else {
      setLoginError("Invalid username or password")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError(null)
    setApprovalCodeError(null)

    // Validate form
    if (password !== confirmPassword) {
      setSignupError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setSignupError("Password must be at least 8 characters")
      return
    }

    // Check if username or email already exists
    const existingUser = agents.find((agent) => agent.username === username || agent.email === email)

    if (existingUser) {
      setSignupError("Username or email already exists")
      return
    }

    // Validate approval code for manager/CEO roles
    if (role !== "agent") {
      // In a real app, you would validate this against a secure database
      // For demo purposes, we're using a simple hardcoded approval code
      if (approvalCode !== "MANAGER88West" && role === "manager") {
        setApprovalCodeError("Invalid manager approval code")
        return
      }

      if (approvalCode !== "CEO88West" && role === "CEO") {
        setApprovalCodeError("Invalid CEO approval code")
        return
      }
    }

    try {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create new user
      const newUser: Agent = {
        name,
        username,
        password,
        email,
        phone,
        role, // Use the selected role
        reviews: 0,
        events: 0,
        videos: 0,
        recruitsA: 0,
        recruitsB: 0,
        community: 0,
        approved: role === "agent", // Auto-approve agents, managers/CEOs need approval
        activities: [],
      }

      const updatedAgents = [...agents, newUser]
      setAgents(updatedAgents)

      // In a real app, you would save this to your backend
      if (SHEET_URL !== "YOUR_GOOGLE_SHEET_API_ENDPOINT") {
        await updateGoogleSheet(updatedAgents)
      }

      // Reset form and go to login
      setName("")
      setUsername("")
      setPassword("")
      setEmail("")
      setPhone("")
      setConfirmPassword("")
      setRole("agent")
      setApprovalCode("")
      setAuthStep("login")
    } catch (err) {
      setSignupError("Failed to create account. Please try again.")
      console.error("Error creating account:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    let userFound = false

    if (recoveryMethod === "email") {
      userFound = agents.some((agent) => agent.email === recoveryEmail)
    } else {
      userFound = agents.some((agent) => agent.phone === recoveryPhone)
    }

    if (!userFound) {
      setLoginError(`No account found with this ${recoveryMethod}`)
      return
    }

    try {
      setLoading(true)

      // Simulate sending verification code
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setVerificationSent(true)
      setAuthStep("verification")
    } catch (err) {
      setLoginError("Failed to send verification code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    try {
      setLoading(true)

      // Simulate verification (in a real app, you would verify against a code sent to email/phone)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, any 6-digit code works
      if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
        setLoginError("Invalid verification code. Please enter a 6-digit code.")
        setLoading(false)
        return
      }

      setAuthStep("reset-password")
    } catch (err) {
      setLoginError("Failed to verify code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    if (newPassword !== confirmNewPassword) {
      setLoginError("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setLoginError("Password must be at least 8 characters")
      return
    }

    try {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user and update password
      let userIndex = -1

      if (recoveryMethod === "email") {
        userIndex = agents.findIndex((agent) => agent.email === recoveryEmail)
      } else {
        userIndex = agents.findIndex((agent) => agent.phone === recoveryPhone)
      }

      if (userIndex >= 0) {
        const updatedAgents = [...agents]
        updatedAgents[userIndex] = {
          ...updatedAgents[userIndex],
          password: newPassword,
        }

        setAgents(updatedAgents)

        // In a real app, you would save this to your backend
        if (SHEET_URL !== "YOUR_GOOGLE_SHEET_API_ENDPOINT") {
          await updateGoogleSheet(updatedAgents)
        }
      }

      // Reset form and go to login
      setNewPassword("")
      setConfirmNewPassword("")
      setVerificationCode("")
      setRecoveryEmail("")
      setRecoveryPhone("")
      setVerificationSent(false)
      setAuthStep("login")
    } catch (err) {
      setLoginError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setLoggedInUser(null)
    // Remove user from localStorage
    localStorage.removeItem("loggedInUser")
    setActiveTab("dashboard")
  }

  const calculatePoints = (agent: Agent) => {
    return (
      agent.reviews * 100 +
      agent.events * 100 +
      agent.videos * 200 +
      agent.recruitsA * 10000 +
      agent.recruitsB * 20000 +
      agent.community * 200
    )
  }

  const updateAgent = (field: keyof Agent, value: string) => {
    if (!loggedInUser) return

    const updatedUser = { ...loggedInUser, [field]: Number.parseInt(value) || 0 }
    setLoggedInUser(updatedUser)

    const updatedAgents = agents.map((agent) => (agent.username === loggedInUser.username ? updatedUser : agent))

    setAgents(updatedAgents)
    updateGoogleSheet(updatedAgents)
  }

  const approveActivity = (index: number) => {
    if (!loggedInUser || (loggedInUser.role !== "manager" && loggedInUser.role !== "CEO")) return

    const updatedAgents = [...agents]
    updatedAgents[index].approved = true
    setAgents(updatedAgents)
    updateGoogleSheet(updatedAgents)
  }

  const approveUserActivity = (username: string, activityIndex: number) => {
    if (!loggedInUser || (loggedInUser.role !== "manager" && loggedInUser.role !== "CEO")) return

    const updatedAgents = [...agents]
    const userIndex = updatedAgents.findIndex((agent) => agent.username === username)

    if (userIndex >= 0 && updatedAgents[userIndex].activities[activityIndex]) {
      updatedAgents[userIndex].activities[activityIndex].approved = true
      updatedAgents[userIndex].activities[activityIndex].approvalDate = new Date().toISOString().split("T")[0]
      setAgents(updatedAgents)
      updateGoogleSheet(updatedAgents)
    }
  }

  // Add a function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setFileAttachmentName(e.target.files[0].name)
    }
  }

  const handleAddActivity = () => {
    if (!loggedInUser) return

    if (!activityDate || !activityType) {
      setError("Please provide at least a date and activity type")
      return
    }

    const newActivity: Activity = {
      type: activityType,
      date: activityDate,
      proof: activityProof,
      notes: activityNotes,
      approved: false,
      fileAttachment: fileAttachmentName,
    }

    // Update the user's activities
    const updatedUser = {
      ...loggedInUser,
      activities: [...loggedInUser.activities, newActivity],
    }

    // Update the count based on activity type
    switch (activityType) {
      case "review":
        updatedUser.reviews += 1
        break
      case "event":
        updatedUser.events += 1
        break
      case "video":
        updatedUser.videos += 1
        break
      case "recruitA":
        updatedUser.recruitsA += 1
        break
      case "recruitB":
        updatedUser.recruitsB += 1
        break
      case "community":
        updatedUser.community += 1
        break
    }

    setLoggedInUser(updatedUser)

    // Update the agents array
    const updatedAgents = agents.map((agent) => (agent.username === loggedInUser.username ? updatedUser : agent))

    setAgents(updatedAgents)
    updateGoogleSheet(updatedAgents)

    // Reset form and close modal
    setActivityType("review")
    setActivityDate("")
    setActivityProof("")
    setActivityNotes("")
    setFileAttachmentName("")
    setSelectedFile(null)
    setShowActivityModal(false)
  }

  // Add function to handle prize redemption
  const handleRedeemPrize = (prizeId: string) => {
    if (!loggedInUser) return

    // Add the prize ID to redeemed prizes
    setRedeemedPrizes([...redeemedPrizes, prizeId])

    // Simulate API call with proper promise handling
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // In a real app, you would handle the API response here
        resolve()
      }, 500)
    })
  }

  // Add this function after the handleRedeemPrize function
  const sendNotification = (message: string, recipients: string[], customNumbers?: string[]) => {
    // In a real app, this would send actual SMS notifications
    console.log(`Sending notification: ${message}`)
    console.log(`To team members: ${recipients.join(", ")}`)

    if (customNumbers && customNumbers.length > 0) {
      console.log(`To additional numbers: ${customNumbers.join(", ")}`)
    }

    // Show success alert
    setUpdateSuccess(true)
    setTimeout(() => setUpdateSuccess(false), 3000)

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })
  }

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/200x200"
  }

  if (loading && agents.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading team portal...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && agents.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={fetchAgents} className="w-full">
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!loggedInUser) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          {authStep === "login" && (
            <>
              <CardHeader className="text-center">
                <div className="relative w-40 h-20 mx-auto mb-4">
                  <img
                    src="/placeholder.svg?height=80&width=160"
                    alt="88West Realty"
                    className="object-contain w-full h-full"
                  />
                </div>
                <CardTitle className="text-2xl">88West Realty Team Portal</CardTitle>
                <CardDescription>Sign in to access your team dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Login
                  </Button>
                  <div className="flex flex-col space-y-2 pt-2">
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => setAuthStep("forgot-password")}
                      className="px-0"
                    >
                      Forgot your password?
                    </Button>
                    <div className="text-center text-sm">
                      Don't have an account?{" "}
                      <Button variant="link" type="button" onClick={() => setAuthStep("signup")} className="p-0">
                        Sign up
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {authStep === "signup" && (
            <>
              <CardHeader className="text-center">
                <div className="relative w-40 h-20 mx-auto mb-4">
                  <img
                    src="/placeholder.svg?height=80&width=160"
                    alt="88West Realty"
                    className="object-contain w-full h-full"
                  />
                </div>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Join the 88West Realty team</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={role}
                      onChange={(e) => setRole(e.target.value as "agent" | "manager" | "CEO")}
                      required
                    >
                      <option value="agent">Agent</option>
                      <option value="manager">Manager</option>
                      <option value="CEO">CEO</option>
                    </select>
                  </div>

                  {role !== "agent" && (
                    <div className="space-y-2">
                      <Label htmlFor="approval-code">Approval Code</Label>
                      <Input
                        id="approval-code"
                        type="text"
                        placeholder={`Enter ${role} approval code`}
                        value={approvalCode}
                        onChange={(e) => setApprovalCode(e.target.value)}
                        required
                      />
                      {approvalCodeError && <p className="text-sm text-red-500">{approvalCodeError}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {signupError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{signupError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sign Up
                  </Button>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Button variant="link" type="button" onClick={() => setAuthStep("login")} className="p-0">
                      Log in
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {authStep === "forgot-password" && (
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" onClick={() => setAuthStep("login")} className="absolute left-4">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="w-full">Recover Password</CardTitle>
                </div>
                <CardDescription>Choose how to receive your verification code</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <RadioGroup
                    value={recoveryMethod}
                    onValueChange={(value) => setRecoveryMethod(value as "email" | "phone")}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone" className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Text Message
                      </Label>
                    </div>
                  </RadioGroup>

                  {recoveryMethod === "email" ? (
                    <div className="space-y-2">
                      <Label htmlFor="recovery-email">Email Address</Label>
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="recovery-phone">Phone Number</Label>
                      <Input
                        id="recovery-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={recoveryPhone}
                        onChange={(e) => setRecoveryPhone(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Send Verification Code
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {authStep === "verification" && (
            <Card>
              <CardHeader className="text-center">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAuthStep("forgot-password")}
                    className="absolute left-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="w-full">Enter Verification Code</CardTitle>
                </div>
                <CardDescription>
                  {recoveryMethod === "email"
                    ? `We've sent a code to ${recoveryEmail}`
                    : `We've sent a code to ${recoveryPhone}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <Input
                


Let's update the team-portal.tsx file to use the sidebar navigation and include the new marketing materials page:

```typescriptreact file="components/team-portal.tsx"
[v0-no-op-code-block-prefix]"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, LogOut, Award, CheckCircle, AlertCircle, ArrowLeft, Mail, Phone } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Prizes from "./prizes"
import RedeemedPrizes from "./redeemed-prizes"
import CommunicationInbox from "./communication-inbox"
import TeamCalendar from "./team-calendar"
import { Sidebar } from "./sidebar"
import { MarketingMaterials } from "./marketing-materials"

const SHEET_URL = "YOUR_GOOGLE_SHEET_API_ENDPOINT" // Replace with your API endpoint

// Add this mock data
const MOCK_DATA: Agent[] = [
  {
    name: "John Smith",
    username: "john",
    password: "password123",
    email: "john@example.com",
    phone: "555-123-4567",
    role: "agent",
    reviews: 5,
    events: 3,
    videos: 2,
    recruitsA: 1,
    recruitsB: 0,
    community: 4,
    approved: true,
    activities: [
      {
        type: "review",
        date: "2023-04-15",
        proof: "https://example.com/review1",
        notes: "Client: Sarah Johnson",
        approved: true,
        approvalDate: "2023-04-20",
        fileAttachment: "review_screenshot.jpg",
      },
      {
        type: "event",
        date: "2023-05-20",
        proof: "https://example.com/event1",
        notes: "Annual charity gala",
        approved: true,
        approvalDate: "2023-05-25",
        fileAttachment: "event_photo.jpg",
      },
    ],
  },
  {
    name: "Jane Doe",
    username: "jane",
    password: "password123",
    email: "jane@example.com",
    phone: "555-987-6543",
    role: "agent",
    reviews: 7,
    events: 2,
    videos: 4,
    recruitsA: 0,
    recruitsB: 1,
    community: 3,
    approved: false,
    activities: [
      {
        type: "video",
        date: "2023-06-10",
        proof: "https://example.com/video1",
        notes: "Property tour for 123 Main St",
        approved: false,
        fileAttachment: "property_video.mp4",
      },
    ],
  },
  {
    name: "Mike Johnson",
    username: "mike",
    password: "MANAGER88West",
    email: "mike@example.com",
    phone: "555-456-7890",
    role: "manager",
    reviews: 10,
    events: 5,
    videos: 3,
    recruitsA: 2,
    recruitsB: 1,
    community: 6,
    approved: true,
    activities: [],
  },
  {
    name: "Sarah Williams",
    username: "sarah",
    password: "CEO88West",
    email: "sarah@example.com",
    phone: "555-789-1234",
    role: "CEO",
    reviews: 12,
    events: 8,
    videos: 5,
    recruitsA: 3,
    recruitsB: 2,
    community: 10,
    approved: true,
    activities: [],
  },
]

export interface Agent {
  name: string
  username: string
  password: string
  email: string
  phone: string
  role: string
  reviews: number
  events: number
  videos: number
  recruitsA: number
  recruitsB: number
  community: number
  approved: boolean
  activities: Activity[]
}

// Add this new interface for activities
export interface Activity {
  type: "review" | "event" | "video" | "recruitA" | "recruitB" | "community"
  date: string
  proof: string
  notes: string
  approved: boolean
  approvalDate?: string
  fileAttachment?: string
}

type AuthStep = "login" | "signup" | "forgot-password" | "verification" | "reset-password"

export default function TeamPortal() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loggedInUser, setLoggedInUser] = useState<Agent | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [authStep, setAuthStep] = useState<AuthStep>("login")
  const [verificationCode, setVerificationCode] = useState("")
  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "phone">("email")
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [recoveryPhone, setRecoveryPhone] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [role, setRole] = useState<"agent" | "manager" | "CEO">("agent")
  const [activityType, setActivityType] = useState<Activity["type"]>("review")
  const [activityDate, setActivityDate] = useState("")
  const [activityProof, setActivityProof] = useState("")
  const [activityNotes, setActivityNotes] = useState("")
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [approvalCode, setApprovalCode] = useState("")
  const [approvalCodeError, setApprovalCodeError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileAttachmentName, setFileAttachmentName] = useState("")
  const [redeemedPrizes, setRedeemedPrizes] = useState<string[]>([])
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if we're using the placeholder URL
      if (SHEET_URL === "YOUR_GOOGLE_SHEET_API_ENDPOINT") {
        // Instead of console.warn, we'll just set the agents directly
        // This avoids the warning in the console
        setAgents(MOCK_DATA)
        return
      }

      const data = await fetchAgentsData()
      setAgents(data)
    } catch (err) {
      console.error("Error fetching agents:", err)
      setError("Failed to load agent data. Using mock data instead.")
      // Fallback to mock data on error
      setAgents(MOCK_DATA)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if there's a logged-in user in localStorage
    const savedUser = localStorage.getItem("loggedInUser")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setLoggedInUser(parsedUser)
      } catch (e) {
        console.error("Error parsing saved user:", e)
        localStorage.removeItem("loggedInUser")
      }
    }
  }, [])

  const fetchAgentsData = async () => {
    try {
      const response = await fetch(SHEET_URL)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API did not return JSON. Check your API endpoint.")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error in fetchAgentsData:", error)
      throw error
    }
  }

  const updateGoogleSheet = async (updatedAgents: Agent[]) => {
    try {
      setLoading(true)

      // If using placeholder URL, just simulate an API call
      if (SHEET_URL === "YOUR_GOOGLE_SHEET_API_ENDPOINT") {
        // Use a proper promise
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve()
          }, 500)
        })

        // Update the local state
        setAgents(updatedAgents)

        // Also update the logged-in user if needed
        if (loggedInUser) {
          const updatedUser = updatedAgents.find((agent) => agent.username === loggedInUser.username)
          if (updatedUser) {
            setLoggedInUser(updatedUser)
            // Update in localStorage too
            localStorage.setItem("loggedInUser", JSON.stringify(updatedUser))
          }
        }

        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 3000)
        return
      }

      const response = await fetch(SHEET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAgents),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
    } catch (err) {
      setError("Failed to update data. Please try again.")
      console.error("Error updating sheet:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    const user = agents.find((agent) => agent.username === username && agent.password === password)
    if (user) {
      setLoggedInUser(user)
      // Save user to localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(user))
      setUsername("")
      setPassword("")
    } else {
      setLoginError("Invalid username or password")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError(null)
    setApprovalCodeError(null)

    // Validate form
    if (password !== confirmPassword) {
      setSignupError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setSignupError("Password must be at least 8 characters")
      return
    }

    // Check if username or email already exists
    const existingUser = agents.find((agent) => agent.username === username || agent.email === email)

    if (existingUser) {
      setSignupError("Username or email already exists")
      return
    }

    // Validate approval code for manager/CEO roles
    if (role !== "agent") {
      // In a real app, you would validate this against a secure database
      // For demo purposes, we're using a simple hardcoded approval code
      if (approvalCode !== "MANAGER88West" && role === "manager") {
        setApprovalCodeError("Invalid manager approval code")
        return
      }

      if (approvalCode !== "CEO88West" && role === "CEO") {
        setApprovalCodeError("Invalid CEO approval code")
        return
      }
    }

    try {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create new user
      const newUser: Agent = {
        name,
        username,
        password,
        email,
        phone,
        role, // Use the selected role
        reviews: 0,
        events: 0,
        videos: 0,
        recruitsA: 0,
        recruitsB: 0,
        community: 0,
        approved: role === "agent", // Auto-approve agents, managers/CEOs need approval
        activities: [],
      }

      const updatedAgents = [...agents, newUser]
      setAgents(updatedAgents)

      // In a real app, you would save this to your backend
      if (SHEET_URL !== "YOUR_GOOGLE_SHEET_API_ENDPOINT") {
        await updateGoogleSheet(updatedAgents)
      }

      // Reset form and go to login
      setName("")
      setUsername("")
      setPassword("")
      setEmail("")
      setPhone("")
      setConfirmPassword("")
      setRole("agent")
      setApprovalCode("")
      setAuthStep("login")
    } catch (err) {
      setSignupError("Failed to create account. Please try again.")
      console.error("Error creating account:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    let userFound = false

    if (recoveryMethod === "email") {
      userFound = agents.some((agent) => agent.email === recoveryEmail)
    } else {
      userFound = agents.some((agent) => agent.phone === recoveryPhone)
    }

    if (!userFound) {
      setLoginError(`No account found with this ${recoveryMethod}`)
      return
    }

    try {
      setLoading(true)

      // Simulate sending verification code
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setVerificationSent(true)
      setAuthStep("verification")
    } catch (err) {
      setLoginError("Failed to send verification code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    try {
      setLoading(true)

      // Simulate verification (in a real app, you would verify against a code sent to email/phone)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, any 6-digit code works
      if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
        setLoginError("Invalid verification code. Please enter a 6-digit code.")
        setLoading(false)
        return
      }

      setAuthStep("reset-password")
    } catch (err) {
      setLoginError("Failed to verify code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    if (newPassword !== confirmNewPassword) {
      setLoginError("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setLoginError("Password must be at least 8 characters")
      return
    }

    try {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user and update password
      let userIndex = -1

      if (recoveryMethod === "email") {
        userIndex = agents.findIndex((agent) => agent.email === recoveryEmail)
      } else {
        userIndex = agents.findIndex((agent) => agent.phone === recoveryPhone)
      }

      if (userIndex >= 0) {
        const updatedAgents = [...agents]
        updatedAgents[userIndex] = {
          ...updatedAgents[userIndex],
          password: newPassword,
        }

        setAgents(updatedAgents)

        // In a real app, you would save this to your backend
        if (SHEET_URL !== "YOUR_GOOGLE_SHEET_API_ENDPOINT") {
          await updateGoogleSheet(updatedAgents)
        }
      }

      // Reset form and go to login
      setNewPassword("")
      setConfirmNewPassword("")
      setVerificationCode("")
      setRecoveryEmail("")
      setRecoveryPhone("")
      setVerificationSent(false)
      setAuthStep("login")
    } catch (err) {
      setLoginError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setLoggedInUser(null)
    // Remove user from localStorage
    localStorage.removeItem("loggedInUser")
    setActiveTab("dashboard")
  }

  const calculatePoints = (agent: Agent) => {
    return (
      agent.reviews * 100 +
      agent.events * 100 +
      agent.videos * 200 +
      agent.recruitsA * 10000 +
      agent.recruitsB * 20000 +
      agent.community * 200
    )
  }

  const updateAgent = (field: keyof Agent, value: string) => {
    if (!loggedInUser) return

    const updatedUser = { ...loggedInUser, [field]: Number.parseInt(value) || 0 }
    setLoggedInUser(updatedUser)

    const updatedAgents = agents.map((agent) => (agent.username === loggedInUser.username ? updatedUser : agent))

    setAgents(updatedAgents)
    updateGoogleSheet(updatedAgents)
  }

  const approveActivity = (index: number) => {
    if (!loggedInUser || (loggedInUser.role !== "manager" && loggedInUser.role !== "CEO")) return

    const updatedAgents = [...agents]
    updatedAgents[index].approved = true
    setAgents(updatedAgents)
    updateGoogleSheet(updatedAgents)
  }

  const approveUserActivity = (username: string, activityIndex: number) => {
    if (!loggedInUser || (loggedInUser.role !== "manager" && loggedInUser.role !== "CEO")) return

    const updatedAgents = [...agents]
    const userIndex = updatedAgents.findIndex((agent) => agent.username === username)

    if (userIndex >= 0 && updatedAgents[userIndex].activities[activityIndex]) {
      updatedAgents[userIndex].activities[activityIndex].approved = true
      updatedAgents[userIndex].activities[activityIndex].approvalDate = new Date().toISOString().split("T")[0]
      setAgents(updatedAgents)
      updateGoogleSheet(updatedAgents)
    }
  }

  // Add a function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setFileAttachmentName(e.target.files[0].name)
    }
  }

  const handleAddActivity = () => {
    if (!loggedInUser) return

    if (!activityDate || !activityType) {
      setError("Please provide at least a date and activity type")
      return
    }

    const newActivity: Activity = {
      type: activityType,
      date: activityDate,
      proof: activityProof,
      notes: activityNotes,
      approved: false,
      fileAttachment: fileAttachmentName,
    }

    // Update the user's activities
    const updatedUser = {
      ...loggedInUser,
      activities: [...loggedInUser.activities, newActivity],
    }

    // Update the count based on activity type
    switch (activityType) {
      case "review":
        updatedUser.reviews += 1
        break
      case "event":
        updatedUser.events += 1
        break
      case "video":
        updatedUser.videos += 1
        break
      case "recruitA":
        updatedUser.recruitsA += 1
        break
      case "recruitB":
        updatedUser.recruitsB += 1
        break
      case "community":
        updatedUser.community += 1
        break
    }

    setLoggedInUser(updatedUser)

    // Update the agents array
    const updatedAgents = agents.map((agent) => (agent.username === loggedInUser.username ? updatedUser : agent))

    setAgents(updatedAgents)
    updateGoogleSheet(updatedAgents)

    // Reset form and close modal
    setActivityType("review")
    setActivityDate("")
    setActivityProof("")
    setActivityNotes("")
    setFileAttachmentName("")
    setSelectedFile(null)
    setShowActivityModal(false)
  }

  // Add function to handle prize redemption
  const handleRedeemPrize = (prizeId: string) => {
    if (!loggedInUser) return

    // Add the prize ID to redeemed prizes
    setRedeemedPrizes([...redeemedPrizes, prizeId])

    // Simulate API call with proper promise handling
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // In a real app, you would handle the API response here
        resolve()
      }, 500)
    })
  }

  // Add this function after the handleRedeemPrize function
  const sendNotification = (message: string, recipients: string[], customNumbers?: string[]) => {
    // In a real app, this would send actual SMS notifications
    console.log(`Sending notification: ${message}`)
    console.log(`To team members: ${recipients.join(", ")}`)

    if (customNumbers && customNumbers.length > 0) {
      console.log(`To additional numbers: ${customNumbers.join(", ")}`)
    }

    // Show success alert
    setUpdateSuccess(true)
    setTimeout(() => setUpdateSuccess(false), 3000)

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })
  }

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/200x200"
  }

  if (loading && agents.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading team portal...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && agents.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={fetchAgents} className="w-full">
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!loggedInUser) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          {authStep === "login" && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">88West Realty Team Portal</CardTitle>
                <CardDescription>Sign in to access your team dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Login
                  </Button>
                  <div className="flex flex-col space-y-2 pt-2">
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => setAuthStep("forgot-password")}
                      className="px-0"
                    >
                      Forgot your password?
                    </Button>
                    <div className="text-center text-sm">
                      Don't have an account?{" "}
                      <Button variant="link" type="button" onClick={() => setAuthStep("signup")} className="p-0">
                        Sign up
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {authStep === "signup" && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Join the 88West Realty team</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={role}
                      onChange={(e) => setRole(e.target.value as "agent" | "manager" | "CEO")}
                      required
                    >
                      <option value="agent">Agent</option>
                      <option value="manager">Manager</option>
                      <option value="CEO">CEO</option>
                    </select>
                  </div>

                  {role !== "agent" && (
                    <div className="space-y-2">
                      <Label htmlFor="approval-code">Approval Code</Label>
                      <Input
                        id="approval-code"
                        type="text"
                        placeholder={`Enter ${role} approval code`}
                        value={approvalCode}
                        onChange={(e) => setApprovalCode(e.target.value)}
                        required
                      />
                      {approvalCodeError && <p className="text-sm text-red-500">{approvalCodeError}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {signupError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{signupError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sign Up
                  </Button>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Button variant="link" type="button" onClick={() => setAuthStep("login")} className="p-0">
                      Log in
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {authStep === "forgot-password" && (
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" onClick={() => setAuthStep("login")} className="absolute left-4">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="w-full">Recover Password</CardTitle>
                </div>
                <CardDescription>Choose how to receive your verification code</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <RadioGroup
                    value={recoveryMethod}
                    onValueChange={(value) => setRecoveryMethod(value as "email" | "phone")}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone" className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Text Message
                      </Label>
                    </div>
                  </RadioGroup>

                  {recoveryMethod === "email" ? (
                    <div className="space-y-2">
                      <Label htmlFor="recovery-email">Email Address</Label>
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="recovery-phone">Phone Number</Label>
                      <Input
                        id="recovery-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={recoveryPhone}
                        onChange={(e) => setRecoveryPhone(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Send Verification Code
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {authStep === "verification" && (
            <Card>
              <CardHeader className="text-center">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAuthStep("forgot-password")}
                    className="absolute left-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="w-full">Enter Verification Code</CardTitle>
                </div>
                <CardDescription>
                  {recoveryMethod === "email"
                    ? `We've sent a code to ${recoveryEmail}`
                    : `We've sent a code to ${recoveryPhone}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <Input
                      id="verification-code"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Verify Code
                  </Button>
                  <div className="text-center text-sm">
                    Didn't receive a code?{" "}
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => {
                        setVerificationSent(false)
                        setAuthStep("forgot-password")
                      }}
                      className="p-0"
                    >
                      Try again
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {authStep === "reset-password" && (
            <>
              <CardHeader className="text-center">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAuthStep("verification")}
                    className="absolute left-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="w-full">Reset Password</CardTitle>
                </div>
                <CardDescription>Create a new password for your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Reset Password
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    )
  }

return (
  <div className="min-h-screen bg-background">
    <Sidebar 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      loggedInUser={loggedInUser} 
      hasUnreadMessages={hasUnreadMessages}
      onLogout={handleLogout}
    />
    
    <div className="lg:pl-64">
      <div className="container mx-auto p-4 space-y-6">
        {/* Add this notification for the API configuration */}
        {SHEET_URL === "YOUR_GOOGLE_SHEET_API_ENDPOINT" && (
          <Alert className="my-4 border-amber-500 text-amber-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Using mock data. To connect to your real data, replace the SHEET_URL constant with your actual API endpoint.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {updateSuccess && (
          <Alert className="my-4 border-green-500 text-green-500">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Data updated successfully!</AlertDescription>
          </Alert>
        )}

        {activeTab === "dashboard" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Your Performance
              </CardTitle>
              <CardDescription>Track and update your activities to earn points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reviews">5-Star Reviews</Label>
                  <div className="flex items-center gap-2">
                    <Input id="reviews" type="number" value={loggedInUser.reviews} readOnly min="0" />
                    <Badge variant="outline">100 pts each</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="events">Office Events</Label>
                  <div className="flex items-center gap-2">
                    <Input id="events" type="number" value={loggedInUser.events} readOnly min="0" />
                    <Badge variant="outline">100 pts each</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videos">Videos</Label>
                  <div className="flex items-center gap-2">
                    <Input id="videos" type="number" value={loggedInUser.videos} readOnly min="0" />
                    <Badge variant="outline">200 pts each</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recruitsA">Recruited A</Label>
                  <div className="flex items-center gap-2">
                    <Input id="recruitsA" type="number" value={loggedInUser.recruitsA} readOnly min="0" />
                    <Badge variant="outline">10,000 pts each</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recruitsB">Recruited B</Label>
                  <div className="flex items-center gap-2">
                    <Input id="recruitsB" type="number" value={loggedInUser.recruitsB} readOnly min="0" />
                    <Badge variant="outline">20,000 pts each</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="community">Community Events</Label>
                  <div className="flex items-center gap-2">
                    <Input id="community" type="number" value={loggedInUser.community} readOnly min="0" />
                    <Badge variant="outline">200 pts each</Badge>
                  </div>
                </div>
              </div>

              {loggedInUser.role === "manager" && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Team Members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents
                      .filter((agent) => agent.role === "agent")
                      .map((agent) => (
                        <Card key={agent.username}>
                          <CardHeader>
                            <CardTitle>{agent.name}</CardTitle>
                            <CardDescription>Agent</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p>Email: {agent.email}</p>
                            <p>Phone: {agent.phone}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button onClick={() => alert(`Sending email to ${agent.email}`)}>Send Email</Button>
                            <Button onClick={() => alert(`Sending message to ${agent.phone}`)}>Send Message</Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Button onClick={() => setShowActivityModal(true)} className="w-full">
                  Add New Activity
                </Button>
              </div>

              {loggedInUser.activities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Your Activities</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="hidden md:table-cell">Proof</TableHead>
                          <TableHead className="hidden md:table-cell">File</TableHead>
                          <TableHead className="hidden md:table-cell">Notes</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loggedInUser.activities.map((activity, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {activity.type === "review" && "5-Star Review"}
                              {activity.type === "event" && "Office Event"}
                              {activity.type === "video" && "Video"}
                              {activity.type === "recruitA" && "Recruit A"}
                              {activity.type === "recruitB" && "Recruit B"}
                              {activity.type === "community" && "Community Event"}
                            </TableCell>
                            <TableCell>{activity.date}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {activity.proof ? (
                                <a
                                  href={
                                    activity.proof.startsWith("http") ? activity.proof : `https://${activity.proof}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  View Proof
                                </a>
                              ) : (
                                "None"
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {activity.fileAttachment ? (
                                <span className="text-blue-500">{activity.fileAttachment}</span>
                              ) : (
                                "None"
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{activity.notes || "None"}</TableCell>
                            <TableCell>
                              <Badge variant={activity.approved ? "success" : "secondary"}>
                                {activity.approved ? "Approved" : "Pending"}
                              </Badge>
                              {activity.approved && activity.approvalDate && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Approved: {activity.approvalDate}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-lg font-semibold">Your Total: {calculatePoints(loggedInUser)} points</div>
              <Badge variant={loggedInUser.approved ? "success" : "secondary"}>
                {loggedInUser.approved ? "Approved" : "Pending Approval"}
              </Badge>
            </CardFooter>
          </Card>
        )}

        {activeTab === "leaderboard" && (
          <Card>
            <CardHeader>
              <CardTitle>Team Leaderboard</CardTitle>
              <CardDescription>See how you compare with your teammates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Agent Name</TableHead>
                      <TableHead className="hidden md:table-cell">Reviews</TableHead>
                      <TableHead className="hidden md:table-cell">Events</TableHead>
                      <TableHead className="hidden md:table-cell">Videos</TableHead>
                      <TableHead className="hidden lg:table-cell">Recruits A</TableHead>
                      <TableHead className="hidden lg:table-cell">Recruits B</TableHead>
                      <TableHead className="hidden lg:table-cell">Community</TableHead>
                      <TableHead>Total Points</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...agents]
                      .sort((a, b) => calculatePoints(b) - calculatePoints(a))
                      .map((agent, index) => (
                        <TableRow key={index} className={agent.username === loggedInUser.username ? "bg-muted/50" : ""}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">
                            {agent.name}
                            {agent.username === loggedInUser.username && " (You)"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{agent.reviews}</TableCell>
                          <TableCell className="hidden md:table-cell">{agent.events}</TableCell>
                          <TableCell className="hidden md:table-cell">{agent.videos}</TableCell>
                          <TableCell className="hidden lg:table-cell">{agent.recruitsA}</TableCell>
                          <TableCell className="hidden lg:table-cell">{agent.recruitsB}</TableCell>
                          <TableCell className="hidden lg:table-cell">{agent.community}</TableCell>
                          <TableCell className="font-semibold">{calculatePoints(agent)}</TableCell>
                          <TableCell>
                            <Badge variant={agent.approved ? "success" : "secondary"}>
                              {agent.approved ? "Approved" : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "prizes" && (
          <>
            <Prizes userPoints={calculatePoints(loggedInUser)} onRedeemPrize={handleRedeemPrize} />
            <RedeemedPrizes userId={loggedInUser.username} />
          </>
        )}

        {activeTab === "communication" && (
          <CommunicationInbox currentUser={loggedInUser} agents={agents} />
        )}

        {activeTab === "calendar" && (
          <TeamCalendar currentUser={loggedInUser} agents={agents} onSendNotification={sendNotification} />
        )}

        {activeTab === "marketing" && (
          <MarketingMaterials currentUser={loggedInUser} agents={agents} />
        )}

        {activeTab === "approvals" && (loggedInUser.role === "manager" || loggedInUser.role === "CEO") && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Review and approve agent activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent Name</TableHead>
                      <TableHead>Activity Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent) =>
                      agent.activities
                        .filter((activity) => !activity.approved)
                        .map((activity, activityIndex) => (
                          <TableRow key={`${agent.username}-${activityIndex}`}>
                            <TableCell className="font-medium">{agent.name}</TableCell>
                            <TableCell>{activity.type}</TableCell>
                            <TableCell>{activity.date}</TableCell>
                            <TableCell>
                              {activity.proof ? (
                                <a
                                  href={
                                    activity.proof.startsWith("http") ? activity.proof : `https://${activity.proof}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  View
                                </a>
                              ) : (
                                "None"
                              )}
                            </TableCell>
                            <TableCell>
                              {activity.fileAttachment ? (
                                <span className="text-blue-500">{activity.fileAttachment}</span>
                              ) : (
                                "None"
                              )}
                            </TableCell>
                            <TableCell>{activity.notes}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => approveUserActivity(agent.username, activityIndex)}
                                disabled={loading}
                              >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        )),
                    )}
                    {agents.every((agent) => agent.activities.every((activity) => activity.approved)) && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No pending approvals
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>

    {/* Activity Modal */}
    {showActivityModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Add New Activity</CardTitle>
            <CardDescription>Record a new activity to earn points</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activity-type">Activity Type</Label>
                <select
                  id="activity-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as Activity["type"])}
                  required
                >
                  <option value="review">5-Star Review (100 pts)</option>
                  <option value="event">Office Event (100 pts)</option>
                  <option value="video">Video (200 pts)</option>
                  <option value="recruitA">Recruit A (10,000 pts)</option>
                  <option value="recruitB">Recruit B (20,000 pts)</option>
                  <option value="community">Community Event (200 pts)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-date">Date</Label>
                <Input
                  id="activity-date"
                  type="date"
                  value={activityDate}
                  onChange={(e) => setActivityDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-proof">Proof (URL)</Label>
                <Input
                  id="activity-proof"
                  type="url"
                  placeholder="https://example.com/proof"
                  value={activityProof}
                  onChange={(e) => setActivityProof(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-attachment">Attach File</Label>
                <Input id="file-attachment" type="file" onChange={handleFileChange} className="cursor-pointer" />
                {fileAttachmentName && (
                  <p className="text-xs text-green-600">File selected: {fileAttachmentName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-notes">Notes</Label>
                <Input
                  id="activity-notes"
                  placeholder="Additional details about this activity"
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setShowActivityModal(false)
                setFileAttachmentName("")
                setSelectedFile(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddActivity}>Submit Activity</Button>
          </CardFooter>
        </Card>
      </div>
    )}
  </div>
)
}
