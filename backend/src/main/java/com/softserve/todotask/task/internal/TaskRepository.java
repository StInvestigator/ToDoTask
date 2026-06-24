package com.softserve.todotask.task.internal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByOwnerId(Long ownerId, Pageable pageable);
    @Query("SELECT t FROM Task t JOIN t.collaboratorIds c WHERE c = :collaboratorId")
    Page<Task> findTasksByCollaborator(@Param("collaboratorId") Long collaboratorId, Pageable pageable);
}