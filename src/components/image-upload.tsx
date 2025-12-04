'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';

interface ImageUploadProps {
  name: string;
  label: string;
  icon: ReactNode;
}

export default function ImageUpload({ name, label, icon }: ImageUploadProps) {
  const { control, watch } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);
  const files = watch(name);

  useEffect(() => {
    if (files && files.length > 0) {
      const file = files[0];
      const newPreview = URL.createObjectURL(file);
      setPreview(newPreview);

      return () => URL.revokeObjectURL(newPreview);
    } else {
      setPreview(null);
    }
  }, [files]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...rest } }) => (
        <FormItem>
          <Card className={cn("hover:bg-accent transition-colors", preview && "border-primary")}>
            <CardContent className="p-0">
              <Label htmlFor={name} className="cursor-pointer">
                <div className="flex flex-col items-center justify-center p-4 aspect-square">
                  {preview ? (
                    <div className="relative w-full h-full rounded-md overflow-hidden">
                      <Image src={preview} alt={`${label} preview`} fill style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <>
                      <div className="text-primary mb-2">{icon}</div>
                      <span className="text-sm font-medium text-center text-foreground">{label}</span>
                    </>
                  )}
                </div>
              </Label>
              <FormControl>
                <Input
                  id={name}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="sr-only"
                  onChange={(e) => onChange(e.target.files)}
                  {...rest}
                />
              </FormControl>
            </CardContent>
          </Card>
          <FormMessage className="text-center" />
        </FormItem>
      )}
    />
  );
}
