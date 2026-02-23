import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ContactRequest } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

export function useGetContactRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ContactRequest[]>({
    queryKey: ['contactRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSendContactRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ to, message }: { to: Principal; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendContactRequest(to, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
    },
  });
}
