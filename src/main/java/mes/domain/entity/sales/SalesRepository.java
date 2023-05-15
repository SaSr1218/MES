package mes.domain.entity.sales;

import mes.domain.dto.performance.SalesByProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesRepository extends JpaRepository< SalesEntity , Integer > {
// 생산실적 및 판매실적 Query 구성 인터페이스 (추후 합치기 작업 필요)

    // page , key , keyword [ 판매 회사명, 판매상태 검색 ] --> 추후 : 판매개수 , 판매액 등등?
/*    @Query(value = "select * " +
            "from sales s inner join company c " +
            "on s.cno = c.cno and if(:key = '', true, " +
            "if(:key = 'orderStatus' , s.order_status like %:keyword% , c.cname like %:keyword%))",
            nativeQuery = true )
    Page<SalesEntity> findBySearch(Pageable pageable , String key , String keyword);*/

    // sales order_status 값 찾기 위함
    @Query(value = "select * from sales where if(:keyword = '', TRUE, order_status LIKE %:keyword%)" , nativeQuery = true)
    Page<SalesEntity> findByPage(String keyword , Pageable pageable);

    @Query(value = "select * from sales where al_app_no=:al_app_no", nativeQuery = true)
    SalesEntity findByAllowId(int al_app_no);

    // 제품별 판매실적 쿼리 (조회 데이터: 제품명, 제품원가, 평균판매가격, 총 주문건수, 총 판매금액, 수익금, 수익률) [23.05.14, th]
    @Query(value = "SELECT new mes.domain.dto.performance.SalesByProductDto(p.prodName, " +
            "CAST(AVG(p.prodPrice) AS long) AS prodPrice, " +
            "CAST(AVG(s.salesPrice) AS long) AS averageSalesPrice, " +
            "SUM(s.orderCount) AS totalOrderCount, " +
            "CAST(SUM(s.salesPrice * s.orderCount) AS long) AS totalSalesAmount, " +
            "CAST(SUM(s.salesPrice * s.orderCount) - (AVG(p.prodPrice) * SUM(s.orderCount)) AS int) AS profit, " +
            "ROUND(((SUM(s.salesPrice * s.orderCount) - (p.prodPrice * SUM(s.orderCount))) / SUM(s.salesPrice * s.orderCount)) * 100, 2) AS profitMargin) " +
            "FROM SalesEntity s " +
            "JOIN s.productEntity p " +
            "JOIN s.memberEntity m " +
            "JOIN s.companyEntity c " +
            "GROUP BY p.prodName, p.prodPrice " +
            "ORDER BY SUM(s.salesPrice * s.orderCount) DESC, p.prodName ASC")
    List<SalesByProductDto> findSalesByProduct();
    // 특이점: new Dto 이용하여 쿼리 결과를 클래스의 인스턴스로 직접 매핑
}
