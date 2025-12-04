'use client';

import { Check, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStepperProps {
  steps: { id: string; name: string }[];
  currentStep: number;
}

export default function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn('relative', { 'flex-1': stepIdx !== steps.length - 1 })}>
            {stepIdx < currentStep ? (
              // Completed step
              <div className="flex items-center font-medium text-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="ml-2 text-sm font-medium text-foreground">{step.name}</span>
              </div>
            ) : stepIdx === currentStep ? (
              // Current step
              <div className="flex items-center text-sm" aria-current="step">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-primary">
                  <span className="text-sm">{step.id}</span>
                </span>
                <span className="ml-2 text-sm font-medium text-primary">{step.name}</span>
              </div>
            ) : (
              // Upcoming step
              <div className="flex items-center text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border text-muted-foreground">
                  <span className="text-sm">{step.id}</span>
                </div>
                <span className="ml-2 text-sm font-medium text-muted-foreground">{step.name}</span>
              </div>
            )}

            {stepIdx < steps.length - 1 && (
              <div
                className={cn(
                  'absolute left-4 top-4 -ml-px mt-0.5 h-0.5 w-full bg-border',
                  { 'bg-primary': stepIdx < currentStep }
                )}
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
