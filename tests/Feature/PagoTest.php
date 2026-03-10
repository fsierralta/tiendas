<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Formapago;
use App\Models\VentaPromotore;
use App\Models\Pago;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

use App\Models\Promotore;
use App\Models\Locale;

beforeEach(function () {
    $this->formapago = Formapago::firstOrCreate(['name' => 'Efectivo'], ['descripcion' => 'Pago en efectivo']);
    $this->roleJefe = Role::firstOrCreate(['name' => 'jefe'], [
        'display_name' => 'Jefe',
        'description' => 'Jefe Role',
    ]);
    
    $this->user = User::factory()->create();
    $this->user->roles()->attach($this->roleJefe);

    $this->userBasic = User::factory()->create();

    $promotor = Promotore::factory()->create();
    $locale = Locale::factory()->create();

    $this->venta = VentaPromotore::create([
        'id_promotor' => $promotor->id,
        'monto' => 100.00,
        'fecha_venta' => now(),
        'pagado' => 'N',
        'id_locale' => $locale->id,
    ]);
});

test('jefe can view pagos index', function () {
    $this->actingAs($this->user)
        ->withSession(['login_code_verified' => true])
        ->get('/pagos')
        ->assertStatus(200);
});

test('non-jefe cannot create pago', function () {
    $this->actingAs($this->userBasic)
        ->withSession(['login_code_verified' => true])
        ->post('/pagos', [
            'monto' => 50.00,
            'fecha' => now()->toDateString(),
            'formapago_id' => $this->formapago->id,
            'tipo_venta' => 'promotor',
            'venta_id' => $this->venta->id,
        ])
        ->assertStatus(403);
});

test('jefe can create pago and updates venta partial payment', function () {
    $response = $this->actingAs($this->user)
        ->withSession(['login_code_verified' => true])
        ->post('/pagos', [
            'monto' => 50.00,
            'fecha' => now()->toDateString(),
            'formapago_id' => $this->formapago->id,
            'tipo_venta' => 'promotor',
            'venta_id' => $this->venta->id,
            'observacion' => 'Partial payment',
        ]);

    $response->assertRedirect('/pagos');

    $this->assertDatabaseHas('pagos', [
        'monto' => 50.00,
        'observacion' => 'Partial payment',
        'venta_promotore_id' => $this->venta->id,
    ]);

    $this->venta->refresh();
    expect($this->venta->pagado)->toBe('N');
});

test('jefe can create pago and updates venta fully paid', function () {
    $response = $this->actingAs($this->user)
        ->withSession(['login_code_verified' => true])
        ->post('/pagos', [
            'monto' => 100.00,
            'fecha' => now()->toDateString(),
            'formapago_id' => $this->formapago->id,
            'tipo_venta' => 'promotor',
            'venta_id' => $this->venta->id,
        ]);

    $response->assertRedirect('/pagos');

    $this->venta->refresh();
    expect($this->venta->pagado)->toBe('S');
});
