package com.ju.e_commerce_project.controller;

import com.ju.e_commerce_project.dto.request.UpdateUserRequest;
import com.ju.e_commerce_project.dto.reponse.UserResponse;
import com.ju.e_commerce_project.model.User;
import com.ju.e_commerce_project.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateUserProfile(@RequestBody @Valid UpdateUserRequest updateUserRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        User updatedUserEntity = userService.updateUserProfile(currentPrincipalName, updateUserRequest);

        UserResponse userResponse = new UserResponse(
                updatedUserEntity.getUsername(),
                updatedUserEntity.getEmail(),
                updatedUserEntity.getFirstName(),
                updatedUserEntity.getLastName(),
                updatedUserEntity.getPhoneNumber(),
                updatedUserEntity.getAddress(),
                updatedUserEntity.getRole()
        );
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        User userEntity = userService.getUserProfile(currentPrincipalName);

        UserResponse userResponse = new UserResponse(
                userEntity.getUsername(),
                userEntity.getEmail(),
                userEntity.getFirstName(),
                userEntity.getLastName(),
                userEntity.getPhoneNumber(),
                userEntity.getAddress(),
                userEntity.getRole()
        );
        return ResponseEntity.ok(userResponse);
    }
}
