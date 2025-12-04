'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

interface FormStepperProps {
  steps: { id: string; name: string }[];
  currentStep: number;
  progress: number;
}

export default function FormStepper({ steps, currentStep, progress }: FormStepperProps) {
  return (
    <div className="space-y-4">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={cn('relative', { 'flex-1': stepIdx !== steps.length - 1 })}>
              <div className="flex items-center font-medium text-sm">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
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
                <span
                  className={cn(
                    'ml-2 text-sm font-medium',
                    stepIdx === currentStep ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
