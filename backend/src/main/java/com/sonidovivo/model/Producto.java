package com.sonidovivo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @Column(length = 50, nullable = false)
    private String codigo;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 80)
    private String marca;

    @Column(length = 80)
    private String modelo;

    @Column(length = 100)
    private String categoria;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 500)
    private String imagen;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Double precio;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer stock;
}
