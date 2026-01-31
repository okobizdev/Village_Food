const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Bannerschema = new Schema(
  {
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
  },
  { timestamps: true }
);

const BannerSchema = mongoose.model("banner", Bannerschema);

module.exports = { BannerSchema };
