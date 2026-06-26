<?php

use App\Enums\ActivityModule;
use App\Enums\ActivityType;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ValidateUser;
use App\Services\ActivityLogService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'egis.user' => ValidateUser::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (AuthorizationException $exception, Request $request) {
            app(ActivityLogService::class)->record(
                ActivityModule::Authentication,
                ActivityType::Forbidden,
                extra: ['path' => $request->path()],
                request: $request,
            );

            return null;
        });

        $exceptions->respond(function (Response $response) {
            $request = app(Request::class);

            if ($request->is('api/*') || ! in_array($response->getStatusCode(), [401, 403, 404, 500], true)) {
                return $response;
            }

            return Inertia::render('errors/'.$response->getStatusCode())
                ->toResponse($request)
                ->setStatusCode($response->getStatusCode());
        });
    })->create();
