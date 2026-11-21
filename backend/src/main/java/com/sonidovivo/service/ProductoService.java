package com.sonidovivo.service;

import com.sonidovivo.model.Producto;
import com.sonidovivo.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    public Optional<Producto> buscarPorCodigo(String codigo) {
        return productoRepository.findById(codigo);
    }

    public List<Producto> listarPorCategoria(String categoria) {
        return productoRepository.findByCategoriaIgnoreCase(categoria);
    }

    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    public void eliminar(String codigo) {
        productoRepository.deleteById(codigo);
    }

    public boolean existe(String codigo) {
        return productoRepository.existsById(codigo);
    }
}
