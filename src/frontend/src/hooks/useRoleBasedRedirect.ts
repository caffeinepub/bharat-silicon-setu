import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { AppUserRole } from '../backend';

export function useRoleBasedRedirect() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<AppUserRole | null>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) {
        console.log('Actor not available for role query');
        throw new Error('Actor not available');
      }
      console.log('Fetching user role from backend');
      const role = await actor.getUserRole();
      console.log('User role fetched:', role);
      return role;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  const getDashboardPath = (role: AppUserRole | null | undefined): string => {
    if (!role) return '/';
    
    const dashboardMap: Record<AppUserRole, string> = {
      [AppUserRole.student]: '/student-dashboard',
      [AppUserRole.industryPartner]: '/industry-dashboard',
      [AppUserRole.admin]: '/admin-dashboard'
    };
    
    return dashboardMap[role];
  };

  return {
    userRole: query.data,
    dashboardPath: getDashboardPath(query.data ?? null),
    isLoading: actorFetching || query.isLoading,
    error: query.error,
  };
}
