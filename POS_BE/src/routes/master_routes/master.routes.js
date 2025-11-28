var express = require("express");
var router = express.Router();
const upload = require("../../services/upload.service");

// Import Controller
const UserController = require("../../controllers/master_controller/UserController");
const ProductController = require("../../controllers/master_controller/ProductController");
const TransactionController = require("../../controllers/master_controller/TransactionController");
const CashbookController = require("../../controllers/master_controller/CashbookController");
// USERS
router.get("/users", UserController.getAllUser);
router.post("/register", UserController.register);
router.put("/user/:username", UserController.updateUser);
router.delete("/user/:id", UserController.deletedUser);

// PRODUCTS
router.get("/products", ProductController.getAllProducts);
router.get("/product/:id", ProductController.getProductById);
router.get(
  "/products/category/:categoryId",
  ProductController.getProductsByCategory
);
router.post("/product", upload.single("img"), ProductController.createProduct);
router.put(
  "/product/:id",
  upload.single("img"),
  ProductController.updateProduct
);
router.delete("/product/:id", ProductController.deleteProduct);

// TRX
router.get("/transactions", TransactionController.getAllTrx);
router.get("/transaction/:transactionId", TransactionController.getTrxById);
router.post("/transaction", TransactionController.createTrx);
router.put("/transaction/:transactionId", TransactionController.updateTrx);
router.delete("/transaction/:transactionId", TransactionController.deleteTrx);

// ===========================
// 📄 TRANSACTION DETAIL ROUTES
// ===========================
router.get(
  "/transaction/detail/:invoiceCode",
  TransactionController.getDetailTrx
);
router.post("/transaction/detail", TransactionController.createDetailTrx);
router.put("/transaction/detail/:id", TransactionController.updateDetailTrx);
router.delete("/transaction/detail/:id", TransactionController.deleteDetailTrx);

// Cashbook
router.get("/cashbook", CashbookController.getAllCashbook);
router.get("/cashbook/:id", CashbookController.getCashbookById);
router.post("/cashbook", CashbookController.createCashbook);
router.put("/cashbook/:id", CashbookController.updateCashbook);
router.delete("/cashbook/:id", CashbookController.deleteCashbook);

module.exports = router;
