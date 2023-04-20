import React from 'react';
import './App.css';
import axios from 'axios';
import LoginForm from './LoginForm';
import Message from './Message';

// La classe APP avrà bisogno di dati dalle API
// per funzionare. Vuol dire che dovrà fare richieste HTTP, AXIOS
// in particolare, l'idea è che ogni componente faccia le richieste che gli serviranno
// in particolare App avrà bisogno prima di tutto di fare il login
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { "logged": false, "loaded": false, "text": "", "messages": [], "inreplyto": null }
    }


    callback = (msg) => {
        switch (msg.event) {
            case "loginok":
                this.setState({ "user": msg.user, "logged": true });
                axios.get("/javabot/messages").then((response) => {
                    this.setState({ "messages": response.data, "loaded": true });
                });
                let msgbox = document.getElementById('messageCntainer');
                if (msgbox != null) {
                    setTimeout(() => { msgbox.scrollTop = msgbox.scrollHeight; }, 0);
                }

                break;
            case "delete":
                axios
                    .delete(`${"/javabot/messages/" + msg.id}`)
                    .then((response) => {
                        if (response.status >= 400) { //lui si attiva per code 400/500 e affini
                            alert("Non puoi cancellare questo messaggio!");
                        } else { //lui si attiva per code 200 e affini
                            let messages = this.state.messages;
                            messages = messages.filter((x) => (x.id != msg.id));
                            messages.filter((x) => (x.inreplyto != null && x.inreplyto.id == msg.id)).map((x) => ((x.deletedReply = true)));
                            this.setState({ "messages": messages, "inreplyto": null });
                        }
                    });
                break;
            case "inreplyto":
                let id = msg.id;
                if (this.state.inreplyto && this.state.inreplyto.id == msg.id) {
                    this.setState({ "inreplyto": null });
                } else {
                    for (let message of this.state.messages)
                        if (message.id == id)
                            this.setState({ "inreplyto": message });
                }


                break;
            default:
        }
    }

    handleInput = (e) => {
        let mod = {};
        // creo una chiave che si chiama come la casella di testo
        mod[e.target.name] = e.target.value;
        this.setState(mod);
    }

    handleKey = (e) => {
        if (e.code === 'Enter' && this.state.text) {
            axios
                .post(`/javabot/messages`, { "content": this.state.text, "inreplyto": this.state.inreplyto })
                .then(response => {
                    if (response.status >= 400) { //lui si attiva per code 400/500 e affini
                        alert("Non puoi inviare il messaggio");
                    } else { //lui si attiva per code 200 e affini
                        response.data[0].sent = response.data[0].sent.split(".")[0];

                        let userMessages = this.state.messages;
                        userMessages.push(response.data[0]);
                        this.setState({ "text": "", "inreplyto": null, "messages": userMessages });
                        if (response.data[1] != null) {
                            response.data[1].sent = response.data[1].sent.split(".")[0];
                            userMessages.push(response.data[1]);
                        }
                        let msgbox = document.getElementById('messageCntainer');
                        if (msgbox != null) {
                            setTimeout(() => { msgbox.scrollTop = msgbox.scrollHeight; }, 0);
                        }
                    }
                });
        }
    }

    getQuotedSummary = () => {
        let parts = this.state.inreplyto.content.split(" ");
        let firstTenWords = "";
        for (let i = 0; i < parts.length && i < 10; i++)
            firstTenWords += parts[i] + " ";

        firstTenWords += " ...";

        let who = this.state.inreplyto.type === "mine" ? "me" : "bot";
        return "Responding to " + who + ": '" +
            firstTenWords + "'";

    }

    tryLogout = () => {
        axios.get("/javabot/users/logout");
        this.setState({ "logged": false, "inreplyto": null });
    }

    deleteUserMsgs = () => {
        axios
            .delete(`${"/javabot/messages/delall"}`)
            .then((response) => {
                if (response.status >= 400) { //lui si attiva per code 400/500 e affini
                    alert("Impossibile rimuovere messaggi");
                } else { //lui si attiva per code 200 e affini
                    this.setState({ "messages": [] });
                }
            }).catch(error => {
                alert("La chat è già vuota!");
            });


    }

    render() {
        if (!this.state.logged)
            return (<div><LoginForm toparent={this.callback} /></div>);

        if (!this.state.loaded)
            return (<div> Loading ...</div>);

        return (
            <div>
                <div className="header">
                    Welcome {this.state.user.nickname}

                    <img className='imghover' alt="Login" title="logout"
                        src={require('.//imgs/lgouticon.png')}
                        width="48" height="48" style={{ "float": "right", "cursor": "pointer", "borderRadius": "5px" }}
                        onClick={this.tryLogout} />

                    <div className="dropdown">
                        <img className="dropbtn" alt="gear" title="options"
                            src={require('.//imgs/gear.png')}
                            width="48" height="48"
                            onClick={this.toggleContextMenu} />

                        <div className="dropdown-content">
                            <a className='pstyle' onClick={this.deleteUserMsgs}>Remove chat</a>
                            <a className='pstyle' >Delete account</a>
                        </div>
                    </div>
                </div>
                <div id="messageCntainer" className="messagescontainer">
                    {this.state.messages.map(
                        (x) => (
                            <Message key={x.id} id={x.id} content={x.content}
                                sent={x.sent} type={x.type} inreplyto={x.inreplyto} deletedReply={x.deletedReply}
                                toparent={this.callback} />
                        )
                    )}
                </div>
                {
                    this.state.inreplyto
                    &&
                    <div className="quoted" style={{ "clear": "both", "marginLeft": "1%", "marginRight": "1%" }}>
                        {this.getQuotedSummary()}
                    </div>
                }
                <div style={{ "clear": "both" }}>
                    <input className="w3-input" placeholder="Type your messagge"
                        name="text"
                        value={this.state.text} onChange={(e) => { this.handleInput(e) }}
                        onKeyUp={(e) => { this.handleKey(e) }}
                    />

                </div>
            </div>
        );
    }
}
export default App;
