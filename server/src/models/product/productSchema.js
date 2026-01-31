const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const Productschema = new Schema(
  {
    productId: { type: String },
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      enum: ["flat", "percent"],
    },
    discount: {
      type: Number,
    },
    discountAmount: {
      type: Number,
    },
    price: {
      type: Number,
    },
    mrpPrice: {
      type: Number,
    },
    thumbnailImage: {
      type: String,
      required: true,
    },
    optionalImages: {
      type: [String],
    },
    videoUrl: {
      type: String,
    },
    status: {
      type: String,
    },
    slug: {
      type: String,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    brandRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },
    mainInventory: {
      type: Number,
      // required: true,
    },
    inventoryType: {
      type: String,
      enum: [
        "colorInventory",
        "levelInventory",
        "colorLevelInventory",
        "inventory",
      ],
    },
    inventoryRef: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "inventory",
      },
    ],
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    subCategoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
    },
    childCategoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "childCategory",
    },
    priority: {
      type: Boolean,
      default: false,
    },
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalStockValue: { type: Number, default: 0 },

  },
  { timestamps: true }
);

Productschema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();

  const baseSlug = slugify(this.name, { lower: true });
  let slug = baseSlug;

  // Check if slug already exists
  let existing = await mongoose.models.product.findOne({ slug });

  let counter = 1;
  while (existing) {
    slug = `${baseSlug}-${counter}`;
    existing = await mongoose.models.product.findOne({ slug });
    counter++;
  }

  this.slug = slug;
  next();
});

// Add indexes for better query performance
// Note: 'name' already has a unique index from schema definition
// Note: 'slug' needs unique index for URL lookups
Productschema.index({ slug: 1 }, { unique: true });
Productschema.index({ categoryRef: 1 });
Productschema.index({ subCategoryRef: 1 });
Productschema.index({ childCategoryRef: 1 });
Productschema.index({ brandRef: 1 });
Productschema.index({ status: 1 });
Productschema.index({ priority: 1 });
Productschema.index({ createdAt: -1 });
Productschema.index({ price: 1 });
Productschema.index({ totalSales: -1 });

const ProductSchema = mongoose.model("product", Productschema);
module.exports = { ProductSchema };
