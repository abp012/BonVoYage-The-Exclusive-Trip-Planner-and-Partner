import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Settings, 
  Globe, 
  CreditCard, 
  Bell, 
  MapPin,
  Heart,
  DollarSign,
  Plane,
  Home,
  Utensils,
  X
} from 'lucide-react';

const TRAVEL_STYLES = [
  'Adventure', 'Luxury', 'Budget', 'Cultural', 'Relaxation', 
  'Family', 'Solo', 'Business', 'Romantic', 'Backpacking'
];

const ACTIVITIES = [
  'Sightseeing', 'Adventure Sports', 'Food Tours', 'Museums', 'Shopping',
  'Nightlife', 'Beach', 'Hiking', 'Photography', 'Local Culture',
  'Festivals', 'Wildlife', 'Architecture', 'Spa & Wellness', 'Art'
];

const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher',
  'Dairy-Free', 'Nut-Free', 'Pescatarian', 'Low-Carb'
];

const ACCOMMODATION_TYPES = [
  'Hotels', 'Hostels', 'Vacation Rentals', 'Resorts', 'Boutique Hotels',
  'Bed & Breakfast', 'Camping', 'Luxury Hotels', 'Budget Hotels'
];

const TRANSPORTATION_PREFS = [
  'Flight', 'Train', 'Bus', 'Car Rental', 'Taxi/Uber', 
  'Public Transport', 'Walking', 'Cycling', 'Motorcycle'
];

const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
];

interface UserPreferencesProps {
  className?: string;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({ className }) => {
  const { user: clerkUser } = useUser();
  const { toast } = useToast();
  
  // State for form data
  const [profileData, setProfileData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    preferredCurrency: 'USD',
    preferredLanguage: 'en',
    timezone: '',
    emailNotifications: true
  });

  const [preferencesData, setPreferencesData] = useState({
    travelStyle: '',
    favoriteActivities: [] as string[],
    dietaryRestrictions: [] as string[],
    mobilityRequirements: '',
    budgetRange: {
      min: 500,
      max: 5000,
      currency: 'USD'
    },
    preferredAccommodation: [] as string[],
    transportationPrefs: [] as string[]
  });

  // Convex queries and mutations
  const userProfile = useQuery(api.users.getUserProfile, 
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );
  
  const updateProfile = useMutation(api.users.updateUserProfile);
  const updatePreferences = useMutation(api.users.updateUserPreferences);

