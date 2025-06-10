import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    try {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Get file extension
      const extension = file.name.split('.').pop();
      const baseName = file.name.slice(0, -(extension?.length || 0) - 1);
      
      // Create a unique filename with timestamp
      const uniqueFilename = `${baseName}_${Date.now()}.${extension}`;

      // Upload to Vercel Blob Storage
      const blob = await put(uniqueFilename, buffer, {
        access: 'public',
        contentType: file.type,
        addRandomSuffix: true
      });

      if (!blob.url) {
        throw new Error('No URL returned from blob storage');
      }

      // Return only the blob URL
      return NextResponse.json({ 
        url: blob.url
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      return NextResponse.json(
        { error: 'Failed to upload image. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in upload handler:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}