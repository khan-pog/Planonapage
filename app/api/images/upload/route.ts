import { NextRequest, NextResponse } from 'next/server';

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

    // Convert file to base64 for storage
    // In a real implementation, you would upload to a cloud storage service like AWS S3, Cloudinary, etc.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // In a production environment, you would:
    // 1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Return the public URL
    // 
    // Example with AWS S3:
    // const uploadResult = await s3.upload({
    //   Bucket: process.env.AWS_S3_BUCKET_NAME,
    //   Key: `projects/${Date.now()}-${file.name}`,
    //   Body: buffer,
    //   ContentType: file.type,
    // }).promise();
    // 
    // return NextResponse.json({ url: uploadResult.Location });

    // For now, return the base64 data URL
    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}