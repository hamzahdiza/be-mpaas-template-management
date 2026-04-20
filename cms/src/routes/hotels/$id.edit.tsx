import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getHotel, updateHotel, type HotelFormState } from '../../lib/api'
import { HotelForm } from '../../components/HotelForm'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/hotels/$id/edit')({
    component: EditHotel,
})

function EditHotel() {
    const { id } = Route.useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: hotel, isLoading } = useQuery({
        queryKey: ['hotels', id],
        queryFn: () => getHotel(id),
    })

    const mutation = useMutation({
        mutationFn: (data: HotelFormState) => updateHotel(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hotels'] })
            toast.success('Hotel updated successfully')
            navigate({ to: '/' })
        },
        onError: (error: any) => {
            toast.error('Failed to update hotel: ' + error.message)
        }
    })

    if (isLoading) return <div className="text-center py-10">Loading...</div>
    if (!hotel) return <div className="text-center py-10">Hotel not found</div>

    // NORMALISASI DATA: Mengonversi data API (GET) ke State Form (PUT)
    const initialData: HotelFormState = {
        name: hotel.name || '',
        description: hotel.description || '',
        location: hotel.location || '',
        locationAddress: hotel.locationAddress || '',
        starRating: hotel.starRating || 3,
        // API GET mengembalikan bannerUrl (string), tapi PUT butuh bannerUrl (array)
        // Kita handle jika API mengirim string tunggal atau null
        bannerUrl: Array.isArray(hotel.bannerUrl)
            ? hotel.bannerUrl
            : (hotel.bannerUrl ? [hotel.bannerUrl] : []),
        templates: {
            index: {
                id: hotel.templates?.index?.id || 1,
                title: hotel.templates?.index?.title || '',
                bannerUrl: hotel.templates?.index?.bannerUrl || ''
            },
            hotelDetail: {
                id: hotel.templates?.hotelDetail?.id || 1,
                title: hotel.templates?.hotelDetail?.title || ''
            }
        },
        categories: (hotel.categories || []).map((cat: any) => ({
            id: cat.id,
            name: cat.name || '',
            roomType: cat.roomType || 'Standard',
            description: cat.description || '',
            pricePerNight: cat.pricePerNight || 0,
            capacity: cat.capacity || 2,
            stock: cat.stock || 0,
            bedConfig: cat.bedConfig || { type: 'Double Bed', count: 1 },
            roomAmenities: cat.roomAmenities || [],
            bathAmenities: cat.bathAmenities || [],
            images: cat.images || [""],
            isAvailable: Boolean(cat.isAvailable)
        }))
    }

    return (
        <HotelForm
            key={id}
            title="Edit Hotel"
            initialData={initialData} 
            onSubmit={(data: HotelFormState) => mutation.mutate(data)}
            isSubmitting={mutation.isPending}
            submitLabel="Update Hotel"
        />
    )
}