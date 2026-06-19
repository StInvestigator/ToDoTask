package com.softserve.todotask.task.web;

import com.softserve.todotask.task.internal.TaskServiceImpl;
import com.softserve.todotask.task.web.dto.TaskCreateRequest;
import com.softserve.todotask.task.web.dto.TaskResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/user/{ownerId}")
    public Page<TaskResponse> getTasksByUser(
            @PathVariable Long ownerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        return taskService.getTasksByOwner(ownerId, PageRequest.of(page, size, Sort.by(sortBy)));
    }
}