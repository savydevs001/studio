'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

const conditionQuestions = [
  { name: 'hasWarningLights', label: 'Any warning lights on the dashboard?' },
  { name: 'acBlowsCold', label: 'Does the A/C blow cold?' },
  { name: 'hasDrivetrainIssues', label: 'Any known drivetrain or engine issues?' },
  { name: 'hasSmokingOdor', label: 'Does the vehicle have a smoking odor?' },
  { name: 'hasPetOdor', label: 'Does the vehicle have a pet odor?' },
];

export default function ConditionStep() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      {conditionQuestions.map((question) => (
        <FormField
          key={question.name}
          control={control}
          name={question.name}
          render={({ field }) => (
            <FormItem className="space-y-3 p-4 border rounded-lg">
              <FormLabel>{question.label}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <FormField
        control={control}
        name="keys"
        render={({ field }) => (
          <FormItem className="p-4 border rounded-lg">
            <FormLabel>How many keys do you have?</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 2" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
