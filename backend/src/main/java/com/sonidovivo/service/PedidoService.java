package com.sonidovivo.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sonidovivo.model.Pedido;
import com.sonidovivo.model.Producto;
import com.sonidovivo.repository.PedidoRepository;
import com.sonidovivo.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private static final Set<String> ESTADOS_VALIDOS = Set.of(
            "En preparación", "Despachado", "Entregado", "Cancelado"
    );

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final ObjectMapper objectMapper;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAllByOrderByFechaDesc();
    }

    public List<Pedido> listarPorUsuario(String username) {
        return pedidoRepository.findByClienteUsernameOrderByFechaDesc(username);
    }

    public Optional<Pedido> buscarPorId(String id) {
        return pedidoRepository.findById(id);
    }

    @Transactional
    public Pedido crearPedido(Pedido pedido, String usernameAutenticado) {
        if (pedido.getTotal() == null || pedido.getTotal() < 0) {
            throw new IllegalArgumentException("El total del pedido debe ser mayor o igual a 0");
        }

        // Descontar stock si se envían ítems en formato JSON
        if (pedido.getItemsJson() != null && !pedido.getItemsJson().isBlank()) {
            descontarStockDeItems(pedido.getItemsJson());
        }

        if (usernameAutenticado != null && !usernameAutenticado.isBlank()) {
            pedido.setClienteUsername(usernameAutenticado);
        }
        if (pedido.getId() == null || pedido.getId().isBlank()) {
            pedido.setId("SV-" + (int) (100000 + Math.random() * 900000));
        }
        if (pedido.getFecha() == null || pedido.getFecha().isBlank()) {
            pedido.setFecha(LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
        }
        if (pedido.getEstado() == null || pedido.getEstado().isBlank()) {
            pedido.setEstado("En preparación");
        }
        if (pedido.getSeguimiento() == null || pedido.getSeguimiento().isBlank()) {
            pedido.setSeguimiento("STK-" + (int) (10000000 + Math.random() * 90000000));
        }

        return pedidoRepository.save(pedido);
    }

    private void descontarStockDeItems(String itemsJson) {
        List<Map<String, Object>> items;
        try {
            items = objectMapper.readValue(itemsJson, new TypeReference<>() {});
        } catch (Exception e) {
            throw new IllegalArgumentException("Formato de itemsJson inválido");
        }

        for (Map<String, Object> item : items) {
            Object codigoObj = item.get("codigo") != null ? item.get("codigo") : item.get("id");
            if (codigoObj == null) continue;

            String codigo = String.valueOf(codigoObj);
            int cantidad = item.get("cantidad") instanceof Number n ? n.intValue() : 1;
            if (cantidad <= 0) {
                throw new IllegalArgumentException("Cantidad inválida para el producto: " + codigo);
            }

            Optional<Producto> optProducto = productoRepository.findById(codigo);
            if (optProducto.isPresent()) {
                Producto producto = optProducto.get();
                int stockActual = producto.getStock() != null ? producto.getStock() : 0;
                if (stockActual < cantidad) {
                    throw new IllegalStateException(
                            "Stock insuficiente para '" + producto.getNombre() + "' (disponible: " + stockActual + ")"
                    );
                }
                producto.setStock(stockActual - cantidad);
                productoRepository.save(producto);
            }
        }
    }

    public Optional<Pedido> actualizarEstado(String id, String nuevoEstado) {
        if (nuevoEstado == null || !ESTADOS_VALIDOS.contains(nuevoEstado)) {
            throw new IllegalArgumentException("Estado inválido. Permitidos: " + ESTADOS_VALIDOS);
        }
        return pedidoRepository.findById(id).map(pedido -> {
            pedido.setEstado(nuevoEstado);
            return pedidoRepository.save(pedido);
        });
    }

    public boolean eliminar(String id) {
        if (!pedidoRepository.existsById(id)) {
            return false;
        }
        pedidoRepository.deleteById(id);
        return true;
    }
}
