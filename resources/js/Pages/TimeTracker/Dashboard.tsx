import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import ActiveTimer from '@/Components/TimeTracker/ActiveTimer';
import ProjectCard from '@/Components/TimeTracker/ProjectCard';
import TodaySummary from '@/Components/TimeTracker/TodaySummary';
import StopTimerModal from '@/Components/TimeTracker/StopTimerModal';
import type { Project, ActiveTimer as ActiveTimerType, TimeEntry, PageProps } from '@/types';

interface DashboardProps extends PageProps {
    projects: Project[];
    activeTimer: ActiveTimerType | null;
    todayEntries: TimeEntry[];
}

export default function Dashboard({ projects, activeTimer: initialActiveTimer, todayEntries: initialTodayEntries }: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const [activeTimer, setActiveTimer] = useState<ActiveTimerType | null>(initialActiveTimer);
    const [todayEntries, setTodayEntries] = useState<TimeEntry[]>(initialTodayEntries);
    const [isStopModalOpen, setIsStopModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshData = () => {
        router.reload();
    };

    const handleTimerStart = async (projectId: number, categoryId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/time-tracker/timer/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({ project_id: projectId, category_id: categoryId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to start timer');
            }

            setActiveTimer(data.timer);
            refreshData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start timer');
            console.error('Start timer error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimerStop = () => {
        setIsStopModalOpen(true);
    };

    const handleStopConfirm = async (description: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/time-tracker/timer/stop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({ description }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to stop timer');
            }

            setActiveTimer(null);
            setTodayEntries([data.entry, ...todayEntries]);
            setIsStopModalOpen(false);
            refreshData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to stop timer');
            console.error('Stop timer error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimerPause = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/time-tracker/timer/pause', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to pause timer');
            }

            setActiveTimer(data.timer);
            refreshData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to pause timer');
            console.error('Pause timer error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimerResume = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/time-tracker/timer/resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to resume timer');
            }

            setActiveTimer(data.timer);
            refreshData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resume timer');
            console.error('Resume timer error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Time Tracker</h1>
                                <p className="text-sm text-gray-600">
                                    Welcome back, {auth.user?.name || auth.user?.email}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <a
                                    href="/time-tracker/reports"
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    View Reports
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

                    {/* Active Timer Section */}
                    {activeTimer && (
                        <ActiveTimer
                            timer={activeTimer}
                            onStop={handleTimerStop}
                            onPause={handleTimerPause}
                            onResume={handleTimerResume}
                            isLoading={isLoading}
                        />
                    )}

                    {/* Projects Grid */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Start Projects</h2>

                        {projects.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                <p className="text-gray-600 mb-4">
                                    No projects yet. Contact your admin to set up projects.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {projects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onCategoryClick={handleTimerStart}
                                        isActive={activeTimer?.project_id === project.id}
                                        activeCategoryId={activeTimer?.category_id}
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Today's Summary */}
                    <TodaySummary entries={todayEntries} />
                </main>

                {/* Stop Timer Modal */}
                <StopTimerModal
                    isOpen={isStopModalOpen}
                    onClose={() => setIsStopModalOpen(false)}
                    onConfirm={handleStopConfirm}
                    projectName={activeTimer?.project?.name}
                    categoryName={activeTimer?.category?.name}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
}
