import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { validateImages, MAX_IMAGE_SIZE, MAX_IMAGES } from '@/utils/imageValidation';
import { toast } from 'sonner';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = MAX_IMAGES }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    const newImages: string[] = [];

    // Validate all files first
    const validationError = validateImages(Array.from(files));
    if (validationError) {
      toast.error(validationError.message);
      setUploading(false);
      return;
    }

    // Check if adding these files would exceed the max images limit
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      setUploading(false);
      return;
    }

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select only image files');
        continue;
      }

      try {
        // Convert to base64 for storage (in production, upload to cloud storage)
        const reader = new FileReader();
        const result = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        newImages.push(result);
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error('Error processing file: ' + file.name);
      }
    }

    onChange([...images, ...newImages]);
    setUploading(false);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    const files = event.dataTransfer.files;
    if (!files) return;

    // Create a synthetic file input event
    const syntheticEvent = {
      target: { files }
    } as React.ChangeEvent<HTMLInputElement>;
    
    await handleFileSelect(syntheticEvent);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
            <img
              src={image || "/placeholder.svg"}
              alt={`Project image ${index + 1}`}
              className="object-cover w-full h-full"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <div 
            className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={triggerFileSelect}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to {MAX_IMAGE_SIZE / (1024 * 1024)}MB
            </p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {images.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {images.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
}