import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useRoleBasedRedirect } from '../hooks/useRoleBasedRedirect';
import { AppUserRole } from '../backend';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'industryPartner' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { userRole, isLoading: roleLoading } = useRoleBasedRedirect();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for initialization to complete
    if (isInitializing || roleLoading) return;

    // Redirect to landing if not authenticated
    if (!identity) {
      navigate({ to: '/' });
      return;
    }

    // Check role-based access if required
    if (requiredRole && userRole) {
      const roleMap: Record<string, AppUserRole> = {
        student: AppUserRole.student,
        industryPartner: AppUserRole.industryPartner,
        admin: AppUserRole.admin
      };

      if (userRole !== roleMap[requiredRole]) {
        // Redirect to correct dashboard based on user's actual role
        const dashboardMap: Record<AppUserRole, string> = {
          [AppUserRole.student]: '/student-dashboard',
          [AppUserRole.industryPartner]: '/industry-dashboard',
          [AppUserRole.admin]: '/admin-dashboard'
        };
        navigate({ to: dashboardMap[userRole] });
      }
    }
  }, [identity, isInitializing, requiredRole, userRole, roleLoading, navigate]);

  // Show loading state while checking authentication
  if (isInitializing || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children until authentication is verified
  if (!identity) {
    return null;
  }

  return <>{children}</>;
}
