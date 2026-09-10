-- Sample seed data for local H2 development.

INSERT INTO orders (customer, product, amount, created_at) VALUES
    ('Alice',   'Laptop',    1299.99, '2024-01-15'),
    ('Bob',     'Monitor',    399.00, '2024-01-20'),
    ('Charlie', 'Keyboard',    89.00, '2024-02-03'),
    ('Alice',   'Webcam',      49.99, '2024-02-10'),
    ('Dave',    'Laptop',    1299.99, '2024-03-01');
