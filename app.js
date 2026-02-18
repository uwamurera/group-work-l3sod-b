// ================= REGISTER =================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const fullname = document.getElementById("fullname").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const exists = users.find(user => user.email === email);
        if (exists) {
            alert("User already exists");
            return;
        }

        users.push({ fullname, email, password });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful");
        window.location.href = "login.html";
    });
}

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const validUser = users.find(user => user.email === email && user.password === password);

        if (!validUser) {
            alert("Invalid email or password");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(validUser));
        window.location.href = "dashboard.html";
    });
}

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
