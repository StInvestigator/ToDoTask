package com.softserve.todotask;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.modulith.core.ApplicationModules;

@SpringBootTest
class ToDoTaskApplicationTests {

    @Test
    void verifyModules() {
        ApplicationModules modules = ApplicationModules.of(ToDoTaskApplication.class);
        modules.verify();
    }

}
