<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next,...$userRoles)
    {
        $user = Auth::user();
       
        
        
        if (!$user) {
            return $next($request);
        }

        // Verificar si la ruta actual requiere verificación de rol
        $currentRoute = $request->route()->getName();
     


      

        // Definir qué roles se requieren para cada ruta
        $routeRoles = config('routeRoles');

        
        // Verificar si la ruta actual requiere verificación de rol
        if (isset($routeRoles[$currentRoute])) {
            $requiredRoles = $routeRoles[$currentRoute];
             info('current route',['route'=>$currentRoute,
                            "roles:"=>$userRoles,
                            "configRoles" =>$requiredRoles] )  ;  
    
            
            if (!$user->hasAnyRole($requiredRoles)) {
                // Si el usuario no tiene los roles requeridos, redirigir con mensaje de error
                return redirect()->route('dashboard')
                    ->with('error', 'No tienes los permisos necesarios para acceder a esta página.');
            }
        }

        return $next($request);
    }
}
