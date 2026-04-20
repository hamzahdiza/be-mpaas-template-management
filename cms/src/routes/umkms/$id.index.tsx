import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUMKM, type UMKMFormState } from '../../lib/api'
import { UMKMForm } from '../../components/UMKMForm'

export const Route = createFileRoute('/umkms/$id/')({
  component: UMKMDetail,
})

function EditUMKM() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['umkm', id],
    queryFn: () => getUMKM(id),
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading UMKM data...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">UMKM not found</div>;

  const initialData: UMKMFormState = {
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
    products: data.products || [],
  };

  return (
    <UMKMForm 
      title="UMKM Details"
      initialData={initialData}
      submitLabel=""
      isViewMode={true}
    />
  );
}

function UMKMDetail() {
    return <EditUMKM />;
}
