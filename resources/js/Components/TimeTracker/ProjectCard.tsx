import type { Project, Category } from '@/types';

interface ProjectCardProps {
    project: Project;
    onCategoryClick: (projectId: number, categoryId: number) => void;
    isActive: boolean;
    activeCategoryId?: number;
    disabled?: boolean;
}

export default function ProjectCard({
    project,
    onCategoryClick,
    isActive,
    activeCategoryId,
    disabled = false,
}: ProjectCardProps) {
    const borderColor = project.color || '#3B82F6';
    const sortedCategories = [...(project.categories || [])].sort(
        (a, b) => a.sort_order - b.sort_order
    );

    return (
        <div
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
                isActive ? 'ring-2 ring-green-500' : ''
            }`}
            style={{ borderTop: `4px solid ${borderColor}` }}
        >
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                {project.department && (
                    <p className="text-sm text-gray-600 mb-3">{project.department}</p>
                )}

                <div className="space-y-2">
                    {sortedCategories.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No categories</p>
                    ) : (
                        sortedCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => onCategoryClick(project.id, category.id)}
                                disabled={disabled}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                                    isActive && activeCategoryId === category.id
                                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <span className="font-semibold">{category.code}</span> -{' '}
                                {category.name}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
