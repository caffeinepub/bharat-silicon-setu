import { useState } from 'react';
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

export default function SkillProfile() {
  const { userProfile, isLoading } = useUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();
  
  // Mock skills with strength percentages
  const [skills, setSkills] = useState([
    { name: 'VLSI Design', strength: 85 },
    { name: 'RTL Design', strength: 78 },
    { name: 'Embedded Systems', strength: 92 },
    { name: 'FPGA Programming', strength: 70 }
  ]);
  
  const [newSkill, setNewSkill] = useState('');
  const [newStrength, setNewStrength] = useState('50');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill.trim(), strength: parseInt(newStrength) || 50 }]);
      setNewSkill('');
      setNewStrength('50');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!userProfile) return;
    
    try {
      await saveProfileMutation.mutateAsync(userProfile);
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
          <CardContent className="space-y-6">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-white font-medium">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-semibold">{skill.strength}%</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkill(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={skill.strength} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Add New Skill */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Add New Skill</CardTitle>
            <CardDescription className="text-white">Expand your skill profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skill-name" className="text-white">Skill Name</Label>
                <Input
                  id="skill-name"
                  placeholder="e.g., Digital Signal Processing"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skill-strength" className="text-white">Proficiency (%)</Label>
                <Input
                  id="skill-strength"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="50"
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  className="text-white"
                />
              </div>
            </div>
            <Button onClick={handleAddSkill} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Certifications & Education</CardTitle>
            <CardDescription className="text-white">Your academic and professional credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="text-white">2024</Badge>
                <div>
                  <p className="text-white font-medium">B.Tech in Electronics Engineering</p>
                  <p className="text-sm text-white">University Name</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="text-white">2023</Badge>
                <div>
                  <p className="text-white font-medium">VLSI Design Certification</p>
                  <p className="text-sm text-white">Industry Partner</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saveProfileMutation.isPending} className="w-full">
          {saveProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
}
