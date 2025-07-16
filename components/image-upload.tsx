import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  // Track whether any upload operation is in progress
  const [uploading, setUploading] = useState(false);
  // Keep a list of image indices that are currently uploading so we can
  // render a skeleton + spinner for each. These indices relate to the
  // `images` array that is passed in from the parent component.
  const [uploadingIndices, setUploadingIndices] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    const newImages: string[] = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (images.length + newImages.length >= maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`, {
          icon: <AlertCircle className="h-4 w-4" />,
        });
        break;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`"${file.name}" is not an image file`, {
          icon: <AlertCircle className="h-4 w-4" />,
        });
        failureCount++;
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large (max 10MB)`, {
          icon: <AlertCircle className="h-4 w-4" />,
        });
        failureCount++;
        continue;
      }

      // Add a temporary placeholder entry so the UI immediately shows a slot
      // for this image. We use the generic placeholder graphic which will be
      // replaced with the real URL once the upload succeeds.
      const placeholderIndex = images.length + newImages.length;
      let currentImages = [...images, ...newImages, "/placeholder.svg"];
      onChange(currentImages);

      // Mark this placeholder as uploading so we can render a skeleton.
      setUploadingIndices((prev) => [...prev, placeholderIndex]);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const data = await response.json();
        // Replace the placeholder with the actual image URL
        const successImages = [...currentImages];
        successImages[placeholderIndex] = data.url;
        newImages.push(data.url);

        // Update parent with the real URL replacing the placeholder
        onChange(successImages);

        // Remove the index from uploading list
        setUploadingIndices((prev) => prev.filter((idx) => idx !== placeholderIndex));

        successCount++;
        toast.success(`Successfully uploaded "${file.name}"`, {
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
      } catch (error) {
        console.error('Error processing file:', error);

        // Remove the placeholder slot and adjust indices accordingly
        const failIndex = placeholderIndex;
        const failImages = [...currentImages];
        failImages.splice(failIndex, 1);
        onChange(failImages);

        setUploadingIndices((prev) => prev
          .filter((idx) => idx !== failIndex)
          .map((idx) => (idx > failIndex ? idx - 1 : idx))
        );

        toast.error(`Failed to upload "${file.name}"`, {
          icon: <AlertCircle className="h-4 w-4" />,
          description: error instanceof Error ? error.message : 'Please try again',
        });
        failureCount++;
      }
    }

    // Show summary toast if multiple files were uploaded
    if (files.length > 1) {
      if (successCount > 0 && failureCount > 0) {
        toast.info(`Upload complete: ${successCount} succeeded, ${failureCount} failed`, {
          icon: <AlertCircle className="h-4 w-4" />,
        });
      } else if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} images`, {
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
      } else if (failureCount > 0) {
        toast.error(`Failed to upload ${failureCount} images`, {
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    }

    // All uploads finished
    setUploading(false);
    setUploadingIndices([]);
    
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
    toast.success('Image removed', {
      icon: <CheckCircle2 className="h-4 w-4" />,
    });
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => {
          const isUploading = uploadingIndices.includes(index);
          return (
            <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
              {isUploading ? (
                <Skeleton className="flex items-center justify-center w-full h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </Skeleton>
              ) : (
                <>
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
                </>
              )}
            </div>
          );
        })}
        
        {images.length < maxImages && (
          <div 
            className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={triggerFileSelect}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            role="button"
            tabIndex={0}
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 text-muted-foreground mb-2 animate-spin" />
                <p className="text-sm text-muted-foreground text-center">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              </>
            )}
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
        aria-label="Upload images"
      />
      
      {images.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {images.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
}