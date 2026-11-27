package com.sonidovivo.config;

import com.sonidovivo.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"No autenticado\",\"mensaje\":\"Se requiere un token JWT válido\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"Acceso denegado\",\"mensaje\":\"No tienes permisos suficientes para esta operación\"}");
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas: Login, Registro y Swagger OpenAPI
                        .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                        // Verificación de sesión activa
                        .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()

                        // Productos: GET lectura pública; escritura restringida a ADMINISTRADOR y VENDEDOR
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/productos").hasAnyRole("ADMINISTRADOR", "VENDEDOR")
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyRole("ADMINISTRADOR", "VENDEDOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAnyRole("ADMINISTRADOR", "VENDEDOR")

                        // Pedidos: crear y consultar propios para autenticados; gestión total para ADMIN y VENDEDOR
                        .requestMatchers(HttpMethod.POST, "/api/pedidos").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/pedidos/mis-pedidos").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/pedidos").hasAnyRole("ADMINISTRADOR", "VENDEDOR")
                        .requestMatchers(HttpMethod.GET, "/api/pedidos/*").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/pedidos/**").hasAnyRole("ADMINISTRADOR", "VENDEDOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/pedidos/**").hasRole("ADMINISTRADOR")

                        // Usuarios: gestión completa solo para ADMINISTRADOR
                        .requestMatchers("/api/usuarios/**").hasRole("ADMINISTRADOR")

                        // Cualquier otra petición debe estar autenticada
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://localhost:80",
                "http://localhost",
                "http://127.0.0.1:5173"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
