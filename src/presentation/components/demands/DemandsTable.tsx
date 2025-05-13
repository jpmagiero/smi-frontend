import React, { useEffect, useCallback, useState } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  CircularProgress, 
  Typography,
  Box,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Demand } from '../../../domain/entities/Demand';
import { useInfiniteDemands } from '../../hooks/useInfiniteDemands';
import { DemandService } from '../../../application/services/demandService';
import DemandListHeader from './DemandListHeader';
import DemandRow from './DemandRow';
import PeriodEditDialog from './PeriodEditDialog';

interface DemandsTableProps {
  onAddDemand?: () => void;
  onEditDemand?: (demand: Demand) => void;
}

const DemandsTable: React.FC<DemandsTableProps> = ({ onAddDemand, onEditDemand }) => {
  const { demands, isLoading, error, hasNextPage, loadMore, refresh } = useInfiniteDemands();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [periodDialog, setPeriodDialog] = useState({
    open: false,
    demand: null as Demand | null,
  });

  useEffect(() => {
    loadMore();
    
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 700);
    
    return () => clearTimeout(timer);
  }, [loadMore]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isLoading) {
      loadMore();
    }
  }, [hasNextPage, isLoading, loadMore]);

  const handleRefresh = useCallback(() => {
    setShowSkeleton(true);
    refresh();
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [refresh]);

  const handleEdit = useCallback((demand: Demand) => {
    if (onEditDemand) {
      onEditDemand(demand);
    }
  }, [onEditDemand]);
  
  const handleOpenPeriodDialog = (demand: Demand) => {
    setPeriodDialog({
      open: true,
      demand,
    });
  };
  
  const handleClosePeriodDialog = () => {
    setPeriodDialog({
      ...periodDialog,
      open: false,
    });
  };
  
  const handleSavePeriod = async (demandId: number, startDate: string, endDate: string) => {
    try {
      await DemandService.updateDemand(demandId, {
        startDate,
        endDate,
      });
      
      handleClosePeriodDialog();
      handleRefresh();
    } catch (error) {
      console.error('Erro ao atualizar período:', error);
      throw error;
    }
  };
  
  const isInitialLoading = isLoading && demands.length === 0 || showSkeleton;

  return (
    <div className="space-y-4 w-full">
      <DemandListHeader 
        onAddDemand={onAddDemand || (() => {})} 
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      
      <Paper elevation={2} className="w-full overflow-hidden rounded-lg shadow-md">
        <TableContainer sx={{ height: 'calc(100vh - 200px)', minHeight: '400px', width: '100%' }}>
          {isInitialLoading ? (
            <div className="flex flex-col justify-center items-center h-full">
              <CircularProgress sx={{ color: 'var(--color-orange-primary)' }} />
              <Typography variant="body2" className="mt-4">Carregando demandas...</Typography>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-full text-red-500 p-4">
              <Typography variant="h6" className="mb-2">Erro ao carregar demandas</Typography>
              <Typography className="mb-4">{error.message}</Typography>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleRefresh}
                startIcon={<RefreshIcon />}
              >
                Tentar novamente
              </Button>
            </div>
          ) : demands.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              <div className="text-center">
                <Typography variant="h6" className="mb-2">Nenhuma demanda encontrada</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onAddDemand}
                  className="mt-4"
                  style={{ backgroundColor: 'var(--color-orange-primary)' }}
                >
                  ADICIONAR DEMANDA
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Table className="demands-table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: '60px' }}>Editar</TableCell>
                    <TableCell sx={{ width: '25%' }}>Período</TableCell>
                    <TableCell align="right" sx={{ width: '25%' }}>Total Planejado (ton)</TableCell>
                    <TableCell align="right" sx={{ width: '25%' }}>Total Produzido (ton)</TableCell>
                    <TableCell align="center" sx={{ width: '25%' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {demands.map((demand) => (
                    <DemandRow 
                      key={demand.id}
                      demand={demand} 
                      onEdit={handleEdit}
                      onEditPeriod={handleOpenPeriodDialog}
                    />
                  ))}
                </TableBody>
              </Table>
              
              {isLoading && !showSkeleton && (
                <Box sx={{ 
                  width: '100%', 
                  p: 1, 
                  borderTop: '1px solid #e0e0e0', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}>
                  <CircularProgress size={24} sx={{ mr: 2, color: 'var(--color-orange-primary)' }} />
                  <Typography variant="body2">Carregando mais itens...</Typography>
                </Box>
              )}
              
              {!hasNextPage && demands.length > 0 && !showSkeleton && (
                <Box sx={{ 
                  width: '100%', 
                  p: 1, 
                  borderTop: '1px solid #e0e0e0', 
                  textAlign: 'center' 
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Fim dos resultados
                  </Typography>
                </Box>
              )}
            </>
          )}
        </TableContainer>
      </Paper>
      
      <PeriodEditDialog
        open={periodDialog.open}
        demand={periodDialog.demand}
        onClose={handleClosePeriodDialog}
        onSave={handleSavePeriod}
      />
    </div>
  );
};

export default DemandsTable; 