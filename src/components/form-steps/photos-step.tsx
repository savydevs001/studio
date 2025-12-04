'use client';

import ImageUpload from '@/components/image-upload';
import { Gauge, Fingerprint, Car, Disc3, Armchair, LayoutDashboard, Aperture, Warehouse, CarTaxiFront, DoorOpen, ShieldAlert, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const requiredPhotoUploads = [
  { name: 'photoOdometer', label: 'Odometer', icon: <Gauge className="h-8 w-8" />, imageId: 'odometer', description: 'Start the car to show any warning lights and pop the hood.' },
  { name: 'photoVin', label: 'VIN Sticker', icon: <Fingerprint className="h-8 w-8" />, imageId: 'vin', description: 'Located on the driver-side doorjamb.'},
  { name: 'photoDriverFrontCorner', label: 'Front of Vehicle', icon: <Car className="h-8 w-8" />, imageId: 'driver-front-corner', description: 'Capture the entire front end at an angle.' },
  { name: 'photoPassengerRearCorner', label: 'Rear of Vehicle', icon: <Car className="h-8 w-8" />, imageId: 'passenger-rear-corner', description: 'Capture the entire rear end at an angle.' },
  { name: 'photoDriverQuarterPanel', label: 'Driver Side', icon: <Car className="h-8 w-8" />, imageId: 'driver-quarter-panel', description: 'Capture the full driver side of the vehicle.' },
  { name: 'photoPassengerQuarterPanel', label: 'Passenger Side', icon: <Car className="h-8 w-8" />, imageId: 'passenger-quarter-panel', description: 'Capture the full passenger side.' },
  { name: 'photoDriverRearWheel', label: 'Tire Tread', icon: <Disc3 className="h-8 w-8" />, imageId: 'driver-rear-wheel', description: 'Show the tread of one of the tires.' },
  { name: 'photoDashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-8 w-8" />, imageId: 'dashboard', description: 'Photograph from the back seat.' },
  { name: 'photoFrontSeats', label: 'Front Seats', icon: <Armchair className="h-8 w-8" />, imageId: 'front-seats', description: 'Capture both front seats.' },
  { name: 'photoRearSeatArea', label: 'Rear Seats', icon: <Armchair className="h-8 w-8" />, imageId: 'rear-seat-area', description: 'Show the entire rear seating area.' },
  { name: 'photoInteriorRoof', label: 'Interior Roof', icon: <Warehouse className="h-8 w-8" />, imageId: 'interior-roof', description: 'Include the headliner and sun/moon roof.'},
  { name: 'photoDriverFrontDoor', label: 'Driver Door Interior', icon: <DoorOpen className="h-8 w-8" />, imageId: 'driver-front-door', description: 'Show the entire inner door panel.' },
  { name: 'photoTrunkArea', label: 'Trunk', icon: <CarTaxiFront className="h-8 w-8" />, imageId: 'trunk-area', description: 'Show the entire trunk area.' },
  { name: 'photoDriverApron', label: 'Driver Engine Apron', icon: <Aperture className="h-8 w-8" />, imageId: 'driver-apron', description: 'Show the engine bay welds.' },
  { name: 'photoPassengerApron', label: 'Passenger Engine Apron', icon: <Aperture className="h-8 w-8" />, imageId: 'passenger-apron', description: 'Show the engine bay welds.' },
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
      url: `https://picsum.photos/seed/${id}/400/300`,
      hint: 'car photo'
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground">Required Photos</h3>
            <p className="text-sm text-muted-foreground mt-1">
            Please provide clear photos of the requested areas. Good lighting and clear focus will help us provide the most accurate appraisal.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requiredPhotoUploads.map((upload) => {
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

      <div>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground">General Damages (Optional)</h3>
            <p className="text-sm text-muted-foreground mt-1">
            Upload photos of any significant scratches, dents, or other damages. Please add a brief description for each.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ImageUpload name="photoDamage1" descriptionName="photoDamage1Description" label="Damage 1" icon={<ShieldAlert size={32} />} exampleImageUrl="/placeholder-damage.png" imageHint="car damage" />
          <ImageUpload name="photoDamage2" descriptionName="photoDamage2Description" label="Damage 2" icon={<ShieldAlert size={32} />} exampleImageUrl="/placeholder-damage.png" imageHint="car damage" />
          <ImageUpload name="photoDamage3" descriptionName="photoDamage3Description" label="Damage 3" icon={<ShieldAlert size={32} />} exampleImageUrl="/placeholder-damage.png" imageHint="car damage" />
        </div>
      </div>

      <div>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground">Additional Features (Optional)</h3>
            <p className="text-sm text-muted-foreground mt-1">
            Showcase any aftermarket modifications, special features, or upgrades. Please add a brief description for each.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ImageUpload name="photoFeature1" descriptionName="photoFeature1Description" label="Feature 1" icon={<Sparkles size={32} />} exampleImageUrl="/placeholder-feature.png" imageHint="car feature" />
          <ImageUpload name="photoFeature2" descriptionName="photoFeature2Description" label="Feature 2" icon={<Sparkles size={32} />} exampleImageUrl="/placeholder-feature.png" imageHint="car feature" />
          <ImageUpload name="photoFeature3" descriptionName="photoFeature3Description" label="Feature 3" icon={<Sparkles size={32} />} exampleImageUrl="/placeholder-feature.png" imageHint="car feature" />
        </div>
      </div>
    </div>
  );
}