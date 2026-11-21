package com.sonidovivo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {

    @Id
    @Column(length = 50, nullable = false)
    private String id; // Ej: SV-123456

    @Column(nullable = false, length = 30)
    private String fecha;

    @Column(nullable = false)
    private Double total;

    @Column(nullable = false, length = 40)
    private String estado; // "En preparación", "Despachado", "Entregado"

    @Column(length = 30)
    private String metodoEntrega; // "despacho" | "retiro"

    @Column(length = 30)
    private String metodoPago; // "webpay" | "transferencia"

    @Column(length = 60)
    private String seguimiento;

    // Datos del cliente destinatario
    @Column(length = 120)
    private String clienteNombre;

    @Column(length = 120)
    private String clienteEmail;

    @Column(length = 30)
    private String clienteRut;

    @Column(length = 30)
    private String clienteTelefono;

    @Column(length = 100)
    private String clienteCiudad;

    @Column(length = 100)
    private String clienteRegion;

    @Column(length = 200)
    private String clienteDireccion;

    // Items comprados almacenados en formato JSON estructurado
    @Column(columnDefinition = "LONGTEXT")
    private String itemsJson;
}
