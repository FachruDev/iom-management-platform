<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'log_name' => $this->log_name,
            'event' => $this->event,
            'description' => $this->description,
            'module' => $this->properties['module'] ?? $this->log_name,
            'activity' => $this->properties['activity'] ?? $this->event,
            'user_id' => $this->properties['user_id'] ?? null,
            'user_name' => $this->properties['user_name'] ?? null,
            'department' => $this->properties['department'] ?? null,
            'model' => $this->properties['model'] ?? null,
            'record_id' => $this->properties['record_id'] ?? null,
            'old_values' => $this->properties['old_values'] ?? [],
            'new_values' => $this->properties['new_values'] ?? [],
            'ip_address' => $this->properties['ip_address'] ?? null,
            'user_agent' => $this->properties['user_agent'] ?? null,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
