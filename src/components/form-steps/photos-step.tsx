'use client';

import ImageUpload from '@/components/image-upload';
import { Gauge, Fingerprint, Car, Disc3, Armchair, LayoutDashboard } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const photoUploads = [
  { name: 'photoOdometer', label: 'Odometer', icon: <Gauge size={32} />, imageId: 'odometer' },
  { name: 'photoVin', label: 'VIN Sticker', icon: <Fingerprint size={32} />, imageId: 'vin' },
  { name: 'photoDashboard', label: 'Dashboard', icon: <LayoutDashboard size={32} />, imageId: 'dashboard' },
  { name: 'photoFront', label: 'Front of Vehicle', icon: <Car size={32} />, imageId: 'front' },
  { name: 'photoBack', label: 'Back of Vehicle', icon: <Car size={32} />, imageId: 'back' },
  { name: 'photoDriverSide', label: "Driver's Side", icon: <Car size={32} />, imageId: 'driver-side' },
  { name: 'photoPassengerSide', label: "Passenger's Side", icon: <Car size={32} />, imageId: 'passenger-side' },
  { name: 'photoFrontSeats', label: 'Front Seats', icon: <Armchair size={32} />, imageId: 'front-seats' },
  { name: 'photoTires', label: 'Tires', icon: <Disc3 size={32} />, imageId: 'tires' },
];

export default function PhotosStep() {
  
  const getPlaceholder = (id: string) => {
    const placeholder = PlaceHolderImages.find(p => p.id === id);
    if (placeholder) {
      return {
        url: placeholder.imageUrl,
        hint: placeholder.imageHint
      }
    }
    // Fallback just in case
    return {
      url: `https://picsum.photos/seed/${id}/400/225`,
      hint: 'car photo'
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">Upload Photos</h3>
      <p className="text-sm text-muted-foreground">
        Please provide clear photos of the requested areas. Good lighting and clear focus will help us provide the most accurate appraisal. Use the example images as a guide.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photoUploads.map((upload) => {
          const placeholder = getPlaceholder(upload.imageId);
          return (
            <ImageUpload
              key={upload.name}
              name={upload.name}
              label={upload.label}
              icon={upload.icon}
              exampleImageUrl={placeholder.url}
              imageHint={placeholder.hint}
            />
          )
        })}
      </div>
    </div>
  );
}
