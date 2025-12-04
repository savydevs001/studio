'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStepperProps {
  steps: { id: string; name: string }[];
  currentStep: number;
  progress: number;
}

export default function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn('relative', { 'pr-8 sm:pr-20': stepIdx !== steps.length - 1 })}>
            {stepIdx < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </div>
              </>
            ) : stepIdx === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <span className="text-primary">{step.id}</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-background">
                   <span className="text-muted-foreground">{step.id}</span>
                </div>
              </>
            )}
             <p className="absolute -bottom-6 w-max -translate-x-1/2 left-1/2 mt-2 text-xs sm:text-sm font-medium text-muted-foreground">{step.name}</p>
          </li>
        ))}
      </ol>
    </nav>
  );
}