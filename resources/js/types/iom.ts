export type Department = {
    id: number;
    name: string;
    description?: string | null;
    documents_count?: number;
    user_mappings_count?: number;
    created_at?: string;
    updated_at?: string;
};

export type UserMapping = {
    id: number;
    user_id: string;
    name: string;
    role: 'Admin' | 'User' | 'Viewer';
    active: boolean;
    department_id: number;
    department?: Pick<Department, 'id' | 'name'>;
    created_at?: string;
    updated_at?: string;
};

export type IomFile = {
    id: string;
    original_name: string;
    mime_type: string;
    extension: string;
    size: number;
    size_label: string;
    created_at?: string;
};

export type IomDocument = {
    id: string;
    iom_number?: string | null;
    effective_date?: string | null;
    description: string;
    department_id: number;
    department?: Pick<Department, 'id' | 'name'>;
    uploader?: Pick<UserMapping, 'id' | 'user_id' | 'name'>;
    files?: IomFile[];
    files_count?: number;
    can?: {
        view: boolean;
        edit: boolean;
        delete: boolean;
        download: boolean;
        preview: boolean;
    };
    created_at?: string;
    updated_at?: string;
};

export type ActivityLog = {
    id: number;
    log_name: string;
    event?: string;
    description: string;
    module?: string;
    activity?: string;
    user_id?: string | null;
    user_name?: string | null;
    department?: string | null;
    model?: string | null;
    record_id?: string | number | null;
    old_values?: Record<string, unknown>;
    new_values?: Record<string, unknown>;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at?: string;
};

export type Paginated<T> = {
    data: T[];
    links?: { url: string | null; label: string; active: boolean }[];
    meta?: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
};

export type CurrentUser = {
    mapping_id: number;
    user_id: string;
    name: string;
    role: 'Admin' | 'User' | 'Viewer';
    is_admin: boolean;
    is_viewer: boolean;
    department: Pick<Department, 'id' | 'name'>;
};
