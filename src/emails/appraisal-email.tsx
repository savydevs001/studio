import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import type { AppraisalFormValues } from '@/lib/schema';

interface AppraisalEmailProps {
  data: AppraisalFormValues;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Heading as="h2" className="text-xl font-semibold mt-8 mb-4 border-b pb-2">
        {children}
    </Heading>
);

const InfoRow = ({ label, value }: { label:string; value: string | number | React.ReactNode | undefined | null }) => (
    <div className="flex justify-between py-2 border-b border-gray-200">
        <Text className="text-sm font-medium text-gray-600 m-0">{label}:</Text>
        <Text className="text-sm text-gray-800 m-0">{value || 'N/A'}</Text>
    </div>
);

const DetailSection = ({ watchName, detailsName, label, data }: { watchName: keyof AppraisalFormValues, detailsName: keyof AppraisalFormValues, label: string, data: AppraisalFormValues }) => {
    const value = data[watchName];
    const details = data[detailsName];

    if (!value || value === 'no') return null;

    return (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <Text className="text-sm font-semibold m-0">{label} Details:</Text>
            <Text className="text-sm text-gray-700 m-0 mt-1">{details || 'No details provided.'}</Text>
        </div>
    );
};


export const AppraisalEmail = ({ data }: AppraisalEmailProps) => (
  <Html>
    <Head />
    <Preview>New Vehicle Appraisal Request: {data.year} {data.make} {data.model}</Preview>
    <Tailwind>
        <Body className="bg-gray-50 font-sans p-4">
            <Container className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
            <Section className="text-center">
                <Heading as="h1" className="text-2xl font-bold text-gray-800 mt-4">
                    New Appraisal Request
                </Heading>
            </Section>

            <Text className="text-base">
                A new vehicle appraisal request has been submitted. See the details below.
            </Text>

            <SectionTitle>Contact Information</SectionTitle>
            <InfoRow label="Name" value={data.name} />
            <InfoRow label="Email" value={data.email} />
            <InfoRow label="Phone" value={data.phone} />

            <SectionTitle>Vehicle Information</SectionTitle>
            <InfoRow label="Year" value={data.year} />
            <InfoRow label="Make" value={data.make} />
            <InfoRow label="Model" value={data.model} />
            <InfoRow label="Trim" value={data.trim} />
            <InfoRow label="VIN" value={data.vin} />
            <InfoRow label="Odometer" value={data.odometer ? data.odometer.toLocaleString() : 'N/A'} />

            <SectionTitle>Vehicle Details</SectionTitle>
            <InfoRow label="Transmission" value={data.transmission} />
            <InfoRow label="Drivetrain" value={data.drivetrain} />

            <SectionTitle>Condition Report</SectionTitle>
            <InfoRow label="Accident History" value={data.accidentHistory} />
            <DetailSection watchName="accidentHistory" detailsName="accidentDetails" label="Accident" data={data} />
            
            <InfoRow label="Frame Damage" value={data.frameDamage} />
            <DetailSection watchName="frameDamage" detailsName="frameDamageDetails" label="Frame Damage" data={data} />

            <InfoRow label="Flood Damage" value={data.floodDamage} />
            <DetailSection watchName="floodDamage" detailsName="floodDamageDetails" label="Flood Damage" data={data} />

            <InfoRow label="Smoked In" value={data.smokedIn} />
            <DetailSection watchName="smokedIn" detailsName="smokedInDetails" label="Smoking History" data={data} />

            <InfoRow label="Mechanical Issues / Warning Lights" value={data.mechanicalIssues} />
            <DetailSection watchName="mechanicalIssues" detailsName="mechanicalIssuesDetails" label="Mechanical Issues" data={data} />
            
            <InfoRow label="Odometer Broken/Replaced" value={data.odometerBroken} />
            <DetailSection watchName="odometerBroken" detailsName="odometerBrokenDetails" label="Odometer Issue" data={data} />

            <InfoRow label="Panels Needing Paint/Body Work" value={data.paintBodyWork} />
            <DetailSection watchName="paintBodyWork" detailsName="paintBodyWorkDetails" label="Paint/Body Work" data={data} />

            <InfoRow label="Major Rust / Hail Damage" value={data.rustHailDamage} />
            <DetailSection watchName="rustHailDamage" detailsName="rustHailDamageDetails" label="Rust/Hail Damage" data={data} />
            
            <InfoRow label="Broken Interior Parts" value={data.interiorBroken} />
            <DetailSection watchName="interiorBroken" detailsName="interiorBrokenDetails" label="Broken Interior Parts" data={data} />
            
            <InfoRow label="Interior Rips, Tears, or Stains" value={data.interiorRips} />
            <DetailSection watchName="interiorRips" detailsName="interiorRipsDetails" label="Interior Damage" data={data} />

            <InfoRow label="Tires Needing Replacement" value={data.tiresNeedReplacement} />
            <DetailSection watchName="tiresNeedReplacement" detailsName="tiresNeedReplacementDetails" label="Tire Details" data={data} />

            <InfoRow label="Number of Keys" value={data.keys} />

            <InfoRow label="Aftermarket Modifications" value={data.aftermarketModifications} />
            <DetailSection watchName="aftermarketModifications" detailsName="aftermarketModificationsDetails" label="Modifications" data={data} />

            <InfoRow label="Other Issues" value={data.otherIssues} />
            <DetailSection watchName="otherIssues" detailsName="otherIssuesDetails" label="Other Issues" data={data} />
            
            <Hr className="my-8" />
            <Text className="text-xs text-gray-500 text-center">
                This email was generated from an automated appraisal request system.
                <br />
                Attachments contain photos submitted by the user.
            </Text>
            </Container>
        </Body>
    </Tailwind>
  </Html>
);

export default AppraisalEmail;
