package com.greenelegance.api.repository;

import com.greenelegance.api.entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Order> findByOrderCode(String orderCode);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o WHERE o.user.id = :userId AND o.status != 'CANCELLED'")
    java.math.BigDecimal sumTotalSpentByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    long countOrdersSince(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countOrdersByStatus(@org.springframework.data.repository.query.Param("status") String status);

    @Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o WHERE o.createdAt >= :startDate AND o.status != 'CANCELLED'")
    java.math.BigDecimal sumRevenueSince(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate);

    // --- Filtered by date range ---
    @Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt < :endDate AND o.status != 'CANCELLED'")
    java.math.BigDecimal sumRevenueBetween(
        @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
        @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate
    );

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt < :endDate")
    long countOrdersBetween(
        @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
        @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate
    );

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt < :endDate AND o.status = 'PENDING_CONFIRMATION'")
    long countPendingOrdersBetween(
        @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
        @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate
    );

    @Query("SELECT cast(o.createdAt as date) as date, SUM(o.grandTotal) as revenue " +
           "FROM Order o WHERE o.createdAt >= :startDate AND o.status != 'CANCELLED' " +
           "GROUP BY cast(o.createdAt as date) ORDER BY cast(o.createdAt as date)")
    java.util.List<Object[]> getDailyRevenueSince(@org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate);

    @Query("SELECT cast(o.createdAt as date) as date, SUM(o.grandTotal) as revenue " +
           "FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt < :endDate AND o.status != 'CANCELLED' " +
           "GROUP BY cast(o.createdAt as date) ORDER BY cast(o.createdAt as date)")
    java.util.List<Object[]> getDailyRevenueBetween(
        @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
        @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate
    );

    @Query("SELECT oi.product.name, SUM(oi.quantity) " +
           "FROM OrderItem oi JOIN oi.order o " +
           "WHERE o.status != 'CANCELLED' " +
           "GROUP BY oi.product.id, oi.product.name " +
           "ORDER BY SUM(oi.quantity) DESC")
    java.util.List<Object[]> getTopProducts(org.springframework.data.domain.Pageable pageable);

    @Query("SELECT oi.product.name, SUM(oi.quantity) " +
           "FROM OrderItem oi JOIN oi.order o " +
           "WHERE o.status != 'CANCELLED' AND o.createdAt >= :startDate AND o.createdAt < :endDate " +
           "GROUP BY oi.product.id, oi.product.name " +
           "ORDER BY SUM(oi.quantity) DESC")
    java.util.List<Object[]> getTopProductsBetween(
        @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
        @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate,
        org.springframework.data.domain.Pageable pageable
    );

    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR :status = '' OR o.status = :status) AND " +
           "(cast(:startDate as timestamp) IS NULL OR o.createdAt >= :startDate) AND " +
           "(cast(:endDate as timestamp) IS NULL OR o.createdAt <= :endDate) AND " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR o.phone LIKE CONCAT('%', :keyword, '%')) " +
           "ORDER BY CASE WHEN o.status = 'PENDING_CONFIRMATION' THEN 0 WHEN o.status = 'CANCELLED' THEN 2 ELSE 1 END ASC, o.createdAt DESC")
    org.springframework.data.domain.Page<Order> findOrdersByFilters(
            @org.springframework.data.repository.query.Param("status") String status,
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
            @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate,
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            org.springframework.data.domain.Pageable pageable);

    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR :status = '' OR o.status = :status) AND " +
           "(cast(:startDate as timestamp) IS NULL OR o.createdAt >= :startDate) AND " +
           "(cast(:endDate as timestamp) IS NULL OR o.createdAt <= :endDate) AND " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR o.phone LIKE CONCAT('%', :keyword, '%')) " +
           "ORDER BY CASE WHEN o.status = 'PENDING_CONFIRMATION' THEN 0 WHEN o.status = 'CANCELLED' THEN 2 ELSE 1 END ASC, o.createdAt DESC")
    java.util.List<Order> findAllOrdersByFilters(
            @org.springframework.data.repository.query.Param("status") String status,
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
            @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate,
            @org.springframework.data.repository.query.Param("keyword") String keyword);
}
