'use client'; 

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import type { BookFormData } from '@/components/BookForm'; 
import BookForm from '@/components/BookForm';
import { Book } from '@prisma/client';

export default function EditBookPage() {
  const [initialData, setInitialData] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const id = params.id as string; 

  // 1. Ambil data buku saat halaman di-load (Logic ini tetap sama)
  useEffect(() => {
    if (!id) return; 

    const fetchBookData = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        if (!res.ok) {
          throw new Error('Buku tidak ditemukan');
        }
        const book = await res.json();
        setInitialData(book); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false); 
      }
    };

    fetchBookData();
  }, [id]);

  // 2. LOGIKA BARU (2-Langkah + Kondisional)
  const handleSubmit = async (data: BookFormData, file?: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mulai dengan URL gambar yang *sudah ada*
      let coverImageUrl: string | null = initialData?.coverImage || null;

      // -- TAHAP 1: Cek & Upload File BARU (jika ada) --
      if (file) {
        console.log('New file selected. Uploading...');
        const uploadRes = await fetch(`/api/upload?filename=${file.name}`, {
          method: 'POST',
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error('Gagal upload gambar baru');
        }
        
        const blob = await uploadRes.json();
        coverImageUrl = blob.url; // Ganti URL-nya dengan yang baru
        console.log('New file uploaded:', coverImageUrl);
      }

      // -- TAHAP 2: Simpan Data Buku (PUT) --
      console.log('Updating book data...');
      const res = await fetch(`/api/books/${id}`, { // Target ID spesifik
        method: 'PUT', // Method PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data, // title, author, year
          coverImage: coverImageUrl,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal mengupdate buku');
      }
      
      console.log('Book updated!');
      router.push('/'); 
      router.refresh(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };
  
  if (isLoading && !initialData) {
    return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <p>Loading data buku...</p>
      </main>
    );
  }
  
  if (error) {
     return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <p className="text-red-500">Error: {error}</p>
         <Link href="/" className="text-blue-500 mt-4">Kembali ke Home</Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 md:p-24">
      <h1 className="text-4xl font-bold mb-8">Edit Buku</h1>
      
      {/* Tampilkan error submit jika ada */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      {/* Render komponen form dengan data awal */}
      <BookForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        initialData={initialData}
        submitButtonText="Simpan Perubahan"
      />
    </main>
  );
}