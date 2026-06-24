package com.softserve.todotask.user.web.dto;

public record AuthResponse(
        String token,
        Long userId,
        String role,
        String firstName,
        String lastName
) {}