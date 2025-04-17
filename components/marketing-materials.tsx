"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  AlertCircle,
  Search,
  Download,
  LinkIcon,
  Upload,
  ImageIcon,
  FileText,
  Video,
  Layout,
  Share2,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import type { Agent } from "./team-portal"

interface MarketingMaterial {
  id: string
  title: string
  description: string
  category: "logo" | "flyer" | "social" | "video" | "template"
  fileUrl: string
  thumbnailUrl: string
  uploadedBy: string
  uploadDate: string
  tags: string[]
}

// Sample marketing materials
const SAMPLE_MATERIALS: MarketingMaterial[] = [
  {
    id: "mat1",
    title: "88West Primary Logo",
    description: "Official primary logo for all marketing materials",
    category: "logo",
    fileUrl: "/placeholder.svg?height=200&width=400",
    thumbnailUrl: "/placeholder.svg?height=200&width=400",
    uploadedBy: "sarah",
    uploadDate: "2023-06-15",
    tags: ["logo", "branding", "official"],
  },
  {
    id: "mat2",
    title: "88West Secondary Logo",
    description: "Secondary logo for dark backgrounds",
    category: "logo",
    fileUrl: "/placeholder.svg?height=200&width=400",
    thumbnailUrl: "/placeholder.svg?height=200&width=400",
    uploadedBy: "sarah",
    uploadDate: "2023-06-15",
    tags: ["logo", "branding", "dark"],
  },
  {
    id: "mat3",
    title: "New Listing Flyer Template",
    description: "Template for creating new property listing flyers",
    category: "flyer",
    fileUrl: "/placeholder.svg?height=600&width=400",
    thumbnailUrl: "/placeholder.svg?height=200&width=150",
    uploadedBy: "mike",
    uploadDate: "2023-07-10",
    tags: ["flyer", "template", "listing"],
  },
  {
    id: "mat4",
    title: "Social Media Post Template",
    description: "Instagram and Facebook post template for new listings",
    category: "social",
    fileUrl: "/placeholder.svg?height=400&width=400",
    thumbnailUrl: "/placeholder.svg?height=200&width=200",
    uploadedBy: "mike",
    uploadDate: "2023-07-12",
    tags: ["social", "instagram", "facebook"],
  },
  {
    id: "mat5",
    title: "Property Tour Video Template",
    description: "Intro and outro template for property tour videos",
    category: "video",
    fileUrl: "/placeholder.svg?height=300&width=500",
    thumbnailUrl: "/placeholder.svg?height=150&width=250",
    uploadedBy: "sarah",
    uploadDate: "2023-08-05",
    tags: ["video", "tour", "template"],
  },
  {
    id: "mat6",
    title: "Email Newsletter Template",
    description: "Monthly newsletter template for client communications",
    category: "template",
    fileUrl: "/placeholder.svg?height=800&width=600",
    thumbnailUrl: "/placeholder.svg?height=200&width=150",
    uploadedBy: "sarah",
    uploadDate: "2023-08-10",
    tags: ["email", "newsletter", "template"],
  },
]

interface MarketingMaterialsProps {
  currentUser: Agent
  agents: Agent[]
}

