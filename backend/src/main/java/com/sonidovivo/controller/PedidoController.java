package com.sonidovivo.controller;

import com.sonidovivo.dto.EstadoPedidoRequest;
import com.sonidovivo.model.Pedido;
import com.sonidovivo.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos y Checkout", description = "Gestión de órdenes de compra y cambios de estado")
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    @Operation(summary = "Listar todos los pedidos (Solo Administrador y Vendedor)")
    public ResponseEntity<List<Pedido>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar pedido por ID")
    public ResponseEntity<?> buscarPorId(@PathVariable String id) {
        return pedidoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear nuevo pedido tras finalizar checkout (Clientes y Administradores)")
    public ResponseEntity<?> crearPedido(@RequestBody Pedido pedido) {
        try {
            Pedido creado = pedidoService.crearPedido(pedido);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "No se pudo registrar el pedido", "detalle", e.getMessage()));
        }
    }

    @PutMapping("/{id}/estado")
    @Operation(summary = "Actualizar estado del pedido (Solo Administrador y Vendedor)")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable String id,
            @RequestBody EstadoPedidoRequest request) {
        return pedidoService.actualizarEstado(id, request.getEstado())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
