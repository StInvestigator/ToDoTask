package com.softserve.todotask.user;

import com.softserve.todotask.user.web.dto.UserCreateRequest;
import com.softserve.todotask.user.web.dto.UserResponse;
import org.springframework.modulith.NamedInterface;

import java.util.List;

@NamedInterface("user-api")
public interface UserService {
    UserResponse createUser(UserCreateRequest request);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
}