package com.ju.e_commerce_project.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        Long cartId,
        Long userId,
        List<CartItemResponse> items,
        BigDecimal totalPrice,
        int totalItems
) {}
