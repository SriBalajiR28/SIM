package com.CMRIT.ims.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CMRIT.ims.dto.Transaction;
import com.CMRIT.ims.service.TransactionService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
	@Autowired
	private TransactionService service;

	@PostMapping("/purchase")
	public ResponseEntity<?> purchase(@RequestParam String productId, @RequestParam int quantity) {
		try {
			Transaction tx = service.recordPurchase(productId, quantity);
			return ResponseEntity.ok(tx);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PostMapping("/sale")
	public ResponseEntity<?> sale(@RequestParam String productId, @RequestParam int quantity) {
		try {
			Transaction tx = service.recordSale(productId, quantity);
			return ResponseEntity.ok(tx);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/report")
	public ResponseEntity<List<Transaction>> report(@RequestParam String type) {
		return ResponseEntity.ok(service.getTransactionsByType(type));
	}

	@GetMapping("/report/date")
	public ResponseEntity<List<Transaction>> reportByDate(@RequestParam String start, @RequestParam String end) {
		LocalDate from = LocalDate.parse(start);
		LocalDate to = LocalDate.parse(end);
		return ResponseEntity.ok(service.getTransactionsByDateRange(from, to));
	}

	@GetMapping
	public ResponseEntity<List<Transaction>> getTransactions(@RequestParam(required = false) String type) {
		List<Transaction> transactions;

		if (type == null || type.equalsIgnoreCase("ALL")) {
			transactions = service.allTransaction();
		} else {
			transactions = service.getTransactionsByType(type.toUpperCase());
		}
		return ResponseEntity.ok(transactions);
	}
}