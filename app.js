// ================= REGISTER =================


// ================= LOGIN =================


// ================= DASHBOARD =================
if (window.location.pathname.includes("dashboard.html")) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        window.location.href = "login.html";
    } else {
        document.getElementById("userName").innerText = currentUser.fullname;
        displayProducts();
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// ================= PRODUCTS =================
function addProduct() {
    const name = document.getElementById("productName").value;
    const qty = document.getElementById("productQty").value;

    if (!name || !qty) {
        alert("Fill all fields");
        return;
    }

    let products = JSON.parse(localStorage.getItem("products")) || [];

    products.push({ name, qty });
    localStorage.setItem("products", JSON.stringify(products));

    displayProducts();
}

function displayProducts() {
    const table = document.getElementById("productTable");
    if (!table) return;

    table.innerHTML = "";

    let products = JSON.parse(localStorage.getItem("products")) || [];

    products.forEach((product, index) => {
        table.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>${product.qty}</td>
                <td>
                    <button onclick="deleteProduct(${index})" style="background:red;">Delete</button>
                </td>
            </tr>
        `;
    });
}

function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}
// Default 30 electronic products
let defaultProducts = [];

for(let i=1;i<=30;i++){
    defaultProducts.push({
        id:i,
        name:"Electronic Product "+i,
        category:"Electronics",
        price: (100 + i) + "$",
        stock: i % 2 === 0 ? 10 : 0,
        image:"https://via.placeholder.com/200x150"
    });
}

if(!localStorage.getItem("products")){
    localStorage.setItem("products", JSON.stringify(defaultProducts));
}

let products = JSON.parse(localStorage.getItem("products"));

// DASHBOARD COUNT
if(document.getElementById("totalProducts")){
    document.getElementById("totalProducts").innerText = products.length;
    document.getElementById("inStock").innerText = products.filter(p=>p.stock>0).length;
    document.getElementById("outStock").innerText = products.filter(p=>p.stock==0).length;
}

// DISPLAY PRODUCTS
function displayProducts(list=products){
    const grid = document.getElementById("productGrid");
    if(!grid) return;

    grid.innerHTML="";

    list.forEach(product=>{
        grid.innerHTML+=`
            <div class="product-card">
                <img src="${product.image}">
                <h4>${product.name}</h4>
                <p>${product.price}</p>
                <p>${product.stock>0?"In Stock":"Out of Stock"}</p>
            </div>
        `;
    });
}

displayProducts();

// SEARCH
function searchProduct(){
    let value = document.getElementById("searchInput").value.toLowerCase();
    let filtered = products.filter(p=>p.name.toLowerCase().includes(value));
    displayProducts(filtered);
}

// ADD PRODUCT
function addProduct(){
    let name = prompt("Enter product name:");
    let price = prompt("Enter price:");
    let stock = prompt("Enter stock:");

    if(name && price && stock){
        let newProduct = {
            id:products.length+1,
            name:name,
            category:"Electronics",
            price:price+"$",
            stock:Number(stock),
            image:"https://via.placeholder.com/200x150"
        };

        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
        alert("Product Added Successfully!");
    }
}

// LOGOUT
function logout(){
    alert("Logged out!");
    window.location.href="login.html";
}
// Default 50 electronic products (30 + 20 added)
let defaultProducts = [];

for(let i=1;i<=50;i++){   // changed from 30 to 50
    defaultProducts.push({
        id:i,
        name:"Electronic Product "+i,
        category:"Electronics",
        price: (100 + i) + "$",
        stock: i % 2 === 0 ? 10 : 0,
        image:"https://via.placeholder.com/200x150"
    });
}

// Reset only if no products exist
if(!localStorage.getItem("products")){
    localStorage.setItem("products", JSON.stringify(defaultProducts));
}

let products = JSON.parse(localStorage.getItem("products"));

// DASHBOARD COUNT
if(document.getElementById("totalProducts")){
    document.getElementById("totalProducts").innerText = products.length;
    document.getElementById("inStock").innerText = products.filter(p=>p.stock>0).length;
    document.getElementById("outStock").innerText = products.filter(p=>p.stock==0).length;
}

// DISPLAY PRODUCTS
function displayProducts(list=products){
    const grid = document.getElementById("productGrid");
    if(!grid) return;

    grid.innerHTML="";

    list.forEach(product=>{
        grid.innerHTML+=`
            <div class="product-card">
                <img src="${product.image}">
                <h4>${product.name}</h4>
                <p>${product.price}</p>
                <p>${product.stock>0?"In Stock":"Out of Stock"}</p>
            </div>
        `;
    });
}

displayProducts();

// SEARCH
function searchProduct(){
    let value = document.getElementById("searchInput").value.toLowerCase();
    let filtered = products.filter(p=>p.name.toLowerCase().includes(value));
    displayProducts(filtered);
}

// ADD PRODUCT
function addProduct(){
    let name = prompt("Enter product name:");
    let price = prompt("Enter price:");
    let stock = prompt("Enter stock:");

    if(name && price && stock){
        let newProduct = {
            id:products.length+1,
            name:name,
            category:"Electronics",
            price:price+"$",
            stock:Number(stock),
            image:"https://via.placeholder.com/200x150"
        };

        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
        alert("Product Added Successfully!");
    }
}

// LOGOUT
function logout(){
    alert("Logged out!");
    window.location.href="login.html";
}