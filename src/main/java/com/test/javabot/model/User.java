package com.test.javabot.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class User implements Serializable
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String nickname, password;

	@OneToMany(mappedBy = "user")
	private List<Message> messages = new ArrayList<Message>();

	public User() {
	}
	public User(int id, String nickname, String password, List<Message> messages) {
		this.id = id;
		this.nickname = nickname;
		this.password = password;
		this.messages = messages;
	}

	public User(String nickname, String password, List<Message> messages) {
		this.nickname = nickname;
		this.password = password;
		this.messages = messages;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String name) {
		this.nickname = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
