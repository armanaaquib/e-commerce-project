package com.ju.e_commerce_project.repository;

import com.ju.e_commerce_project.model.ProductCategory;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductCategoryRepository extends CrudRepository<ProductCategory, Long> {
    Optional<ProductCategory> findById(Long id);
    List<ProductCategory> findAll();
}
