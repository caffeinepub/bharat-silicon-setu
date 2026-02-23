import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { AnalyticsData } from '../backend';

export function useAnalyticsData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AnalyticsData>({
    queryKey: ['analyticsData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalyticsData();
    },
    enabled: !!actor && !actorFetching,
  });
}
