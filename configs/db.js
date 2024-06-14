import mongoose from "mongoose";

const connectDatabase = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then((data) => {
      console.log(`MondoDB connected with server ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDatabase;
