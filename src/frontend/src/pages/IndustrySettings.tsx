import { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useSaveCallerUserProfile } from '../hooks/useProjects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';

export default function IndustrySettings() {
  const { userProfile, isLoading } = useUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();
  
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    description: ''
  });
  
  const [preferences, setPreferences] = useState({
    autoApproveProjects: false,
    emailNotifications: true,
    weeklyReports: true
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        companyName: userProfile.name,
        email: userProfile.email,
        description: ''
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile) return;
    
    try {
      await saveProfileMutation.mutateAsync({
        ...userProfile,
        name: formData.companyName,
        email: formData.email
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
      <div className="max-w-4xl mx-auto space-y-8">
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
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Company Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your company..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Team Management</CardTitle>
            <CardDescription className="text-white">Manage team members and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-white">Team management features coming soon</p>
              <Button className="mt-4" variant="outline">Invite Team Member</Button>
            </div>
          </CardContent>
        </Card>

        {/* Posting Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Posting Preferences</CardTitle>
            <CardDescription className="text-white">Configure how your projects are posted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-approve Projects</p>
                <p className="text-sm text-white">Automatically approve new project postings</p>
              </div>
              <Switch
                checked={preferences.autoApproveProjects}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, autoApproveProjects: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-white">Receive email updates about applicants</p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, emailNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Weekly Reports</p>
                <p className="text-sm text-white">Get weekly analytics reports</p>
              </div>
              <Switch
                checked={preferences.weeklyReports}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, weeklyReports: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave} 
          disabled={saveProfileMutation.isPending}
          className="w-full"
        >
          {saveProfileMutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
