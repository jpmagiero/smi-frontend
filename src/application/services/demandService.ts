import {
  fetchDemands,
  fetchDemandById,
  createDemand,
  updateDemand,
  deleteDemand,
  fetchItems,
  addItemsToDemand,
  removeItemFromDemand
} from '../../infrastructure/api/demandApi';

import {
  Demand,
  DemandsResponse,
  SimpleDemand,
  UpdateDemand
} from '../../domain/entities/Demand';

export const DemandService = {
  getDemands: async (cursor: string | null = null, limit: number = 10): Promise<DemandsResponse> => {
    return fetchDemands(cursor, limit);
  },

  getDemandById: async (id: number, cursor: string | null = null, limit: number = 10): Promise<Demand> => {
    return fetchDemandById(id, cursor, limit);
  },

  createDemand: async (demand: SimpleDemand): Promise<Demand> => {
    return createDemand(demand);
  },

  updateDemand: async (id: number, demand: UpdateDemand): Promise<Demand> => {
    return updateDemand(id, demand);
  },

  deleteDemand: async (id: number): Promise<void> => {
    return deleteDemand(id);
  },

  getItems: async (): Promise<any[]> => {
    return fetchItems();
  },

  addItemsToDemand: async (demandId: number, items: { itemId: number; totalPlan: number; totalProduced: number }[]): Promise<any[]> => {
    return addItemsToDemand(demandId, items);
  },

  removeItemFromDemand: async (demandId: number, demandItemId: number): Promise<void> => {
    return removeItemFromDemand(demandId, demandItemId);
  }
}; 