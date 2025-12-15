-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 15, 2025 at 03:55 PM
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
-- Automatically creates and selects the database for subsequent operations.

CREATE DATABASE IF NOT EXISTS `sistem_review_buku_e_8` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `sistem_review_buku_e_8`;

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
('1', 'Lia', '$2y$10$AYGPc2KsVE7xpx.XEb6ru.DoY2HLzSEr1ot8/65uYBzhdP/1mWGeW', 'Lia', 'lia@gmail.com', 'anggota', '-'),
('2', 'Gracia', '$2y$10$v9vQ10AaDlHO3U3kjFyGDO0H03X8XKt53UxfVldfzkaOZkai/W9dS', 'Gracia', 'gracia@gmail.com', 'anggota', '-'),
('3', 'Velin', '$2y$10$H8Je4wSnKUTF7XgoCq8hcu257NPQnrbsO89Da430o9b16TOuGrgDi', 'Velin', 'velin@gmail.com', 'anggota', '-'),
('4', 'Shaski', '$2y$10$WZmRZ6IhCvCXLgQw6pxQ9OOEVxvSLXY1PmbSPB9GNMX.wEqwg4y.6', 'Shaski', 'shaski@gmail.com', 'anggota', '-'),
('5', 'Natan', '$2y$10$TG2YMj5Jv.buFqh5yI48sOP/insCzsAf4qmJ2Uto5y9w5y7WjG4PW', 'Natan', 'natan@gmail.com', 'anggota', '-');

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
('1', 'Percy Jackson & the Olympians #1: The Lightning Thief', 'Rick Riordan', 'Miramax Books', 2005, 'Jujur ya, buku ini tuh tipe bacaan yang bikin “eh kok udah habis aja?”. The Lightning Thief ngenalin kita ke Percy Jackson, anak SMP dengan ADHD dan disleksia yang hidupnya berantakan banget—dan ternyata itu semua ada alasannya: dia adalah anak dewa. Dari sini ceritanya langsung ngebut, penuh petualangan, monster, dewa-dewi Yunani, dan humor yang nggak maksa.\n\nYang aku suka, Rick Riordan tuh pinter banget bikin mitologi Yunani kerasa modern. Dewa-dewa bisa nongkrong di Amerika, monster muncul di mana-mana, dan semuanya tetap masuk akal di dunia Percy. Percy sendiri karakternya nyebelin tapi lovable—sarkastik, agak bandel, tapi setia dan peduli sama temen-temennya (Annabeth & Grover ❤️).\n\nBahasanya ringan, ngalir, dan gampang dibaca, tapi ceritanya tetap seru buat semua umur. Kalau kamu suka cerita petualangan, dunia fantasi, atau sekadar pengen bacaan fun tanpa mikir berat, ini pilihan aman banget. Minusnya cuma satu: setelah baca buku pertama, kemungkinan besar kamu bakal pengen lanjut ke seri berikutnya tanpa jeda.\n\nIntinya: seru, witty, dan bikin mitologi Yunani terasa hidup lagi. Cocok buat first-time fantasy reader maupun yang udah lama suka genre ini.', 4, '-', '13 Dec 2025', '1'),
('2', 'Percy Jackson & the Olympians #2: The Sea of Monsters', 'Rick Riordan', 'Disney Hyperion', 2006, 'Kalau buku pertama itu kayak pintu masuk ke dunia Percy, buku kedua ini rasanya kayak “oke, sekarang masalahnya naik level”. The Sea of Monsters lebih gelap, lebih chaotic, tapi tetap fun. Camp Half-Blood lagi kacau, pelindungnya rusak, dan Grover—iya, Grover—dalam bahaya. Jadi Percy mau nggak mau harus turun tangan lagi.\n\nYang kerasa banget di buku ini tuh perkembangan karakternya. Percy mulai nggak cuma jadi “anak yang kebetulan ketarik ke petualangan”, tapi udah mulai mikir, ragu, dan ngerasa insecure soal dirinya sendiri—apalagi dengan munculnya Tyson, yang jujur awalnya bikin aku bingung dan agak kesel, tapi lama-lama malah… duh, sayang 😭.\n\nPlot-nya lebih pendek dan lebih simpel dibanding buku pertama, tapi tetap padat. Monster lebih aneh, konflik lebih personal, dan hubungan antar karakter makin kerasa. Annabeth juga mulai keliatan sisi emosionalnya, nggak cuma si cewek pinter dingin doang.\n\nKalau mau jujur, buku ini bukan yang paling kuat di seri Percy Jackson, tapi penting banget buat ngebangun cerita ke depannya. Ini tipe buku “jembatan” yang bikin kamu ngerti kenapa hal-hal besar bakal terjadi nanti.\n\nKesimpulannya: tetap seru, tetap lucu, dan bikin kamu makin attached sama karakternya. Bukan yang paling mind-blowing, tapi jelas bukan skip. Cocok dibaca sambil rebahan sore-sore sambil mikir, “ya ampun, hidup Percy capek banget ya.”', 5, '-', '13 Dec 2025', '1'),
('3', 'The Hunger Games (Book 1)', 'Suzanne Collins', 'Scholastic Press', 2008, 'Membaca The Hunger Games di usia yang lebih dewasa rasanya beda. Kalau dulu fokusnya mungkin ke aksi dan romansa samar-samar, sekarang yang paling terasa justru sisi politik dan psikologisnya. Dunia Panem itu dingin, terkontrol, dan kejam dengan cara yang sangat sistematis. Dan Suzanne Collins menuliskannya tanpa perlu banyak dramatisasi.\n\nKatniss Everdeen bukan tokoh perempuan yang “disukai” dalam arti konvensional. Dia tertutup, pragmatis, dan sering kali emosionalnya tertahan. Tapi justru itu yang membuatnya terasa nyata. Keputusan-keputusannya bukan selalu yang paling heroik, melainkan yang paling masuk akal untuk bertahan hidup. Ada kelelahan mental yang konsisten sepanjang cerita, dan itu ditulis dengan sangat rapi.\n\nKonsep Hunger Games sendiri bekerja sebagai kritik sosial yang cukup tajam. Kekerasan dijadikan hiburan, penderitaan dipoles menjadi tontonan, dan empati dipaksa tunduk pada kekuasaan. Semua itu terasa relevan, bahkan agak tidak nyaman, karena kita sadar ini bukan cuma soal fiksi.\n\nRelasi Katniss dan Peeta juga menarik karena tidak disederhanakan menjadi kisah cinta remaja. Ada manipulasi media, survival instinct, dan kebingungan emosional yang bercampur jadi satu. Hubungan mereka terasa ambigu, dan itu justru kekuatannya.\n\nKesimpulannya, The Hunger Games adalah novel dystopian yang matang di balik label YA. Tegang, pahit, dan reflektif. Buku ini tidak berusaha membuat pembaca nyaman, dan itu pilihan yang tepat. Cocok dibaca bukan hanya untuk hiburan, tapi juga untuk merenung sebentar tentang kekuasaan, moralitas, dan harga dari bertahan hidup.', 4, '-', '15 Dec 2025', '2'),
('4', 'Harry Potter and the Chamber of Secrets (Harry Potter #2)', 'J.K. Rowling', 'Scholastic (US)', 1998, 'Buku kedua ini rasanya seperti fase “masa transisi”. Dunia sihirnya masih hangat dan familiar, tapi mulai diselipkan rasa gelap yang lebih serius. Chamber of Secrets bukan lagi sekadar anak-anak main sihir; ada ketakutan, prasangka darah, dan ancaman nyata yang bikin Hogwarts terasa kurang aman—dan itu menarik.\n\nHarry di sini masih impulsif dan keras kepala, tapi justru itu yang bikin ceritanya hidup. Kita mulai lihat bahwa dia bukan pahlawan sempurna, dan Rowling pelan-pelan membangun konflik identitas: tentang asal-usul, pilihan, dan bagaimana seseorang tidak ditentukan oleh label. Tema “pure-blood vs non–pure-blood” terasa sederhana di permukaan, tapi kalau dibaca dengan kepala dewasa, jelas ini alegori yang cukup tajam soal diskriminasi.\n\nYang paling menonjol buatku justru dinamika karakternya. Hermione mulai menunjukkan kecerdasan dan keberaniannya secara nyata, Ron tetap jadi jangkar emosional yang jujur, dan kemunculan Tom Riddle itu… unsettling dengan cara yang halus. Ini buku yang diam-diam menyiapkan fondasi untuk konflik besar di buku-buku selanjutnya.\n\nDari sisi tempo, ceritanya lebih rapi daripada buku pertama, meski beberapa bagian terasa agak panjang. Tapi klimaksnya memuaskan dan konsekuensinya kerasa—nggak semua hal kembali “normal” begitu saja, dan itu poin plus.\n\nKesimpulannya: Chamber of Secrets bukan yang paling ikonik di seri Harry Potter, tapi penting dan matang. Ini buku yang mungkin dulu terasa “seru”, tapi sekarang terasa “bermakna”. Cocok dibaca ulang kalau kamu ingin melihat bagaimana kisah ini mulai beranjak dari dongeng anak-anak menuju cerita yang lebih kompleks dan gelap.', 3, '-', '15 Dec 2025', '3'),
('5', 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe', 'C.S. Lewis', 'HarperCollins', 1950, 'Ceritanya mengikuti empat anak Pevensie yang masuk ke dunia Narnia lewat lemari pakaian. Dunia ini dingin, tertekan, dan penuh ketakutan karena White Witch. Lalu muncul Aslan, sosok simbol harapan, pengorbanan, dan keadilan. Nggak subtil. Bahkan sangat tidak subtil. Dan jujur aja, itu bisa jadi kekuatan sekaligus kelemahannya.\n\nSebagai pembaca dewasa, aku ngerasa Narnia itu kayak dongeng moral yang ditulis dengan hati tenang. Nggak ribet, nggak sinis, nggak abu-abu. Baik ya baik, jahat ya jahat. Di satu sisi, ini terasa naif dibanding fantasy modern. Tapi di sisi lain, justru itu yang bikin hangat. Kayak cerita sebelum tidur yang nggak berisik tapi tetap punya makna.\n\nKarakter-karakternya nggak sedalam Percy Jackson atau Katniss, tapi mereka berfungsi. Lucy polos dan penuh iman, Edmund menyebalkan tapi manusiawi, Susan dan Peter jadi figur tanggung jawab. Semuanya terasa seperti potongan fase tumbuh dewasa.\n\nKalau kamu nyari fantasy yang kompleks, politis, atau emosional berat—Narnia mungkin terasa terlalu ringan. Tapi kalau kamu pengen cerita yang jujur, simbolis, dan punya rasa klasik yang menenangkan, ini tetap layak dibaca, bahkan (atau justru terutama) saat kamu sudah dewasa.\n\nKesimpulannya: Narnia bukan buku yang bikin kamu kagum karena kerumitan, tapi buku yang bikin kamu diam sebentar dan ingat gimana rasanya percaya pada sesuatu yang baik.', 4, '-', '15 Dec 2025', '4'),
('6', 'HTML and CSS: Design and Build Websites', 'Jon Duckett', 'Wiley', 2011, 'no tears left to cry...', 1, '-', '15 Dec 2025', '5');

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_akun_id` (`id_akun`);

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