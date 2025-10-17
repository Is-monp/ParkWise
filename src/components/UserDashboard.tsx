import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import {
  CreditCard,
  LogOut,
  TrendingUp,
  TrendingDown,
  Clock,
  Car,
  Plus,
  Trash2,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface ParkingRecord {
  id: string;
  licensePlate: string;
  entryTime: string;
  exitTime: string | null;
  duration: string;
  cost: number;
  status: "active" | "completed";
  location: string;
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

export function UserDashboard({ userEmail, onLogout }: UserDashboardProps) {
  const [records, setRecords] = useState<ParkingRecord[]>([]);
  const [userCars, setUserCars] = useState<UserCar[]>([]);
  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);
  const [newCar, setNewCar] = useState({
    licensePlate: "",
    brand: "",
    color: "",
  });

  const totalBalance = records.reduce((sum, r) => sum + r.cost, 0);
  const unpaidBalance = records
    .filter((r) => r.status === "active")
    .reduce((sum, r) => sum + r.cost, 0);

  const getCurrentTime = () =>
    new Date()
      .toLocaleString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");

  // ✅ FETCH records from backend
  useEffect(() => {
    const fetchRecords = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8080/view/car/UserRegisters", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!data.registers) return;

        // 📦 Mapeamos los registros de parqueo
        const mappedRecords = data.registers.map((r: any) => {
          const entry = new Date(r.entryTime);
          const exit =
            r.exitTime && r.exitTime !== "0001-01-01T00:00:00Z"
              ? new Date(r.exitTime)
              : null;

          let duration = "-";
          if (exit) {
            const diff = Math.max(0, exit.getTime() - entry.getTime());
            const mins = Math.floor(diff / 60000);
            const hours = Math.floor(mins / 60);
            const rem = mins % 60;
            duration = `${hours}h ${rem}m`;
          }

          return {
            id: r._id,
            licensePlate: r.car?.placa || "Unknown",
            entryTime: entry.toLocaleString(),
            exitTime: exit ? exit.toLocaleString() : null,
            duration,
            cost: r.amount || 0,
            status: r.paid ? "completed" : "active",
            location: r.parkingLocation || "N/A",
          };
        });

        setRecords(mappedRecords);

        // 🚗 Extraemos los carros únicos de esos registros
        const uniqueCarsMap = new Map<string, UserCar>();
        for (const r of data.registers) {
          const c = r.car;
          if (c && !uniqueCarsMap.has(c._id)) {
            uniqueCarsMap.set(c._id, {
              id: c._id,
              licensePlate: c.placa,
              brand: c.marca,
              color: c.color,
            });
          }
        }

        setUserCars(Array.from(uniqueCarsMap.values()));
      } catch (err) {
        console.error("❌ Error fetching records:", err);
      }
    };

    fetchRecords();
  }, []);


  // 🧩 Add car to backend
  const handleAddCar = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ No token found. Please log in again.");
      return;
    }

    const payload = {
      Placa: newCar.licensePlate,
      Marca: newCar.brand,
      Color: newCar.color,
    };

    try {
      const response = await fetch("http://localhost:8080/new/car", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      if (!response.ok) {
        alert(`❌ Error registering car: ${text}`);
        return;
      }

      alert(`✅ ${text}`);

      const newCarEntry: UserCar = {
        id: String(Date.now()),
        licensePlate: newCar.licensePlate,
        brand: newCar.brand,
        color: newCar.color,
      };

      setUserCars((prev) => [...prev, newCarEntry]);
      setIsAddCarDialogOpen(false);
      setNewCar({ licensePlate: "", brand: "", color: "" });
    } catch (error) {
      console.error(error);
      alert("⚠️ Error connecting to backend.");
    }
  };

  const handleDeleteCar = (carId: string) =>
    setUserCars((prev) => prev.filter((c) => c.id !== carId));

  const handlePayRecord = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "completed", exitTime: getCurrentTime() } : r
      )
    );
  };

  const handlePayAll = () => {
    const time = getCurrentTime();
    setRecords((prev) =>
      prev.map((r) =>
        r.status === "active" ? { ...r, status: "completed", exitTime: time } : r
      )
    );
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