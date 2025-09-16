import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
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
  request: NextRequest,
  context: any
) {
  try {
    const data = await request.json();
    const id = context.params.id;

    const { title, author, year, coverImage } = data;

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

    revalidatePath('/');

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    await request.text();
    const id = context.params.id;

    await prisma.book.delete({
      where: { id: id },
    });
    revalidatePath('/');
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete book.' },
      { status: 500 }
    );
  }
}