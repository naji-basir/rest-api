import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';
import logger from '../utils/logger';

// Defines the shape of user input (what we expect when creating a user)
interface UserInput {
  email: string;
  name: string;
  password: string;
}

// Extends UserInput with mongoose.Document to include MongoDB features
// Also adds timestamps and instance method typing
interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;

  // Instance method to compare passwords during login
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create schema with typing for strong TypeScript support
const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true }, // unique ensures no duplicate emails
    name: { type: String, required: true },
    password: { type: String, required: true }, // will be hashed before saving
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
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

  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));

  // Hash the plain password
  user.password = await bcrypt.hash(user.password, salt);
});

// Instance method: used during login to verify password
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    const user = this as UserDocument;

    // Compare raw password with hashed password in DB
    return await bcrypt.compare(candidatePassword, user.password);
  } catch (error) {
    logger.error(error);
    return false;
  }
};

// Create model from schema
const User = mongoose.model<UserDocument>('User', userSchema);

// Export model for use in controllers/services
export default User;
