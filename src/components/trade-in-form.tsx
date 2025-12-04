'use client';

import { useState } from 'react';
import { useForm, type FieldName } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';

import { appraisalSchema, type AppraisalFormValues } from '@/lib/schema';
import { submitAppraisal } from '@/app/actions';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { Form } from '@/components/ui/form';
import FormStepper from '@/components/form-stepper';
import VehicleInfoStep from './form-steps/vehicle-info-step';
import PhotosStep from './form-steps/photos-step';
import ConditionStep from './form-steps/condition-step';
import ContactInfoStep from './form-steps/contact-info-step';
import SummaryStep from './form-steps/summary-step';

const steps = [
  { id: '01', name: 'Vehicle', fields: ['vin', 'make', 'model', 'year', 'odometer'] },
  { id: '02', name: 'Photos', fields: ['photoOdometer', 'photoVin', 'photoFront', 'photoBack', 'photoDriverSide', 'photoPassengerSide', 'photoTires', 'photoFrontSeats', 'photoDashboard'] },
  { id: '03', name: 'Condition', fields: ['hasWarningLights', 'keys', 'acBlowsCold', 'hasDrivetrainIssues', 'hasSmokingOdor', 'hasPetOdor'] },
  { id: '04', name: 'Contact', fields: ['name', 'email', 'phone'] },
];

export default function TradeInForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AppraisalFormValues>({
    resolver: zodResolver(appraisalSchema),
    defaultValues: {
      vin: '',
      make: '',
      model: '',
      year: '',
      odometer: '',
      hasWarningLights: undefined,
      keys: '',
      acBlowsCold: undefined,
      hasDrivetrainIssues: undefined,
      hasSmokingOdor: undefined,
      hasPetOdor: undefined,
      name: '',
      email: '',
      phone: '',
    },
  });

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as FieldName<AppraisalFormValues>[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const processForm = async (data: AppraisalFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (typeof value === 'string') {
        formData.append(key, value);
      }
    }

    const result = await submitAppraisal(formData);

    if (result.success) {
      setCurrentStep(steps.length); // Go to summary step
    } else {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your appraisal. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };
  
  const restartForm = () => {
    form.reset();
    setCurrentStep(0);
  }

  const progress = ((currentStep + 1) / (steps.length + 1)) * 100;

  return (
    <Card className="w-full max-w-3xl shadow-2xl">
      <CardContent className="p-4 sm:p-8">
        <FormStepper steps={steps} currentStep={currentStep} progress={progress} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(processForm)} className="mt-8 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <VehicleInfoStep />}
                {currentStep === 1 && <PhotosStep />}
                {currentStep === 2 && <ConditionStep />}
                {currentStep === 3 && <ContactInfoStep />}
                {currentStep === steps.length && <SummaryStep onRestart={restartForm} />}
              </motion.div>
            </AnimatePresence>

            {currentStep < steps.length && (
              <div className="flex justify-between items-center pt-4 border-t">
                <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
                  Previous
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Appraisal'}
                  </Button>
                ) : (
                  <Button type="button" onClick={nextStep}>
                    Next Step
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
