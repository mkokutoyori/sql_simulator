// E-commerce Database Seed Data
class DataSeeder {
    static async seedDatabase() {
        try {
            // Check if already seeded
            if (db.tableExists('CUSTOMERS')) {
                console.log('Database already seeded');
                return;
            }

            // Create sequences
            this.createSequences();

            // Create tables
            this.createTables();

            // Insert seed data
            this.insertSeedData();

            console.log('Database seeded successfully');
        } catch (error) {
            console.error('Error seeding database:', error);
        }
    }

    static createSequences() {
        // Customer sequence
        db.createSequence('CUSTOMER_SEQ', {
            startWith: 1001,
            incrementBy: 1,
            minValue: 1,
            maxValue: 9999999999,
            cycle: false,
            cache: 20
        });

        // Product sequence
        db.createSequence('PRODUCT_SEQ', {
            startWith: 1001,
            incrementBy: 1,
            minValue: 1,
            maxValue: 9999999999,
            cycle: false,
            cache: 20
        });

        // Order sequence
        db.createSequence('ORDER_SEQ', {
            startWith: 10001,
            incrementBy: 1,
            minValue: 1,
            maxValue: 9999999999,
            cycle: false,
            cache: 20
        });

        // Category sequence
        db.createSequence('CATEGORY_SEQ', {
            startWith: 101,
            incrementBy: 1,
            minValue: 1,
            maxValue: 9999999999,
            cycle: false,
            cache: 20
        });
    }

