import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
const app = express();
const port = 3000;
const db = new PrismaClient();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/atasan", async (req, res) => {
  // Get atasan
  try {
    const test = await db.tb_atasan.findMany();
    res.send({ data: test });
  } catch (error) {
    res.status(500).send("internal server error");
  }
});

app.post("/atasan", async (req, res) => {
  // Create atasan
  try {
    console.log("req.body", req.body);

    await db.tb_atasan.create({
      data: {
        atasan: req.body.atasan,
        email: req.body.email,
      },
    });
    res.send("sukses insert atasan");
  } catch (error) {
    console.log("error", error);

    res.status(500).send({ "internal server error": error });
  }
});

app.get("/perusahaan", async (req, res) => {
  // Get perusahaan
  try {
    const test = await db.tb_perusahaan.findMany();
    res.send({ data: test });
  } catch (error) {
    res.status(500).send("internal server error");
  }
});

app.post("/perusahaan", async (req, res) => {
  // Create perusahaan
  try {
    console.log("req.body", req.body);

    await db.tb_perusahaan.create({ data: { perusahaan: req.body.perusahaan } });
    res.send("sukses insert atasan");
  } catch (error) {
    console.log("error", error);

    res.status(500).send({ "internal server error": error });
  }
});

// Send Email
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// create report data
app.post("/report", async (req, res) => {
  try {
    const qty = parseInt(req.body.quantity);

    const createdReport = await db.tb_report.create({
      data: {
        tanggal: Math.floor(Date.now() / 1000),
        nama: req.body.nama,
        dapartemen: req.body.dapartemen,
        email: req.body.email,
        barang: req.body.barang,
        model: req.body.model,
        quantity: qty,
        satuan: req.body.satuan,
        lokasi: req.body.lokasi,
        perusahaan: req.body.perusahaan,
        keterangan: req.body.keterangan,
        status: req.body.status,
        approveby: req.body.approveby,
        atasan: {
          connect: { id: parseInt(req.body.atasanId) },
        },
      },
      include: { atasan: true },
    });

    const emailAtasan = createdReport.atasan.email;

    await transporter.sendMail({
      from: `"Sistem Permintaan" <${process.env.EMAIL}>`,
      to: emailAtasan,
      subject: "Permintaan Baru Menunggu Persetujuan",
      html: `
    <p>Halo <b>${createdReport.atasan.atasan}</b>,</p>
    <p>Ada permintaan baru dari <b>${createdReport.nama} (${createdReport.dapartemen})</b>.</p>
    <br>
    <p><b>Nama Barang:</b> ${createdReport.barang} (${qty} ${createdReport.satuan})</p>
    <p><b>Model/Ukuran:</b> ${createdReport.model}</p>
    <p><b>Departemen:</b> ${createdReport.dapartemen}</p>
    <p><b>Lokasi:</b> ${createdReport.lokasi}</p>
    <p><b>Perusahaan:</b> ${createdReport.perusahaan}</p>
    <p><b>Keterangan:</b> ${createdReport.keterangan}</p>
    <br>
    <p>
      <a href="http://localhost:3000/report/approve/${createdReport.id}?status=approve">Approve</a> &nbsp;
      <a href="http://localhost:3000/report/approve/${createdReport.id}?status=reject">Reject</a>

    </p>
  `,
    });

    res.json({ message: "Report dibuat & email dikirim", report: createdReport });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ "internal server error": error.message || error });
  }
});

// Endpoint Approve / Reject
app.get("/report/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    if (!["approve", "reject"].includes(status)) {
      return res.status(400).send("Status tidak valid");
    }

    const updatedReport = await db.tb_report.update({
      where: { id: parseInt(id) },
      data: { status: status },
    });

    res.send(`Report ID ${id} berhasil diupdate menjadi ${status}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/report", async (req, res) => {
  // Get report data
  try {
    const { page, per_page } = req.query;
    const limit = +(per_page ?? 1);
    const offset = (+(page ?? 1) - 1) * limit;
    const total = await db.tb_report.count();

    const test = await db.tb_report.findMany({
      take: limit,
      skip: offset,
      include: {
        atasan: true,
      },
    });
    res.send({ test, total: total });
  } catch (error) {
    res.status(500).send("internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
