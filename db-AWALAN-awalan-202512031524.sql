-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: awalan
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cashbook`
--

DROP TABLE IF EXISTS `cashbook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cashbook` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recordDate` date DEFAULT NULL,
  `total_in` decimal(10,2) DEFAULT NULL,
  `total_out` decimal(10,2) DEFAULT NULL,
  `net_balance` decimal(10,2) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `cashbook_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cashbook`
--

LOCK TABLES `cashbook` WRITE;
/*!40000 ALTER TABLE `cashbook` DISABLE KEYS */;
/*!40000 ALTER TABLE `cashbook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `categoryId` int NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(100) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'COFFEE','2025-12-02 09:19:01'),(2,'MATCHA','2025-12-02 09:19:01'),(3,'NON COFFEE','2025-12-02 09:19:01'),(4,'FOOD','2025-12-02 09:19:01'),(5,'DESSERT','2025-12-02 09:19:01');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobdesk`
--

DROP TABLE IF EXISTS `jobdesk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobdesk` (
  `jobdeskId` int NOT NULL AUTO_INCREMENT,
  `jobdeskName` varchar(100) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`jobdeskId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobdesk`
--

LOCK TABLES `jobdesk` WRITE;
/*!40000 ALTER TABLE `jobdesk` DISABLE KEYS */;
INSERT INTO `jobdesk` VALUES (1,'MANAGER',NULL),(2,'HEADBAR',NULL),(3,'BARISTA',NULL),(4,'KITCHEN',NULL);
/*!40000 ALTER TABLE `jobdesk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_addons`
--

DROP TABLE IF EXISTS `product_addons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_addons` (
  `addonId` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `addonName` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`addonId`),
  KEY `productId` (`productId`),
  CONSTRAINT `product_addons_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_addons`
--

LOCK TABLES `product_addons` WRITE;
/*!40000 ALTER TABLE `product_addons` DISABLE KEYS */;
INSERT INTO `product_addons` VALUES (1,1,'Sugar',0.00,1),(2,1,'Less Sugar',0.00,1),(3,1,'Non Sugar',0.00,1),(4,2,'Sugar',0.00,1),(5,2,'Less Sugar',0.00,1),(6,2,'Non Sugar',0.00,1),(7,3,'Sugar',0.00,1),(8,3,'Less Sugar',0.00,1),(9,3,'Non Sugar',0.00,1),(10,4,'Sugar',0.00,1),(11,4,'Less Sugar',0.00,1),(12,4,'Non Sugar',0.00,1),(13,5,'Sugar',0.00,1),(14,5,'Less Sugar',0.00,1),(15,5,'Non Sugar',0.00,1),(16,6,'Sugar',0.00,1),(17,6,'Less Sugar',0.00,1),(18,6,'Non Sugar',0.00,1),(19,7,'Sugar',0.00,1),(20,7,'Less Sugar',0.00,1),(21,7,'Non Sugar',0.00,1),(22,8,'Sugar',0.00,1),(23,8,'Less Sugar',0.00,1),(24,8,'Non Sugar',0.00,1),(25,9,'Sugar',0.00,1),(26,9,'Less Sugar',0.00,1),(27,9,'Non Sugar',0.00,1),(28,10,'Sugar',0.00,1),(29,10,'Less Sugar',0.00,1),(30,10,'Non Sugar',0.00,1),(31,11,'Sugar',0.00,1),(32,11,'Less Sugar',0.00,1),(33,11,'Non Sugar',0.00,1),(34,12,'Sugar',0.00,1),(35,12,'Less Sugar',0.00,1),(36,12,'Non Sugar',0.00,1),(37,13,'Sugar',0.00,1),(38,13,'Less Sugar',0.00,1),(39,13,'Non Sugar',0.00,1),(40,14,'Sugar',0.00,1),(41,14,'Less Sugar',0.00,1),(42,14,'Non Sugar',0.00,1),(43,15,'Sugar',0.00,1),(44,15,'Less Sugar',0.00,1),(45,15,'Non Sugar',0.00,1);
/*!40000 ALTER TABLE `product_addons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `variantId` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `variantGroup` varchar(100) NOT NULL,
  `variantValue` varchar(100) NOT NULL,
  `extraPrice` decimal(10,2) DEFAULT '0.00',
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`variantId`),
  KEY `productId` (`productId`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'Temperature','Hot',0.00,1),(2,1,'Temperature','Iced',0.00,1),(3,2,'Temperature','Hot',0.00,1),(4,2,'Temperature','Iced',0.00,1),(5,3,'Temperature','Hot',0.00,1),(6,3,'Temperature','Iced',0.00,1),(7,4,'Temperature','Hot',0.00,1),(8,4,'Temperature','Iced',0.00,1),(9,5,'Temperature','Hot',0.00,1),(10,5,'Temperature','Iced',0.00,1),(11,6,'Temperature','Hot',0.00,1),(12,6,'Temperature','Iced',0.00,1),(13,7,'Temperature','Hot',0.00,1),(14,7,'Temperature','Iced',0.00,1),(15,8,'Temperature','Hot',0.00,1),(16,8,'Temperature','Iced',0.00,1),(17,9,'Temperature','Hot',0.00,1),(18,9,'Temperature','Iced',0.00,1),(19,10,'Temperature','Hot',0.00,1),(20,10,'Temperature','Iced',0.00,1),(21,11,'Temperature','Iced',0.00,1),(22,12,'Temperature','Hot',0.00,1),(23,13,'Temperature','Hot',0.00,1),(24,14,'Temperature','Hot',0.00,1),(25,14,'Temperature','Iced',0.00,1),(26,15,'Temperature','Hot',0.00,1);
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `productId` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `productName` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `cost` decimal(10,2) DEFAULT '0.00',
  `isActive` tinyint(1) DEFAULT '1',
  `productDesc` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`productId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'AMERICANO',15000.00,3500.00,1,'Espresso + Water','2025-12-02 09:25:04'),(2,1,'AWALAN CREAMY AREN',18000.00,4000.00,1,'Creamy Aren Delight','2025-12-02 09:25:04'),(3,1,'CAFE LATTE',15000.00,3500.00,1,'Espresso + Steamed Milk','2025-12-02 09:25:04'),(4,1,'SPANISH LATTE',15000.00,4000.00,1,'Espresso + Sweetened Milk','2025-12-02 09:25:04'),(5,1,'CAPPUCINO',15000.00,3500.00,1,'Espresso + Milk Foam','2025-12-02 09:25:04'),(6,1,'BUTTERSCOTCH',18000.00,4000.00,1,'Butterscotch Latte','2025-12-02 09:25:04'),(7,1,'VANILLA LATTE',18000.00,4000.00,1,'Vanilla Flavored Latte','2025-12-02 09:25:04'),(8,1,'CARAMEL LATTE',18000.00,4000.00,1,'Caramel Flavored Latte','2025-12-02 09:25:04'),(9,1,'HAZELNUT LATTE',18000.00,4000.00,1,'Hazelnut Flavored Latte','2025-12-02 09:25:04'),(10,1,'MOCACINO',18000.00,4000.00,1,'Mocha Coffee','2025-12-02 09:25:04'),(11,1,'CARAMEL MATCHIATO',18000.00,4000.00,1,'Caramel Macchiato','2025-12-02 09:25:04'),(12,1,'ESPRESSO',8000.00,3000.00,1,'Pure Espresso Shot','2025-12-02 09:25:04'),(13,1,'DIRTY LATTE',20000.00,4500.00,1,'Latte with Espresso Shot on Top','2025-12-02 09:25:04'),(14,1,'V60',15000.00,3500.00,1,'Pour Over Coffee','2025-12-02 09:25:04'),(15,1,'MAGIC',18000.00,4000.00,1,'Specialty Coffee Magic','2025-12-02 09:25:04');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_item_addons`
--

DROP TABLE IF EXISTS `transaction_item_addons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_item_addons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transactionItemId` int NOT NULL,
  `addonPrice` decimal(10,2) NOT NULL DEFAULT '0.00',
  `quantity` int DEFAULT '1',
  `addonname` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transactionItemId` (`transactionItemId`),
  CONSTRAINT `transaction_item_addons_ibfk_1` FOREIGN KEY (`transactionItemId`) REFERENCES `transaction_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_item_addons`
--

LOCK TABLES `transaction_item_addons` WRITE;
/*!40000 ALTER TABLE `transaction_item_addons` DISABLE KEYS */;
INSERT INTO `transaction_item_addons` VALUES (1,6,0.00,1,'Non Sugar'),(2,7,0.00,1,'Sugar'),(3,8,0.00,1,'Sugar'),(4,9,0.00,1,'Sugar'),(5,10,0.00,1,'Non Sugar'),(6,11,0.00,1,'Non Sugar'),(7,12,0.00,1,'Non Sugar'),(8,13,0.00,1,'Non Sugar'),(9,14,0.00,1,'Sugar'),(10,15,0.00,1,'Less Sugar'),(11,16,0.00,1,'Non Sugar');
/*!40000 ALTER TABLE `transaction_item_addons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_item_variants`
--

DROP TABLE IF EXISTS `transaction_item_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_item_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transactionItemId` int NOT NULL,
  `variantPrice` decimal(10,2) DEFAULT '0.00',
  `variantName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transactionItemId` (`transactionItemId`),
  CONSTRAINT `transaction_item_variants_ibfk_1` FOREIGN KEY (`transactionItemId`) REFERENCES `transaction_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_item_variants`
--

LOCK TABLES `transaction_item_variants` WRITE;
/*!40000 ALTER TABLE `transaction_item_variants` DISABLE KEYS */;
INSERT INTO `transaction_item_variants` VALUES (2,6,0.00,'Iced'),(3,7,0.00,'Iced'),(4,8,0.00,'Iced'),(5,9,0.00,'Iced'),(6,10,0.00,'Hot'),(7,11,0.00,'Hot'),(8,12,0.00,'Iced'),(9,13,0.00,'Hot'),(10,14,0.00,'Iced'),(11,15,0.00,'Iced'),(12,16,0.00,'Iced');
/*!40000 ALTER TABLE `transaction_item_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_items`
--

DROP TABLE IF EXISTS `transaction_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceCode` varchar(50) NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `basePrice` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `invoiceCode` (`invoiceCode`),
  KEY `productId` (`productId`),
  CONSTRAINT `transaction_items_ibfk_1` FOREIGN KEY (`invoiceCode`) REFERENCES `transactions` (`invoiceCode`) ON DELETE CASCADE,
  CONSTRAINT `transaction_items_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_items`
--

LOCK TABLES `transaction_items` WRITE;
/*!40000 ALTER TABLE `transaction_items` DISABLE KEYS */;
INSERT INTO `transaction_items` VALUES (6,'AWLN-251202-0001',1,2,15000.00,30000.00,''),(7,'AWLN-251202-0001',2,1,18000.00,18000.00,'Normal'),(8,'AWLN-251202-0002',6,1,18000.00,18000.00,''),(9,'AWLN-251202-0002',2,1,18000.00,18000.00,''),(10,'AWLN-251202-0002',14,2,15000.00,30000.00,'suhu 88'),(11,'AWLN-251203-0001',13,1,20000.00,20000.00,''),(12,'AWLN-251203-0001',14,1,15000.00,15000.00,'Puntang'),(13,'AWLN-251203-0001',14,1,15000.00,15000.00,'Ciwidey'),(14,'AWLN-251203-0001',2,1,18000.00,18000.00,''),(15,'AWLN-251203-0001',3,1,15000.00,15000.00,''),(16,'AWLN-251203-0002',1,1,15000.00,15000.00,'');
/*!40000 ALTER TABLE `transaction_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transactionId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `invoiceCode` varchar(50) NOT NULL,
  `customerName` varchar(100) DEFAULT NULL,
  `orderType` enum('dinein','takeaway','delivery') DEFAULT NULL,
  `paymentType` enum('cash','qris','card') DEFAULT 'cash',
  `status` enum('pending','paid','canceled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `subTotal` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(10,2) DEFAULT '0.00',
  `tax` decimal(10,2) DEFAULT '0.00',
  `totalAmount` decimal(10,2) DEFAULT '0.00',
  `notes` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`transactionId`),
  UNIQUE KEY `invoiceCode` (`invoiceCode`),
  KEY `userId` (`userId`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,1,'AWLN-251202-0001','MANNN','dinein','qris','pending',48000.00,0.00,0.00,48000.00,'Test','2025-12-02 09:59:51','2025-12-02 13:24:36'),(2,1,'AWLN-251202-0002','Irman','takeaway','cash','pending',66000.00,0.00,0.00,66000.00,'','2025-12-02 10:05:46','2025-12-03 10:51:21'),(3,1,'AWLN-251203-0001','AZIZ','delivery','qris','pending',83000.00,0.00,0.00,83000.00,'Cikarang Barat','2025-12-03 11:05:54','2025-12-03 11:20:23'),(4,1,'AWLN-251203-0002','RAMBE','dinein','cash','pending',15000.00,0.00,0.00,15000.00,'','2025-12-03 11:20:55','2025-12-03 11:25:28'),(5,1,'AWLN-251203-0003',NULL,NULL,'cash','pending',0.00,0.00,0.00,0.00,NULL,'2025-12-03 11:30:32','2025-12-03 11:30:32');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trx_counter`
--

DROP TABLE IF EXISTS `trx_counter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trx_counter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trxDate` date NOT NULL,
  `counter` int DEFAULT '0',
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trxDate` (`trxDate`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trx_counter`
--

LOCK TABLES `trx_counter` WRITE;
/*!40000 ALTER TABLE `trx_counter` DISABLE KEYS */;
INSERT INTO `trx_counter` VALUES (1,'2025-12-02',2,'2025-12-02 10:05:46'),(2,'2025-12-03',3,'2025-12-03 11:30:32');
/*!40000 ALTER TABLE `trx_counter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `roleId` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,'OWNER'),(2,'ADMIN'),(3,'USER');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullName` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `jobdeskId` int DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `username` (`username`),
  KEY `roleId` (`roleId`),
  KEY `jobdeskId` (`jobdeskId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `user_roles` (`roleId`) ON DELETE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`jobdeskId`) REFERENCES `jobdesk` (`jobdeskId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'romirahman','$argon2id$v=19$m=65536,t=4,p=2$b6qR09L7Cp6aaBb3r9QXRw$6nkT/SAyTCx7k2K5tk6hoeVe7y5Lpnuu5mkHFsHEhyM','ROMI RAHMAN','romirahman03romi@gmail.com',1,1,1,'2025-12-02 09:11:29');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'awalan'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-03 15:24:38
