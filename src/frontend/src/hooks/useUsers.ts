import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile } from '../backend';

export function useAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}
