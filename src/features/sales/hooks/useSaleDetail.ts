import { useParams, useNavigate } from 'react-router-dom';
import { useSalesStore } from '@/store/useSalesStore';
import { RoutesView } from '@/navigation/routes';

export const useSaleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSaleById } = useSalesStore();

  const sale = id ? getSaleById(id) : undefined;

  const handlePrint = () => {
    window.print();
  };

  const handleBackToSales = () => {
    navigate(RoutesView.SALES);
  };

  return {
    id,
    sale,
    actions: {
      handlePrint,
      handleBackToSales,
    },
  };
};
