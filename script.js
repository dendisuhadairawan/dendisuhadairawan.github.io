document.addEventListener("DOMContentLoaded", (event) => {
  showSplashScreen();
  setTimeout(() => {
    hideSplashScreen();
  }, 2000);
});
function showSplashScreen() {
  const splashScreen = document.getElementById("splash-screen");
  splashScreen.style.display = "flex";
}
function hideSplashScreen() {
  const splashScreen = document.getElementById("splash-screen");
  splashScreen.style.display = "none";
}
let orders = [];
function addOrder() {
  const selectedType = document.getElementById("type").value;
  const selectedHari = document.getElementById("hari").value;
  if (!selectedHari || selectedHari <= 0) {
    alert("Mohon masukkan jumlah hari yang valid.");
    return;
  }
  let hargaPerHari;
  let diskon = 0;

  switch (selectedType) {
    case "Avanza":
      hargaPerHari = 350000;
      if (selectedHari > 3) {
        diskon = 1;
      }
      break;
    case "Jazz":
      hargaPerHari = 450000;
      if (selectedHari > 4) {
        diskon = 2;
      }
      break;
    case "Ayla":
      hargaPerHari = 250000;
      if (selectedHari > 2) {
        diskon = 1;
      }
      break;
    default:
      hargaPerHari = 0;
  }
  if (hargaPerHari === 0) {
    alert("Jenis mobil tidak valid.");
    return;
  }
  const totalHarga = selectedHari * hargaPerHari - diskon * hargaPerHari;
  const order = {
    type: selectedType,
    hari: selectedHari,
    totalHarga: totalHarga,
  };
  orders.push(order);
  showOrders();
  document.getElementById("type").value = "Avanza";
  document.getElementById("hari").value = "";
  function showOrders() {
    const ordersTable = document.getElementById("orders-table");
    ordersTable.innerHTML = "";
    ordersTable.innerHTML += `
        <tr>
            <th>No</th>
            <th>Jenis Mobil</th>
            <th>Hari</th>
            <th>Total Harga</th>
            <th>Aksi</th>
        </tr>
    `;
    orders.forEach((order, index) => {
      const orderRow = `
            <tr>
                <td>${index + 1}</td>
                <td>${order.type}</td>
                <td>${order.hari}</td>
                <td>${order.totalHarga}</td>
                <td>
                    <button onclick="editOrder(${index})">Edit</button>
                    <button onclick="removeOrder(${index})">Hapus</button>
                </td>
            </tr>
        `;
      ordersTable.innerHTML += orderRow;
    });
    const totalPembayaran = orders.reduce(
      (total, order) => total + order.totalHarga,
      0
    );
    const totalRow = `
        <tr>
            <td colspan="3" align="right"><strong>Total Pembayaran:</strong></td>
            <td>${totalPembayaran}</td>
            <td></td>
        </tr>
    `;
    ordersTable.innerHTML += totalRow;
    document.getElementById("total-amount").innerText = totalPembayaran;
    function editOrder(index) {
      const selectedOrder = orders[index];
      document.getElementById("type").value = selectedOrder.type;
      document.getElementById("hari").value = selectedOrder.hari;
      orders.splice(index, 1);
      showOrders();
    }
    function removeOrder(index) {
      orders.splice(index, 1);
      showOrders();
    }
    function calculatePayment() {
      const paymentMethod = document.getElementById("payment-method").value;
      const totalPembayaran = orders.reduce(
        (total, order) => total + order.totalHarga,
        0
      );
      const paymentAmount = parseFloat(
        document.getElementById("payment-amount").value
      );
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        alert("Mohon masukkan jumlah pembayaran yang valid.");
        return;
      }
      const paymentResult = document.getElementById("payment-result");
      paymentResult.innerHTML = `<strong>Detail Pembayaran (${paymentMethod}):</strong><br>`;
      paymentResult.innerHTML += `Total Pembayaran: ${totalPembayaran}<br>`;
      paymentResult.innerHTML += `Jumlah Pembayaran: ${paymentAmount}<br>`;
      paymentResult.innerHTML += `Kembalian: ${
        paymentAmount - totalPembayaran
      }<br>`;
      if (paymentMethod === "credit") {
        paymentResult.innerHTML += "Cicilan 3 bulan tanpa bunga.";
      }
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("service-worker.js", { scope: "/" })
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    function printReceipt() {
      document.querySelector("body").classList.add("printing");
      document.getElementById("splash-screen").style.display = "none";
      window.print();
      document.querySelector("body").classList.remove("printing");
      document.getElementById("splash-screen").style.display = "flex";
    }
  }
}
