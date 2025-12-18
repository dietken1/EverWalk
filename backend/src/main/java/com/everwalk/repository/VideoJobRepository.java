package com.everwalk.repository;

import com.everwalk.model.VideoJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VideoJobRepository extends JpaRepository<VideoJob, Long> {
    Optional<VideoJob> findByLumaJobId(String lumaJobId);
}
