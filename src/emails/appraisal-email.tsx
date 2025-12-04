import {
    Html,
    Body,
    Container,
    Heading,
    Text,
    Section,
    Hr,
    Tailwind,
    Preview,
  } from '@react-email/components';
  
  interface AppraisalEmailProps {
    data: { [key: string]: any };
  }
  
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Heading as="h2" className="text-xl font-semibold text-gray-800 mt-6 mb-2">
      {children}
    </Heading>
  );
  
  const DataRow = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="flex justify-between py-2 border-b border-gray-200">
      <Text className="text-sm font-medium text-gray-600 m-0">{label}:</Text>
      <Text className="text-sm text-gray-800 text-right m-0">{value || 'Not Provided'}</Text>
    </div>
  );

  const DescriptionRow = ({ label, value }: { label: string; value: string | undefined }) => (
    <>
      {value && value.trim() && (
         <div className="py-2">
            <Text className="text-sm font-medium text-gray-600 m-0">{label}:</Text>
            <Text className="text-sm text-gray-800 bg-gray-50 p-2 rounded-md mt-1 m-0">{value}</Text>
        </div>
      )}
    </>
  )
  
  const toTitleCase = (str: string) => {
    if (!str) return '';
    const spaced = str.replace(/([A-Z])/g, ' $1');
    const cleaned = spaced.replace(/^(photo|Photo)/, '').trim();
    return cleaned.replace(/^./, (s) => s.toUpperCase());
  };
  
  export function AppraisalEmail({ data }: AppraisalEmailProps) {
    const vehicleTitle = `${data.year} ${data.make} ${data.model}`;
  
    const vehicleInfo = [
      { label: 'VIN', value: data.vin },
      { label: 'Odometer', value: data.odometer },
      { label: 'Trim', value: data.trim },
      { label: 'Transmission', value: data.transmission },
      { label: 'Drivetrain', value: data.drivetrain },
    ];
  
    const contactInfo = [
      { label: 'Name', value: data.name },
      { label: 'Email', value: data.email },
      { label: 'Phone', value: data.phone },
    ];

    const conditionInfo = [
        { label: 'Accident History', value: data.accidentHistory, details: data.accidentDetails },
        { label: 'Frame Damage', value: data.frameDamage, details: data.frameDamageDetails },
        { label: 'Flood Damage', value: data.floodDamage, details: data.floodDamageDetails },
        { label: 'Smoked In', value: data.smokedIn, details: data.smokedInDetails },
        { label: 'Mechanical Issues', value: data.mechanicalIssues, details: data.mechanicalIssuesDetails },
        { label: 'Odometer Broken/Replaced', value: data.odometerBroken, details: data.odometerBrokenDetails },
        { label: 'Paint/Body Work Needed', value: data.paintBodyWork, details: data.paintBodyWorkDetails },
        { label: 'Rust/Hail Damage', value: data.rustHailDamage, details: data.rustHailDamageDetails },
        { label: 'Interior Parts Broken', value: data.interiorBroken, details: data.interiorBrokenDetails },
        { label: 'Interior Rips/Tears/Stains', value: data.interiorRips, details: data.interiorRipsDetails },
        { label: 'Tires Need Replacement', value: data.tiresNeedReplacement, details: data.tiresNeedReplacementDetails },
        { label: 'Number of Keys', value: data.keys },
        { label: 'Aftermarket Modifications', value: data.aftermarketModifications, details: data.aftermarketModificationsDetails },
        { label: 'Other Issues', value: data.otherIssues, details: data.otherIssuesDetails },
    ]

    const photoFields = [
        'photoOdometer', 'photoVin', 'photoDriverFrontCorner', 'photoPassengerRearCorner', 'photoDriverQuarterPanel', 'photoPassengerQuarterPanel', 'photoDriverRearWheel', 'photoDashboard', 'photoFrontSeats', 'photoRearSeatArea', 'photoInteriorRoof', 'photoDriverFrontDoor', 'photoTrunkArea', 'photoDriverApron', 'photoPassengerApron',
    ];
    const damagePhotos = ['photoDamage1', 'photoDamage2', 'photoDamage3'];
    const featurePhotos = ['photoFeature1', 'photoFeature2', 'photoFeature3'];
  
    return (
      <Html>
        <Preview>New Appraisal Request: {vehicleTitle}</Preview>
        <Tailwind>
          <Body className="bg-gray-100 font-sans">
            <Container className="bg-white mx-auto my-8 p-8 rounded-lg shadow-md max-w-2xl">
              <Heading as="h1" className="text-2xl font-bold text-center text-blue-600">
                New Appraisal Request
              </Heading>
              <Text className="text-center text-gray-500 mb-6">{vehicleTitle}</Text>
  
              <Section>
                <SectionTitle>Vehicle Information</SectionTitle>
                {vehicleInfo.map((item, index) => (
                  <DataRow key={index} label={item.label} value={item.value} />
                ))}
              </Section>
  
              <Section>
                <SectionTitle>Condition Report</SectionTitle>
                {conditionInfo.map((item, index) => (
                    <div key={index}>
                        <DataRow label={item.label} value={item.value} />
                        {item.value && item.value !== 'no' && item.details && (
                           <div className="pl-4 pb-2">
                             <DescriptionRow label="Details" value={item.details} />
                           </div>
                        )}
                    </div>
                ))}
              </Section>

              <Section>
                <SectionTitle>Required Photos</SectionTitle>
                <Text className="text-sm text-gray-500">
                  The following required photos are included as attachments with this email.
                </Text>
                <ul className="list-disc list-inside text-sm text-gray-700 pl-4">
                  {photoFields.map((field) => 
                    data[field] ? <li key={field}>{toTitleCase(field)}</li> : null
                  )}
                </ul>
              </Section>

              { (data.photoDamage1 || data.photoDamage2 || data.photoDamage3) &&
                <Section>
                    <SectionTitle>Damages</SectionTitle>
                     {damagePhotos.map((field, index) =>
                        data[field] && (
                            <div key={field} className="py-2 border-b border-gray-200">
                                <Text className="text-sm font-medium text-gray-600 m-0">Damage {index + 1} (Attached)</Text>
                                <DescriptionRow label="Description" value={data[`${field}Description`]} />
                            </div>
                        )
                    )}
                </Section>
              }

              { (data.photoFeature1 || data.photoFeature2 || data.photoFeature3) &&
                <Section>
                    <SectionTitle>Additional Features</SectionTitle>
                     {featurePhotos.map((field, index) =>
                        data[field] && (
                            <div key={field} className="py-2 border-b border-gray-200">
                                <Text className="text-sm font-medium text-gray-600 m-0">Feature {index + 1} (Attached)</Text>
                                <DescriptionRow label="Description" value={data[`${field}Description`]} />
                            </div>
                        )
                    )}
                </Section>
              }
  
              <Hr className="my-8" />
  
              <Section>
                <SectionTitle>Contact Information</SectionTitle>
                {contactInfo.map((item, index) => (
                  <DataRow key={index} label={item.label} value={item.value} />
                ))}
              </Section>

               <Hr className="my-8" />

               <Text className="text-xs text-gray-400 text-center">
                    This email was automatically generated by the Trade-In Vision application.
               </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }
  
  export default AppraisalEmail;
  
