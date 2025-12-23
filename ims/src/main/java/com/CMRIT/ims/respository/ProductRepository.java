package com.CMRIT.ims.respository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import com.CMRIT.ims.dto.Product;

@Component
public interface ProductRepository extends JpaRepository<Product, String> {
	 List<Product> findByQuantityLessThan(int threshold);
}
