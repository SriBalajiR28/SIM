const form = document.getElementById('product-form');
const list = document.getElementById('product-list');
const searchInput = document.getElementById('search');
let editingId = null;

const urlParams = new URLSearchParams(window.location.search);
const showLowStockOnly = urlParams.get('lowStock') === 'true';

form.addEventListener('submit', e => {
  e.preventDefault();

  const id = document.getElementById('id').value.trim();
  const name = document.getElementById('name').value.trim();
  const category = document.getElementById('category').value.trim() || "General";
  const quantity = parseInt(document.getElementById('quantity').value);
  const price = parseFloat(document.getElementById('price').value);
  const lowStockThreshold = parseInt(document.getElementById('lowStockThreshold').value);

  if (!id || !name || quantity <= 0 || price <= 0 || lowStockThreshold < 0) {
    alert("Please enter valid product details.");
    return;
  }

  const method = editingId ? 'PUT' : 'POST';
  const url = editingId
    ? `http://localhost/api/v1/${editingId}`
    : 'http://localhost/api/v1';

  const payload = { id, name, category, quantity, price, lowStockThreshold };

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to save product");
      return res.json();
    })
    .then(() => {
      alert("Product saved successfully!");
      editingId = null;
      form.reset();
      document.getElementById('id').disabled = false;
      loadProducts();
    })
    .catch(err => alert(err.message));
});

function loadProducts() {
  list.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

  fetch('http://localhost/api/v1')
    .then(res => res.json())
    .then(data => {
      list.innerHTML = '';
      const filtered = showLowStockOnly
        ? data.filter(p => p.quantity < p.lowStockThreshold)
        : data;

      if (filtered.length === 0) {
        list.innerHTML = '<tr><td colspan="6">No products found</td></tr>';
        return;
      }

      filtered.forEach(p => {
        const row = document.createElement("tr");
        if (p.quantity < p.lowStockThreshold) {
          row.style.backgroundColor = "#ffe6e6";
          // row.style.backgroundColor = "red";
          row.classList.add("low-stock");
        }
        row.innerHTML = `
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${p.quantity}</td>
          <td>${p.price}</td>
          <td>
            <button onclick="editProduct('${p.id}', '${p.name}', '${p.category}', ${p.quantity}, ${p.price}, ${p.lowStockThreshold})">Edit</button>
            <button onclick="deleteProduct('${p.id}')">Delete</button>
          </td>
        `;
        list.appendChild(row);
      });

      updateSummary(filtered);
    })
    .catch(() => {
      list.innerHTML = '<tr><td colspan="6">Failed to load products</td></tr>';
    });
}

function editProduct(id, name, category, quantity, price, lowStockThreshold) {
  document.getElementById('id').value = id;
  document.getElementById('name').value = name;
  document.getElementById('category').value = category;
  document.getElementById('quantity').value = quantity;
  document.getElementById('price').value = price;
  document.getElementById('lowStockThreshold').value = lowStockThreshold;
  document.getElementById('id').disabled = true;
  editingId = id;
}

function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  fetch(`http://localhost/api/v1/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error("Failed to delete product");
      alert("Product deleted successfully!");
      loadProducts();
    })
    .catch(err => alert(err.message));
}

function updateSummary(data) {
  const summary = document.getElementById("stock-summary");
  const lowStock = data.filter(p => p.quantity < p.lowStockThreshold).length;
  summary.innerHTML = `<strong>Total Products:</strong> ${data.length} | <strong>Low Stock:</strong> ${lowStock}`;
}

// 🔍 Search by ID or Name
searchInput.addEventListener('input', e => {
  const keyword = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#product-list tr');
  rows.forEach(row => {
    const id = row.children[0].textContent.toLowerCase();
    const name = row.children[1].textContent.toLowerCase();
    row.style.display = id.includes(keyword) || name.includes(keyword) ? '' : 'none';
  });
});

loadProducts();