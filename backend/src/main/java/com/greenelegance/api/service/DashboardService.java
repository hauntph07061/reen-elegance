package com.greenelegance.api.service;

import com.greenelegance.api.dto.admin.DashboardStatsDto;
import com.greenelegance.api.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrderRepository orderRepository;

    public DashboardStatsDto getDashboardStats(Integer month, Integer year) {
        LocalDateTime startDate;
        LocalDateTime endDate;
        
        boolean isYearly = month == null && year != null;
        boolean isMonthly = month != null && year != null;
        boolean isFiltered = isMonthly || isYearly;

        if (isMonthly) {
            startDate = LocalDateTime.of(year, month, 1, 0, 0, 0);
            endDate = startDate.plusMonths(1);
        } else if (isYearly) {
            startDate = LocalDateTime.of(year, 1, 1, 0, 0, 0);
            endDate = startDate.plusYears(1);
        } else {
            endDate = LocalDateTime.now();
            startDate = endDate.minus(30, ChronoUnit.DAYS);
        }

        LocalDateTime startOfRange = isFiltered ? startDate : LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);


        BigDecimal revenue = isFiltered ? 
            orderRepository.sumRevenueBetween(startDate, endDate) : 
            orderRepository.sumRevenueSince(startOfRange);
            
        long newOrdersCount = isFiltered ? 
            orderRepository.countOrdersBetween(startDate, endDate) : 
            orderRepository.countOrdersSince(startDate);
            
        long pendingOrdersCount = isFiltered ? 
            orderRepository.countPendingOrdersBetween(startDate, endDate) : 
            orderRepository.countOrdersByStatus("PENDING_CONFIRMATION");

        List<Object[]> rawTopProducts = isFiltered ? 
            orderRepository.getTopProductsBetween(startDate, endDate, PageRequest.of(0, 5)) : 
            orderRepository.getTopProducts(PageRequest.of(0, 5));
            
        List<DashboardStatsDto.TopProductDto> topProducts = rawTopProducts.stream()
                .map(obj -> DashboardStatsDto.TopProductDto.builder()
                        .name((String) obj[0])
                        .soldQuantity(((Number) obj[1]).longValue())
                        .build())
                .collect(Collectors.toList());

        List<Object[]> rawDailyRevenue = isFiltered ? 
            orderRepository.getDailyRevenueBetween(startDate, endDate) : 
            orderRepository.getDailyRevenueSince(startDate);
            
        List<DashboardStatsDto.DailyRevenueDto> dailyRevenues = rawDailyRevenue.stream()
                .map(obj -> DashboardStatsDto.DailyRevenueDto.builder()
                        .date(obj[0].toString())
                        .revenue((BigDecimal) obj[1])
                        .build())
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .monthlyRevenue(revenue)
                .newOrdersCount(newOrdersCount)
                .pendingOrdersCount(pendingOrdersCount)
                .topProducts(topProducts)
                .dailyRevenues(dailyRevenues)
                .build();
    }
}

