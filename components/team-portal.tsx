"use client"
import { useState, useEffect, useRef } from "react"

import type React from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Award, CheckCircle, AlertCircle, ArrowLeft, Mail, Phone, Camera, UserCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Prizes from "./prizes"
import RedeemedPrizes from "./redeemed-prizes"
import CommunicationInbox from "./communication-inbox"
import TeamCalendar from "./team-calendar"
import { MarketingMaterials } from "./marketing-materials"
import { Sidebar } from "./sidebar"

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
  profilePicture?: string // Add profile picture URL field
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
  const [loggedInUser, setLoggedInUser] = useState(null as Agent | null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null as string | null)
  const [loginError, setLoginError] = useState(null as string | null)
  const [signupError, setSignupError] = useState(null as string | null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [authStep, setAuthStep] = useState("login" as AuthStep)
  const [verificationCode, setVerificationCode] = useState("")
  const [recoveryMethod, setRecoveryMethod] = useState("email" as "email" | "phone")
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [recoveryPhone, setRecoveryPhone] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [role, setRole] = useState("agent" as "agent" | "manager" | "CEO" | "admin")
  const [activityType, setActivityType] = useState("review" as Activity["type"])
  const [activityDate, setActivityDate] = useState("")
  const [activityProof, setActivityProof] = useState("")
  const [activityNotes, setActivityNotes] = useState("")
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [approvalCode, setApprovalCode] = useState("")
  const [approvalCodeError, setApprovalCodeError] = useState(null as string | null)
  const [selectedFile, setSelectedFile] = useState(null as File | null)
  const [fileAttachmentName, setFileAttachmentName] = useState("")
  const [redeemedPrizes, setRedeemedPrizes] = useState<string[]>([])
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const [profilePicture, setProfilePicture] = useState(null as string | null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check if there's a logged-in user in localStorage
    const savedUser = localStorage.getItem("loggedInUser")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setLoggedInUser(parsedUser)
        if (parsedUser.profilePicture) {
          setProfilePicture(parsedUser.profilePicture)
        }
      } catch (e) {
        console.error("Error parsing saved user:", e)
        localStorage.removeItem("loggedInUser")
      }
    }
  }, [])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      setError(null)

      // Initialize with empty data since we're not using an API
      setAgents([])
    } catch (err) {
      console.error("Error initializing agents:", err)
      setError("Failed to initialize agent data.")
      setAgents([])
    } finally {
      setLoading(false)
    }
  }

  const updateLocalData = async (updatedAgents: Agent[]) => {
    try {
      setLoading(true)

      // Use a proper promise to simulate async operation
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
    } catch (err) {
      setError("Failed to update data. Please try again.")
      console.error("Error updating data:", err)
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
      if (user.profilePicture) {
        setProfilePicture(user.profilePicture)
      }
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

      if (approvalCode !== "ADMIN88West" && role === "admin") {
        setApprovalCodeError("Invalid admin approval code")
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

      // Update local data
      await updateLocalData(updatedAgents)

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

        // Update local data
        await updateLocalData(updatedAgents)
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
    setProfilePicture(null)
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
    updateLocalData(updatedAgents)
  }

  const approveActivity = (index: number) => {
    if (
      !loggedInUser ||
      (loggedInUser.role !== "manager" && loggedInUser.role !== "CEO" && loggedInUser.role !== "admin")
    )
      return

    const updatedAgents = [...agents]
    updatedAgents[index].approved = true
    setAgents(updatedAgents)
    updateLocalData(updatedAgents)
  }

  const approveUserActivity = (username: string, activityIndex: number) => {
    if (
      !loggedInUser ||
      (loggedInUser.role !== "manager" && loggedInUser.role !== "CEO" && loggedInUser.role !== "admin")
    )
      return

    const updatedAgents = [...agents]
    const userIndex = updatedAgents.findIndex((agent) => agent.username === username)

    if (userIndex >= 0 && updatedAgents[userIndex].activities[activityIndex]) {
      updatedAgents[userIndex].activities[activityIndex].approved = true
      updatedAgents[userIndex].activities[activityIndex].approvalDate = new Date().toISOString().split("T")[0]
      setAgents(updatedAgents)
      updateLocalData(updatedAgents)
    }
  }

  // Add a function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setFileAttachmentName(e.target.files[0].name)
    }
  }

  // Add a function to handle profile picture upload
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfilePicture(base64String)

        // Update user profile picture in state and localStorage
        if (loggedInUser) {
          const updatedUser = { ...loggedInUser, profilePicture: base64String }
          setLoggedInUser(updatedUser)
          localStorage.setItem("loggedInUser", JSON.stringify(updatedUser))

          // Update in agents array
          const updatedAgents = agents.map((agent) => (agent.username === loggedInUser.username ? updatedUser : agent))
          setAgents(updatedAgents)
          updateLocalData(updatedAgents)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const triggerProfilePictureUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
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
    updateLocalData(updatedAgents)

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
  const sendNotification = (
    message: string,
    recipients: string[],
    customNumbers?: string[],
    customEmails?: string[],
    type?: string,
  ) => {
    // In a real app, this would send actual SMS and email notifications
    console.log(`Sending notification: ${message}`)
    console.log(`To team members: ${recipients.join(", ")}`)

    if (customNumbers && customNumbers.length > 0) {
      console.log(`To additional SMS numbers: ${customNumbers.join(", ")}`)
    }

    if (customEmails && customEmails.length > 0) {
      console.log(`To additional email addresses: ${customEmails.join(", ")}`)
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

  if (!loggedInUser) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-red-50 to-white">
        <Card className="w-full max-w-md border-red-200">
          {authStep === "login" && (
            <>
              <CardHeader className="text-center">
                <div className="relative w-40 h-20 mx-auto mb-4">
                  <img
                    src="/placeholder.svg?height=80&width=160&text=88West"
                    alt="88West Realty"
                    className="object-contain w-full h-full"
                  />
                </div>
                <CardTitle className="text-2xl text-red-600">88West Realty Team Portal</CardTitle>
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
                      className="border-red-100 focus-visible:ring-red-400"
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
                      className="border-red-100 focus-visible:ring-red-400"
                    />
                  </div>
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Login
                  </Button>
                  <div className="flex flex-col space-y-2 pt-2">
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => setAuthStep("forgot-password")}
                      className="px-0 text-red-600"
                    >
                      Forgot your password?
                    </Button>
                    <div className="text-center text-sm">
                      Don't have an account?{" "}
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => setAuthStep("signup")}
                        className="p-0 text-red-600"
                      >
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
                    src="/placeholder.svg?height=80&width=160&text=88West"
                    alt="88West Realty"
                    className="object-contain w-full h-full"
                  />
                </div>
                <CardTitle className="text-2xl text-red-600">Create an Account</CardTitle>
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
                      className="border-red-100 focus-visible:ring-red-400"
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
                      className="border-red-100 focus-visible:ring-red-400"
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
                      className="border-red-100 focus-visible:ring-red-400"
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
                      className="border-red-100 focus-visible:ring-red-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="flex h-10 w-full rounded-md border border-red-100 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={role}
                      onChange={(e) => setRole(e.target.value as "agent" | "manager" | "CEO" | "admin")}
                      required
                    >
                      <option value="agent">Agent</option>
                      <option value="manager">Manager</option>
                      <option value="CEO">CEO</option>
                      <option value="admin">Admin</option>
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
                        className="border-red-100 focus-visible:ring-red-400"
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
                      className="border-red-100 focus-visible:ring-red-400"
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
                      className="border-red-100 focus-visible:ring-red-400"
                    />
                  </div>
                  {signupError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{signupError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sign Up
                  </Button>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => setAuthStep("login")}
                      className="p-0 text-red-600"
                    >
                      Log in
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {authStep === "forgot-password" && (
            <Card className="w-full max-w-md border-red-200">
              <CardHeader className="text-center">
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" onClick={() => setAuthStep("login")} className="absolute left-4">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="w-full text-red-600">Recover Password</CardTitle>
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
                      <RadioGroupItem value="email" id="email" className="text-red-600" />
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" className="text-red-600" />
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
                        className="border-red-100 focus-visible:ring-red-400"
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
                        className="border-red-100 focus-visible:ring-red-400"
                      />
                    </div>
                  )}

                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Send Verification Code
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {authStep === "verification" && (
            <Card className="border-red-200">
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
                  <CardTitle className="w-full text-red-600">Enter Verification Code</CardTitle>
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
                      className="border-red-100 focus-visible:ring-red-400"
                    />
                  </div>
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
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
                      className="p-0 text-red-600"
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
                  <CardTitle className="w-full text-red-600">Reset Password</CardTitle>
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
                      className="border-red-100 focus-visible:ring-red-400"
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
                      className="border-red-100 focus-visible:ring-red-400"
                    />
                  </div>
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loggedInUser={loggedInUser}
        hasUnreadMessages={hasUnreadMessages}
        onLogout={handleLogout}
      />

      <div className="lg:pl-64">
        <div className="container mx-auto p-4 space-y-6">
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

          {/* User Profile Section with Profile Picture Upload */}
          <Card className="border-red-200 mb-6">
            <CardHeader className="bg-gradient-to-r from-red-100 to-white">
              <CardTitle className="text-red-600">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-6 py-6">
              <div className="relative">
                <div
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-100 bg-gray-100 flex items-center justify-center cursor-pointer"
                  onClick={triggerProfilePictureUpload}
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture || "/placeholder.svg"}
                      alt={loggedInUser?.name || "User"}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <UserCircle className="w-20 h-20 text-gray-400" />
                  )}
                </div>
                <div
                  className="absolute bottom-0 right-0 bg-red-600 rounded-full p-2 cursor-pointer shadow-md"
                  onClick={triggerProfilePictureUpload}
                >
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{loggedInUser.name}</h2>
                <p className="text-muted-foreground capitalize">{loggedInUser.role}</p>
                <div className="mt-2 space-y-1">
                  <p>
                    <span className="font-medium">Email:</span> {loggedInUser.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {loggedInUser.phone}
                  </p>
                  <p>
                    <span className="font-medium">Total Points:</span> {calculatePoints(loggedInUser)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {activeTab === "dashboard" && (
            <Card className="border-red-200">
              <CardHeader className="bg-gradient-to-r from-red-100 to-white">
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Award className="h-5 w-5 text-red-500" />
                  Your Performance
                </CardTitle>
                <CardDescription>Track and update your activities to earn points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reviews">5-Star Reviews</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="reviews"
                        type="number"
                        value={loggedInUser.reviews}
                        readOnly
                        min="0"
                        className="border-red-100"
                      />
                      <Badge variant="outline" className="border-red-200 text-red-600">
                        100 pts each
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="events">Office Events</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="events"
                        type="number"
                        value={loggedInUser.events}
                        readOnly
                        min="0"
                        className="border-red-100"
                      />
                      <Badge variant="outline" className="border-red-200 text-red-600">
                        100 pts each
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videos">Videos</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="videos"
                        type="number"
                        value={loggedInUser.videos}
                        readOnly
                        min="0"
                        className="border-red-100"
                      />
                      <Badge variant="outline" className="border-red-200 text-red-600">
                        200 pts each
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recruitsA">Recruited A</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="recruitsA"
                        type="number"
                        value={loggedInUser.recruitsA}
                        readOnly
                        min="0"
                        className="border-red-100"
                      />
                      <Badge variant="outline" className="border-red-200 text-red-600">
                        10,000 pts each
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recruitsB">Recruited B</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="recruitsB"
                        type="number"
                        value={loggedInUser.recruitsB}
                        readOnly
                        min="0"
                        className="border-red-100"
                      />
                      <Badge variant="outline" className="border-red-200 text-red-600">
                        20,000 pts each
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="community">Community Events</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="community"
                        type="number"
                        value={loggedInUser.community}
                        readOnly
                        min="0"
                        className="border-red-100"
                      />
                      <Badge variant="outline" className="border-red-200 text-red-600">
                        200 pts each
                      </Badge>
                    </div>
                  </div>
                </div>

                {(loggedInUser.role === "manager" || loggedInUser.role === "admin" || loggedInUser.role === "CEO") && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4 text-red-600">Team Members</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {agents
                        .filter((agent) => agent.role === "agent")
                        .map((agent) => (
                          <Card key={agent.username} className="border-red-100">
                            <CardHeader className="bg-gradient-to-r from-red-50 to-white">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-100 bg-gray-100 flex items-center justify-center">
                                  {agent.profilePicture ? (
                                    <img
                                      src={agent.profilePicture || "/placeholder.svg"}
                                      alt={agent.name}
                                      className="w-full h-full object-cover"
                                      onError={handleImageError}
                                    />
                                  ) : (
                                    <UserCircle className="w-8 h-8 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <CardTitle>{agent.name}</CardTitle>
                                  <CardDescription>Agent</CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p>Email: {agent.email}</p>
                              <p>Phone: {agent.phone}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button
                                onClick={() => alert(`Sending email to ${agent.email}`)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Send Email
                              </Button>
                              <Button
                                onClick={() => alert(`Sending message to ${agent.phone}`)}
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                Send Message
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <Button onClick={() => setShowActivityModal(true)} className="w-full bg-red-600 hover:bg-red-700">
                    Add New Activity
                  </Button>
                </div>

                {loggedInUser.activities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4 text-red-600">Your Activities</h3>
                    <div className="rounded-md border border-red-100">
                      <Table>
                        <TableHeader className="bg-red-50">
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
                                    className="text-red-600 hover:underline"
                                  >
                                    View Proof
                                  </a>
                                ) : (
                                  "None"
                                )}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {activity.fileAttachment ? (
                                  <span className="text-red-600">{activity.fileAttachment}</span>
                                ) : (
                                  "None"
                                )}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{activity.notes || "None"}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={activity.approved ? "success" : "secondary"}
                                  className={
                                    activity.approved
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-amber-100 text-amber-700 border-amber-200"
                                  }
                                >
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
              <CardFooter className="flex justify-between bg-gradient-to-r from-red-50 to-white">
                <div className="text-lg font-semibold text-red-600">
                  Your Total: {calculatePoints(loggedInUser)} points
                </div>
                <Badge
                  variant={loggedInUser.approved ? "success" : "secondary"}
                  className={
                    loggedInUser.approved
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-amber-100 text-amber-700 border-amber-200"
                  }
                >
                  {loggedInUser.approved ? "Approved" : "Pending Approval"}
                </Badge>
              </CardFooter>
            </Card>
          )}

          {activeTab === "leaderboard" && (
            <Card className="border-red-200">
              <CardHeader className="bg-gradient-to-r from-red-100 to-white">
                <CardTitle className="text-red-600">Team Leaderboard</CardTitle>
                <CardDescription>See how you compare with your teammates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-red-100">
                  <Table>
                    <TableHeader className="bg-red-50">
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Agent</TableHead>
                        <TableHead>Name</TableHead>
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
                          <TableRow key={index} className={agent.username === loggedInUser.username ? "bg-red-50" : ""}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-100 bg-gray-100 flex items-center justify-center">
                                {agent.profilePicture ? (
                                  <img
                                    src={agent.profilePicture || "/placeholder.svg"}
                                    alt={agent.name}
                                    className="w-full h-full object-cover"
                                    onError={handleImageError}
                                  />
                                ) : (
                                  <UserCircle className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                            </TableCell>
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
                              <Badge
                                variant={agent.approved ? "success" : "secondary"}
                                className={
                                  agent.approved
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-amber-100 text-amber-700 border-amber-200"
                                }
                              >
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

          {activeTab === "communication" && <CommunicationInbox currentUser={loggedInUser} agents={agents} />}

          {activeTab === "calendar" && (
            <TeamCalendar currentUser={loggedInUser} agents={agents} onSendNotification={sendNotification} />
          )}

          {activeTab === "marketing" && <MarketingMaterials currentUser={loggedInUser} agents={agents} />}

          {activeTab === "approvals" &&
            (loggedInUser.role === "manager" || loggedInUser.role === "CEO" || loggedInUser.role === "admin") && (
              <Card className="border-red-200">
                <CardHeader className="bg-gradient-to-r from-red-100 to-white">
                  <CardTitle className="text-red-600">Pending Approvals</CardTitle>
                  <CardDescription>Review and approve agent activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-red-100">
                    <Table>
                      <TableHeader className="bg-red-50">
                        <TableRow>
                          <TableHead>Agent</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Activity Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Proof</TableHead>
                          <TableHead>File</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {agents
                          .filter(
                            (agent) => agent.activities && agent.activities.some((activity) => !activity.approved),
                          )
                          .map((agent) =>
                            agent.activities
                              .filter((activity) => !activity.approved)
                              .map((activity, activityIndex) => (
                                <TableRow key={`${agent.username}-${activityIndex}`}>
                                  <TableCell>
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-red-100 bg-gray-100 flex items-center justify-center">
                                      {agent.profilePicture ? (
                                        <img
                                          src={agent.profilePicture || "/placeholder.svg"}
                                          alt={agent.name}
                                          className="w-full h-full object-cover"
                                          onError={handleImageError}
                                        />
                                      ) : (
                                        <UserCircle className="w-5 h-5 text-gray-400" />
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>{agent.name}</TableCell>
                                  <TableCell>
                                    {activity.type === "review" && "5-Star Review"}
                                    {activity.type === "event" && "Office Event"}
                                    {activity.type === "video" && "Video"}
                                    {activity.type === "recruitA" && "Recruit A"}
                                    {activity.type === "recruitB" && "Recruit B"}
                                    {activity.type === "community" && "Community Event"}
                                  </TableCell>
                                  <TableCell>{activity.date}</TableCell>
                                  <TableCell>
                                    {activity.proof ? (
                                      <a
                                        href={
                                          activity.proof.startsWith("http")
                                            ? activity.proof
                                            : `https://${activity.proof}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-red-600 hover:underline"
                                      >
                                        View Proof
                                      </a>
                                    ) : (
                                      "None"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {activity.fileAttachment ? (
                                      <span className="text-red-600">{activity.fileAttachment}</span>
                                    ) : (
                                      "None"
                                    )}
                                  </TableCell>
                                  <TableCell>{activity.notes || "None"}</TableCell>
                                  <TableCell>
                                    <Button
                                      onClick={() => approveUserActivity(agent.username, activityIndex)}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      size="sm"
                                    >
                                      Approve
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )),
                          )}
                        {agents.filter(
                          (agent) => agent.activities && agent.activities.some((activity) => !activity.approved),
                        ).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-4">
                              No pending activities to approve
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Activity Modal */}
          {showActivityModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md border-red-200">
                <CardHeader className="bg-gradient-to-r from-red-100 to-white">
                  <CardTitle className="text-red-600">Add New Activity</CardTitle>
                  <CardDescription>Record your achievements to earn points</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity-type">Activity Type</Label>
                    <select
                      id="activity-type"
                      className="flex h-10 w-full rounded-md border border-red-100 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value as Activity["type"])}
                      required
                    >
                      <option value="review">5-Star Review</option>
                      <option value="event">Office Event</option>
                      <option value="video">Video</option>
                      <option value="recruitA">Recruit A</option>
                      <option value="recruitB">Recruit B</option>
                      <option value="community">Community Event</option>
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
                      className="border-red-100 focus-visible:ring-red-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity-proof">Proof (URL)</Label>
                    <Input
                      id="activity-proof"
                      type="text"
                      placeholder="Link to review, event, video, etc."
                      value={activityProof}
                      onChange={(e) => setActivityProof(e.target.value)}
                      className="border-red-100 focus-visible:ring-red-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity-file">File Attachment</Label>
                    <Input
                      id="activity-file"
                      type="file"
                      onChange={handleFileChange}
                      className="border-red-100 focus-visible:ring-red-400"
                    />
                    {fileAttachmentName && <p className="text-sm text-muted-foreground">{fileAttachmentName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity-notes">Notes</Label>
                    <textarea
                      id="activity-notes"
                      placeholder="Additional information"
                      value={activityNotes}
                      onChange={(e) => setActivityNotes(e.target.value)}
                      className="flex min-h-[80px] w-full rounded-md border border-red-100 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setShowActivityModal(false)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddActivity} className="bg-red-600 hover:bg-red-700">
                    Add Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
