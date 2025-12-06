'use client';

import ImageUpload from '@/components/image-upload';
import { Car, Armchair, LayoutDashboard, Wrench, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const requiredPhotoUploads = [
  { name: 'photoDriverFrontCorner', label: 'Front of Vehicle', icon: <Car className="h-8 w-8" />, imageId: 'driver-front-corner', description: 'Capture the entire front end at an angle.' },
  { name: 'photoDriverQuarterPanel', label: 'Driver Side', icon: <Car className="h-8 w-8" />, imageId: 'driver-quarter-panel', description: 'Capture the full driver side of the vehicle.' },
  { name: 'photoPassengerQuarterPanel', label: 'Passenger Side', icon: <Car className="h-8 w-8" />, imageId: 'passenger-quarter-panel', description: 'Capture the full passenger side.' },
  { name: 'photoFrontSeats', label: 'Front Seats', icon: <Armchair className="h-8 w-8" />, imageId: 'front-seats', description: 'Capture both front seats.' },
  { name: 'photoRearSeatArea', label: 'Rear Seats', icon: <Armchair className="h-8 w-8" />, imageId: 'rear-seat-area', description: 'Show the entire rear seating area.' },
  { name: 'photoDashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-8 w-8" />, imageId: 'dashboard', description: 'Photograph from the back seat.' },
];

const optionalDamageUploads = [
  { name: 'photoDamage1', label: 'Damage Area 1', descriptionName: 'photoDamage1Description' },
  { name: 'photoDamage2', label: 'Damage Area 2', descriptionName: 'photoDamage2Description' },
  { name: 'photoDamage3', label: 'Damage Area 3', descriptionName: 'photoDamage3Description' },
  { name: 'photoDamage4', label: 'Damage Area 4', descriptionName: 'photoDamage4Description' },
];

const optionalFeatureUploads = [
    { name: 'photoFeature1', label: 'Special Feature 1', descriptionName: 'photoFeature1Description' },
    { name: 'photoFeature2', label: 'Special Feature 2', descriptionName: 'photoFeature2Description' },
    { name: 'photoFeature3', label: 'Special Feature 3', descriptionName: 'photoFeature3Description' },
    { name: 'photoFeature4', label: 'Special Feature 4', descriptionName: 'photoFeature4Description' },
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
            <h3 className="text-xl font-semibold text-foreground">Optional: Damage Photos</h3>
            <p className="text-sm text-muted-foreground mt-1">
                If there are any specific areas of damage (dents, scratches, rust), please add up to 4 photos here and describe them.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {optionalDamageUploads.map((upload) => (
            <ImageUpload
              key={upload.name}
              name={upload.name}
              label={upload.label}
              icon={<Wrench className="h-8 w-8" />}
              descriptionName={upload.descriptionName}
              description={``}
            />
          ))}
        </div>
      </div>
      
      <div>
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground">Optional: Special Features</h3>
            <p className="text-sm text-muted-foreground mt-1">
                Add photos of any special features or aftermarket modifications (e.g., custom wheels, sound system, roof rack).
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {optionalFeatureUploads.map((upload) => (
            <ImageUpload
              key={upload.name}
              name={upload.name}
              label={upload.label}
              icon={<Sparkles className="h-8 w-8" />}
              descriptionName={upload.descriptionName}
              description={``}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
