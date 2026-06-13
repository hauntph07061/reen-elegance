package com.greenelegance.api.dto.admin;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardStatsDto {
    private BigDecimal monthlyRevenue;
    private long newOrdersCount;
    private long pendingOrdersCount;
    private List<TopProductDto> topProducts;
    private List<DailyRevenueDto> dailyRevenues;

    @Data
    @Builder
    public static class TopProductDto {
        private String name;
        private long soldQuantity;
    }

    @Data
    @Builder
    public static class DailyRevenueDto {
        private String date;
        private BigDecimal revenue;
    }
}
