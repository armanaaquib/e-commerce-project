package com.ju.e_commerce_project.dto.request;

import com.ju.e_commerce_project.model.UserRole;

public record RegisterUserRequest(
        String username,
        String password,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        String address,
        UserRole role
){}
