package com.test.javabot.controller;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.test.javabot.service.MessageService;
import com.test.javabot.service.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.test.javabot.model.Message;

@RestController
@RequestMapping("/javabot/messages")
public class MessageController 
{
	@Autowired
	MessageService messageService;
	
	/**
	 * Restituisce il JSON con tutti i messaggi dell'utente LOGGATO
	 * @return
	 */
	@GetMapping("")
	public ResponseEntity<List<Message>> findMessages()
	{
		return messageService.getMessages();
	}
	
	@PostMapping("")
	public ResponseEntity<List<Message>> addMessage(@RequestBody Message message)
	{
		return messageService.saveMessage(message);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteMessage(@PathVariable int id)
	{
		return messageService.delete(id);
	}

	@DeleteMapping("/delall")
	public ResponseEntity<String> deleteMessage()
	{
		return messageService.deleteAllMsg();
	}


}
