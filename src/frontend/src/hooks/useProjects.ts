import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Project } from '../backend';

export function useGetApprovedProjects() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['approvedProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedProjects();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetUserProjects() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['userProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserProjects();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveProject(project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      queryClient.invalidateQueries({ queryKey: ['approvedProjects'] });
    },
  });
}
