package com.ju.e_commerce_project.service;

import com.ju.e_commerce_project.dto.reponse.LoginUserResponse;
import com.ju.e_commerce_project.dto.reponse.RegisterUserResponse;
import com.ju.e_commerce_project.dto.request.LoginUserRequest;
import com.ju.e_commerce_project.dto.request.RegisterUserRequest;
import com.ju.e_commerce_project.exception.UserAlreadyExistException;
import com.ju.e_commerce_project.model.User;
import com.ju.e_commerce_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    public RegisterUserResponse registerUser(RegisterUserRequest userRequest) {
        if (userRepository.existsByUsername(userRequest.username())) {
            throw new UserAlreadyExistException("Username already exists");
        }
        if (userRepository.existsByEmail(userRequest.email())) {
            throw new UserAlreadyExistException("Email already exists");
        }

        var user = new User(
                userRequest.username(),
                passwordEncoder.encode(userRequest.password()),
                userRequest.email(),
                userRequest.firstName(),
                userRequest.lastName(),
                userRequest.phoneNumber(),
                userRequest.address(),
                userRequest.role()
        );
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(userRequest.username());
        String token = jwtService.generateToken(userDetails);

        return new RegisterUserResponse(userRequest.username(), token);
    }

    public LoginUserResponse loginUser(LoginUserRequest userRequest) {
        try {
            // Authenticate the user using Spring Security's AuthenticationManager
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userRequest.username(), userRequest.password())
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid credentials"); // Re-throw for consistent error handling
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(userRequest.username());
        String token = jwtService.generateToken(userDetails);

        return new LoginUserResponse(userRequest.username(), token);
    }

    public User findUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return userOptional.get();
    }
}
