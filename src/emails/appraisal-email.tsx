import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
  Hr,
} from '@react-email/components';
import type { AppraisalFormValues } from '@/lib/schema';

interface AppraisalEmailProps {
  data: AppraisalFormValues;
  submissionId: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

const InfoRow = ({ label, value }: { label:string; value: string | number | undefined | null }) => (
  <div className="flex justify-between py-2">
    <Text className="text-sm font-medium text-gray-600 m-0">{label}:</Text>
    <Text className="text-sm text-gray-800 m-0 text-right">{value || 'N/A'}</Text>
  </div>
);

export const AppraisalEmail = ({ data, submissionId }: AppraisalEmailProps) => {
  const submissionUrl = `${baseUrl}/appraisals/${submissionId}`;

  return (
    <Html>
      <Head />
      <Preview>New Appraisal Request #{submissionId}: {data.year} {data.make} {data.model}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans p-4">
          <Container className="bg-white p-8 rounded-lg shadow-sm max-w-xl mx-auto">
            <Section>
              <Heading as="h1" className="text-2xl font-bold text-gray-800">
                New Appraisal Submission
              </Heading>
              <Text className="text-base text-gray-600">
                A new vehicle appraisal request has been submitted.
              </Text>
            </Section>

            <Section className="mt-6 border-t border-b border-gray-200 py-4">
              <InfoRow label="Submission ID" value={submissionId} />
              <InfoRow label="Vehicle" value={`${data.year} ${data.make} ${data.model}`} />
              <InfoRow label="Customer" value={data.name} />
              <InfoRow label="Customer Email" value={data.email} />
            </Section>

            <Section className="text-center mt-8 mb-8">
              <Link
                href={submissionUrl}
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md"
              >
                View Full Submission Details
              </Link>
            </Section>
            
            <Hr className="my-6" />
            
            <Text className="text-xs text-gray-500 text-center">
              This is an automated notification. All photos and full details are available at the link above.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
};

export default AppraisalEmail;
