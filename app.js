// ==========================
// GET USERS FROM STORAGE
// ==========================
let users = JSON.parse(localStorage.getItem("users")) || [];

// ==========================
// REGISTER
// ==========================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(e){
        e.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if(password !== confirmPassword){
            alert("Passwords do not match!");
            return;
        }

        if(users.find(user => user.email === email)){
            alert("Email already registered!");
            return;
        }

        const newUser = {
            id: Date.now(),
            fullname,
            email,
            password
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful!");
        window.location.href = "login.html";
    });
}

// ==========================
// LOGIN
// ==========================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const validUser = users.find(
            user => user.email === email && user.password === password
        );

        if(!validUser){
            alert("Invalid email or password!");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(validUser));

        alert("Login successful!");
        window.location.href = "dashboard.html";
    });
}

// ==========================
// DASHBOARD PROTECTION
// ==========================
if(window.location.pathname.includes("dashboard.html")){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if(!currentUser){
        window.location.href = "login.html";
    }
}

// ==========================
// DASHBOARD FUNCTIONS
// ==========================
if(window.location.pathname.includes("dashboard.html")){
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    // Sample Data
    let products = JSON.parse(localStorage.getItem("products")) || [
        { id: 1, name: 'iPhone 13', category: 'Electronics', price: 999, stock: 45 },
        { id: 2, name: 'MacBook Pro', category: 'Electronics', price: 1299, stock: 12 },
        { id: 3, name: 'Office Desk', category: 'Furniture', price: 350, stock: 5 },
        { id: 4, name: 'A4 Paper Box', category: 'Stationery', price: 25, stock: 0 },
        { id: 5, name: 'Wireless Mouse', category: 'Electronics', price: 45, stock: 28 }
    ];

    let stockMovements = [
        { date: 'Mon', in: 45, out: 23 },
        { date: 'Tue', in: 38, out: 31 },
        { date: 'Wed', in: 52, out: 28 },
        { date: 'Thu', in: 41, out: 35 },
        { date: 'Fri', in: 63, out: 42 },
        { date: 'Sat', in: 22, out: 18 }
    ];

    // Save products to localStorage
    localStorage.setItem("products", JSON.stringify(products));

    // DOM Elements
    document.addEventListener('DOMContentLoaded', function() {
        // Display user info
        if (currentUser) {
            document.getElementById('currentUserName').textContent = currentUser.fullname || 'User';
            document.getElementById('currentUserEmail').textContent = currentUser.email || '';
            document.getElementById('welcomeUserName').textContent = currentUser.fullname || 'User';
            
            const initials = (currentUser.fullname || 'User').split(' ').map(n => n[0]).join('').toUpperCase();
            document.getElementById('userAvatar').textContent = initials.substring(0, 2);
        }

        // Set current date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', options);

        // Set greeting
        const hour = new Date().getHours();
        let greeting = 'Good day';
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 18) greeting = 'Good afternoon';
        else greeting = 'Good evening';
        document.getElementById('welcomeGreeting').innerHTML = `${greeting}, <span id="welcomeUserName">${currentUser?.fullname || 'User'}</span>!`;

        // Load data
        loadDashboardData();
        setupEventListeners();
    });

    function loadDashboardData() {
        updateStats();
        loadProductsTable();
        loadAlertItems();
        initializeCharts();
        updateDropdowns();
    }

    function updateStats() {
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('lowStock').textContent = products.filter(p => p.stock > 0 && p.stock < 10).length;
        document.getElementById('totalCategories').textContent = [...new Set(products.map(p => p.category))].length;
        document.getElementById('outOfStock').textContent = products.filter(p => p.stock === 0).length;
        document.getElementById('alertCount').textContent = products.filter(p => p.stock < 10).length + ' Items';
        document.getElementById('productsCount').textContent = products.length;
    }

    function loadProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        products.slice(0, 5).forEach(product => {
            const status = product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : 'in-stock';
            const statusText = product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock';
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td><span class="status-badge ${status}">${statusText}</span></td>
                <td>
                    <button class="action-btn" onclick="viewProduct(${product.id})"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn danger" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
        });
    }

    function loadAlertItems() {
        const alertContainer = document.getElementById('alertItems');
        if (!alertContainer) return;
        
        const lowStockItems = products.filter(p => p.stock < 10 && p.stock > 0);
        
        if (lowStockItems.length === 0) {
            alertContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #27ae60;">✓ All products have sufficient stock</div>';
            return;
        }
        
        alertContainer.innerHTML = lowStockItems.map(item => `
            <div class="alert-item">
                <div class="alert-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.category}</p>
                </div>
                <div class="stock">${item.stock} left</div>
            </div>
        `).join('');
    }

    function updateDropdowns() {
        const stockInSelect = document.getElementById('stockInProduct');
        const stockOutSelect = document.getElementById('stockOutProduct');
        
        const options = products.map(p => `<option value="${p.id}">${p.name} (Stock: ${p.stock})</option>`).join('');
        
        if (stockInSelect) stockInSelect.innerHTML = '<option value="">Select Product</option>' + options;
        if (stockOutSelect) stockOutSelect.innerHTML = '<option value="">Select Product</option>' + options;
    }

    let stockChart, categoryChart;

    function initializeCharts() {
        if (stockChart) stockChart.destroy();
        if (categoryChart) categoryChart.destroy();

        // Stock Movement Chart
        const ctx1 = document.getElementById('stockChart').getContext('2d');
        stockChart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: stockMovements.map(m => m.date),
                datasets: [
                    {
                        label: 'Stock In',
                        data: stockMovements.map(m => m.in),
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Stock Out',
                        data: stockMovements.map(m => m.out),
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });

        // Category Chart
        const ctx2 = document.getElementById('categoryChart').getContext('2d');
        const categories = [...new Set(products.map(p => p.category))];
        const categoryCounts = categories.map(cat => products.filter(p => p.category === cat).length);
        
        categoryChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: categoryCounts,
                    backgroundColor: ['#3498db', '#f39c12', '#2ecc71', '#9b59b6', '#e74c3c'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    // Modal Functions
    window.openModal = function(modalId) {
        document.getElementById(modalId).classList.add('active');
        if (modalId === 'stockInModal' || modalId === 'stockOutModal') {
            updateDropdowns();
        }
    }

    window.closeModal = function(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // Product Functions
    window.addProduct = function() {
        const name = document.getElementById('productName').value;
        const category = document.getElementById('productCategory').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);
        
        if (!name || !category || !price || isNaN(stock)) {
            alert('Please fill all fields');
            return;
        }
        
        const newProduct = {
            id: products.length + 1,
            name: name,
            category: category,
            price: price,
            stock: stock
        };
        
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        
        loadDashboardData();
        closeModal('addProductModal');
        
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productStock').value = '';
        
        alert('Product added successfully!');
    }

    window.viewProduct = function(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;
        
        document.getElementById('productDetails').innerHTML = `
            <p><strong>Name:</strong> ${product.name}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Status:</strong> ${product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock'}</p>
        `;
        
        openModal('viewProductModal');
    }

    window.editProduct = function(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;
        
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductStock').value = product.stock;
        
        openModal('editProductModal');
    }

    window.updateProduct = function() {
        const id = parseInt(document.getElementById('editProductId').value);
        const name = document.getElementById('editProductName').value;
        const category = document.getElementById('editProductCategory').value;
        const price = parseFloat(document.getElementById('editProductPrice').value);
        const stock = parseInt(document.getElementById('editProductStock').value);
        
        const product = products.find(p => p.id === id);
        if (product) {
            product.name = name;
            product.category = category;
            product.price = price;
            product.stock = stock;
            
            localStorage.setItem("products", JSON.stringify(products));
            loadDashboardData();
            closeModal('editProductModal');
            alert('Product updated successfully!');
        }
    }

    window.deleteProduct = function(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            localStorage.setItem("products", JSON.stringify(products));
            loadDashboardData();
            alert('Product deleted successfully!');
        }
    }

    // Stock Functions
    window.stockIn = function() {
        const productId = parseInt(document.getElementById('stockInProduct').value);
        const quantity = parseInt(document.getElementById('stockInQuantity').value);
        
        if (!productId || !quantity || quantity <= 0) {
            alert('Please select product and enter valid quantity');
            return;
        }
        
        const product = products.find(p => p.id === productId);
        if (product) {
            product.stock += quantity;
            localStorage.setItem("products", JSON.stringify(products));
            
            stockMovements.push({
                date: new Date().toLocaleString('en-us', { weekday: 'short' }),
                in: quantity,
                out: 0
            });
            
            loadDashboardData();
            closeModal('stockInModal');
            document.getElementById('stockInQuantity').value = '';
            alert(`Added ${quantity} units to ${product.name}`);
        }
    }

    window.stockOut = function() {
        const productId = parseInt(document.getElementById('stockOutProduct').value);
        const quantity = parseInt(document.getElementById('stockOutQuantity').value);
        
        if (!productId || !quantity || quantity <= 0) {
            alert('Please select product and enter valid quantity');
            return;
        }
        
        const product = products.find(p => p.id === productId);
        if (product) {
            if (product.stock >= quantity) {
                product.stock -= quantity;
                localStorage.setItem("products", JSON.stringify(products));
                
                stockMovements.push({
                    date: new Date().toLocaleString('en-us', { weekday: 'short' }),
                    in: 0,
                    out: quantity
                });
                
                loadDashboardData();
                closeModal('stockOutModal');
                document.getElementById('stockOutQuantity').value = '';
                alert(`Removed ${quantity} units from ${product.name}`);
            } else {
                alert(`Insufficient stock! Available: ${product.stock}`);
            }
        }
    }

    // Search Function
    document.getElementById('searchInput')?.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length < 2) {
            loadProductsTable();
            return;
        }
        
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.category.toLowerCase().includes(searchTerm)
        );
        
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No products found</td></tr>';
            return;
        }
        
        filtered.slice(0, 5).forEach(product => {
            const status = product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : 'in-stock';
            const statusText = product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock';
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td><span class="status-badge ${status}">${statusText}</span></td>
                <td>
                    <button class="action-btn" onclick="viewProduct(${product.id})"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn danger" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
        });
    });

    // Navigation
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            const page = this.dataset.page;
            document.querySelector('.page-title h2').textContent = page.charAt(0).toUpperCase() + page.slice(1);
            
            if (page === 'products') {
                showAllProducts();
            }
        });
    });

    window.showAllProducts = function() {
        alert('Viewing all products - Total: ' + products.length + ' products');
    }

    window.generateReport = function() {
        alert('Generating inventory report...\nTotal Products: ' + products.length + '\nLow Stock Items: ' + products.filter(p => p.stock < 10).length);
    }

    // Chart period change
    document.querySelectorAll('[data-period]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.period === 'month' && stockChart) {
                stockChart.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                stockChart.data.datasets[0].data = [180, 220, 195, 240];
                stockChart.data.datasets[1].data = [145, 168, 152, 189];
            } else if (stockChart) {
                stockChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                stockChart.data.datasets[0].data = [45, 38, 52, 41, 63, 22];
                stockChart.data.datasets[1].data = [23, 31, 28, 35, 42, 18];
            }
            stockChart.update();
        });
    });

    function setupEventListeners() {
        // Close modals when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }
}

// ==========================
// LOGOUT
// ==========================
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    }
}