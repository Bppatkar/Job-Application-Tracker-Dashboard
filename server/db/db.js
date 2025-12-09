import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGOURI)
      .then(() => console.log('Database connected Successfully'))
      .catch(() => {
        console.error('Database connection error');
      });
  } catch (error) {
    console.error('Error in Database Connection', error.message);
    process.exit(1);
  }
};

export default connectDB;