    static createTables() {
        // Customers table
        db.createTable('CUSTOMERS', [
            { name: 'CUSTOMER_ID', type: 'NUMBER', nullable: false },
            { name: 'FIRST_NAME', type: 'VARCHAR2', length: 50, nullable: false },
            { name: 'LAST_NAME', type: 'VARCHAR2', length: 50, nullable: false },
            { name: 'EMAIL', type: 'VARCHAR2', length: 100, nullable: false },
            { name: 'PHONE', type: 'VARCHAR2', length: 20 },
            { name: 'ADDRESS', type: 'VARCHAR2', length: 200 },
            { name: 'CITY', type: 'VARCHAR2', length: 50 },
            { name: 'STATE', type: 'VARCHAR2', length: 50 },
            { name: 'ZIP_CODE', type: 'VARCHAR2', length: 10 },
            { name: 'COUNTRY', type: 'VARCHAR2', length: 50, default: 'USA' },
            { name: 'REGISTRATION_DATE', type: 'DATE', nullable: false },
            { name: 'LOYALTY_POINTS', type: 'NUMBER', default: 0 },
            { name: 'STATUS', type: 'VARCHAR2', length: 20, default: 'ACTIVE' }
        ], ['CUSTOMER_ID']);

        // Categories table
        db.createTable('CATEGORIES', [
            { name: 'CATEGORY_ID', type: 'NUMBER', nullable: false },
            { name: 'CATEGORY_NAME', type: 'VARCHAR2', length: 50, nullable: false },
            { name: 'DESCRIPTION', type: 'VARCHAR2', length: 200 },
            { name: 'PARENT_CATEGORY_ID', type: 'NUMBER' }
        ], ['CATEGORY_ID']);

        // Products table
        db.createTable('PRODUCTS', [
            { name: 'PRODUCT_ID', type: 'NUMBER', nullable: false },
            { name: 'PRODUCT_NAME', type: 'VARCHAR2', length: 100, nullable: false },
            { name: 'DESCRIPTION', type: 'VARCHAR2', length: 500 },
            { name: 'CATEGORY_ID', type: 'NUMBER', nullable: false },
            { name: 'PRICE', type: 'NUMBER', nullable: false },
            { name: 'COST', type: 'NUMBER', nullable: false },
            { name: 'STOCK_QUANTITY', type: 'NUMBER', nullable: false, default: 0 },
            { name: 'REORDER_LEVEL', type: 'NUMBER', default: 10 },
            { name: 'SUPPLIER', type: 'VARCHAR2', length: 100 },
            { name: 'SKU', type: 'VARCHAR2', length: 50 },
            { name: 'WEIGHT', type: 'NUMBER' },
            { name: 'DIMENSIONS', type: 'VARCHAR2', length: 50 },
            { name: 'COLOR', type: 'VARCHAR2', length: 30 },
            { name: 'SIZE', type: 'VARCHAR2', length: 20 },
            { name: 'RATING', type: 'NUMBER' },
            { name: 'REVIEW_COUNT', type: 'NUMBER', default: 0 },
            { name: 'IS_ACTIVE', type: 'VARCHAR2', length: 1, default: 'Y' },
            { name: 'CREATED_DATE', type: 'DATE', nullable: false }
        ], ['PRODUCT_ID']);

        // Orders table
        db.createTable('ORDERS', [
            { name: 'ORDER_ID', type: 'NUMBER', nullable: false },
            { name: 'CUSTOMER_ID', type: 'NUMBER', nullable: false },
            { name: 'ORDER_DATE', type: 'DATE', nullable: false },
            { name: 'SHIP_DATE', type: 'DATE' },
            { name: 'DELIVERY_DATE', type: 'DATE' },
            { name: 'STATUS', type: 'VARCHAR2', length: 20, nullable: false, default: 'PENDING' },
            { name: 'TOTAL_AMOUNT', type: 'NUMBER', nullable: false },
            { name: 'DISCOUNT_AMOUNT', type: 'NUMBER', default: 0 },
            { name: 'TAX_AMOUNT', type: 'NUMBER', default: 0 },
            { name: 'SHIPPING_COST', type: 'NUMBER', default: 0 },
            { name: 'PAYMENT_METHOD', type: 'VARCHAR2', length: 30 },
            { name: 'PAYMENT_STATUS', type: 'VARCHAR2', length: 20, default: 'PENDING' },
            { name: 'SHIPPING_ADDRESS', type: 'VARCHAR2', length: 200 },
            { name: 'TRACKING_NUMBER', type: 'VARCHAR2', length: 50 },
            { name: 'NOTES', type: 'VARCHAR2', length: 500 }
        ], ['ORDER_ID']);

        // Order Items table
        db.createTable('ORDER_ITEMS', [
            { name: 'ORDER_ITEM_ID', type: 'NUMBER', nullable: false },
            { name: 'ORDER_ID', type: 'NUMBER', nullable: false },
            { name: 'PRODUCT_ID', type: 'NUMBER', nullable: false },
            { name: 'QUANTITY', type: 'NUMBER', nullable: false },
            { name: 'UNIT_PRICE', type: 'NUMBER', nullable: false },
            { name: 'DISCOUNT', type: 'NUMBER', default: 0 },
            { name: 'LINE_TOTAL', type: 'NUMBER', nullable: false }
        ], ['ORDER_ITEM_ID']);

        // Reviews table
        db.createTable('PRODUCT_REVIEWS', [
            { name: 'REVIEW_ID', type: 'NUMBER', nullable: false },
            { name: 'PRODUCT_ID', type: 'NUMBER', nullable: false },
            { name: 'CUSTOMER_ID', type: 'NUMBER', nullable: false },
            { name: 'RATING', type: 'NUMBER', nullable: false },
            { name: 'TITLE', type: 'VARCHAR2', length: 100 },
            { name: 'COMMENT', type: 'VARCHAR2', length: 1000 },
            { name: 'REVIEW_DATE', type: 'DATE', nullable: false },
            { name: 'HELPFUL_COUNT', type: 'NUMBER', default: 0 }
        ], ['REVIEW_ID']);

        // Suppliers table
        db.createTable('SUPPLIERS', [
            { name: 'SUPPLIER_ID', type: 'NUMBER', nullable: false },
            { name: 'SUPPLIER_NAME', type: 'VARCHAR2', length: 100, nullable: false },
            { name: 'CONTACT_NAME', type: 'VARCHAR2', length: 50 },
            { name: 'EMAIL', type: 'VARCHAR2', length: 100 },
            { name: 'PHONE', type: 'VARCHAR2', length: 20 },
            { name: 'ADDRESS', type: 'VARCHAR2', length: 200 },
            { name: 'CITY', type: 'VARCHAR2', length: 50 },
            { name: 'COUNTRY', type: 'VARCHAR2', length: 50 },
            { name: 'RATING', type: 'NUMBER' }
        ], ['SUPPLIER_ID']);

        // Inventory transactions table
        db.createTable('INVENTORY_TRANSACTIONS', [
            { name: 'TRANSACTION_ID', type: 'NUMBER', nullable: false },
            { name: 'PRODUCT_ID', type: 'NUMBER', nullable: false },
            { name: 'TRANSACTION_TYPE', type: 'VARCHAR2', length: 20, nullable: false },
            { name: 'QUANTITY', type: 'NUMBER', nullable: false },
            { name: 'TRANSACTION_DATE', type: 'DATE', nullable: false },
            { name: 'REFERENCE_ID', type: 'NUMBER' },
            { name: 'NOTES', type: 'VARCHAR2', length: 200 }
        ], ['TRANSACTION_ID']);
    }

    static insertSeedData() {
        this.insertCategories();
        this.insertCustomers();
        this.insertSuppliers();
        this.insertProducts();
        this.insertOrders();
        this.insertOrderItems();
        this.insertReviews();
        this.insertInventoryTransactions();
    }

