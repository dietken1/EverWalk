package com.everwalk.service;

import com.everwalk.dto.request.LoginRequest;
import com.everwalk.dto.request.RegisterRequest;
import com.everwalk.dto.response.AuthResponse;
import com.everwalk.dto.response.UserResponse;
import com.everwalk.exception.BadRequestException;
import com.everwalk.model.User;
import com.everwalk.repository.UserRepository;
import com.everwalk.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("이미 사용 중인 이메일입니다");
        }

        // 사용자 생성
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .provider(User.AuthProvider.LOCAL)
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(UserResponse.from(user))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // 사용자 찾기
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("이메일 또는 비밀번호가 올바르지 않습니다"));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("이메일 또는 비밀번호가 올바르지 않습니다");
        }

        log.info("User logged in: {}", user.getEmail());

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(UserResponse.from(user))
                .build();
    }
}
