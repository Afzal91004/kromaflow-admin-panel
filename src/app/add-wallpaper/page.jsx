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
        console.log("API Response:", response); // Check response structure
        setCategories(response?.data?.categories); // Correctly set categories
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
      <div className="py-2 rounded-lg text-white shadow-md bg-[#490a66] flex justify-between px-4 md:px-20">
        <h1 className="content-center">
          <Link href={"/"}>Logo</Link>
        </h1>
        <h1 className="text-lg font-semibold content-center">
          Create Wallpaper
        </h1>
        <div className="py-3">
          <Link
            href={"/add-category"}
            className="hidden md:block border border-l-2 border-b-2 border-t-0 border-r-0 p-3 shadow-md border-purple-700 shadow-purple-500"
          >
            Add Category
          </Link>
        </div>
      </div>
      <div className="py-3 flex justify-center gap-6">
        <Link
          href={"/add-category"}
          className="md:hidden border  p-3 shadow-md border-purple-700 hover:bg-purple-400 shadow-purple-500"
        >
          Add Category
        </Link>
      </div>
      <div className="flex justify-center">
        <div className="p-6 w-96 ">
          <ImageUpload
            handleGetImageUrl={handleGetImageUrl}
            clearImage={clearImageTrigger} // Pass the trigger to ImageUpload
            setClearImageTrigger={setClearImageTrigger} // Reset the trigger
          />
          <br />
          <input
            type="text"
            className="mb-4 w-full p-2 rounded border border-[#490a66]"
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
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>

          <br />
          <div className="flex justify-center">
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
        </div>
      </div>
    </main>
  );
}
