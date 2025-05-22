import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    authType: {
      type: String,
      required: true,
      enum: ["google", "github", "email"],
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, required: true },
  },
  { timestamps: true }
);

// hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// hash password before updating
UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (!update || !(update as mongoose.UpdateQuery<any>).password) {
    return next();
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  (update as mongoose.UpdateQuery<any>).password = await bcrypt.hash(
    (update as mongoose.UpdateQuery<any>).password,
    salt
  );
  this.setUpdate(update);
  (update as mongoose.UpdateQuery<any>).password = await bcrypt.hash(
    (update as mongoose.UpdateQuery<any>).password,
    salt
  );
  next();
});

// create method to compare password
UserSchema.methods.isPasswordCorrect = async function (
  enteredPassword: IUser["password"]
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// create method to generate refresh token
UserSchema.methods.generateRefreshToken = async function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const refreshToken = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY
      ? parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY, 10)
      : undefined,
  });
  return refreshToken;
};

// create method to generate access token
UserSchema.methods.generateAccessToken = async function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const accessToken = jwt.sign(
    { id: this._id, email: this.email, fullName: this.fullName },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY
        ? parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY, 10)
        : undefined,
    }
  );
  return accessToken;
};

export const User = mongoose.model<IUser>("User", UserSchema);
