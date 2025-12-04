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
  { id: '01', name: 'Vehicle', fields: ['vin', 'make', 'model', 'year', 'odometer', 'trim'] },
  { id: '02', name: 'Details', fields: ['transmission', 'drivetrain'] },
  { id: '03', name: 'Condition', fields: [
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
  { id: '04', name: 'Photos', fields: [
    'photoOdometer',
    'photoVin',
    'photoFrontSeats',
    'photoInteriorRoof',
    'photoDriverFrontDoor',
    'photoDriverApron',
    'photoPassengerApron',
    'photoDriverFrontCorner',
    'photoRearSeatArea',
    'photoDashboard',
    'photoPassengerRearCorner',
    'photoTrunkArea',
    'photoPassengerQuarterPanel',
    'photoDriverQuarterPanel',
    'photoDriverRearWheel',
  ] },
  { id: '05', name: 'Contact', fields: ['name', 'email', 'phone'] },
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
      photoOdometer: null,
      photoVin: null,
      photoFrontSeats: null,
      photoInteriorRoof: null,
      photoDriverFrontDoor: null,
      photoDriverApron: null,
      photoPassengerApron: null,
      photoDriverFrontCorner: null,
      photoRearSeatArea: null,
      photoDashboard: null,
      photoPassengerRearCorner: null,
      photoTrunkArea: null,
      photoPassengerQuarterPanel: null,
      photoDriverQuarterPanel: null,
      photoDriverRearWheel: null,
    },
    mode: 'onTouched'
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
        } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    }

    const result = await submitAppraisal(formData);

    if (result.success) {
      setCurrentStep(steps.length); // Go to summary step
    } else {
      toast({
        title: "Submission Failed",
        description: result.message || "There was an error submitting your appraisal. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };
  
  const restartForm = () => {
    form.reset();
    setCurrentStep(0);
  }

  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <Card className="w-full max-w-3xl shadow-2xl">
      <CardContent className="p-4 sm:p-8">
        {currentStep < steps.length && (
          <div className="mb-8 space-y-4">
            <div className="mb-8">
                <FormStepper steps={steps} currentStep={currentStep} progress={progress} />
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
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
                {currentStep === 1 && <VehicleDetailsStep />}
                {currentStep === 2 && <ConditionStep />}
                {currentStep === 3 && <PhotosStep />}
                {currentStep === 4 && <ContactInfoStep />}
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
