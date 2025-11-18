// Global variables
let currentUser = null;
let lostItems = [];
let foundItems = [];

// Sample data for demonstration
const sampleLostItems = [
    {
        id: 1,
        itemName: "iPhone 13",
        description: "Black iPhone 13 with blue case, lost near library",
        category: "electronics",
        placeLost: "University Library",
        dateLost: "2024-01-15",
        photoUrl: "https://via.placeholder.com/300x200/667eea/ffffff?text=iPhone+13",
        status: "active",
        userId: 1,
        userName: "John Doe"
    },
    {
        id: 2,
        itemName: "Student ID Card",
        description: "University student ID card with photo",
        category: "id-cards",
        placeLost: "Cafeteria",
        dateLost: "2024-01-14",
        photoUrl: "https://via.placeholder.com/300x200/28a745/ffffff?text=ID+Card",
        status: "active",
        userId: 2,
        userName: "Jane Smith"
    },
    {
        id: 3,
        itemName: "Textbook: Computer Science",
        description: "Introduction to Computer Science textbook, 3rd edition",
        category: "books",
        placeLost: "Computer Lab",
        dateLost: "2024-01-13",
        photoUrl: "https://via.placeholder.com/300x200/ffc107/ffffff?text=Textbook",
        status: "active",
        userId: 3,
        userName: "Mike Johnson"
    }
];

const sampleFoundItems = [
    {
        id: 1,
        itemName: "Silver Watch",
        description: "Silver analog watch found in parking lot",
        category: "jewelry",
        placeFound: "Parking Lot A",
        dateFound: "2024-01-15",
        photoUrl: "https://via.placeholder.com/300x200/6f42c1/ffffff?text=Watch",
        status: "active",
        userId: 4,
        userName: "Admin"
    },
    {
        id: 2,
        itemName: "Red Backpack",
        description: "Red backpack with laptop compartment",
        category: "clothing",
        placeFound: "Student Center",
        dateFound: "2024-01-14",
        photoUrl: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Backpack",
        status: "active",
        userId: 5,
        userName: "Admin"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
    renderItems();
});

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

