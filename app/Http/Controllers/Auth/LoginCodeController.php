<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class LoginCodeController extends Controller
{
    /**
     * Show the login code verification view.
     */
    public function show(Request $request)
    {
        // If they don't have a code generated or they are already verified, redirect appropriately
        if ($request->session()->get('login_code_verified')) {
            return redirect()->intended(config('fortify.home', '/dashboard'));
        }

        return Inertia::render('auth/verify-login-code');
    }

    /**
     * Verify the provided login code.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();

        // Check if the code is correct and not expired
        if (
            ! $user->login_code || 
            ! $user->login_code_expires_at || 
            $user->login_code_expires_at->isPast() ||
            $user->login_code !== $request->code
        ) {
            throw ValidationException::withMessages([
                'code' => __('The provided code is invalid or has expired.'),
            ]);
        }

        // Code is valid
        // Clear the code from the user
        $user->forceFill([
            'login_code' => null,
            'login_code_expires_at' => null,
        ])->save();

        // Mark the session as verified
        $request->session()->put('login_code_verified', true);
        $request->session()->regenerate();

        return redirect()->intended(config('fortify.home', '/dashboard'));
    }
}
