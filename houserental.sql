select * from house;
select * from rlikes;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
 
  `username` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `contact` varchar(10) not null,
   `address` varchar(255) NOT NULL,
  `pass` varchar(100) NOT NULL,
  `flag` int(11) ,
  `image` varchar(255) DEFAULT NULL,
  `feedback` int(11) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

insert  into `cust`(`username`,`gender`,`contact`,`email`,`pass`,`address`) values
 ('mp','male','98765432','mohit@gmail.com','pass','Indore');

 INSERT INTO `house` (`locality`,`category`,`bedroom`,`mobile`,`name`,`image`,`about`,`rent`,`facing`,`address`) VALUES ('vijaya nagar','house','3','9874563210','sumit','9874563210.jpg','huiikik',14000,'west','114-B sukhaliya'),
('annpurna','house','4','9632587410','mohit','9632587410.jpg','nbnjk',9000,'south','1887-A sudama nagar'),
('Rajwada','house','2','9893966770','mahi','9893966770.jpg','black',7000,'north','56,rajwada'),
('cloth market','house','5','9123654789','jayati','9123654789.jpg','mko',9000,'west','72,marothiya bazar'),
('Airport','flat','1','9513574560','harshit','9513574560.jpg','pink colo',8000,'east','divine elite ,564 vigyannagar');
