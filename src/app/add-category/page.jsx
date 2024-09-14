"use client";

import React, { useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import toast from "react-hot-toast";
import { api } from "@/utils/api";
import Link from "next/link";

function Page() {
  const [category, setCategory] = useState({
    name: "",
    image: "",
  });
  const [categories, setCategories] = useState([]); // Default to an empty array

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clearImageTrigger, setClearImageTrigger] = useState(false); // Trigger to clear image

  const handleGetImageUrl = (url) => {
    if (url) {
      setCategory((prev) => ({
        ...prev,
        image: url,
      }));
    }
  };

  const handleCreateCategory = async () => {
    if (!category.name || !category.image) {
      toast.error("Add a name and image!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/api/categories", category);
      console.log("response", response.data);

      // Clear inputs after success
      setCategory({ name: "", image: "" });
      setClearImageTrigger(true); // Trigger image reset
      toast.success("Category created!");
    } catch (error) {
      console.error(error);
      toast.error("Error, try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="py-6 rounded-lg text-white shadow-md bg-[#490a66] flex justify-between px-20">
        <h1>Logo</h1>
        <h1 className="text-lg font-semibold">Create Category</h1>
        <Link
          href={"/add-wallpaper"}
          className="border border-l-2 border-b-2 border-t-0 border-r-0 p-3 shadow-md border-purple-700 shadow-purple-500"
        >
          Add Wallpaper
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
            className="mb-4 p-2 w-full rounded border border-[#490a66]"
            placeholder="Enter category name"
            value={category.name}
            onChange={(event) =>
              setCategory((prevValue) => ({
                ...prevValue,
                name: event.target.value,
              }))
            }
          />
          <br />
          <div className="flex justify-center">
            <button
              onClick={handleCreateCategory}
              disabled={isSubmitting}
              className={`bg-[#490a66] p-2 mb-4 rounded text-white hover:bg-purple-500 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Category"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
