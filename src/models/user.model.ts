import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';
import logger from '../utils/logger';

// Defines the shape of user input (what we expect when creating a user)
export interface UserInput {
  email: string;
  name: string;
  password: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;

  // Instance method to compare passwords during login
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create schema with typing for strong TypeScript support
const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
// Pre-save middleware: runs BEFORE saving a document
userSchema.pre('save', async function () {
  const user = this as UserDocument;

  // checks if the password field has been changed since the document was loaded?
  if (!user.isModified('password')) {
    return;
    // If the password has NOT changed, then stop and do nothing
  }

  const hash = await bcrypt.hash(
    user.password,
    config.get<number>('saltWorkFactor'),
  );
  user.password = hash;
});

// Instance method: used during login to verify password
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    const user = this as UserDocument;

    return await bcrypt.compare(candidatePassword, user.password);
  } catch (error) {
    logger.error(error);
    return false;
  }
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
