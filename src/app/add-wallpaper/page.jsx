"use client";
import React, { useState, useEffect } from "react";
import ImageUpload from "@/components/ImageUpload";
import toast from "react-hot-toast";
import { api } from "@/utils/api";
import Link from "next/link";

export default function AddWallpaper() {
  const [wallpaper, setWallpaper] = useState({
    name: "",
    image: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clearImageTrigger, setClearImageTrigger] = useState(false); // Trigger to clear image

  // Fetch categories on component mount
  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        setCategories(response?.data?.category);
      } catch (error) {
        console.log("error: ", error);
        toast.error("Failed to load categories");
      }
    };
    getAllCategories();
  }, []);

  const handleGetImageUrl = (url) => {
    if (url) {
      setWallpaper((prev) => ({
        ...prev,
        image: url,
      }));
    }
  };

  const handleCreateWallpaper = async () => {
    if (!wallpaper.name || !wallpaper.image || !wallpaper.category) {
      toast.error("Please provide name, image, and category!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/api/wallpapers", wallpaper);
      console.log("response", response.data);

      // Clear inputs after success
      setWallpaper({ name: "", image: "", category: "" });
      setClearImageTrigger(true); // Trigger image reset
      toast.success("Wallpaper created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error creating wallpaper, try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="py-6 rounded-lg text-white shadow-md bg-[#490a66] flex justify-between px-20">
        <h1>Logo</h1>
        <h1 className="text-lg font-semibold">Create Wallpaper</h1>
        <Link
          href={"/add-category"}
          className="border border-l-2 border-b-2 border-t-0 border-r-0 p-3 shadow-md border-purple-700 shadow-purple-500"
        >
          Add Category
        </Link>
      </div>
      <div className="p-6">
        <ImageUpload
          handleGetImageUrl={handleGetImageUrl}
          clearImage={clearImageTrigger} // Pass the trigger to ImageUpload
          setClearImageTrigger={setClearImageTrigger} // Reset the trigger
        />
        <br />
        <input
          type="text"
          className="mb-4 p-2 rounded border border-[#490a66]"
          placeholder="Enter wallpaper name"
          value={wallpaper.name}
          onChange={(event) =>
            setWallpaper((prev) => ({
              ...prev,
              name: event.target.value,
            }))
          }
        />
        <br />
        <select
          className="mb-4 p-2 rounded border border-[#490a66] w-full"
          value={wallpaper.category}
          onChange={(event) => {
            setWallpaper((prev) => ({
              ...prev,
              category: event.target.value,
            }));
          }}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <br />
        <button
          onClick={handleCreateWallpaper}
          disabled={isSubmitting}
          className={`bg-[#490a66] p-2 mb-4 rounded text-white hover:bg-purple-500 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Creating..." : "Create Wallpaper"}
        </button>
      </div>
    </main>
  );
}
