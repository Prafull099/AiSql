-- Sample schema for local H2 development.
-- Replace / extend this with your real tables.

CREATE TABLE IF NOT EXISTS orders (
    id         INT          PRIMARY KEY AUTO_INCREMENT,
    customer   VARCHAR(100) NOT NULL,
    product    VARCHAR(100) NOT NULL,
    amount     DECIMAL(10,2) NOT NULL,
    created_at DATE          NOT NULL
);
