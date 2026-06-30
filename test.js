const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://Kath:attendtrack@attendtrack.dt2vekz.mongodb.net/?appName=AttendTrack"
)
.then(() => {
  console.log("✅ Connected!");
  process.exit(0);
})
.catch((err) => {
  console.error(err);
  process.exit(1);
});