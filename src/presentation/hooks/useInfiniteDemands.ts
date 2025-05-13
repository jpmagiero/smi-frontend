import { useState, useCallback } from 'react';
import { Demand } from '../../domain/entities/Demand';
import { DemandService } from '../../application/services/demandService';

export const useInfiniteDemands = () => {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoading) return;

    setIsLoading(true);
    
    try {
      const response = await DemandService.getDemands(cursor);
      
      if (response.data && Array.isArray(response.data)) {
        setDemands((prevDemands) => {
          if (cursor === null) {
            return [...response.data];
          }
          
          const newDemands = [...response.data];
          const existingIds = new Set(prevDemands.map(d => d.id));
          const uniqueNewDemands = newDemands.filter(d => !existingIds.has(d.id));
          
          return [...prevDemands, ...uniqueNewDemands];
        });
      }
      
      setCursor(response.meta.cursor);
      setHasNextPage(response.meta.hasNextPage);
      setError(null);
    } catch (err) {
      console.error("Error loading demands:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch demands'));
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasNextPage, isLoading]);

  const refresh = useCallback(async () => {
    setDemands([]);
    setCursor(null);
    setHasNextPage(true);
    setError(null);
    setIsLoading(false);
    
    setTimeout(() => {
      loadMore();
    }, 0);
  }, [loadMore]);

  return {
    demands,
    isLoading,
    error,
    hasNextPage,
    loadMore,
    refresh
  };
}; 