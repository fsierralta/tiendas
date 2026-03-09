<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\LoginCodeMail;

class EnsureLoginCodeVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Don't apply to unauthenticated users or users already verified
        if (! $request->user() || $request->session()->get('login_code_verified')) {
            return $next($request);
        }

        // Exclude routes that should be accessible without code validation
        if ($request->routeIs('verify-login-code') || $request->routeIs('logout')) {
            return $next($request);
        }

        $user = $request->user();

        // If no code exists or it is expired, generate a new one
        if (! $user->login_code || ! $user->login_code_expires_at || $user->login_code_expires_at->isPast()) {
            $code = (string) random_int(100000, 999999);
            
            $user->forceFill([
                'login_code' => $code,
                'login_code_expires_at' => now()->addMinutes(3),
            ])->save();

            // Log the code for debugging/fallback
            Log::info("Login code for user {$user->email} is: {$code}");

            // Send to email (using the configured SMTP in .env)
            try {
                Mail::to($user->email)->send(new LoginCodeMail($code));
            } catch (\Exception $e) {
                Log::error("Failed to send login code email to {$user->email}: " . $e->getMessage());
            }
        }

        return redirect()->route('verify-login-code');
    }
}
