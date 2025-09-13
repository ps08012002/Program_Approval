import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.tb_atasan.createMany({
    data: [
      { atasan: "CA", email: "ps08012002@gmail.com" },
      { atasan: "FAT", email: "ps08012002@gmail.com" },
      { atasan: "HR", email: "ps08012002@gmail.com" },
      { atasan: "CC", email: "ps08012002@gmail.com" },
      { atasan: "QC", email: "ps08012002@gmail.com" },
      { atasan: "QA", email: "ps08012002@gmail.com" },
      { atasan: "LOGISTIK", email: "ps08012002@gmail.com" },
      { atasan: "PRODUKSI", email: "ps08012002@gmail.com" },
    ],
  });

  await prisma.tb_perusahaan.createMany({
    data: [{ perusahaan: "PT SURYA PRIMA NATURA" }, { perusahaan: "MENTARI RETAIL JAYA" }],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
