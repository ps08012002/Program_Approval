const nama = document.getElementById("nama");
const email = document.getElementById("email");
const dapartemen = document.getElementById("dapartemen");
const atasan = document.getElementById("atasan");
const lokasi = document.getElementById("lokasi");
const perusahaan = document.getElementById("perusahaan");
const barang = document.getElementById("barang");
const model = document.getElementById("model");
const quantity = document.getElementById("quantity");
const satuan = document.getElementById("satuan");
const keterangan = document.getElementById("keterangan");
let latestReportData = null;

const date = new Date();

const formatDate = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
}).format(date);

const timefrotmat = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "numeric",
  timeZone: "Asia/Jakarta",
}).format(date);

console.log(formatDate);

nama.addEventListener("change", () => {
  console.log(this.event.target.value);

  nama.value = this.event.target.value;
});

email.addEventListener("change", () => {
  console.log(this.event.target.value);

  email.value = this.event.target.value;
});

dapartemen.addEventListener("change", () => {
  console.log(this.event.target.value);

  dapartemen.value = this.event.target.value;
});

lokasi.addEventListener("change", () => {
  console.log(this.event.target.value);

  lokasi.value = this.event.target.value;
});

barang.addEventListener("change", () => {
  console.log(this.event.target.value);

  barang.value = this.event.target.value;
});

model.addEventListener("change", () => {
  console.log(this.event.target.value);

  model.value = this.event.target.value;
});

quantity.addEventListener("change", () => {
  console.log(this.event.target.value);

  quantity.value = this.event.target.value;
});

keterangan.addEventListener("change", () => {
  console.log(this.event.target.value);

  keterangan.value = this.event.target.value;
});

//Load atasan
async function loadAtasan() {
  try {
    const res = await fetch("http://localhost:3000/atasan");
    const json = await res.json();
    const hasil = json.data;

    hasil.forEach((kode) => {
      const option = document.createElement("option");
      option.value = kode.id;
      option.textContent = kode.atasan;
      atasan.appendChild(option);
    });
  } catch (err) {
    console.error("Gagal mengambil kode tinta:", err);
  }
}

//Load perusahaan
async function loadPerusahaan() {
  try {
    const res = await fetch("http://localhost:3000/perusahaan");
    const json = await res.json();
    const hasil = json.data;

    hasil.forEach((kode) => {
      const option = document.createElement("option");
      option.value = kode.perusahaan;
      option.textContent = kode.perusahaan;
      perusahaan.appendChild(option);
    });
  } catch (err) {
    console.error("Gagal mengambil kode tinta:", err);
  }
}
// Submit
async function onSubmit() {
  const overlay = document.getElementById("overlayLoader");
  overlay.style.display = "flex"; // tampilkan loading

  try {
    if (
      !nama.value.trim() ||
      !email.value.trim() ||
      !dapartemen.value.trim() ||
      !atasan.value.trim() ||
      !lokasi.value.trim() ||
      !perusahaan.value.trim() ||
      !barang.value.trim() ||
      !model.value.trim() ||
      !quantity.value.trim() ||
      !satuan.value.trim() ||
      !keterangan.value.trim()
    ) {
      alert("Data belum terisi semua!");
      return;
    }

    const raw = JSON.stringify({
      nama: nama.value,
      email: email.value,
      dapartemen: dapartemen.value,
      atasanId: parseInt(atasan.value),
      lokasi: lokasi.value,
      perusahaan: perusahaan.options[perusahaan.selectedIndex].text,
      barang: barang.value,
      model: model.value,
      quantity: parseInt(quantity.value),
      satuan: satuan.value,
      keterangan: keterangan.value,
      status: "pending",
      approveby: "system",
    });

    console.log("Payload:", raw);

    const response = await fetch("http://localhost:3000/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error("Gagal insert data!");
    }

    const data = await response.json();
    latestReportData = data;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert("Permintaan Akan Di Proses !!!");
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
    alert("Terjadi kesalahan: " + error.message);
  } finally {
    overlay.style.display = "none";
  }
}

// Jalankan saat halaman dimuat
window.onload = () => {
  document.getElementById("dateUser").textContent = formatDate;
  document.getElementById("timeUser").textContent = timefrotmat;
  loadAtasan();
  loadPerusahaan();
};
