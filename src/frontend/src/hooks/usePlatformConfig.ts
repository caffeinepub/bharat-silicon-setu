import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PlatformConfig } from '../backend';

export function usePlatformConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PlatformConfig>({
    queryKey: ['platformConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPlatformConfig();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdatePlatformConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newConfig: PlatformConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePlatformConfig(newConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformConfig'] });
    },
  });
}
