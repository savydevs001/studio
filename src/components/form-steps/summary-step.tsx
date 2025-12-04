'use client';

import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryStepProps {
  onRestart: () => void;
}

export default function SummaryStep({ onRestart }: SummaryStepProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Your vehicle appraisal request has been submitted successfully. We will review the information and get back to you shortly.
      </p>
      <Button onClick={onRestart}>Submit Another Appraisal</Button>
    </div>
  );
}
