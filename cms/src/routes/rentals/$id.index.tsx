import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getRental, type RentalFormState } from '../../lib/api'
import { RentalForm } from '../../components/RentalForm'

export const Route = createFileRoute('/rentals/$id/')({
  component: RentalDetail,
})

function EditRental() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['rental', id],
    queryFn: () => getRental(id),
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading rental data...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Rental not found</div>;

  const initialData: RentalFormState = {
    category: data.category,
    name: data.name,
    description: data.description || '',
    location: data.location || '',
    locationAddress: data.locationAddress || '',
    locationUrl: data.locationUrl || '',
    bannerUrl: data.images || [],
    templates: {
      index: {
        id: data.templates?.index?.id || 1,
        title: data.templates?.index?.title || '',
        bannerUrl: data.templates?.index?.bannerUrl || ''
      },
      detail: {
        id: data.templates?.detail?.id || 1,
        title: data.templates?.detail?.title || '',
        bannerUrl: data.templates?.detail?.bannerUrl || ''
      }
    },
    vehicles: data.vehicles || [],
  };

  return (
    <RentalForm 
      title="Rental Service Details"
      initialData={initialData}
      submitLabel=""
      isViewMode={true}
    />
  );
}

function RentalDetail() {
    return <EditRental />;
}
