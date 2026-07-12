import "dotenv/config";
import { server } from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});