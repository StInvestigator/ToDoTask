package com.softserve.todotask.user.internal;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;
import org.springframework.security.core.userdetails.User;

@Getter
public class CustomUserDetails extends User {
    private final Long id;

    public CustomUserDetails(Long id, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.id = id;
    }
}