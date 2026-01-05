import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import TimeEntriesTable from '@/Components/TimeTracker/TimeEntriesTable';
import ReportSummary from '@/Components/TimeTracker/ReportSummary';
import DateRangeSelector from '@/Components/TimeTracker/DateRangeSelector';
import type { Project, TimeEntry, PageProps } from '@/types';

interface ReportsProps extends PageProps {
    projects: Project[];
}

export default function Reports({ projects }: ReportsProps) {
    const { auth } = usePage<PageProps>().props;
    const [entries, setEntries] = useState<TimeEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Date range state
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    // Filter state
    const [selectedProject, setSelectedProject] = useState<string>('all');

    // Modal state
    const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
    const [deletingEntry, setDeletingEntry] = useState<TimeEntry | null>(null);

    const fetchEntries = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                start_date: startDate,
                end_date: endDate,
                ...(selectedProject !== 'all' && { project_id: selectedProject }),
            });

            const response = await fetch(`/time-tracker/entries?${params}`, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch entries');
            }

            setEntries(data.entries || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch entries');
            console.error('Fetch entries error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [startDate, endDate, selectedProject]);

    const handleEdit = (entry: TimeEntry) => {
        setEditingEntry(entry);
    };

    const handleDelete = (entry: TimeEntry) => {
        setDeletingEntry(entry);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingEntry) return;

        try {
            const response = await fetch(`/time-tracker/entries/${deletingEntry.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete entry');
            }

            setDeletingEntry(null);
            fetchEntries();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete entry');
        }
    };

    const handleExportCSV = () => {
        if (entries.length === 0) return;

        const headers = ['Date', 'Start Time', 'End Time', 'Duration (h)', 'Project', 'Category', 'Description', 'Rate (CHF)', 'Total (CHF)'];

        const rows = entries.map((entry) => [
            entry.date,
            new Date(entry.start_time).toLocaleTimeString(),
            entry.end_time ? new Date(entry.end_time).toLocaleTimeString() : '',
            entry.duration_hours?.toFixed(2) || '0.00',
            entry.project?.name || '',
            entry.category ? `${entry.category.code} - ${entry.category.name}` : '',
            entry.description || '',
            entry.hourly_rate?.toFixed(2) || '0.00',
            entry.total_amount?.toFixed(2) || '0.00',
        ]);

        const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `time-report-${startDate}-to-${endDate}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Head title="Reports" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                                <p className="text-sm text-gray-600">View and manage your time entries</p>
                            </div>
                            <div className="flex gap-3">
                                <a
                                    href="/time-tracker"
                                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                                >
                                    &larr; Dashboard
                                </a>
                                <form action="/logout" method="post">
                                    <input type="hidden" name="_token" value={document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || ''} />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        Sign out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex justify-between items-center">
                            <span>{error}</span>
                            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                                &times;
                            </button>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <DateRangeSelector
                                startDate={startDate}
                                endDate={endDate}
                                onStartDateChange={setStartDate}
                                onEndDateChange={setEndDate}
                            />

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                                <select
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    <option value="all">All Projects</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={handleExportCSV}
                                    disabled={entries.length === 0}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Export CSV
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <ReportSummary entries={entries} />

                    {/* Time Entries Table */}
                    <TimeEntriesTable entries={entries} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
                </main>

                {/* Delete Confirmation */}
                {deletingEntry && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Entry</h2>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to delete this time entry? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeletingEntry(null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