export const MarketingMaterials = ({ currentUser, agents }: MarketingMaterialsProps) => {
  const [materials, setMaterials] = useState<MarketingMaterial[]>(SAMPLE_MATERIALS)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<MarketingMaterial | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Form states for upload
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<MarketingMaterial["category"]>("logo")
  const [tags, setTags] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  // Check if user can upload or edit materials
  // Modified to include marketing department, admin, and CEO roles
  const canUpload = ["marketing", "admin", "CEO"].includes(currentUser.role)

  // Filter materials based on active category and search query
  const filteredMaterials = materials.filter((material) => {
    const matchesCategory = activeCategory === "all" || material.category === activeCategory
    const matchesSearch =
      searchQuery === "" ||
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle material upload
  const handleUpload = () => {
    if (!title || !description || !category || !selectedFile) {
      setError("Please fill in all required fields and select a file")
      return
    }

    // Create new material
    const newMaterial: MarketingMaterial = {
      id: `mat${Date.now()}`,
      title,
      description,
      category,
      fileUrl: filePreview || "/placeholder.svg?height=400&width=400",
      thumbnailUrl: filePreview || "/placeholder.svg?height=200&width=200",
      uploadedBy: currentUser.username,
      uploadDate: new Date().toISOString().split("T")[0],
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    }

    // Add material to state
    setMaterials([newMaterial, ...materials])

    // Show success message and reset form
    setUploadSuccess(true)
    setTimeout(() => {
      setUploadSuccess(false)
      setShowUploadModal(false)
      resetUploadForm()
    }, 2000)
  }

  // Reset upload form
  const resetUploadForm = () => {
    setTitle("")
    setDescription("")
    setCategory("logo")
    setTags("")
    setSelectedFile(null)
    setFilePreview(null)
    setError(null)
  }

  // Handle copy link to clipboard
  const handleCopyLink = (materialId: string) => {
    const link = `https://88west.com/materials/${materialId}`
    navigator.clipboard.writeText(link)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "logo":
        return <ImageIcon className="h-5 w-5" />
      case "flyer":
        return <FileText className="h-5 w-5" />
      case "social":
        return <Share2 className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "template":
        return <Layout className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="h-6 w-6" />
            Marketing Materials
          </h2>
          <p className="text-muted-foreground">
            {canUpload 
              ? "Access, share, and manage official marketing assets" 
              : "Access and download official marketing assets"}
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {canUpload && (
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="logo">Logos</TabsTrigger>
          <TabsTrigger value="flyer">Flyers</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="template">Templates</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                <img
                  src={material.thumbnailUrl || "/placeholder.svg"}
                  alt={material.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                  }}
                />
                <Badge className="absolute top-2 right-2 bg-background/80 text-foreground">
                  {material.category.charAt(0).toUpperCase() + material.category.slice(1)}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(material.category)}
                  <CardTitle className="text-base">{material.title}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2">{material.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-1">
                  {material.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Uploaded by{" "}
                  {agents.find((agent) => agent.username === material.uploadedBy)?.name || material.uploadedBy} on{" "}
                  {material.uploadDate}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="outline" size="sm" onClick={() => window.open(material.fileUrl, "_blank")}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                {/* Only show share option for users who can upload */}
                {canUpload ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMaterial(material)
                      setShowShareModal(true)
                    }}
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    title="You don't have permission to edit this material"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="mx-auto h-12 w-12 opacity-20 mb-2" />
          <p>No materials found</p>
          {searchQuery && <p className="text-sm mt-2">Try adjusting your search or filters</p>}
        </div>
      )}

      {/* Upload Modal - Only visible for marketing, admin and CEO */}
      {showUploadModal && canUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Upload Marketing Material</CardTitle>
              <CardDescription>Share new marketing assets with your team</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title*</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter material title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description*</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter material description"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MarketingMaterial["category"])}
                    required
                  >
                    <option value="logo">Logo</option>
                    <option value="flyer">Flyer</option>
                    <option value="social">Social Media</option>
                    <option value="video">Video</option>
                    <option value="template">Template</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="branding, official, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">File*</Label>
                  <Input id="file" type="file" onChange={handleFileChange} className="cursor-pointer" required />
                </div>

                {filePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      <img
                        src={filePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {uploadSuccess && (
                  <Alert className="border-green-500 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Material uploaded successfully!</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadModal(false)
                  resetUploadForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={uploadSuccess}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Share Modal - Only available for marketing, admin and CEO */}
      {showShareModal && selectedMaterial && canUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Share {selectedMaterial.title}</CardTitle>
              <CardDescription>Copy the link to share this material</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="share-link">Direct Link</Label>
                <div className="flex gap-2">
                  <Input id="share-link" value={`https://88west.com/materials/${selectedMaterial.id}`} readOnly />
                  <Button
                    variant="outline"
                    onClick={() => handleCopyLink(selectedMaterial.id)}
                    className={copySuccess ? "bg-green-50 text-green-700 border-green-200" : ""}
                  >
                    {copySuccess ? <CheckCircle className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <img
                    src={selectedMaterial.thumbnailUrl || "/placeholder.svg"}
                    alt={selectedMaterial.title}
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowShareModal(false)
                  setSelectedMaterial(null)
                  setCopySuccess(false)
                }}
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
