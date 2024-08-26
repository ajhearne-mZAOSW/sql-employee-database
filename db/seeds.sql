INSERT INTO department (name)
VALUES  
    ('Engineering'),
    ('Finance'),
    ('Sales'),
    ('Logistics'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES  
    ('Lead Engineer', 150000, 1),
    ('Software Engineer', 120000, 1),
    ('Senior Engineer', 100000, 1),
    ('Finance Manager', 150000, 2),
    ('Accountant', 125000, 2),
    ('Account Manager', 160000, 3),
    ('Sales Lead', 100000, 3),
    ('Salesperson', 80000, 3),
    ('Warehouse Manager', 100000, 4),
    ('Legal Team Lead', 250000, 5),
    ('Lawyer', 190000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  
    ('John', 'Doe',  1, NULL),
    ('Mike', 'Chan',  2, 1),
    ('Ashley', 'Rodriguez',  3, 1), 
    ('Kevin', 'Tupik',  4, 6), 
    ('Kumal', 'Sing',  5, 6),
    ('Malia', 'Brown',  6, NULL), 
    ('Sarah', 'Lourd',  7, 6), 
    ('Tom', 'Allen',  8, NULL),
    ('Jane', 'Doe',  9, 7), 
    ('Henry', 'Smith',  10, NULL), 
    ('Jessica', 'Lovell',  11, 10);