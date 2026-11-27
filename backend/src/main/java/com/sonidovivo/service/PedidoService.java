package com.sonidovivo.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sonidovivo.model.Pedido;
import com.sonidovivo.model.Producto;
import com.sonidovivo.repository.PedidoRepository;
import com.sonidovivo.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAllByOrderByFechaDesc();
    }

    public Optional<Pedido> buscarPorId(String id) {
        return pedidoRepository.findById(id);
    }

    @Transactional
    public Pedido crearPedido(Pedido pedido) {
        if (pedido.getId() == null || pedido.getId().isBlank()) {
            pedido.setId("SV-" + (int)(100000 + Math.random() * 900000));
        }
        if (pedido.getEstado() == null || pedido.getEstado().isBlank()) {
            pedido.setEstado("En preparación");
        }
        if (pedido.getSeguimiento() == null || pedido.getSeguimiento().isBlank()) {
            pedido.setSeguimiento("STK-" + (int)(10000000 + Math.random() * 90000000));
        }

        // Regla de Negocio: Descontar stock de cada producto comprado
        descontarStockDeItems(pedido.getItemsJson());

        return pedidoRepository.save(pedido);
    }

    private void descontarStockDeItems(String itemsJson) {
        if (itemsJson == null || itemsJson.isBlank()) {
            return;
        }

        try {
            List<Map<String, Object>> items = objectMapper.readValue(
                    itemsJson,
                    new TypeReference<List<Map<String, Object>>>() {}
            );

            for (Map<String, Object> item : items) {
                // El item puede tener 'codigo' o 'id'
                String codigo = (String) item.get("codigo");
                if (codigo == null && item.get("id") != null) {
                    codigo = String.valueOf(item.get("id"));
                }

                Number cantidadNum = (Number) item.get("cantidad");
                int cantidadComprada = cantidadNum != null ? cantidadNum.intValue() : 1;

                if (codigo != null) {
                    Optional<Producto> optProd = productoRepository.findById(codigo);
                    if (optProd.isPresent()) {
                        Producto prod = optProd.get();
                        int stockActual = prod.getStock() != null ? prod.getStock() : 0;
                        int nuevoStock = Math.max(0, stockActual - cantidadComprada);
                        prod.setStock(nuevoStock);
                        productoRepository.save(prod);
                        log.info("Stock actualizado para producto {}: de {} a {}", codigo, stockActual, nuevoStock);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("No se pudo descontar stock de los items del pedido: {}", e.getMessage());
        }
    }

    public Optional<Pedido> actualizarEstado(String id, String nuevoEstado) {
        return pedidoRepository.findById(id).map(pedido -> {
            pedido.setEstado(nuevoEstado);
            return pedidoRepository.save(pedido);
        });
    }
}
