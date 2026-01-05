interface DateRangeSelectorProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

export default function DateRangeSelector({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}: DateRangeSelectorProps) {
    const setQuickRange = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);

        onStartDateChange(start.toISOString().split('T')[0]);
        onEndDateChange(end.toISOString().split('T')[0]);
    };

    const setThisMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        onStartDateChange(start.toISOString().split('T')[0]);
        onEndDateChange(end.toISOString().split('T')[0]);
    };

    const setLastMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);

        onStartDateChange(start.toISOString().split('T')[0]);
        onEndDateChange(end.toISOString().split('T')[0]);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>
            <div className="flex items-end gap-2">
                <button
                    onClick={() => setQuickRange(7)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                    7 Days
                </button>
                <button
                    onClick={() => setQuickRange(30)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                    30 Days
                </button>
                <button
                    onClick={setThisMonth}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                    This Month
                </button>
                <button
                    onClick={setLastMonth}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                    Last Month
                </button>
            </div>
        </div>
    );
}
