'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function VehicleInfoStep() {
  const { control, setValue, getValues, trigger } = useFormContext();
  const [isDecoding, setIsDecoding] = useState(false);
  const { toast } = useToast();

  const handleDecodeVin = async () => {
    const vin = getValues('vin');
    const isValidVin = await trigger('vin');
    if (!isValidVin) {
      return;
    }
    
    setIsDecoding(true);
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
      if (!response.ok) {
        throw new Error('Failed to fetch VIN data');
      }
      const data = await response.json();
      
      const getVal = (id: string) => data.Results.find((item: any) => item.VariableId === id)?.Value || '';

      const make = getVal('26');
      const model = getVal('28');
      const year = getVal('29');

      if (make && model && year) {
        setValue('make', make, { shouldValidate: true });
        setValue('model', model, { shouldValidate: true });
        setValue('year', parseInt(year), { shouldValidate: true });
        toast({
            title: 'VIN Decoded',
            description: 'Vehicle information has been filled out.',
        });
      } else {
         toast({
            title: 'Error',
            description: 'Could not decode VIN. Please enter details manually.',
            variant: 'destructive',
        });
      }
    } catch (error) {
       toast({
            title: 'Error',
            description: 'Failed to decode VIN. Please check the VIN and try again.',
            variant: 'destructive',
        });
    } finally {
      setIsDecoding(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="vin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>VIN</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input placeholder="Enter your 17-digit VIN" {...field} />
              </FormControl>
              <Button type="button" onClick={handleDecodeVin} disabled={isDecoding}>
                {isDecoding ? 'Decoding...' : 'Decode'}
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Make</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Toyota" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Camry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2022" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="odometer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Odometer Reading</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 45000" type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
