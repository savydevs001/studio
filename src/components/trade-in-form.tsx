'use client';

import { useState } from 'react';
import { useForm, type FieldName } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';

import { appraisalSchema, type AppraisalFormValues } from '@/lib/schema';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

import { Form } from '@/components/ui/form';
import FormStepper from '@/components/form-stepper';
import VehicleInfoStep from './form-steps/vehicle-info-step';
import VehicleDetailsStep from './form-steps/vehicle-details-step';
import PhotosStep from './form-steps/photos-step';
import ConditionStep from './form-steps/condition-step';
import ContactInfoStep from './form-steps/contact-info-step';
import SummaryStep from './form-steps/summary-step';

const steps = [
  { id: '1', name: 'Vehicle', fields: ['vin', 'make', 'model', 'year', 'odometer', 'trim'] },
  { id: '2', name: 'Details', fields: ['transmission', 'drivetrain'] },
  { id: '3', name: 'Condition', fields: [
    'accidentHistory', 'accidentDetails',
    'frameDamage', 'frameDamageDetails',
    'floodDamage', 'floodDamageDetails',
    'smokedIn', 'smokedInDetails',
    'mechanicalIssues', 'mechanicalIssuesDetails',
    'odometerBroken', 'odometerBrokenDetails',
    'paintBodyWork', 'paintBodyWorkDetails',
    'rustHailDamage', 'rustHailDamageDetails',
    'interiorBroken', 'interiorBrokenDetails',
    'interiorRips', 'interiorRipsDetails',
    'tiresNeedReplacement', 'tiresNeedReplacementDetails',
    'keys',
    'aftermarketModifications', 'aftermarketModificationsDetails',
    'otherIssues', 'otherIssuesDetails',
  ] },
  { id: '4', name: 'Photos', fields: [
    'photoDriverFrontCorner',
    'photoDriverQuarterPanel',
    'photoPassengerQuarterPanel',
    'photoFrontSeats',
    'photoRearSeatArea',
    'photoDashboard',
    'photoDamage1', 'photoDamage1Description',
    'photoDamage2', 'photoDamage2Description',
    'photoDamage3', 'photoDamage3Description',
    'photoDamage4', 'photoDamage4Description',
    'photoFeature1', 'photoFeature1Description',
    'photoFeature2', 'photoFeature2Description',
    'photoFeature3', 'photoFeature3Description',
    'photoFeature4', 'photoFeature4Description',
  ] },
  { id: '5', name: 'Contact', fields: ['name', 'email', 'phone'] },
];

export default function TradeInForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<AppraisalFormValues>({
    resolver: zodResolver(appraisalSchema),
    defaultValues: {
      vin: '',
      make: '',
      model: '',
      year: '',
      odometer: '',
      trim: '',
      transmission: undefined,
      drivetrain: undefined,
      name: '',
      email: '',
      phone: '',
      accidentHistory: undefined,
      frameDamage: undefined,
      floodDamage: undefined,
      smokedIn: undefined,
      mechanicalIssues: undefined,
      odometerBroken: undefined,
      paintBodyWork: undefined,
      rustHailDamage: undefined,
      interiorBroken: undefined,
      interiorRips: undefined,
      tiresNeedReplacement: undefined,
      keys: undefined,
      aftermarketModifications: undefined,
      otherIssues: undefined,
      accidentDetails: '',
      frameDamageDetails: '',
      floodDamageDetails: '',
      smokedInDetails: '',
      mechanicalIssuesDetails: '',
      odometerBrokenDetails: '',
      paintBodyWorkDetails: '',
      rustHailDamageDetails: '',
      interiorBrokenDetails: '',
      interiorRipsDetails: '',
      tiresNeedReplacementDetails: '',
      aftermarketModificationsDetails: '',
      otherIssuesDetails: '',
      photoDriverFrontCorner: undefined,
      photoDriverQuarterPanel: undefined,
      photoPassengerQuarterPanel: undefined,
      photoFrontSeats: undefined,
      photoRearSeatArea: undefined,
      photoDashboard: undefined,
    },
    mode: 'onTouched'
  });

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as FieldName<AppraisalFormValues>[], { shouldFocus: true });

    if (!output) {
        toast({
            title: "Missing Fields",
            description: "Please fill out all required fields before continuing.",
            variant: "destructive",
        });
        return;
    };

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
      window.scrollTo(0, 0);
    }
  };

  const processForm = async (data: AppraisalFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
        if (value instanceof FileList && value.length > 0) {
            formData.append(key, value[0]);
        } else if (value !== undefined && value !== null && value !== '' && !(value instanceof FileList)) {
            formData.append(key, value.toString());
        }
    }

    try {
      const response = await fetch('/api/submit-appraisal', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }
      
      setSubmissionId(result.submissionId);
      setCurrentStep(steps.length); // Go to summary step
      window.scrollTo(0, 0);

    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your appraisal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const restartForm = () => {
    form.reset();
    setSubmissionId(null);
    setCurrentStep(0);
    window.scrollTo(0, 0);
  }

  const progress = ((currentStep + 1) / (steps.length + 1)) * 100;

  return (
    <Card className="w-full max-w-3xl shadow-lg border rounded-xl my-12">
      <CardContent className="p-4 sm:p-6 md:p-8">
        {currentStep < steps.length && (
          <div className="mb-8 space-y-6">
            <div className="flex justify-center py-4">
                <FormStepper steps={steps} currentStep={currentStep} progress={progress} />
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <VehicleInfoStep />}
                {currentStep === 1 && <VehicleDetailsStep />}
                {currentStep === 2 && <ConditionStep />}
                {currentStep === 3 && <PhotosStep />}
                {currentStep === 4 && <ContactInfoStep />}
                {currentStep === steps.length && <SummaryStep onRestart={restartForm} submissionId={submissionId} />}
              </motion.div>
            </AnimatePresence>

            {currentStep < steps.length && (
              <div className="flex justify-between items-center pt-6 border-t mt-8">
                <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0 || isSubmitting}>
                  Previous Step
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
