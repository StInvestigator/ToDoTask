package com.softserve.todotask.task.web.dto;

import com.softserve.todotask.user.web.dto.UserResponse;
import java.util.List;

public record TaskResponse(
        Long id,
        String name,
        String priority,
        String status,
        UserResponse owner,
        List<UserResponse> collaborators
) {}