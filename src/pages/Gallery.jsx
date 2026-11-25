
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Search,
  X,
  CalendarDays,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";

import { getSpaceImages } from "../services/nasaApi";
import GlassCard from "../components/ui/GlassCard";
import SkeletonLoader from "../components/ui/SkeletonLoader";

const categories = [
  { label: "الكل", value: "Space" },
  { label: "المريخ", value: "Mars" },
  { label: "المجرات", value: "Galaxy" },
  { label: "السدم", value: "Nebula" },
  { label: "رواد الفضاء", value: "Astronaut" },
];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Space");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [retry, setRetry] = useState(0);

  // جلب الصور من NASA مع AbortController لإلغاء الطلبات المعلقة عند الخروج
  useEffect(() => {
    const controller = new AbortController();

    async function loadImages() {
      try {
        setLoading(true);
        setError("");
        setImages([]);

        const query = appliedSearch.trim() || activeCategory;
        const data = await getSpaceImages(query, 1, controller.signal);

        if (!controller.signal.aborted) {
          setImages(data);
        }
      } catch (err) {
        if (
          controller.signal.aborted ||
          err?.name === "CanceledError" ||
          err?.name === "AbortError" ||
          err?.code === "ERR_CANCELED"
        ) {
          return;
        }
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      controller.abort();
    };
  }, [activeCategory, appliedSearch, retry]);

  // تثبيت نتائج البحث والفلترة وتنسيق التواريخ عبر useMemo
  const filteredImages = useMemo(() => {
    const seen = new Set();
    const localQuery = search.trim().toLowerCase();

    return images
      .filter((img) => {
        if (!img.id || seen.has(img.id)) return false;
        seen.add(img.id);
        if (!localQuery || localQuery === appliedSearch.trim().toLowerCase()) {
          return true;
        }
        return (
          img.title?.toLowerCase().includes(localQuery) ||
          img.description?.toLowerCase().includes(localQuery)
        );
      })
      .map((img) => ({
        ...img,
        formattedDate: img.date
          ? new Date(img.date).toLocaleDateString("ar")
          : "تاريخ غير متوفر",
      }));
  }, [images, search, appliedSearch]);

  // تنفيذ البحث
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      setAppliedSearch(search.trim());
    },
    [search]
  );

  // تغيير التصنيف
  const handleCategory = useCallback((value) => {
    setActiveCategory(value);
    setSearch("");
    setAppliedSearch("");
  }, []);

  const handleSelectImage = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleRetry = useCallback(() => {
    setRetry((prev) => prev + 1);
  }, []);

  return (
    <section
      className="min-h-screen px-4 py-12 md:px-10"
      dir="rtl"
    >

      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl bg-sky-400/10 border border-sky-400/20">
            <ImageIcon size={30} className="text-sky-400" />
          </div>
        </div>

        <p className="text-sky-400 font-semibold mb-3">
          أرشيف وكالة ناسا
        </p>

        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          معرض الفضاء
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto leading-8">
          استكشف صوراً مذهلة للكواكب والمجرات والنجوم
          من مكتبة وكالة ناسا الفضائية.
        </p>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="max-w-2xl mx-auto mb-8"
      >
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 focus-within:border-sky-400/50 transition">
          <Search className="text-sky-400 mr-2" size={22} />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن المريخ، المجرات، النجوم..."
            className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-500 min-w-0 py-3"
          />

          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-400 text-black font-bold px-5 py-3 rounded-xl transition"
          >
            بحث
          </button>
        </div>
      </form>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategory(category.value)}
            className={`
              px-5 py-2.5 rounded-xl border text-sm font-medium
              transition-all duration-300
              ${activeCategory === category.value && !appliedSearch
                ? "bg-sky-400/20 border-sky-400 text-sky-300 shadow-lg shadow-sky-500/10"
                : "bg-white/5 border-white/10 text-gray-300 hover:border-sky-400/50 hover:text-sky-300"
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <SkeletonLoader count={6} />
      )}

      {/* Error */}
      {!loading && error && (
        <GlassCard className="max-w-xl mx-auto p-8 text-center">
          <div className="flex justify-center mb-4">
            <ImageIcon size={40} className="text-red-400" />
          </div>

          <h2 className="text-white text-xl font-bold mb-3">
            تعذر تحميل الصور
          </h2>

          <p className="text-gray-400 mb-6 leading-7">
            {error}
          </p>

          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-black px-5 py-3 rounded-xl font-bold transition"
          >
            <RefreshCw size={18} />
            إعادة المحاولة
          </button>
        </GlassCard>
      )}

      {/* Empty State */}
      {!loading && !error && filteredImages.length === 0 && (
        <div className="text-center py-20">
          <ImageIcon
            size={45}
            className="text-gray-500 mx-auto mb-4"
          />

          <h3 className="text-white text-xl font-bold mb-2">
            لم نعثر على صور
          </h3>

          <p className="text-gray-400">
            جرب البحث باستخدام كلمة أخرى.
          </p>
        </div>
      )}

      {/* Images Grid */}
      {!loading && !error && filteredImages.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-5">
            <p className="text-gray-400 text-sm">
              تم العثور على {filteredImages.length} صورة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {filteredImages.map((image) => (
              <GlassCard
                key={image.id}
                onClick={() => handleSelectImage(image)}
                className="overflow-hidden cursor-pointer group"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={image.image}
                    alt={image.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-4 right-4 left-4">
                    <h3 className="text-white font-bold text-base line-clamp-2">
                      {image.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-400 text-sm leading-7 line-clamp-2">
                    {image.description}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-sky-400 text-xs">
                    <CalendarDays size={15} />
                    {image.formattedDate}
                  </div>
                </div>
              </GlassCard>
            ))}

          </div>
        </>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={handleCloseLightbox}
        >
          <button
            onClick={handleCloseLightbox}
            className="absolute top-5 left-5 bg-white/10 hover:bg-red-500 text-white p-3 rounded-full transition"
            aria-label="إغلاق الصورة"
          >
            <X size={25} />
          </button>

          <div
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full max-h-[65vh] object-contain rounded-2xl"
            />

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-4">
              <h2 className="text-white text-xl md:text-2xl font-bold mb-3">
                {selectedImage.title}
              </h2>

              <p className="text-gray-300 leading-8 text-sm">
                {selectedImage.description}
              </p>

              <div className="flex items-center gap-2 text-sky-400 text-sm mt-4">
                <CalendarDays size={17} />

                {selectedImage.formattedDate}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
