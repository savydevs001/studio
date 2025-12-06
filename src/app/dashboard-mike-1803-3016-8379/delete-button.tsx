'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/delete-appraisal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete submission.');
      }

      toast({
        title: 'Success!',
        description: 'The appraisal submission has been deleted.',
      });
      
      // Refresh the page to show the updated list
      router.refresh();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not delete submission.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete the
                appraisal submission and all associated images from the server.
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" disabled={isDeleting}>Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
