import { useState, useEffect } from 'react';
import { usePlatformConfig, useUpdatePlatformConfig } from '../hooks/usePlatformConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { data: platformConfig, isLoading } = usePlatformConfig();
  const updateConfigMutation = useUpdatePlatformConfig();
  
  const [formData, setFormData] = useState({
    siteName: '',
    maintenanceMode: false,
    registrationOpen: true
  });

  useEffect(() => {
    if (platformConfig) {
      setFormData({
        siteName: platformConfig.siteName,
        maintenanceMode: platformConfig.maintenanceMode,
        registrationOpen: platformConfig.registrationOpen
      });
    }
  }, [platformConfig]);

  const handleSave = async () => {
    if (!formData.siteName.trim()) {
      toast.error('Site name is required');
      return;
    }
    
    try {
      await updateConfigMutation.mutateAsync({
        siteName: formData.siteName.trim(),
        maintenanceMode: formData.maintenanceMode,
        registrationOpen: formData.registrationOpen
      });
      toast.success('Platform settings saved successfully!');
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
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Admin Settings</h1>
          <p className="text-white">Manage platform configuration and settings</p>
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
                placeholder="Enter site name"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="text-white"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance-mode" className="text-white">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable platform access for maintenance
                </p>
              </div>
              <Switch
                id="maintenance-mode"
                checked={formData.maintenanceMode}
                onCheckedChange={(checked) => setFormData({ ...formData, maintenanceMode: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="registration-open" className="text-white">Open Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to register on the platform
                </p>
              </div>
              <Switch
                id="registration-open"
                checked={formData.registrationOpen}
                onCheckedChange={(checked) => setFormData({ ...formData, registrationOpen: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Platform Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Platform Information</CardTitle>
            <CardDescription className="text-white">Current platform status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-white">Current Site Name</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {platformConfig?.siteName || 'Not set'}
              </p>
            </div>
            <div>
              <Label className="text-white">Maintenance Status</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {platformConfig?.maintenanceMode ? 'Active - Platform is in maintenance mode' : 'Inactive - Platform is operational'}
              </p>
            </div>
            <div>
              <Label className="text-white">Registration Status</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {platformConfig?.registrationOpen ? 'Open - New users can register' : 'Closed - Registration is disabled'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave} 
          disabled={updateConfigMutation.isPending}
          className="w-full"
          size="lg"
        >
          {updateConfigMutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
