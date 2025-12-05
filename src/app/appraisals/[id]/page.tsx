
import { notFound } from 'next/navigation';
import Image from 'next/image';
import db from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileWarning } from 'lucide-react';

type Appraisal = Record<string, any>;

interface Photo {
  label: string;
  path: string;
  description?: string;
}

// These keys now match the input names in the form
const photoKeys: { key: string; label: string, descriptionKey?: string }[] = [
    { key: 'photoDriverFrontCorner', label: 'Front of Vehicle' },
    { key: 'photoDriverQuarterPanel', label: 'Driver Side' },
    { key: 'photoPassengerQuarterPanel', label: 'Passenger Side' },
    { key: 'photoFrontSeats', label: 'Front Seats' },
    { key: 'photoRearSeatArea', label: 'Rear Seats' },
    { key: 'photoDashboard', label: 'Dashboard' },
    { key: 'photoDamage1', label: 'Damage Area 1', descriptionKey: 'photoDamage1Description' },
    { key: 'photoDamage2', label: 'Damage Area 2', descriptionKey: 'photoDamage2Description' },
    { key: 'photoDamage3', label: 'Damage Area 3', descriptionKey: 'photoDamage3Description' },
    { key: 'photoDamage4', label: 'Damage Area 4', descriptionKey: 'photoDamage4Description' },
    { key: 'photoFeature1', label: 'Special Feature 1', descriptionKey: 'photoFeature1Description' },
    { key: 'photoFeature2', label: 'Special Feature 2', descriptionKey: 'photoFeature2Description' },
    { key: 'photoFeature3', label: 'Special Feature 3', descriptionKey: 'photoFeature3Description' },
    { key: 'photoFeature4', label: 'Special Feature 4', descriptionKey: 'photoFeature4Description' },
];

async function getAppraisal(id: string): Promise<{ appraisal: Appraisal, photos: Photo[] } | null> {
  try {
    const stmt = db.prepare('SELECT * FROM appraisals WHERE id = ?');
    const appraisal: Appraisal | undefined = stmt.get(id) as Appraisal;

    if (!appraisal) {
      return null;
    }

    const photos: Photo[] = photoKeys.map(pk => {
      const fileName = appraisal[pk.key]; // Get filename directly from DB

      if (fileName) {
        return {
          label: pk.label,
          path: `/uploads/${id}/${fileName}`,
          description: pk.descriptionKey ? appraisal[pk.descriptionKey] : undefined,
        };
      }
      return null; // Return null if no file is found for this key
    }).filter((p): p is Photo => p !== null); // Filter out the null entries


    return { appraisal, photos };
  } catch (error) {
    console.error('Database/File System error:', error);
    return null;
  }
}

const InfoRow = ({ label, value }: { label: string, value: any }) => {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b">
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="text-sm text-foreground mt-1 sm:mt-0">{String(value)}</dd>
        </div>
    )
};

const PhotoCard = ({ photo }: { photo: Photo }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video w-full bg-secondary">
          <Image src={photo.path} alt={photo.label} fill style={{ objectFit: 'cover' }} />
        </div>
      </CardContent>
      <div className="p-4">
        <p className="font-semibold">{photo.label}</p>
        {photo.description && (
          <p className="text-sm text-muted-foreground mt-1">{photo.description}</p>
        )}
      </div>
    </Card>
);

