import { useState, useEffect, useCallback } from 'react';
import { Demand, DemandStatus, Item, DemandItem } from '../../domain/entities/Demand';
import { DemandService } from '../../application/services/demandService';

export const useDemandEditForm = (demand?: Demand) => {
  const [editedDemand, setEditedDemand] = useState<Demand | null>(null);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState({
    itemId: 0,
    totalPlan: '0',
    totalProduced: '0',
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
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
        const items = await DemandService.getItems();
        setAvailableItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.error('Erro ao carregar itens:', error);
      } finally {
        setIsLoadingItems(false);
      }
    };
    
    loadItems();
  }, []);

  const loadDemandItems = useCallback(async (demandId: number, newCursor: string | null = null) => {
    if (!demandId || demandId === 0) return;
    
    try {
      setLoadingMoreItems(true);
      const response = await DemandService.getDemandById(demandId, newCursor, 5);
      
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
  }, []);

  const handleLoadMoreItems = useCallback(() => {
    if (editedDemand && editedDemand.id !== 0 && hasMoreItems && !loadingMoreItems) {
      loadDemandItems(editedDemand.id, itemsCursor);
    }
  }, [editedDemand, hasMoreItems, loadingMoreItems, itemsCursor, loadDemandItems]);

  useEffect(() => {
    if (demand) {
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
    if (demand && demand.id !== 0) {
      loadDemandItems(demand.id, null);
    }
  }, [demand, loadDemandItems]);

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
    } else {
      try {
        const response = await DemandService.addItemsToDemand(editedDemand.id, [{
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
    } else {
      try {
        await DemandService.removeItemFromDemand(editedDemand.id, demandItemId);
        
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

  const getDemandToSave = (): Demand | null => {
    if (!editedDemand) return null;
    
    return {
      id: editedDemand.id,
      startDate: editedDemand.startDate,
      endDate: editedDemand.endDate,
      status: editedDemand.status || 'PLANEJAMENTO',
      items: editedDemand.items || [],
      totalPlan: editedDemand.totalPlan,
      totalProd: editedDemand.totalProd,
    };
  };

  return {
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
    availableItems: getAvailableItemsForSelect(),
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
  };
}; 