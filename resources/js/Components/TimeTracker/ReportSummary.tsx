import type { TimeEntry } from '@/types';

interface ReportSummaryProps {
    entries: TimeEntry[];
    currency?: string;
}

export default function ReportSummary({ entries, currency = 'CHF' }: ReportSummaryProps) {
    const totalHours = entries.reduce((sum, entry) => sum + (entry.duration_hours || 0), 0);
    const totalAmount = entries.reduce((sum, entry) => sum + (entry.total_amount || 0), 0);
    const avgRate = totalHours > 0 ? totalAmount / totalHours : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                <p className="text-3xl font-bold text-blue-600">{totalHours.toFixed(2)}h</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-green-600">
                    {currency} {totalAmount.toFixed(2)}
                </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
                <p className="text-sm text-gray-600 mb-1">Average Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                    {currency} {avgRate.toFixed(2)}/h
                </p>
            </div>
        </div>
    );
}
