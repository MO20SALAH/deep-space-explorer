
import { useCallback, useMemo, useState } from "react";
import {
  X,
  Thermometer,
  Sun,
  Gauge,
  Moon,
  Orbit,
  Search,
  ArrowUpRight,
} from "lucide-react";

import GlassCard from "../components/ui/GlassCard";

const PLANET_FILTERS = [
  { label: "الكل", value: "all" },
  { label: "كواكب صخرية", value: "rocky" },
  { label: "عمالقة غازية", value: "gas" },
  { label: "عمالقة جليدية", value: "ice" },
];

const planets = [
  {
    id: 1,
    name: "عطارد",
    english: "Mercury",
    type: "rocky",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800",
    description: "أصغر كواكب المجموعة الشمسية وأقربها إلى الشمس.",
    distance: "57.9 مليون كم",
    temperature: "167°C تقريباً",
    gravity: "3.7 م/ث²",
    moons: "0",
    fact: "يستغرق عطارد 88 يوماً أرضياً لإكمال دورة واحدة حول الشمس.",
  },
  {
    id: 2,
    name: "الزهرة",
    english: "Venus",
    type: "rocky",
    image: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?w=800",
    description: "ثاني كواكب المجموعة الشمسية، ويتميز بغلاف جوي كثيف.",
    distance: "108.2 مليون كم",
    temperature: "465°C تقريباً",
    gravity: "8.87 م/ث²",
    moons: "0",
    fact: "الزهرة هو أكثر الكواكب حرارة بسبب تأثير الاحتباس الحراري الشديد.",
  },
  {
    id: 3,
    name: "الأرض",
    english: "Earth",
    type: "rocky",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800",
    description: "كوكبنا الجميل والوحيد المعروف حتى الآن بوجود الحياة عليه.",
    distance: "149.6 مليون كم",
    temperature: "15°C متوسطاً",
    gravity: "9.81 م/ث²",
    moons: "1",
    fact: "تغطي المحيطات حوالي 71% من سطح الأرض.",
  },
  {
    id: 4,
    name: "المريخ",
    english: "Mars",
    type: "rocky",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800",
    description: "الكوكب الأحمر، ويعد من أهم أهداف استكشاف الفضاء.",
    distance: "227.9 مليون كم",
    temperature: "-65°C متوسطاً",
    gravity: "3.71 م/ث²",
    moons: "2",
    fact: "يمتلك المريخ أعلى بركان معروف في المجموعة الشمسية، أوليمبوس مونس.",
  },
  {
    id: 5,
    name: "المشتري",
    english: "Jupiter",
    type: "gas",
    image: "https://images.unsplash.com/photo-1630839437035-dac17da580d0?w=800",
    description: "أكبر كواكب المجموعة الشمسية، وهو عملاق غازي.",
    distance: "778.6 مليون كم",
    temperature: "-110°C تقريباً",
    gravity: "24.79 م/ث²",
    moons: "101 مؤكدة تقريباً",
    fact: "توجد على المشتري عاصفة ضخمة تعرف بالبقعة الحمراء العظيمة.",
  },
  {
    id: 6,
    name: "زحل",
    english: "Saturn",
    type: "gas",
    image: "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?w=800",
    description: "عملاق غازي مشهور بحلقاته الجميلة المكونة من الجليد والصخور.",
    distance: "1.43 مليار كم",
    temperature: "-140°C تقريباً",
    gravity: "10.44 م/ث²",
    moons: "285 مؤكدة تقريباً",
    fact: "حلقات زحل الواسعة تجعله من أجمل الكواكب التي يمكن رصدها.",
  },
  {
    id: 7,
    name: "أورانوس",
    english: "Uranus",
    type: "ice",
    image: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?w=800",
    description: "عملاق جليدي يتميز بلونه الأزرق المائل إلى الأخضر.",
    distance: "2.87 مليار كم",
    temperature: "-195°C تقريباً",
    gravity: "8.69 م/ث²",
    moons: "29 مؤكدة تقريباً",
    fact: "يدور أورانوس على جانبه تقريباً مقارنة بمعظم الكواكب الأخرى.",
  },
  {
    id: 8,
    name: "نبتون",
    english: "Neptune",
    type: "ice",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800",
    description: "أبعد كواكب المجموعة الشمسية عن الشمس، ويتميز بلونه الأزرق.",
    distance: "4.50 مليار كم",
    temperature: "-200°C تقريباً",
    gravity: "11.15 م/ث²",
    moons: "16",
    fact: "تصل سرعة الرياح على نبتون إلى مستويات هائلة.",
  },
];

