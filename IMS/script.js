const form = document.getElementById('product-form');
const list = document.getElementById('product-list');
let editingId = null;

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const quantity = parseInt(document.getElementById('quantity').value);
  const price = parseFloat(document.getElementById('price').value);

  if (!name || quantity <= 0 || price <= 0) {
    alert("Please enter valid product details.");
    return;
  }

  const method = editingId ? 'PUT' : 'POST';
  const url = editingId ? `/api/products/${editingId}` : '/api/products';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, quantity, price })
  })
  .then(res => res.json())
  .then(() => {
    editingId = null;
    form.reset();
    loadProducts();
  });
});

function loadProducts() {
  fetch('/api/products')
    .then(res => res.json())
    .then(data => {
      list.innerHTML = '';
      data.forEach(p => {
        list.innerHTML += `
          <tr>
            <td>${p.name}</td>
            <td>${p.quantity}</td>
            <td>${p.price}</td>
            <td>
              <button onclick="editProduct(${p.id}, '${p.name}', ${p.quantity}, ${p.price})">Edit</button>
              <button onclick="deleteProduct(${p.id})">Delete</button>
            </td>
          </tr>`;
      });
    });
}

function editProduct(id, name, quantity, price) {
  document.getElementById('name').value = name;
  document.getElementById('quantity').value = quantity;
  document.getElementById('price').value = price;
  editingId = id;
}

function deleteProduct(id) {
  fetch(`/api/products/${id}`, { method: 'DELETE' })
    .then(() => loadProducts());
}

loadProducts();

// add product 