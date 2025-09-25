import React, { useState } from "react";
import axiosClient from "../../utils/axiosClient";

const RESOURCE_TYPES = [
  { value: "youtube", label: "YouTube" },
  { value: "github", label: "GitHub" },
  { value: "course", label: "Course" },
];

export default function AddResource() {
  const [type, setType] = useState("youtube");
  const [form, setForm] = useState({
    tag: "",
    title: "",
    name: "",
    description: "",
    link: "",
    channel: "",
    duration: "",
    stars: "",
    forks: "",
    instructor: "",
    price: "",
    platform: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setServerError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError(null);
    setSuccess(false);

    const data = new FormData();
    data.append("type", type);
    data.append("tag", form.tag);
    if (type === "youtube") {
      data.append("title", form.title);
      data.append("channel", form.channel);
      data.append("duration", form.duration);
      if (thumbnail) data.append("thumbnail", thumbnail);
    }
    if (type === "github") {
      data.append("name", form.name);
      data.append("stars", form.stars);
      data.append("forks", form.forks);
      data.append("description", form.description);
    }
    if (type === "course") {
      data.append("name", form.name);
      data.append("instructor", form.instructor);
      data.append("platform", form.platform);
      data.append("price", form.price);
      data.append("description", form.description);
    }
    data.append("link", form.link);

    try {
      await axiosClient.post(
        "/resource",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccess(true);
      setForm({
        tag: "", title: "", name: "", description: "", link: "",
        channel: "", duration: "", stars: "", forks: "",
        instructor: "", price: "", platform: "",
      });
      setThumbnail(null);
      setPreviewUrl(null);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Error uploading resource."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-black pt-12">
      <form
        className="w-full max-w-3xl bg-[#17181C] rounded-2xl shadow-xl border border-[#22232A] mx-4 p-10 md:p-14 flex flex-col gap-7"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-fuchsia-500 to-purple-400 mb-3 text-center leading-tight drop-shadow">
          Add Resource
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <div>
            <label className="block mb-2 text-blue-400 font-medium">Type</label>
            <select
              className="w-full bg-black text-gray-100 border border-[#23232c] rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 transition"
              name="type"
              value={type}
              onChange={handleTypeChange}
              required
            >
              {RESOURCE_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-blue-400 font-medium">Tag</label>
            <input
              type="text"
              name="tag"
              className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 transition"
              value={form.tag}
              onChange={handleChange}
              placeholder="e.g. algorithm, web, ds"
              required
            />
          </div>
          {type === "youtube" && (
            <>
              <div>
                <label className="block mb-2 text-blue-400 font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 transition"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Video Title"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-blue-400 font-medium">Channel</label>
                <input
                  type="text"
                  name="channel"
                  className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 transition"
                  value={form.channel}
                  onChange={handleChange}
                  placeholder="YouTube Channel"
                />
              </div>
              <div>
                <label className="block mb-2 text-blue-400 font-medium">Duration</label>
                <input
                  type="text"
                  name="duration"
                  className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 transition"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="Duration (e.g. 12:30)"
                />
              </div>
              <div>
                <label className="block mb-2 text-blue-400 font-medium">
                  Thumbnail <span className="text-red-400">*</span>
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  className="w-full bg-black text-gray-100 rounded-lg py-2 px-4 border border-[#23232c] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={handleFileChange}
                  required
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Thumbnail Preview"
                    className="mt-3 rounded-lg border border-gray-700 w-40 h-24 object-cover mx-auto shadow"
                  />
                )}
              </div>
            </>
          )}
          {type === "github" && (
            <>
              <div>
                <label className="block mb-2 text-green-400 font-medium">Repo Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-500 transition"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Repository Name"
                  required
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block mb-2 text-green-400 font-medium">Stars</label>
                  <input
                    type="number"
                    name="stars"
                    min="0"
                    className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-500 transition"
                    value={form.stars}
                    onChange={handleChange}
                    placeholder="Repo Stars"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 text-green-400 font-medium">Forks</label>
                  <input
                    type="number"
                    name="forks"
                    min="0"
                    className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-500 transition"
                    value={form.forks}
                    onChange={handleChange}
                    placeholder="Repo Forks"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-green-400 font-medium">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] resize-none focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-500 transition"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Repository Description"
                />
              </div>
            </>
          )}
          {type === "course" && (
            <>
              <div>
                <label className="block mb-2 text-yellow-400 font-medium">Course Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-500 transition"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Course Name"
                  required
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block mb-2 text-yellow-400 font-medium">Instructor</label>
                  <input
                    type="text"
                    name="instructor"
                    className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-500 transition"
                    value={form.instructor}
                    onChange={handleChange}
                    placeholder="Instructor Name"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 text-yellow-400 font-medium">Platform</label>
                  <input
                    type="text"
                    name="platform"
                    className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-500 transition"
                    value={form.platform}
                    onChange={handleChange}
                    placeholder="Platform (e.g. Udemy)"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-yellow-400 font-medium">Price</label>
                <input
                  type="text"
                  name="price"
                  className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-500 transition"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. Free, ₹1,200, $10"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-yellow-400 font-medium">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] resize-none focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-500 transition"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Course Description"
                />
              </div>
            </>
          )}
          <div className="md:col-span-2">
            <label className="block mb-2 text-blue-400 font-medium">Resource Link</label>
            <input
              type="url"
              name="link"
              className="w-full bg-black text-gray-100 rounded-lg py-3 px-4 border border-[#23232c] focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 transition"
              value={form.link}
              onChange={handleChange}
              placeholder="Paste full URL (https://...)"
              required
            />
          </div>
        </div>
        {serverError && (
          <div className="text-red-500 font-semibold text-center">{serverError}</div>
        )}
        {success && (
          <div className="text-green-400 font-semibold text-center">Resource added successfully!</div>
        )}
        <button
          type="submit"
          className={`mt-5 py-3 rounded-lg text-xl font-bold bg-blue-600 hover:bg-blue-700 transition text-white shadow-lg tracking-wide ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Resource"}
        </button>
      </form>
    </div>
  );
}
