package com.sonidovivo.controller;

import com.sonidovivo.dto.EstadoPedidoRequest;
import com.sonidovivo.model.Pedido;
import com.sonidovivo.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos y Checkout", description = "Gestión de órdenes de compra, control de stock y cambios de estado")
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    @Operation(summary = "Listar todos los pedidos (Solo Administrador y Vendedor)")
    public ResponseEntity<List<Pedido>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    @GetMapping("/mis-pedidos")
    @Operation(summary = "Listar los pedidos del usuario autenticado")
    public ResponseEntity<List<Pedido>> listarMisPedidos(Authentication authentication) {
        return ResponseEntity.ok(pedidoService.listarPorUsuario(authentication.getName()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar pedido por ID (Administrador, Vendedor o propietario)")
    public ResponseEntity<?> buscarPorId(@PathVariable String id, Authentication authentication) {
        return pedidoService.buscarPorId(id)
                .<ResponseEntity<?>>map(pedido -> {
                    boolean esStaff = authentication.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR")
                                    || a.getAuthority().equals("ROLE_VENDEDOR"));
                    boolean esPropietario = pedido.getClienteUsername() != null
                            && pedido.getClienteUsername().equals(authentication.getName());
                    if (!esStaff && !esPropietario) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("error", "No tienes permiso para consultar este pedido"));
                    }
                    return ResponseEntity.ok(pedido);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear nuevo pedido tras finalizar checkout (Usuarios autenticados)")
    public ResponseEntity<?> crearPedido(@RequestBody Pedido pedido, Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : null;
            Pedido creado = pedidoService.crearPedido(pedido, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
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
        try {
            return pedidoService.actualizarEstado(id, request.getEstado())
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un pedido por ID (Solo Administrador)")
    public ResponseEntity<?> eliminar(@PathVariable String id) {
        if (!pedidoService.eliminar(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("mensaje", "Pedido " + id + " eliminado correctamente"));
    }
}
