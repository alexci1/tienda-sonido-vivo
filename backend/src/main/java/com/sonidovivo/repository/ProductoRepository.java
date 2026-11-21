package com.sonidovivo.repository;

import com.sonidovivo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, String> {
    List<Producto> findByCategoriaIgnoreCase(String categoria);
}
