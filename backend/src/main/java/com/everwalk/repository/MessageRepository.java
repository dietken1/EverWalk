package com.everwalk.repository;

import com.everwalk.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByPetIdOrderByCreatedAtAsc(Long petId);
    Long countByPetIdAndIsReadFalse(Long petId);
}
