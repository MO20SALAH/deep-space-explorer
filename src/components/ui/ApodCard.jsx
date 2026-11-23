
import { useEffect, useState } from "react";
import { CalendarDays, Telescope } from "lucide-react";
import { getAPOD } from "../../services/nasaApi";
import GlassCard from "./GlassCard";
import SkeletonLoader from "./SkeletonLoader";

export default function ApodCard() {
    const [apod, setApod] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadAPOD() {
            try {
                setLoading(true);
                setError("");

                const data = await getAPOD();

                if (active) setApod(data);
            } catch (err) {
                if (active) setError(err.message);
            } finally {
                if (active) setLoading(false);
            }
        }

        loadAPOD();

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return <SkeletonLoader count={1} />;
    }

    if (error) {
        return (
            <GlassCard className="p-6 text-center">
                <p className="text-red-300 mb-4">{error}</p>

                <button
                    onClick={() => window.location.reload()}
                    className="text-sky-400 hover:text-sky-300"
                >
                    إعادة المحاولة
                </button>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="overflow-hidden" dir="rtl">
            <div className="p-5 flex items-center gap-2">
                <Telescope className="text-sky-400" size={22} />

                <h2 className="text-white font-bold text-xl">
                    صورة اليوم الفلكية
                </h2>
            </div>

            {apod.media_type === "image" ? (
                <img
                    src={apod.url}
                    alt={apod.title}
                    className="w-full h-64 object-cover"
                />
            ) : (
                <iframe
                    src={apod.url}
                    title={apod.title}
                    className="w-full h-64"
                    allowFullScreen
                />
            )}

            <div className="p-5 space-y-3">
                <h3 className="text-white text-lg font-bold">
                    {apod.title}
                </h3>

                <p className="text-sky-400 text-sm flex items-center gap-2">
                    <CalendarDays size={16} />
                    {apod.date}
                </p>

                <p className="text-gray-300 text-sm leading-7">
                    {apod.explanation}
                </p>
            </div>
        </GlassCard>
    );
}
