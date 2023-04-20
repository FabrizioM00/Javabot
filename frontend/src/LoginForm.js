import React from 'react';
import axios from 'axios';
import './w3.css';
import unch from "./imgs/unchecked.png";
import ch from "./imgs/checked.png";
import wrch from "./imgs/wrongcheck.png";



//  la login form comparirà solo se non sono loggato
//  e mi permetterà di inserire nome utente e password        
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { "nickname": "", "password": "", "newPw": "", "repeatPw": "", "changePw": false, "signup": false, "checked": false, "userid": "", "checkImg": unch, "invalidnpw": false, "modifiedpw": false, "sameAsOld": false, "regi": { "success": false, "name": "", "showPwd": false, "showRptPwd": false, "showNewPwd": false }, "errorSignup": "", "invalidLogin": false }
    }

    handleChange = (e) => {

        let varname = e.target.name; // nome della casella di testo modificata
        let value = e.target.value;  // nuovo valore
        let mod = {};                // oggetto per modificare lo stato
        mod[varname] = value;        // riempio l'oggetto

        /* !(e.target.name == "newPw") 
            ? this.setState(mod) 
            : this.setState(mod, () => (this.state.newPw == this.state.password)
                                        ? this.setState({"sameAsOld":true}) 
                                        : this.setState({"sameAsOld":false})); */

        if (e.target.name == "newPw") {
            this.setState(mod, () => (this.state.newPw == this.state.password)
                ? this.setState({ "sameAsOld": true })
                : this.setState({ "sameAsOld": false }));
        } else if (e.target.name == "repeatPw") {
            clearTimeout(this.timeoutto);
            this.setState({ "typing": false })
            this.setState(mod)
        } else this.setState(mod)



        /* (e.target.name == "newPw") && (e.target.value.length > 0) ? this.setState({"invalidnpw": false}) 
        : this.setState(); */ //dopo che cancelli la casella di testo newpw smette di continuare a darti il msg di errore

    }

    understandForm = () => {
        if (!this.state.changePw && !this.state.signup) {
            return "login";
        }
        if (this.state.changePw && !this.state.signup) {
            return "changepw";
        }
        if (this.state.signup && !this.state.changePw) {
            return "register";
        }
    }

    doButtonAction = () => {
        let requestbody = {};

        switch (this.understandForm()) {
            case "login":
                // IO SONO QUELLO CHE VIENE INVIATO ALLA API (@RequestBody)
                axios
                    .post(`/javabot/users/login`, { "nickname": this.state.nickname, "password": this.state.password })
                    .then(response => {
                        this.setState({ "invalidLogin": false });
                        let msg = { "event": "loginok", "user": response.data };
                        // siamo dentro! Lo dico a mio padre  
                        this.props.toparent(msg);
                    }).catch(error => {
                        this.setState({ "invalidLogin": true });
                    });


                break;
            case "changepw":
                if (this.state.checked && this.state.newPw && this.state.userid) {
                    axios
                        .put(`${"/javabot/users/changepwd/" + this.state.userid}`, { "password": this.state.newPw })
                        .then((response) => {
                            this.setState({ "modifiedpw": true });
                        }).catch(error => {
                            alert("utente non trovato");
                        });

                } else if (!this.state.checked) {
                    axios
                        .post(`/javabot/users/login`, { "nickname": this.state.nickname, "password": this.state.password })
                        .then(response => {
                            this.setState({ "checked": true, "checkImg": ch, "userid": response.data.id });
                        }).catch(error => {
                            this.setState({ "checkImg": wrch });
                        });
                } else if (!this.state.newPw) {
                    this.setState({ "invalidnpw": true });
                }

                break;

            case "register":
                if (this.registerIsValid()) {
                    axios
                        .post(`/javabot/users/register`, { "nickname": this.state.nickname, "password": this.state.password })
                        .then(response => {
                            this.setState({ "errorSignup": "", "regi": { "success": true, "name": response.data } });
                        }).catch(error => {
                            error.response.status === 403
                                ? this.setState({ "errorSignup": error.response.data })
                                : console.log(error);
                        });
                }
                break;

            default:
        }
    }

    registerIsValid = () => {
        if ((this.state.password == this.state.repeatPw) && this.state.password != "" && this.state.repeatPw != "") {
            return true;
        }
        return false;
    }

    toLogin = () => {
        this.setState({
            "changePw": false, "signup": false, "checkImg": unch,
            "nickname": "", "password": "", "checked": false, "userid": "", "newPw": "", "invalidnpw": false, "modifiedpw": false, "sameAsOld": false, "typing": false, "repeatPw": "", "inLogin": true, "regi": { "success": false }, "showPwd": false, "showRptPwd": false, "showNewPwd": false, "errorSignup": "", "invalidLogin": false
        });
    }

    toChangePw = () => {
        this.setState({ "changePw": true });
    }

    toRegisterForm = () => {
        this.setState({ "signup": true });
    }

    onChangeForm = () => {
        if (this.state.changePw || this.state.signup)
            return ({ "marginTop": "50px" });
    }

    editTextByForm = (txtinp) => {
        switch (txtinp) {
            case "btninput":
                switch (this.understandForm()) {
                    case "login":
                        return ("Login");
                    case "changepw":
                        return ("Change password");
                    case "register":
                        return ("Register");
                    default:
                }
                break;
            case "hinput":
                switch (this.understandForm()) {
                    case "login":
                        return ("Javabot Login");
                    case "changepw":
                        return ("Javabot Change PW");
                    case "register":
                        return ("Javabot Sign up");
                    default:
                }
                break;
            case "inpwtext":
                switch (this.understandForm()) {
                    case "login":
                        return ("Password:");
                    case "changepw":
                        return ("Old Password:");
                    case "register":
                        return ("Password:");
                    default:
                }
                break;
            case "placetext":
                switch (this.understandForm()) {
                    case "login":
                        return ("Insert Password");
                    case "changepw":
                        return ("Insert OLD Password");
                    case "register":
                        return ("Your Password");
                    default:
                }
                break;
            case "placenick":
                switch (this.understandForm()) {
                    case "login":
                        return ("Insert Nickname");
                    case "changepw":
                        return ("Insert Nickname");
                    case "register":
                        return ("Your Nickname");
                    default:
                }
                break;
            default:
        }
    }

    isTimeoutto = () => {
        if (!this.state.typing)
            this.timeoutto = setTimeout(() => { this.setState({ "typing": true }) }, 1000);
    }

    isPwEquals = () => {
        this.isTimeoutto();
        if (this.state.repeatPw != "" && (this.state.password != this.state.repeatPw) && this.state.typing) {
            return true;
        }
        return false;
    }

    showThisPw = () => {
        if (!this.state.showPwd)
            return { "type": "password", "class": "bi bi-eye-slash" };
        return { "type": "text", "class": "bi bi-eye" };
    }

    showRptPw = () => {
        if (!this.state.showRptPwd)
            return { "type": "password", "class": "bi bi-eye-slash" };
        return { "type": "text", "class": "bi bi-eye" };
    }

    showNewPw = () => {
        if (!this.state.showNewPwd)
            return { "type": "password", "class": "bi bi-eye-slash" };
        return { "type": "text", "class": "bi bi-eye" };
    }

    onClickShowPwd = (e) => {
        if (e.target.getAttribute("name") == "password")
            this.state.showPwd ? this.setState({ "showPwd": false }) : this.setState({ "showPwd": true });
        else if (e.target.getAttribute("name") == "repeatPw")
            this.state.showRptPwd ? this.setState({ "showRptPwd": false }) : this.setState({ "showRptPwd": true });
        else if (e.target.getAttribute("name") == "newPw")
            this.state.showNewPwd ? this.setState({ "showNewPwd": false }) : this.setState({ "showNewPwd": true });
    }

    /* onClickShowRptPwd = () =>
    {
        this.state.showRptPwd ? this.setState({"showRptPwd": false}) : this.setState({"showRptPwd":true});
    }

    onClickShowNewPwd = () =>
    {
        this.state.showNewPwd ? this.setState({"showNewPwd": false}) : this.setState({"showNewPwd":true});
    } */

    doNothing = () => {
        //
    }


    /*     debugState = () =>
        {
            console.log(this.state);
        } */

    /* {
        <input type="button" onClick={this.debugState}/>
        } */

    showNickPwd = () => {
        return (
            <>
                <label htmlFor="nickname">Nickname:</label><br></br>
                <input disabled={this.state.checked ? true : ""}
                    type="text"
                    name="nickname"
                    className="w3-input"
                    value={this.state.nickname}
                    onChange={(e) => this.handleChange(e)}
                    placeholder={this.editTextByForm("placenick")}
                />

                <label htmlFor="password">{this.editTextByForm("inpwtext")}</label><br></br>
                <input disabled={this.state.checked ? true : ""}
                    name="password"
                    type={this.showThisPw().type}
                    className="w3-input"
                    style={{ "display": "inline", "marginLeft": "-10px" }}
                    placeholder={this.editTextByForm("placetext")}
                    value={this.state.password}
                    onChange={(e) => this.handleChange(e)}
                /><i name="password" className={this.showThisPw().class} style={{ "marginLeft": "-30px", "cursor": "pointer" }}
                    onClick={(e) => this.onClickShowPwd(e)}></i>

            </>
        )
    }


    render() {
        return (
            <center style={{ "marginTop": "10%" }}>
                <div className="divformlogin w3-card-4 ">
                    <h2 className="darkgreen">{this.editTextByForm("hinput")}</h2>
                    {
                        (this.state.changePw || this.state.signup) &&
                        <img className="imgclick" alt="back" title="back to login"
                            src={require('.//imgs/backarrow.png')}
                            width="35" height="35" style={{ "float": "left", "marginLeft": "10px" }}
                            onClick={this.toLogin} />
                    }
                    <form style={this.onChangeForm()} >
                        <center>

                            {
                                !this.state.regi.success &&
                                this.showNickPwd()
                            }

                            {
                                this.understandForm() == "register" && !this.state.regi.success &&
                                <>
                                    <input
                                        name="repeatPw"
                                        type={this.showRptPw().type}
                                        className="w3-input"
                                        style={{ "display": "inline", "marginLeft": "-10px" }}
                                        placeholder="Repeat your password"
                                        value={this.state.repeatPw}
                                        onChange={(e) => this.handleChange(e)}
                                    /><i name="repeatPw" className={this.showRptPw().class} style={{ "marginLeft": "-30px", "cursor": "pointer" }} onClick={(e) => this.onClickShowPwd(e)}></i>
                                </>
                            }

                            {
                                this.understandForm() == "register" && this.state.errorSignup &&
                                <p style={{ "color": "red" }}>{this.state.errorSignup}</p>
                            }

                            {
                                this.state.regi.success &&
                                <h3 style={{ "color": "green" }}> Thanks for registering {this.state.regi.name}!</h3>
                            }

                            {
                                this.isPwEquals() &&
                                <p style={{ "color": "red" }}>Passwords are not the same!</p>
                            }

                            {
                                this.understandForm() == "changepw" &&
                                <img className={this.state.checked ? "" : "imgclick"} alt="checkme" title="check your login"
                                    style={{ "marginRight": "-25px", "marginLeft": "15px" }}
                                    src={this.state.checkImg}
                                    width="20" height="20"
                                    onClick={this.state.checked ? this.doNothing : this.doButtonAction} />
                            }

                            {
                                this.understandForm() == "changepw" &&
                                <br />
                            }

                            {
                                this.state.checkImg === wrch &&
                                <p style={{ "color": "red" }}>Invalid Login, please check again</p>
                            }

                            {
                                this.understandForm() == "login" && this.state.invalidLogin &&
                                <p style={{ "color": "red" }}>Invalid Login, please try again</p>
                            }

                            {
                                this.understandForm() == "changepw" && this.state.checked &&
                                <label htmlFor="newPassword">New Password:</label>
                            }
                            {

                                this.understandForm() == "changepw" && this.state.checked &&
                                <>
                                    <input disabled={this.state.modifiedpw ? true : ""}
                                        name="newPw"
                                        type={this.showNewPw().type}
                                        className="w3-input"
                                        style={{ "display": "inline", "marginLeft": "-10px" }}
                                        placeholder='Insert NEW Password'
                                        value={this.state.newPw}
                                        onChange={(e) => this.handleChange(e)}
                                    /><i name="newPw" className={this.showNewPw().class} style={{ "marginLeft": "-30px", "cursor": "pointer" }} onClick={(e) => this.onClickShowPwd(e)}></i>
                                </>
                            }

                            {
                                this.state.invalidnpw && !this.state.newPw &&
                                <p style={{ "color": "red" }}>new password can't be empty</p>
                            }

                            {
                                this.state.sameAsOld &&
                                <p style={{ "color": "red" }}>can't use old password as new</p>
                            }

                            {
                                this.understandForm() == "login" &&
                                <br />
                            }

                            {
                                this.understandForm() == "login" &&
                                <>
                                    <u className="underltext" onClick={this.toChangePw}>change password by login?</u>

                                </>
                            }<br /><br />

                            {
                                this.state.modifiedpw &&
                                <h3 style={{ "color": "green" }}>Password changed!</h3>
                            }

                            {
                                !this.state.modifiedpw && !this.state.regi.success &&
                                <input type="button" className="w3-btn w3-input darkgreen" value={this.editTextByForm("btninput")} onClick={this.doButtonAction} disabled={(this.understandForm() == "changepw" && !this.state.checked) || this.state.sameAsOld} />
                            }

                            {
                                this.understandForm() == "login" &&
                                <u className="underltext" onClick={this.toRegisterForm}>no account? register now!</u>
                            }
                        </center>
                    </form>
                </div>
            </center>
        );
    }
}

export default LoginForm;