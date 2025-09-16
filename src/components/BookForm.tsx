// src/components/BookForm.tsx
'use client';

import { Book } from '@prisma/client';
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';

// Tipe untuk data teks (tanpa gambar)
export type BookFormData = {
  title: string;
  author: string;
  year: number;
};

// Props baru: onSubmit sekarang menerima data teks dan file TERPISAH
interface BookFormProps {
  onSubmit: (data: BookFormData, file?: File) => Promise<void>;
  initialData?: Book | null;
  isLoading: boolean;
  submitButtonText: string;
}

export default function BookForm({
  onSubmit,
  initialData = null,
  isLoading,
  submitButtonText,
}: BookFormProps) {
  
  // State untuk data teks
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  
  // State BARU untuk file
  const [file, setFile] = useState<File>();
  
  // State BARU untuk preview gambar (jika sedang edit)
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.coverImage || null
  );
  
  // Hook ini untuk mengisi form jika ini adalah halaman EDIT
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAuthor(initialData.author);
      setYear(initialData.year.toString());
      setImagePreview(initialData.coverImage || null);
    }
  }, [initialData]);
  
  // Handler BARU untuk input file
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Buat preview URL lokal untuk file yang baru dipilih
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  // Handler submit LOKAL
  const localSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Kumpulkan data teks
    const formData: BookFormData = {
      title,
      author,
      year: Number(year),
    };
    
    // Panggil onSubmit dari parent, kirim data teks DAN file
    await onSubmit(formData, file);
  };

  return (
    <form
      onSubmit={localSubmit}
      className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-md"
    >
      {/* ... (Input Title, Author, Year tetap sama) ... */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Judul Buku
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="author" className="block text-sm font-medium mb-2">
          Penulis
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="year" className="block text-sm font-medium mb-2">
          Tahun Terbit
        </label>
        <input
          id="year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Input Cover Image (DIUBAH) */}
      <div className="mb-6">
        <label
          htmlFor="coverImage"
          className="block text-sm font-medium mb-2"
        >
          Gambar Cover
        </label>
        <input
          id="coverImage"
          type="file" // <-- Ganti jadi 'file'
          accept="image/png, image/jpeg" // Hanya terima gambar
          onChange={handleFileChange} // Pakai handler baru
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {imagePreview && (
          <div className="mt-4 rounded-md w-32 h-auto relative" style={{ minHeight: '8rem' }}>
            <Image
              src={imagePreview}
              alt="Preview"
              className="rounded-md"
              width={128}
              height={128}
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-500"
      >
        {isLoading ? 'Menyimpan...' : submitButtonText}
      </button>
    </form>
  );
}