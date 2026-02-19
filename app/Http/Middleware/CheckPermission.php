<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return  mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        
        if (!$user) {
            return $next($request);
        }

        // Obtener el permiso requerido desde la ruta
        $route = $request->route();
        info('permiso',["route"=>$route]);
       // 'accion'=>$route->getAction('permission')]);    

        $permission = $route->getAction('permission') ?? 'read';
        info("permission",["permission"=>$permission]);


        // Verificar si el usuario tiene el permiso requerido
        if (!$user->hasPermission($permission)) {
            return redirect()->route('dashboard')
                ->with('error', 'No tienes los permisos necesarios para realizar esta acción.');
        }

        return $next($request);
    }
}
