import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import ItemSearchForm from './ItemSearchForm';
import { Item } from '../../../domain/entities/Demand';

interface DemandAddItemSectionProps {
  availableItems: Item[];
  selectedItem: Item | null;
  searchTerm: string;
  totalPlan: string;
  totalProduced: string;
  isLoading: boolean;
  onItemChange: (item: Item | null) => void;
  onSearchChange: (term: string) => void;
  onTotalPlanChange: (value: string) => void;
  onTotalProducedChange: (value: string) => void;
  onAddItem: () => Promise<void>;
}

const DemandAddItemSection: React.FC<DemandAddItemSectionProps> = (props) => {
  return (
    <>
      <Divider className="my-4" />
      
      <Box className="bg-gray-100 p-4 rounded-md mb-4">
        <Typography variant="subtitle1" className="mb-2 font-bold">
          Adicionar Item à Demanda
        </Typography>
        
        <ItemSearchForm {...props} />
      </Box>
    </>
  );
};

export default DemandAddItemSection; 