  // Load user data when available
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.name || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        phoneNumber: userProfile.phoneNumber || '',
        preferredCurrency: userProfile.preferredCurrency || 'USD',
        preferredLanguage: userProfile.preferredLanguage || 'en',
        timezone: userProfile.timezone || '',
        emailNotifications: userProfile.emailNotifications ?? true
      });

      if (userProfile.preferences) {
        setPreferencesData({
          travelStyle: userProfile.preferences.travelStyle || '',
          favoriteActivities: userProfile.preferences.favoriteActivities || [],
          dietaryRestrictions: userProfile.preferences.dietaryRestrictions || [],
          mobilityRequirements: userProfile.preferences.mobilityRequirements || '',
          budgetRange: userProfile.preferences.budgetRange || {
            min: 500,
            max: 5000,
            currency: 'USD'
          },
          preferredAccommodation: userProfile.preferences.preferredAccommodation || [],
          transportationPrefs: userProfile.preferences.transportationPrefs || []
        });
      }
    }
  }, [userProfile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkUser) return;

    try {
      await updateProfile({
        clerkId: clerkUser.id,
        updates: profileData
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkUser) return;

    try {
      await updatePreferences({
        clerkId: clerkUser.id,
        preferences: preferencesData
      });
      
      toast({
        title: "Preferences Updated",
        description: "Your travel preferences have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (newArray: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  if (!clerkUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please sign in to manage your preferences</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 max-w-4xl mx-auto ${className}`}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">User Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and travel preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="travel">Travel Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and account preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Preferred Currency</Label>
                    <Select 
                      value={profileData.preferredCurrency} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, preferredCurrency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map(currency => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select 
                      value={profileData.preferredLanguage} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, preferredLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Save Profile Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Travel Preferences Tab */}
        <TabsContent value="travel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Travel Preferences
              </CardTitle>
              <CardDescription>
                Tell us about your travel style and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                {/* Travel Style */}
                <div className="space-y-2">
                  <Label>Travel Style</Label>
                  <Select 
                    value={preferencesData.travelStyle} 
                    onValueChange={(value) => setPreferencesData(prev => ({ ...prev, travelStyle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your travel style" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRAVEL_STYLES.map(style => (
                        <SelectItem key={style} value={style.toLowerCase()}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget Range */}
                <div className="space-y-4">
                  <Label>Budget Range (per trip)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minBudget">Minimum</Label>
                      <Input
                        id="minBudget"
                        type="number"
                        value={preferencesData.budgetRange.min}
                        onChange={(e) => setPreferencesData(prev => ({
                          ...prev,
                          budgetRange: { ...prev.budgetRange, min: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxBudget">Maximum</Label>
                      <Input
                        id="maxBudget"
                        type="number"
                        value={preferencesData.budgetRange.max}
                        onChange={(e) => setPreferencesData(prev => ({
                          ...prev,
                          budgetRange: { ...prev.budgetRange, max: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Favorite Activities */}
                <div className="space-y-2">
                  <Label>Favorite Activities</Label>
                  <div className="flex flex-wrap gap-2">
                    {ACTIVITIES.map(activity => (
                      <Badge
                        key={activity}
                        variant={preferencesData.favoriteActivities.includes(activity) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayItem(
                          preferencesData.favoriteActivities,
                          activity,
                          (newArray) => setPreferencesData(prev => ({ ...prev, favoriteActivities: newArray }))
                        )}
                      >
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Accommodation Preferences */}
                <div className="space-y-2">
                  <Label>Preferred Accommodation</Label>
                  <div className="flex flex-wrap gap-2">
                    {ACCOMMODATION_TYPES.map(type => (
                      <Badge
                        key={type}
                        variant={preferencesData.preferredAccommodation.includes(type) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayItem(
                          preferencesData.preferredAccommodation,
                          type,
                          (newArray) => setPreferencesData(prev => ({ ...prev, preferredAccommodation: newArray }))
                        )}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Transportation Preferences */}
                <div className="space-y-2">
                  <Label>Transportation Preferences</Label>
                  <div className="flex flex-wrap gap-2">
                    {TRANSPORTATION_PREFS.map(transport => (
                      <Badge
                        key={transport}
                        variant={preferencesData.transportationPrefs.includes(transport) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayItem(
                          preferencesData.transportationPrefs,
                          transport,
                          (newArray) => setPreferencesData(prev => ({ ...prev, transportationPrefs: newArray }))
                        )}
                      >
                        {transport}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div className="space-y-2">
                  <Label>Dietary Restrictions</Label>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_RESTRICTIONS.map(restriction => (
                      <Badge
                        key={restriction}
                        variant={preferencesData.dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayItem(
                          preferencesData.dietaryRestrictions,
                          restriction,
                          (newArray) => setPreferencesData(prev => ({ ...prev, dietaryRestrictions: newArray }))
                        )}
                      >
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Mobility Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="mobilityRequirements">Mobility Requirements</Label>
                  <Textarea
                    id="mobilityRequirements"
                    value={preferencesData.mobilityRequirements}
                    onChange={(e) => setPreferencesData(prev => ({ ...prev, mobilityRequirements: e.target.value }))}
                    placeholder="Any accessibility needs or mobility requirements..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Save Travel Preferences
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your trips and account
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={profileData.emailNotifications}
                  onCheckedChange={(checked) => 
                    setProfileData(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Trip Reminders</p>
                      <p className="text-sm text-muted-foreground">Get reminded about upcoming trips</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Credit Updates</p>
                      <p className="text-sm text-muted-foreground">Notifications about credit transactions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Features</p>
                      <p className="text-sm text-muted-foreground">Updates about new app features</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing</p>
                      <p className="text-sm text-muted-foreground">Travel deals and promotions</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleProfileSubmit}
                className="w-full"
              >
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPreferences;
