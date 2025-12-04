'use client';

import ImageUpload from '@/components/image-upload';
import { Gauge, Fingerprint, Car, Disc3, Armchair, LayoutDashboard } from 'lucide-react';

const photoUploads = [
  { name: 'photoOdometer', label: 'Odometer', icon: <Gauge size={32} /> },
  { name: 'photoVin', label: 'VIN Sticker', icon: <Fingerprint size={32} /> },
  { name: 'photoDashboard', label: 'Dashboard', icon: <LayoutDashboard size={32} /> },
  { name: 'photoFront', label: 'Front of Vehicle', icon: <Car size={32} /> },
  { name: 'photoBack', label: 'Back of Vehicle', icon: <Car size={32} /> },
  { name: 'photoDriverSide', label: "Driver's Side", icon: <Car size={32} /> },
  { name: 'photoPassengerSide', label: "Passenger's Side", icon: <Car size={32} /> },
  { name: 'photoFrontSeats', label: 'Front Seats', icon: <Armchair size={32} /> },
  { name: 'photoTires', label: 'Tires', icon: <Disc3 size={32} /> },
];

export default function PhotosStep() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">Upload Photos</h3>
      <p className="text-sm text-muted-foreground">
        Please provide clear photos of the requested areas. Good lighting and clear focus will help us provide the most accurate appraisal.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photoUploads.map((upload) => (
          <ImageUpload
            key={upload.name}
            name={upload.name}
            label={upload.label}
            icon={upload.icon}
          />
        ))}
      </div>
    </div>
  );
}
