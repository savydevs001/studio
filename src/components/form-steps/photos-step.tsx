'use client';

import ImageUpload from '@/components/image-upload';
import { Gauge, Fingerprint, Car, Disc3, Armchair, LayoutDashboard, Aperture, Windshield, Warehouse, CarTaxiFront, DoorOpen } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const photoUploads = [
  { name: 'photoOdometer', label: 'Odometer', icon: <Gauge size={32} />, imageId: 'odometer', description: 'Start the car to show any warning lights and pop the hood' },
  { name: 'photoVin', label: 'VIN Sticker', icon: <Fingerprint size={32} />, imageId: 'vin' },
  { name: 'photoFrontSeats', label: 'Front Seats', icon: <Armchair size={32} />, imageId: 'front-seats', description: 'Capture any seat functions' },
  { name: 'photoInteriorRoof', label: 'Interior Roof', icon: <Warehouse size={32} />, imageId: 'interior-roof', description: 'Make sure the Sun or Moon roof are visible'},
  { name: 'photoDriverFrontDoor', label: 'Driver Front Door', icon: <DoorOpen size={32} />, imageId: 'driver-front-door', description: 'Make sure all door features are visible' },
  { name: 'photoDriverApron', label: 'Driver Apron', icon: <Aperture size={32} />, imageId: 'driver-apron', description: 'Take the picture down the middle of the engine at an angle to show all visible welds' },
  { name: 'photoPassengerApron', label: 'Passenger Apron', icon: <Aperture size={32} />, imageId: 'passenger-apron', description: 'Take the picture down the middle of the engine at an angle to show all visible welds' },
  { name: 'photoDriverFrontCorner', label: 'Driver Front Corner', icon: <Car size={32} />, imageId: 'driver-front-corner', description: 'Capture as much of the car as possible' },
  { name: 'photoRearSeatArea', label: 'Rear Seat Area', icon: <Armchair size={32} />, imageId: 'rear-seat-area', description: 'Be sure all rear features and the latch is visible' },
  { name: 'photoDashboard', label: 'Dash (from back seat)', icon: <LayoutDashboard size={32} />, imageId: 'dashboard', description: 'Photograph from the back seat to get all features' },
  { name: 'photoPassengerRearCorner', label: 'Passenger Rear Corner', icon: <Car size={32} />, imageId: 'passenger-rear-corner', description: 'Capture as much of the car as possible' },
  { name: 'photoTrunkArea', label: 'Trunk Area', icon: <CarTaxiFront size={32} />, imageId: 'trunk-area', description: 'Include the entire trunk area including lid and hitch' },
  { name: 'photoPassengerQuarterPanel', label: 'Passenger Side Quarter', icon: <Car size={32} />, imageId: 'passenger-quarter-panel', description: 'Make sure the welds are visible' },
  { name: 'photoDriverQuarterPanel', label: 'Driver Side Quarter', icon: <Car size={32} />, imageId: 'driver-quarter-panel', description: 'Make sure the welds are visible' },
  { name: 'photoDriverRearWheel', label: 'Driver Rear Wheel', icon: <Disc3 size={32} />, imageId: 'driver-rear-wheel', description: 'Make sure tread and tire size are visible' },
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
              description={upload.description}
            />
          )
        })}
      </div>
    </div>
  );
}