    static insertCategories() {
        const categories = [
            { id: 1, name: 'Electronics', desc: 'Electronic devices and accessories', parent: null },
            { id: 2, name: 'Computers', desc: 'Desktop and laptop computers', parent: 1 },
            { id: 3, name: 'Smartphones', desc: 'Mobile phones and accessories', parent: 1 },
            { id: 4, name: 'Audio', desc: 'Headphones, speakers, and audio equipment', parent: 1 },
            { id: 5, name: 'Clothing', desc: 'Men and women apparel', parent: null },
            { id: 6, name: 'Men\'s Clothing', desc: 'Clothing for men', parent: 5 },
            { id: 7, name: 'Women\'s Clothing', desc: 'Clothing for women', parent: 5 },
            { id: 8, name: 'Home & Garden', desc: 'Home improvement and garden supplies', parent: null },
            { id: 9, name: 'Furniture', desc: 'Home and office furniture', parent: 8 },
            { id: 10, name: 'Sports & Outdoors', desc: 'Sporting goods and outdoor equipment', parent: null },
            { id: 11, name: 'Books', desc: 'Physical and digital books', parent: null },
            { id: 12, name: 'Toys & Games', desc: 'Toys, games, and hobbies', parent: null }
        ];

        categories.forEach(cat => {
            db.insertRow('CATEGORIES', {
                CATEGORY_ID: cat.id,
                CATEGORY_NAME: cat.name,
                DESCRIPTION: cat.desc,
                PARENT_CATEGORY_ID: cat.parent
            });
        });
    }

    static insertCustomers() {
        const customers = [
            { id: 1, fname: 'John', lname: 'Doe', email: 'john.doe@email.com', phone: '555-0101', address: '123 Main St', city: 'New York', state: 'NY', zip: '10001', country: 'USA', points: 250 },
            { id: 2, fname: 'Jane', lname: 'Smith', email: 'jane.smith@email.com', phone: '555-0102', address: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'USA', points: 180 },
            { id: 3, fname: 'Michael', lname: 'Johnson', email: 'michael.j@email.com', phone: '555-0103', address: '789 Pine Rd', city: 'Chicago', state: 'IL', zip: '60601', country: 'USA', points: 420 },
            { id: 4, fname: 'Emily', lname: 'Williams', email: 'emily.w@email.com', phone: '555-0104', address: '321 Elm St', city: 'Houston', state: 'TX', zip: '77001', country: 'USA', points: 95 },
            { id: 5, fname: 'David', lname: 'Brown', email: 'david.brown@email.com', phone: '555-0105', address: '654 Maple Dr', city: 'Phoenix', state: 'AZ', zip: '85001', country: 'USA', points: 310 },
            { id: 6, fname: 'Sarah', lname: 'Davis', email: 'sarah.davis@email.com', phone: '555-0106', address: '987 Cedar Ln', city: 'Philadelphia', state: 'PA', zip: '19019', country: 'USA', points: 155 },
            { id: 7, fname: 'Robert', lname: 'Miller', email: 'robert.m@email.com', phone: '555-0107', address: '147 Birch St', city: 'San Antonio', state: 'TX', zip: '78201', country: 'USA', points: 275 },
            { id: 8, fname: 'Jennifer', lname: 'Wilson', email: 'jennifer.w@email.com', phone: '555-0108', address: '258 Walnut Ave', city: 'San Diego', state: 'CA', zip: '92101', country: 'USA', points: 190 },
            { id: 9, fname: 'William', lname: 'Moore', email: 'william.moore@email.com', phone: '555-0109', address: '369 Ash Dr', city: 'Dallas', state: 'TX', zip: '75201', country: 'USA', points: 340 },
            { id: 10, fname: 'Lisa', lname: 'Taylor', email: 'lisa.taylor@email.com', phone: '555-0110', address: '741 Spruce Rd', city: 'San Jose', state: 'CA', zip: '95101', country: 'USA', points: 220 },
            { id: 11, fname: 'James', lname: 'Anderson', email: 'james.a@email.com', phone: '555-0111', address: '852 Poplar St', city: 'Austin', state: 'TX', zip: '73301', country: 'USA', points: 165 },
            { id: 12, fname: 'Mary', lname: 'Thomas', email: 'mary.thomas@email.com', phone: '555-0112', address: '963 Willow Ln', city: 'Jacksonville', state: 'FL', zip: '32099', country: 'USA', points: 285 },
            { id: 13, fname: 'Christopher', lname: 'Jackson', email: 'chris.j@email.com', phone: '555-0113', address: '159 Hickory Ave', city: 'Fort Worth', state: 'TX', zip: '76101', country: 'USA', points: 405 },
            { id: 14, fname: 'Patricia', lname: 'White', email: 'patricia.w@email.com', phone: '555-0114', address: '357 Magnolia Dr', city: 'Columbus', state: 'OH', zip: '43004', country: 'USA', points: 135 },
            { id: 15, fname: 'Daniel', lname: 'Harris', email: 'daniel.h@email.com', phone: '555-0115', address: '486 Dogwood Rd', city: 'Charlotte', state: 'NC', zip: '28201', country: 'USA', points: 245 }
        ];

        const regDate = new Date('2022-01-01');
        customers.forEach(cust => {
            db.insertRow('CUSTOMERS', {
                CUSTOMER_ID: cust.id,
                FIRST_NAME: cust.fname,
                LAST_NAME: cust.lname,
                EMAIL: cust.email,
                PHONE: cust.phone,
                ADDRESS: cust.address,
                CITY: cust.city,
                STATE: cust.state,
                ZIP_CODE: cust.zip,
                COUNTRY: cust.country,
                REGISTRATION_DATE: new Date(regDate.getTime() + cust.id * 86400000 * 10),
                LOYALTY_POINTS: cust.points,
                STATUS: 'ACTIVE'
            });
        });
    }

