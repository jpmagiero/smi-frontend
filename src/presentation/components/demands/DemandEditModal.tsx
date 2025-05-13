import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  CircularProgress
} from '@mui/material';
import { Demand } from '../../../domain/entities/Demand';
import { useDemandEditForm } from '../../hooks/useDemandEditForm';
import DemandPeriodSection from './DemandPeriodSection';
import DemandItemsTable from './DemandItemsTable';
import DemandAddItemSection from './DemandAddItemSection';
import DemandSummary from './DemandSummary';
import DemandModalHeader from './DemandModalHeader';
import DemandModalActions from './DemandModalActions';

interface DemandEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (demand: Demand) => void;
  demand?: Demand;
  isLoading?: boolean;
}

const DemandEditModal: React.FC<DemandEditModalProps> = ({
  open,
  onClose,
  onSave,
  demand,
  isLoading = false,
}) => {
  const {
    editedDemand,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    allDemandItems,
    hasMoreItems,
    loadingMoreItems,
    handleLoadMoreItems,
    handleRemoveItem,
    availableItems,
    selectedItem,
    setSelectedItem,
    searchTerm,
    setSearchTerm,
    newItem,
    setNewItem,
    isLoadingItems,
    handleAddItem,
    getDemandToSave,
    getWeekNumber,
    getFormattedPeriod
  } = useDemandEditForm(demand);

  if (!editedDemand) return null;

  const weekNumber = editedDemand.week || getWeekNumber(editedDemand.startDate);
  const period = getFormattedPeriod();

  const handleSave = () => {
    const demandToSave = getDemandToSave();
    if (demandToSave) {
      onSave(demandToSave);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: 'rounded-lg',
      }}
    >
      <DemandModalHeader 
        weekNumber={weekNumber}
        period={period}
        onClose={onClose}
      />

      <DialogContent dividers>
        {isLoading ? (
          <Box className="flex justify-center items-center p-8">
            <CircularProgress style={{ color: 'var(--color-orange-primary)' }} />
          </Box>
        ) : (
          <>
            <DemandPeriodSection
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            
            <DemandItemsTable
              items={allDemandItems}
              onRemoveItem={handleRemoveItem}
              isLoading={isLoading}
              hasMoreItems={hasMoreItems}
              onLoadMoreItems={handleLoadMoreItems}
              loadingMoreItems={loadingMoreItems}
            />

            <DemandAddItemSection
              availableItems={availableItems}
              selectedItem={selectedItem}
              searchTerm={searchTerm}
              totalPlan={newItem.totalPlan}
              totalProduced={newItem.totalProduced}
              isLoading={isLoadingItems}
              onItemChange={setSelectedItem}
              onSearchChange={setSearchTerm}
              onTotalPlanChange={(value) => setNewItem({ ...newItem, totalPlan: value })}
              onTotalProducedChange={(value) => setNewItem({ ...newItem, totalProduced: value })}
              onAddItem={handleAddItem}
            />

            <DemandSummary
              totalPlan={editedDemand.totalPlan}
              totalProd={editedDemand.totalProd}
            />
          </>
        )}
      </DialogContent>

      <DemandModalActions
        onClose={onClose}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </Dialog>
  );
};

export default DemandEditModal; 