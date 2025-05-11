package com.ju.e_commerce_project.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(
        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
        String phoneNumber,

        String address
) {}
