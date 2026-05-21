import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Settings,
  Bell,
  Lock,
  User,
  Eye,
  LogOut,
  Trash2,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    accountCreated: "",
  });

  useEffect(() => {
    const authenticated = localStorage.getItem("isAuthenticated") === "true";
    const userInfo = localStorage.getItem("user");
    setIsLoggedIn(authenticated);
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      // Load user data from localStorage
      setUserData({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        company: parsedUser.company || "",
        country: parsedUser.country || "",
        accountCreated: parsedUser.accountCreated ? new Date(parsedUser.accountCreated).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Not set",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/sign-in");
  };

  const handleSaveProfile = () => {
    // Update user object with new data
    const updatedUser = {
      ...user,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      company: userData.company,
      country: userData.country,
    };
    
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border p-6 hidden md:flex flex-col">
          <div className="flex-1 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account preferences and security settings
              </p>
            </div>

            {!isLoggedIn ? (
              <Card className="mb-8 border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-1">
                        Sign In Required
                      </h3>
                      <p className="text-sm text-blue-800 mb-4">
                        Please sign in to access all settings and features
                      </p>
                      <Link to="/sign-in">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Authentication Info */}
                <Card className="mb-8 border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Authentication Status
                    </CardTitle>
                    <CardDescription>
                      Your login and security information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Logged In As
                      </p>
                      <p className="text-lg font-medium text-foreground">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Email
                      </p>
                      <p className="text-lg font-medium text-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-100 text-green-800 text-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      Session Active
                    </div>
                    <Button
                      variant="outline"
                      className="w-full text-destructive border-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Profile Settings */}
            {isLoggedIn && (
              <>
                <Card className="mb-8 border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={userData.firstName}
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  firstName: e.target.value,
                                })
                              }
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={userData.lastName}
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  lastName: e.target.value,
                                })
                              }
                              className="mt-2"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userData.email}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                email: e.target.value,
                              })
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={userData.phone}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                phone: e.target.value,
                              })
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={userData.company}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                company: e.target.value,
                              })
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={userData.country}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                country: e.target.value,
                              })
                            }
                            className="mt-2"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleSaveProfile}
                            className="bg-gradient-primary"
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              First Name
                            </p>
                            <p className="text-lg font-medium text-foreground">
                              {userData.firstName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Last Name
                            </p>
                            <p className="text-lg font-medium text-foreground">
                              {userData.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Email Address
                            </p>
                            <p className="text-lg font-medium text-foreground">
                              {userData.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Phone Number
                            </p>
                            <p className="text-lg font-medium text-foreground">
                              {userData.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Company
                            </p>
                            <p className="text-lg font-medium text-foreground">
                              {userData.company}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Country
                            </p>
                            <p className="text-lg font-medium text-foreground">
                              {userData.country}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Account Created
                            </p>
                            <p className="text-lg font-medium text-foreground">
                              {userData.accountCreated}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                          className="w-full md:w-auto"
                        >
                          Edit Profile
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card className="mb-8 border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </CardTitle>
                    <CardDescription>
                      Manage how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">
                          Email Notifications
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">
                          Push Notifications
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Receive browser notifications
                        </p>
                      </div>
                      <Switch
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="mb-8 border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Security
                    </CardTitle>
                    <CardDescription>
                      Manage your account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                    <Button variant="outline" className="w-full md:w-auto">
                      <Eye className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive bg-destructive/5">
                  <CardHeader>
                    <CardTitle className="text-destructive">
                      Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full md:w-auto text-destructive border-destructive hover:bg-destructive/10"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout All Devices
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Logout All Devices
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will log you out from all devices. You'll need
                            to sign in again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogAction className="bg-destructive">
                          Logout
                        </AlertDialogAction>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full md:w-auto text-destructive border-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogAction className="bg-destructive">
                          Delete Account
                        </AlertDialogAction>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </>
            )}
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
