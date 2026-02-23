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

export default function StudentSettings() {
  const { userProfile, isLoading } = useUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    mentorMessages: true
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        bio: ''
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile) return;
    
    try {
      await saveProfileMutation.mutateAsync({
        ...userProfile,
        name: formData.name,
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
          <p className="text-white">Manage your account preferences</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Profile Information</CardTitle>
            <CardDescription className="text-white">Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Notification Preferences</CardTitle>
            <CardDescription className="text-white">Choose what updates you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-white">Receive email updates about your account</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, emailNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Project Updates</p>
                <p className="text-sm text-white">Get notified about project status changes</p>
              </div>
              <Switch
                checked={notifications.projectUpdates}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, projectUpdates: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Mentor Messages</p>
                <p className="text-sm text-white">Receive notifications for new messages</p>
              </div>
              <Switch
                checked={notifications.mentorMessages}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, mentorMessages: checked })
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
