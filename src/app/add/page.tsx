'use client'; 

import { useState } from 'react';
import type { BookFormData } from '@/components/BookForm'; 
import BookForm from '@/components/BookForm';

export default function AddBookPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const handleSubmit = async (data: BookFormData, file?: File) => {
    setIsLoading(true);
    setError(null);

    try {
      let coverImageUrl: string | null = null;

      // -- TAHAP 1: Upload File (jika ada) --
      if (file) {
        console.log('Uploading file...');
        const uploadRes = await fetch(`/api/upload?filename=${file.name}`, {
          method: 'POST',
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error('Gagal upload gambar');
        }
        
        const blob = await uploadRes.json();
        coverImageUrl = blob.url;
        console.log('File uploaded:', coverImageUrl);
      }

      // -- TAHAP 2: Simpan Data Buku (dengan URL baru) --
      console.log('Saving book data...');
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data, // title, author, year
          coverImage: coverImageUrl,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menambahkan buku');
      }
      
      console.log('Book saved!');
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 md:p-24">
      <h1 className="text-4xl font-bold mb-8">Tambah Buku Baru</h1>
      
      {/* Tampilkan error jika ada */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Render komponen form, passing logika handleSubmit */}
      <BookForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Simpan Buku"
      />
    </main>
  );
}