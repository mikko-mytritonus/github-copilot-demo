const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize database
const db = new Database('inventory.db');

// Create cars table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    year INTEGER,
    mileage INTEGER,
    vin TEXT,
    color TEXT
  )
`);

// Seed database with 20 cars if empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO products (name, category, quantity, price, description, year, mileage, vin, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  
  const products = [
    ['Toyota Camry LE', 'Sedan', 3, 24999.99, 'Reliable mid-size sedan with excellent fuel economy', 2022, 15000, '1HGBH41JXMN109186', 'Silver'],
    ['Honda Accord Sport', 'Sedan', 2, 27999.99, 'Sporty sedan with advanced safety features', 2023, 8000, '2HGFC2F59MH542321', 'Blue'],
    ['Ford F-150 XLT', 'Truck', 4, 42999.99, 'Best-selling full-size pickup truck', 2021, 32000, '1FTFW1E59MFB12345', 'Black'],
    ['Chevrolet Silverado', 'Truck', 2, 45999.99, 'Powerful and capable pickup truck', 2022, 18000, '1GC4YPE76MF123456', 'White'],
    ['Tesla Model 3', 'Sedan', 1, 39999.99, 'Premium electric sedan with autopilot', 2023, 5000, '5YJ3E1EA9MF000001', 'Red'],
    ['BMW X5 M Sport', 'SUV', 2, 62999.99, 'Luxury mid-size SUV with premium features', 2022, 12000, '5UXCR6C59M9C12345', 'Space Gray'],
    ['Mercedes-Benz C-Class', 'Sedan', 1, 44999.99, 'Elegant luxury sedan with advanced technology', 2023, 3000, 'W1KZF8HB9MA123456', 'Black'],
    ['Jeep Wrangler Unlimited', 'SUV', 3, 38999.99, 'Iconic off-road SUV with removable top', 2022, 20000, '1C4HJXDG9MW123456', 'Green'],
    ['Toyota RAV4 Hybrid', 'SUV', 4, 32999.99, 'Fuel-efficient compact SUV', 2023, 10000, '2T3P1RFV9MC123456', 'White'],
    ['Honda CR-V EX', 'SUV', 3, 29999.99, 'Spacious and practical compact SUV', 2022, 16000, '2HKRW2H88MH123456', 'Gray'],
    ['Mazda CX-5 Touring', 'SUV', 2, 28999.99, 'Stylish SUV with engaging driving dynamics', 2023, 7000, 'JM3KFBCM9M0123456', 'Soul Red'],
    ['Nissan Altima SV', 'Sedan', 3, 25999.99, 'Comfortable sedan with modern tech', 2022, 14000, '1N4BL4BV9MC123456', 'Pearl White'],
    ['Hyundai Tucson SEL', 'SUV', 4, 27999.99, 'Compact SUV with great warranty', 2023, 9000, '5NMS24AJ9MH123456', 'Blue'],
    ['Subaru Outback', 'SUV', 2, 33999.99, 'Adventure-ready wagon with AWD', 2022, 11000, '4S4BTANC9M3123456', 'Green'],
    ['Volkswagen Jetta SE', 'Sedan', 3, 22999.99, 'European-styled compact sedan', 2023, 6000, '3VWC57BU9MM123456', 'White'],
    ['Kia Sportage SX', 'SUV', 2, 31999.99, 'Modern SUV with bold styling', 2022, 13000, 'KNDPM3AC9M7123456', 'Black'],
    ['Ford Mustang GT', 'Coupe', 1, 46999.99, 'Iconic American muscle car', 2023, 2000, '1FA6P8CF9M5123456', 'Race Red'],
    ['Chevrolet Corvette', 'Coupe', 1, 69999.99, 'Mid-engine sports car with thrilling performance', 2022, 4000, '1G1YB2D49M5123456', 'Yellow'],
    ['Audi A4 Premium', 'Sedan', 2, 41999.99, 'Refined luxury sedan with Quattro AWD', 2023, 5000, 'WAUENAF49MN123456', 'Manhattan Gray'],
    ['Lexus RX 350', 'SUV', 1, 48999.99, 'Premium luxury SUV with reliability', 2022, 8000, '2T2HZMAA9MC123456', 'Atomic Silver']
  ];
  
  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insert.run(product);
    }
  });
  
  insertMany(products);
  console.log('Database seeded with 20 cars');
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY name').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new product
app.post('/api/products', (req, res) => {
  try {
    const { name, category, quantity, price, description, year, mileage, vin, color } = req.body;
    
    if (!name || !category || quantity === undefined || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = db.prepare(
      'INSERT INTO products (name, category, quantity, price, description, year, mileage, vin, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(name, category, quantity, price, description || '', year || null, mileage || null, vin || '', color || '');
    
    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const { name, category, quantity, price, description, year, mileage, vin, color } = req.body;
    
    const result = db.prepare(
      'UPDATE products SET name = ?, category = ?, quantity = ?, price = ?, description = ?, year = ?, mileage = ?, vin = ?, color = ? WHERE id = ?'
    ).run(name, category, quantity, price, description || '', year || null, mileage || null, vin || '', color || '', req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Inventory Management Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
