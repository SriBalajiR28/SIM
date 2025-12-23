package com.CMRIT.ims.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CMRIT.ims.dto.Purchase;

@Repository
public interface PurchaseRepository  extends JpaRepository<Purchase, Long>{
	
}
