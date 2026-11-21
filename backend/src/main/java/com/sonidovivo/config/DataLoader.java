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

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initUsers() {
        return args -> {
            // Inicializar Usuario Administrador
            if (!usuarioRepository.existsByUsername("admin")) {
                usuarioRepository.save(Usuario.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .nombre("Administrador General")
                        .rol(Rol.ADMINISTRADOR)
                        .build());
            }

            // Inicializar Usuario Vendedor
            if (!usuarioRepository.existsByUsername("vendedor")) {
                usuarioRepository.save(Usuario.builder()
                        .username("vendedor")
                        .password(passwordEncoder.encode("vendedor123"))
                        .nombre("Juan Vendedor")
                        .rol(Rol.VENDEDOR)
                        .build());
            }

            // Inicializar Usuario Cliente
            if (!usuarioRepository.existsByUsername("cliente")) {
                usuarioRepository.save(Usuario.builder()
                        .username("cliente")
                        .password(passwordEncoder.encode("cliente123"))
                        .nombre("Pedro Cliente")
                        .rol(Rol.CLIENTE)
                        .build());
            }
        };
    }
}
