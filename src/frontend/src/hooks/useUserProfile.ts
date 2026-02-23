import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile } from '../backend';

export function useUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) {
        console.log('Actor not available for profile query');
        throw new Error('Actor not available');
      }
      console.log('Fetching user profile from backend');
      const profile = await actor.getCallerUserProfile();
      console.log('User profile fetched:', profile ? 'Profile exists' : 'No profile');
      return profile;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    userProfile: query.data,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
    error: query.error,
    refetch: query.refetch,
  };
}
