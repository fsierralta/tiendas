<?php

use App\Models\User;
use App\Models\VentaCabezera;
use App\Models\Venta;
use App\Models\VentaFooter;
use App\Models\FormaPagoVenta;
use App\Models\Producto;
use App\Models\Cliente;
use App\Models\Locale;
use App\Models\Categoria;
use App\Models\Ubicacion;

beforeEach(function () {
    // Crear relaciones necesarias
    $this->locale = Locale::factory()->create();
    $this->categoria = Categoria::factory()->create();
    $this->ubicacion = Ubicacion::factory()->create([
        'id_locales' => $this->locale->id,
    ]);
    
    // Crear usuario
    $this->user = User::factory()->create();
    
    // Crear datos de prueba
    $this->cliente = Cliente::factory()->create();
    $this->producto = Producto::factory()->create([
        'name' => 'Producto Test',
        'precio' => 100.00,
        'cantidad' => 10,
        'id_locale' => $this->locale->id,
        'id_categoria' => $this->categoria->id,
        'id_ubicacion' => $this->ubicacion->id,
    ]);
    
    // Crear venta de prueba
    $this->ventaCabezera = VentaCabezera::factory()->create([
        'user_id' => $this->user->id,
        'id_cliente' => $this->cliente->id,
        'monto_total' => 116.00, // 100 + 16% IVA
    ]);
    
    // Crear detalle de venta
    $this->venta = Venta::factory()->create([
        'venta_cabezera_id' => $this->ventaCabezera->id,
        'id_producto' => $this->producto->id,
        'cantidad' => 1,
        'precio_unitario' => 100.00,
        'descripcion' => $this->producto->name,
    ]);
    
    // Crear footer de venta
    $this->ventaFooter = VentaFooter::factory()->create([
        'venta_cabezera_id' => $this->ventaCabezera->id,
        'subtotal' => 100.00,
        'iva' => 16.00,
        'descuento' => 0,
        'total' => 116.00,
    ]);
    
    // Descontar stock
    $this->producto->decrement('cantidad', 1);
});

test('puede eliminar una venta y restaura el stock', function () {
    // Verificar estado inicial
    expect($this->ventaCabezera)->exists()->toBeTrue();
    expect($this->venta)->exists()->toBeTrue();
    expect($this->ventaFooter)->exists()->toBeTrue();
    expect($this->producto->cantidad)->toBe(9); // 10 - 1
    
    // Simular usuario autenticado
    $this->actingAs($this->user);
    
    // Eliminar la venta
    $response = $this->delete("/ventas/{$this->ventaCabezera->id}");
    
    // Verificar redirección
    $response->assertRedirect('/ventas');
    
    // Verificar que la venta fue eliminada
    expect($this->ventaCabezera->fresh())->toBeNull();
    expect($this->venta->fresh())->toBeNull();
    expect($this->ventaFooter->fresh())->toBeNull();
    
    // Verificar que el stock fue restaurado
    expect($this->producto->fresh()->cantidad)->toBe(10); // 9 + 1 restaurado
});

test('no puede eliminar venta de otro usuario', function () {
    // Crear otro usuario
    $otroUsuario = User::factory()->create();
    
    // Simular usuario autenticado
    $this->actingAs($otroUsuario);
    
    // Intentar eliminar venta de otro usuario
    $response = $this->delete("/ventas/{$this->ventaCabezera->id}");
    
    // Verificar que devuelve 403
    $response->assertStatus(403);
    
    // Verificar que la venta no fue eliminada
    expect($this->ventaCabezera->fresh())->not->toBeNull();
});