function setupEventListeners() {
    // Navigation toggle for mobile
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const reportLostForm = document.getElementById('reportLostForm');
    const reportFoundForm = document.getElementById('reportFoundForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    if (reportLostForm) {
        reportLostForm.addEventListener('submit', handleReportLost);
    }
    if (reportFoundForm) {
        reportFoundForm.addEventListener('submit', handleReportFound);
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function loadSampleData() {
    lostItems = [...sampleLostItems];
    foundItems = [...sampleFoundItems];
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple validation (in real app, this would be server-side)
    if (email === 'admin@example.com' && password === 'admin123') {
        currentUser = {
            id: 1,
            username: 'Admin',
            email: email,
            role: 'admin'
        };
    } else if (email === 'user@example.com' && password === 'user123') {
        currentUser = {
            id: 2,
            username: 'User',
            email: email,
            role: 'user'
        };
    } else {
        showNotification('Invalid credentials. Try admin@example.com/admin123 or user@example.com/user123', 'error');
        return;
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUIForLoggedInUser();
    closeModal('loginModal');
    showNotification('Login successful!', 'success');
    
    // Clear form
    document.getElementById('loginForm').reset();
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long!', 'error');
        return;
    }

    // Create new user (in real app, this would be sent to server)
    currentUser = {
        id: Date.now(),
        username: username,
        email: email,
        role: 'user'
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUIForLoggedInUser();
    closeModal('registerModal');
    showNotification('Registration successful!', 'success');
    
    // Clear form
    document.getElementById('registerForm').reset();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLoggedOutUser();
    showNotification('Logged out successfully!', 'success');
}

function updateUIForLoggedInUser() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');

    if (authButtons && userMenu && userName) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = currentUser.username;
    }
}

function updateUIForLoggedOutUser() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');

    if (authButtons && userMenu) {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// Modal functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function showReportLostModal() {
    if (!currentUser) {
        showNotification('Please login to report a lost item', 'error');
        return;
    }
    document.getElementById('reportLostModal').style.display = 'block';
}

function showReportFoundModal() {
    if (!currentUser) {
        showNotification('Please login to report a found item', 'error');
        return;
    }
    document.getElementById('reportFoundModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Item reporting functions
function handleReportLost(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const itemData = {
        id: Date.now(),
        itemName: document.getElementById('lostItemName').value,
        description: document.getElementById('lostDescription').value,
        category: document.getElementById('lostCategory').value,
        placeLost: document.getElementById('lostPlace').value,
        dateLost: document.getElementById('lostDate').value,
        photoUrl: document.getElementById('lostPhoto').files[0] ? 
            'https://via.placeholder.com/300x200/667eea/ffffff?text=Photo' : 
            'https://via.placeholder.com/300x200/cccccc/ffffff?text=No+Photo',
        status: 'active',
        userId: currentUser.id,
        userName: currentUser.username
    };

    lostItems.unshift(itemData);
    localStorage.setItem('lostItems', JSON.stringify(lostItems));
    
    renderItems();
    closeModal('reportLostModal');
    showNotification('Lost item reported successfully!', 'success');
    
    // Clear form
    e.target.reset();
}

function handleReportFound(e) {
    e.preventDefault();
    
    const itemData = {
        id: Date.now(),
        itemName: document.getElementById('foundItemName').value,
        description: document.getElementById('foundDescription').value,
        category: document.getElementById('foundCategory').value,
        placeFound: document.getElementById('foundPlace').value,
        dateFound: document.getElementById('foundDate').value,
        photoUrl: document.getElementById('foundPhoto').files[0] ? 
            'https://via.placeholder.com/300x200/28a745/ffffff?text=Photo' : 
            'https://via.placeholder.com/300x200/cccccc/ffffff?text=No+Photo',
        status: 'active',
        userId: currentUser.id,
        userName: currentUser.username
    };

    foundItems.unshift(itemData);
    localStorage.setItem('foundItems', JSON.stringify(foundItems));
    
    renderItems();
    closeModal('reportFoundModal');
    showNotification('Found item reported successfully!', 'success');
    
    // Clear form
    e.target.reset();
}

// Rendering functions
function renderItems() {
    renderLostItems();
    renderFoundItems();
}

function renderLostItems() {
    const container = document.getElementById('lostItemsGrid');
    if (!container) return;

    if (lostItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No Lost Items</h3>
                <p>Be the first to report a lost item!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = lostItems
        .filter(item => item.status === 'active')
        .slice(0, 6)
        .map(item => createItemCard(item, 'lost'))
        .join('');
}

function renderFoundItems() {
    const container = document.getElementById('foundItemsGrid');
    if (!container) return;

    if (foundItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-hand-holding-heart"></i>
                <h3>No Found Items</h3>
                <p>Be the first to report a found item!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = foundItems
        .filter(item => item.status === 'active')
        .slice(0, 6)
        .map(item => createItemCard(item, 'found'))
        .join('');
}

function createItemCard(item, type) {
    const isOwner = currentUser && currentUser.id === item.userId;
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    return `
        <div class="item-card">
            <img src="${item.photoUrl}" alt="${item.itemName}" class="item-image" onerror="this.src='https://via.placeholder.com/300x200/cccccc/ffffff?text=Image+Not+Found'">
            <div class="item-name">${item.itemName}</div>
            <span class="item-category">${getCategoryDisplayName(item.category)}</span>
            <div class="item-description">${item.description}</div>
            <div class="item-details">
                <span><i class="fas fa-map-marker-alt"></i> ${type === 'lost' ? item.placeLost : item.placeFound}</span>
                <span><i class="fas fa-calendar"></i> ${type === 'lost' ? item.dateLost : item.dateFound}</span>
            </div>
            <div class="item-details">
                <span><i class="fas fa-user"></i> ${item.userName}</span>
                ${(isOwner || isAdmin) ? `
                    <button class="btn btn-secondary btn-sm" onclick="markAsResolved(${item.id}, '${type}')">
                        Mark as Resolved
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'electronics': 'Electronics',
        'books': 'Books',
        'id-cards': 'ID Cards',
        'jewelry': 'Jewelry',
        'clothing': 'Clothing',
        'other': 'Other'
    };
    return categoryNames[category] || category;
}

// Search functionality
function searchItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchTerm && !category) {
        resultsContainer.innerHTML = '';
        return;
    }

    const allItems = [
        ...lostItems.map(item => ({ ...item, type: 'lost' })),
        ...foundItems.map(item => ({ ...item, type: 'found' }))
    ];

    const filteredItems = allItems.filter(item => {
        const matchesSearch = !searchTerm || 
            item.itemName.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !category || item.category === category;
        
        return matchesSearch && matchesCategory && item.status === 'active';
    });

    displaySearchResults(filteredItems, resultsContainer);
}

function displaySearchResults(items, container) {
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No Items Found</h3>
                <p>Try adjusting your search criteria.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <h3>Search Results (${items.length} items)</h3>
        <div class="items-grid">
            ${items.map(item => createItemCard(item, item.type)).join('')}
        </div>
    `;
}

// Utility functions
function markAsResolved(itemId, type) {
    if (type === 'lost') {
        const item = lostItems.find(item => item.id === itemId);
        if (item) {
            item.status = 'resolved';
            localStorage.setItem('lostItems', JSON.stringify(lostItems));
        }
    } else {
        const item = foundItems.find(item => item.id === itemId);
        if (item) {
            item.status = 'resolved';
            localStorage.setItem('foundItems', JSON.stringify(foundItems));
        }
    }
    
    renderItems();
    showNotification('Item marked as resolved!', 'success');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Load items from localStorage on page load
window.addEventListener('load', function() {
    const savedLostItems = localStorage.getItem('lostItems');
    const savedFoundItems = localStorage.getItem('foundItems');
    
    if (savedLostItems) {
        lostItems = JSON.parse(savedLostItems);
    }
    if (savedFoundItems) {
        foundItems = JSON.parse(savedFoundItems);
    }
    
    renderItems();
});

// Search input event listener
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.length > 2 || this.value.length === 0) {
                searchItems();
            }
        });
    }
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', searchItems);
    }
});