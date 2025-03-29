package com.ju.e_commerce_project.service;

import com.ju.e_commerce_project.model.User;
import com.ju.e_commerce_project.model.UserRole;
import com.ju.e_commerce_project.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImpTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImp userDetailsService;

    @Test
    void loadUserByUsername_ExistingUsername_ReturnsUserDetails() {
        String username = "testuser";
        User user = new User();
        user.setUsername(username);
        user.setPassword("password");
        user.setRole(UserRole.Customer);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        assertNotNull(userDetails);
        assertEquals(username, userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
        List<SimpleGrantedAuthority> expectedAuthorities = List.of(new SimpleGrantedAuthority("ROLE_Customer"));
        assertEquals(expectedAuthorities, userDetails.getAuthorities().stream().toList());
    }

    @Test
    void loadUserByUsername_NonExistingUsername_ThrowsUsernameNotFoundException() {
        String username = "nonexistentuser";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername(username);
        });
    }
}
