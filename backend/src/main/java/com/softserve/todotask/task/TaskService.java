package com.softserve.todotask.task;

import com.softserve.todotask.task.web.dto.TaskCreateRequest;
import com.softserve.todotask.task.web.dto.TaskResponse;
import com.softserve.todotask.task.web.dto.TaskUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {
    TaskResponse createTask(TaskCreateRequest request);
    Page<TaskResponse> getTasksByOwner(Long ownerId, Pageable pageable);
    TaskResponse getTaskById(Long id);
    TaskResponse updateTask(Long id, TaskUpdateRequest request);
    void deleteTask(Long id);
    Page<TaskResponse> getTasksByCollaborator(Long collaboratorId, Pageable pageable);
}
