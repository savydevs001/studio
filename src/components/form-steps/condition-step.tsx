'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const historyQuestions = [
  { name: 'accidentHistory', label: 'Has the vehicle ever been in an accident?', detailsName: 'accidentDetails', detailsLabel: 'accident', placeholder: 'e.g., Minor front-end collision, repaired in 2021.' },
  { name: 'frameDamage', label: 'Does the vehicle have any frame damage?', detailsName: 'frameDamageDetails', detailsLabel: 'frame damage', placeholder: 'e.g., Damage to the driver-side frame rail.' },
  { name: 'floodDamage', label: 'Does the vehicle have any flood damage?', detailsName: 'floodDamageDetails', detailsLabel: 'flood damage', placeholder: 'e.g., Vehicle was in a flash flood, interior was replaced.' },
  { name: 'smokedIn', label: 'Has this vehicle been smoked in?', detailsName: 'smokedInDetails', detailsLabel: 'smoking history', placeholder: 'e.g., Previous owner was a smoker, vehicle has been detailed.' },
];

const mechanicalQuestions = [
  { name: 'mechanicalIssues', label: 'Are there any mechanical issues or warning lights displayed on the dashboard?', detailsName: 'mechanicalIssuesDetails', detailsLabel: 'mechanical issues', placeholder: 'e.g., Check engine light is on, code indicates an oxygen sensor issue.' },
  { name: 'odometerBroken', label: 'Has the odometer ever been broken or replaced?', detailsName: 'odometerBrokenDetails', detailsLabel: 'odometer issue', placeholder: 'e.g., Odometer was replaced at 80,000 miles.' },
];

const exteriorQuestions = [
    { name: 'paintBodyWork', label: 'Are there any panels in need of paint or body work?', options: ['No', 'Yes, 1', 'Yes, 2', 'Yes, 3+'], values:['no', '1', '2', '3+'], detailsName: 'paintBodyWorkDetails', detailsLabel: 'paint/body work', placeholder: 'e.g., Scratches on the rear bumper and a dent on the passenger door.' },
    { name: 'rustHailDamage', label: 'Any major rust and/or hail damage?', options: ['No', 'Yes'], values:['no', 'yes'], detailsName: 'rustHailDamageDetails', detailsLabel: 'rust/hail damage', placeholder: 'e.g., Minor hail damage on the hood and roof.' },
];

const interiorQuestions = [
    { name: 'interiorBroken', label: 'Are any interior parts broken or inoperable?', options: ['No', 'Yes, 1', 'Yes, 2', 'Yes, 3+'], values:['no', '1', '2', '3+'], detailsName: 'interiorBrokenDetails', detailsLabel: 'broken interior parts', placeholder: 'e.g., Center console latch is broken.' },
    { name: 'interiorRips', label: 'Are there any rips, tears, or stains in the interior?', options: ['No', 'Yes, 1', 'Yes, 2', 'Yes, 3+'], values:['no', '1', '2', '3+'], detailsName: 'interiorRipsDetails', detailsLabel: 'interior damage', placeholder: 'e.g., Small tear on the driver\'s seat bolster.' },
];

const otherQuestions = [
    { name: 'tiresNeedReplacement', label: 'Do any tires need to be replaced?', options: ['No', 'Yes, 1 or 2', 'Yes, 3 or 4'], values:['no', '1-2', '3-4'], detailsName: 'tiresNeedReplacementDetails', detailsLabel: 'tires', placeholder: 'e.g., Both front tires will need replacement soon.' },
    { name: 'aftermarketModifications', label: 'Does the vehicle have any aftermarket modifications?', options: ['No', 'Yes'], values:['no', 'yes'], detailsName: 'aftermarketModificationsDetails', detailsLabel: 'aftermarket modifications', placeholder: 'e.g., Upgraded exhaust system and cold air intake.' },
    { name: 'otherIssues', label: 'Are there any other issues with the vehicle?', options: ['No', 'Yes'], values:['no', 'yes'], detailsName: 'otherIssuesDetails', detailsLabel: 'other issues', placeholder: 'e.g., The radio display sometimes flickers.' },
];

const ConditionalDetailsField = ({ watchName, detailsName, detailsLabel, placeholder }: { watchName: string; detailsName: string; detailsLabel: string; placeholder: string; }) => {
  const { watch, control } = useFormContext();
  const watchedValue = watch(watchName);
  const showDetails = watchedValue && watchedValue !== 'no';

  return (
    <AnimatePresence>
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <FormField
            control={control}
            name={detailsName}
            render={({ field }) => (
              <FormItem className="mt-3">
                <FormLabel>Please provide details about the {detailsLabel}</FormLabel>
                <FormControl>
                  <Textarea placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const Question = ({ name, label, options, values, detailsName, detailsLabel, placeholder }: { name: string; label: string; options: string[], values: string[], detailsName?: string, detailsLabel?: string, placeholder?: string }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3 p-4 border rounded-lg">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-wrap gap-x-4 gap-y-2"
            >
              {options.map((option, index) => (
                <FormItem key={values[index]} className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={values[index]} />
                  </FormControl>
                  <FormLabel className="font-normal">{option}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
          {detailsName && detailsLabel && placeholder && <ConditionalDetailsField watchName={name} detailsName={detailsName} detailsLabel={detailsLabel} placeholder={placeholder} />}
        </FormItem>
      )}
    />
  );
};

const YesNoQuestion = ({ name, label, detailsName, detailsLabel, placeholder }: { name: string; label: string; detailsName?: string, detailsLabel?: string, placeholder?: string }) => (
  <Question name={name} label={label} options={['No', 'Yes']} values={['no', 'yes']} detailsName={detailsName} detailsLabel={detailsLabel} placeholder={placeholder} />
);


export default function ConditionStep() {
  const { control } = useFormContext();
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">History</h3>
        <div className="space-y-6">
          {historyQuestions.map((q) => <YesNoQuestion key={q.name} {...q} />)}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Mechanical</h3>
        <div className="space-y-6">
          {mechanicalQuestions.map((q) => <YesNoQuestion key={q.name} {...q} />)}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Exterior</h3>
        <div className="space-y-6">
          {exteriorQuestions.map((q) => <Question key={q.name} {...q} />)}
        </div>
      </div>
       <div>
        <h3 className="text-lg font-semibold mb-4">Interior</h3>
        <div className="space-y-6">
          {interiorQuestions.map((q) => <Question key={q.name} {...q} />)}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Other</h3>
        <div className="space-y-6">
            {otherQuestions.map((q) => <Question key={q.name} {...q} />)}
            <FormField
                control={control}
                name="keys"
                render={({ field }) => (
                <FormItem className="p-4 border rounded-lg">
                    <FormLabel>How many keys do you have?</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-x-4 gap-y-2"
                            >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="2+" />
                                </FormControl>
                                <FormLabel className="font-normal">2 or more</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="1" />
                                </FormControl>
                                <FormLabel className="font-normal">1</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
      </div>
    </div>
  );
}
