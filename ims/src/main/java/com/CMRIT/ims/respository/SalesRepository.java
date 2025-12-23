package com.CMRIT.ims.respository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CMRIT.ims.dto.Sales;

@Repository
public interface SalesRepository extends JpaRepository<Sales, Long>{

}
