package com.ju.e_commerce_project.dto.reponse;

import com.ju.e_commerce_project.model.UserRole;

public record LoginUserResponse(
        String username,
        String accessToken,
        UserRole role
){}