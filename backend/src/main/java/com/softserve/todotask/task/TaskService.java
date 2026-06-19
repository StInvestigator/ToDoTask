package com.softserve.todotask.task;

import com.softserve.todotask.task.web.dto.TaskCreateRequest;
import com.softserve.todotask.task.web.dto.TaskResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {
    TaskResponse createTask(TaskCreateRequest request);
    Page<TaskResponse> getTasksByOwner(Long ownerId, Pageable pageable);
}
