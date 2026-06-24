package com.softserve.todotask;

import com.softserve.todotask.user.internal.User;
import com.softserve.todotask.user.internal.UserRepository;
import com.softserve.todotask.user.internal.UserServiceImpl;
import com.softserve.todotask.user.internal.enums.UserRole;
import com.softserve.todotask.user.web.dto.ChangePasswordRequest;
import com.softserve.todotask.user.web.dto.UserCreateRequest;
import com.softserve.todotask.user.web.dto.UserResponse;
import com.softserve.todotask.user.web.dto.UserUpdateProfileRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .passwordHash("hashedPassword")
                .role(UserRole.USER)
                .build();
    }

    @Test
    void createUser_Success() {
        UserCreateRequest createRequest = new UserCreateRequest("John", "Doe", "john@example.com", "password");
        when(userRepository.findByEmail(createRequest.email())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(createRequest.password())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponse response = userService.createUser(createRequest);

        assertNotNull(response);
        assertEquals(user.getEmail(), response.email());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_EmailExists() {
        UserCreateRequest createRequest = new UserCreateRequest("John", "Doe", "john@example.com", "password");
        when(userRepository.findByEmail(createRequest.email())).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> userService.createUser(createRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserResponse response = userService.getUserById(1L);

        assertNotNull(response);
        assertEquals(user.getId(), response.id());
    }

    @Test
    void getUserById_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> userService.getUserById(1L));
    }

    @Test
    void getAllUsers_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<User> userPage = new PageImpl<>(List.of(user));
        when(userRepository.findAll(pageable)).thenReturn(userPage);

        Page<UserResponse> response = userService.getAllUsers(pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }

    @Test
    void getUserByEmail_Success() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        UserResponse response = userService.getUserByEmail("john@example.com");

        assertNotNull(response);
        assertEquals(user.getEmail(), response.email());
    }

    @Test
    void getUserByEmail_NotFound() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> userService.getUserByEmail("john@example.com"));
    }

    @Test
    void updateUserRole_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponse response = userService.updateUserRole(1L, "ADMIN");

        assertNotNull(response);
        verify(userRepository).save(user);
    }

    @Test
    void deleteUser_Success() {
        doNothing().when(userRepository).deleteById(1L);

        userService.deleteUser(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    void updateProfile_Success() {
        UserUpdateProfileRequest updateProfileRequest = new UserUpdateProfileRequest("Jane", "Doe", "jane@example.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.findByEmail(updateProfileRequest.email())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponse response = userService.updateProfile(1L, updateProfileRequest);

        assertNotNull(response);
        verify(userRepository).save(user);
    }

    @Test
    void updateProfile_EmailTaken() {
        UserUpdateProfileRequest updateProfileRequest = new UserUpdateProfileRequest("Jane", "Doe", "jane@example.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.findByEmail(updateProfileRequest.email())).thenReturn(Optional.of(new User()));

        assertThrows(IllegalArgumentException.class, () -> userService.updateProfile(1L, updateProfileRequest));
    }

    @Test
    void changePassword_Success() {
        ChangePasswordRequest request = new ChangePasswordRequest("oldPass", "newPass");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())).thenReturn(true);
        when(passwordEncoder.encode(request.newPassword())).thenReturn("newHashedPass");

        userService.changePassword(1L, request);

        verify(userRepository).save(user);
    }

    @Test
    void changePassword_WrongOldPassword() {
        ChangePasswordRequest request = new ChangePasswordRequest("wrongPass", "newPass");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> userService.changePassword(1L, request));
    }
}