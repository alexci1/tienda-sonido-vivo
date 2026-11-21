package com.sonidovivo.controller;

import com.sonidovivo.model.Producto;
import com.sonidovivo.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@Tag(name = "Productos", description = "Operaciones CRUD para el catálogo de instrumentos y equipos de audio")
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    @Operation(summary = "Listar todos los productos del catálogo")
    public ResponseEntity<List<Producto>> listarTodos(
            @RequestParam(required = false) String categoria) {
        if (categoria != null && !categoria.isBlank()) {
            return ResponseEntity.ok(productoService.listarPorCategoria(categoria));
        }
        return ResponseEntity.ok(productoService.listarTodos());
    }

    @GetMapping("/{codigo}")
    @Operation(summary = "Obtener un producto por su código")
    public ResponseEntity<?> buscarPorCodigo(@PathVariable String codigo) {
        return productoService.buscarPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear o actualizar producto (Solo Administrador y Vendedor)")
    public ResponseEntity<?> guardar(@Valid @RequestBody Producto producto) {
        try {
            Producto guardado = productoService.guardar(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Error al guardar producto", "mensaje", e.getMessage()));
        }
    }

    @DeleteMapping("/{codigo}")
    @Operation(summary = "Eliminar un producto por código (Solo Administrador y Vendedor)")
    public ResponseEntity<?> eliminar(@PathVariable String codigo) {
        if (!productoService.existe(codigo)) {
            return ResponseEntity.notFound().build();
        }
        productoService.eliminar(codigo);
        return ResponseEntity.ok(Map.of("mensaje", "Producto " + codigo + " eliminado correctamente"));
    }
}
