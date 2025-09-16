import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  context: { params: { id: string } } 
) {
  try {
  
    await request.text();

    const id = context.params.id; 
    await prisma.book.delete({
      where: { id: id },
    });

    // Kirim respons sukses
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete book.' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await request.text();

    const id = context.params.id;

    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // 1. Await request body dulu (ini juga fix-nya warning sync)
    const data = await request.json();
    // 2. Baru ambil ID
    const id = context.params.id;

    const { title, author, year, coverImage } = data;

    // Validasi sederhana
    if (!title || !author || !year) {
      return NextResponse.json(
        { error: 'Title, author, and year are required.' },
        { status: 400 }
      );
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        year: Number(year),
        coverImage,
      },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}