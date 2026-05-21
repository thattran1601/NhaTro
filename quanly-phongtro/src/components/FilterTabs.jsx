export default function FilterTabs({active, setActive}) {
    const tabs = [
        "ALL",
        "EMPTY",
        "RENTED",
        "MAINTAIN"
]
    return (
        <div className="bg-white rounded-4xl p-4 mt-14 gap-5 shadow-sm">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActive(tab)}
                    className={`px-8 py-4 rounded-2xl font-semibold transition-all
                         ${
                        active === tab
                            ? "bg-green-50 text-green-500"
                            : "text-gray-500"
                    }`}
                    >
                    {tab =="ALL"&& "TẤT CẢ"}
                    {tab =="RENTED"&& "ĐÃ THUÊ"}
                    {tab =="EMPTY"&& "TRỐNG"}
                    {tab =="MAINTAIN"&& "BẢO TRÌ"}
                </button>
            ))}
        </div>
    )
}