import type { TimeEntry } from '@/types';

interface TodaySummaryProps {
    entries: TimeEntry[];
}

export default function TodaySummary({ entries }: TodaySummaryProps) {
    const totalHours = entries.reduce((sum, entry) => sum + (entry.duration_hours || 0), 0);

    const projectSummary = entries.reduce(
        (acc: Record<string, { hours: number; color: string }>, entry) => {
            const projectName = entry.project?.name || 'Unknown';
            const categoryCode = entry.category?.code || '';
            const key = `${projectName} - ${categoryCode}`;

            if (!acc[key]) {
                acc[key] = {
                    hours: 0,
                    color: entry.project?.color || '#3B82F6',
                };
            }
            acc[key].hours += entry.duration_hours || 0;
            return acc;
        },
        {}
    );

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Summary</h2>

            {entries.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                    No time entries yet today. Start tracking!
                </p>
            ) : (
                <>
                    <div className="space-y-2 mb-4">
                        {Object.entries(projectSummary).map(([key, data]) => (
                            <div
                                key={key}
                                className="flex justify-between items-center py-2 border-b border-gray-100"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: data.color }}
                                    />
                                    <span className="text-gray-700">{key}</span>
                                </div>
                                <span className="font-semibold text-gray-900">
                                    {data.hours.toFixed(2)}h
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t-2 border-gray-200 flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-blue-600">
                            {totalHours.toFixed(2)}h
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
