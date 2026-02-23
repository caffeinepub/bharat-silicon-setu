import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { AppUserRole } from '../backend';

export function useRoleBasedRedirect() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<AppUserRole | null>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserRole();
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
