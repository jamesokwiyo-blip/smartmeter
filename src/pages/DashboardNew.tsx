import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, LogOut, User, CreditCard, History, Copy, Check, Smartphone, Wallet, Building2, X, ArrowRight, TrendingUp, Clock, Shield, Battery, BatteryCharging, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Camera, Upload } from "lucide-react";
import { purchasesAPI, energyDataAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Purchase {
  id: string;
  date: string;
  amount: number;
  kwh: number;
  meterNumber: string;
  paymentMethod: string;
  tokenNumber: string;
  rechargeCode: string;
  status: "completed" | "pending" | "failed";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("buy");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPurchase, setLastPurchase] = useState<Purchase | null>(null);
  const [error, setError] = useState("");
  const [remainingKwh, setRemainingKwh] = useState(0);
  const [usedKwh, setUsedKwh] = useState(0);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [lastEnergyData, setLastEnergyData] = useState<{
    remainingKwh?: number;
    totalEnergy?: number;
    voltage?: number;
    power?: number;
    serverTimestamp?: string;
  } | null>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conversionRate = 125;

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove any spaces or special characters
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
    // Check if it's exactly 10 digits
    return cleanPhone.length === 10;
  };

  const validateMeterNumber = (meter: string): boolean => {
    // Remove any spaces or special characters (matches ESP32 METER_NUMBER: 13 digits)
    const cleanMeter = meter.replace(/\s+/g, '').replace(/[^\d]/g, '');
    return cleanMeter.length === 13;
  };

  const scrollTable = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (tableScrollRef.current) {
      const scrollAmount = 300;
      if (direction === 'left' || direction === 'right') {
        tableScrollRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      } else {
        tableScrollRef.current.scrollBy({
          top: direction === 'up' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      console.log("Logged in user:", parsedUser);
      console.log("Auth token:", localStorage.getItem("authToken"));
      
      // Load profile picture from localStorage
      const savedProfilePic = localStorage.getItem(`profilePic_${parsedUser.id}`);
      if (savedProfilePic) {
        setProfilePicture(savedProfilePic);
      }
      
      loadPurchaseHistory();
    }
  }, [navigate]);

  // Reload purchase history periodically to ensure fresh data
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      loadPurchaseHistory();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  const loadEnergyDataForMeter = async (meter: string) => {
    const trimmed = meter.replace(/\s+/g, "").replace(/[^\d]/g, "");
    if (!trimmed || trimmed.length < 11) return;
    try {
      const res = await energyDataAPI.getLatestByMeter(trimmed);
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        // Update remaining kWh from ESP32 data
        if (typeof d.remainingKwh === "number") {
          setRemainingKwh(d.remainingKwh);
        }
        setLastEnergyData({
          remainingKwh: d.remainingKwh,
          totalEnergy: d.totalEnergy,
          voltage: d.voltage,
          power: d.power,
          serverTimestamp: d.serverTimestamp,
        });
      }
    } catch (_) {
      setLastEnergyData(null);
    }
  };

  useEffect(() => {
    if (!user || !meterNumber) return;
    loadEnergyDataForMeter(meterNumber);
    
    // Refresh energy data every 10 seconds for real-time updates
    const interval = setInterval(() => {
      loadEnergyDataForMeter(meterNumber);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [user, meterNumber]);

  useEffect(() => {
    if (!user) return;
    const loadMetersAndDefault = async () => {
      try {
        const res = await purchasesAPI.getMeters();
        if (res.data?.success && res.data?.meters?.length > 0) {
          setMeterNumber((prev) => (prev ? prev : res.data.meters[0].meterNumber));
        }
      } catch (_) {}
    };
    loadMetersAndDefault();
  }, [user]);

  const loadPurchaseHistory = async () => {
    try {
      console.log("Loading purchase history...");
      const response = await purchasesAPI.getHistory();
      console.log("Purchase history response:", response.data);
      if (response.data.success && response.data.purchases) {
        // Ensure purchases have valid numeric values
        const validPurchases = response.data.purchases.map((p: any) => ({
          ...p,
          amount: typeof p.amount === 'number' ? p.amount : parseFloat(p.amount) || 0,
          kwh: typeof p.kwh === 'number' ? p.kwh : parseFloat(p.kwh) || 0,
        }));
        console.log("Valid purchases:", validPurchases);
        console.log("Total purchases count:", validPurchases.length);
        setPurchases(validPurchases);
      } else {
        console.warn("No purchases found or invalid response");
        setPurchases([]);
      }
    } catch (error: any) {
      console.error("Failed to load purchase history:", error);
      console.error("Error details:", error.response?.data);
      setPurchases([]); // Set empty array on error
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    setError("");
    
    // Validate meter number before opening payment modal
    if (!meterNumber) {
      setError("Please enter meter number first");
      return;
    }
    
    if (!validateMeterNumber(meterNumber)) {
      setError("Meter number must be exactly 13 digits");
      return;
    }
    
    if (!amount) {
      setError("Please enter amount first");
      return;
    }
    
    const amountNum = parseFloat(amount);
    if (amountNum < 100) {
      setError("Minimum purchase is 100 RWF");
      return;
    }
    
    setPaymentMethod(method);
    setShowPaymentModal(true);
  };

  const handlePurchase = async () => {
    // Validate mobile number for mobile money payments
    if (["MTN Mobile Money", "Airtel Money"].includes(paymentMethod)) {
      if (!mobileNumber) {
        setError("Please enter your mobile number");
        return;
      }
      if (!validatePhoneNumber(mobileNumber)) {
        setError("Phone number must be exactly 10 digits");
        return;
      }
    }

    setIsProcessing(true);
    setError("");

    const amountNum = parseFloat(amount);

    try {
      console.log("Sending purchase request:", {
        meterNumber,
        amountRWF: amountNum,
        paymentMethod,
        mobileNumber: mobileNumber || undefined,
      });

      const response = await purchasesAPI.buyElectricity({
        meterNumber,
        amountRWF: amountNum,
        paymentMethod,
        mobileNumber: mobileNumber || undefined,
      });

      console.log("Purchase response:", response.data);

      if (response.data.success) {
        const purchase = response.data.purchase;
        const purchasedKwh = purchase.kwhAmount;
        
        // Don't optimistically update remainingKwh here - let ESP32 be the source of truth
        // The ESP32 will add the new token to existing remaining energy automatically
        // We'll refresh the energy data after a short delay to get the updated value
        
        setLastPurchase({
          id: purchase.id,
          date: purchase.date,
          amount: purchase.amountRWF,
          kwh: purchase.kwhAmount,
          meterNumber: purchase.meterNumber,
          paymentMethod: purchase.paymentMethod,
          tokenNumber: purchase.tokenNumber,
          rechargeCode: purchase.rechargeCode,
          status: "completed",
        });

        setShowPaymentModal(false);
        setShowConfirmation(true);
        
        // Don't clear meter number so it shows in the meter display
        setAmount("");
        setMobileNumber("");
        setPaymentMethod("");
        
        await loadPurchaseHistory();
        
        // Refresh energy data after purchase to get updated remaining energy from ESP32
        // ESP32 should have added the new token to existing remaining energy
        setTimeout(() => {
          if (meterNumber) {
            loadEnergyDataForMeter(meterNumber);
          }
        }, 2000); // Wait 2 seconds for ESP32 to apply token
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage = error.response?.data?.error || error.message || "Purchase failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePicture(base64String);
        // Save to localStorage
        if (user) {
          localStorage.setItem(`profilePic_${user.id}`, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeProfilePicture = () => {
    setProfilePicture("");
    if (user) {
      localStorage.removeItem(`profilePic_${user.id}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const kwh = amount ? (parseFloat(amount) / conversionRate).toFixed(2) : "0";
  
  // Calculate real values from database
  // Ensure we're using actual numeric values from purchases array
  const totalKwhPurchased = purchases.reduce((sum, p) => {
    const kwh = typeof p.kwh === 'number' ? p.kwh : parseFloat(String(p.kwh)) || 0;
    return sum + kwh;
  }, 0);
  
  const totalSpent = purchases.reduce((sum, p) => {
    const amount = typeof p.amount === 'number' ? p.amount : parseFloat(String(p.amount)) || 0;
    return sum + amount;
  }, 0);
  
  // Debug logging (can be removed in production)
  if (purchases.length > 0) {
    console.log("Purchase calculations:", {
      purchasesCount: purchases.length,
      totalKwhPurchased,
      totalSpent,
      samplePurchase: purchases[0]
    });
  }
  
  // Energy Consumed = Total Purchased - Remaining (from ESP32)
  // ESP32's remainingKwh is the source of truth - it includes all applied tokens
  // When a new purchase is made:
  // - ESP32 adds the new token energy to existing remaining energy
  // - Example: 50 kWh remaining + 80 kWh purchase = 130 kWh remaining on ESP32
  // - consumed = totalPurchased (130) - remaining (130) = 0 (correct, nothing consumed yet)
  // - If user consumed 20 kWh: remaining = 110, consumed = 130 - 110 = 20 (correct)
  const calculatedUsedKwh = Math.max(0, totalKwhPurchased - remainingKwh);
  
  // Total capacity is the sum of all purchases (this is what was purchased)
  // Remaining is what's left on the meter (from ESP32, includes all applied tokens)
  // Used is the difference (what has been consumed)
  const totalCapacity = totalKwhPurchased || (remainingKwh + calculatedUsedKwh); // Fallback if no purchases
  const usagePercentage = totalCapacity > 0 ? (calculatedUsedKwh / totalCapacity) * 100 : 0;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* Electric Particles */}
        <div className="absolute top-32 left-10 w-2 h-2 bg-primary rounded-full animate-charge-up opacity-30"></div>
        <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-accent rounded-full animate-charge-up opacity-30" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-primary rounded-full animate-charge-up opacity-30" style={{ animationDelay: '1.4s' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Welcome Header */}
          <div className="mb-8 animate-slide-up-fade">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
                Welcome back, {user.fullName}!
              </h1>
              <p className="text-muted-foreground">Manage your electricity purchases and track your usage</p>
            </div>
          </div>

          {/* Meter Display Card */}
          <Card className="glass border-0 shadow-electric p-8 mb-8 relative overflow-hidden group animate-slide-up-fade">
            <div className="absolute inset-0 bg-gradient-mesh opacity-20 animate-energy-flow"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl gradient-electric shadow-green-glow animate-electric-pulse">
                    <BatteryCharging className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-navy">Smart Meter Status</h2>
                    <p className="text-sm text-muted-foreground">Real-time energy monitoring</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Meter ID</p>
                  <p className="font-mono font-bold text-navy text-lg">{meterNumber || "Enter meter number"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Remaining kWh */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl"></div>
                  <div className="relative p-6 rounded-2xl border-2 border-primary/20 bg-white/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Battery className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">Remaining Energy</p>
                    </div>
                    <p className="text-5xl font-bold text-primary mb-1">{remainingKwh.toFixed(1)}</p>
                    <p className="text-lg text-muted-foreground">kWh available</p>
                  </div>
                </div>

                {/* Used kWh */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent rounded-2xl"></div>
                  <div className="relative p-6 rounded-2xl border-2 border-accent/20 bg-white/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-accent/20">
                        <Zap className="w-5 h-5 text-accent" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">Energy Consumed</p>
                    </div>
                    <p className="text-5xl font-bold text-accent mb-1">{calculatedUsedKwh.toFixed(1)}</p>
                    <p className="text-lg text-muted-foreground">kWh used</p>
                  </div>
                </div>
              </div>

              {/* Usage Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Energy Usage</span>
                  <span className="font-bold text-navy">{usagePercentage.toFixed(1)}% consumed</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={usagePercentage} 
                    className="h-4 bg-muted/50"
                  />
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div 
                      className="h-full bg-gradient-to-r from-primary via-accent to-primary animate-energy-flow opacity-30"
                      style={{ width: `${usagePercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>0 kWh</span>
                  <span>{totalCapacity.toFixed(1)} kWh Total</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-primary rounded-full animate-ping"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">Meter Status: Active</p>
                      <p className="text-xs text-muted-foreground">
                      Last updated: {lastEnergyData?.serverTimestamp
                        ? new Date(lastEnergyData.serverTimestamp).toLocaleString()
                        : "Just now"}
                    </p>
                    </div>
                  </div>
                  {remainingKwh < 20 && (
                    <div className="px-3 py-1 rounded-full bg-warning/20 border border-warning/30">
                      <p className="text-xs font-bold text-warning">Low Balance</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-electric-spark opacity-50"></div>
            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-accent rounded-full animate-electric-spark opacity-50" style={{ animationDelay: '0.5s' }}></div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass border-0 shadow-premium p-6 hover-lift hover-scale group cursor-pointer relative overflow-hidden animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-energy-flow"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 rounded-xl gradient-electric shadow-green-glow group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 animate-electric-pulse">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-navy group-hover:text-primary transition-colors duration-300">{totalSpent.toLocaleString()} RWF</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 w-1 h-1 bg-primary rounded-full animate-electric-spark opacity-0 group-hover:opacity-100"></div>
            </Card>

            <Card className="glass border-0 shadow-premium p-6 hover-lift hover-scale group cursor-pointer relative overflow-hidden animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-energy-flow"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 rounded-xl gradient-electric shadow-green-glow group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 animate-electric-pulse" style={{ animationDelay: '0.3s' }}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total kWh</p>
                  <p className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">{totalKwhPurchased.toFixed(2)} kWh</p>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-accent rounded-full animate-electric-spark opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.2s' }}></div>
            </Card>

            <Card className="glass border-0 shadow-premium p-6 hover-lift hover-scale group cursor-pointer relative overflow-hidden animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-energy-flow"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-primary shadow-energy group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 animate-electric-pulse" style={{ animationDelay: '0.6s' }}>
                  <History className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold text-navy group-hover:text-accent transition-colors duration-300">{purchases.length}</p>
                </div>
              </div>
              <div className="absolute top-2 left-2 w-1 h-1 bg-primary rounded-full animate-electric-spark opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.4s' }}></div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Buy Electricity Section */}
            <div className="lg:col-span-2">
              <Card className="glass border-0 shadow-electric p-8 relative overflow-hidden group">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-mesh opacity-20 animate-energy-flow"></div>
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-2 rounded-lg gradient-electric shadow-green-glow animate-electric-pulse">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy">Buy Electricity</h2>
                </div>

                <div className="space-y-6 relative z-10">
                  {/* Meter Number */}
                  <div className="relative z-10">
                    <Label htmlFor="meterNumber" className="text-navy font-medium">Meter Number (13 digits)</Label>
                    <Input
                      id="meterNumber"
                      placeholder="e.g. 0215002079873"
                      value={meterNumber}
                      onChange={(e) => setMeterNumber(e.target.value)}
                      className="mt-2 h-12 border-2 focus:border-primary relative z-10"
                      maxLength={13}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Enter your 13-digit smart meter number (matches meter device)</p>
                  </div>

                  {/* Amount */}
                  <div className="relative z-10">
                    <Label htmlFor="amount" className="text-navy font-medium">Amount (RWF)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-2 h-12 border-2 focus:border-primary relative z-10"
                    />
                  </div>

                  {/* Conversion Display */}
                  {amount && parseFloat(amount) >= 100 && (
                    <Card className="p-6 bg-gradient-mesh border-2 border-primary/20 animate-scale-in relative overflow-hidden group/conversion">
                      {/* Electric Animation Background */}
                      <div className="absolute inset-0 bg-gradient-electric opacity-0 group-hover/conversion:opacity-10 transition-opacity duration-500 animate-energy-flow"></div>
                      
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">You will receive:</p>
                          <p className="text-4xl font-bold text-gradient-electric animate-gradient-shift">{kwh} kWh</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/50 group-hover/conversion:scale-110 transition-transform duration-500 relative">
                          <Zap className="w-10 h-10 text-primary animate-electric-pulse" />
                          {/* Electric Sparks */}
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-electric-spark"></div>
                          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-accent rounded-full animate-electric-spark" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 relative z-10">
                        Rate: {conversionRate} RWF per kWh
                      </p>
                      
                      {/* Lightning Flash */}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 animate-lightning-flash pointer-events-none"></div>
                    </Card>
                  )}

                  {/* Payment Methods */}
                  <div className="relative z-10">
                    <Label className="text-navy font-medium mb-3 block">Select Payment Method</Label>
                    <div className="grid grid-cols-2 gap-3 relative z-10">
                      {[
                        { id: "MTN Mobile Money", icon: Smartphone, label: "MTN", sublabel: "Mobile Money", color: "bg-yellow-500", placeholder: "078 123 4567" },
                        { id: "Airtel Money", icon: Smartphone, label: "Airtel", sublabel: "Money", color: "bg-red-500", placeholder: "073 123 4567" },
                        { id: "Bank Transfer", icon: Building2, label: "Bank", sublabel: "Transfer", color: "bg-blue-500" },
                        { id: "Card Payment", icon: Wallet, label: "Card", sublabel: "Payment", color: "bg-purple-500" },
                      ].map((method) => (
                        <Button
                          key={method.id}
                          onClick={() => handlePaymentMethodSelect(method.id)}
                          variant="outline"
                          className="h-auto py-4 px-4 border-2 hover:border-primary hover:bg-primary/5 group"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className={`p-2 rounded-lg ${method.color} group-hover:scale-110 transition-transform`}>
                              <method.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-navy">{method.label}</div>
                              <div className="text-xs text-muted-foreground">{method.sublabel}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    
                    {/* Error Display */}
                    {error && (
                      <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-scale-in">
                        <p className="text-destructive text-sm font-medium">{error}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Purchase History */}
              <Card className="glass border-0 shadow-premium p-8 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <History className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-navy">Purchase History</h2>
                  </div>
                  {purchases.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => scrollTable('left')}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => scrollTable('right')}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                      <History className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No purchases yet. Make your first purchase above!</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Vertical Scroll Buttons - Only show if more than 5 items */}
                    {purchases.length > 5 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
                        <Button
                          onClick={() => scrollTable('up')}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 shadow-md bg-white hover:bg-primary/5"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => scrollTable('down')}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 shadow-md bg-white hover:bg-primary/5"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div 
                      ref={tableScrollRef} 
                      className="overflow-x-auto overflow-y-auto custom-scrollbar"
                      style={{ maxHeight: purchases.length > 5 ? '400px' : 'auto' }}
                    >
                    <table className="w-full min-w-[800px]">
                      <thead>
                        <tr className="border-b-2 border-border">
                          <th className="text-left py-4 px-2 text-sm font-semibold text-navy whitespace-nowrap">Date</th>
                          <th className="text-left py-4 px-2 text-sm font-semibold text-navy whitespace-nowrap">Meter</th>
                          <th className="text-right py-4 px-2 text-sm font-semibold text-navy whitespace-nowrap">Amount</th>
                          <th className="text-right py-4 px-2 text-sm font-semibold text-navy whitespace-nowrap">kWh</th>
                          <th className="text-left py-4 px-2 text-sm font-semibold text-navy whitespace-nowrap">Token</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map((purchase) => (
                          <tr key={purchase.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                            <td className="py-4 px-2 text-sm whitespace-nowrap">{purchase.date}</td>
                            <td className="py-4 px-2 font-mono text-sm whitespace-nowrap">{purchase.meterNumber}</td>
                            <td className="py-4 px-2 text-right font-semibold text-red-600 whitespace-nowrap">{purchase.amount} RWF</td>
                            <td className="py-4 px-2 text-right font-semibold text-red-500 whitespace-nowrap">{purchase.kwh} kWh</td>
                            <td className="py-4 px-2 whitespace-nowrap">
                              <button
                                onClick={() => copyToClipboard(purchase.tokenNumber)}
                                className="flex items-center gap-2 text-sm font-mono hover:text-primary transition-colors"
                              >
                                {purchase.tokenNumber}
                                {copiedToken === purchase.tokenNumber ? (
                                  <Check className="w-4 h-4 text-red-500" />
                                ) : (
                                  <Copy className="w-4 h-4 text-red-600" />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Smart Meter Diagnostics */}
            <div>
              <Card className="glass border-0 shadow-premium p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <Shield className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-red-900">Meter Diagnostics</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-800">Connection Status</span>
                    </div>
                    <span className="text-xs font-bold text-green-600">ONLINE</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-800">Voltage Level</span>
                    </div>
                    <span className="text-xs font-bold text-green-600">
                      {typeof lastEnergyData?.voltage === "number"
                        ? `${lastEnergyData.voltage.toFixed(1)} V`
                        : "NORMAL"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-yellow-800">Battery Backup</span>
                    </div>
                    <span className="text-xs font-bold text-yellow-600">LOW</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-800">Data Transmission</span>
                    </div>
                    <span className="text-xs font-bold text-green-600">ACTIVE</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700 text-center">
                    {lastEnergyData?.serverTimestamp
                      ? `Last diagnostic: ${new Date(lastEnergyData.serverTimestamp).toLocaleString()}`
                      : "Last diagnostic: 2 minutes ago"}
                  </p>
                  {typeof lastEnergyData?.power === "number" && (
                    <p className="text-xs text-blue-700 text-center mt-1">
                      Power: {lastEnergyData.power.toFixed(1)} W
                    </p>
                  )}
                </div>
              </Card>
              
              {/* Profile Card */}
              <Card className="glass border-0 shadow-premium p-8 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-900">Profile</h2>
                </div>

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center mb-6 pb-6 border-b border-border">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-lg">
                      <AvatarImage src={profilePicture} alt={user.fullName} />
                      <AvatarFallback className="text-3xl font-bold bg-gradient-electric text-white">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Upload Button Overlay */}
                    <button
                      onClick={triggerFileInput}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />

                  {/* Upload/Remove Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={triggerFileInput}
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary/5"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    {profilePicture && (
                      <Button
                        onClick={removeProfilePicture}
                        variant="outline"
                        size="sm"
                        className="border-destructive text-destructive hover:bg-destructive/5"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Max size: 5MB • JPG, PNG, GIF
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Full Name</Label>
                    <p className="text-lg font-semibold text-red-900 mt-1">{user.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p className="text-lg font-semibold text-red-900 mt-1">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Phone</Label>
                    <p className="text-lg font-semibold text-red-900 mt-1">{user.phoneNumber}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-900">Complete Payment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-semibold text-red-900">{paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-primary">{amount} RWF</span>
              </div>
            </div>

            {["MTN Mobile Money", "Airtel Money"].includes(paymentMethod) && (
              <div className="relative z-10">
                <Label htmlFor="mobileNumber" className="text-red-900 font-medium">Mobile Number (10 digits)</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder={paymentMethod === "MTN Mobile Money" ? "0781234567" : "0731234567"}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="mt-2 h-12 border-2 focus:border-primary relative z-10"
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground mt-1">Enter 10-digit phone number</p>
              </div>
            )}

            {["Bank Transfer", "Card Payment"].includes(paymentMethod) && (
              <div className="relative z-10">
                <Label htmlFor="cardNumber" className="text-red-900 font-medium">
                  {paymentMethod === "Card Payment" ? "Card Number" : "Account Number"}
                </Label>
                <Input
                  id="cardNumber"
                  placeholder={paymentMethod === "Card Payment" ? "1234 5678 9012 3456" : "Enter account number"}
                  className="mt-2 h-12 border-2 focus:border-primary relative z-10"
                />
              </div>
            )}

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setShowPaymentModal(false)}
                variant="outline"
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="flex-1 gradient-electric text-white hover:opacity-90 shadow-green-glow hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">Processing</span>
                      <span className="flex gap-1">
                        <span className="w-1 h-1 bg-white rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                        <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      </span>
                    </span>
                  ) : (
                    <>
                      Confirm Payment
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowConfirmation(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <div className="text-center py-6 pr-8">
            <div className="inline-flex p-4 rounded-full gradient-electric mb-6 animate-electric-pulse shadow-green-glow relative">
              <Check className="w-12 h-12 text-white animate-scale-in" />
              {/* Success Sparks */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-electric-spark"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-white rounded-full animate-electric-spark" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full animate-electric-spark" style={{ animationDelay: '0.4s' }}></div>
            </div>
            
            <h2 className="text-3xl font-bold text-secondary mb-2">Purchase Successful!</h2>
            <p className="text-muted-foreground mb-6">
              {lastPurchase && `Electricity with token number ${lastPurchase.tokenNumber} has been sent to your meter`}
            </p>

            {lastPurchase && (
              <div className="space-y-3 text-left bg-muted/30 rounded-xl p-6">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-bold text-navy">{lastPurchase.amount} RWF</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">kWh Received:</span>
                  <span className="font-bold text-secondary">{lastPurchase.kwh} kWh</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Meter Number:</span>
                  <span className="font-bold font-mono text-navy">{lastPurchase.meterNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Token Number:</span>
                  <button
                    onClick={() => copyToClipboard(lastPurchase.tokenNumber)}
                    className="flex items-center gap-2 font-bold font-mono text-primary hover:text-primary/80"
                  >
                    {lastPurchase.tokenNumber}
                    {copiedToken === lastPurchase.tokenNumber ? (
                      <Check className="w-4 h-4 text-secondary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2 text-center">Recharge Code:</p>
                  <p className="text-xl font-mono font-bold text-center text-primary">
                    {lastPurchase.rechargeCode}
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={() => setShowConfirmation(false)}
              className="mt-6 w-full gradient-electric text-white hover:opacity-90 shadow-electric h-12"
            >
              Make Another Purchase
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Dashboard;