export default async function AppraisalPage({ params }: { params: { id: string } }) {
  const result = await getAppraisal(params.id);

  if (!result) {
    return (
        <main className="container mx-auto p-4 sm:p-8 max-w-6xl">
             <Alert variant="destructive">
                <FileWarning className="h-4 w-4" />
                <AlertTitle>Not Found</AlertTitle>
                <AlertDescription>
                    No appraisal submission with the ID "{params.id}" could be found. It may have been deleted or the ID is incorrect.
                </AlertDescription>
            </Alert>
        </main>
    )
  }

  const { appraisal, photos } = result;

  return (
    <main className="container mx-auto p-4 sm:p-8 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Appraisal Submission #{appraisal.id}</CardTitle>
          <CardDescription>
            Submitted on: {new Date(appraisal.createdAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          
          <section>
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Vehicle Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <InfoRow label="Year" value={appraisal.year} />
                <InfoRow label="Make" value={appraisal.make} />
                <InfoRow label="Model" value={appraisal.model} />
                <InfoRow label="Trim" value={appraisal.trim} />
                <InfoRow label="VIN" value={appraisal.vin} />
                <InfoRow label="Odometer" value={appraisal.odometer?.toLocaleString()} />
                <InfoRow label="Transmission" value={appraisal.transmission} />
                <InfoRow label="Drivetrain" value={appraisal.drivetrain} />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Contact Information</h2>
            <dl>
                <InfoRow label="Name" value={appraisal.name} />
                <InfoRow label="Email" value={appraisal.email} />
                <InfoRow label="Phone" value={appraisal.phone} />
            </dl>
          </section>

          <section>
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Condition Report</h2>
             <dl>
                <InfoRow label="Accident History" value={appraisal.accidentHistory} />
                {appraisal.accidentDetails && <InfoRow label="Accident Details" value={appraisal.accidentDetails} />}
                <Separator/>
                <InfoRow label="Frame Damage" value={appraisal.frameDamage} />
                {appraisal.frameDamageDetails && <InfoRow label="Frame Damage Details" value={appraisal.frameDamageDetails} />}
                <Separator/>
                <InfoRow label="Flood Damage" value={appraisal.floodDamage} />
                {appraisal.floodDamageDetails && <InfoRow label="Flood Damage Details" value={appraisal.floodDamageDetails} />}
                <Separator/>
                <InfoRow label="Smoked In" value={appraisal.smokedIn} />
                {appraisal.smokedInDetails && <InfoRow label="Smoking Details" value={appraisal.smokedInDetails} />}
                <Separator/>
                <InfoRow label="Mechanical Issues" value={appraisal.mechanicalIssues} />
                {appraisal.mechanicalIssuesDetails && <InfoRow label="Mechanical Issue Details" value={appraisal.mechanicalIssuesDetails} />}
                <Separator/>
                <InfoRow label="Odometer Broken" value={appraisal.odometerBroken} />
                {appraisal.odometerBrokenDetails && <InfoRow label="Odometer Issue Details" value={appraisal.odometerBrokenDetails} />}
                <Separator/>
                <InfoRow label="Paint/Body Work" value={appraisal.paintBodyWork} />
                {appraisal.paintBodyWorkDetails && <InfoRow label="Paint/Body Work Details" value={appraisal.paintBodyWorkDetails} />}
                <Separator/>
                <InfoRow label="Rust/Hail Damage" value={appraisal.rustHailDamage} />
                {appraisal.rustHailDamageDetails && <InfoRow label="Rust/Hail Damage Details" value={appraisal.rustHailDamageDetails} />}
                <Separator/>
                <InfoRow label="Interior Parts Broken" value={appraisal.interiorBroken} />
                {appraisal.interiorBrokenDetails && <InfoRow label="Broken Interior Parts Details" value={appraisal.interiorBrokenDetails} />}
                <Separator/>
                <InfoRow label="Interior Rips/Stains" value={appraisal.interiorRips} />
                {appraisal.interiorRipsDetails && <InfoRow label="Interior Damage Details" value={appraisal.interiorRipsDetails} />}
                <Separator/>
                <InfoRow label="Tires Need Replacement" value={appraisal.tiresNeedReplacement} />
                {appraisal.tiresNeedReplacementDetails && <InfoRow label="Tire Details" value={appraisal.tiresNeedReplacementDetails} />}
                <Separator/>
                <InfoRow label="Number of Keys" value={appraisal.keys} />
                <Separator/>
                <InfoRow label="Aftermarket Modifications" value={appraisal.aftermarketModifications} />
                {appraisal.aftermarketModificationsDetails && <InfoRow label="Modification Details" value={appraisal.aftermarketModificationsDetails} />}
                <Separator/>
                <InfoRow label="Other Issues" value={appraisal.otherIssues} />
                {appraisal.otherIssuesDetails && <InfoRow label="Other Issue Details" value={appraisal.otherIssuesDetails} />}
             </dl>
          </section>

          <section>
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Submitted Photos</h2>
            {photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map(photo => (
                  <PhotoCard key={photo.path} photo={photo} />
                ))}
              </div>
            ) : (
              <Alert variant="default">
                  <FileWarning className="h-4 w-4" />
                  <AlertTitle>No Photos Found</AlertTitle>
                  <AlertDescription>
                      No photos were submitted for this appraisal, or they could not be found on the server.
                  </AlertDescription>
              </Alert>
            )}
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
