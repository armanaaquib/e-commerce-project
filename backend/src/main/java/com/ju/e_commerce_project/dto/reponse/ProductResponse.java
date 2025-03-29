package com.ju.e_commerce_project.dto.reponse;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String categoryName
) {}
