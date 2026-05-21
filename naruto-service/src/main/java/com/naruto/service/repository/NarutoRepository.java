package com.naruto.service.repository;

import com.naruto.service.model.NarutoCharacter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NarutoRepository extends JpaRepository<NarutoCharacter, Long> {
    Optional<NarutoCharacter> findByNombre(String nombre);
}
