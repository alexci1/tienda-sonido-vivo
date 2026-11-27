package com.sonidovivo.config;

import com.sonidovivo.model.Rol;
import com.sonidovivo.model.Usuario;
import com.sonidovivo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataLoader {

    private static final String PLACEHOLDER_HASH = "$2a$10$4B9a87gG8y7F7f6E5d4C3b2A1Z0y9x8w7v6u5t4s3r2q1p0o9n8m7";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initUsers() {
        return args -> {
            asegurarUsuario("admin", "admin123", "Administrador General", Rol.ADMINISTRADOR);
            asegurarUsuario("vendedor", "vendedor123", "Juan Vendedor", Rol.VENDEDOR);
            asegurarUsuario("cliente", "cliente123", "Pedro Cliente", Rol.CLIENTE);
        };
    }

    private void asegurarUsuario(String username, String rawPassword, String nombre, Rol rol) {
        usuarioRepository.findByUsername(username).ifPresentOrElse(existente -> {
            if (PLACEHOLDER_HASH.equals(existente.getPassword())) {
                existente.setPassword(passwordEncoder.encode(rawPassword));
                usuarioRepository.save(existente);
            }
        }, () -> usuarioRepository.save(Usuario.builder()
                .username(username)
                .password(passwordEncoder.encode(rawPassword))
                .nombre(nombre)
                .rol(rol)
                .build()));
    }
}
