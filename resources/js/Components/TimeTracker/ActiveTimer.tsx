import { useState, useEffect } from 'react';
import type { ActiveTimer as ActiveTimerType } from '@/types';

interface ActiveTimerProps {
    timer: ActiveTimerType;
    onStop: () => void;
    onPause: () => void;
    onResume: () => void;
    isLoading?: boolean;
}

export default function ActiveTimer({
    timer,
    onStop,
    onPause,
    onResume,
    isLoading = false,
}: ActiveTimerProps) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const startTime = new Date(timer.started_at).getTime();
        const pausedDuration = (timer.paused_duration || 0) * 1000;

        const interval = setInterval(() => {
            if (timer.status === 'running') {
                const now = Date.now();
                const totalElapsed = Math.floor((now - startTime - pausedDuration) / 1000);
                setElapsed(totalElapsed);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const startedAt = new Date(timer.started_at);
    const isPaused = timer.status === 'paused';

    return (
        <div
            className={`mb-8 bg-white rounded-xl shadow-lg p-6 border-2 ${
                isPaused ? 'border-yellow-500' : 'border-green-500'
            }`}
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className={`w-3 h-3 rounded-full ${
                                isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'
                            }`}
                        />
                        <span
                            className={`text-sm font-medium ${
                                isPaused ? 'text-yellow-600' : 'text-green-600'
                            }`}
                        >
                            {isPaused ? 'PAUSED' : 'ACTIVE'}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {timer.project?.name || 'Unknown Project'}
                    </h3>
                    <p className="text-gray-600">
                        {timer.category?.code && `${timer.category.code} - `}
                        {timer.category?.name || 'General'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Started: {startedAt.toLocaleTimeString()}
                    </p>
                </div>

                <div className="text-center">
                    <div className="text-5xl font-mono font-bold text-gray-900 mb-4">
                        {formatTime(elapsed)}
                    </div>
                    <div className="flex gap-2 justify-center">
                        {timer.status === 'running' ? (
                            <button
                                onClick={onPause}
                                disabled={isLoading}
                                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Pause
                            </button>
                        ) : (
                            <button
                                onClick={onResume}
                                disabled={isLoading}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Resume
                            </button>
                        )}
                        <button
                            onClick={onStop}
                            disabled={isLoading}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Stop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
