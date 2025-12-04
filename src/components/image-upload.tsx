'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { X, UploadCloud } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';
import { Button } from './ui/button';

interface ImageUploadProps {
  name: string;
  label: string;
  icon: ReactNode;
  exampleImageUrl: string;
  imageHint: string;
  description?: string;
}

export default function ImageUpload({ name, label, icon, exampleImageUrl, imageHint, description }: ImageUploadProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);
  const files = watch(name);
  const hasError = !!errors[name];

  useEffect(() => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file instanceof File) {
        const newPreview = URL.createObjectURL(file);
        setPreview(newPreview);
        return () => URL.revokeObjectURL(newPreview);
      }
    } else {
      setPreview(null);
    }
  }, [files]);

  const handleRemoveImage = () => {
    setValue(name, undefined, { shouldValidate: true, shouldDirty: true });
    setPreview(null);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...rest } }) => (
        <FormItem>
          <Card className={cn("overflow-hidden transition-colors", hasError && 'border-destructive')}>
            <CardContent className="p-0">
                <div className="relative aspect-video w-full">
                  <Image 
                    src={preview || exampleImageUrl} 
                    alt={preview ? `${label} preview` : `Example for ${label}`} 
                    fill 
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={!preview ? imageHint : ''}
                    className="bg-muted"
                  />
                  {preview && (
                    <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-6 w-6 z-10"
                        onClick={handleRemoveImage}
                        aria-label="Remove image"
                    >
                        <X size={16} />
                    </Button>
                  )}
                  <Label 
                    htmlFor={name}
                    className={cn(
                        'absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity cursor-pointer',
                        !preview && 'opacity-100 bg-transparent',
                        'hover:opacity-100'
                    )}
                >
                    <div className="flex flex-col items-center">
                        <UploadCloud size={32} />
                        <span className="mt-1 text-sm font-semibold">
                            {preview ? 'Change' : 'Upload'}
                        </span>
                    </div>
                  </Label>
                </div>
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
               <div className="p-3 bg-card space-y-1">
                  <p className="text-sm font-medium text-center text-foreground">{label}</p>
                  {description && <p className="text-xs text-muted-foreground text-center">{description}</p>}
                </div>
            </CardContent>
          </Card>
          <FormMessage className="text-center" />
        </FormItem>
      )}
    />
  );
}
