package com.ju.e_commerce_project;

import com.ju.e_commerce_project.filter.JwtAuthFilter;
import com.ju.e_commerce_project.model.User;
import com.ju.e_commerce_project.model.UserRole;
import com.ju.e_commerce_project.repository.UserRepository;
import com.ju.e_commerce_project.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(MockitoExtension.class)
class AuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtAuthFilter jwtAuthFilter;

    private User user;
    private String jwtToken;

    @BeforeEach
    void setUp() {
        user = new User("testuser", "encodedPassword", "test@example.com", "Test", "User", "1234567890", "Test Address", UserRole.Customer);
        jwtToken = "mockedToken";
    }

    @Test
    void givenPublicEndpoint_whenRequestWithoutToken_thenReturnsOk() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/products/category/1"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void givenAuthEndpoint_whenRequestWithoutToken_thenReturnsOk() throws Exception {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"testuser\",\"password\":\"password\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void givenSellerEndpoint_whenRequestWithoutToken_thenReturnsUnauthorized() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/products/"))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }

//    @Test
//    @WithMockUser(username = "testuser", roles = {"Seller"})
//    void givenSellerEndpoint_whenRequestWithSellerRole_thenReturnsOk() throws Exception {
//        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername("testuser").password("encodedPassword").roles(UserRole.Seller.name()).build();
//        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
//        when(jwtService.extractUsername(jwtToken)).thenReturn("testuser");
//        when(jwtService.isTokenValid(jwtToken, userDetails)).thenReturn(true);
//        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()));
//
//        mockMvc.perform(MockMvcRequestBuilders.post("/api/products/")
//                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content("{\"name\":\"Test Product\",\"description\":\"Test Description\",\"price\":10.00,\"categoryId\":1,\"sellerId\":1}"))
//                .andExpect(MockMvcResultMatchers.status().isOk());
//    }

    @Test
    @WithMockUser(username = "testuser", roles = {"Customer"})
    void givenSellerEndpoint_whenRequestWithCustomerRole_thenReturnsForbidden() throws Exception {
        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername("testuser").password("encodedPassword").roles(UserRole.Customer.name()).build();
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(jwtService.extractUsername(jwtToken)).thenReturn("testuser");
        when(jwtService.isTokenValid(jwtToken, userDetails)).thenReturn(true);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/products/")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test Product\",\"description\":\"Test Description\",\"price\":10.00,\"categoryId\":1,\"sellerId\":1}"))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    void givenAuthenticatedEndpoint_whenRequestWithoutToken_thenReturnsUnauthorized() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/products/"))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }
}