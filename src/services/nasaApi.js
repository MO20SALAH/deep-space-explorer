
import axios from "axios";

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";

const APOD_URL = "https://api.nasa.gov/planetary/apod";
const IMAGES_URL = "https://images-api.nasa.gov/search";

export const FALLBACK_APOD = {
  title: "سديم الجبار (Orion Nebula) - لوحة كونية",
  date: new Date().toISOString().split("T")[0],
  explanation:
    "يُعد سديم الجبار (M42) واحداً من ألمع السدم وأقرب مناطق تشكل النجوم العملاقة إلى كوكب الأرض، حيث يبعد عنا حوالي 1344 سنة ضوئية ويحتضن آلاف النجوم الوليدة وسط سحب متوهجة من الغاز والغبار الكوني.",
  url: "https://images-assets.nasa.gov/image/PIA08653/PIA08653~medium.jpg",
  hdurl: "https://images-assets.nasa.gov/image/PIA08653/PIA08653~orig.jpg",
  media_type: "image",
  isFallback: true,
};

// صورة اليوم الفلكية
export async function getAPOD() {
  try {
    const response = await axios.get(APOD_URL, {
      params: {
        api_key: NASA_API_KEY,
      },
      timeout: 15000,
    });

    const data = response.data;

    if (!data || data.media_type !== "image" || !data.url) {
      return FALLBACK_APOD;
    }

    return data;
  } catch (error) {
    console.warn("APOD Fallback activated:", error?.message || error);
    return FALLBACK_APOD;
  }
}

// البحث عن صور الفضاء
export async function getSpaceImages(query = "Galaxy", page = 1) {
  try {
    const response = await axios.get(IMAGES_URL, {
      params: {
        q: query,
        media_type: "image",
        page,
        page_size: 24,
      },
      timeout: 20000,
    });

    const items = response.data.collection.items || [];

    return items
      .map((item) => {
        const data = item.data?.[0];
        const links = item.links || [];

        const image = links.find(
          (link) => link.render === "image"
        );

        return {
          id: data?.nasa_id,
          title: data?.title || "صورة فضائية",
          description:
            data?.description || "لا يوجد وصف متاح لهذه الصورة.",
          date: data?.date_created || "",
          image: image?.href,
          center: data?.center || "NASA",
        };
      })
      .filter((item) => item.image);
  } catch (error) {
    console.error("NASA Images Error:", error);

    throw new Error(
      "تعذر تحميل صور الفضاء. تحقق من اتصال الإنترنت وحاول مرة أخرى."
    );
  }
}
