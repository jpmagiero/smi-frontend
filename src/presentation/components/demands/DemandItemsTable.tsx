import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  CircularProgress,
  Button,
  Box
} from '@mui/material';
import { Delete as DeleteIcon, MoreHoriz as MoreIcon } from '@mui/icons-material';
import { DemandItem } from '../../../domain/entities/Demand';

interface DemandItemsTableProps {
  items: DemandItem[];
  onRemoveItem: (id: number) => Promise<void>;
  isLoading?: boolean;
  hasMoreItems?: boolean;
  onLoadMoreItems?: () => void;
  loadingMoreItems?: boolean;
}

const DemandItemsTable: React.FC<DemandItemsTableProps> = ({
  items,
  onRemoveItem,
  isLoading = false,
  hasMoreItems = false,
  onLoadMoreItems,
  loadingMoreItems = false
}) => {
  return (
    <>
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
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" className="py-4">
                <Typography className="text-gray-500">Nenhum item adicionado</Typography>
              </TableCell>
            </TableRow>
          ) : (
            items.map((demandItem) => (
              <TableRow key={demandItem.id}>
                <TableCell>{demandItem.item.sku}</TableCell>
                <TableCell>{demandItem.item.description}</TableCell>
                <TableCell align="right">{demandItem.totalPlan.toLocaleString('pt-BR')}</TableCell>
                <TableCell align="right">{demandItem.totalProduced.toLocaleString('pt-BR')}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => onRemoveItem(demandItem.id)}
                    className="text-red-500"
                    disabled={isLoading}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {hasMoreItems && onLoadMoreItems && (
        <Box className="flex justify-center items-center mb-4">
          {loadingMoreItems ? (
            <CircularProgress size={24} style={{ color: 'var(--color-orange-primary)' }} />
          ) : (
            <Button 
              variant="outlined"
              size="small"
              onClick={onLoadMoreItems}
              startIcon={<MoreIcon />}
              className="text-gray-600"
            >
              Carregar mais itens
            </Button>
          )}
        </Box>
      )}
      
      {!hasMoreItems && items.length > 0 && (
        <Box className="flex justify-center mb-4">
          <Typography variant="body2" className="text-gray-500">
            Todos os itens carregados
          </Typography>
        </Box>
      )}
    </>
  );
};

export default DemandItemsTable; 