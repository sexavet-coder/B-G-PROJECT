
let page = 0;
let size = 10;
let totalPages = 1;

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const sizeSelect = document.getElementById('size-select');
const tableBody = document.getElementById('tbody');

const token = window.getToken ? window.getToken() : (localStorage.getItem("token") || null);

// kullanıcı login değilse yönlendir
if (!token) {
  setTimeout(() => window.location.href = "login.html", 200);
} else {
  window.initNavbar && initNavbar();
}

// sayfa boyutu kaydet
const savedSize = localStorage.getItem('pageSize');
if (savedSize) {
  size = Number(savedSize);
  sizeSelect.value = savedSize;
}

// kategori isimleri
let categoryMap = {};
async function fetchCategories() {
  try {
    const res = await fetch("http://195.26.245.5:9505/api/categories");
    const data = await res.json();
    data.forEach(c => categoryMap[c.id] = c.name);
  } catch {
    console.warn("Kategori yüklenemedi.");
  }
}

// ürünleri getir
async function fetchProducts() {
  try {
    const res = await fetch(`http://195.26.245.5:9505/api/products/myProducts?page=${page}&size=${size}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    renderTable(data.content || []);
    totalPages = data.totalPages || 1;
    updatePagination();
  } catch (err) {
    console.error("Fetch products error:", err);
    alert("Ürünler yüklenemedi!");
  }
}

// tabloyu oluştur
function renderTable(products) {
  tableBody.innerHTML = "";

  if (!products.length) {
    tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">Hiç ürün bulunamadı.</td></tr>`;
    return;
  }

  products.forEach(product => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.brand}</td>
      <td>${product.model}</td>
      <td>${categoryMap[product.categoryId] || "Unknown"}</td>
      <td><img src="${product.imageUrl}" style="width:100px;height:100px;object-fit:cover;"></td>
      <td>${product.price} ₼</td>
      <td>${product.averageRating?.toFixed(1) || "-"}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-btn" data-id="${product.id}">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  attachEventListeners();
}

// edit ve delete eventlerini bağla
function attachEventListeners() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Bu ürünü silmek istediğine emin misin?")) return;

      try {
        const res = await fetch(`http://195.26.245.5:9505/api/products/delete/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Silme başarısız!");
        alert("Ürün başarıyla silindi!");
        fetchProducts();
      } catch (err) {
        alert("Silme hatası: " + err.message);
      }
    });
  });

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      window.location.href = `createproduct.html?id=${id}`;
      const productRow = btn.closest("tr");

      if (!brand || !model || !price) return alert("Boş bırakılamaz!");

      const productData = {
        id: Number(id),
        brand,
        model,
        description,
        imageUrl,
        price: parseFloat(price),
        categoryId: Number(categoryId)
      };

      try {
        const res = await fetch("http://195.26.245.5:9505/api/products", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });

        if (!res.ok) throw new Error("Güncelleme başarısız!");
        alert("Ürün başarıyla güncellendi!");
        fetchProducts();
      } catch (err) {
        alert("Güncelleme hatası: " + err.message);
      }
    });
  });
}

function updatePagination() {
  pageInfo.textContent = `${page + 1} / ${totalPages}`;
  prevBtn.disabled = page === 0;
  nextBtn.disabled = page + 1 >= totalPages;
}

prevBtn.addEventListener("click", () => { if (page > 0) { page--; fetchProducts(); } });
nextBtn.addEventListener("click", () => { if (page + 1 < totalPages) { page++; fetchProducts(); } });
sizeSelect.addEventListener("change", () => {
  size = Number(sizeSelect.value);
  localStorage.setItem("pageSize", size);
  page = 0;
  fetchProducts();
});

// init
fetchCategories().then(fetchProducts);