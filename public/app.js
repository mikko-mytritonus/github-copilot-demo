// Global variables
let cars = [];
let editingCarId = null;

// DOM elements
const inventoryGrid = document.getElementById('inventoryGrid');
const carModal = document.getElementById('carModal');
const carForm = document.getElementById('carForm');
const addCarBtn = document.getElementById('addCarBtn');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Event listeners
document.addEventListener('DOMContentLoaded', loadCars);
addCarBtn.addEventListener('click', openAddModal);
closeModal.addEventListener('click', closeCarModal);
cancelBtn.addEventListener('click', closeCarModal);
carForm.addEventListener('submit', handleFormSubmit);
searchInput.addEventListener('input', filterCars);
categoryFilter.addEventListener('change', filterCars);

window.addEventListener('click', (e) => {
    if (e.target === carModal) {
        closeCarModal();
    }
});

// Load all cars from API
async function loadCars() {
    try {
        const response = await fetch('/api/products');
        cars = await response.json();
        displayCars(cars);
    } catch (error) {
        console.error('Error loading cars:', error);
        showError('Failed to load cars');
    }
}

// Display cars in the grid
function displayCars(carsToDisplay) {
    if (carsToDisplay.length === 0) {
        inventoryGrid.innerHTML = `
            <div class="empty-state">
                <h3>No cars found</h3>
                <p>Add a new car to get started</p>
            </div>
        `;
        return;
    }

    inventoryGrid.innerHTML = carsToDisplay.map(car => `
        <div class="car-card" data-id="${car.id}">
            <div class="car-header">
                <h3 class="car-name">${escapeHtml(car.name)}</h3>
                <span class="car-category">${escapeHtml(car.category)}</span>
            </div>
            
            <div class="car-details">
                ${car.year ? `
                    <div class="detail-row">
                        <span class="detail-label">Year:</span>
                        <span class="detail-value">${car.year}</span>
                    </div>
                ` : ''}
                ${car.mileage ? `
                    <div class="detail-row">
                        <span class="detail-label">Mileage:</span>
                        <span class="detail-value">${car.mileage.toLocaleString()} miles</span>
                    </div>
                ` : ''}
                ${car.color ? `
                    <div class="detail-row">
                        <span class="detail-label">Color:</span>
                        <span class="detail-value">${escapeHtml(car.color)}</span>
                    </div>
                ` : ''}
                ${car.vin ? `
                    <div class="detail-row">
                        <span class="detail-label">VIN:</span>
                        <span class="detail-value" style="font-size: 0.85rem;">${escapeHtml(car.vin)}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="car-price">$${car.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            
            ${car.description ? `<p class="car-description">${escapeHtml(car.description)}</p>` : ''}
            
            <div class="quantity-control">
                <label>Stock:</label>
                <input type="number" 
                       class="quantity-input" 
                       value="${car.quantity}" 
                       min="0" 
                       data-id="${car.id}"
                       onchange="updateQuantity(${car.id}, this.value)">
                <span style="font-weight: 600; color: ${car.quantity > 0 ? '#2ed573' : '#ff4757'}">
                    ${car.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
            </div>
            
            <div class="car-actions">
                <button class="btn btn-success" onclick="editCar(${car.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteCar(${car.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Filter cars based on search and category
function filterCars() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = cars.filter(car => {
        const matchesSearch = 
            car.name.toLowerCase().includes(searchTerm) ||
            (car.vin && car.vin.toLowerCase().includes(searchTerm)) ||
            (car.color && car.color.toLowerCase().includes(searchTerm));
        
        const matchesCategory = !selectedCategory || car.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    displayCars(filtered);
}

// Open modal for adding new car
function openAddModal() {
    editingCarId = null;
    modalTitle.textContent = 'Add New Car';
    carForm.reset();
    carModal.style.display = 'block';
}

// Open modal for editing car
function editCar(id) {
    editingCarId = id;
    const car = cars.find(c => c.id === id);
    
    if (!car) return;
    
    modalTitle.textContent = 'Edit Car';
    document.getElementById('carName').value = car.name;
    document.getElementById('carCategory').value = car.category;
    document.getElementById('carYear').value = car.year || '';
    document.getElementById('carMileage').value = car.mileage || '';
    document.getElementById('carColor').value = car.color || '';
    document.getElementById('carVin').value = car.vin || '';
    document.getElementById('carQuantity').value = car.quantity;
    document.getElementById('carPrice').value = car.price;
    document.getElementById('carDescription').value = car.description || '';
    
    carModal.style.display = 'block';
}

// Close modal
function closeCarModal() {
    carModal.style.display = 'none';
    carForm.reset();
    editingCarId = null;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const carData = {
        name: document.getElementById('carName').value,
        category: document.getElementById('carCategory').value,
        year: parseInt(document.getElementById('carYear').value) || null,
        mileage: parseInt(document.getElementById('carMileage').value) || null,
        color: document.getElementById('carColor').value,
        vin: document.getElementById('carVin').value,
        quantity: parseInt(document.getElementById('carQuantity').value),
        price: parseFloat(document.getElementById('carPrice').value),
        description: document.getElementById('carDescription').value
    };
    
    try {
        if (editingCarId) {
            // Update existing car
            const response = await fetch(`/api/products/${editingCarId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carData)
            });
            
            if (response.ok) {
                showSuccess('Car updated successfully');
            } else {
                throw new Error('Failed to update car');
            }
        } else {
            // Create new car
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carData)
            });
            
            if (response.ok) {
                showSuccess('Car added successfully');
            } else {
                throw new Error('Failed to add car');
            }
        }
        
        closeCarModal();
        await loadCars();
    } catch (error) {
        console.error('Error saving car:', error);
        showError('Failed to save car');
    }
}

// Update car quantity
async function updateQuantity(id, quantity) {
    const car = cars.find(c => c.id === id);
    if (!car) return;
    
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...car,
                quantity: parseInt(quantity)
            })
        });
        
        if (response.ok) {
            showSuccess('Quantity updated');
            await loadCars();
        } else {
            throw new Error('Failed to update quantity');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        showError('Failed to update quantity');
    }
}

// Delete car
async function deleteCar(id) {
    if (!confirm('Are you sure you want to delete this car?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showSuccess('Car deleted successfully');
            await loadCars();
        } else {
            throw new Error('Failed to delete car');
        }
    } catch (error) {
        console.error('Error deleting car:', error);
        showError('Failed to delete car');
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccess(message) {
    // Simple alert for now - could be replaced with a toast notification
    alert(message);
}

function showError(message) {
    alert('Error: ' + message);
}
