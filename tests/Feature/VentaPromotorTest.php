<?php

use App\Models\User;
use App\Models\Producto;
use App\Models\Cliente;
use App\Models\Promotore;
use App\Models\Tecnico;
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
    $this->promotor = Promotore::factory()->create();
    $this->tecnico = Tecnico::factory()->create();
    
    // Crear productos de prueba
    $this->producto1 = Producto::factory()->create([
        'name' => 'Producto Test 1',
        'precio' => 12.00,
        'cantidad' => 10,
        'id_locale' => $this->locale->id,
        'id_categoria' => $this->categoria->id,
        'id_ubicacion' => $this->ubicacion->id,
    ]);
    
    $this->producto2 = Producto::factory()->create([
        'name' => 'Producto Test 2',
        'precio' => 10.00,
        'cantidad' => 5,
        'id_locale' => $this->locale->id,
        'id_categoria' => $this->categoria->id,
        'id_ubicacion' => $this->ubicacion->id,
    ]);
});

test('puede crear venta con promotor y monto por producto', function () {
    $response = $this->actingAs($this->user)
        ->post('/ventas', [
            'id_cliente' => $this->cliente->id,
            'id_promotor' => $this->promotor->id,
            'productos' => [
                [
                    'id_producto' => $this->producto1->id,
                    'cantidad' => 1,
                    'monto_promotor' => 2.00
                ],
                [
                    'id_producto' => $this->producto2->id,
                    'cantidad' => 1,
                    'monto_promotor' => 3.00
                ]
            ],
            'formas_pago' => [
                [
                    'forma_pago_id' => 1,
                    'monto' => 27.12, // (12+2 + 10+3) * 1.16 = 27.12
                    'referencia' => 'TEST-001'
                ]
            ]
        ]);

    // Depuración
    dd($response->status(), $response->getContent());
    
    $response->assertRedirect();
    
    // Verificar que se crearon los registros de venta
    $this->assertDatabaseHas('venta_cabezeras', [
        'id_cliente' => $this->cliente->id,
        'id_promotor' => $this->promotor->id,
    ]);

    // Verificar detalles de venta
    $this->assertDatabaseHas('ventas', [
        'id_producto' => $this->producto1->id,
        'cantidad' => 1,
        'precio_unitario' => 12.00,
        'monto_promotor' => 2.00,
        'precio_venta' => 14.00,
        'subtotal' => 14.00,
    ]);

    $this->assertDatabaseHas('ventas', [
        'id_producto' => $this->producto2->id,
        'cantidad' => 1,
        'precio_unitario' => 10.00,
        'monto_promotor' => 3.00,
        'precio_venta' => 13.00,
        'subtotal' => 13.00,
    ]);

    // Verificar registro del promotor
    $this->assertDatabaseHas('venta_promotores', [
        'id_promotor' => $this->promotor->id,
        'monto' => 5.00, // 2 + 3
    ]);
});

test('puede crear venta con tecnico y precio editable', function () {
    $response = $this->actingAs($this->user)
        ->post('/ventas', [
            'id_cliente' => $this->cliente->id,
            'id_tecnico' => $this->tecnico->id,
            'productos' => [
                [
                    'id_producto' => $this->producto1->id,
                    'cantidad' => 1,
                    'precio_unitario' => 60.00
                ]
            ],
            'formas_pago' => [
                [
                    'forma_pago_id' => 1,
                    'monto' => 69.60, // 60 * 1.16 = 69.60
                    'referencia' => 'TEST-002'
                ]
            ]
        ]);

    $response->assertRedirect();
    
    // Verificar detalles de venta
    $this->assertDatabaseHas('ventas', [
        'id_producto' => $this->producto1->id,
        'cantidad' => 1,
        'precio_unitario' => 60.00,
        'monto_promotor' => 0,
        'precio_venta' => 60.00,
        'subtotal' => 60.00,
    ]);

    // Verificar registro del técnico (60% del total)
    $this->assertDatabaseHas('venta_tecnicos', [
        'id_tecnico' => $this->tecnico->id,
        'monto' => 41.76, // 69.60 * 0.60
    ]);
});

test('no puede superar monto promotor del producto', function () {
    $response = $this->actingAs($this->user)
        ->post('/ventas', [
            'id_cliente' => $this->cliente->id,
            'id_promotor' => $this->promotor->id,
            'productos' => [
                [
                    'id_producto' => $this->producto1->id,
                    'cantidad' => 1,
                    'monto_promotor' => 15.00 // Mayor que el precio del producto (12.00)
                ]
            ],
            'formas_pago' => [
                [
                    'forma_pago_id' => 1,
                    'monto' => 27.12,
                    'referencia' => 'TEST-003'
                ]
            ]
        ]);

    $response->assertSessionHasErrors('productos.0.monto_promotor');
});

test('venta con tecnico y promotor aplica regla 40_30_30', function () {
    $response = $this->actingAs($this->user)
        ->post('/ventas', [
            'id_cliente' => $this->cliente->id,
            'id_tecnico' => $this->tecnico->id,
            'id_promotor' => $this->promotor->id,
            'productos' => [
                [
                    'id_producto' => $this->producto1->id,
                    'cantidad' => 1,
                    'precio_unitario' => 60.00
                ]
            ],
            'formas_pago' => [
                [
                    'forma_pago_id' => 1,
                    'monto' => 69.60, // 60 * 1.16 = 69.60
                    'referencia' => 'TEST-004'
                ]
            ]
        ]);

    $response->assertRedirect();
    
    // Verificar registro del técnico (40% del total)
    $this->assertDatabaseHas('venta_tecnicos', [
        'id_tecnico' => $this->tecnico->id,
        'monto' => 27.84, // 69.60 * 0.40
    ]);

    // Verificar registro del promotor (30% del total)
    $this->assertDatabaseHas('venta_promotores', [
        'id_promotor' => $this->promotor->id,
        'monto' => 20.88, // 69.60 * 0.30
    ]);
});
