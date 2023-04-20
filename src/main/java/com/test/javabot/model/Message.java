package com.test.javabot.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Message implements Serializable
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String content, type;

//	@JoinColumn(name = "deleted_reply")
	private boolean deletedReply;
	private LocalDateTime sent;
	
	@ManyToOne
	@JoinColumn(name = "userid")
	private User user;
	
	@OneToMany(mappedBy = "inreplyto")
	private List<Message> referencedBy = new ArrayList<Message>();
	
	@ManyToOne
	@JoinColumn(name = "replyto")
	Message inreplyto;

	public Message() {
	}

	public Message(int id, String content, String type, boolean deletedReply, LocalDateTime sent, User user, List<Message> referencedBy, Message inreplyto) {
		this.id = id;
		this.content = content;
		this.type = type;
		this.deletedReply = deletedReply;
		this.sent = sent;
		this.user = user;
		this.referencedBy = referencedBy;
		this.inreplyto = inreplyto;
	}

	public Message(String content, String type, boolean deletedReply, LocalDateTime sent, User user, List<Message> referencedBy, Message inreplyto) {
		this.content = content;
		this.type = type;
		this.deletedReply = deletedReply;
		this.sent = sent;
		this.user = user;
		this.referencedBy = referencedBy;
		this.inreplyto = inreplyto;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public boolean isDeletedReply() { return deletedReply; }

	public void setDeletedReply(boolean deleted) { this.deletedReply = deleted; }

	public LocalDateTime getSent() {
		return sent;
	}

	public void setSent(LocalDateTime sent) {
		this.sent = sent;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public void setReferencedBy(List<Message> referencedBy) {
		this.referencedBy = referencedBy;
	}

	public Message getInreplyto() {
		return inreplyto;
	}

	public void setInreplyto(Message inreplyto) {
		this.inreplyto = inreplyto;
	}

}
