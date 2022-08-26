const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: true,
  // SQLite only
  storage: 'database.sqlite',
  define: {
    timestamps: true,
  },
});

let Dummy = sequelize.define('dummy', {
  description: Sequelize.STRING,
});

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});



// Op.between (inclusive)
// async function getRows() {
//     let notes = await Note.findAll({ where: { id: { [Op.between]: [3, 6] } }});
//     notes.forEach(note => {
//         console.log(`${note.id}: ${note.description}`);
//     });
//     sequelize.close();
// }
// getRows();


// Op.IN operator
// async function getRows() {
//     // This selects all rows that match the list of ids
//     let notes = await Note.findAll({ where: { id: { [Op.in]: [3, 6] } } });
//     notes.forEach(note => {
//         console.log(`${note.id}: ${note.description}`);
//     });
//     sequelize.close();
// }
// getRows();


// order by
// async function getRows() {
//     let notes = await Note.findAll({
//         order: [['description', 'DESC']],
//         attributes: ['id', 'description'], raw: true
//     })
//     console.log(notes);
//     sequelize.close();
// }
// getRows();

// offset, limit
// async function getRows() {
//     let notes = await Note.findAll({ offset: 2, limit: 3, 
//         attributes: ['id', 'description'], raw: true
//     });
//     console.log(notes);
//     sequelize.close();
// }
// getRows();

// select columns
// async function getTwoColumns() {
//     let notes = await Note.findAll({ attributes: ['id', 'description'], raw: true });
//     console.log(notes);
//     sequelize.close();
// }
// getTwoColumns();



// findAll()
// async function findAllRows() {
//     let notes = await Note.findAll({ raw: true });
//     console.log(notes);
//     sequelize.close();
// }
// findAllRows();

// update row
// async function updateRow() {
//     let id = await Note.update(
//         { description: 'Finished reading history book' },
//         { where: { id: 1 } });
//     sequelize.close();
// }
// updateRow();

// delete row
// async function deleteRow() {
//     let n = await Note.destroy({ where: { id: 2 } });
//     console.log(`number of deleted rows: ${n}`);
//     sequelize.close();
// }
// deleteRow();

// count
// async function countRows() {
//     let n = await Note.count();
//     console.log(`There are ${n} rows`);
//     sequelize.close();
// }
// countRows();

//async, await
// async function getOneNote() {
//     let user = await Note.findOne();
//     console.log(user.get('description'));
//     sequelize.close();
// }
// getOneNote();

// findOne() method
// Note.findOne({ where: { id: 1 } }).then(note => {
//     console.log(note.get({ plain: true }));
// }).finally(() => {
//     sequelize.close();
// });


// findById DOESN'T WORK
// Note.findById(2).then((note) => {
//     console.log(note.get({ plain: true }));
//     console.log('********************')
//     console.log(`id: ${note.id}, description: ${note.description}`);
// }).finally(() => {
//     sequelize.close();
// });

// add to the notes
// const note = Note.build({ description: 'Took a cold bath' });
// note.save().then(() => {
//     console.log('new task saved');
// }).finally(() => {
//     sequelize.close();
// });

// let notes = [
//     { description: 'Tai chi in the morning' },
//     { description: 'Visited friend' },
//     { description: 'Went to cinema' },
//     { description: 'Listened to music' },
//     { description: 'Watched TV all day' },
//     { description: 'Walked for a hour' },
// ];

sequelize.sync({ force: true }).then(() => {
    Note.bulkCreate(notes, { validate: true }).then(() => {
        console.log('notes created');
    }).catch((err) => {
        console.log('failed to create notes');
        console.log(err);
    }).finally(() => {
        sequelize.close();
    });
});

// sequelize.sync({ force: true }).then(() => {
//   Dummy.create({ description: 'test 1' })
//     .then(() => {
//       console.log('table created');
//     })
//     .finally(() => {
//       sequelize.close();
//     });
// });

// Dummy.sync()
//   .then(() => {
//     console.log('New table created');
//   })
//   .finally(() => {
//     sequelize.close();
//   });

// Dummy.drop()
//   .then(() => {
//     console.log('table deleted');
//   })
//   .finally(() => {
//     sequelize.close();
//   });
