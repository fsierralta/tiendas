<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\View;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\JsonResponse)  $next
     */
    public function handle(Request $request, Closure $next): Response|JsonResponse
    {
        View::share('appearance', $request->cookie('appearance') ?? 'system');

        $response = $next($request);

        return $response;
    }
}
