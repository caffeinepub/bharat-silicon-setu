import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

interface PlatformMetrics {
  totalUsers: number;
  totalProjects: number;
}

export function usePlatformMetrics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PlatformMetrics>({
    queryKey: ['platformMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      const [totalUsers, totalProjects] = await actor.getPlatformMetrics();
      
      return {
        totalUsers: Number(totalUsers),
        totalProjects: Number(totalProjects),
      };
    },
    enabled: !!actor && !actorFetching,
  });
}
