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
   👤 USER ROUTES
=================================================== */
router.get("/users", UserController.getAllUser);
router.post("/user", UserController.register);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deletedUser);

/* ================================================
   📦 PRODUCT ROUTES (Tanpa Upload IMG)
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
   🎯 PRODUCT VARIANTS ROUTES
=================================================== */
router.get(
  "/products/:productId/variants",
  VariantController.getVariantsByProduct
);
router.post("/products/:productId/variants", VariantController.createVariant);
router.put("/variants/:variantId", VariantController.updateVariant);
router.delete("/variants/:variantId", VariantController.deleteVariant);

/* ================================================
   🍟 PRODUCT ADDONS ROUTES
=================================================== */
router.get("/products/:productId/addons", AddonController.getAddonsByProduct);
router.post("/products/:productId/addons", AddonController.createAddon);
router.put("/addons/:addonId", AddonController.updateAddon);
router.delete("/addons/:addonId", AddonController.deleteAddon);
/* ============================================================
   🧾 TRANSACTION HEADER (MAIN)
============================================================ */
router.get("/transactions", TransactionController.getAllTrx);
router.get("/transactions/:transactionId", TransactionController.getTrxById);
router.get(
  "/transactions/invoice/:invoiceCode",
  TransactionController.getTrxByInvoiceCode
);
router.post("/transaction", TransactionController.createTrx);
router.put("/transactions/:transactionId", TransactionController.updateTrx);
router.delete("/transactions/:transactionId", TransactionController.deleteTrx);

/* ============================================================
   🧺 TRANSACTION ITEMS (POS CART SYSTEM)
============================================================ */
router.get("/transactions/:invoiceCode/items", TransactionController.getItems);
router.post("/transactions/:invoiceCode/items", TransactionController.addItem);

// ✔ ini sudah benar, jangan diubah formatnya
router.put("/save-transaction/:transactionId", TransactionController.saveTrx);
router.put("/transaction-items/:id", TransactionController.updateItem);
router.delete("/transaction-items/:id", TransactionController.deleteItem);

/* ============================================================
   💳 CHECKOUT / PAYMENT
============================================================ */
// router.post(
//   "/transactions/:transactionId/checkout",
//   TransactionController.checkoutTrx
// );

/* ============================================================
   📆 FILTER BY DATE (Sales Report)
============================================================ */
router.get("/transactions/date/:date", TransactionController.getTrxByDate);

/* ================================================
   📘 CASHBOOK ROUTES
=================================================== */
router.get("/cashbook", CashbookController.getAllCashbook);
router.get("/cashbook/:id", CashbookController.getCashbookById);
router.post("/cashbook", CashbookController.createCashbook);
router.put("/cashbook/:id", CashbookController.updateCashbook);
router.delete("/cashbook/:id", CashbookController.deleteCashbook);

/* ================================================
   🏷 CATEGORY ROUTES
=================================================== */
router.get("/categories", CategoryController.getAllCategories);
router.get("/categories/:id", CategoryController.getCategoryById);
router.post("/categories", CategoryController.createCategory);
router.put("/categories/:id", CategoryController.updateCategory);
router.delete("/categories/:id", CategoryController.deleteCategory);

module.exports = router;
