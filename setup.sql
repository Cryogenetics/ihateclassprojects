create database mechanic_db;
use mechanic_db;
CREATE TABLE customer
(
    customer_id INT PRIMARY KEY,
    phone       VARCHAR(20),
    firstname   VARCHAR(255),
    lastname    VARCHAR(255)
);

CREATE TABLE vehicle
(
    VIN         VARCHAR(255) PRIMARY KEY,
    customer_id INT,
    make        VARCHAR(255),
    model       VARCHAR(255),
    year        INT,
    FOREIGN KEY (customer_id) REFERENCES customer (customer_id)
);

CREATE TABLE shop
(
    shop_id   INT PRIMARY KEY,
    address   VARCHAR(255),
    phone     VARCHAR(20),
    shop_name VARCHAR(255)
);

CREATE TABLE mechanic
(
    employee_id INT PRIMARY KEY,
    shop_id     INT,
    firstname   VARCHAR(255),
    lastname    VARCHAR(255),
    phone       VARCHAR(20),
    specialty   VARCHAR(255),
    FOREIGN KEY (shop_id) REFERENCES shop (shop_id)
);

CREATE TABLE appointment
(
    appt_id            INT PRIMARY KEY,
    VIN                VARCHAR(255),
    mechanic_id        INT,
    shop_id            INT,
    scheduled_datetime DATETIME,
    status             VARCHAR(50),
    FOREIGN KEY (VIN) REFERENCES vehicle (VIN),
    FOREIGN KEY (mechanic_id) REFERENCES mechanic (employee_id),
    FOREIGN KEY (shop_id) REFERENCES shop (shop_id)
);


CREATE TABLE users
(
    username VARCHAR(255),
    password VARCHAR(255)

);
