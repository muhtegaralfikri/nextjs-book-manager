import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import singleton Prisma kita

/**
 * Handler untuk GET /api/books
 * Mengambil semua buku
 */
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      // Urutkan berdasarkan yang terbaru
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    return NextResponse.json(
      { error: 'Failed to fetch books.' },
      { status: 500 }
    );
  }
}

/**
 * Handler untuk POST /api/books
 * Membuat buku baru
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, author, year, coverImage } = data;

    // Validasi sederhana (di proyek real, gunakan Zod)
    if (!title || !author || !year) {
      return NextResponse.json(
        { error: 'Title, author, and year are required.' },
        { status: 400 }
      );
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        year: Number(year), // Pastikan 'year' adalah angka
        coverImage,
      },
    });

    return NextResponse.json(newBook, { status: 201 }); // 201 = Created
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create book.' },
      { status: 500 }
    );
  }
}