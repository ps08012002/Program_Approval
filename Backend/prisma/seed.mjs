import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.tb_atasan.createMany({
    data: [
      //Ganti email dengan email penerima notif
      { atasan: "CA", email: "Email CA" },
      { atasan: "FAT", email: "Email FAT" },
      { atasan: "HR", email: "Email HR" },
      { atasan: "CC", email: "Email CC" },
      { atasan: "QC", email: "Email QC" },
      { atasan: "QA", email: "Email QA" },
      { atasan: "LOGISTIK", email: "Email LOGISTIK" },
      { atasan: "PRODUKSI", email: "Email PRODUKSI" },
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
