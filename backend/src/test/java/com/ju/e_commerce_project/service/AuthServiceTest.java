package com.ju.e_commerce_project.service;

import com.ju.e_commerce_project.dto.response.LoginUserResponse;
import com.ju.e_commerce_project.dto.response.RegisterUserResponse;
import com.ju.e_commerce_project.dto.request.LoginUserRequest;
import com.ju.e_commerce_project.dto.request.RegisterUserRequest;
import com.ju.e_commerce_project.exception.UserAlreadyExistException;
import com.ju.e_commerce_project.model.User;
import com.ju.e_commerce_project.model.UserRole;
import com.ju.e_commerce_project.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private JwtService jwtService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerUser_NewUser_ReturnsRegisterUserResponse() {
        RegisterUserRequest request = new RegisterUserRequest("testuser", "password", "test@example.com", "Test", "User", "1234567890", "Test Address", UserRole.Customer);
        when(userRepository.existsByUsername(request.username())).thenReturn(false);
        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("encodedPassword");
        when(userDetailsService.loadUserByUsername(request.username())).thenReturn(org.springframework.security.core.userdetails.User.withUsername(request.username()).password("encodedPassword").roles(request.role().name()).build());
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("mockedToken");

        RegisterUserResponse response = authService.registerUser(request);

        assertNotNull(response);
        assertEquals(request.username(), response.username());
        assertEquals("mockedToken", response.accessToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerUser_ExistingUsername_ThrowsUserAlreadyExistException() {
        RegisterUserRequest request = new RegisterUserRequest("testuser", "password", "test@example.com", "Test", "User", "1234567890", "Test Address", UserRole.Customer);
        when(userRepository.existsByUsername(request.username())).thenReturn(true);

        assertThrows(UserAlreadyExistException.class, () -> authService.registerUser(request));
    }

    @Test
    void registerUser_ExistingEmail_ThrowsUserAlreadyExistException() {
        RegisterUserRequest request = new RegisterUserRequest("testuser", "password", "test@example.com", "Test", "User", "1234567890", "Test Address", UserRole.Customer);
        when(userRepository.existsByUsername(request.username())).thenReturn(false);
        when(userRepository.existsByEmail(request.email())).thenReturn(true);

        assertThrows(UserAlreadyExistException.class, () -> authService.registerUser(request));
    }

    @Test
    void loginUser_ValidCredentials_ReturnsLoginUserResponse() {
        LoginUserRequest request = new LoginUserRequest("testuser", "password");
        User user = new User(request.username(), "encodedPassword", "test@example.com", "Test", "User", "1234567890", "Test Address", UserRole.Customer);
        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername(request.username()).password("encodedPassword").roles(UserRole.Customer.name()).build();
        when(userRepository.findByUsername(request.username())).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(userDetailsService.loadUserByUsername(request.username())).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("mockedToken");

        LoginUserResponse response = authService.loginUser(request);

        assertNotNull(response);
        assertEquals(request.username(), response.username());
        assertEquals("mockedToken", response.accessToken());
    }

    @Test
    void loginUser_InvalidCredentials_ThrowsBadCredentialsException() {
        LoginUserRequest request = new LoginUserRequest("testuser", "wrongpassword");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.loginUser(request));
    }

    @Test
    void findUserByUsername_ExistingUsername_ReturnsUser() {
        String username = "testuser";
        User user = new User(username, "encodedPassword", "test@example.com", "Test", "User", "1234567890", "Test Address", UserRole.Customer);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        User foundUser = authService.findUserByUsername(username);

        assertNotNull(foundUser);
        assertEquals(username, foundUser.getUsername());
    }

    @Test
    void findUserByUsername_NonExistingUsername_ThrowsUsernameNotFoundException() {
        String username = "nonexistentuser";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> authService.findUserByUsername(username));
    }
}
