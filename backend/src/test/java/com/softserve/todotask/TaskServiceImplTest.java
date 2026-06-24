package com.softserve.todotask;

import com.softserve.todotask.task.internal.Task;
import com.softserve.todotask.task.internal.TaskRepository;
import com.softserve.todotask.task.internal.TaskServiceImpl;
import com.softserve.todotask.task.internal.enums.TaskPriority;
import com.softserve.todotask.task.internal.enums.TaskStatus;
import com.softserve.todotask.task.web.dto.TaskCreateRequest;
import com.softserve.todotask.task.web.dto.TaskResponse;
import com.softserve.todotask.task.web.dto.TaskUpdateRequest;
import com.softserve.todotask.user.UserService;
import com.softserve.todotask.user.web.dto.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task task;

    @BeforeEach
    void setUp() {
        task = Task.builder()
                .id(1L)
                .name("Test Task")
                .priority(TaskPriority.LOW)
                .status(TaskStatus.TODO)
                .ownerId(1L)
                .collaboratorIds(Set.of(2L))
                .build();
    }

    @Test
    void createTask_Success() {
        TaskCreateRequest createRequest = new TaskCreateRequest("Test Task", TaskPriority.LOW, 1L, Set.of(2L));
        UserResponse userResponse = new UserResponse(1L, "John", "Doe", "john@example.com", "USER");
        when(userService.getUserById(createRequest.ownerId())).thenReturn(userResponse);
        when(userService.getUserById(2L)).thenReturn(userResponse);
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponse response = taskService.createTask(createRequest);

        assertNotNull(response);
        assertEquals(task.getName(), response.name());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void getTasksByOwner_Success() {
        UserResponse userResponse = new UserResponse(1L, "John", "Doe", "john@example.com", "USER");
        Pageable pageable = PageRequest.of(0, 10);
        Page<Task> taskPage = new PageImpl<>(List.of(task));

        when(userService.getUserById(1L)).thenReturn(userResponse);
        when(userService.getUserById(2L)).thenReturn(userResponse);
        when(taskRepository.findByOwnerId(1L, pageable)).thenReturn(taskPage);

        Page<TaskResponse> response = taskService.getTasksByOwner(1L, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }

    @Test
    void getTaskById_Success() {
        UserResponse userResponse = new UserResponse(1L, "John", "Doe", "john@example.com", "USER");
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(userService.getUserById(1L)).thenReturn(userResponse);
        when(userService.getUserById(2L)).thenReturn(userResponse);

        TaskResponse response = taskService.getTaskById(1L);

        assertNotNull(response);
        assertEquals(task.getId(), response.id());
    }

    @Test
    void getTaskById_NotFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> taskService.getTaskById(1L));
    }

    @Test
    void updateTask_Success() {
        TaskUpdateRequest updateRequest = new TaskUpdateRequest("Updated Task", TaskPriority.HIGH, TaskStatus.IN_PROGRESS, Set.of());
        UserResponse userResponse = new UserResponse(1L, "John", "Doe", "john@example.com", "USER");
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(userService.getUserById(1L)).thenReturn(userResponse);

        TaskResponse response = taskService.updateTask(1L, updateRequest);

        assertNotNull(response);
        verify(taskRepository).save(task);
    }

    @Test
    void updateTask_NotFound() {
        TaskUpdateRequest updateRequest = new TaskUpdateRequest("Updated Task", TaskPriority.HIGH, TaskStatus.IN_PROGRESS, Set.of());
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> taskService.updateTask(1L, updateRequest));
    }

    @Test
    void deleteTask_Success() {
        doNothing().when(taskRepository).deleteById(1L);

        taskService.deleteTask(1L);

        verify(taskRepository).deleteById(1L);
    }

    @Test
    void getTasksByCollaborator_Success() {
        UserResponse userResponse = new UserResponse(1L, "John", "Doe", "john@example.com", "USER");
        Pageable pageable = PageRequest.of(0, 10);
        Page<Task> taskPage = new PageImpl<>(List.of(task));

        when(userService.getUserById(2L)).thenReturn(userResponse);
        when(userService.getUserById(1L)).thenReturn(userResponse);
        when(taskRepository.findTasksByCollaborator(2L, pageable)).thenReturn(taskPage);

        Page<TaskResponse> response = taskService.getTasksByCollaborator(2L, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }
}