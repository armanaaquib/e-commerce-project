package com.ju.e_commerce_project.dto.reponse;

import com.ju.e_commerce_project.model.UserRole;

public record UserResponse(
        String username,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String address,
        UserRole role
) {}
