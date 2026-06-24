package com.softserve.todotask.user;

import com.softserve.todotask.user.web.dto.ChangePasswordRequest;
import com.softserve.todotask.user.web.dto.UserCreateRequest;
import com.softserve.todotask.user.web.dto.UserResponse;
import com.softserve.todotask.user.web.dto.UserUpdateProfileRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.modulith.NamedInterface;

@NamedInterface("user-api")
public interface UserService {
    UserResponse createUser(UserCreateRequest request);
    UserResponse getUserById(Long id);
    Page<UserResponse> getAllUsers(Pageable pageable);
    UserResponse getUserByEmail(String email);
    void deleteUser(Long id);
    UserResponse updateUserRole(Long id, String role);
    UserResponse updateProfile(Long id, UserUpdateProfileRequest request);
    void changePassword(Long id, ChangePasswordRequest request);
}