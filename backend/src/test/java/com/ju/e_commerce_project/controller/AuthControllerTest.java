package com.ju.e_commerce_project.controller;

import com.ju.e_commerce_project.dto.reponse.LoginUserResponse;
import com.ju.e_commerce_project.dto.reponse.RegisterUserResponse;
import com.ju.e_commerce_project.dto.request.LoginUserRequest;
import com.ju.e_commerce_project.dto.request.RegisterUserRequest;
import com.ju.e_commerce_project.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    void registerUser_ValidRequest_ReturnsRegisterUserResponse() {
        RegisterUserRequest request = new RegisterUserRequest("testuser", "password", "test@example.com", "Test", "User", "1234567890", "Test Address", null);
        RegisterUserResponse expectedResponse = new RegisterUserResponse("testuser", "mockedToken");
        when(authService.registerUser(any(RegisterUserRequest.class))).thenReturn(expectedResponse);

        ResponseEntity<RegisterUserResponse> response = authController.registerUser(request);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(expectedResponse.username(), response.getBody().username());
        assertEquals(expectedResponse.accessToken(), response.getBody().accessToken());
    }

    @Test
    void loginUser_ValidRequest_ReturnsLoginUserResponse() {
        LoginUserRequest request = new LoginUserRequest("testuser", "password");
        LoginUserResponse expectedResponse = new LoginUserResponse("testuser", "mockedToken");
        when(authService.loginUser(any(LoginUserRequest.class))).thenReturn(expectedResponse);

        ResponseEntity<LoginUserResponse> response = authController.loginUser(request);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(expectedResponse.username(), response.getBody().username());
        assertEquals(expectedResponse.accessToken(), response.getBody().accessToken());
    }
}