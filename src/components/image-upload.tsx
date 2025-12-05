'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { X, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormMessage, FormControl, FormLabel } from '@/components/ui/form';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface ImageUploadProps {
  name: string;
  label: string;
  icon: ReactNode;
  exampleImageUrl: string;
  imageHint: string;
  description?: string;
  descriptionName?: string;
}

export default function ImageUpload({ name, label, icon, exampleImageUrl, imageHint, description, descriptionName }: ImageUploadProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);
  const fileList = watch(name);
  const hasError = !!errors[name] || (descriptionName && !!errors[descriptionName]);
  const showDescription = descriptionName && fileList && fileList.length > 0;

  useEffect(() => {
    // This effect creates a preview URL whenever the file list changes.
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (file instanceof File) {
        const newPreview = URL.createObjectURL(file);
        setPreview(newPreview);
        // Cleanup function to revoke the object URL to avoid memory leaks
        return () => URL.revokeObjectURL(newPreview);
      }
    } else {
      setPreview(null);
    }
  }, [fileList]);

  const handleRemoveImage = () => {
    setValue(name, undefined, { shouldValidate: true, shouldDirty: true });
    if (descriptionName) {
      setValue(descriptionName, '', { shouldValidate: true, shouldDirty: true });
    }
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <FormField
        control={control}
        name={name}
        render={({ field: { onChange } }) => (
          <FormItem>
            <Card className={cn("overflow-hidden transition-colors rounded-lg", hasError && 'border-destructive')}>
              <CardContent className="p-0">
                <div className="relative aspect-video w-full">
                  <Image 
                    src={preview || exampleImageUrl} 
                    alt={preview ? `${label} preview` : `Example for ${label}`} 
                    fill 
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={!preview ? imageHint : ''}
                    className="bg-secondary"
                  />
                  {preview && (
                    <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-7 w-7 z-10"
                        onClick={handleRemoveImage}
                        aria-label="Remove image"
                    >
                        <X size={16} />
                    </Button>
                  )}
                  <Label 
                    htmlFor={name}
                    className={cn(
                        'absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity cursor-pointer group-hover:opacity-100',
                        !preview && 'opacity-100 bg-transparent hover:bg-black/50',
                    )}
                  >
                      <div className="text-center rounded-full bg-white/10 p-4 backdrop-blur-sm">
                        {icon}
                        <span className="mt-2 text-sm font-semibold">
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
                    capture="environment"
                    className="sr-only"
                    onChange={(e) => onChange(e.target.files)}
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
      {descriptionName && (
        <AnimatePresence>
          {showDescription && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <FormField
                control={control}
                name={descriptionName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">{`Description for ${label}`}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={`Describe ${label.toLowerCase()}...`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
