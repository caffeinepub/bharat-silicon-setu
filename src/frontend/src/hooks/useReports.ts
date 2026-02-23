import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ReportData, Time } from '../backend';

export function useReportsByDateRange(startDate: Time, endDate: Time) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ReportData[]>({
    queryKey: ['reportsByDateRange', startDate.toString(), endDate.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getReportsByDateRange(startDate, endDate);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAllReports() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ReportData[]>({
    queryKey: ['allReports'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllReports();
    },
    enabled: !!actor && !actorFetching,
  });
}
