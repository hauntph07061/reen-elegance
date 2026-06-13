package com.greenelegance.api.repository;

import com.greenelegance.api.entity.PointsLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PointsLedgerRepository extends JpaRepository<PointsLedger, Long> {
    List<PointsLedger> findByUserIdOrderByCreatedAtDesc(Long userId);
}