    static insertSuppliers() {
        const suppliers = [
            { id: 1, name: 'TechGlobal Inc', contact: 'Alice Chen', email: 'alice@techglobal.com', phone: '555-2001', address: '100 Tech Plaza', city: 'San Francisco', country: 'USA', rating: 4.8 },
            { id: 2, name: 'Fashion World Ltd', contact: 'Bob Martinez', email: 'bob@fashionworld.com', phone: '555-2002', address: '200 Style Ave', city: 'New York', country: 'USA', rating: 4.5 },
            { id: 3, name: 'HomeComfort Co', contact: 'Carol White', email: 'carol@homecomfort.com', phone: '555-2003', address: '300 Comfort Rd', city: 'Chicago', country: 'USA', rating: 4.6 },
            { id: 4, name: 'Sports Unlimited', contact: 'David Lee', email: 'david@sportsunltd.com', phone: '555-2004', address: '400 Athletic Way', city: 'Denver', country: 'USA', rating: 4.7 },
            { id: 5, name: 'BookSource Publishers', contact: 'Emma Johnson', email: 'emma@booksource.com', phone: '555-2005', address: '500 Library Ln', city: 'Boston', country: 'USA', rating: 4.9 }
        ];

        suppliers.forEach(sup => {
            db.insertRow('SUPPLIERS', {
                SUPPLIER_ID: sup.id,
                SUPPLIER_NAME: sup.name,
                CONTACT_NAME: sup.contact,
                EMAIL: sup.email,
                PHONE: sup.phone,
                ADDRESS: sup.address,
                CITY: sup.city,
                COUNTRY: sup.country,
                RATING: sup.rating
            });
        });
    }

