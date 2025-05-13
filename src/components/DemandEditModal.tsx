import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Typography,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Autocomplete,
  Pagination,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  MoreHoriz as MoreIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
} from '@mui/icons-material';
import { Demand, DemandStatus, Item, DemandItem } from '@/types/demand';
import { fetchItems, addItemsToDemand, removeItemFromDemand, fetchDemandById } from '@/services/demandService';

interface DemandEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (demand: Demand) => void;
  demand?: Demand;
  isLoading?: boolean;
}

interface NewItemForm {
  itemId: number;
  totalPlan: string;
  totalProduced: string;
}

const DemandEditModal: React.FC<DemandEditModalProps> = ({
  open,
  onClose,
  onSave,
  demand,
  isLoading = false,
}) => {
  const [editedDemand, setEditedDemand] = useState<Demand | null>(null);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<NewItemForm>({
    itemId: 0,
    totalPlan: '0',
    totalProduced: '0',
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [itemsPage, setItemsPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loadingMoreItems, setLoadingMoreItems] = useState(false);
  const [itemsCursor, setItemsCursor] = useState<string | null>(null);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const [allDemandItems, setAllDemandItems] = useState<DemandItem[]>([]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(availableItems);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = availableItems.filter(
        item => 
          item.sku.toLowerCase().includes(lowercaseSearch) || 
          item.description.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, availableItems]);
  
  useEffect(() => {
    if (selectedItem) {
      setNewItem({
        ...newItem,
        itemId: selectedItem.id,
      });
    } else {
      setNewItem({
        ...newItem,
        itemId: 0,
      });
    }
  }, [selectedItem]);
  
  const getWeekNumber = (startDate: string): number => {
    try {
      const date = new Date(startDate);
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    } catch (e) {
      return 0; 
    }
  };

  const getFormattedPeriod = (): string => {
    if (!editedDemand) return '';
    try {
      const start = new Date(editedDemand.startDate).toLocaleDateString('pt-BR');
      const end = new Date(editedDemand.endDate).toLocaleDateString('pt-BR');
      return `${start} - ${end}`;
    } catch (e) {
      return 'Período inválido';
    }
  };

  useEffect(() => {
    const loadItems = async () => {
      setIsLoadingItems(true);
      try {
        const items = await fetchItems();
        setAvailableItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.error('Erro ao carregar itens:', error);
      } finally {
        setIsLoadingItems(false);
      }
    };
    
    if (open) {
      loadItems();
    }
  }, [open]);

  const loadDemandItems = useCallback(async (demandId: number, newCursor: string | null = null) => {
    if (!demandId || demandId === 0) return;
    
    try {
      setLoadingMoreItems(true);
      const response = await fetchDemandById(demandId, newCursor, itemsPerPage);
      
      if (newCursor === null) {
        setAllDemandItems(response.items || []);
      } else {
        setAllDemandItems(prev => [...prev, ...response.items]);
      }
      
      setItemsCursor(response.meta?.cursor || null);
      setHasMoreItems(response.meta?.hasNextPage || false);
      
      if (newCursor === null) {
        setEditedDemand({
          ...response,
          items: response.items || []
        });
      }
    } catch (error) {
      console.error('Erro ao carregar itens da demanda:', error);
    } finally {
      setLoadingMoreItems(false);
    }
  }, [itemsPerPage]);

  const handleLoadMoreItems = useCallback(() => {
    if (editedDemand && editedDemand.id !== 0 && hasMoreItems && !loadingMoreItems) {
      loadDemandItems(editedDemand.id, itemsCursor);
    }
  }, [editedDemand, hasMoreItems, loadingMoreItems, itemsCursor, loadDemandItems]);

  useEffect(() => {
    if (demand) {
      console.log('Demand received in modal:', demand);
      console.log('Demand items:', demand.items);
      
      setEditedDemand({
        ...demand,
        items: [...(demand.items || [])],
      });
      setAllDemandItems(demand.items || []);
      setItemsCursor(demand.meta?.cursor || null);
      setHasMoreItems(demand.meta?.hasNextPage || false);
      setStartDate(new Date(demand.startDate));
      setEndDate(new Date(demand.endDate));
    } else {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      setStartDate(today);
      setEndDate(nextWeek);
      
      setEditedDemand({
        id: 0,
        startDate: today.toISOString(),
        endDate: nextWeek.toISOString(),
        items: [],
        totalPlan: 0,
        totalProd: 0,
        status: 'PLANEJAMENTO' as DemandStatus,
        week: getWeekNumber(today.toISOString()),
      });
      setAllDemandItems([]);
      setItemsCursor(null);
      setHasMoreItems(false);
    }
  }, [demand]);

  useEffect(() => {
    if (open && demand && demand.id !== 0) {
      loadDemandItems(demand.id, null);
    }
  }, [open, demand, loadDemandItems]);

  useEffect(() => {
    if (editedDemand && startDate && endDate) {
      setEditedDemand({
        ...editedDemand,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    }
  }, [startDate, endDate]);

  const isItemAlreadyAdded = (itemId: number): boolean => {
    return editedDemand?.items.some(demandItem => demandItem.itemId === itemId) || false;
  };

  const getAvailableItemsForSelect = (): Item[] => {
    if (!editedDemand) return [];
    return filteredItems.filter(item => !isItemAlreadyAdded(item.id));
  };

  const handleAddItem = async (): Promise<void> => {
    if (!editedDemand || !selectedItem) return;
    
    const totalPlan = parseFloat(newItem.totalPlan) || 0;
    const totalProduced = parseFloat(newItem.totalProduced) || 0;
    
    if (editedDemand.id === 0) {
      const newDemandItem: DemandItem = {
        id: Math.floor(Math.random() * -1000) - 1, 
        demandId: 0,
        itemId: selectedItem.id,
        totalPlan,
        totalProduced,
        item: selectedItem,
      };
      
      const updatedItems = [...editedDemand.items, newDemandItem];
      const updatedAllItems = [...allDemandItems, newDemandItem];
      const calculatedTotalPlan = updatedItems.reduce((sum, item) => sum + item.totalPlan, 0);
      const calculatedTotalProd = updatedItems.reduce((sum, item) => sum + item.totalProduced, 0);
      
      setEditedDemand({
        ...editedDemand,
        items: updatedItems,
        totalPlan: calculatedTotalPlan,
        totalProd: calculatedTotalProd,
      });
      setAllDemandItems(updatedAllItems);
    } 
    else {
      try {
        const response = await addItemsToDemand(editedDemand.id, [{
          itemId: selectedItem.id,
          totalPlan,
          totalProduced
        }]);
        
        if (response && response.length > 0) {
          const updatedItems = [...editedDemand.items, ...response];
          const updatedAllItems = [...allDemandItems, ...response];
          const calculatedTotalPlan = updatedItems.reduce((sum, item) => sum + item.totalPlan, 0);
          const calculatedTotalProd = updatedItems.reduce((sum, item) => sum + item.totalProduced, 0);
          
          setEditedDemand({
            ...editedDemand,
            items: updatedItems,
            totalPlan: calculatedTotalPlan,
            totalProd: calculatedTotalProd,
          });
          setAllDemandItems(updatedAllItems);
        }
      } catch (error) {
        console.error('Erro ao adicionar item:', error);
      }
    }
    
    setSelectedItem(null);
    setNewItem({
      itemId: 0,
      totalPlan: '0',
      totalProduced: '0',
    });
    setSearchTerm('');
  };

  const handleRemoveItem = async (demandItemId: number): Promise<void> => {
    if (!editedDemand) return;
    
    if (editedDemand.id === 0) {
      const updatedItems = editedDemand.items.filter(item => item.id !== demandItemId);
      const updatedAllItems = allDemandItems.filter(item => item.id !== demandItemId);
      const calculatedTotalPlan = updatedItems.reduce((sum, item) => sum + item.totalPlan, 0);
      const calculatedTotalProd = updatedItems.reduce((sum, item) => sum + item.totalProduced, 0);
      
      setEditedDemand({
        ...editedDemand,
        items: updatedItems,
        totalPlan: calculatedTotalPlan,
        totalProd: calculatedTotalProd,
      });
      setAllDemandItems(updatedAllItems);
    } 
    else {
      try {
        await removeItemFromDemand(editedDemand.id, demandItemId);
        
        const updatedItems = editedDemand.items.filter(item => item.id !== demandItemId);
        const updatedAllItems = allDemandItems.filter(item => item.id !== demandItemId);
        const calculatedTotalPlan = updatedItems.reduce((sum, item) => sum + item.totalPlan, 0);
        const calculatedTotalProd = updatedItems.reduce((sum, item) => sum + item.totalProduced, 0);
        
        setEditedDemand({
          ...editedDemand,
          items: updatedItems,
          totalPlan: calculatedTotalPlan,
          totalProd: calculatedTotalProd,
        });
        setAllDemandItems(updatedAllItems);
      } catch (error) {
        console.error(`Erro ao remover item ${demandItemId}:`, error);
      }
    }
  };

  const handleSave = (): void => {
    if (editedDemand) {
      console.log('In modal, preparing to save demand:', editedDemand);
      
      const demandToSave: Demand = {
        id: editedDemand.id,
        startDate: editedDemand.startDate,
        endDate: editedDemand.endDate,
        status: editedDemand.status || 'PLANEJAMENTO',
        items: editedDemand.items || [],
        totalPlan: editedDemand.totalPlan,
        totalProd: editedDemand.totalProd,
      };
      
      onSave(demandToSave);
    }
  };

  if (!editedDemand) return null;

  const weekNumber = editedDemand.week || getWeekNumber(editedDemand.startDate);
  const period = getFormattedPeriod();
  const nonAddedItems = getAvailableItemsForSelect();

  const currentItems = editedDemand.id === 0 
    ? allDemandItems
    : allDemandItems;

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
      <DialogTitle className="flex justify-between items-center bg-black-primary text-white">
        <div>
          <Typography variant="h6" className="font-bold">
            SEMANA {weekNumber}
          </Typography>
          <Typography variant="body2">
            {period}
          </Typography>
        </div>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box className="flex justify-center items-center p-8">
            <CircularProgress style={{ color: 'var(--color-orange-primary)' }} />
          </Box>
        ) : (
          <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box className="mb-6 p-4 bg-gray-50 rounded-md">
                <Typography variant="subtitle1" className="mb-3 font-bold">
                  Período da Demanda
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DatePicker
                    label="Data Inicial"
                    value={startDate}
                    onChange={(newDate) => setStartDate(newDate)}
                  />
                  <DatePicker
                    label="Data Final"
                    value={endDate}
                    onChange={(newDate) => setEndDate(newDate)}
                    minDate={startDate || undefined}
                  />
                </div>
              </Box>
            </LocalizationProvider>
            
            <Typography variant="h6" className="mb-4 font-bold">
              Itens da Demanda
            </Typography>

            <Table className="mb-2">
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell width="120px">SKU</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell align="right" width="150px">Total Plan (Ton)</TableCell>
                  <TableCell align="right" width="150px">Total Produzido (Ton)</TableCell>
                  <TableCell width="80px" align="center">Remover</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" className="py-4">
                      <Typography className="text-gray-500">Nenhum item adicionado</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((demandItem) => (
                    <TableRow key={demandItem.id}>
                      <TableCell>{demandItem.item.sku}</TableCell>
                      <TableCell>{demandItem.item.description}</TableCell>
                      <TableCell align="right">{demandItem.totalPlan.toLocaleString('pt-BR')}</TableCell>
                      <TableCell align="right">{demandItem.totalProduced.toLocaleString('pt-BR')}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(demandItem.id)}
                          className="text-red-500"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Paginação de itens */}
            {editedDemand.id !== 0 && (
              <Box className="flex justify-center items-center mb-4">
                {loadingMoreItems ? (
                  <CircularProgress size={24} style={{ color: 'var(--color-orange-primary)' }} />
                ) : hasMoreItems ? (
                  <Button 
                    variant="outlined"
                    size="small"
                    onClick={handleLoadMoreItems}
                    startIcon={<MoreIcon />}
                    className="text-gray-600"
                  >
                    Carregar mais itens
                  </Button>
                ) : allDemandItems.length > 0 ? (
                  <Typography variant="body2" className="text-gray-500">
                    Todos os itens carregados
                  </Typography>
                ) : null}
              </Box>
            )}

            <Divider className="my-4" />
            
            <Box className="bg-gray-100 p-4 rounded-md mb-4">
              <Typography variant="subtitle1" className="mb-2 font-bold">
                Adicionar Item à Demanda
              </Typography>
              
              {isLoadingItems ? (
                <Box className="flex justify-center py-4">
                  <CircularProgress size={24} style={{ color: 'var(--color-orange-primary)' }} />
                </Box>
              ) : availableItems.length === 0 ? (
                <Typography className="text-gray-500 py-2">
                  Não há itens disponíveis. Cadastre itens primeiro.
                </Typography>
              ) : (
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
                        setSelectedItem(newValue);
                      }}
                      inputValue={searchTerm}
                      onInputChange={(event, newInputValue) => {
                        setSearchTerm(newInputValue);
                      }}
                      id="item-search"
                      options={nonAddedItems}
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
                            value={newItem.totalPlan}
                            onChange={(e) => setNewItem({ ...newItem, totalPlan: e.target.value })}
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
                            value={newItem.totalProduced}
                            onChange={(e) => setNewItem({ ...newItem, totalProduced: e.target.value })}
                            inputProps={{ min: 0 }}
                          />
                        </div>
                        
                        <div className="sm:col-span-2 flex justify-end">
                          <Button
                            variant="contained"
                            onClick={handleAddItem}
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
              )}
            </Box>

            <Box className="mt-6 p-4 bg-gray-50 rounded">
              <Typography variant="subtitle1" className="font-bold">
                Total Planejado: {editedDemand.totalPlan?.toLocaleString('pt-BR') || 0} Ton
              </Typography>
              <Typography variant="subtitle1" className="font-bold">
                Total Produzido: {editedDemand.totalProd?.toLocaleString('pt-BR') || 0} Ton
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions className="p-4 bg-gray-100">
        <Button
          variant="outlined"
          className="btn-red"
          onClick={onClose}
          style={{ borderColor: '#F44336', color: '#F44336' }}
        >
          CANCELAR
        </Button>
        <Button
          variant="contained"
          className="btn-green"
          onClick={handleSave}
          disabled={isLoading}
          style={{ backgroundColor: '#4CAF50' }}
        >
          SALVAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DemandEditModal; 