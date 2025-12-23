document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const quantity = parseInt(document.getElementById("quantity").value);
  const threshold = parseInt(document.getElementById("lowStockThreshold").value);

  const product = {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    price: parseFloat(document.getElementById("price").value),
    quantity: quantity,
    lowStockThreshold: threshold
    // ❗ Do NOT send lowStock — your backend computes it
  };

  fetch("http://localhost:80/api/v1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  })
    .then(response => {
      if (!response.ok) throw new Error("Network error");
      return response.json();
    })
    .then(data => {
      const isLow = data.lowStock === true;
      document.getElementById("responseMsg").textContent = isLow
        ? "Product added with LOW STOCK warning!"
        : "Product added successfully!";
      document.getElementById("responseMsg").style.color = isLow ? "orange" : "green";
      document.getElementById("productForm").reset();
    })
    .catch(error => {
      document.getElementById("responseMsg").textContent = "Error adding product.";
      document.getElementById("responseMsg").style.color = "red";
      console.error("Error:", error);
    });
});