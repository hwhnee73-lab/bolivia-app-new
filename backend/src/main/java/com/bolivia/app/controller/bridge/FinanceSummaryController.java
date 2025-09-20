package com.bolivia.app.controller.bridge;

import com.bolivia.app.entity.Bill;
import com.bolivia.app.repository.BillRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/finance")
public class FinanceSummaryController {

    private final BillRepository billRepository;

    public FinanceSummaryController(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary(@RequestParam("month") String month) {
        List<Bill> bills = billRepository.findByBillMonth(month);
        int totalUnits = bills.size();
        int paidUnits = (int) bills.stream().filter(b -> b.getStatus() == Bill.BillStatus.PAID).count();
        int unpaidUnits = totalUnits - paidUnits;
        double collectionRate = totalUnits == 0 ? 0.0 : Math.round((paidUnits * 10000.0 / totalUnits)) / 100.0;

        Map<String, Object> body = new HashMap<>();
        body.put("billMonth", month);
        body.put("totalUnits", totalUnits);
        body.put("paidUnits", paidUnits);
        body.put("unpaidUnits", unpaidUnits);
        body.put("collectionRate", collectionRate);
        return ResponseEntity.ok(body);
    }
}

