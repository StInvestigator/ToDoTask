package com.softserve.todotask.task.web;

import com.softserve.todotask.task.internal.TaskServiceImpl;
import com.softserve.todotask.task.web.dto.TaskCreateRequest;
import com.softserve.todotask.task.web.dto.TaskResponse;
import com.softserve.todotask.task.web.dto.TaskUpdateRequest;
import com.softserve.todotask.user.internal.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskServiceImpl taskService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(@Valid @RequestBody TaskCreateRequest request) {
        return taskService.createTask(request);
    }

    @GetMapping("/user")
    public Page<TaskResponse> getTasksByUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return taskService.getTasksByOwner(currentUser.getId(), PageRequest.of(page, size, Sort.by(sortBy)));
    }

    @GetMapping("/{id}")
    public TaskResponse getTask(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails currentUser) {
        var task = taskService.getTaskById(id);
        if (!Objects.equals(currentUser.getId(), task.owner().id())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return task;
    }

    @PutMapping("/{id}")
    public TaskResponse updateTask(@PathVariable Long id, @Valid @RequestBody TaskUpdateRequest request, @AuthenticationPrincipal CustomUserDetails currentUser) {
        var task = taskService.getTaskById(id);
        if (!Objects.equals(currentUser.getId(), task.owner().id())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return taskService.updateTask(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails currentUser) {
        var task = taskService.getTaskById(id);
        if (!Objects.equals(currentUser.getId(), task.owner().id())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        taskService.deleteTask(id);
    }

    @GetMapping("/collaborator")
    public Page<TaskResponse> getCollaborativeTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return taskService.getTasksByCollaborator(currentUser.getId(), PageRequest.of(page, size, Sort.by(sortBy)));
    }
}