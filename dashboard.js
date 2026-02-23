// Sample products
let products = [
    {id:"PRD-001", name:"Wireless Keyboard", category:"Electronics", qty:45, price:49.99},
    {id:"PRD-002", name:"USB-C Adapter", category:"Accessories", qty:0, price:29.99},
    {id:"PRD-003", name:"Laptop Stand", category:"Office", qty:23, price:39.99},
    {id:"PRD-004", name:"Bluetooth Mouse", category:"Electronics", qty:10, price:25.00},
    {id:"PRD-005", name:"Monitor 24 inch", category:"Electronics", qty:0, price:199.99}
];

const table = document.getElementById("productTable");
const searchInput = document.getElementById("searchInput");

function renderProducts(filtered = products) {
    table.innerHTML = "";

    filtered.forEach(product => {
        let status = product.qty > 0 
            ? `<span class="status-in">In Stock</span>` 
            : `<span class="status-out">Out of Stock</span>`;

        table.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.qty}</td>
                <td>$${product.price}</td>
                <td>${status}</td>
            </tr>
        `;
    });

    updateCards();
}

function updateCards() {
    document.getElementById("totalProducts").innerText = products.length;
    document.getElementById("inStock").innerText =
        products.filter(p => p.qty > 0).length;
    document.getElementById("outStock").innerText =
        products.filter(p => p.qty === 0).length;
}

// Search
searchInput.addEventListener("keyup", function() {
    let value = this.value.toLowerCase();

    let filtered = products.filter(product =>
        product.name.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value) ||
        product.id.toLowerCase().includes(value)
    );

    renderProducts(filtered);
});

function logout(){
    alert("Logged out!");
    window.location.href = "login.html";
}

renderProducts();