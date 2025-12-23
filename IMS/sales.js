const form = document.getElementById("salesForm");
const responseBox = document.getElementById("responseBox");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const productId = document.getElementById("productId").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);

    if (!productId || isNaN(quantity) || quantity <= 0) {
        responseBox.style.display = "block";
        responseBox.style.color = "red";
        responseBox.textContent = "Please enter a valid Product ID and Quantity.";
        return;
    }

    try {
        const res = await fetch(`http://localhost:80/api/transactions/sale?productId=${productId}&quantity=${quantity}`, {
            method: "POST"
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            responseBox.style.display = "block";
            responseBox.style.color = "red";
            responseBox.textContent = errorMsg;
        } else {
            responseBox.style.display = "block";
            responseBox.style.color = "green";
            responseBox.textContent = "✅ Sale has been successfully.";
        }

    } catch (error) {
        responseBox.style.display = "block";
        responseBox.style.color = "red";
        responseBox.textContent = "Error connecting to server.";
    }
});