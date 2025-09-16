'use client';

import { Book } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // 2. Import useRouter
import { useState } from 'react';
import Link from 'next/link';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // 3. Panggil hook router

  // 4. Buat fungsi handler untuk delete
  const handleDelete = async () => {
    // Konfirmasi sederhana (best practice)
    if (!confirm(`Apakah Anda yakin ingin menghapus "${book.title}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Gagal menghapus buku');
      }

      // 5. Refresh halaman untuk memuat ulang data
      // Ini akan memicu Server Component (page.tsx) untuk refetch
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col gap-2 bg-white text-black">
      <Image
        src={book.coverImage || 'https://via.placeholder.com/150'}
        alt={book.title}
        width={150}
        height={220}
        className="rounded object-cover w-full h-48"
      />
      <h2 className="text-xl font-bold truncate">{book.title}</h2>
      <p className="text-gray-700">by {book.author}</p>
      <p className="text-gray-500 text-sm mb-2">{book.year}</p>

      {/* 6. Tambahkan tombol Edit dan Delete */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="w-full bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Menghapus...' : 'Hapus'}
        </button>
        <Link
          href={`/edit/${book.id}`}
          className="w-full bg-blue-600 text-white text-center px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}