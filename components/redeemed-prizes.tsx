"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gift, Upload, Plus, Edit, Trash, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Define interfaces
interface PointItem {
  title: string;
  description: string;
  points: number;
}

interface Prize {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  imageUrl: string;
  available: boolean;
  addedBy?: string;
  dateAdded?: string;
}

interface RedeemedPrize {
  id: string;
  prizeId: string;
  prizeName: string;
  pointsCost: number;
  redeemDate: string;
  status: "processing" | "shipped" | "delivered";
  estimatedDelivery?: string;
}

interface User {
  id: string;
  name: string;
  role: "user" | "manager" | "ceo" | "admin";
  points: number;
}

// Points data
const POINTS_DATA: PointItem[] = [
  {
    title: 'Client Satisfaction',
    description: '100 points for each 5-star Google review that mentions 88West.',
    points: 100,
  },
  {
    title: 'Participation in Office Activities',
    description: '100 points per attendance at office events.',
    points: 100,
  },
  {
    title: 'Video Content Creation about 88West',
    description: '200 points for creating video content promoting 88West and encouraging licensees to join.',
    points: 200,
  },
  {
    title: 'Recruitment Incentive – Realtor A (0–2 years exp)',
    description: '10,000 points for introducing a new licensee with under 2 years of experience who stays for 6+ months.',
    points: 10000,
  },
  {
    title: 'Recruitment Incentive – Realtor B (2+ years exp)',
    description: '20,000 points for introducing a new licensee with over 2 years of experience who stays for 6+ months.',
    points: 20000,
  },
  {
    title: 'Promotional & Community Engagement',
    description: '200 points for organizing a community event (seminar, webinar, etc.) that promotes 88West.',
    points: 200,
  },
];