    static insertProducts() {
        const products = [
            // Electronics
            { id: 1, name: 'Laptop Pro 15', desc: 'High-performance laptop with 16GB RAM', cat: 2, price: 1299.99, cost: 850.00, stock: 45, supplier: 'TechGlobal Inc', sku: 'LAP-PRO-15', weight: 4.2, rating: 4.5, reviews: 128 },
            { id: 2, name: 'Desktop Workstation', desc: 'Powerful desktop for professionals', cat: 2, price: 1899.99, cost: 1200.00, stock: 28, supplier: 'TechGlobal Inc', sku: 'DSK-WRK-01', weight: 25.0, rating: 4.7, reviews: 89 },
            { id: 3, name: 'Smartphone X12', desc: '6.5" display, 128GB storage', cat: 3, price: 899.99, cost: 600.00, stock: 120, supplier: 'TechGlobal Inc', sku: 'PHN-X12-BLK', weight: 0.4, rating: 4.6, reviews: 342 },
            { id: 4, name: 'Smartphone X12 Pro', desc: '6.7" display, 256GB storage', cat: 3, price: 1199.99, cost: 800.00, stock: 85, supplier: 'TechGlobal Inc', sku: 'PHN-X12P-BLK', weight: 0.45, rating: 4.8, reviews: 256 },
            { id: 5, name: 'Wireless Headphones', desc: 'Noise-canceling over-ear headphones', cat: 4, price: 249.99, cost: 150.00, stock: 200, supplier: 'TechGlobal Inc', sku: 'AUD-WH-NC', weight: 0.7, rating: 4.4, reviews: 421 },
            { id: 6, name: 'Bluetooth Speaker', desc: 'Portable waterproof speaker', cat: 4, price: 79.99, cost: 45.00, stock: 350, supplier: 'TechGlobal Inc', sku: 'AUD-SPK-BT', weight: 1.2, rating: 4.3, reviews: 567 },
            { id: 7, name: 'Smart Watch Pro', desc: 'Fitness tracking smartwatch', cat: 1, price: 399.99, cost: 250.00, stock: 95, supplier: 'TechGlobal Inc', sku: 'WAT-PRO-BLK', weight: 0.15, rating: 4.5, reviews: 234 },
            { id: 8, name: 'Tablet 10"', desc: '10-inch tablet with stylus', cat: 1, price: 499.99, cost: 320.00, stock: 76, supplier: 'TechGlobal Inc', sku: 'TAB-10-GRY', weight: 1.1, rating: 4.4, reviews: 178 },

            // Clothing
            { id: 9, name: 'Men\'s Cotton T-Shirt', desc: 'Classic fit cotton t-shirt', cat: 6, price: 24.99, cost: 12.00, stock: 450, supplier: 'Fashion World Ltd', sku: 'MEN-TSH-BLU-L', size: 'L', color: 'Blue', rating: 4.2, reviews: 892 },
            { id: 10, name: 'Men\'s Jeans', desc: 'Slim fit denim jeans', cat: 6, price: 59.99, cost: 30.00, stock: 320, supplier: 'Fashion World Ltd', sku: 'MEN-JNS-BLK-32', size: '32', color: 'Black', rating: 4.5, reviews: 645 },
            { id: 11, name: 'Women\'s Dress', desc: 'Elegant summer dress', cat: 7, price: 79.99, cost: 40.00, stock: 180, supplier: 'Fashion World Ltd', sku: 'WMN-DRS-FLR-M', size: 'M', color: 'Floral', rating: 4.6, reviews: 423 },
            { id: 12, name: 'Women\'s Blouse', desc: 'Professional silk blouse', cat: 7, price: 49.99, cost: 25.00, stock: 240, supplier: 'Fashion World Ltd', sku: 'WMN-BLS-WHT-S', size: 'S', color: 'White', rating: 4.4, reviews: 356 },

            // Home & Garden
            { id: 13, name: 'Office Chair Ergonomic', desc: 'Comfortable ergonomic office chair', cat: 9, price: 299.99, cost: 180.00, stock: 67, supplier: 'HomeComfort Co', sku: 'FRN-CHR-ERG', weight: 35.0, rating: 4.7, reviews: 289 },
            { id: 14, name: 'Standing Desk', desc: 'Adjustable height standing desk', cat: 9, price: 499.99, cost: 300.00, stock: 42, supplier: 'HomeComfort Co', sku: 'FRN-DSK-STD', weight: 65.0, rating: 4.8, reviews: 167 },
            { id: 15, name: 'LED Desk Lamp', desc: 'Adjustable LED desk lamp', cat: 8, price: 39.99, cost: 20.00, stock: 280, supplier: 'HomeComfort Co', sku: 'HOM-LMP-LED', weight: 1.8, rating: 4.3, reviews: 534 },
            { id: 16, name: 'Kitchen Blender', desc: 'High-speed kitchen blender', cat: 8, price: 89.99, cost: 50.00, stock: 156, supplier: 'HomeComfort Co', sku: 'HOM-BLN-HS', weight: 8.5, rating: 4.5, reviews: 412 },

            // Sports & Outdoors
            { id: 17, name: 'Yoga Mat Premium', desc: 'Extra thick yoga mat', cat: 10, price: 34.99, cost: 18.00, stock: 420, supplier: 'Sports Unlimited', sku: 'SPT-YOG-MAT', weight: 3.2, rating: 4.6, reviews: 678 },
            { id: 18, name: 'Dumbbell Set', desc: 'Adjustable dumbbell set 5-50lbs', cat: 10, price: 199.99, cost: 120.00, stock: 89, supplier: 'Sports Unlimited', sku: 'SPT-DMB-SET', weight: 55.0, rating: 4.7, reviews: 234 },
            { id: 19, name: 'Running Shoes', desc: 'Professional running shoes', cat: 10, price: 129.99, cost: 70.00, stock: 210, supplier: 'Sports Unlimited', sku: 'SPT-SHO-RUN-10', size: '10', color: 'Black/Red', rating: 4.5, reviews: 567 },
            { id: 20, name: 'Camping Tent 4-Person', desc: 'Waterproof camping tent', cat: 10, price: 179.99, cost: 100.00, stock: 54, supplier: 'Sports Unlimited', sku: 'SPT-TNT-4P', weight: 12.5, rating: 4.4, reviews: 189 },

            // Books
            { id: 21, name: 'The Great Novel', desc: 'Bestselling fiction novel', cat: 11, price: 19.99, cost: 8.00, stock: 580, supplier: 'BookSource Publishers', sku: 'BOK-FIC-GRN', weight: 1.2, rating: 4.8, reviews: 1234 },
            { id: 22, name: 'Learn SQL Database', desc: 'Comprehensive SQL guide', cat: 11, price: 44.99, cost: 20.00, stock: 280, supplier: 'BookSource Publishers', sku: 'BOK-TEC-SQL', weight: 2.1, rating: 4.9, reviews: 678 },
            { id: 23, name: 'Cooking Masterclass', desc: 'Professional cooking guide', cat: 11, price: 29.99, cost: 12.00, stock: 340, supplier: 'BookSource Publishers', sku: 'BOK-COK-MST', weight: 1.8, rating: 4.6, reviews: 445 },

            // Toys & Games
            { id: 24, name: 'Board Game Classic', desc: 'Family board game', cat: 12, price: 34.99, cost: 18.00, stock: 195, supplier: 'TechGlobal Inc', sku: 'TOY-BRD-CLS', weight: 2.5, rating: 4.5, reviews: 456 },
            { id: 25, name: 'Building Blocks Set', desc: '500-piece building set', cat: 12, price: 49.99, cost: 25.00, stock: 230, supplier: 'TechGlobal Inc', sku: 'TOY-BLK-500', weight: 3.8, rating: 4.7, reviews: 789 }
        ];

        const createDate = new Date('2023-01-01');
        products.forEach(prod => {
            db.insertRow('PRODUCTS', {
                PRODUCT_ID: prod.id,
                PRODUCT_NAME: prod.name,
                DESCRIPTION: prod.desc,
                CATEGORY_ID: prod.cat,
                PRICE: prod.price,
                COST: prod.cost,
                STOCK_QUANTITY: prod.stock,
                REORDER_LEVEL: 20,
                SUPPLIER: prod.supplier,
                SKU: prod.sku,
                WEIGHT: prod.weight || null,
                DIMENSIONS: null,
                COLOR: prod.color || null,
                SIZE: prod.size || null,
                RATING: prod.rating,
                REVIEW_COUNT: prod.reviews,
                IS_ACTIVE: 'Y',
                CREATED_DATE: createDate
            });
        });
    }

