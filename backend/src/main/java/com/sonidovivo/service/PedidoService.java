package com.sonidovivo.service;

import com.sonidovivo.model.Pedido;
import com.sonidovivo.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAllByOrderByFechaDesc();
    }

    public Optional<Pedido> buscarPorId(String id) {
        return pedidoRepository.findById(id);
    }

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
        return pedidoRepository.save(pedido);
    }

    public Optional<Pedido> actualizarEstado(String id, String nuevoEstado) {
        return pedidoRepository.findById(id).map(pedido -> {
            pedido.setEstado(nuevoEstado);
            return pedidoRepository.save(pedido);
        });
    }
}
