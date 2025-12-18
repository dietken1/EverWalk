package com.everwalk.repository;

import com.everwalk.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByUserIdAndIsActiveTrue(Long userId);
    List<Pet> findByUserId(Long userId);
}
