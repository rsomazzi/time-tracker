import type { TimeEntry } from '@/types';

interface TimeEntriesTableProps {
    entries: TimeEntry[];
    loading: boolean;
    onEdit: (entry: TimeEntry) => void;
    onDelete: (entry: TimeEntry) => void;
    currency?: string;
}

export default function TimeEntriesTable({
    entries,
    loading,
    onEdit,
    onDelete,
    currency = 'CHF',
}: TimeEntriesTableProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                <p className="mt-4 text-gray-600">Loading entries...</p>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600">No time entries found for the selected period.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Project
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {entries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(entry.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(entry.start_time).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    {' - '}
                                    {entry.end_time
                                        ? new Date(entry.end_time).toLocaleTimeString([], {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {entry.duration_hours?.toFixed(2) || '0.00'}h
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor: entry.project?.color || '#3B82F6',
                                            }}
                                        />
                                        {entry.project?.name || 'Unknown'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {entry.category
                                        ? `${entry.category.code} - ${entry.category.name}`
                                        : '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                    {entry.description || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {currency} {entry.hourly_rate?.toFixed(2) || '0.00'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {currency} {entry.total_amount?.toFixed(2) || '0.00'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onEdit(entry)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(entry)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
