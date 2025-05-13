export type DemandStatus = 'PLANEJAMENTO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Item {
  id: number;
  sku: string;
  description: string;
}

export interface DemandItem {
  id: number;
  demandId: number;
  itemId: number;
  totalPlan: number;
  totalProduced: number;
  item: Item;
}

export interface Demand {
  id: number;
  startDate: string;
  endDate: string;
  items: DemandItem[];
  totalPlan?: number;
  totalProd?: number;
  status?: DemandStatus;
  week?: number;
  meta?: {
    cursor: string | null;
    hasNextPage: boolean;
    totalCount?: number;
  };
}

export interface DemandsResponse {
  data: Demand[];
  meta: {
    cursor: string | null;
    hasNextPage: boolean;
    totalCount: number;
  };
}

export interface SimpleDemand {
  startDate: string;
  endDate: string;
  status?: DemandStatus;
}

export interface UpdateDemand {
  startDate?: string;
  endDate?: string;
  status?: DemandStatus;
} 