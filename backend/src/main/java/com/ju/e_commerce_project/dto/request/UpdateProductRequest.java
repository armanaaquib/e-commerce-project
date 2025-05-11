package com.ju.e_commerce_project.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UpdateProductRequest(
        @NotBlank(message = "Name is required")
        String name,

        String description,

        @NotNull(message = "Price is required")
        BigDecimal price,

        @NotNull(message = "Category ID is required")
        Long categoryId
) {}
