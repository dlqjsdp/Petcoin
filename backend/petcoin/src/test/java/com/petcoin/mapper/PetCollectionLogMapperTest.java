package com.petcoin.mapper;

import com.petcoin.domain.PetCollectionLogVO;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;
import java.sql.Connection;
import java.sql.DriverManager;

class MySqlConnectionTest {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/petcoin?serverTimezone=UTC";
        String user = "petcoin";
        String password = "1234";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver"); // 드라이버 로딩
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("✅ 연결 성공: " + conn);
            conn.close();
        } catch (Exception e) {
            System.out.println("❌ 연결 실패:");
            e.printStackTrace();
        }
    }
}

@SpringBootTest
@Slf4j
public class PetCollectionLogMapperTest {

    @Autowired
    private PetCollectionLogMapper mapper;

    @Test
    public void insertTest() {
        PetCollectionLogVO vo = PetCollectionLogVO.builder()
                .runId(3L)
                .memberId(3L)
                .petRejectionId(1L)
                .aiConfidence(70.00)
                .isCollected(true)
                .imgPath("test.jpg")
                .build();

        mapper.insertPetCollectionLog(vo);

        assertNotNull(vo.getPetCollectionId(), "id는 null값이면 안됩니다.");

    }

}