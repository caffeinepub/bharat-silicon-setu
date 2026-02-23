import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { RevenueData } from '../backend';

export function useRevenueTotal() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['revenueTotal'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTotalRevenue();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAllRevenue() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RevenueData[]>({
    queryKey: ['allRevenue'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllRevenue();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useMonthlyRevenue(month: bigint, year: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['monthlyRevenue', month.toString(), year.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMonthlyRevenue(month, year);
    },
    enabled: !!actor && !actorFetching,
  });
}
