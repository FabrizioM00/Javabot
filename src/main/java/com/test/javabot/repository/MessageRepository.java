package com.test.javabot.repository;

import java.util.List;

import com.test.javabot.model.Message;
import com.test.javabot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MessageRepository extends JpaRepository<Message,Integer>
{

	List<Message> findByUser(User user);

	List<Message> findByInreplyto(Message message);

	void deleteByUser(User user);
	
}
