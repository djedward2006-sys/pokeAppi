package com.naruto.service.controller;

import com.naruto.service.model.NarutoCharacter;
import com.naruto.service.repository.NarutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/naruto")
public class NarutoController {

    @Autowired
    private NarutoRepository repository;

    @GetMapping
    public List<NarutoCharacter> getAllCharacters() {
        return repository.findAll();
    }

    @GetMapping("/{name}")
    public ResponseEntity<NarutoCharacter> getCharacterByName(@PathVariable String name) {
        return repository.findByNombre(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public NarutoCharacter createCharacter(@RequestBody NarutoCharacter character) {
        return repository.save(character);
    }
}