    static insertOrders() {
        const orders = [
            { id: 1, custId: 1, orderDate: '2024-01-15', shipDate: '2024-01-16', deliveryDate: '2024-01-20', status: 'DELIVERED', total: 1349.98, discount: 50.00, tax: 108.00, shipping: 15.00, payment: 'Credit Card', payStatus: 'PAID' },
            { id: 2, custId: 2, orderDate: '2024-01-18', shipDate: '2024-01-19', deliveryDate: '2024-01-23', status: 'DELIVERED', total: 924.97, discount: 25.00, tax: 72.00, shipping: 12.00, payment: 'PayPal', payStatus: 'PAID' },
            { id: 3, custId: 3, orderDate: '2024-01-20', shipDate: '2024-01-21', deliveryDate: null, status: 'SHIPPED', total: 1979.96, discount: 100.00, tax: 150.40, shipping: 20.00, payment: 'Credit Card', payStatus: 'PAID' },
            { id: 4, custId: 4, orderDate: '2024-01-22', shipDate: null, deliveryDate: null, status: 'PROCESSING', total: 79.98, discount: 0.00, tax: 6.40, shipping: 8.00, payment: 'Debit Card', payStatus: 'PAID' },
            { id: 5, custId: 5, orderDate: '2024-01-25', shipDate: '2024-01-26', deliveryDate: '2024-01-30', status: 'DELIVERED', total: 549.98, discount: 50.00, tax: 40.00, shipping: 10.00, payment: 'Credit Card', payStatus: 'PAID' },
            { id: 6, custId: 1, orderDate: '2024-02-01', shipDate: '2024-02-02', deliveryDate: '2024-02-06', status: 'DELIVERED', total: 299.97, discount: 0.00, tax: 24.00, shipping: 10.00, payment: 'Credit Card', payStatus: 'PAID' },
            { id: 7, custId: 6, orderDate: '2024-02-03', shipDate: '2024-02-04', deliveryDate: '2024-02-08', status: 'DELIVERED', total: 499.99, discount: 0.00, tax: 40.00, shipping: 15.00, payment: 'PayPal', payStatus: 'PAID' },
            { id: 8, custId: 7, orderDate: '2024-02-05', shipDate: null, deliveryDate: null, status: 'PENDING', total: 1299.99, discount: 0.00, tax: 104.00, shipping: 0.00, payment: 'Credit Card', payStatus: 'PENDING' },
            { id: 9, custId: 8, orderDate: '2024-02-08', shipDate: '2024-02-09', deliveryDate: '2024-02-13', status: 'DELIVERED', total: 179.97, discount: 20.00, tax: 12.80, shipping: 10.00, payment: 'Debit Card', payStatus: 'PAID' },
            { id: 10, custId: 9, orderDate: '2024-02-10', shipDate: '2024-02-11', deliveryDate: null, status: 'SHIPPED', total: 899.98, discount: 0.00, tax: 72.00, shipping: 12.00, payment: 'Credit Card', payStatus: 'PAID' },
            { id: 11, custId: 10, orderDate: '2024-02-12', shipDate: '2024-02-13', deliveryDate: '2024-02-17', status: 'DELIVERED', total: 649.97, discount: 50.00, tax: 48.00, shipping: 15.00, payment: 'PayPal', payStatus: 'PAID' },
            { id: 12, custId: 3, orderDate: '2024-02-15', shipDate: '2024-02-16', deliveryDate: '2024-02-20', status: 'DELIVERED', total: 234.96, discount: 15.00, tax: 17.60, shipping: 10.00, payment: 'Credit Card', payStatus: 'PAID' },
            { id: 13, custId: 11, orderDate: '2024-02-18', shipDate: null, deliveryDate: null, status: 'PROCESSING', total: 399.99, discount: 0.00, tax: 32.00, shipping: 0.00, payment: 'Credit Card', payStatus: 'PAID' },
            { id: 14, custId: 12, orderDate: '2024-02-20', shipDate: '2024-02-21', deliveryDate: '2024-02-25', status: 'DELIVERED', total: 799.96, discount: 0.00, tax: 64.00, shipping: 12.00, payment: 'Debit Card', payStatus: 'PAID' },
            { id: 15, custId: 13, orderDate: '2024-02-22', shipDate: '2024-02-23', deliveryDate: null, status: 'SHIPPED', total: 1549.95, discount: 100.00, tax: 116.00, shipping: 20.00, payment: 'Credit Card', payStatus: 'PAID' }
        ];

        orders.forEach(ord => {
            db.insertRow('ORDERS', {
                ORDER_ID: ord.id,
                CUSTOMER_ID: ord.custId,
                ORDER_DATE: new Date(ord.orderDate),
                SHIP_DATE: ord.shipDate ? new Date(ord.shipDate) : null,
                DELIVERY_DATE: ord.deliveryDate ? new Date(ord.deliveryDate) : null,
                STATUS: ord.status,
                TOTAL_AMOUNT: ord.total,
                DISCOUNT_AMOUNT: ord.discount,
                TAX_AMOUNT: ord.tax,
                SHIPPING_COST: ord.shipping,
                PAYMENT_METHOD: ord.payment,
                PAYMENT_STATUS: ord.payStatus,
                SHIPPING_ADDRESS: null,
                TRACKING_NUMBER: ord.status !== 'PENDING' ? `TRACK${1000 + ord.id}` : null,
                NOTES: null
            });
        });
    }

