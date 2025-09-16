import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  // API ini akan menerima nama file dari query parameter
  // Contoh: /api/upload?filename=cover.jpg
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json(
      { error: 'No filename provided.' },
      { status: 400 }
    );
  }

  if (!request.body) {
     return NextResponse.json(
      { error: 'No file body provided.' },
      { status: 400 }
    );
  }

  // 'put' adalah magic-nya Vercel Blob
  // Dia akan stream file dari 'request.body' ke Blob storage
  const blob = await put(filename, request.body, {
    access: 'public', // 'public' agar bisa diakses oleh <Image>
    addRandomSuffix: true,
  });

  // Kembalikan response JSON dari Vercel (termasuk 'blob.url')
  return NextResponse.json(blob);
}