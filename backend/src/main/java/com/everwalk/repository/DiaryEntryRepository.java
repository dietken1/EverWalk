package com.everwalk.repository;

import com.everwalk.model.DiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {
    List<DiaryEntry> findByPetIdOrderByCreatedAtDesc(Long petId);
    Long countByPetIdAndIsReadFalse(Long petId);
}
