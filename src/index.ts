import dotenv from "dotenv";
import app from "./app";
import connectDB from "./db/index";

// dotenv.config({
//   path: "../.env",
// });

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

export default app;
