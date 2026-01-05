export interface User {
    id: number;
    name: string;
    email: string;
    company?: Company;
}

export interface Company {
    id: number;
    name: string;
    address?: string;
}

export interface Customer {
    id: number;
    name: string;
    email?: string;
}

export interface Project {
    id: number;
    name: string;
    color: string;
    department?: string;
    hourly_rate: number;
    status: 'active' | 'inactive';
    customer?: Customer;
    categories: Category[];
}

export interface Category {
    id: number;
    project_id: number;
    code: string;
    name: string;
    sort_order: number;
}

export interface TimeEntry {
    id: number;
    user_id: number;
    project_id: number;
    category_id: number;
    date: string;
    start_time: string;
    end_time?: string;
    duration_hours: number;
    hourly_rate: number;
    total_amount: number;
    description?: string;
    status: 'completed' | 'draft';
    project?: Project;
    category?: Category;
}

export interface ActiveTimer {
    id: number;
    user_id: number;
    project_id: number;
    category_id: number;
    started_at: string;
    paused_at?: string;
    paused_duration: number;
    status: 'running' | 'paused';
    project?: Project;
    category?: Category;
}

export interface PageProps {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}
