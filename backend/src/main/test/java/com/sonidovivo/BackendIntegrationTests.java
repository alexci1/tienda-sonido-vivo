package com.sonidovivo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sonidovivo.model.Producto;
import com.sonidovivo.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class BackendIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductoRepository productoRepository;

    @BeforeEach
    void setUp() {
        productoRepository.deleteAll();
        productoRepository.save(Producto.builder()
                .codigo("TEST-01")
                .nombre("Guitarra Test")
                .marca("Fender")
                .modelo("Strat")
                .categoria("Guitarras Eléctricas")
                .descripcion("Guitarra de prueba")
                .precio(250000.0)
                .stock(5)
                .build());
    }

    private String loginAndGetToken(String username, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", username,
                                "password", password
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("token").asText();
    }

    @Test
    void swaggerOpenApiDocsDisponibles() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paths['/api/productos']").exists())
                .andExpect(jsonPath("$.paths['/api/productos/{codigo}'].put").exists())
                .andExpect(jsonPath("$.paths['/api/pedidos']").exists())
                .andExpect(jsonPath("$.paths['/api/auth/login']").exists());
    }

    @Test
    void registroPublicoSiempreAsignaRolClienteYNoPermiteEscalarPrivilegios() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", "nuevo_cliente",
                                "password", "clave123",
                                "nombre", "Nuevo Cliente",
                                "rol", "ADMINISTRADOR"
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rol").value("CLIENTE"))
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void rutasProtegidasSinTokenRetornan401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rbacRestringeClienteYVendedorVsAdministrador() throws Exception {
        String tokenCliente = loginAndGetToken("cliente", "cliente123");
        String tokenVendedor = loginAndGetToken("vendedor", "vendedor123");
        String tokenAdmin = loginAndGetToken("admin", "admin123");

        // /api/auth/me funciona para cualquier usuario autenticado
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + tokenCliente))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("cliente"))
                .andExpect(jsonPath("$.rol").value("CLIENTE"));

        // Cliente no puede crear productos ni listar usuarios
        mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + tokenCliente)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "codigo", "NEW-01",
                                "nombre", "Teclado",
                                "precio", 100000,
                                "stock", 2
                        ))))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/usuarios")
                        .header("Authorization", "Bearer " + tokenVendedor))
                .andExpect(status().isForbidden());

        // Admin lista usuarios sin exponer contraseñas
        mockMvc.perform(get("/api/usuarios")
                        .header("Authorization", "Bearer " + tokenAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$[0].password").doesNotExist());
    }

    @Test
    void crudCompletoDeProductosConPut() throws Exception {
        String tokenVendedor = loginAndGetToken("vendedor", "vendedor123");

        // CREATE
        mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + tokenVendedor)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "codigo", "CRUD-01",
                                "nombre", "Micrófono Shure",
                                "marca", "Shure",
                                "categoria", "Micrófonos",
                                "precio", 120000,
                                "stock", 10
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.codigo").value("CRUD-01"));

        // READ
        mockMvc.perform(get("/api/productos/CRUD-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Micrófono Shure"));

        // UPDATE (PUT)
        mockMvc.perform(put("/api/productos/CRUD-01")
                        .header("Authorization", "Bearer " + tokenVendedor)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "codigo", "CRUD-01",
                                "nombre", "Micrófono Shure SM58 Pro",
                                "marca", "Shure",
                                "categoria", "Micrófonos",
                                "precio", 135000,
                                "stock", 7
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Micrófono Shure SM58 Pro"))
                .andExpect(jsonPath("$.stock").value(7));

        // DELETE
        mockMvc.perform(delete("/api/productos/CRUD-01")
                        .header("Authorization", "Bearer " + tokenVendedor))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/productos/CRUD-01"))
                .andExpect(status().isNotFound());
    }

    @Test
    void crearPedidoDescuentaStockYValidaDisponibilidad() throws Exception {
        String tokenCliente = loginAndGetToken("cliente", "cliente123");
        String tokenVendedor = loginAndGetToken("vendedor", "vendedor123");

        String itemsJson = objectMapper.writeValueAsString(java.util.List.of(
                Map.of("codigo", "TEST-01", "nombre", "Guitarra Test", "precio", 250000, "cantidad", 2)
        ));

        MvcResult pedidoRes = mockMvc.perform(post("/api/pedidos")
                        .header("Authorization", "Bearer " + tokenCliente)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "clienteNombre", "Pedro Cliente",
                                "clienteEmail", "pedro@test.cl",
                                "metodoEntrega", "despacho",
                                "metodoPago", "webpay",
                                "total", 504990,
                                "itemsJson", itemsJson
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.clienteUsername").value("cliente"))
                .andExpect(jsonPath("$.estado").value("En preparación"))
                .andReturn();

        String pedidoId = objectMapper.readTree(pedidoRes.getResponse().getContentAsString()).get("id").asText();

        // Stock debe haber bajado de 5 a 3
        Producto actualizado = productoRepository.findById("TEST-01").orElseThrow();
        assertEquals(3, actualizado.getStock());

        // Intento de comprar más del stock disponible (5 > 3) debe fallar con 409
        String itemsExcedidos = objectMapper.writeValueAsString(java.util.List.of(
                Map.of("codigo", "TEST-01", "nombre", "Guitarra Test", "precio", 250000, "cantidad", 5)
        ));
        mockMvc.perform(post("/api/pedidos")
                        .header("Authorization", "Bearer " + tokenCliente)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "clienteNombre", "Pedro Cliente",
                                "total", 1250000,
                                "itemsJson", itemsExcedidos
                        ))))
                .andExpect(status().isConflict());

        // Cliente puede consultar sus propios pedidos
        mockMvc.perform(get("/api/pedidos/mis-pedidos")
                        .header("Authorization", "Bearer " + tokenCliente))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(pedidoId));

        // Vendedor actualiza estado del pedido
        mockMvc.perform(put("/api/pedidos/" + pedidoId + "/estado")
                        .header("Authorization", "Bearer " + tokenVendedor)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("estado", "Despachado"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("Despachado"));
    }
}
