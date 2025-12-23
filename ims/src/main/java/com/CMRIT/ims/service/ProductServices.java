package com.CMRIT.ims.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.CMRIT.ims.dto.Product;
import com.CMRIT.ims.exception.ResourceNotFoundException;
import com.CMRIT.ims.respository.ProductRepository;

@Service
public class ProductServices {
	@Autowired
	private ProductRepository repo;

	public Product addProduct(Product product) {
		return repo.save(product);
	}

	public Product updateProduct(String id, Product updated) {
		Product existing = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		existing.setName(updated.getName());
		existing.setQuantity(updated.getQuantity());
		existing.setPrice(updated.getPrice());
		existing.setLowStockThreshold(updated.getLowStockThreshold());
		return repo.save(existing);
	}

	public void deleteProduct(String id) {
		repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		repo.deleteById(id);
	}

	public Product getProduct(String id) {
		System.err.println(repo.findById(id));
		return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
	}

	public List<Product> getLowStockAlerts() {
		return repo.findByQuantityLessThan(10); // or use dynamic threshold
	}

	public List<Product> getAllProducts() {
		return repo.findAll();
	}
}