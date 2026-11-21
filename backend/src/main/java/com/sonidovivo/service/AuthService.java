package com.sonidovivo.service;

import com.sonidovivo.dto.LoginRequest;
import com.sonidovivo.dto.LoginResponse;
import com.sonidovivo.dto.RegisterRequest;
import com.sonidovivo.model.Rol;
import com.sonidovivo.model.Usuario;
import com.sonidovivo.repository.UsuarioRepository;
import com.sonidovivo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtUtil.generarToken(usuario.getUsername(), usuario.getRol().name(), usuario.getNombre());

        return LoginResponse.builder()
                .token(token)
                .username(usuario.getUsername())
                .nombre(usuario.getNombre())
                .rol(usuario.getRol().name())
                .build();
    }

    public LoginResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario '" + request.getUsername() + "' ya está registrado.");
        }

        Rol rolAsignado = Rol.CLIENTE;
        if (request.getRol() != null && !request.getRol().isBlank()) {
            try {
                rolAsignado = Rol.valueOf(request.getRol().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Usuario nuevo = Usuario.builder()
                .username(request.getUsername().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .nombre(request.getNombre().trim())
                .rol(rolAsignado)
                .build();

        usuarioRepository.save(nuevo);

        String token = jwtUtil.generarToken(nuevo.getUsername(), nuevo.getRol().name(), nuevo.getNombre());

        return LoginResponse.builder()
                .token(token)
                .username(nuevo.getUsername())
                .nombre(nuevo.getNombre())
                .rol(nuevo.getRol().name())
                .build();
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}
