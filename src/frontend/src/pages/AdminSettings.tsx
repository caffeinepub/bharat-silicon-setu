import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [platformSettings, setPlatformSettings] = useState({
    siteName: 'Semiconductor Talent Platform',
    maintenanceMode: false,
    registrationEnabled: true
  });

  const [accessControl, setAccessControl] = useState({
    selectedUser: '',
    selectedRole: 'user'
  });

  const handleSavePlatformSettings = () => {
    toast.success('Platform settings saved successfully!');
  };

  const handleAssignRole = () => {
    if (!accessControl.selectedUser) {
      toast.error('Please enter a user principal ID');
      return;
    }
    toast.success(`Role ${accessControl.selectedRole} assigned successfully!`);
  };

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Admin Settings</h1>
          <p className="text-white">Configure platform settings and access controls</p>
        </div>

        {/* Platform Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Platform Configuration</CardTitle>
            <CardDescription className="text-white">General platform settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name" className="text-white">Site Name</Label>
              <Input
                id="site-name"
                value={platformSettings.siteName}
                onChange={(e) => setPlatformSettings({ ...platformSettings, siteName: e.target.value })}
                className="text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-sm text-white">Temporarily disable platform access</p>
              </div>
              <Switch
                checked={platformSettings.maintenanceMode}
                onCheckedChange={(checked) => 
                  setPlatformSettings({ ...platformSettings, maintenanceMode: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">User Registration</p>
                <p className="text-sm text-white">Allow new user registrations</p>
              </div>
              <Switch
                checked={platformSettings.registrationEnabled}
                onCheckedChange={(checked) => 
                  setPlatformSettings({ ...platformSettings, registrationEnabled: checked })
                }
              />
            </div>
            <Button onClick={handleSavePlatformSettings} className="w-full">
              Save Platform Settings
            </Button>
          </CardContent>
        </Card>

        {/* Access Control Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Access Control Management</CardTitle>
            <CardDescription className="text-white">Assign roles and permissions to users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-principal" className="text-white">User Principal ID</Label>
              <Input
                id="user-principal"
                placeholder="Enter user principal ID"
                value={accessControl.selectedUser}
                onChange={(e) => setAccessControl({ ...accessControl, selectedUser: e.target.value })}
                className="text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-select" className="text-white">Assign Role</Label>
              <Select 
                value={accessControl.selectedRole} 
                onValueChange={(value) => setAccessControl({ ...accessControl, selectedRole: value })}
              >
                <SelectTrigger id="role-select" className="text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssignRole} className="w-full">
              Assign Role
            </Button>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">System Preferences</CardTitle>
            <CardDescription className="text-white">Advanced system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-white">Send system email notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Analytics Tracking</p>
                <p className="text-sm text-white">Enable platform analytics</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-backup</p>
                <p className="text-sm text-white">Automatic daily backups</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
