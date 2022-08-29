const Sequelize = require('sequelize');
const { textSpanContainsPosition } = require('typescript');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
  define: {
    timestamps: true,
  },
});

// Test connection to sql database
(async function testConnection() {
  try {
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// let Employee = sequelize.define('employees', {
//   name: Sequelize.STRING,
// });

// let Project = sequelize.define('projects', {
//   name: Sequelize.STRING,
// });

// Employee.belongsTo(Project);

// Employee.findAll({ include: [Project] })
//   .then((employees) => {
//     employees.forEach((employee) => {
//       console.log(`${employee.name} is in project ${employee.project.name}`);
//     });
//   })
//   .finally(() => {
//     sequelize.close();
//   });

// let employees = [
//   { name: 'Jane Brown' },
//   { name: 'Lucia Benner' },
//   { name: 'Peter Novak' },
//   { name: 'Janet Peterson' },
//   { name: 'Lucy in the Sky' },
//   { name: 'Marabel Peach' },
//   { name: 'Ike Maldonado' },
//   { name: 'Lamponela Samonela' },
// ];

// sequelize
//   .sync({ force: true })
//   .then(() => {
//     // You can use an array of objects to bulk create in the database
//     return Employee.bulkCreate(employees);
//   })
//   .then((employees) => {
//     let works = [];
//     let i = 0;

//     employees.forEach((employee) => {
//       let pname = 'Project ' + String.fromCharCode('A'.charCodeAt() + i);
//       i++;

//       let work = Project.create({ name: pname }).then((project) => {
//         employee.setProject(project);
//       });

//       works.push(work);
//     });

//     Promise.all(works).then(() => sequelize.close());
//     console.log('finish');
//   });

