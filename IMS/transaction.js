const API_BASE = "http://localhost:80/api/transactions";
const transactionList = document.getElementById("transactionList");
const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");

let allTransactions = [];

// Fetch transactions based on type
async function fetchTransactions(type = "ALL") {
    let url = API_BASE;
    if (type !== "ALL") {
        url += `?type=${type}`;
    }

    try {
        const res = await fetch(url);
        let data = await res.json();

        // ✅ Show latest transactions first
        data = data.reverse();

        allTransactions = data;
        displayTransactions(data);
    } catch (error) {
        transactionList.innerHTML = "<p style='color:red;'>Failed to load transactions. Check backend or CORS settings.</p>";
    }
}

// Render transactions to the DOM
function displayTransactions(transactions) {
    transactionList.innerHTML = "";
    if (transactions.length === 0) {
        transactionList.innerHTML = "<p>No transactions found.</p>";
        return;
    }

    transactions.forEach(tx => {
        const item = document.createElement("div");
        item.className = "transaction-item";
        item.innerHTML = `
      <strong>${tx.type}</strong><br/>
      Product ID: ${tx.productId}<br/>
      Quantity: ${tx.quantity}<br/>
      Total: ₹${tx.totalAmount}<br/>
      Date: ${tx.date}
    `;
        transactionList.appendChild(item);
    });
}

// Filter by type
typeFilter.addEventListener("change", () => {
    fetchTransactions(typeFilter.value);
});

// Search by product ID or date
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allTransactions.filter(tx =>
        tx.productId.toLowerCase().includes(query) ||
        tx.date.includes(query)
    );
    displayTransactions(filtered);
});

// Initial load
fetchTransactions();