import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Users, Briefcase, Shield } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { AppUserRole } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function RoleSelectionModal() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<AppUserRole | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      value: AppUserRole.student,
      label: 'Student',
      icon: Users,
      description: 'Access projects, build skills, and connect with industry mentors'
    },
    {
      value: AppUserRole.industryPartner,
      label: 'Industry Partner',
      icon: Briefcase,
      description: 'Post projects, find talent, and build your semiconductor team'
    },
    {
      value: AppUserRole.admin,
      label: 'Admin',
      icon: Shield,
      description: 'Manage platform, approve projects, and oversee operations'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole || !name.trim() || !email.trim()) {
      setError('Please fill in all fields and select a role');
      return;
    }

    if (!actor) {
      setError('Connection not ready. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await actor.registerNewUser(name.trim(), email.trim(), selectedRole);
      
      // Invalidate and refetch user profile
      await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      
      // Navigate to appropriate dashboard
      const dashboardMap: Record<AppUserRole, string> = {
        [AppUserRole.student]: '/student-dashboard',
        [AppUserRole.industryPartner]: '/industry-dashboard',
        [AppUserRole.admin]: '/admin-dashboard'
      };
      
      navigate({ to: dashboardMap[selectedRole] });
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Welcome to Bharat Silicon Setu</DialogTitle>
          <DialogDescription>
            Complete your profile to get started. Choose your role and provide your details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Your Role</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedRole === role.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`h-8 w-8 mb-2 ${selectedRole === role.value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <h3 className="font-semibold mb-1">{role.label}</h3>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !selectedRole || !name.trim() || !email.trim()}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Creating Profile...
              </>
            ) : (
              'Complete Registration'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
