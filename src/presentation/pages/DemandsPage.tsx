import React, { useState, useCallback } from 'react';
import DemandsTable from '../components/demands/DemandsTable';
import DemandEditModal from '../components/demands/DemandEditModal';
import { Demand } from '../../domain/entities/Demand';
import { DemandService } from '../../application/services/demandService';

const DemandsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentDemand, setCurrentDemand] = useState<Demand | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddDemand = useCallback(() => {
    setCurrentDemand(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditDemand = useCallback(async (demand: Demand) => {
    try {
      setIsLoading(true);
      const completeData = await DemandService.getDemandById(demand.id, null, 5);
      setCurrentDemand(completeData);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes da demanda:', error);
      alert('Erro ao carregar detalhes da demanda. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentDemand(undefined);
  }, []);

  const handleSaveDemand = useCallback(async (demand: Demand) => {
    setIsLoading(true);
    try {
      if (demand.id === 0) {
        const newDemand = {
          startDate: demand.startDate,
          endDate: demand.endDate,
          status: demand.status || 'PLANEJAMENTO'
        };
        
        await DemandService.createDemand(newDemand);
      } else {
        const updates = {
          startDate: demand.startDate,
          endDate: demand.endDate,
          status: demand.status
        };
        
        await DemandService.updateDemand(demand.id, updates);
      }
      
      setIsModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Erro ao salvar demanda:', error);
      if (error instanceof Error) {
        alert(`Erro ao salvar demanda: ${error.message}`);
      } else {
        alert('Erro ao salvar demanda. Verifique o console para mais detalhes.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="p-6">
      <DemandsTable 
        onAddDemand={handleAddDemand} 
        onEditDemand={handleEditDemand} 
      />
      <DemandEditModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDemand}
        demand={currentDemand}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DemandsPage; 