
-- SQL Schema without img field

CREATE TABLE categories (
  categoryId INT AUTO_INCREMENT PRIMARY KEY,
  categoryName VARCHAR(100) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  productId INT AUTO_INCREMENT PRIMARY KEY,
  categoryId INT NOT NULL,
  productName VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0.00,
  productDesc TEXT,
  isActive TINYINT(1) DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
);

CREATE TABLE product_variants (
  variantId INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL,
  variantGroup VARCHAR(100) NOT NULL,
  variantValue VARCHAR(100) NOT NULL,
  extraPrice DECIMAL(10,2) DEFAULT 0,
  isActive TINYINT(1) DEFAULT 1,
  FOREIGN KEY (productId) REFERENCES products(productId)
);

CREATE TABLE product_addons (
  addonId INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL,
  addonName VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  isActive TINYINT(1) DEFAULT 1,
  FOREIGN KEY (productId) REFERENCES products(productId)
);

CREATE TABLE user_roles (
  roleId INT AUTO_INCREMENT PRIMARY KEY,
  roleName VARCHAR(100) NOT NULL
);

CREATE TABLE jobdesk (
  jobdeskId INT AUTO_INCREMENT PRIMARY KEY,
  jobdeskName VARCHAR(100),
  description TEXT
);

CREATE TABLE users (
  userId INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(100),
  email VARCHAR(100),
  roleId INT,
  jobdeskId INT,
  isActive TINYINT(1) DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (roleId) REFERENCES user_roles(roleId) ON DELETE CASCADE,
  FOREIGN KEY (jobdeskId) REFERENCES jobdesk(jobdeskId) ON DELETE CASCADE
);

CREATE TABLE transactions (
  transactionId INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  invoiceCode VARCHAR(50) NOT NULL UNIQUE,
  customerName VARCHAR(100),
  orderType ENUM('dinein', 'takeaway', 'delivery'),
  paymentType ENUM('cash', 'qris', 'card') DEFAULT 'cash',
  status ENUM('pending', 'completed', 'refund') DEFAULT 'pending',
  subTotal DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  totalAmount DECIMAL(10,2) DEFAULT 0,
  notes VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE transaction_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoiceCode VARCHAR(50) NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  basePrice DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  note VARCHAR(255),
  FOREIGN KEY (invoiceCode) REFERENCES transactions(invoiceCode) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(productId)
);

CREATE TABLE transaction_item_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transactionItemId INT NOT NULL,
  variantId INT NOT NULL,
  variantPrice DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (transactionItemId) REFERENCES transaction_items(id) ON DELETE CASCADE,
  FOREIGN KEY (variantId) REFERENCES product_variants(variantId)
);

CREATE TABLE transaction_item_addons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transactionItemId INT NOT NULL,
  addonId INT NOT NULL,
  addonPrice DECIMAL(10,2) NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (transactionItemId) REFERENCES transaction_items(id) ON DELETE CASCADE,
  FOREIGN KEY (addonId) REFERENCES product_addons(addonId)
);

CREATE TABLE trx_counter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trxDate DATE NOT NULL UNIQUE,
  counter INT DEFAULT 0,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE cashbook (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recordDate DATE,
  total_in DECIMAL(10,2),
  total_out DECIMAL(10,2),
  net_balance DECIMAL(10,2),
  notes VARCHAR(255),
  createdBy INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(userId)
);
