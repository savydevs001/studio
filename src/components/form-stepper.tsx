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
          <li key={step.name} className={cn('relative', { 'flex-1': stepIdx !== steps.length - 1 })}>
             {stepIdx !== 0 ? (
              <div className="absolute left-[-50%] top-[calc(50%_-_1px)] w-full h-[2px] bg-gray-200" aria-hidden="true" />
            ) : null}
             {stepIdx < currentStep ? (
              <div className="absolute left-[-50%] top-[calc(50%_-_1px)] w-full h-[2px] bg-primary" aria-hidden="true" />
            ) : null}

            <div className="relative flex items-center justify-center">

              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full bg-background',
                  stepIdx < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : stepIdx === currentStep
                    ? 'border-2 border-primary text-primary'
                    : 'border-2 border-border text-muted-foreground'
                )}
              >
                {stepIdx < currentStep ? (
                  <Check className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <span className="text-sm">{step.id}</span>
                )}
              </span>
            </div>
             <div className="absolute top-full text-center w-full">
                <p
                  className={cn(
                    'mt-2 text-xs sm:text-sm font-medium',
                    stepIdx === currentStep ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {step.name}
                </p>
              </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
