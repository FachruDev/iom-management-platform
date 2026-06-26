<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\UserMappingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', fn (Request $request) => redirect()->route('dashboard', $request->only('user_id')))->name('home');

Route::middleware('egis.user')->group(function (): void {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::resource('documents', DocumentController::class);
    Route::get('/documents/{document}/files/{file}/download', [DocumentController::class, 'download'])
        ->name('documents.files.download');
    Route::delete('/documents/{document}/files/{file}', [DocumentController::class, 'destroyFile'])
        ->name('documents.files.destroy');

    Route::prefix('admin')->name('admin.')->group(function (): void {
        Route::resource('departments', DepartmentController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('user-mappings', UserMappingController::class)
            ->parameters(['user-mappings' => 'user_mapping'])
            ->only(['index', 'store', 'update', 'destroy']);
        Route::get('activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');
        Route::get('activity-log/{activity}', [ActivityLogController::class, 'show'])->name('activity-log.show');
    });
});
