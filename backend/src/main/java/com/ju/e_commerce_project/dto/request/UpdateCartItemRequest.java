package com.ju.e_commerce_project.dto.request;

import jakarta.validation.constraints.Min;

public record UpdateCartItemRequest(
        @Min(value = 1, message = "Quantity must be at least 1 to update.")
        int quantity
) {}
