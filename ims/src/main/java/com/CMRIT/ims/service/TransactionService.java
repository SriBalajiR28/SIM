package com.CMRIT.ims.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.CMRIT.ims.dto.Product;
import com.CMRIT.ims.dto.Purchase;
import com.CMRIT.ims.dto.Sales;
import com.CMRIT.ims.dto.Transaction;
import com.CMRIT.ims.exception.InsufficientStockException;
import com.CMRIT.ims.exception.ResourceNotFoundException;
import com.CMRIT.ims.respository.ProductRepository;
import com.CMRIT.ims.respository.PurchaseRepository;
import com.CMRIT.ims.respository.SalesRepository;
import com.CMRIT.ims.respository.TransactionRepository;

@Service
public class TransactionService {
	@Autowired
	private TransactionRepository transactionRepo;

	@Autowired
	private ProductRepository productRepo;

	@Autowired
	private PurchaseRepository purchaseRepository;

	@Autowired
	private SalesRepository repository;

	public Transaction recordPurchase(String productId, int quantity) {
		Product product = productRepo.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		product.setQuantity(product.getQuantity() + quantity);
		productRepo.save(product);

		Transaction txn = new Transaction();
		txn.setProductId(productId);
		txn.setQuantity(quantity);
		txn.setTotalAmount(quantity * product.getPrice());
		txn.setDate(LocalDate.now());
		txn.setType("PURCHASE");

		Purchase purchase = new Purchase();
		purchase.setProductId(productId);
		purchase.setDate(txn.getDate());
		purchase.setQuantity(quantity);
		purchase.setTotalAmount(txn.getTotalAmount());
		purchaseRepository.save(purchase);
		return transactionRepo.save(txn);
	}

	public Transaction recordSale(String productId, int quantity) {
		Optional<Product> productOpt = productRepo.findById(productId);

		if (productOpt.isEmpty()) {
			throw new RuntimeException("Product ID " + productId + " does not exist.");
		}

		Product product = productOpt.get();

		// Check if enough stock is available
		if (product.getQuantity() < quantity) {
			throw new RuntimeException("Not enough stock for product ID " + productId);
		}

		// Subtract quantity from product stock
		product.setQuantity(product.getQuantity() - quantity);
		productRepo.save(product); // ✅ Save updated product

		// Record the sale transaction
		Transaction tx = new Transaction();
		tx.setProductId(productId);
		tx.setQuantity(quantity);
		tx.setTotalAmount(product.getPrice() * quantity);
		tx.setDate(LocalDate.now());
		tx.setType("SALE");

		return transactionRepo.save(tx);
	}

	public List<Transaction> getTransactionsByType(String type) {
		return transactionRepo.findByType(type);
	}

	public List<Transaction> getTransactionsByDateRange(LocalDate start, LocalDate end) {
		return transactionRepo.findByDateBetween(start, end);
	}

	public List<Transaction> allTransaction() {
		// TODO Auto-generated method stub
		return transactionRepo.findAll();
	}

	public String savePurchase(Purchase request) {
		Optional<Product> product = productRepo.findById(request.getProductId());

		if (product.isEmpty()) {
			return "Error: Product ID " + request.getProductId() + " does not exist.";
		}

		Transaction tx = new Transaction();
		tx.setProductId(request.getProductId());
		tx.setQuantity(request.getQuantity());
		tx.setTotalAmount(request.getTotalAmount());
		tx.setDate(LocalDate.now());
		tx.setType("PURCHASE");

		transactionRepo.save(tx);
		return "Purchase recorded successfully.";
	}

}