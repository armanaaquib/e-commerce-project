package com.ju.e_commerce_project.devconfig;

import com.ju.e_commerce_project.model.ProductCategory;
import com.ju.e_commerce_project.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Profile;

import java.util.ArrayList;
import java.util.List;

@Configuration
//@Profile("dev")
public class LocalDataSetup {
    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Bean
    public CommandLineRunner insertProductCategory() {
        return args -> {
            // Check if the table is empty before inserting
            if (productCategoryRepository.count() == 0) {
                List<ProductCategory> productCategories = new ArrayList<>();
                productCategories.add(new ProductCategory("Electronics"));
                productCategories.add(new ProductCategory("Clothing"));
                productCategories.add(new ProductCategory("Books"));
                productCategories.add(new ProductCategory("Home & Kitchen"));
                productCategories.add(new ProductCategory("Sports & Outdoors"));
                productCategories.add(new ProductCategory("Beauty & Personal Care"));
                productCategories.add(new ProductCategory("Toys & Games"));
                productCategories.add(new ProductCategory("Automotive"));
                productCategories.add(new ProductCategory("Grocery & Gourmet Foods"));
                productCategories.add(new ProductCategory("Health & Household"));
                productCategories.add(new ProductCategory("Jewelry"));
                productCategories.add(new ProductCategory("Watches"));

                productCategoryRepository.saveAll(productCategories);
            }
        };
    }
}
