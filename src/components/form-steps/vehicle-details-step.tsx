'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function VehicleDetailsStep() {
  const { control } = useFormContext();

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Vehicle Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="transmission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transmission</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="drivetrain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drivetrain</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select drivetrain type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2-Wheel Drive">2-Wheel Drive</SelectItem>
                  <SelectItem value="4-Wheel Drive">4-Wheel Drive</SelectItem>
                  <SelectItem value="All-Wheel Drive">All-Wheel Drive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
