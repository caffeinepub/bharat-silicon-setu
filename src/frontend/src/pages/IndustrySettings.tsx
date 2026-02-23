import { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useSaveCallerUserProfile } from '../hooks/useProjects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function IndustrySettings() {
  const { userProfile, isLoading } = useUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        description: (userProfile as any).description || ''
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile) {
      toast.error('Profile not loaded');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Company name is required');
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
        email: formData.email.trim(),
        ...(formData.description && { description: formData.description.trim() } as any)
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
          <p className="text-white">Manage your company profile and preferences</p>
        </div>

        {/* Company Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Company Information</CardTitle>
            <CardDescription className="text-white">Update your company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="text-white">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter company name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email" className="text-white">Contact Email</Label>
              <Input
                id="company-email"
                type="email"
                placeholder="company@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-description" className="text-white">Company Description</Label>
              <Textarea
                id="company-description"
                placeholder="Tell students about your company..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
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
                Industry Partner
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
