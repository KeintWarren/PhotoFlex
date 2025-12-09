package com.example.appdev.poliquitoct6.config;

import com.example.appdev.poliquitoct6.service.UserService; // <-- NEW: Import your UserService

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider; // <-- NEW: Import
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration; // <-- NEW: Import
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserService userService; // To inject your custom UserDetailsService

    // Use constructor injection for the UserService
    public SecurityConfig(UserService userService) {
        this.userService = userService;
    }

    // 1. PasswordEncoder Bean (Required for hashing/checking passwords)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. DaoAuthenticationProvider Bean
    // Ties the UserService (UserDetailsService) and PasswordEncoder together.
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService); // Uses your UserService
        authProvider.setPasswordEncoder(passwordEncoder()); // Uses your BCryptPasswordEncoder
        return authProvider;
    }

    // 3. AuthenticationManager Bean
    // Used to process authentication requests (e.g., in a Login Controller)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // 4. Security Filter Chain Configuration (Authorization Rules)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for stateless REST APIs
                .csrf(csrf -> csrf.disable())

                // Configure stateless session management
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Set the custom Authentication Provider
                .authenticationProvider(authenticationProvider())

                // Define authorization rules
                .authorizeHttpRequests(authorize -> authorize

                        // PUBLIC ENDPOINTS (No Auth Required)
                        .requestMatchers("POST", "/api/users/register").permitAll()
                        .requestMatchers("POST", "/api/users/login").permitAll() // Login will use AuthenticationManager
                        .requestMatchers("GET", "/api/pins/**").permitAll() // All GETs for pins are public
                        .requestMatchers("GET", "/api/boards/**").permitAll() // All GETs for boards are public
                        .requestMatchers("GET", "/api/users/**").permitAll() // User profiles are public

                        // SECURED ENDPOINTS (All other requests require authentication)
                        .anyRequest().authenticated()
                );

        // NOTE: In a real JWT setup, you would add a custom filter here
        // before UsernamePasswordAuthenticationFilter.

        // Use HTTP Basic authentication for initial testing/login (optional, can be removed later)
        http.httpBasic(basic -> {});

        return http.build();
    }
}