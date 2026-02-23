import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { GraduationCap, Building2, Shield } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { AppUserRole } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface RoleSelectionModalProps {
  onComplete: (dashboardPath: string) => void;
}

export default function RoleSelectionModal({ onComplete }: RoleSelectionModalProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<AppUserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      value: AppUserRole.student,
      label: 'Student',
      icon: GraduationCap,
      description: 'Access projects, build skills, and connect with industry mentors to accelerate your semiconductor career',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      value: AppUserRole.industryPartner,
      label: 'Industry Partner',
      icon: Building2,
      description: 'Post projects, discover talent, and build your semiconductor team with skilled professionals',
      color: 'from-purple-500 to-pink-500'
    },
    {
      value: AppUserRole.admin,
      label: 'Admin',
      icon: Shield,
      description: 'Manage the platform, approve projects, oversee operations, and ensure quality standards',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleRoleSelect = async (role: AppUserRole) => {
    if (!actor) {
      setError('Connection not ready. Please try again.');
      return;
    }

    setSelectedRole(role);
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Registering user with role:', role);
      
      // Register with minimal information - just the role
      await actor.register('', '', role);
      
      console.log('Registration successful, invalidating queries');
      
      // Invalidate all queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      await queryClient.invalidateQueries({ queryKey: ['userRole'] });
      
      // Wait a bit for queries to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Determine dashboard path
      const dashboardMap: Record<AppUserRole, string> = {
        [AppUserRole.student]: '/student-dashboard',
        [AppUserRole.industryPartner]: '/industry-dashboard',
        [AppUserRole.admin]: '/admin-dashboard'
      };
      
      const dashboardPath = dashboardMap[role];
      console.log('Navigating to:', dashboardPath);
      
      // Call the onComplete callback to trigger navigation
      onComplete(dashboardPath);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
      setIsSubmitting(false);
      setSelectedRole(null);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-3xl font-display text-center text-white">Welcome to Bharat Silicon Setu</DialogTitle>
          <DialogDescription className="text-center text-base text-white">
            Choose your role to get started and unlock the full potential of our platform
          </DialogDescription>
        </DialogHeader>

        <div className="mt-8 space-y-6">
          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.value;
              const isDisabled = isSubmitting;
              
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => !isDisabled && handleRoleSelect(role.value)}
                  disabled={isDisabled}
                  className={`group relative p-8 border-2 rounded-2xl text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-lg scale-[1.02]'
                      : 'border-border hover:border-primary/50 hover:shadow-md hover:scale-[1.01]'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-6">
                    {/* Icon with gradient background */}
                    <div className={`shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors text-white">
                        {role.label}
                      </h3>
                      <p className="text-base text-white leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Loading indicator for selected role */}
                  {isSelected && isSubmitting && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-lg font-semibold text-white">Setting up your account...</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border-2 border-destructive/20 rounded-xl text-sm text-destructive font-medium">
              {error}
            </div>
          )}

          {/* Helper text */}
          <p className="text-center text-sm text-white">
            You can update your profile details anytime after registration
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
