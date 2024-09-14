"use client";
import { api } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const [wallpapers, setWallpapers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Memoize the fetchWallpapers function
  const fetchWallpapers = useCallback(async () => {
    try {
      const response = await api.get("/api/wallpapers", {
        params: { page },
      });
      const newWallpapers = response?.data?.wallpapers || [];

      if (newWallpapers.length) {
        setWallpapers((prevWallpapers) => [
          ...prevWallpapers,
          ...newWallpapers,
        ]);
      }

      if (newWallpapers.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching wallpapers:", error);
    }
  }, [page]);

  useEffect(() => {
    fetchWallpapers();
  }, [fetchWallpapers]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <main>
      <div className="py-6 rounded-lg text-white shadow-md bg-[#490a66] flex justify-between px-20">
        <h1>Logo</h1>
        <h1 className="text-lg font-semibold">Create Wallpaper</h1>
        <div className="py-3">
          <Link
            href={"/add-category"}
            className="border border-l-2 border-b-2 border-t-0 border-r-0 p-3 shadow-md border-purple-700 shadow-purple-500"
          >
            Add Category
          </Link>
          <Link
            href="/add-wallpaper"
            className="border border-l-2 border-b-2 border-t-0 border-r-0 p-3 shadow-md border-purple-700 shadow-purple-500"
          >
            Upload New Wallpaper
          </Link>
        </div>
      </div>

      <div className="p-6 rounded-lg shadow-lg bg-white">
        <InfiniteScroll
          dataLength={wallpapers.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h1>Fetching fresh wallpapers for you...</h1>}
          endMessage={
            <p className="text-center font-bold">
              You&apos;ve reached the end!
            </p>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wallpapers.map((wallpaper) => (
              <div
                key={wallpaper._id}
                className="overflow-hidden rounded-lg shadow-lg"
              >
                <Image
                  alt="Wallpaper"
                  src={wallpaper.image}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </main>
  );
}
