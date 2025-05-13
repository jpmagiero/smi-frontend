import axios from 'axios';
import { 
  DemandsResponse, 
  Demand, 
  DemandStatus, 
  SimpleDemand, 
  UpdateDemand 
} from '../../domain/entities/Demand';

const API_URL = 'http://localhost:3000';

const mapApiStatus = (apiStatus: string): DemandStatus => {
  switch (apiStatus) {
    case 'PLANNING':
      return 'PLANEJAMENTO';
    case 'IN_PROGRESS':
      return 'EM_ANDAMENTO';
    case 'COMPLETED':
      return 'CONCLUIDO';
    default:
      return 'PLANEJAMENTO';
  }
};

export const fetchDemands = async (cursor: string | null = null, limit: number = 10): Promise<DemandsResponse> => {
  try {
    const params: Record<string, any> = { limit };
    if (cursor) {
      params.cursor = cursor;
    }

    const response = await axios.get(`${API_URL}/demands`, { params });
    
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      throw new Error('Formato de resposta da API inválido');
    }
    
    const mappedData = {
      ...response.data,
      data: response.data.data.map((demand: any) => {
        const items = demand.items || [];
        
        const totalPlan = typeof demand.totalPlan === 'number' ? demand.totalPlan : 
          items.reduce((sum: number, item: any) => sum + (parseFloat(item.totalPlan) || 0), 0);
        
        const totalProd = typeof demand.totalProd === 'number' ? demand.totalProd : 
          items.reduce((sum: number, item: any) => sum + (parseFloat(item.totalProduced) || 0), 0);
        
        const status = ['PLANEJAMENTO', 'EM_ANDAMENTO', 'CONCLUIDO'].includes(demand.status) 
          ? demand.status 
          : mapApiStatus(demand.status || 'PLANNING');
        
        return {
          ...demand,
          status,
          items: items,
          totalPlan,
          totalProd
        };
      }),
    };
    
    return mappedData;
  } catch (error) {
    console.error('Error fetching demands:', error);
    throw error;
  }
};

export const fetchDemandById = async (id: number, cursor: string | null = null, limit: number = 10): Promise<Demand> => {
  try {
    const params: Record<string, any> = { limit };
    if (cursor) {
      params.cursor = cursor;
    }
    
    const response = await axios.get(`${API_URL}/demands/${id}`, { params });
    const demand = response.data;
    
    const totalPlan = typeof demand.totalPlan === 'number' ? demand.totalPlan :
      demand.items?.reduce((sum: number, item: any) => sum + (parseFloat(item.totalPlan) || 0), 0) || 0;
    
    const totalProd = typeof demand.totalProd === 'number' ? demand.totalProd :
      demand.items?.reduce((sum: number, item: any) => sum + (parseFloat(item.totalProduced) || 0), 0) || 0;
    
    const status = ['PLANEJAMENTO', 'EM_ANDAMENTO', 'CONCLUIDO'].includes(demand.status) 
      ? demand.status 
      : mapApiStatus(demand.status || 'PLANNING');
    
    const mappedDemand = {
      ...demand,
      status,
      items: demand.items || [],
      totalPlan,
      totalProd,
      meta: demand.meta || { cursor: null, hasNextPage: false }
    };
    
    return mappedDemand;
  } catch (error) {
    console.error(`Error fetching demand with id ${id}:`, error);
    throw error;
  }
};

export const createDemand = async (demand: SimpleDemand): Promise<Demand> => {
  try {
    const apiDemand = {
      startDate: demand.startDate,
      endDate: demand.endDate,
      status: demand.status === 'PLANEJAMENTO' ? 'PLANNING' : 
              demand.status === 'EM_ANDAMENTO' ? 'IN_PROGRESS' : 
              demand.status === 'CONCLUIDO' ? 'COMPLETED' : 'PLANNING',
    };
    
    const response = await axios.post(`${API_URL}/demands`, apiDemand);
    return fetchDemandById(response.data.id);
  } catch (error) {
    console.error('Error creating demand:', error);
    throw error;
  }
};

export const updateDemand = async (id: number, demand: UpdateDemand): Promise<Demand> => {
  try {
    const apiDemand: any = {};
    
    if (demand.startDate) {
      apiDemand.startDate = demand.startDate;
    }
    
    if (demand.endDate) {
      apiDemand.endDate = demand.endDate;
    }
    
    if (demand.status) {
      apiDemand.status = demand.status === 'PLANEJAMENTO' ? 'PLANNING' : 
                        demand.status === 'EM_ANDAMENTO' ? 'IN_PROGRESS' : 
                        demand.status === 'CONCLUIDO' ? 'COMPLETED' : 'PLANNING';
    }
    
    const response = await axios.put(`${API_URL}/demands/${id}`, apiDemand);
    return fetchDemandById(id);
  } catch (error) {
    console.error(`Error updating demand with id ${id}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('API response error:', error.response.data);
      throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

export const deleteDemand = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/demands/${id}`);
  } catch (error) {
    console.error(`Error deleting demand with id ${id}:`, error);
    throw error;
  }
};

export const fetchItems = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const addItemsToDemand = async (demandId: number, items: { itemId: number; totalPlan: number; totalProduced: number }[]): Promise<any[]> => {
  try {
    const response = await axios.post(`${API_URL}/demands/${demandId}/items`, { items });
    return response.data;
  } catch (error) {
    console.error(`Error adding items to demand ${demandId}:`, error);
    throw error;
  }
};

export const removeItemFromDemand = async (demandId: number, demandItemId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/demands/${demandId}/items/${demandItemId}`);
  } catch (error) {
    console.error(`Error removing demandItem ${demandItemId} from demand ${demandId}:`, error);
    throw error;
  }
}; 