export default function PointsSystem() {
  // Mock current user with role for demo purposes
  // In a real app, this would come from your auth system
  const [currentUser] = useState<User>({
    id: "user1",
    name: "Alex Thompson",
    role: "manager", // Change this to "user", "manager", "ceo", or "admin" to test different roles
    points: 15000
  });

  const [redeemedPrizes, setRedeemedPrizes] = useState<RedeemedPrize[]>([]);
  const [availablePrizes, setAvailablePrizes] = useState<Prize[]>([
    {
      id: "prize1",
      name: "88West Branded Water Bottle",
      description: "Stay hydrated with our stylish stainless steel water bottle",
      pointsCost: 2000,
      imageUrl: "/api/placeholder/200/200",
      available: true,
      addedBy: "Marketing Team",
      dateAdded: "2025-03-15"
    }
  ]);
  const [newPrizeImage, setNewPrizeImage] = useState<File | null>(null);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Check if user has permission to manage prizes
  const canManagePrizes = currentUser.role === "manager" || currentUser.role === "ceo" || currentUser.role === "admin";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPrizeImage(e.target.files[0]);
    }
  };

  const handleAddPrize = () => {
    // In a real app, this would upload the image and add the prize to the database
    const nameEl = document.getElementById("newPrizeName") as HTMLInputElement;
    const descEl = document.getElementById("newPrizeDesc") as HTMLTextAreaElement;
    const costEl = document.getElementById("newPrizeCost") as HTMLInputElement;
    
    if (!nameEl || !descEl || !costEl || !nameEl.value || !descEl.value || !costEl.value) {
      alert("Please fill in all required fields");
      return;
    }
    
    const newPrize: Prize = {
      id: `prize${availablePrizes.length + 1}`,
      name: nameEl.value,
      description: descEl.value,
      pointsCost: parseInt(costEl.value),
      imageUrl: newPrizeImage ? URL.createObjectURL(newPrizeImage) : "/api/placeholder/200/200",
      available: true,
      addedBy: `${currentUser.name} (${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)})`,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setAvailablePrizes([...availablePrizes, newPrize]);
    setNewPrizeImage(null);
    setShowAddDialog(false);
  };

  const handleEditPrize = () => {
    if (!editingPrize) return;
    
    const updatedPrizes = availablePrizes.map(prize => 
      prize.id === editingPrize.id ? editingPrize : prize
    );
    
    setAvailablePrizes(updatedPrizes);
    setEditingPrize(null);
    setShowEditDialog(false);
  };

  const handleDeletePrize = (id: string) => {
    if (confirm("Are you sure you want to remove this prize?")) {
      setAvailablePrizes(availablePrizes.filter(prize => prize.id !== id));
    }
  };

  const openEditDialog = (prize: Prize) => {
    setEditingPrize(prize);
    setShowEditDialog(true);
  };

  const handleRedeemPrize = (prize: Prize) => {
    if (currentUser.points < prize.pointsCost) return;
    
    // Add to redeemed prizes
    const redeemedPrize: RedeemedPrize = {
      id: `redeem${Date.now()}`,
      prizeId: prize.id,
      prizeName: prize.name,
      pointsCost: prize.pointsCost,
      redeemDate: new Date().toISOString().split('T')[0],
      status: "processing",
      estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setRedeemedPrizes([...redeemedPrizes, redeemedPrize]);
    
    // In a real app, you would also update the user's points
    // Here we're just showing how the UI would work
    alert(`You have successfully redeemed "${prize.name}" for ${prize.pointsCost} points!`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-red-700">88West Rewards Program</h1>
          {canManagePrizes && (
            <p className="text-sm text-gray-500 mt-1">
              Logged in as: {currentUser.name} ({currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)})
            </p>
          )}
        </div>
        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
          <p className="text-gray-700">Your current points: <span className="font-bold text-red-600">{currentUser.points}</span></p>
        </div>
      </div>

      <Tabs defaultValue="earn">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="earn">Earn Points</TabsTrigger>
          <TabsTrigger value="prizes">Redeem Prizes</TabsTrigger>
          <TabsTrigger value="redeemed">My Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="earn">
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Ways to Earn Points</h2>
            <ul className="space-y-4">
              {POINTS_DATA.map((item, index) => (
                <li key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <h3 className="text-lg font-semibold text-red-600">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                  <span className="text-sm text-gray-500 font-medium">Points: {item.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="prizes">
          {canManagePrizes && (
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add New Prize
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePrizes.map((prize) => (
              <Card key={prize.id} className="overflow-hidden">
                <div className="h-48 relative">
                  <img 
                    src={prize.imageUrl} 
                    alt={prize.name} 
                    className="w-full h-full object-cover"
                  />
                  {canManagePrizes && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 bg-white bg-opacity-80 hover:bg-white"
                        onClick={() => openEditDialog(prize)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 bg-white bg-opacity-80 hover:bg-white hover:bg-opacity-100"
                        onClick={() => handleDeletePrize(prize.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{prize.name}</CardTitle>
                  <CardDescription>{prize.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-red-600">{prize.pointsCost} points</span>
                    <Button 
                      disabled={currentUser.points < prize.pointsCost} 
                      variant={currentUser.points >= prize.pointsCost ? "default" : "outline"}
                      onClick={() => handleRedeemPrize(prize)}
                    >
                      {currentUser.points >= prize.pointsCost ? "Redeem" : "Not enough points"}
                    </Button>
                  </div>
                  {canManagePrizes && (
                    <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                      <p>Added by: {prize.addedBy || "Unknown"}</p>
                      <p>Date added: {prize.dateAdded || "Unknown"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {!canManagePrizes && availablePrizes.length === 0 && (
            <div className="p-8 text-center bg-gray-50 rounded-lg border">
              <Gift className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">No prizes available yet</h3>
              <p className="text-gray-500">Check back later for exciting rewards!</p>
            </div>
          )}

          {canManagePrizes && availablePrizes.length === 0 && (
            <div className="p-8 text-center bg-gray-50 rounded-lg border">
              <Gift className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">No prizes available yet</h3>
              <p className="text-gray-500 mb-4">Add rewards for your team members to redeem!</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add New Prize
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="redeemed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                My Redeemed Prizes
              </CardTitle>
              <CardDescription>Track the status of prizes you've redeemed</CardDescription>
            </CardHeader>
            <CardContent>
              {redeemedPrizes.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prize</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Redeemed On</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Est. Delivery</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {redeemedPrizes.map((prize) => (
                        <TableRow key={prize.id}>
                          <TableCell className="font-medium">{prize.prizeName}</TableCell>
                          <TableCell>{prize.pointsCost}</TableCell>
                          <TableCell>{prize.redeemDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                prize.status === "delivered"
                                  ? "success"
                                  : prize.status === "shipped"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {prize.status.charAt(0).toUpperCase() + prize.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{prize.estimatedDelivery || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Gift className="mx-auto h-12 w-12 opacity-20 mb-2" />
                  <p>You haven't redeemed any prizes yet.</p>
                  <p className="text-sm">Check out the Prizes tab to redeem your points for exciting rewards!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Prize Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Prize</DialogTitle>
            <DialogDescription>
              Create a new prize that can be redeemed with points.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
              {newPrizeImage ? (
                <div className="relative h-32 w-32 border rounded-md overflow-hidden">
                  <img 
                    src={URL.createObjectURL(newPrizeImage)} 
                    alt="New prize" 
                    className="h-full w-full object-cover" 
                  />
                </div>
              ) : (
                <div className="h-32 w-32 border rounded-md flex items-center justify-center bg-gray-100">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  id="prizeImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button variant="outline" onClick={() => document.getElementById('prizeImage')?.click()}>
                  {newPrizeImage ? "Change Image" : "Upload Image"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPrizeName">Prize Name*</Label>
              <Input id="newPrizeName" placeholder="Enter prize name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPrizeDesc">Description*</Label>
              <Textarea id="newPrizeDesc" placeholder="Enter prize description" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPrizeCost">Points Cost*</Label>
              <Input id="newPrizeCost" type="number" min="100" placeholder="1000" required />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="newPrizeAvailable" defaultChecked />
              <Label htmlFor="newPrizeAvailable">Available for redemption</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddPrize}>Add Prize</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Prize Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Prize</DialogTitle>
            <DialogDescription>
              Modify the details of this prize.
            </DialogDescription>
          </DialogHeader>
          {editingPrize && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-32 w-32 border rounded-md overflow-hidden">
                  <img 
                    src={editingPrize.imageUrl} 
                    alt={editingPrize.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <input
                    type="file"
                    id="editPrizeImage"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0] && editingPrize) {
                        setEditingPrize({
                          ...editingPrize,
                          imageUrl: URL.createObjectURL(e.target.files[0])
                        });
                      }
                    }}
                  />
                  <Button variant="outline" onClick={() => document.getElementById('editPrizeImage')?.click()}>
                    Change Image
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editPrizeName">Prize Name*</Label>
                <Input 
                  id="editPrizeName" 
                  value={editingPrize.name} 
                  onChange={(e) => setEditingPrize({...editingPrize, name: e.target.value})} 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editPrizeDesc">Description*</Label>
                <Textarea 
                  id="editPrizeDesc" 
                  value={editingPrize.description} 
                  onChange={(e) => setEditingPrize({...editingPrize, description: e.target.value})} 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editPrizeCost">Points Cost*</Label>
                <Input 
                  id="editPrizeCost" 
                  type="number" 
                  min="100" 
                  value={editingPrize.pointsCost} 
                  onChange={(e) => setEditingPrize({...editingPrize, pointsCost: parseInt(e.target.value)})} 
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="editPrizeAvailable" 
                  checked={editingPrize.available} 
                  onCheckedChange={(checked) => setEditingPrize({...editingPrize, available: checked})} 
                />
                <Label htmlFor="editPrizeAvailable">Available for redemption</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditPrize}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restricted Access Modal for non-authorized users trying to access admin features */}
      <Dialog 
        open={!canManagePrizes && showAddDialog} 
        onOpenChange={() => !canManagePrizes && setShowAddDialog(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Restricted</DialogTitle>
            <DialogDescription>
              Only managers, CEOs, and administrators can add or modify prizes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <Lock className="h-16 w-16 text-red-500 opacity-70" />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAddDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
