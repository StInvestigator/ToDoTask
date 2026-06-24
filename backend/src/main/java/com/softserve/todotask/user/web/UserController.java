package com.softserve.todotask.user.web;

import com.softserve.todotask.user.UserService;
import com.softserve.todotask.user.internal.CustomUserDetails;
import com.softserve.todotask.user.web.dto.ChangePasswordRequest;
import com.softserve.todotask.user.web.dto.UserCreateRequest;
import com.softserve.todotask.user.web.dto.UserResponse;
import com.softserve.todotask.user.web.dto.UserUpdateProfileRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(@Valid @RequestBody UserCreateRequest request) {
        return userService.createUser(request);
    }

    @GetMapping
    public Page<UserResponse> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        return userService.getAllUsers(PageRequest.of(page, size, Sort.by(sortBy)));
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}/role")
    public UserResponse updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return userService.updateUserRole(id, body.get("role"));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return userService.getUserById(currentUser.getId());
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(
            @Valid @RequestBody UserUpdateProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        return userService.updateProfile(currentUser.getId(), request);
    }

    @PutMapping("/profile/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        userService.changePassword(currentUser.getId(), request);
    }
}