package com.test.javabot.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

import com.test.javabot.model.Message;
import com.test.javabot.model.User;

/**
 * 
 * Session: la "sessione" fra me e un singolo utente
 * Conterrà il suo login e la storia della nostra interazione
 * @author Fabrizio
 *
 *
 *SessionScope = verrà creato un oggetto di questa classe
 *per ogni utente che si connetterà
 */
@Service
@SessionScope
public class Session 
{
	// utente loggato
	private User user;
	
	private List<Message> sessionMessages = new ArrayList<Message>();

	public int getLevel()
	{
		return user == null ? 0 : 1;
	}
	
	
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<Message> getSessionMessages() {
		return sessionMessages;
	}

	public void setSessionMessages(List<Message> sessionMessages) {
		this.sessionMessages = sessionMessages;
	}
	
}
