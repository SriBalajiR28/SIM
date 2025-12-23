package com.CMRIT.ims.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CMRIT.ims.dto.Product;
import com.CMRIT.ims.service.ProductServices;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1")
public class ProductController {

	@Autowired
	private ProductServices service;

	@PostMapping
	public ResponseEntity<Product> add(@RequestBody Product product) {
		return ResponseEntity.ok(service.addProduct(product));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Product> update(@PathVariable String id, @RequestBody Product product) {
		return ResponseEntity.ok(service.updateProduct(id, product));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable String id) {
		service.deleteProduct(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Product> get(@PathVariable String id) {
		return ResponseEntity.ok(service.getProduct(id));
	}

	@GetMapping("/low-stock")
	public ResponseEntity<List<Product>> lowStock() {
		return ResponseEntity.ok(service.getLowStockAlerts());
	}

	@GetMapping
	public ResponseEntity<List<Product>> all() {
		return ResponseEntity.ok(service.getAllProducts());
	}

}
