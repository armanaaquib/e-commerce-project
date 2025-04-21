package com.ju.e_commerce_project.devconfig;

import com.ju.e_commerce_project.model.Product;
import com.ju.e_commerce_project.model.ProductCategory;
import com.ju.e_commerce_project.model.User;
import com.ju.e_commerce_project.model.UserRole;
import com.ju.e_commerce_project.repository.ProductCategoryRepository;
import com.ju.e_commerce_project.repository.ProductRepository;
import com.ju.e_commerce_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Configuration
//@Profile("Dev")
public class LocalDataSetup {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner insertInitialData() {
        return args -> {
            if (productCategoryRepository.count() == 0) {
                List<ProductCategory> productCategories = new ArrayList<>();
                productCategories.add(new ProductCategory("Electronics"));
                productCategories.add(new ProductCategory("Clothing"));
                productCategories.add(new ProductCategory("Books"));
                productCategories.add(new ProductCategory("Home & Kitchen"));
                productCategories.add(new ProductCategory("Automotive"));
                productCategories.add(new ProductCategory("Jewelry"));
                productCategories.add(new ProductCategory("Others"));

                productCategoryRepository.saveAll(productCategories);

                User seller = userRepository.findByUsername("seller-1").orElseGet(() -> {
                    User newSeller = new User();
                    newSeller.setUsername("seller-1");
                    newSeller.setEmail("seller-1@example.com");
                    newSeller.setPassword(passwordEncoder.encode("password"));
                    newSeller.setFirstName("Dev");
                    newSeller.setLastName("Seller");
                    newSeller.setPhoneNumber("0000000000");
                    newSeller.setAddress("123 Dev Lane");
                    newSeller.setRole(UserRole.Seller);
                    return userRepository.save(newSeller);
                });

                Optional<ProductCategory> electronicsOpt = productCategoryRepository.findById(1L);
                Optional<ProductCategory> clothingOpt = productCategoryRepository.findById(2L);

                if (electronicsOpt.isPresent() && clothingOpt.isPresent()) {
                    ProductCategory electronics = electronicsOpt.get();
                    ProductCategory clothing = clothingOpt.get();

                    List<Product> productsToAdd = new ArrayList<>();

                    productsToAdd.add(new Product("Laptop Pro X", "High-performance laptop for professionals.", new BigDecimal("124999.00"), electronics, seller));
                    productsToAdd.add(new Product("Wireless Noise-Cancelling Headphones", "Immersive sound experience.", new BigDecimal("20749.00"), electronics, seller));
                    productsToAdd.add(new Product("Smartwatch Series 8", "Track your fitness and stay connected.", new BigDecimal("33499.00"), electronics, seller));

                    productsToAdd.add(new Product("Classic Cotton T-Shirt", "Comfortable and versatile.", new BigDecimal("1999.00"), clothing, seller));
                    productsToAdd.add(new Product("Slim Fit Blue Jeans", "Modern style denim.", new BigDecimal("4995.00"), clothing, seller));
                    productsToAdd.add(new Product("Lightweight Bomber Jacket", "Stylish jacket for cool weather.", new BigDecimal("6999.00"), clothing, seller));
                    productRepository.saveAll(productsToAdd);
                } else {
                    System.err.println("Could not find 'Electronics' or 'Clothing' category after attempting to save them.");
                }
            }
        };
    }
}
