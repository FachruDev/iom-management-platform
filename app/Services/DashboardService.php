<?php

namespace App\Services;

use App\Data\CurrentUserData;
use App\Models\Department;
use App\Models\IomDocument;
use App\Models\UserMapping;
use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\Models\Activity;

class DashboardService
{
    /**
     * @return array<string, mixed>
     */
    public function admin(): array
    {
        $today = now()->toDateString();

        return [
            'stats' => [
                'total_documents' => IomDocument::count(),
                'total_users' => UserMapping::count(),
                'total_departments' => Department::count(),
                'uploads_today' => IomDocument::whereDate('created_at', $today)->count(),
                'uploads_this_month' => IomDocument::whereYear('created_at', now()->year)->whereMonth('created_at', now()->month)->count(),
                'pdf_count' => $this->extensionCount(['pdf']),
                'word_count' => $this->extensionCount(['doc', 'docx']),
                'excel_count' => $this->extensionCount(['xls', 'xlsx']),
            ],
            'recent_uploads' => IomDocument::with(['department', 'uploader', 'files'])->latest()->limit(5)->get(),
            'recent_activities' => Activity::latest()->limit(10)->get(),
            'active_users' => Activity::query()
                ->select('properties->user_id as user_id', 'properties->user_name as user_name', DB::raw('count(*) as total'))
                ->whereNotNull('properties->user_id')
                ->groupBy('user_id', 'user_name')
                ->orderByDesc('total')
                ->limit(5)
                ->get(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function user(CurrentUserData $user): array
    {
        return [
            'stats' => [
                'my_documents' => IomDocument::where('uploaded_by_id', $user->mappingId)->count(),
            ],
            'recent_uploads' => IomDocument::with(['department', 'files'])
                ->where('uploaded_by_id', $user->mappingId)
                ->latest()
                ->limit(5)
                ->get(),
        ];
    }

    /**
     * @param  array<int, string>  $extensions
     */
    private function extensionCount(array $extensions): int
    {
        return IomDocument::whereHas('files', fn ($query) => $query->whereIn('extension', $extensions))->count();
    }
}
