import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Project, UserProfile, ProjectApplication } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

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

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useStudentApplications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProjectApplication[]>({
    queryKey: ['studentApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentApplications();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useProjectApplications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProjectApplication[]>({
    queryKey: ['projectApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjectApplications();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useStudentProfile(studentPrincipal: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['studentProfile', studentPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !studentPrincipal) return null;
      return actor.getUserProfile(studentPrincipal);
    },
    enabled: !!actor && !actorFetching && !!studentPrincipal,
  });
}

export function useAllProjects() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[Principal, Project[]][]>({
    queryKey: ['allProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useApproveProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectCreator, projectIndex }: { projectCreator: Principal; projectIndex: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveProject(projectCreator, projectIndex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProjects'] });
      queryClient.invalidateQueries({ queryKey: ['approvedProjects'] });
    },
  });
}

export function useRejectProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectCreator, projectIndex }: { projectCreator: Principal; projectIndex: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectProject(projectCreator, projectIndex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProjects'] });
      queryClient.invalidateQueries({ queryKey: ['approvedProjects'] });
    },
  });
}
