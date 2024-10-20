const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { reset } = require("nodemon");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must contain name"],
  },
  email: {
    type: String,
    unique: [true, "email must be unique"],
  },
  role: {
    type: String,
    enum: ["admin", "guest", "client"],
    default: "client",
  },
  active: {
    type: Boolean,
  },
  photo: String,
  password: {
    type: String,
    required: [true, "password must be unique"],
    minlength: [8, "must contain at least 8 chars"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "must confirm password"],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "password does not match",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew) return next()
        this.passwordChangedAt = Date.now()-1000
    next()
    
})
userSchema.methods.correctPassword = async function (candPass, userPass) {
  return await bcrypt.compare(candPass, userPass);
};
userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const timeChanged = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < timeChanged;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetToken = Date.now() +10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
