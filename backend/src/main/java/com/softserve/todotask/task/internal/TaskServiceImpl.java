package com.softserve.todotask.task.internal;

import com.softserve.todotask.task.TaskService;
import com.softserve.todotask.task.internal.enums.TaskStatus;
import com.softserve.todotask.task.web.dto.TaskCreateRequest;
import com.softserve.todotask.task.web.dto.TaskResponse;
import com.softserve.todotask.user.UserService;
import com.softserve.todotask.user.web.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;

    @Transactional
    public TaskResponse createTask(TaskCreateRequest request) {
        userService.getUserById(request.ownerId());

        Task task = Task.builder()
                .name(request.name())
                .priority(request.priority())
                .status(TaskStatus.TODO)
                .ownerId(request.ownerId())
                .collaboratorIds(request.collaboratorIds() != null ? request.collaboratorIds() : Set.of())
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksByOwner(Long ownerId, Pageable pageable) {
        userService.getUserById(ownerId);

        return taskRepository.findByOwnerId(ownerId, pageable)
                .map(this::mapToResponse);
    }

    private TaskResponse mapToResponse(Task task) {
        UserResponse owner = userService.getUserById(task.getOwnerId());

        List<UserResponse> collaborators = task.getCollaboratorIds().stream()
                .map(userService::getUserById)
                .collect(Collectors.toList());

        return new TaskResponse(
                task.getId(),
                task.getName(),
                task.getPriority().name(),
                task.getStatus().name(),
                owner,
                collaborators
        );
    }
}