import { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useSaveCallerUserProfile } from '../hooks/useProjects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function StudentSettings() {
  const { userProfile, isLoading } = useUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();
  
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name,
        email: userProfile.email
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile) {
      toast.error('Profile not loaded');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    try {
      await saveProfileMutation.mutateAsync({
        ...userProfile,
        name: formData.name.trim(),
        email: formData.email.trim()
      });
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Save error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-white">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Settings</h1>
          <p className="text-white">Manage your account settings and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Profile Information</CardTitle>
            <CardDescription className="text-white">Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
            <CardDescription className="text-white">Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-white">Principal ID</Label>
              <p className="text-sm text-muted-foreground mt-1 break-all">
                {userProfile?.principalId.toString()}
              </p>
            </div>
            <div>
              <Label className="text-white">Account Type</Label>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                {userProfile?.role}
              </p>
            </div>
            <div>
              <Label className="text-white">Member Since</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {userProfile ? new Date(Number(userProfile.registrationTimestamp) / 1000000).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave} 
          disabled={saveProfileMutation.isPending}
          className="w-full"
          size="lg"
        >
          {saveProfileMutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
