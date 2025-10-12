import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LogOut, Plus, Car, Clock, DollarSign, MapPin, Users, ParkingSquare } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface ParkedCar {
  id: string;
  licensePlate: string;
  ownerName: string;
  ownerEmail: string;
  entryTime: string;
  location: string;
  duration: string;
  currentCost: number;
}

interface AdminDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

const initialCars: ParkedCar[] = [
  {
    id: "1",
    licensePlate: "ABC-1234",
    ownerName: "John Doe",
    ownerEmail: "john@example.com",
    entryTime: "2025-10-12 08:30",
    location: "A-23",
    duration: "9h 42m",
    currentCost: 58.20
  },
  {
    id: "2",
    licensePlate: "XYZ-5678",
    ownerName: "Jane Smith",
    ownerEmail: "jane@example.com",
    entryTime: "2025-10-12 14:20",
    location: "B-15",
    duration: "3h 52m",
    currentCost: 23.10
  },
  {
    id: "3",
    licensePlate: "DEF-9012",
    ownerName: "Bob Johnson",
    ownerEmail: "bob@example.com",
    entryTime: "2025-10-12 15:00",
    location: "C-08",
    duration: "3h 12m",
    currentCost: 19.20
  },
  {
    id: "4",
    licensePlate: "GHI-3456",
    ownerName: "Alice Williams",
    ownerEmail: "alice@example.com",
    entryTime: "2025-10-12 16:45",
    location: "A-17",
    duration: "1h 27m",
    currentCost: 8.70
  }
];

export function AdminDashboard({ userEmail, onLogout }: AdminDashboardProps) {
  const [parkedCars, setParkedCars] = useState<ParkedCar[]>(initialCars);
  const [selectedCar, setSelectedCar] = useState<ParkedCar | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCar, setNewCar] = useState({
    licensePlate: "",
    ownerName: "",
    ownerEmail: "",
    location: ""
  });

  const handleAddCar = () => {
    const car: ParkedCar = {
      id: String(Date.now()),
      licensePlate: newCar.licensePlate,
      ownerName: newCar.ownerName,
      ownerEmail: newCar.ownerEmail,
      entryTime: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }).replace(',', ''),
      location: newCar.location,
      duration: "0h 0m",
      currentCost: 0
    };
    setParkedCars([...parkedCars, car]);
    setIsAddDialogOpen(false);
    setNewCar({ licensePlate: "", ownerName: "", ownerEmail: "", location: "" });
  };

  const handleMarkAsExited = (carId: string) => {
    setParkedCars(parkedCars.filter(car => car.id !== carId));
    setSelectedCar(null);
  };

  const totalRevenue = parkedCars.reduce((sum, car) => sum + car.currentCost, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl">Overview</h1>
                <p className="text-sm text-muted-foreground mt-1">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" onClick={onLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-lg border-border/50 bg-card hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Currently Parked</CardDescription>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Car className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl sm:text-4xl">{parkedCars.length}</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">Active vehicles in lot</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-border/50 bg-card hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Current Revenue</CardDescription>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl sm:text-4xl">${totalRevenue.toFixed(2)}</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">Pending payments</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-border/50 bg-card hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Available Spots</CardDescription>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ParkingSquare className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl sm:text-4xl">{100 - parkedCars.length}</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">Out of 100 total spots</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Parked Cars List */}
          <Card className="shadow-lg border-border/50 bg-card">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
              <div>
                <CardTitle>Parked Cars</CardTitle>
                <CardDescription className="mt-1">Click on a car to view details</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    Register Car
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Register New Car</DialogTitle>
                    <DialogDescription>Enter the details of the car entering the parking lot</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="licensePlate">License Plate</Label>
                      <Input
                        id="licensePlate"
                        placeholder="ABC-1234"
                        value={newCar.licensePlate}
                        onChange={(e) => setNewCar({ ...newCar, licensePlate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input
                        id="ownerName"
                        placeholder="John Doe"
                        value={newCar.ownerName}
                        onChange={(e) => setNewCar({ ...newCar, ownerName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerEmail">Owner Email</Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        placeholder="john@example.com"
                        value={newCar.ownerEmail}
                        onChange={(e) => setNewCar({ ...newCar, ownerEmail: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Parking Location</Label>
                      <Input
                        id="location"
                        placeholder="A-23"
                        value={newCar.location}
                        onChange={(e) => setNewCar({ ...newCar, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddCar} className="bg-primary hover:bg-primary/90">Register Car</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {parkedCars.map((car) => (
                  <div
                    key={car.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCar?.id === car.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedCar(car)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Car className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{car.licensePlate}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{car.location}</p>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/30">{car.duration}</Badge>
                    </div>
                  </div>
                ))}
                {parkedCars.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Car className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No cars currently parked</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Car Details */}
          <Card className="shadow-lg border-border/50 bg-card">
            <CardHeader>
              <CardTitle>Car Details</CardTitle>
              <CardDescription>View and manage selected car</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCar ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/50 border border-border">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">License Plate</p>
                        <p className="font-medium mt-1">{selectedCar.licensePlate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/50 border border-border">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Owner</p>
                        <p className="font-medium mt-1">{selectedCar.ownerName}</p>
                        <p className="text-sm text-muted-foreground truncate">{selectedCar.ownerEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/50 border border-border">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Entry Time</p>
                        <p className="font-medium mt-1">{selectedCar.entryTime}</p>
                        <p className="text-sm text-muted-foreground">Duration: {selectedCar.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/50 border border-border">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Current Cost</p>
                        <p className="font-medium text-2xl mt-1">${selectedCar.currentCost.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={() => handleMarkAsExited(selectedCar.id)}
                  >
                    Mark as Exited
                  </Button>
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <Car className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Select a car to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}