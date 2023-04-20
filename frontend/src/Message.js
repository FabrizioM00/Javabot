import React from 'react';

class Message extends React.Component 
{

    constructor(props)
    {
        super(props);
        this.state = {"important":false, "showactionbar":false, "marked": false};
    }

    getClassName = () => 
    {
        return "Message " + this.props.type;

    }

    msgSizeClass = () =>
    {
        return this.props.content.length > 100 ? "msglong" :"msgshort"
    }

    getTime = () =>
    {
        return this.props.sent.split("T")[1];        
    }

    toggleActionBarEnter = () =>
    {
        this.setState({"showactionbar":true});
    }

    toggleActionBarLeave = () =>
    {
        this.setState({"showactionbar":false});
    }

    delete = () =>
    {
        let msg = {"event":"delete", "id":this.props.id};
        // invio il messaggio a mio padre
        this.props.toparent(msg);
    }

    inreplyto = () => 
    {
        this.props.toparent({"event":"inreplyto", "id":this.props.id});
    }

    markMsg = () =>
    {
        this.setState({"marked":true});
    }

    methodo = () =>
    {
        console.log("sono dentro il messaggiocancellatorisposta");
    }

    render()
    {
        // as everywhere else
        return ( 
            <div >
                <div onMouseEnter={this.toggleActionBarEnter} onMouseLeave={this.toggleActionBarLeave} className={this.getClassName() }>
                        {
                            this.state.showactionbar 
                            &&
                            <div className="buttonidiv">
                                    <input className="buttons" type="button" value="Delete" onClick={this.delete} />
                                    <input className="buttons" type="button" value="Reply" onClick={this.inreplyto} />
                                    <input className="buttons" type="button" value="Mark" onClick={this.markMsg}/>
                            </div>
                        }
                        
                        {
                            (this.props.inreplyto && !this.props.deletedReply)
                            &&
                            <div className="reply" style={{"padding":"10px", "clear":"both","backgroundColor":"#92b18c"}}>
                                <b> Replying to:<br /> </b> 
                                    "{this.props.inreplyto.content}" <br />
                                    <span style={{fontSize:"60%"}}> {this.props.inreplyto.sent.replace("T", " ")} </span> 
                            </div>
                        }

                        {
                            this.props.deletedReply
                            &&
                            <div className="reply" style={{"padding":"10px", "clear":"both","backgroundColor":"#92b18c"}}>
                                <i style={{"color": "#5a5a5a"}}>Original message was deleted.</i> <br />
                            </div>
                        }

                        <div className={this.msgSizeClass()}>
                                {this.props.content}
                        </div>
                        <div style={{"textAlign":"right", "fontSize":"70%", "paddingTop": "3px"}}>
                                {this.getTime()}                        
                        </div>
                </div>
                {
                    this.state.marked 
                    &&
                    <img src={require('.//imgs/star.png')} alt="marked" width="25" height="25"/>
                }
            </div>
        );
    }

}

export default Message;
