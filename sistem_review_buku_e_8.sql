-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2025 at 12:47 PM
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
-- Database: `sistem_review_buku_e_8`
--

-- --------------------------------------------------------

--
-- Table structure for table `akun`
--

CREATE TABLE `akun` (
  `id` varchar(11) NOT NULL,
  `username` varchar(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(10) NOT NULL,
  `gambar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `akun`
--

INSERT INTO `akun` (`id`, `username`, `password`, `fullname`, `email`, `role`, `gambar`) VALUES
('1', 'saski', '12345678', 'saskia pippi', 'saskia@gmail.com', 'anggota', '-'),
('2', 'lia', '12345678', 'Gretelia Faustine', 'Lia@gmail.com', 'anggota', '-\r\n'),
('3', 'a', '$2y$10$OtgJ', 'a', 'a@a', 'anggota', '-'),
('4', 'asd', '$2y$10$gkU8', 'asd', 'asd@a', 'anggota', '-'),
('5', 'q', '$2y$10$/bs5', 'q', 'q@q', 'anggota', '-'),
('6', 'e', '$2y$10$K0H2GNrQWNENzO0X49kbqeU1td1kY96HoUe4kXNNXBq9kFlgSJvyW', 'e', 'e@e', 'anggota', '-');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` varchar(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `penulis` varchar(255) NOT NULL,
  `penerbit` varchar(255) NOT NULL,
  `tahun_terbit` int(10) NOT NULL,
  `komentar` text NOT NULL,
  `bintang` int(5) NOT NULL,
  `gambar` varchar(255) NOT NULL,
  `tanggal_komentar` varchar(255) NOT NULL,
  `id_akun` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id`, `judul`, `penulis`, `penerbit`, `tahun_terbit`, `komentar`, `bintang`, `gambar`, `tanggal_komentar`, `id_akun`) VALUES
('1', 'qwerty', 'qwerty', 'qwerty', 2009, 'g tau', 5, '-', '19 Dec 2005', '1'),
('2', 'buku 1 e', 'e', 'ew', 0, 'wefaf\n', 4, '-', '13 Dec 2025', '6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `akun`
--
ALTER TABLE `akun`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `fk_akun_id` FOREIGN KEY (`id_akun`) REFERENCES `akun` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