export default function Planets() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredPlanets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return planets.filter((planet) => {
      const matchesFilter =
        activeFilter === "all" || planet.type === activeFilter;
      if (!matchesFilter) return false;
      if (!query) return true;
      return (
        planet.name.toLowerCase().includes(query) ||
        planet.english.toLowerCase().includes(query) ||
        planet.description.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, activeFilter]);

  const handleSelectPlanet = useCallback((planet) => {
    setSelectedPlanet(planet);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPlanet(null);
  }, []);

  const handleFilterChange = useCallback((value) => {
    setActiveFilter(value);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <section className="min-h-screen px-4 py-12 md:px-10" dir="rtl">

      {/* Page Header */}
      <div className="text-center mb-10">
        <p className="text-sky-400 font-semibold mb-3">
          استكشف الكون
        </p>

        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          كواكب المجموعة الشمسية
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto leading-8">
          اكتشف عوالم مذهلة وتعرف على أسرار الكواكب الثمانية
          التي تدور حول شمسنا.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-3xl mx-auto mb-10 space-y-4">
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 focus-within:border-sky-400/50 transition">
          <Search className="text-sky-400 shrink-0" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="ابحث عن اسم الكوكب (مثل: المريخ، زحل، Mars)..."
            className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-500 min-w-0 py-2 text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="مسح البحث"
              className="text-gray-400 hover:text-white p-1 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {PLANET_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => handleFilterChange(filter.value)}
              className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeFilter === filter.value
                  ? "bg-sky-400/20 border-sky-400 text-sky-300 shadow-lg shadow-sky-500/10"
                  : "bg-white/5 border-white/10 text-gray-300 hover:border-sky-400/50 hover:text-sky-300"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Planets Grid */}
      {filteredPlanets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            لم يتم العثور على كواكب مطابقة لبحثك.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlanets.map((planet) => (
            <GlassCard
              key={planet.id}
              onClick={() => handleSelectPlanet(planet)}
              className="overflow-hidden cursor-pointer group"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={planet.image}
                  alt={planet.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <span className="absolute bottom-4 right-4 text-white text-2xl font-bold">
                  {planet.name}
                </span>
              </div>

              <div className="p-5">
                <p className="text-sky-400 text-xs mb-2">
                  {planet.english}
                </p>

                <p className="text-gray-300 text-sm leading-7 min-h-14">
                  {planet.description}
                </p>

                <div className="flex items-center justify-between mt-5">
                  <span className="text-sky-400 text-sm">
                    اكتشف الكوكب
                  </span>

                  <ArrowUpRight className="text-sky-400" size={19} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Planet Details Modal */}
      {selectedPlanet && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#0B0F19]/95 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-sky-500/10"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="relative h-64">
              <img
                src={selectedPlanet.image}
                alt={selectedPlanet.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent" />

              <button
                onClick={handleCloseModal}
                className="absolute top-4 left-4 bg-black/60 p-2 rounded-full text-white hover:bg-red-500 transition"
                aria-label="إغلاق"
              >
                <X size={22} />
              </button>

              <div className="absolute bottom-5 right-6">
                <h2 className="text-white text-3xl font-bold">
                  {selectedPlanet.name}
                </h2>

                <p className="text-sky-300">
                  {selectedPlanet.english}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">

              <p className="text-gray-300 leading-8">
                {selectedPlanet.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Fact
                  icon={<Sun />}
                  title="المسافة عن الشمس"
                  value={selectedPlanet.distance}
                />

                <Fact
                  icon={<Thermometer />}
                  title="درجة الحرارة"
                  value={selectedPlanet.temperature}
                />

                <Fact
                  icon={<Gauge />}
                  title="الجاذبية"
                  value={selectedPlanet.gravity}
                />

                <Fact
                  icon={<Moon />}
                  title="عدد الأقمار"
                  value={selectedPlanet.moons}
                />

              </div>

              <div className="bg-sky-400/10 border border-sky-400/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-sky-300 mb-3">
                  <Orbit size={20} />
                  <h3 className="font-bold">حقيقة علمية</h3>
                </div>

                <p className="text-gray-300 leading-8 text-sm">
                  {selectedPlanet.fact}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}

function Fact({ icon, title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 text-sky-400 mb-3">
        {icon}
        <span className="text-sm">{title}</span>
      </div>

      <p className="text-white font-bold">{value}</p>
    </div>
  );
}