    static insertOrderItems() {
        const orderItems = [
            // Order 1
            { id: 1, orderId: 1, prodId: 1, qty: 1, price: 1299.99, discount: 0, total: 1299.99 },
            { id: 2, orderId: 1, prodId: 5, qty: 1, price: 249.99, discount: 50.00, total: 199.99 },

            // Order 2
            { id: 3, orderId: 2, prodId: 3, qty: 1, price: 899.99, discount: 0, total: 899.99 },
            { id: 4, orderId: 2, prodId: 6, qty: 1, price: 79.99, discount: 25.00, total: 54.99 },

            // Order 3
            { id: 5, orderId: 3, prodId: 2, qty: 1, price: 1899.99, discount: 100.00, total: 1799.99 },
            { id: 6, orderId: 3, prodId: 13, qty: 1, price: 299.99, discount: 0, total: 299.99 },

            // Order 4
            { id: 7, orderId: 4, prodId: 6, qty: 2, price: 79.99, discount: 0, total: 159.98 },

            // Order 5
            { id: 8, orderId: 5, prodId: 14, qty: 1, price: 499.99, discount: 0, total: 499.99 },
            { id: 9, orderId: 5, prodId: 15, qty: 2, price: 39.99, discount: 10.00, total: 69.98 },

            // Order 6
            { id: 10, orderId: 6, orderId: 6, prodId: 17, qty: 5, price: 34.99, discount: 0, total: 174.97 },
            { id: 11, orderId: 6, prodId: 21, qty: 3, price: 19.99, discount: 0, total: 59.97 },

            // Order 7
            { id: 12, orderId: 7, prodId: 14, qty: 1, price: 499.99, discount: 0, total: 499.99 },

            // Order 8
            { id: 13, orderId: 8, prodId: 1, qty: 1, price: 1299.99, discount: 0, total: 1299.99 },

            // Order 9
            { id: 14, orderId: 9, prodId: 9, qty: 3, price: 24.99, discount: 5.00, total: 69.97 },
            { id: 15, orderId: 9, prodId: 10, qty: 2, price: 59.99, discount: 10.00, total: 109.98 },

            // Order 10
            { id: 16, orderId: 10, prodId: 4, qty: 1, price: 1199.99, discount: 0, total: 1199.99 },
            { id: 17, orderId: 10, prodId: 5, qty: 1, price: 249.99, discount: 0, total: 249.99 },

            // Order 11
            { id: 18, orderId: 11, prodId: 18, qty: 1, price: 199.99, discount: 0, total: 199.99 },
            { id: 19, orderId: 11, prodId: 19, qty: 2, price: 129.99, discount: 10.00, total: 249.98 },
            { id: 20, orderId: 11, prodId: 17, qty: 3, price: 34.99, discount: 0, total: 104.97 },

            // Order 12
            { id: 21, orderId: 12, prodId: 22, qty: 2, price: 44.99, discount: 0, total: 89.98 },
            { id: 22, orderId: 12, prodId: 23, qty: 1, price: 29.99, discount: 0, total: 29.99 },
            { id: 23, orderId: 12, prodId: 21, qty: 3, price: 19.99, discount: 0, total: 59.97 },

            // Order 13
            { id: 24, orderId: 13, prodId: 7, qty: 1, price: 399.99, discount: 0, total: 399.99 },

            // Order 14
            { id: 25, orderId: 14, prodId: 3, qty: 1, price: 899.99, discount: 0, total: 899.99 },
            { id: 26, orderId: 14, prodId: 7, qty: 1, price: 399.99, discount: 0, total: 399.99 },

            // Order 15
            { id: 27, orderId: 15, prodId: 2, qty: 1, price: 1899.99, discount: 100.00, total: 1799.99 },
            { id: 28, orderId: 15, prodId: 13, qty: 1, price: 299.99, discount: 0, total: 299.99 }
        ];

        orderItems.forEach(item => {
            db.insertRow('ORDER_ITEMS', {
                ORDER_ITEM_ID: item.id,
                ORDER_ID: item.orderId,
                PRODUCT_ID: item.prodId,
                QUANTITY: item.qty,
                UNIT_PRICE: item.price,
                DISCOUNT: item.discount,
                LINE_TOTAL: item.total
            });
        });
    }

