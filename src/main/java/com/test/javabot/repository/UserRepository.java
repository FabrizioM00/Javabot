package com.test.javabot.repository;

import java.util.Optional;

import com.test.javabot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Integer>
{

	Optional<User> findByNicknameAndPassword(String nickname, String password);
	
	Optional<User> findByNickname(String nickname);
	
}
