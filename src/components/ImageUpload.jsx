"use client";

import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/utils/firebase";
import Image from "next/image";

const ImageUpload = ({
  handleGetImageUrl,
  clearImage,
  setClearImageTrigger,
}) => {
  const storage = getStorage(app);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleImageUpload = (event) => {
    setLoading(true);
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedFile(reader.result);
        setFileName(file.name);

        const name = new Date().getTime() + "_" + file.name;
        const storageRef = ref(storage, name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
            setUploadPercentage(progress);
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            setLoading(false);
            console.error("Upload failed: ", error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              setDownloadURL(downloadURL);
              handleGetImageUrl(downloadURL); // Pass URL to parent
              setLoading(false);
            });
          }
        );
      };

      reader.readAsDataURL(file);
    }
  };

  // Clear the selected image and state when category image is reset
  useEffect(() => {
    if (clearImage) {
      setSelectedFile(null);
      setFileName("");
      setUploadProgress(0);
      setDownloadURL(null);
      setClearImageTrigger(false); // Reset trigger after clearing
    }
  }, [clearImage, setClearImageTrigger]);

  return (
    <div className="w-full">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm ">
          <div role="status" className="flex flex-col items-center">
            <svg
              aria-hidden="true"
              className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-[#490a66]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <div className="mt-3 text-lg font-medium text-[#490a66]">
              Uploading... {uploadPercentage}%
            </div>
          </div>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {selectedFile && (
        <div>
          <Image src={selectedFile} alt={fileName} className="h-40 mt-3" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
