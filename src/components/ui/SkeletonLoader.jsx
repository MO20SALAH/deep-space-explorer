
export default function SkeletonLoader({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse"
                >
                    <div className="h-52 bg-white/10" />

                    <div className="p-5 space-y-4">
                        <div className="h-5 w-2/3 bg-white/10 rounded" />

                        <div className="h-3 w-full bg-white/10 rounded" />

                        <div className="h-3 w-4/5 bg-white/10 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}
