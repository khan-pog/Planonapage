export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGES = 10;

export interface ImageValidationError {
  code: 'SIZE_LIMIT' | 'COUNT_LIMIT';
  message: string;
}

export const validateImage = (file: File): ImageValidationError | null => {
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      code: 'SIZE_LIMIT',
      message: `Image size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
    };
  }
  return null;
};

export const validateImageCount = (files: File[]): ImageValidationError | null => {
  if (files.length > MAX_IMAGES) {
    return {
      code: 'COUNT_LIMIT',
      message: `Maximum ${MAX_IMAGES} images allowed`
    };
  }
  return null;
};

export const validateImages = (files: File[]): ImageValidationError | null => {
  // Check total count first
  const countError = validateImageCount(files);
  if (countError) return countError;

  // Then check each file's size
  for (const file of files) {
    const sizeError = validateImage(file);
    if (sizeError) return sizeError;
  }

  return null;
}; 