    static insertReviews() {
        const reviews = [
            { id: 1, prodId: 1, custId: 1, rating: 5, title: 'Excellent laptop!', comment: 'Fast and reliable, perfect for work and gaming.', helpful: 15 },
            { id: 2, prodId: 1, custId: 3, rating: 4, title: 'Good value', comment: 'Great performance but battery could be better.', helpful: 8 },
            { id: 3, prodId: 3, custId: 2, rating: 5, title: 'Best phone ever', comment: 'Amazing camera and display quality.', helpful: 23 },
            { id: 4, prodId: 5, custId: 1, rating: 4, title: 'Great sound quality', comment: 'Comfortable and excellent noise cancellation.', helpful: 12 },
            { id: 5, prodId: 14, custId: 5, rating: 5, title: 'Perfect for home office', comment: 'Sturdy and easy to adjust height.', helpful: 18 },
            { id: 6, prodId: 18, custId: 11, rating: 5, title: 'Quality dumbbells', comment: 'Easy to adjust and very solid construction.', helpful: 9 },
            { id: 7, prodId: 22, custId: 3, rating: 5, title: 'Must-read for developers', comment: 'Comprehensive and easy to understand.', helpful: 34 },
            { id: 8, prodId: 4, custId: 9, rating: 5, title: 'Premium smartphone', comment: 'Worth every penny, amazing features.', helpful: 27 },
            { id: 9, prodId: 13, custId: 3, rating: 4, title: 'Comfortable chair', comment: 'Very comfortable but assembly was tricky.', helpful: 11 },
            { id: 10, prodId: 19, custId: 10, rating: 5, title: 'Best running shoes', comment: 'Lightweight and great support.', helpful: 16 }
        ];

        const reviewDate = new Date('2024-02-01');
        reviews.forEach(rev => {
            db.insertRow('PRODUCT_REVIEWS', {
                REVIEW_ID: rev.id,
                PRODUCT_ID: rev.prodId,
                CUSTOMER_ID: rev.custId,
                RATING: rev.rating,
                TITLE: rev.title,
                COMMENT: rev.comment,
                REVIEW_DATE: new Date(reviewDate.getTime() + rev.id * 86400000 * 2),
                HELPFUL_COUNT: rev.helpful
            });
        });
    }

    static insertInventoryTransactions() {
        const transactions = [
            { id: 1, prodId: 1, type: 'PURCHASE', qty: 50, refId: null, notes: 'Initial stock' },
            { id: 2, prodId: 1, type: 'SALE', qty: -1, refId: 1, notes: 'Order #1' },
            { id: 3, prodId: 3, type: 'PURCHASE', qty: 150, refId: null, notes: 'Initial stock' },
            { id: 4, prodId: 3, type: 'SALE', qty: -1, refId: 2, notes: 'Order #2' },
            { id: 5, prodId: 5, type: 'PURCHASE', qty: 250, refId: null, notes: 'Initial stock' },
            { id: 6, prodId: 5, type: 'SALE', qty: -1, refId: 1, notes: 'Order #1' },
            { id: 7, prodId: 14, type: 'PURCHASE', qty: 60, refId: null, notes: 'Initial stock' },
            { id: 8, prodId: 14, type: 'SALE', qty: -1, refId: 5, notes: 'Order #5' },
            { id: 9, prodId: 18, type: 'PURCHASE', qty: 100, refId: null, notes: 'Initial stock' },
            { id: 10, prodId: 22, type: 'PURCHASE', qty: 300, refId: null, notes: 'Initial stock' }
        ];

        const transDate = new Date('2024-01-01');
        transactions.forEach(trans => {
            db.insertRow('INVENTORY_TRANSACTIONS', {
                TRANSACTION_ID: trans.id,
                PRODUCT_ID: trans.prodId,
                TRANSACTION_TYPE: trans.type,
                QUANTITY: trans.qty,
                TRANSACTION_DATE: new Date(transDate.getTime() + trans.id * 86400000 * 3),
                REFERENCE_ID: trans.refId,
                NOTES: trans.notes
            });
        });
    }
}
