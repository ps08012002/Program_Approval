let currentPage = 1;
let totalPages = 1;

async function fetchData(page) {
  try {
    const response = await fetch(`http://localhost:3000/report?page=${currentPage}&per_page=20`);
    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function displayData(data) {
  const tbody = document.getElementById("tbody");
  const report = data.test;
  totalPages = data.total / 20;
  tbody.innerHTML = "";

  console.log(report);

  if (report) {
    report.forEach((value, index) => {
      const tanggal = new Date(value.tanggal * 1000);

      const row = document.createElement("tr");

      const noTd = document.createElement("td");
      noTd.textContent = index + 1;
      const tanggalTd = document.createElement("td");
      tanggalTd.textContent = tanggal.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      const namaTd = document.createElement("td");
      namaTd.textContent = value.nama;
      const dapartemenTd = document.createElement("td");
      dapartemenTd.textContent = value.dapartemen;
      const emailTd = document.createElement("td");
      emailTd.textContent = value.email;
      const atasanTd = document.createElement("td");
      atasanTd.textContent = value.atasan?.atasan ?? "-";
      const barangTd = document.createElement("td");
      barangTd.textContent = value.barang;
      const modelTd = document.createElement("td");
      modelTd.textContent = value.model;
      const quantityTd = document.createElement("td");
      quantityTd.textContent = value.quantity;
      const satuanTd = document.createElement("td");
      satuanTd.textContent = value.satuan;
      const lokasiTd = document.createElement("td");
      lokasiTd.textContent = value.lokasi;
      const perusahaanTd = document.createElement("td");
      perusahaanTd.textContent = value.perusahaan;
      const keteranganTd = document.createElement("td");
      keteranganTd.textContent = value.keterangan;
      const statusTd = document.createElement("td");
      statusTd.textContent = value.status ? value.status : "Pending";
      const approvebyTd = document.createElement("td");
      if (!value.status || value.status === "pending" || value.status === "reject") {
        approvebyTd.textContent = "-";
      } else {
        approvebyTd.textContent = value.atasan?.atasan;
      }

      row.appendChild(noTd);
      row.appendChild(tanggalTd);
      row.appendChild(namaTd);
      row.appendChild(dapartemenTd);
      row.appendChild(emailTd);
      row.appendChild(atasanTd);
      row.appendChild(barangTd);
      row.appendChild(modelTd);
      row.appendChild(quantityTd);
      row.appendChild(satuanTd);
      row.appendChild(lokasiTd);
      row.appendChild(perusahaanTd);
      row.appendChild(keteranganTd);
      row.appendChild(statusTd);
      row.appendChild(approvebyTd);

      tbody.appendChild(row);
    });
  }
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    fetchData(currentPage);
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchData(currentPage);
  }
}

fetchData(currentPage);
