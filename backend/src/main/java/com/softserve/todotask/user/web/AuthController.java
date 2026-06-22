package com.softserve.todotask.user.web;

import com.softserve.todotask.infrastructure.security.JwtService;
import com.softserve.todotask.user.web.dto.UserResponse;
import com.softserve.todotask.user.UserService;
import com.softserve.todotask.user.web.dto.AuthResponse;
import com.softserve.todotask.user.web.dto.LoginRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserService userService;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.email());
        String token = jwtService.generateToken(userDetails);
        UserResponse user = userService.getUserByEmail(request.email());
        return new AuthResponse(token, user.id(), user.role(), user.firstName(), user.lastName());
    }
}