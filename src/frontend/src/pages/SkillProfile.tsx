import { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useSaveCallerUserProfile } from '../hooks/useProjects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Award, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { UserProfile } from '../backend';

export default function SkillProfile() {
  const { userProfile, isLoading } = useUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();
  
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (userProfile && 'skills' in userProfile) {
      setSkills((userProfile as any).skills || []);
    }
  }, [userProfile]);

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    
    if (!trimmedSkill) {
      toast.error('Skill name cannot be empty');
      return;
    }
    
    if (skills.includes(trimmedSkill)) {
      toast.error('This skill is already in your profile');
      return;
    }
    
    setSkills([...skills, trimmedSkill]);
    setNewSkill('');
    toast.success('Skill added! Remember to save your profile.');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
    toast.success('Skill removed! Remember to save your profile.');
  };

  const handleSave = async () => {
    if (!userProfile) {
      toast.error('Profile not loaded');
      return;
    }
    
    try {
      const updatedProfile: UserProfile = {
        ...userProfile,
        ...(skills.length > 0 && { skills } as any)
      };
      
      await saveProfileMutation.mutateAsync(updatedProfile);
      toast.success('Profile saved successfully!');
    } catch (error) {
      toast.error('Failed to save profile');
      console.error('Save error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-white">Loading your profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Skill Profile</h1>
          <p className="text-white">Manage your skills and expertise</p>
        </div>

        {/* Skills Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Technical Skills</CardTitle>
            <CardDescription className="text-white">Your semiconductor expertise and proficiency levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.length === 0 ? (
              <p className="text-white text-center py-8">No skills added yet. Add your first skill below!</p>
            ) : (
              skills.map((skill, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-white font-medium">{skill}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSkill(skill)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Add New Skill */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Add New Skill</CardTitle>
            <CardDescription className="text-white">Expand your skill profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skill-name" className="text-white">Skill Name</Label>
              <Input
                id="skill-name"
                placeholder="e.g., VLSI Design, RTL Design, FPGA Programming"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="text-white"
              />
            </div>
            <Button onClick={handleAddSkill} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave} 
          disabled={saveProfileMutation.isPending}
          className="w-full"
          size="lg"
        >
          {saveProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
}
