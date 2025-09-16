import { PrismaClient } from '@prisma/client';
// Mendeklarasikan 'prisma' di globalThis untuk menghindari duplikasi
declare global {
  var prisma: PrismaClient | undefined;
}

// Mencegah multiple instance PrismaClient di 'development'
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    // Aktifkan log query untuk debugging
    log: ['query', 'info', 'warn', 'error'],
  });

// Jika bukan di produksi, simpan instance ke globalThis
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;