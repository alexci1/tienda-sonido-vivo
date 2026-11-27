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
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        String usernameNormalizado = request.getUsername().trim();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(usernameNormalizado, request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByUsername(usernameNormalizado)
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
        String usernameNormalizado = request.getUsername().trim();
        if (usuarioRepository.existsByUsername(usernameNormalizado)) {
            throw new IllegalArgumentException("El nombre de usuario '" + usernameNormalizado + "' ya está registrado.");
        }

        // Por seguridad, el registro público siempre asigna el rol CLIENTE
        Usuario nuevo = Usuario.builder()
                .username(usernameNormalizado)
                .password(passwordEncoder.encode(request.getPassword()))
                .nombre(request.getNombre().trim())
                .rol(Rol.CLIENTE)
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

    public Map<String, Object> obtenerPerfil(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return Map.of(
                "id", usuario.getId(),
                "username", usuario.getUsername(),
                "nombre", usuario.getNombre(),
                "rol", usuario.getRol().name()
        );
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> actualizarRol(Long id, String nuevoRol) {
        Rol rolValido;
        try {
            rolValido = Rol.valueOf(nuevoRol.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rol inválido. Permitidos: ADMINISTRADOR, VENDEDOR, CLIENTE");
        }
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setRol(rolValido);
            return usuarioRepository.save(usuario);
        });
    }

    public boolean eliminarUsuario(Long id, String adminUsername) {
        Optional<Usuario> opt = usuarioRepository.findById(id);
        if (opt.isEmpty()) {
            return false;
        }
        if (opt.get().getUsername().equalsIgnoreCase(adminUsername)) {
            throw new IllegalArgumentException("No puedes eliminar tu propio usuario administrador en sesión");
        }
        usuarioRepository.deleteById(id);
        return true;
    }
}
