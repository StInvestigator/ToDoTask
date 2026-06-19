package com.softserve.todotask.user;

import com.softserve.todotask.user.web.dto.UserCreateRequest;
import com.softserve.todotask.user.web.dto.UserResponse;
import java.util.List;

public interface UserService {
    UserResponse createUser(UserCreateRequest request);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
}