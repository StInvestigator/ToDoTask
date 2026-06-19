package com.softserve.todotask.task.web.dto;

import com.softserve.todotask.task.internal.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record TaskCreateRequest(
        @NotBlank(message = "Task name is required") String name,
        @NotNull(message = "Priority is required") TaskPriority priority,
        @NotNull(message = "Owner ID is required") Long ownerId,
        Set<Long> collaboratorIds
) {}