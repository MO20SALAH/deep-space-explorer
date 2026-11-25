
import { useEffect, useState } from "react";
import { CalendarDays, Telescope } from "lucide-react";
import { FALLBACK_APOD, getAPOD } from "../../services/nasaApi";
import GlassCard from "./GlassCard";
import SkeletonLoader from "./SkeletonLoader";

export default function ApodCard() {
    const [apod, setApod] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function loadAPOD() {
            try {
                setLoading(true);
                const data = await getAPOD();

                if (active) {
                    setApod(
                        data && data.media_type === "image" && data.url
                            ? data
                            : FALLBACK_APOD
                    );
                }
            } catch {
                if (active) setApod(FALLBACK_APOD);
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

    const displayApod =
        apod && apod.media_type === "image" && apod.url ? apod : FALLBACK_APOD;

    return (
        <GlassCard className="overflow-hidden" dir="rtl">
            <div className="p-5 flex items-center gap-2">
                <Telescope className="text-sky-400" size={22} />

                <h2 className="text-white font-bold text-xl">
                    صورة اليوم الفلكية
                </h2>
            </div>

            <img
                src={displayApod.url}
                alt={displayApod.title}
                onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_APOD.url) {
                        e.currentTarget.src = FALLBACK_APOD.url;
                    }
                }}
                className="w-full h-64 object-cover"
            />

            <div className="p-5 space-y-3">
                <h3 className="text-white text-lg font-bold">
                    {displayApod.title}
                </h3>

                <p className="text-sky-400 text-sm flex items-center gap-2">
                    <CalendarDays size={16} />
                    {displayApod.date}
                </p>

                <p className="text-gray-300 text-sm leading-7">
                    {displayApod.explanation}
                </p>
            </div>
        </GlassCard>
    );
}
