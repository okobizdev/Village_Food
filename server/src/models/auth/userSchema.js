const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Userschema = new Schema(
  {
    userId: {
      type: String,
      // required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // unique: true,
    },
    phone: {
      type: String,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    roleRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
    },
    warehouseRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouse",
    },
    isFirstOrder: {
      type: Boolean,
      default: true,
    },
    orderPlaced: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
    },
    otpTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
Userschema.index({ email: 1 }, { unique: true, sparse: true });
Userschema.index({ phone: 1 }, { unique: true, sparse: true });
Userschema.index({ userId: 1 });
Userschema.index({ roleRef: 1 });
Userschema.index({ createdAt: -1 });

const UserSchema = mongoose.model("user", Userschema);

module.exports = { UserSchema };
