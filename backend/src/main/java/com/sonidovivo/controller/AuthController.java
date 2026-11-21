package com.sonidovivo.controller;

import com.sonidovivo.dto.LoginRequest;
import com.sonidovivo.dto.LoginResponse;
import com.sonidovivo.dto.RegisterRequest;
import com.sonidovivo.model.Usuario;
import com.sonidovivo.service.AuthService;
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
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Autenticación & Usuarios", description = "Endpoints para inicio de sesión, registro y consulta de usuarios")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/login")
    @Operation(summary = "Iniciar sesión con credenciales y obtener JWT")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas", "mensaje", e.getMessage()));
        }
    }

    @PostMapping("/auth/register")
    @Operation(summary = "Registrar nuevo usuario con rol Cliente")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            LoginResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/usuarios")
    @Operation(summary = "Listar todos los usuarios del sistema (Solo Administrador)")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(authService.listarUsuarios());
    }
}
