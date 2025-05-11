package com.ju.e_commerce_project.controller;

import com.ju.e_commerce_project.dto.response.LoginUserResponse;
import com.ju.e_commerce_project.dto.response.RegisterUserResponse;
import com.ju.e_commerce_project.dto.request.LoginUserRequest;
import com.ju.e_commerce_project.dto.request.RegisterUserRequest;
import com.ju.e_commerce_project.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponse> registerUser(@RequestBody @Valid RegisterUserRequest userRequest) {
        return ResponseEntity.ok(authService.registerUser(userRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponse> loginUser(@RequestBody @Valid LoginUserRequest userRequest) {
        return ResponseEntity.ok(authService.loginUser(userRequest));
    }

}
