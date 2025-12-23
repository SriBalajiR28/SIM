package com.CMRIT.ims.respository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CMRIT.ims.dto.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
	List<Transaction> findByType(String type);
	List<Transaction> findByDateBetween(LocalDate start, LocalDate end);

}
