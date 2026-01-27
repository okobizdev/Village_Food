const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const SubCategoryschema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    slug: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    landingPageStatus: {
      type: Boolean,
      default: false,
    },
    orderBy: {
      type: Number,
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    viewType: {
      type: String,
      enum: ["top", "middle", "lowerMiddle", "buttom"],
    },
  },
  { timestamps: true }
);

SubCategoryschema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const SubCategorySchema = mongoose.model("subCategory", SubCategoryschema);

module.exports = { SubCategorySchema };
