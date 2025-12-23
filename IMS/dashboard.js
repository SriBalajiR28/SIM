fetch('http://localhost/api/v1')
  .then(res => res.json())
  .then(data => {
    // Total products
    document.getElementById('product-count').textContent = data.length;

    // Low stock products based on each product's threshold
    const lowStock = data.filter(p => p.quantity < p.lowStockThreshold);
    document.getElementById('low-stock-count').textContent = lowStock.length;
  })
  .catch(() => {
    document.getElementById('product-count').textContent = 'Error';
    document.getElementById('low-stock-count').textContent = 'Error';
  });