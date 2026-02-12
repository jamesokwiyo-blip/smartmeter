import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, User, History, CreditCard } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface Purchase {
  id: string;
  date: string;
  amount: number;
  kwh: number;
  meterNumber: string;
  token: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastPurchase, setLastPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));

    const savedPurchases = localStorage.getItem("purchases");
    if (savedPurchases) {
      setPurchases(JSON.parse(savedPurchases));
    }
  }, [navigate]);

  const generateToken = () => {
    return Math.random().toString().slice(2, 14);
  };

  const handlePurchase = (paymentMethod: string) => {
    if (!meterNumber || !amount) {
      toast.error("Please fill in meter number and amount");
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum < 100) {
      toast.error("Minimum purchase is 100 RWF");
      return;
    }

    const kwh = Math.floor(amountNum / 125);
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amount: amountNum,
      kwh,
      meterNumber,
      token: generateToken(),
    };

    const updatedPurchases = [newPurchase, ...purchases];
    setPurchases(updatedPurchases);
    localStorage.setItem("purchases", JSON.stringify(updatedPurchases));

    setLastPurchase(newPurchase);
    setShowSuccess(true);
    setMeterNumber("");
    setAmount("");

    toast.success(`Payment via ${paymentMethod} successful!`);
  };

  const kwh = amount ? Math.floor(parseFloat(amount) / 125) : 0;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user.fullName}!
            </h1>
            <p className="text-muted-foreground">
              Manage your electricity purchases and view your history
            </p>
          </div>

          {showSuccess && lastPurchase ? (
            /* Success Screen */
            <Card className="glass-card shadow-glow p-8 mb-8 text-center animate-fade-in">
              <div className="inline-flex p-4 rounded-full bg-secondary/20 mb-4">
                <Zap className="w-12 h-12 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-secondary">
                Purchase Successful!
              </h2>
              <div className="space-y-3 max-w-md mx-auto">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-bold">{lastPurchase.amount} RWF</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">kWh Sent:</span>
                  <span className="font-bold">{lastPurchase.kwh} kWh</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Meter Number:</span>
                  <span className="font-bold">{lastPurchase.meterNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Token:</span>
                  <span className="font-bold font-mono">{lastPurchase.token}</span>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Recharge Code:</p>
                  <p className="text-xl font-mono font-bold">
                    {lastPurchase.token.match(/.{1,4}/g)?.join("-")}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowSuccess(false)}
                className="mt-6 bg-gradient-primary hover:opacity-90"
                size="lg"
              >
                Make Another Purchase
              </Button>
            </Card>
          ) : (
            /* Purchase Form */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="glass-card shadow-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Buy Electricity</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="meterNumber">Meter Number</Label>
                    <Input
                      id="meterNumber"
                      placeholder="Enter your meter number"
                      value={meterNumber}
                      onChange={(e) => setMeterNumber(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (RWF)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {amount && (
                    <div className="p-4 bg-muted rounded-lg animate-fade-in">
                      <p className="text-sm text-muted-foreground mb-1">
                        You will receive:
                      </p>
                      <p className="text-3xl font-bold text-secondary">
                        {kwh} kWh
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rate: 125 RWF per kWh
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 pt-4">
                    <Label>Select Payment Method</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handlePurchase("MTN Mobile Money")}
                        variant="outline"
                        className="h-auto py-4"
                      >
                        <div className="text-center">
                          <div className="font-bold">MTN</div>
                          <div className="text-xs">Mobile Money</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => handlePurchase("Airtel Money")}
                        variant="outline"
                        className="h-auto py-4"
                      >
                        <div className="text-center">
                          <div className="font-bold">Airtel</div>
                          <div className="text-xs">Money</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => handlePurchase("Bank Transfer")}
                        variant="outline"
                        className="h-auto py-4"
                      >
                        <div className="text-center">
                          <div className="font-bold">Bank</div>
                          <div className="text-xs">Transfer</div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => handlePurchase("Card Payment")}
                        variant="outline"
                        className="h-auto py-4"
                      >
                        <div className="text-center">
                          <div className="font-bold">Card</div>
                          <div className="text-xs">Payment</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Profile Card */}
              <Card className="glass-card shadow-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Profile</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="text-lg font-medium">{user.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="text-lg font-medium">{user.phone}</p>
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Total Purchases
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {purchases.length}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold text-secondary">
                        {purchases.reduce((sum, p) => sum + p.amount, 0)} RWF
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Purchase History */}
          <Card className="glass-card shadow-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Purchase History</h2>
            </div>

            {purchases.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No purchases yet. Make your first purchase above!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Meter</th>
                      <th className="text-right py-3 px-2">Amount</th>
                      <th className="text-right py-3 px-2">kWh</th>
                      <th className="text-left py-3 px-2">Token</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => (
                      <tr key={purchase.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">
                          {new Date(purchase.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 font-mono">
                          {purchase.meterNumber}
                        </td>
                        <td className="py-3 px-2 text-right font-medium">
                          {purchase.amount} RWF
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-secondary">
                          {purchase.kwh} kWh
                        </td>
                        <td className="py-3 px-2 font-mono text-sm">
                          {purchase.token}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
