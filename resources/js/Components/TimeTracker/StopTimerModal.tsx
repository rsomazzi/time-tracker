import { useState } from 'react';

interface StopTimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (description: string) => void;
    projectName?: string;
    categoryName?: string;
    isLoading?: boolean;
}

export default function StopTimerModal({
    isOpen,
    onClose,
    onConfirm,
    projectName,
    categoryName,
    isLoading = false,
}: StopTimerModalProps) {
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(description);
        setDescription('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Stop Timer</h2>
                <p className="text-gray-600 mb-4">
                    {projectName && categoryName
                        ? `${projectName} - ${categoryName}`
                        : 'Add a description for your time entry'}
                </p>

                <form onSubmit={handleSubmit}>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What did you work on? (optional)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        rows={4}
                    />

                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Stop & Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
