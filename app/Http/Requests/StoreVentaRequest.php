<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVentaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'id_cliente' => 'required|exists:clientes,id',
            'id_promotor' => 'nullable|exists:promotores,id',
            'id_tecnico' => 'nullable|exists:tecnicos,id',
            'descuento' => 'nullable|numeric|min:0',
            'productos' => 'required|array|min:1',
            'productos.*.id_producto' => 'required_with:productos|exists:productos,id',
            'productos.*.cantidad' => 'required_with:productos|integer|min:1',
            'productos.*.monto_promotor' => 'nullable|numeric|min:0',
            'productos.*.precio_unitario' => 'nullable|numeric|min:0.01',
            'formas_pago' => 'required_with:productos|array|min:1',
            'formas_pago.*.forma_pago_id' => 'required_with:formas_pago|exists:formapagos,id',
            'formas_pago.*.monto' => 'required_with:formas_pago|numeric|min:0.01',
            'formas_pago.*.referencia' => 'nullable|string|max:100',
            'formas_pago.*.notas' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'id_cliente.required' => 'Debe seleccionar un cliente',
            'id_cliente.exists' => 'El cliente seleccionado no es válido',
            'id_promotor.exists' => 'El promotor seleccionado no es válido',
            'id_tecnico.exists' => 'El técnico seleccionado no es válido',
            'productos.required' => 'Debe agregar al menos un producto',
            'productos.min' => 'Debe agregar al menos un producto',
            'productos.*.id_producto.required' => 'Debe seleccionar un producto',
            'productos.*.id_producto.exists' => 'El producto seleccionado no es válido',
            'productos.*.cantidad.required' => 'Debe especificar la cantidad',
            'productos.*.cantidad.min' => 'La cantidad debe ser mayor a cero',
            'formas_pago.required' => 'Debe agregar al menos una forma de pago',
            'formas_pago.min' => 'Debe agregar al menos una forma de pago',
            'formas_pago.*.forma_pago_id.required' => 'Debe seleccionar una forma de pago',
            'formas_pago.*.forma_pago_id.exists' => 'La forma de pago seleccionada no es válida',
            'formas_pago.*.monto.required' => 'Debe especificar el monto',
            'formas_pago.*.monto.min' => 'El monto debe ser mayor a cero',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validar que si hay promotor, se especifique monto_promotor por producto (puede ser 0)
            if ($this->id_promotor && !$this->id_tecnico) {
                foreach ($this->productos as $index => $producto) {
                    if (!isset($producto['monto_promotor'])) {
                        $validator->errors()->add("productos.{$index}.monto_promotor", 'Debe especificar el monto del promotor para cada producto');
                    }
                }
            }

            // Validar que si hay técnico, se especifique precio_unitario por producto
            if ($this->id_tecnico) {
                foreach ($this->productos as $index => $producto) {
                    if (!isset($producto['precio_unitario']) || $producto['precio_unitario'] <= 0) {
                        $validator->errors()->add("productos.{$index}.precio_unitario", 'Debe especificar el precio unitario para cada producto');
                    }
                }
            }

            // Validar que si hay técnico y promotor, no se especifique monto_promotor (se calcula automáticamente)
            if ($this->id_tecnico && $this->id_promotor) {
                foreach ($this->productos as $index => $producto) {
                    if (isset($producto['monto_promotor']) && $producto['monto_promotor'] > 0) {
                        $validator->errors()->add("productos.{$index}.monto_promotor", 'Cuando hay técnico y promotor, el monto se calcula automáticamente (40-30-30)');
                    }
                }
            }

            // Validar que el monto del promotor no supere el precio del producto
            if ($this->id_promotor && !$this->id_tecnico) {
                foreach ($this->productos as $index => $productoData) {
                    if (isset($productoData['monto_promotor']) && isset($productoData['id_producto'])) {
                        $producto = \App\Models\Producto::find($productoData['id_producto']);
                        if ($producto && $productoData['monto_promotor'] > $producto->precio) {
                            $validator->errors()->add("productos.{$index}.monto_promotor", 
                                "El monto del promotor ({$productoData['monto_promotor']}) no puede superar el precio del producto ({$producto->precio})");
                        }
                    }
                }
            }
        });
    }
}
