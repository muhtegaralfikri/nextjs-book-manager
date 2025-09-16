import prisma from '@/lib/prisma';
import BookCard from '@/components/BookCard'; 
import Link from 'next/link';
async function getBooks() {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: 'desc', // Tampilkan yang terbaru di atas
      },
    });
    return books;
  } catch (error) {
    console.error(error);
    // Jika gagal, kembalikan array kosong
    return [];
  }
}

// Ubah fungsi 'Home' menjadi 'async'
export default async function Home() {
  // Panggil fungsi getBooks() langsung di server component
  const books = await getBooks();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 md:p-24">
      <h1 className="text-4xl font-bold mb-8">Sistem Manajemen Buku</h1>
      <div className="mb-6">
        <Link
          href="/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
        Tambah Buku Baru
        </Link>
      </div>
      {/* Kontainer untuk daftar buku */}
      {books.length === 0 ? (
        <p className="text-gray-400">Belum ada buku ditambahkan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
          {/* Loop (map) data buku dan render BookCard untuk setiap buku */}
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </main>
  );
}