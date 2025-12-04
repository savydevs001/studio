'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const historyQuestions = [
  { name: 'accidentHistory', label: 'Has the vehicle ever been in an accident?', detailsName: 'accidentDetails' },
  { name: 'frameDamage', label: 'Does the vehicle have any frame damage?', detailsName: 'frameDamageDetails' },
  { name: 'floodDamage', label: 'Does the vehicle have any flood damage?', detailsName: 'floodDamageDetails' },
  { name: 'smokedIn', label: 'Has this vehicle been smoked in?', detailsName: 'smokedInDetails' },
];

const mechanicalQuestions = [
  { name: 'mechanicalIssues', label: 'Are there any mechanical issues or warning lights displayed on the dashboard?', detailsName: 'mechanicalIssuesDetails' },
  { name: 'odometerBroken', label: 'Has the odometer ever been broken or replaced?', detailsName: 'odometerBrokenDetails' },
];

const exteriorQuestions = [
    { name: 'paintBodyWork', label: 'Are there any panels in need of paint or body work?', options: ['No', 'Yes, 1', 'Yes, 2', 'Yes, 3+'], values:['no', '1', '2', '3+'], detailsName: 'paintBodyWorkDetails' },
    { name: 'rustHailDamage', label: 'Any major rust and/or hail damage?', options: ['No', 'Yes'], values:['no', 'yes'], detailsName: 'rustHailDamageDetails' },
];

const interiorQuestions = [
    { name: 'interiorBroken', label: 'Are any interior parts broken or inoperable?', options: ['No', 'Yes, 1', 'Yes, 2', 'Yes, 3+'], values:['no', '1', '2', '3+'], detailsName: 'interiorBrokenDetails' },
    { name: 'interiorRips', label: 'Are there any rips, tears, or stains in the interior?', options: ['No', 'Yes, 1', 'Yes, 2', 'Yes, 3+'], values:['no', '1', '2', '3+'], detailsName: 'interiorRipsDetails' },
];

const otherQuestions = [
    { name: 'tiresNeedReplacement', label: 'Do any tires need to be replaced?', options: ['No', 'Yes, 1 or 2', 'Yes, 3 or 4'], values:['no', '1-2', '3-4'], detailsName: 'tiresNeedReplacementDetails' },
    { name: 'aftermarketModifications', label: 'Does the vehicle have any aftermarket modifications?', options: ['No', 'Yes'], values:['no', 'yes'], detailsName: 'aftermarketModificationsDetails' },
    { name: 'otherIssues', label: 'Are there any other issues with the vehicle?', options: ['No', 'Yes'], values:['no', 'yes'], detailsName: 'otherIssuesDetails' },
];

const ConditionalDetailsField = ({ watchName, detailsName, label }: { watchName: string; detailsName: string; label: string; }) => {
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
                <FormLabel>Please provide details about the {label.toLowerCase()}</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Small dent on the driver side door." {...field} />
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


const Question = ({ name, label, options, values, detailsName }: { name: string; label: string; options: string[], values: string[], detailsName?: string }) => {
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
          {detailsName && <ConditionalDetailsField watchName={name} detailsName={detailsName} label={label} />}
        </FormItem>
      )}
    />
  );
};

const YesNoQuestion = ({ name, label, detailsName }: { name: string; label: string; detailsName?: string }) => (
  <Question name={name} label={label} options={['No', 'Yes']} values={['no', 'yes']} detailsName={detailsName} />
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
