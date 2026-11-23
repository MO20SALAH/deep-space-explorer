
import axios from "axios";

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";

const APOD_URL = "https://api.nasa.gov/planetary/apod";
const IMAGES_URL = "https://images-api.nasa.gov/search";

// صورة اليوم الفلكية
export async function getAPOD() {
  try {
    const response = await axios.get(APOD_URL, {
      params: {
        api_key: NASA_API_KEY,
      },
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    console.error("APOD Error:", error);

    throw new Error(
      error.response?.data?.msg ||
      "تعذر تحميل صورة اليوم الفلكية. حاول مرة أخرى."
    );
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
