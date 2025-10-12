import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { CreditCard, LogOut, TrendingUp, TrendingDown, Clock, Car, Plus, Trash2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface ParkingRecord {
  id: string;
  licensePlate: string;
  entryTime: string;
  exitTime: string | null;
  duration: string;
  cost: number;
  status: 'active' | 'completed';
}

interface UserCar {
  id: string;
  licensePlate: string;
  brand: string;
  color: string;
}

interface UserDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

const mockRecords: ParkingRecord[] = [
  {
    id: "1",
    licensePlate: "ABC-1234",
    entryTime: "2025-10-12 08:30",
    exitTime: "2025-10-12 12:45",
    duration: "4h 15m",
    cost: 25.50,
    status: 'completed'
  },
  {
    id: "2",
    licensePlate: "XYZ-5678",
    entryTime: "2025-10-11 14:20",
    exitTime: "2025-10-11 16:30",
    duration: "2h 10m",
    cost: 13.00,
    status: 'completed'
  },
  {
    id: "3",
    licensePlate: "ABC-1234",
    entryTime: "2025-10-10 09:00",
    exitTime: null,
    duration: "9h 30m",
    cost: 57.00,
    status: 'active'
  },
  {
    id: "4",
    licensePlate: "DEF-9012",
    entryTime: "2025-10-12 15:00",
    exitTime: null,
    duration: "3h 12m",
    cost: 19.20,
    status: 'active'
  },
  {
    id: "5",
    licensePlate: "ABC-1234",
    entryTime: "2025-10-08 07:45",
    exitTime: "2025-10-08 11:20",
    duration: "3h 35m",
    cost: 21.50,
    status: 'completed'
  }
];

export function UserDashboard({ userEmail, onLogout }: UserDashboardProps) {
  const [records, setRecords] = useState<ParkingRecord[]>(mockRecords);
  const [userCars, setUserCars] = useState<UserCar[]>([
    { id: "1", licensePlate: "ABC-1234", brand: "Toyota", color: "Blue" },
    { id: "2", licensePlate: "XYZ-5678", brand: "Honda", color: "Red" }
  ]);
  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);
  const [newCar, setNewCar] = useState({
    licensePlate: "",
    brand: "",
    color: ""
  });

  const totalBalance = records.reduce((sum, record) => sum + record.cost, 0);
  const unpaidBalance = records
    .filter(r => r.status === 'active')
    .reduce((sum, record) => sum + record.cost, 0);

  const getCurrentTime = () => {
    return new Date().toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '');
  };

  const handlePayRecord = (recordId: string) => {
    const currentTime = getCurrentTime();

    setRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === recordId
          ? {
              ...record,
              status: 'completed' as const,
              exitTime: currentTime
            }
          : record
      )
    );
  };

  const handlePayAll = () => {
    const currentTime = getCurrentTime();

    setRecords(prevRecords =>
      prevRecords.map(record =>
        record.status === 'active'
          ? {
              ...record,
              status: 'completed' as const,
              exitTime: currentTime
            }
          : record
      )
    );
  };

  const handleAddCar = () => {
    const car: UserCar = {
      id: String(Date.now()),
      licensePlate: newCar.licensePlate,
      brand: newCar.brand,
      color: newCar.color
    };
    setUserCars([...userCars, car]);
    setIsAddCarDialogOpen(false);
    setNewCar({ licensePlate: "", brand: "", color: "" });
  };

  const handleDeleteCar = (carId: string) => {
    setUserCars(userCars.filter(car => car.id !== carId));
  };

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
                <CardDescription>Total Balance</CardDescription>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl sm:text-4xl">${totalBalance.toFixed(2)}</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">All-time parking costs</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-border/50 bg-card hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Unpaid Balance</CardDescription>
                <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl sm:text-4xl text-destructive">${unpaidBalance.toFixed(2)}</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">Currently active sessions</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-border/50 bg-card hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Sessions</CardDescription>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl sm:text-4xl">{records.length}</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">Parking sessions recorded</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid: Cars and Records */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* User Cars Table */}
          <Card className="shadow-lg border-border/50 bg-card">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
              <div>
                <CardTitle>My Cars</CardTitle>
                <CardDescription className="mt-1">Manage your registered vehicles</CardDescription>
              </div>
              <Dialog open={isAddCarDialogOpen} onOpenChange={setIsAddCarDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    Add Car
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Register New Car</DialogTitle>
                    <DialogDescription>Add a new car to your account</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="carLicensePlate">License Plate</Label>
                      <Input
                        id="carLicensePlate"
                        placeholder="ABC-1234"
                        value={newCar.licensePlate}
                        onChange={(e) => setNewCar({ ...newCar, licensePlate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carBrand">Brand</Label>
                      <Input
                        id="carBrand"
                        placeholder="Toyota"
                        value={newCar.brand}
                        onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carColor">Color</Label>
                      <Input
                        id="carColor"
                        placeholder="Blue"
                        value={newCar.color}
                        onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddCar} className="bg-primary hover:bg-primary/90">Add Car</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="whitespace-nowrap">License Plate</TableHead>
                      <TableHead className="whitespace-nowrap">Brand</TableHead>
                      <TableHead className="whitespace-nowrap">Color</TableHead>
                      <TableHead className="whitespace-nowrap">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userCars.map((car) => (
                      <TableRow key={car.id} className="border-border/50">
                        <TableCell className="font-medium">{car.licensePlate}</TableCell>
                        <TableCell>{car.brand}</TableCell>
                        <TableCell>{car.color}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                            onClick={() => handleDeleteCar(car.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {userCars.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No cars registered yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card className="shadow-lg border-border/50 bg-card">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
            <div>
              <CardTitle>Parking Records</CardTitle>
              <CardDescription className="mt-1">View all your entry and exit records</CardDescription>
            </div>
            <Button
              className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90"
              onClick={handlePayAll}
              disabled={unpaidBalance === 0}
            >
              <CreditCard className="h-4 w-4" />
              Pay Now
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="whitespace-nowrap">License Plate</TableHead>
                    <TableHead className="whitespace-nowrap">Entry Time</TableHead>
                    <TableHead className="whitespace-nowrap">Exit Time</TableHead>
                    <TableHead className="whitespace-nowrap">Duration</TableHead>
                    <TableHead className="whitespace-nowrap">Cost</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id} className="border-border/50">
                      <TableCell className="font-medium">{record.licensePlate}</TableCell>
                      <TableCell className="text-muted-foreground">{record.entryTime}</TableCell>
                      <TableCell className="text-muted-foreground">{record.exitTime || '-'}</TableCell>
                      <TableCell>{record.duration}</TableCell>
                      <TableCell className="font-medium">${record.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={record.status === 'active' ? 'default' : 'secondary'}
                          className={record.status === 'active' ? 'bg-primary text-primary-foreground' : ''}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="default"
                          className="gap-1 bg-primary hover:bg-primary/90"
                          onClick={() => handlePayRecord(record.id)}
                          disabled={record.status === 'completed'}
                        >
                          <CreditCard className="h-3 w-3" />
                          {record.status === 'completed' ? 'Paid' : 'Pay'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}