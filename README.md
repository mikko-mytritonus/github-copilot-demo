# Car Dealership Inventory Management System

A modern, easy-to-use web application for managing car inventory at a dealership. Browse, add, edit, delete vehicles, and manage stock quantities with a beautiful, responsive interface.

## Features

- 🚗 **Browse Vehicles**: View all cars in your inventory with detailed information
- ➕ **Add New Cars**: Easily add new vehicles with complete details (make, model, year, mileage, VIN, color, etc.)
- ✏️ **Edit Cars**: Update vehicle information including stock quantity
- 🗑️ **Delete Cars**: Remove vehicles from inventory
- 🔍 **Search & Filter**: Search by name, VIN, or color, and filter by category
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 💾 **Local Database**: SQLite database pre-populated with 20 sample cars

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: SQLite (better-sqlite3)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Modern gradient UI with responsive grid layout

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd github-copilot-demo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Browsing Inventory
- The main page displays all vehicles in a card-based grid layout
- Each card shows: vehicle name, category, year, mileage, color, VIN, price, and current stock

### Adding a New Car
1. Click the "**+ Add New Car**" button
2. Fill in the vehicle details (required fields marked with *)
3. Click "**Save Car**" to add it to inventory

### Editing a Car
1. Click the "**Edit**" button on any vehicle card
2. Modify the details in the modal form
3. Click "**Save Car**" to update

### Updating Stock Quantity
- Use the quantity input field on each card to directly update stock levels
- Changes are saved automatically when you modify the value

### Deleting a Car
1. Click the "**Delete**" button on the vehicle card
2. Confirm the deletion when prompted

### Search and Filter
- Use the search box to find cars by name, VIN, or color
- Use the category dropdown to filter by vehicle type (Sedan, SUV, Truck, Coupe)

## Database

The application uses SQLite for data storage. On first run, the database is automatically created and seeded with 20 sample vehicles including:
- Various makes and models (Toyota, Honda, Ford, Tesla, BMW, Mercedes-Benz, etc.)
- Different categories (Sedans, SUVs, Trucks, Coupes)
- Realistic pricing and vehicle details

The database file (`inventory.db`) is created automatically in the root directory and is excluded from version control via `.gitignore`.

## API Endpoints

The application provides a REST API:

- `GET /api/products` - Get all vehicles
- `GET /api/products/:id` - Get a specific vehicle
- `POST /api/products` - Create a new vehicle
- `PUT /api/products/:id` - Update a vehicle
- `DELETE /api/products/:id` - Delete a vehicle

## Project Structure

```
github-copilot-demo/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Modern CSS styling
│   └── app.js          # Frontend JavaScript
├── server.js           # Express server & API
├── package.json        # Project dependencies
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## License

ISC
