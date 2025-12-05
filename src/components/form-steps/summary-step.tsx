'use client';

import { CheckCircle2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryStepProps {
  onRestart: () => void;
  submissionId: string | null;
}

export default function SummaryStep({ onRestart, submissionId }: SummaryStepProps) {
  const { toast } = useToast();
  const submissionUrl = submissionId ? `${window.location.origin}/appraisals/${submissionId}` : '';

  const copyToClipboard = () => {
    if (!submissionUrl) return;
    navigator.clipboard.writeText(submissionUrl);
    toast({
      title: 'Copied to Clipboard!',
      description: 'The link to your submission has been copied.',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Your vehicle appraisal request has been submitted successfully. A confirmation email has been sent.
      </p>
      
      {submissionId && (
        <Card className="w-full max-w-sm text-left mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Submission ID</p>
              <p className="font-mono text-sm">{submissionId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Submission Link</p>
              <div className="flex items-center gap-2 mt-1">
                <a href={submissionUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline truncate">
                  {submissionUrl}
                </a>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={onRestart}>Submit Another Appraisal</Button>
    </div>
  );
}
