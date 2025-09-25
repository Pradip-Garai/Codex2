const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["youtube", "github", "course"],
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    title: {
      type: String, // YouTube
    },
    name: {
      type: String, // Github / Course
    },
    description: {
      type: String,
    },
    link: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, // Cloudinary secure_url
      default: null,
    },
    // Youtube
    channel: String,
    duration: String,
    // Github
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    // Course
    instructor: String,
    price: String,
    platform: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
