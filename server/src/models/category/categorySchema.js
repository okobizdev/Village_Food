const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const Categoryschema = new Schema(
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
    imagePublicId: {
      type: String,
    },
    vectorImage: {
      type: String,
    },
    vectorImagePublicId: {
      type: String,
    },
    orderBy: {
      type: Number,
      default: null,
    },
    slug: {
      type: String,
    },
    landingPageStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to generate slug
Categoryschema.pre("save", function (next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const CategorySchema = mongoose.model("category", Categoryschema);

module.exports = { CategorySchema };
