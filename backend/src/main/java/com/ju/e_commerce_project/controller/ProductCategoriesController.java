package com.ju.e_commerce_project.controller;

import com.ju.e_commerce_project.model.ProductCategory;
import com.ju.e_commerce_project.service.ProductCategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/product-categories")
public class ProductCategoriesController {

    private final ProductCategoryService productCategoryService;

    public ProductCategoriesController(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @GetMapping
    public List<ProductCategory> getAllCategories() {
        return productCategoryService.getAllCategories();
    }
}
