import { useState, useEffect } from 'react';
import { 
  Heart, 
  Home, 
  Users, 
  Gift, 
  User as UserIcon, 
  LogOut, 
  Plus, 
  CheckCircle, 
  ShieldCheck,
  MapPin,
  Phone,
  Info,
  ArrowRight,
  Filter,
  Search,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { useAuth } from './hooks/useAuth';
import { dataService } from './services/dataService';
import { Organization, Need, Donation, OrganizationType, NeedCategory } from './types';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { ScrollArea } from './components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Skeleton } from './components/ui/skeleton';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';

// --- Components ---

const Navbar = ({ onNavigate, currentView }: { onNavigate: (view: string) => void, currentView: string }) => {
  const { user, profile } = useAuth();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error('Failed to login');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="rounded-full bg-rose-500 p-1.5">
            <Heart className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-rose-600">KindHeart</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Button variant={currentView === 'home' ? 'secondary' : 'ghost'} onClick={() => onNavigate('home')}>Home</Button>
          <Button variant={currentView === 'organizations' ? 'secondary' : 'ghost'} onClick={() => onNavigate('organizations')}>Explore</Button>
          {user && (
            <Button variant={currentView === 'donations' ? 'secondary' : 'ghost'} onClick={() => onNavigate('donations')}>My Donations</Button>
          )}
          {profile?.role === 'admin' && (
            <Button variant={currentView === 'admin' ? 'secondary' : 'ghost'} onClick={() => onNavigate('admin')}>Admin</Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate('donations')}>
                  <Gift className="mr-2 h-4 w-4" />
                  <span>My Donations</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-rose-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} className="bg-rose-600 hover:bg-rose-700">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ onExplore }: { onExplore: () => void }) => {
  return (
    <div className="relative overflow-hidden bg-rose-50 py-24 sm:py-32">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
          >
            Small Acts, <span className="text-rose-600">Big Impact</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            KindHeart connects you with old age homes and orphanages in need. 
            Whether it's food, clothing, or financial support, your contribution 
            makes a world of difference.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex items-center gap-x-6"
          >
            <Button size="lg" onClick={onExplore} className="bg-rose-600 hover:bg-rose-700 h-12 px-8 text-lg">
              Start Donating
            </Button>
            <Button variant="ghost" size="lg" className="h-12 px-8 text-lg">
              Learn More <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="absolute right-0 top-0 hidden lg:block w-1/2 h-full">
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
          alt="Helping hands" 
          className="h-full w-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

const OrgCard = ({ org, onSelect }: { org: Organization, onSelect: (org: Organization) => void, key?: string }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden h-full flex flex-col border-none shadow-md hover:shadow-xl transition-shadow">
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={org.image_url || `https://picsum.photos/seed/${org.id}/800/600`} 
            alt={org.name} 
            className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
            referrerPolicy="no-referrer"
          />
          <Badge className="absolute top-4 right-4 bg-white/90 text-rose-600 hover:bg-white">
            {org.type === 'old_age_home' ? 'Old Age Home' : 'Orphanage'}
          </Badge>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold line-clamp-1">{org.name}</CardTitle>
            {org.verified && <ShieldCheck className="h-5 w-5 text-blue-500" />}
          </div>
          <CardDescription className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" /> {org.address}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600 line-clamp-3">{org.description}</p>
        </CardContent>
        <CardFooter className="border-t bg-gray-50/50 p-4">
          <Button onClick={() => onSelect(org)} className="w-full bg-rose-600 hover:bg-rose-700">
            View Needs
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const OrgDetail = ({ org, onBack }: { org: Organization, onBack: () => void }) => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = dataService.subscribeToNeeds(org.id, (data) => {
      setNeeds(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [org.id]);

  const handleDonate = async (need: Need) => {
    if (!user) {
      toast.error('Please sign in to donate');
      return;
    }
    
    // In a real app, this would open a payment/item selection modal
    // For now, let's simulate a donation
    try {
      await dataService.createDonation({
        donorId: user.uid,
        orgId: org.id,
        needId: need.id,
        amount: need.category === 'funds' ? 100 : 0,
        items: need.category !== 'funds' ? [{ name: need.title, quantity: 1 }] : [],
        status: 'completed'
      });
      toast.success(`Thank you for donating ${need.title}!`);
    } catch (error) {
      toast.error('Failed to process donation');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back to Organizations
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={org.image_url || `https://picsum.photos/seed/${org.id}/1200/800`} 
              alt={org.name} 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <div className="text-white">
                <Badge className="mb-2 bg-rose-600">{org.type === 'old_age_home' ? 'Old Age Home' : 'Orphanage'}</Badge>
                <h1 className="text-4xl font-bold">{org.name}</h1>
                <p className="flex items-center gap-2 mt-2 opacity-90"><MapPin className="h-4 w-4" /> {org.address}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Info className="h-6 w-6 text-rose-600" /> About the Organization
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {org.description}
            </p>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" /> {org.contact}
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" /> Verified Organization
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-rose-600" /> Current Needs
              </CardTitle>
              <CardDescription>Select an item to donate</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
                ) : needs.length > 0 ? (
                  <div className="space-y-4">
                    {needs.map(need => (
                      <div key={need.id} className="p-4 rounded-lg border bg-white hover:border-rose-200 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{need.title}</h3>
                          <Badge variant={need.priority === 'high' ? 'destructive' : 'secondary'}>
                            {need.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{need.description}</p>
                        <Button 
                          onClick={() => handleDonate(need)}
                          className="w-full bg-rose-600 hover:bg-rose-700"
                        >
                          Donate Now
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No active needs at the moment.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const unsubscribe = dataService.subscribeToUserDonations(user.uid, (data) => {
        setDonations(data);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (!user) return <div className="p-8 text-center">Please sign in to view your dashboard.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16 border-2 border-rose-200">
          <AvatarImage src={user.photoURL || ''} />
          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.displayName}!</h1>
          <p className="text-gray-600">Your kindness has touched many lives.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-rose-50 border-rose-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-600">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{donations.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Impact Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{donations.length * 10} pts</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Lives Touched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">~{donations.length * 5}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Recent Donations</h2>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : donations.length > 0 ? (
          <div className="divide-y">
            {donations.map(donation => (
              <div key={donation.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <Gift className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {donation.amount ? `$${donation.amount} Donation` : `Item Donation`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {donation.timestamp?.toDate().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {donation.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            You haven't made any donations yet. Start your journey today!
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isAddingOrg, setIsAddingOrg] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', type: 'orphanage' as OrganizationType, description: '', address: '', contact: '', image_url: '' });

  useEffect(() => {
    const unsubscribe = dataService.subscribeToOrganizations(setOrgs);
    return () => unsubscribe();
  }, []);

  const handleAddOrg = async () => {
    try {
      await dataService.addOrganization({
        ...newOrg,
        verified: true
      });
      setIsAddingOrg(false);
      toast.success('Organization added successfully!');
    } catch (error) {
      toast.error('Failed to add organization');
    }
  };

  const handleSeedData = async () => {
    try {
      const sampleOrgs = [
        {
          name: "Sunshine Orphanage",
          type: "orphanage" as OrganizationType,
          description: "Providing a safe haven and education for children since 1995. We currently house 45 children aged 3-16.",
          address: "123 Hope Lane, Springfield",
          contact: "+1 234 567 890",
          image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
          verified: true
        },
        {
          name: "Golden Years Home",
          type: "old_age_home" as OrganizationType,
          description: "A peaceful residence for the elderly with 24/7 medical care and a vibrant community atmosphere.",
          address: "456 Serenity Blvd, Riverside",
          contact: "+1 987 654 321",
          image_url: "https://images.unsplash.com/photo-1581578731522-745d051422f1?q=80&w=2070&auto=format&fit=crop",
          verified: true
        }
      ];

      for (const org of sampleOrgs) {
        const docRef = await dataService.addOrganization(org);
        
        // Add some needs for each org
        const needs = [
          { title: "Rice & Grains", category: "food" as const, priority: "high" as const, status: "active" as const, description: "Monthly supply of rice and pulses for the kitchen." },
          { title: "Winter Blankets", category: "clothing" as const, priority: "medium" as const, status: "active" as const, description: "Warm blankets for the upcoming winter season." },
          { title: "Medical Checkups", category: "medical" as const, priority: "high" as const, status: "active" as const, description: "Funds for monthly health screenings for residents." }
        ];

        for (const need of needs) {
          await dataService.addNeed(docRef.id, need);
        }
      }
      toast.success('Sample data seeded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to seed data');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleSeedData}>Seed Sample Data</Button>
          <Dialog open={isAddingOrg} onOpenChange={setIsAddingOrg}>
          <DialogTrigger asChild>
            <Button className="bg-rose-600 hover:bg-rose-700">
              <Plus className="mr-2 h-4 w-4" /> Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
              <DialogDescription>Enter the details of the new home or orphanage.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={newOrg.name} onChange={e => setNewOrg({...newOrg, name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newOrg.type} onValueChange={(v: OrganizationType) => setNewOrg({...newOrg, type: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="old_age_home">Old Age Home</SelectItem>
                    <SelectItem value="orphanage">Orphanage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={newOrg.address} onChange={e => setNewOrg({...newOrg, address: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact</Label>
                <Input id="contact" value={newOrg.contact} onChange={e => setNewOrg({...newOrg, contact: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={newOrg.description} onChange={e => setNewOrg({...newOrg, description: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input id="image" value={newOrg.image_url} onChange={e => setNewOrg({...newOrg, image_url: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddOrg} className="bg-rose-600 hover:bg-rose-700">Save Organization</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orgs.map(org => (
          <Card key={org.id} className="relative">
            <CardHeader>
              <CardTitle className="text-lg">{org.name}</CardTitle>
              <CardDescription>{org.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2">{org.address}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" className="w-full">Edit</Button>
              <Button variant="outline" size="sm" className="w-full text-rose-600">Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState('home');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | OrganizationType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = dataService.subscribeToOrganizations((data) => {
      setOrganizations(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredOrgs = organizations.filter(org => {
    const matchesFilter = filter === 'all' || org.type === filter;
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         org.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleNavigate = (newView: string) => {
    setView(newView);
    setSelectedOrg(null);
    window.scrollTo(0, 0);
  };

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrg(org);
    setView('org-detail');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Toaster position="top-center" />
      <Navbar onNavigate={handleNavigate} currentView={view} />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onExplore={() => handleNavigate('organizations')} />
            
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                  <p className="text-gray-600 text-lg">KindHeart makes it easy to give back to your community in three simple steps.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { icon: Search, title: "Find a Home", desc: "Browse verified old age homes and orphanages in your area." },
                    { icon: Gift, title: "Pick a Need", desc: "See real-time needs like food, medicine, or educational supplies." },
                    { icon: Heart, title: "Make an Impact", desc: "Donate items or funds directly and track your contribution." }
                  ].map((step, i) => (
                    <div key={i} className="text-center space-y-4">
                      <div className="mx-auto h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                        <step.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-20 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Featured Organizations</h2>
                    <p className="text-gray-600">Help these homes fulfill their urgent needs.</p>
                  </div>
                  <Button variant="outline" onClick={() => handleNavigate('organizations')}>
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {loading ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="h-[400px] rounded-xl" />)
                  ) : (
                    organizations.slice(0, 3).map(org => (
                      <OrgCard key={org.id} org={org} onSelect={handleSelectOrg} />
                    ))
                  )}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {view === 'organizations' && (
          <motion.div
            key="organizations"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-12"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-bold mb-2">Explore Organizations</h1>
                <p className="text-gray-600">Find a cause that resonates with you.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search name or city..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Tabs value={filter} onValueChange={(v: any) => setFilter(v)} className="w-full sm:w-auto">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="old_age_home">Homes</TabsTrigger>
                    <TabsTrigger value="orphanage">Orphanages</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[400px] rounded-xl" />)}
              </div>
            ) : filteredOrgs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredOrgs.map(org => (
                  <OrgCard key={org.id} org={org} onSelect={handleSelectOrg} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed rounded-2xl">
                <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">No organizations found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
              </div>
            )}
          </motion.div>
        )}

        {view === 'org-detail' && selectedOrg && (
          <motion.div
            key="org-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <OrgDetail org={selectedOrg} onBack={() => setView('organizations')} />
          </motion.div>
        )}

        {view === 'donations' && (
          <motion.div
            key="donations"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DonorDashboard />
          </motion.div>
        )}

        {view === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminDashboard />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="rounded-full bg-rose-500 p-1.5">
                  <Heart className="h-5 w-5 text-white fill-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">KindHeart</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Empowering communities through transparent and direct donations to those who need it most. 
                Join us in making the world a kinder place.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-white cursor-pointer" onClick={() => handleNavigate('home')}>Home</li>
                <li className="hover:text-white cursor-pointer" onClick={() => handleNavigate('organizations')}>Explore</li>
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-white cursor-pointer">FAQs</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Terms of Service</li>
                <li className="hover:text-white cursor-pointer">Help Center</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} KindHeart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
