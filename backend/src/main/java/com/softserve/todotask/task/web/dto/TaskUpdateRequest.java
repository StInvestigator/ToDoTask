package com.softserve.todotask.task.web.dto;

import com.softserve.todotask.task.internal.enums.TaskPriority;
import com.softserve.todotask.task.internal.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record TaskUpdateRequest(
        @NotBlank String name,
        @NotNull TaskPriority priority,
        @NotNull TaskStatus status,
        Set<Long> collaboratorIds
) {}