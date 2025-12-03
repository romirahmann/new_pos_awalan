var express = require("express");
var router = express.Router();

// Controllers
const UserController = require("../../controllers/master_controller/UserController");
const ProductController = require("../../controllers/master_controller/ProductController");
const VariantController = require("../../controllers/master_controller/VariantController");
const AddonController = require("../../controllers/master_controller/AddsonController");
const TransactionController = require("../../controllers/master_controller/TransactionController");
const CashbookController = require("../../controllers/master_controller/CashbookController");
const CategoryController = require("../../controllers/master_controller/CategoriesController");

/* ================================================
   USER
=================================================== */
router.get("/users", UserController.getAllUser);
router.post("/user", UserController.register);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deletedUser);

/* ================================================
   PRODUCTS
=================================================== */
router.get("/products", ProductController.getAllProducts);
router.get("/products/:id", ProductController.getProductById);
router.get(
  "/products/category/:categoryId",
  ProductController.getProductsByCategory
);
router.post("/products", ProductController.createProduct);
router.put("/products/:id", ProductController.updateProduct);
router.delete("/products/:id", ProductController.deleteProduct);

/* ================================================
   PRODUCT VARIANTS
=================================================== */
router.get(
  "/products/:productId/variants",
  VariantController.getVariantsByProduct
);
router.post("/products/:productId/variants", VariantController.createVariant);
router.put("/variants/:variantId", VariantController.updateVariant);
router.delete("/variants/:variantId", VariantController.deleteVariant);

/* ================================================
   PRODUCT ADDONS
=================================================== */
router.get("/products/:productId/addons", AddonController.getAddonsByProduct);
router.post("/products/:productId/addons", AddonController.createAddon);
router.put("/addons/:addonId", AddonController.updateAddon);
router.delete("/addons/:addonId", AddonController.deleteAddon);

/* ================================================
   TRANSACTIONS (HEADER)
=================================================== */
router.get("/transactions", TransactionController.getAllTrx);
router.get("/transactions/:transactionId", TransactionController.getTrxById);
router.get(
  "/transactions/invoice/:invoiceCode",
  TransactionController.getTrxByInvoiceCode
);
router.post("/transaction", TransactionController.createTrx);
router.put("/transactions/:transactionId", TransactionController.updateTrx);
router.delete("/transactions/:transactionId", TransactionController.deleteTrx);

/* ================================================
   TRANSACTION ITEMS (CART)
=================================================== */
router.get("/transactions/:invoiceCode/items", TransactionController.getItems);
router.post("/transactions/:invoiceCode/items", TransactionController.addItem);
router.put("/save-transaction/:transactionId", TransactionController.saveTrx);
router.put(
  "/checkout-transaction/:transactionId",
  TransactionController.checkOutTrx
);
router.put("/transaction-items/:id", TransactionController.updateItem);
router.delete("/transaction-items/:id", TransactionController.deleteItem);

/* ================================================
   TRANSACTION FILTERS
=================================================== */
router.get("/transactions/date/:date", TransactionController.getTrxByDate);

/* ================================================
   CASHBOOK
=================================================== */
router.get("/cashbook", CashbookController.getAllCashbook);
router.get("/cashbook/:id", CashbookController.getCashbookById);
router.post("/cashbook", CashbookController.createCashbook);
router.put("/cashbook/:id", CashbookController.updateCashbook);
router.delete("/cashbook/:id", CashbookController.deleteCashbook);

/* ================================================
   CATEGORIES
=================================================== */
router.get("/categories", CategoryController.getAllCategories);
router.get("/categories/:id", CategoryController.getCategoryById);
router.post("/categories", CategoryController.createCategory);
router.put("/categories/:id", CategoryController.updateCategory);
router.delete("/categories/:id", CategoryController.deleteCategory);

module.exports = router;
