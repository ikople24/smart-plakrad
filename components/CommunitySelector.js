// รายชื่อหมู่บ้านในตำบลปลักแรด (จาก CMU_PLAKRAD.geojson)
const communities = [
  "หมู่1-บ้านปลักแรด",
  "หมู่3-บ้านปลักแรด",
  "หมู่5-บ้านปลักแรด"
];

const CommunitySelector = ({ selected, onSelect = () => {}, error }) => (
  <div className="mb-4">
    <div className="flex py-2 gap-2">
      <label className="block text-sm font-medium text-gray-800 mb-1">1.เลือกหมู่บ้าน</label>
      {error && <div className="text-red-500 text-sm ml-auto">{error}</div>}
    </div>
    <div className="flex flex-wrap gap-2">
      {communities.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onSelect(c)}
          className={`btn btn-sm rounded-full px-4 py-2 text-base font-medium ${
            selected === c
              ? 'bg-orange-500 text-white border-none'
              : 'bg-white text-gray-900 hover:bg-orange-200 border-gray-300'
          } transition duration-200 min-w-[140px] max-w-full sm:w-auto`}
        >
          {c}
        </button>
      ))}
    </div>
  </div>
);

export default CommunitySelector;
