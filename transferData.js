const mongoose = require("mongoose");

const oldDB =
  "mongodb+srv://adityasatapathy1127_db_user:V26HooPWPWrVY6jy@cluster0.6rwo4zd.mongodb.net/vtu?retryWrites=true&w=majority&appName=Cluster0";

const newDB =
  "mongodb+srv://vrindavanuniversity_db_user:h43QWMUT4GOPqD7J@cluster0.jtprnn5.mongodb.net/vtu?retryWrites=true&w=majority&appName=Cluster0";

const studentSchema = new mongoose.Schema({}, { strict: false });

async function transfer() {
  // OLD DB
  const oldConn = await mongoose.createConnection(oldDB).asPromise();
  const OldStudent = oldConn.model("students", studentSchema);

  const data = await OldStudent.find();

  console.log("Found:", data.length, "students");

  // NEW DB
  const newConn = await mongoose.createConnection(newDB).asPromise();
  const NewStudent = newConn.model("students", studentSchema);

  await NewStudent.insertMany(
    data.map((doc) => {
      const obj = doc.toObject();
      delete obj._id;
      delete obj.__v;
      return obj;
    })
  );

  console.log("Transfer Successful");

  process.exit();
}

transfer().catch(console.error);