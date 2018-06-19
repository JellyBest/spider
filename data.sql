CREATE TABLE IF NOT EXISTS `testA`(
    id INT AUTO_INCREMENT,
    code VARCHAR(6) NOT NULL,
    date DATE NOT NULL,
    op VARCHAR(8) NOT NULL,
    first FLOAT NOT NULL,
    last FLOAT NOT NULL,
    high FLOAT NOT NULL,
    low FLOAT NOT NULL,
    price FLOAT NOT NULL,
    roi FLOAT,
    PRIMARY KEY (id))ENGINE=Innodb DEFAULT CHARSET=utf8;