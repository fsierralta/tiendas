<?php

namespace App\Http\Controllers;

use App\Models\LocaleUser;
use App\Models\User;
use App\Models\Locale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocaleUserController extends Controller
{
    public function index(Request $request)
    {
        $localeUsers = LocaleUser::with(['user', 'locale']);

        if ($request->has('search')) {
            $search = $request->search;
            $localeUsers = $localeUsers->where(function ($query) use ($search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%');
                })
                ->orWhereHas('locale', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
            });
        }

        $localeUsers = $localeUsers->paginate(10)->withQueryString();

        return Inertia::render('localeUsers/index', ['localeUsers' => $localeUsers]);
    }

    public function create()
    {
        $users = User::whereDoesntHave('localeUser')->get();
        $locales = Locale::get();

        return Inertia::render('localeUsers/create', [
            'users' => $users,
            'locales' => $locales
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_user' => 'required|exists:users,id|unique:locale_users,id_user',
            'id_locale' => 'required|exists:locales,id'//|unique:locale_users,id_locale',
        ]);

        // Check if assignment already exists
        $exists = LocaleUser::where('id_user', $validated['id_user'])
                              ->where('id_locale', $validated['id_locale'])
                              ->exists();

        if ($exists) {
            return redirect()->back()
                ->with('error', 'Esta asignación ya existe.');
        }

        LocaleUser::create($validated);

        return redirect()->route('localeUsers.index')
            ->with('success', 'Asignación creada exitosamente.');
    }

    public function edit(LocaleUser $localeUser)
    {
        $users = User::all();
        $locales = Locale::all();

        return Inertia::render('localeUsers/edit', [
            'localeUser' => $localeUser,
            'users' => $users,
            'locales' => $locales
        ]);
    }

    public function update(Request $request, LocaleUser $localeUser)
    {
        $validated = $request->validate([
            'id_user' => 'required|exists:users,id|unique:locale_users,id_user,' . $localeUser->id,
            'id_locale' => 'required|exists:locales,id|unique:locale_users,id_locale,' . $localeUser->id,
        ]);

        // Check if assignment already exists (excluding current record)
        $exists = LocaleUser::where('id_user', $validated['id_user'])
                              ->where('id_locale', $validated['id_locale'])
                              ->where('id', '!=', $localeUser->id)
                              ->exists();

        if ($exists) {
            return redirect()->back()
                ->with('error', 'Esta asignación ya existe.');
        }

        $localeUser->update($validated);

        return redirect()->route('localeUsers.index')
            ->with('success', 'Asignación actualizada exitosamente.');
    }

    public function destroy(LocaleUser $localeUser)
    {
        $localeUser->delete();

        return redirect()->route('localeUsers.index')
            ->with('success', 'Asignación eliminada exitosamente.');
    }
}
