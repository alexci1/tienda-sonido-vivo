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

    public Producto crear(Producto producto) {
        if (producto.getCodigo() == null || producto.getCodigo().isBlank()) {
            throw new IllegalArgumentException("El código del producto es obligatorio");
        }
        String codigoNormalizado = producto.getCodigo().trim();
        if (productoRepository.existsById(codigoNormalizado)) {
            throw new IllegalStateException("Ya existe un producto con el código '" + codigoNormalizado + "'");
        }
        producto.setCodigo(codigoNormalizado);
        return productoRepository.save(producto);
    }

    public Optional<Producto> actualizar(String codigo, Producto datosActualizados) {
        return productoRepository.findById(codigo).map(existente -> {
            existente.setNombre(datosActualizados.getNombre());
            existente.setMarca(datosActualizados.getMarca());
            existente.setModelo(datosActualizados.getModelo());
            existente.setCategoria(datosActualizados.getCategoria());
            existente.setDescripcion(datosActualizados.getDescripcion());
            existente.setImagen(datosActualizados.getImagen());
            existente.setPrecio(datosActualizados.getPrecio());
            existente.setStock(datosActualizados.getStock());
            return productoRepository.save(existente);
        });
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
