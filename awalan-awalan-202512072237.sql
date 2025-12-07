-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: awalan
-- ------------------------------------------------------
-- Server version	8.0.43

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
  `total_in` int DEFAULT NULL,
  `total_out` int DEFAULT NULL,
  `net_balance` int DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `running_balance` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `cashbook_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cashbook`
--

LOCK TABLES `cashbook` WRITE;
/*!40000 ALTER TABLE `cashbook` DISABLE KEYS */;
INSERT INTO `cashbook` VALUES (5,'2025-12-06',2000000,0,2000000,'CASH',1,'2025-12-06 14:24:50','2025-12-06 14:24:50',2000000),(6,'2025-12-06',0,18000,-18000,'CLEO',1,'2025-12-06 14:25:00','2025-12-06 14:25:00',1982000);
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
  CONSTRAINT `product_addons_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_addons`
--

LOCK TABLES `product_addons` WRITE;
/*!40000 ALTER TABLE `product_addons` DISABLE KEYS */;
INSERT INTO `product_addons` VALUES (1,1,'Sugar',0.00,1),(2,1,'Less Sugar',0.00,1),(3,1,'Non Sugar',0.00,1),(4,2,'Sugar',0.00,1),(5,2,'Less Sugar',0.00,1),(6,2,'Non Sugar',0.00,1),(16,6,'Sugar',0.00,1),(17,6,'Less Sugar',0.00,1),(18,6,'Non Sugar',0.00,1),(19,7,'Sugar',0.00,1),(20,7,'Less Sugar',0.00,1),(21,7,'Non Sugar',0.00,1),(22,8,'Sugar',0.00,1),(23,8,'Less Sugar',0.00,1),(24,8,'Non Sugar',0.00,1),(25,9,'Sugar',0.00,1),(26,9,'Less Sugar',0.00,1),(27,9,'Non Sugar',0.00,1),(28,10,'Sugar',0.00,1),(29,10,'Less Sugar',0.00,1),(30,10,'Non Sugar',0.00,1),(31,11,'Sugar',0.00,1),(32,11,'Less Sugar',0.00,1),(33,11,'Non Sugar',0.00,1),(34,12,'Sugar',0.00,1),(35,12,'Less Sugar',0.00,1),(36,12,'Non Sugar',0.00,1),(37,13,'Sugar',0.00,1),(38,13,'Less Sugar',0.00,1),(39,13,'Non Sugar',0.00,1),(40,14,'Sugar',0.00,1),(41,14,'Less Sugar',0.00,1),(42,14,'Non Sugar',0.00,1),(43,15,'Sugar',0.00,1),(44,15,'Less Sugar',0.00,1),(45,15,'Non Sugar',0.00,1),(46,46,'AddOn',0.00,1),(47,46,'AddOn2',0.00,1),(52,5,'Sugar',0.00,1),(53,5,'Less Sugar',0.00,1),(54,5,'Non Sugar',0.00,1),(55,3,'Sugar',0.00,1),(56,3,'Less Sugar',0.00,1),(57,3,'Non Sugar',0.00,1),(58,4,'Sugar',0.00,1),(59,4,'Less Sugar',0.00,1),(60,4,'Non Sugar',0.00,1);
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
  `variantValue` varchar(100) NOT NULL,
  `extraPrice` decimal(10,2) DEFAULT '0.00',
  `isActive` tinyint(1) DEFAULT '1',
  `variantGroup` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`variantId`),
  KEY `productId` (`productId`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'Hot',0.00,1,'temprature'),(2,1,'Iced',0.00,1,'temprature'),(3,2,'Hot',0.00,1,'temprature'),(4,2,'Iced',0.00,1,'temprature'),(11,6,'Hot',0.00,1,'temprature'),(12,6,'Iced',0.00,1,'temprature'),(13,7,'Hot',0.00,1,'temprature'),(14,7,'Iced',0.00,1,'temprature'),(15,8,'Hot',0.00,1,'temprature'),(16,8,'Iced',0.00,1,'temprature'),(17,9,'Hot',0.00,1,'temprature'),(18,9,'Iced',0.00,1,'temprature'),(19,10,'Hot',0.00,1,'temprature'),(20,10,'Iced',0.00,1,'temprature'),(21,11,'Iced',0.00,1,'temprature'),(22,12,'Hot',0.00,1,'temprature'),(23,13,'Hot',0.00,1,'temprature'),(24,14,'Hot',0.00,1,'temprature'),(25,14,'Iced',0.00,1,'temprature'),(26,15,'Hot',0.00,1,'temprature'),(27,46,'Variant',2000.00,1,NULL),(28,46,'Variant2',0.00,1,NULL),(33,5,'Hot',0.00,1,'temprature'),(34,5,'Iced',0.00,1,'temprature'),(35,3,'Hot',0.00,1,'temprature'),(36,3,'Iced',0.00,1,'temprature'),(37,4,'Hot',0.00,1,'temprature'),(38,4,'Iced',0.00,1,'temprature');
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
  `discount` int DEFAULT NULL,
  PRIMARY KEY (`productId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'AMERICANO',15000.00,3500.00,1,'Espresso + Water','2025-12-02 09:25:04',NULL),(2,1,'AWALAN CREAMY AREN',18000.00,4000.00,1,'Creamy Aren Delight','2025-12-02 09:25:04',NULL),(3,1,'CAFE LATTE',18000.00,3500.00,1,'Espresso + Steamed Milk','2025-12-02 09:25:04',NULL),(4,1,'SPANISH LATTE',18000.00,4000.00,1,'Espresso + Sweetened Milk','2025-12-02 09:25:04',NULL),(5,1,'CAPPUCINO',18000.00,3500.00,1,'Espresso + Milk Foam','2025-12-02 09:25:04',NULL),(6,1,'BUTTERSCOTCH',18000.00,4000.00,1,'Butterscotch Latte','2025-12-02 09:25:04',NULL),(7,1,'VANILLA LATTE',18000.00,4000.00,1,'Vanilla Flavored Latte','2025-12-02 09:25:04',NULL),(8,1,'CARAMEL LATTE',18000.00,4000.00,1,'Caramel Flavored Latte','2025-12-02 09:25:04',NULL),(9,1,'HAZELNUT LATTE',18000.00,4000.00,1,'Hazelnut Flavored Latte','2025-12-02 09:25:04',NULL),(10,1,'MOCACINO',18000.00,4000.00,1,'Mocha Coffee','2025-12-02 09:25:04',NULL),(11,1,'CARAMEL MATCHIATO',18000.00,4000.00,1,'Caramel Macchiato','2025-12-02 09:25:04',NULL),(12,1,'ESPRESSO',8000.00,3000.00,1,'Pure Espresso Shot','2025-12-02 09:25:04',NULL),(13,1,'DIRTY LATTE',20000.00,4500.00,1,'Latte with Espresso Shot on Top','2025-12-02 09:25:04',NULL),(14,1,'V60',15000.00,3500.00,1,'Pour Over Coffee','2025-12-02 09:25:04',NULL),(15,1,'MAGIC',18000.00,4000.00,1,'Specialty Coffee Magic','2025-12-02 09:25:04',NULL),(16,2,'Matcha Latte',18000.00,0.00,1,'','2025-12-04 10:48:36',NULL),(17,2,'Usucha',18000.00,0.00,1,'','2025-12-04 10:48:36',NULL),(18,2,'Spanish Matcha',18000.00,0.00,1,'','2025-12-04 10:48:36',NULL),(19,2,'Pink Cloud',18000.00,0.00,1,'','2025-12-04 10:48:36',NULL),(20,2,'Matcha Berry',18000.00,0.00,1,'','2025-12-04 10:48:36',NULL),(21,2,'Matcha Aren',18000.00,0.00,1,'','2025-12-04 10:48:36',NULL),(22,2,'Dirty Matcha',18000.00,0.00,1,'','2025-12-04 10:48:36',NULL),(23,2,'Ceremonial Usucha',25000.00,0.00,1,'','2025-12-04 10:48:36',NULL),(24,2,'Ceremonial Latte',25000.00,0.00,1,'','2025-12-04 10:48:36',NULL),(25,3,'Coklat',15000.00,0.00,1,'','2025-12-04 10:53:54',NULL),(26,3,'Taro',15000.00,0.00,1,'','2025-12-04 10:53:54',NULL),(27,3,'Red Velvet',15000.00,0.00,1,'','2025-12-04 10:53:54',NULL),(28,3,'Lemon Tea',15000.00,0.00,1,'','2025-12-04 10:53:54',NULL),(29,3,'Lychee',15000.00,0.00,1,'','2025-12-04 10:53:54',NULL),(30,3,'Susu Soda',15000.00,0.00,1,'','2025-12-04 10:53:54',NULL),(31,4,'Pizza',0.00,0.00,1,'','2025-12-04 11:03:00',NULL),(32,4,'Cireng',15000.00,0.00,1,'','2025-12-04 11:03:00',NULL),(33,4,'Kentang',15000.00,0.00,1,'','2025-12-04 11:03:00',NULL),(34,4,'Sosis',10000.00,0.00,1,'','2025-12-04 11:03:00',NULL),(35,4,'Dimsum',15000.00,0.00,1,'','2025-12-04 11:03:00',NULL),(36,4,'Mix Platter',40000.00,0.00,1,'','2025-12-04 11:03:00',NULL),(37,4,'Mie Goreng',15000.00,0.00,1,'','2025-12-04 11:03:00',NULL),(38,4,'Ramen',18000.00,0.00,1,'','2025-12-04 11:03:00',NULL),(39,4,'Toast',18000.00,0.00,1,'','2025-12-04 11:03:00',NULL),(40,5,'Cheescuit',18000.00,0.00,1,'','2025-12-04 11:03:32',NULL),(41,5,'Roti Bakar',15000.00,0.00,1,'','2025-12-04 11:03:32',NULL),(42,5,'Churos',15000.00,0.00,1,'','2025-12-04 11:03:32',NULL),(46,5,'Cheescuit',10000.00,15000.00,1,'Test','2025-12-04 15:00:30',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_item_addons`
--

LOCK TABLES `transaction_item_addons` WRITE;
/*!40000 ALTER TABLE `transaction_item_addons` DISABLE KEYS */;
INSERT INTO `transaction_item_addons` VALUES (30,48,0.00,1,'Non Sugar'),(31,49,0.00,1,'Sugar'),(32,51,0.00,1,'Sugar'),(33,55,0.00,1,'Sugar'),(34,56,0.00,1,'Sugar'),(35,59,0.00,1,'Sugar');
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
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_item_variants`
--

LOCK TABLES `transaction_item_variants` WRITE;
/*!40000 ALTER TABLE `transaction_item_variants` DISABLE KEYS */;
INSERT INTO `transaction_item_variants` VALUES (53,48,0.00,'Hot'),(54,49,0.00,'Iced'),(55,51,0.00,'Iced'),(56,55,0.00,'Iced'),(57,56,0.00,'Iced'),(58,59,0.00,'Iced');
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
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_items`
--

LOCK TABLES `transaction_items` WRITE;
/*!40000 ALTER TABLE `transaction_items` DISABLE KEYS */;
INSERT INTO `transaction_items` VALUES (48,'AWLN-251206-0007',13,1,20000.00,20000.00,''),(49,'AWLN-251206-0008',2,1,18000.00,18000.00,''),(50,'AWLN-251206-0009',16,1,18000.00,18000.00,''),(51,'AWLN-251206-0010',3,1,18000.00,18000.00,''),(52,'AWLN-251206-0010',39,1,18000.00,18000.00,''),(53,'AWLN-251206-0010',33,1,15000.00,15000.00,''),(54,'AWLN-251206-0010',25,1,15000.00,15000.00,''),(55,'AWLN-251206-0011',2,1,18000.00,18000.00,''),(56,'AWLN-251207-0001',11,1,18000.00,18000.00,''),(57,'AWLN-251207-0001',39,1,18000.00,18000.00,''),(58,'AWLN-251207-0001',16,1,18000.00,18000.00,''),(59,'AWLN-251207-0005',11,1,18000.00,18000.00,''),(60,'AWLN-251207-0005',39,1,18000.00,18000.00,'');
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
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (30,1,'AWLN-251206-0007','ROMI','dinein','cash','paid',20000.00,0.00,0.00,20000.00,'','2025-12-06 11:35:08','2025-12-06 11:35:28'),(31,1,'AWLN-251206-0008','RAHMAN','dinein','cash','paid',18000.00,0.00,0.00,18000.00,'','2025-12-06 11:35:32','2025-12-06 13:02:21'),(32,1,'AWLN-251206-0009','RISYA','delivery','qris','paid',18000.00,0.00,0.00,18000.00,'','2025-12-06 11:36:08','2025-12-06 11:36:37'),(33,1,'AWLN-251206-0010','WARDAH','dinein','qris','paid',66000.00,0.00,0.00,66000.00,'','2025-12-06 11:37:53','2025-12-06 11:38:25'),(34,1,'AWLN-251206-0011','Irman','takeaway','qris','paid',18000.00,0.00,0.00,18000.00,'','2025-12-06 13:14:43','2025-12-06 13:15:05'),(35,1,'AWLN-251207-0001','Irman Budiman','dinein','qris','paid',54000.00,0.00,0.00,54000.00,'','2025-12-07 14:49:45','2025-12-07 14:50:18'),(39,1,'AWLN-251207-0005','RANGGA','dinein','qris','paid',36000.00,0.00,0.00,36000.00,'','2025-12-07 15:59:57','2025-12-07 16:00:25'),(40,1,'AWLN-251207-0006',NULL,NULL,'cash','pending',0.00,0.00,0.00,0.00,NULL,'2025-12-07 16:03:46','2025-12-07 16:03:46'),(41,1,'AWLN-251207-0007',NULL,NULL,'cash','pending',0.00,0.00,0.00,0.00,NULL,'2025-12-07 17:26:26','2025-12-07 17:26:26');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trx_counter`
--

LOCK TABLES `trx_counter` WRITE;
/*!40000 ALTER TABLE `trx_counter` DISABLE KEYS */;
INSERT INTO `trx_counter` VALUES (1,'2025-12-02',2,'2025-12-02 10:05:46'),(2,'2025-12-03',3,'2025-12-03 11:30:32'),(3,'2025-12-04',2,'2025-12-04 10:43:12'),(4,'2025-12-05',1,'2025-12-05 10:41:38'),(5,'2025-12-06',11,'2025-12-06 13:14:43'),(6,'2025-12-07',7,'2025-12-07 17:26:26');
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

-- Dump completed on 2025-12-07 22:37:07
