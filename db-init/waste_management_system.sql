-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2026 at 09:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `waste_management_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Admin_ID` int(5) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Admin_ID`, `email`, `password`) VALUES
(1, 'admin1@gmail.com', '$2a$12$q7CkHocGJ8qjbbYhBGirfeOAHVgfuL0iAjmLbWI5YZ59dQV8HZExy');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `Feedback_ID` int(11) NOT NULL,
  `Member_ID` int(11) NOT NULL,
  `Comments` text NOT NULL,
  `DateSubmitted` datetime DEFAULT CURRENT_TIMESTAMP 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`Feedback_ID`, `Member_ID`, `Comments`, `DateSubmitted`) VALUES
(5, 4, 'Great', '2025-11-11'),
(6, 4, 'Good', '2025-11-12'),
(7, 2, 'Very good service', '2025-11-14');

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `Member_ID` int(11) NOT NULL,
  `HouseNumber` varchar(50) NOT NULL,
  `WardNumber` int(11) DEFAULT NULL,
  `HouseName` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`Member_ID`, `HouseNumber`, `WardNumber`, `HouseName`) VALUES
(2, '108', 1, 'Nandana House'),
(4, '101', 2, 'Water Gym'),
(18, '102', 2, NULL),
(21, '103', 1, NULL),
(26, '104', 2, ''),
(27, '105', 2, '');

-- --------------------------------------------------------

--
-- Table structure for table `notificationlog`
--

CREATE TABLE `notificationlog` (
  `Notification_ID` int(11) NOT NULL,
  `Member_ID` int(11) DEFAULT NULL,
  `Worker_ID` int(11) DEFAULT NULL,
  `Request_ID` int(11) DEFAULT NULL,
  `Type` enum('Rejection','Acceptance','Task','Completion') NOT NULL,
  `SentAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `User_ID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `ContactInfo` varchar(50) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('Admin','Member','Worker') NOT NULL,
  `ProfilePicture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`User_ID`, `Name`, `Email`, `ContactInfo`, `Password`, `Role`, `ProfilePicture`) VALUES
