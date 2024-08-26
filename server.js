const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool(
    {
        user: 'postgres',
        password: 'password',
        host: 'localhost',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

pool.connect();

function prompt() {
    inquirer.prompt([
    {
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee']
    }
    ]).then((response) => {
    // Beginning with the database so that we may acquire the departments for the choice
        if (response.selection === 'View All Departments') {
            pool.query(`SELECT * FROM department`, (err, {rows}) => {
                if (err) {
                    console.log(err);
                }
                console.log("\n Viewing All Departments: ");
                console.table(rows);
                prompt();
            });
        } else if (response.selection === 'View All Roles') {
            pool.query(`
                SELECT
                    role.id,
                    role.title,
                    role.salary,
                    department.name AS department
                FROM role
                JOIN department ON role.department_id = department.id
                `, (err, {rows}) => {
                if (err) {
                    console.log(err);
                }
                console.log("\n Viewing All Roles: ");
                console.table(rows);
                prompt();
            });
        } else if (response.selection === 'View All Employees') {
            pool.query(`
                SELECT
                    employee.id,
                    employee.first_name,
                    employee.last_name,
                    role.title AS title,
                    department.name AS department,
                    role.salary AS salary,
                    CASE WHEN employee.manager_id IS NOT NULL THEN CONCAT(manager_table.first_name,' ', manager_table.last_name) ELSE NULL END AS manager
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                JOIN employee manager_table ON employee.manager_id = manager_table.id
                `, (err, {rows}) => {
                if (err) {
                    console.log(err);
                }
                console.log("\n Viewing All Employees: ");
                console.table(rows);
                prompt();
            });
        } else if (response.selection === 'Add A Department') {
            inquirer.prompt([{
                // Adding a Department
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
            }]).then((response) => {
                pool.query(`INSERT INTO department (name) VALUES ($1)`, [response.department], (err) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log(`Added ${response.department} to the database.`)
                    prompt();
                });
            })
        } else if (response.selection === 'Add A Role') {
            pool.query(`SELECT * FROM department`, (err, {rows}) => {
                if (err) {
                    console.log(err);
                }
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the role?',
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role?',
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: () => {
                            const departments = [];
                            for (i = 0; i < rows.length; i++) {
                                departments.push(rows[i].name);
                            }
                            return departments;
                        }
                    }
                ]).then((response) => {
                    // Comparing the result and storing it into the variable
                    for (i = 0; i < rows.length; i++) {
                        if (rows[i].name === response.department) {
                            department = rows[i];
                        }
                    }

                    pool.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`, [response.role, response.salary, department.id], (err) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log(`Added ${response.role} to the database.`)
                        prompt();
                    });
                })
            });
        } else if (response.selection === 'Add An Employee') {
            pool.query(`SELECT * FROM role`, (err, {rows}) => {
                if (err) {
                    console.log(err);
                }

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'first',
                        message: 'What is the employees first name?',
                    },
                    {
                        type: 'input',
                        name: 'last',
                        message: 'What is the employees last name?',
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: () => {
                            const roles = [];
                            for (i = 0; i < rows.length; i++) {
                                roles.push(rows[i].title);
                            }
                            return roles;
                        }
                    },
                    {
                        type: 'input',
                        name: 'manager',
                        message: 'Who is the employees manager?',
                    }
                ]).then((response) => {
                    for (i = 0; i < rows.length; i++) {
                        if (rows[i].title === response.role) {
                            role = rows[i];
                        }
                    }

                    pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [response.first, response.last, role.id, response.manager], (err) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log(`Added ${response.first} ${response.last} to the database.`)
                        prompt();
                    });
                })
            });
        } 
    }       
)};

prompt();