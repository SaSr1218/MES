package mes.service.performance;

import lombok.extern.slf4j.Slf4j;
import mes.domain.Repository.product.ProductPlanRepository;
import mes.domain.dto.product.ProductProductionByMonthDto;
import mes.domain.dto.product.ProductProductionByQuarterDto;
import mes.domain.dto.product.ProductProductionByYearDto;
import mes.domain.dto.product.ProductProductionDto;
import mes.domain.dto.sales.SalesByCompanyDto;
import mes.domain.dto.sales.SalesByMemberDto;
import mes.domain.dto.sales.SalesByProductDto;
import mes.domain.entity.member.PermissionDeniedException;
import mes.domain.entity.sales.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service@Slf4j
public class PerformanceService { // 실적(생산/판매) 조회

    @Autowired private ProductPlanRepository productPlanRepository;
    @Autowired private SalesRepository salesRepository;

    // repository 소통 창구 (type: 1 - 생산실적, 2 - 판매실적) 코드 단순화 적용
    public List<?> getPerformanceDto(int type){
        if( type == 1){ // 생산실적
            return productPlanRepository.findProductProduction();
        } else if( type == 2){ // 판매실적
            return salesRepository.findSalesByProduct();
        } else{
            throw new IllegalArgumentException("알 수 없는 요청");
        }
    }
}