(1, 'Batmantest', 'batman1@gmail.com', '9822115403', '$2b$10$LZZzuNCyCou43u7qdayi3ecZUB2bAdcsfXsKz45P1lH2Z77os3ABe', 'Worker', '/uploads/profile_pics/profilePicture-1762029262488-538557655.jpg'),
(2, 'Abhilash Manoj', 'abhilashmanoj9@gmail.com', '9657124772', '$2a$12$gqTXVm83yZOySPkdbuiIseJ5FFS8Br7dxhH6awxNIEEBT9LMnAuQG', 'Member', '/uploads/profile_pics/profilePicture-1762019935211-568142345.jpg'),
(3, 'Agil', 'agil1@gmail.com', '1234567891', '$2b$10$VXcxxQtMpep5BbmwMTP4nuXLpskYBYoGme7osnI/G.pVc/kw2QCCK', 'Worker', NULL),
(4, 'Misty', 'misty1@gmail.com', '1254276541', '$2a$10$fK6820sCV2sYl23OptlLmegiXqMpT3SmO/I/Jxbpa1dH1YQ9EBOIS', 'Member', '/uploads/profile_pics/profilePicture-1762509940357-45942897.jpg'),
(17, 'Abhin Madhav', 'abhinmadhav99@gmail.com', '7832456728', '$2b$10$gIfZve0lcxj51MdcVgkRr.ZHKE/.BzeCe3xUUhbFnLy8s/zJkF9yO', 'Worker', NULL),
(18, 'Aditya', NULL, '2563718212', '$2b$10$haXzM8O8RNdAD9CIz18M6uWOZtGOVJSN1lqsEekVZdE/ypcUDiyxa', 'Member', NULL),
(19, 'Abhinand', 'abhiabhinand005@gmail.com', '8123560321', '$2b$10$V3C4mkiX0JV8NJYdmNqjUehWfdpGx28H08xVTKqqDIhYsL348EC46', 'Worker', NULL),
(20, 'test', 'test1@gmail.com', '8743217654', '$2b$10$XKvTDw42Wzm2pWM.cI4e8OLGk0vtCsIrRhH64i7Qw8vpBOsUctTNK', 'Worker', NULL),
(21, 'test2', NULL, '6230915372', '$2b$10$IQwwnRNNZQgSSuQzYHGmTuwxGeqUKowtIDUxwOcx4TCGDg6H7UZRC', 'Member', NULL),
(26, 'Abhishek', 'abhishekrajnew20021@gmail.com', '9214568324', '$2b$10$NJX2kKopH/9e3oFlNBbPoegY9yVSPPh5SVrp1GuroL4EECRkvidzu', 'Member', '/uploads/profile_pics/profilePicture-1764734433472-783405342.jpg'),
(27, 'Abdu', 'abdulrahmaaan9075@gmail.com', '1735280912', '$2b$10$nfcoSjaFq6z0/Oy5GKdA2.Wmno4dC/eY.7x3tsvpM7OKXmVDM4CsC', 'Member', '/uploads/profile_pics/profilePicture-1764734371542-998512594.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `wasterequest`
--

CREATE TABLE `wasterequest` (
  `Request_ID` int(11) NOT NULL,
  `Member_ID` int(11) NOT NULL,
  `WasteType` varchar(100) NOT NULL,
  `HouseNumber` varchar(50) DEFAULT NULL,
  `WardNumber` int(11) DEFAULT NULL,
  `PreferredDateStart` date DEFAULT NULL,
  `PreferredDateEnd` date DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'Pending',
  `AssignedWorker_ID` int(11) DEFAULT NULL,
  `ConfirmedDate` date DEFAULT NULL,
  `LastAssignedWorker_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wasterequest`
--

INSERT INTO `wasterequest` (`Request_ID`, `Member_ID`, `WasteType`, `HouseNumber`, `WardNumber`, `PreferredDateStart`, `PreferredDateEnd`, `Status`, `AssignedWorker_ID`, `ConfirmedDate`, `LastAssignedWorker_ID`) VALUES
(1, 2, 'Organic', '108', 1, '2025-11-07', '2025-11-10', 'Completed', 1, '2025-11-08', 1),
(3, 4, 'Plastic', '101', 2, '2025-11-07', '2025-11-10', 'Completed', 3, '2025-11-07', 3),
(4, 4, 'Electronic', '101', 2, '2025-11-02', '2025-11-03', 'Rejected', NULL, NULL, NULL),
(5, 4, 'Metal', '101', 2, '2025-11-13', '2025-11-15', 'Completed', 3, '2025-11-14', 3),
(6, 2, 'Plastic', '108', 1, '2025-11-14', '2025-11-17', 'Accepted', 17, '2025-11-15', 17);

-- --------------------------------------------------------

--
-- Table structure for table `worker`
--

CREATE TABLE `worker` (
  `Worker_ID` int(11) NOT NULL,
  `WardNumber` int(11) DEFAULT NULL,
  `TaskAssigned` enum('yes','no') DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `worker`
--

INSERT INTO `worker` (`Worker_ID`, `WardNumber`, `TaskAssigned`) VALUES
(1, 1, 'no'),
(3, 2, 'no'),
(17, 1, 'yes'),
(19, 1, 'no'),
(20, 1, 'no');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`Admin_ID`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`Feedback_ID`),
  ADD KEY `Member_ID` (`Member_ID`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`Member_ID`),
  ADD UNIQUE KEY `HouseNumber` (`HouseNumber`);

--
-- Indexes for table `notificationlog`
--
ALTER TABLE `notificationlog`
  ADD PRIMARY KEY (`Notification_ID`),
  ADD KEY `Member_ID` (`Member_ID`),
  ADD KEY `Worker_ID` (`Worker_ID`),
  ADD KEY `Request_ID` (`Request_ID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `ContactInfo` (`ContactInfo`);

--
-- Indexes for table `wasterequest`
--
ALTER TABLE `wasterequest`
  ADD PRIMARY KEY (`Request_ID`),
  ADD KEY `Member_ID` (`Member_ID`),
  ADD KEY `AssignedWorker_ID` (`AssignedWorker_ID`),
  ADD KEY `LastAssignedWorker_ID` (`LastAssignedWorker_ID`);

--
-- Indexes for table `worker`
--
ALTER TABLE `worker`
  ADD PRIMARY KEY (`Worker_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `Admin_ID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `Feedback_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `notificationlog`
--
ALTER TABLE `notificationlog`
  MODIFY `Notification_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `wasterequest`
--
ALTER TABLE `wasterequest`
  MODIFY `Request_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`Member_ID`) REFERENCES `member` (`Member_ID`) ON DELETE CASCADE;

--
-- Constraints for table `member`
--
ALTER TABLE `member`
  ADD CONSTRAINT `member_ibfk_1` FOREIGN KEY (`Member_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE;

--
-- Constraints for table `notificationlog`
--
ALTER TABLE `notificationlog`
  ADD CONSTRAINT `notificationlog_ibfk_1` FOREIGN KEY (`Member_ID`) REFERENCES `member` (`Member_ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `notificationlog_ibfk_2` FOREIGN KEY (`Worker_ID`) REFERENCES `worker` (`Worker_ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `notificationlog_ibfk_3` FOREIGN KEY (`Request_ID`) REFERENCES `wasterequest` (`Request_ID`) ON DELETE SET NULL;

--
-- Constraints for table `wasterequest`
--
ALTER TABLE `wasterequest`
  ADD CONSTRAINT `wasterequest_ibfk_1` FOREIGN KEY (`Member_ID`) REFERENCES `member` (`Member_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `wasterequest_ibfk_2` FOREIGN KEY (`AssignedWorker_ID`) REFERENCES `worker` (`Worker_ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `wasterequest_ibfk_3` FOREIGN KEY (`LastAssignedWorker_ID`) REFERENCES `worker` (`Worker_ID`) ON DELETE SET NULL;

--
-- Constraints for table `worker`
--
ALTER TABLE `worker`
  ADD CONSTRAINT `worker_ibfk_1` FOREIGN KEY (`Worker_ID`) REFERENCES `user` (`User_ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
