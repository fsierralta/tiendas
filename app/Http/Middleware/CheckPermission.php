<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return  mixed
     */
    public function handle(Request $request, Closure $next,$permission)
    {
        $user = Auth::user();
        
        if (!$user) {
            return $next($request);
        }

              

        // Verificar si el usuario tiene el permiso requerido
        if (!$user->hasPermission($permission)) {
         return   Inertia::render('error/errorPage',[
                'status'=>403,
                'message'=> "No tienes los permisos necesarios para realizar esta acción:{$permission}",
                'auth'=>Auth::user()

        ]);
           // abort(403,"No tienes los permisos necesarios para realizar esta acción:{$permission}");
        }
       
        return $next($request);
    }
}
