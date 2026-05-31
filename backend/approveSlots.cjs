const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://gokulakumar2005_db_user:Zc7rkvKaOj4fRq8F@cluster0.yhdo2fi.mongodb.net/mern-Rental-Parking').then(async () => {
  const result = await mongoose.connection.db.collection('slotmodels').updateMany({}, { $set: { approvalStatus: 'approved' } });
  console.log(result);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
