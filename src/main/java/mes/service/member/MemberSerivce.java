package mes.service.member;

import lombok.extern.slf4j.Slf4j;
import mes.domain.entity.member.MemberEntity;
import mes.domain.entity.member.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service @Slf4j
public class MemberSerivce {

    @Autowired private MemberRepository memberRepository;

    // 1. 로그인
    public boolean login(String mname, String password) { log.info("login:" + mname);
        MemberEntity member = memberRepository.findByUsernameAndPassword(mname, password);
        return true;
    }
}
