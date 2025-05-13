import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { Item } from '../../../domain/entities/Demand';

interface ItemSearchFormProps {
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

const ItemSearchForm: React.FC<ItemSearchFormProps> = ({
  availableItems,
  selectedItem,
  searchTerm,
  totalPlan,
  totalProduced,
  isLoading,
  onItemChange,
  onSearchChange,
  onTotalPlanChange,
  onTotalProducedChange,
  onAddItem
}) => {
  if (isLoading) {
    return (
      <Box className="flex justify-center py-4">
        <CircularProgress size={24} style={{ color: 'var(--color-orange-primary)' }} />
      </Box>
    );
  }

  if (availableItems.length === 0) {
    return (
      <Typography className="text-gray-500 py-2">
        Não há itens disponíveis. Cadastre itens primeiro.
      </Typography>
    );
  }

  return (
    <>
      <Box className="mb-4 mt-6">
        <Typography 
          variant="subtitle1" 
          className="mb-8 text-gray-800 font-bold"
        >
          1. Primeiro, busque e selecione um item:
        </Typography>
        <Autocomplete
          value={selectedItem}
          onChange={(event, newValue) => {
            onItemChange(newValue);
          }}
          inputValue={searchTerm}
          onInputChange={(event, newInputValue) => {
            onSearchChange(newInputValue);
          }}
          id="item-search"
          options={availableItems}
          getOptionLabel={(option) => `${option.sku} - ${option.description}`}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Buscar por código ou descrição" 
              variant="outlined" 
              fullWidth
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <SearchIcon color="action" />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>
      
      {selectedItem && (
        <Box className="mt-4">
          <Typography variant="subtitle2" className="mb-2 text-gray-700">
            2. Agora, informe as quantidades:
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-6">
              <Typography variant="body2" className="font-medium text-gray-900">
                Item selecionado: <span className="font-bold">{selectedItem.sku} - {selectedItem.description}</span>
              </Typography>
            </div>
            
            <div className="sm:col-span-2">
              <TextField
                label="Total Plan (Ton)"
                variant="outlined"
                size="small"
                type="number"
                fullWidth
                value={totalPlan}
                onChange={(e) => onTotalPlanChange(e.target.value)}
                inputProps={{ min: 0 }}
              />
            </div>
            
            <div className="sm:col-span-2">
              <TextField
                label="Total Produzido (Ton)"
                variant="outlined"
                size="small"
                type="number"
                fullWidth
                value={totalProduced}
                onChange={(e) => onTotalProducedChange(e.target.value)}
                inputProps={{ min: 0 }}
              />
            </div>
            
            <div className="sm:col-span-2 flex justify-end">
              <Button
                variant="contained"
                onClick={onAddItem}
                style={{ backgroundColor: 'var(--color-orange-primary)' }}
                startIcon={<AddIcon />}
                fullWidth
              >
                Adicionar
              </Button>
            </div>
          </div>
        </Box>
      )}
    </>
  );
};

export default ItemSearchForm; 