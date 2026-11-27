package com.sonidovivo.controller;

import com.sonidovivo.dto.LoginRequest;
import com.sonidovivo.dto.LoginResponse;
import com.sonidovivo.dto.RegisterRequest;
import com.sonidovivo.dto.UpdateRolRequest;
import com.sonidovivo.model.Usuario;
import com.sonidovivo.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Autenticación & Usuarios", description = "Endpoints para inicio de sesión JWT, registro, verificación de sesión y gestión de usuarios")
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

    @GetMapping("/auth/me")
    @Operation(summary = "Validar token JWT activo y obtener perfil del usuario autenticado")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }
        return ResponseEntity.ok(authService.obtenerPerfil(authentication.getName()));
    }

    @GetMapping("/usuarios")
    @Operation(summary = "Listar todos los usuarios del sistema (Solo Administrador)")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(authService.listarUsuarios());
    }

    @PutMapping("/usuarios/{id}/rol")
    @Operation(summary = "Actualizar rol de un usuario (Solo Administrador)")
    public ResponseEntity<?> actualizarRol(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRolRequest request) {
        try {
            return authService.actualizarRol(id, request.getRol())
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/usuarios/{id}")
    @Operation(summary = "Eliminar un usuario por ID (Solo Administrador)")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id, Authentication authentication) {
        try {
            if (!authService.eliminarUsuario(id, authentication.getName())) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado correctamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
