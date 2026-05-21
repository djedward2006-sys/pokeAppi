package com.naruto.service.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "personajes")
@Data
public class NarutoCharacter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(nullable = false)
    private String aldea;

    @Column(nullable = false)
    private String clan;

    @Column(length = 500)
    private String imagen;
}
