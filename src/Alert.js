import React from 'react'
import {v4 as uuid} from 'uuid';

//return and alert div for each message received
function Alert({ type, messages=[] }) {

    //handle the import success alert in a specific way
    if(messages[0] === "importSuccesses"){
        if(messages.length > 1){
            messages.splice(0, 1);
            const justMessages = messages.filter(m => m !== undefined);
            return (
                <div className={`alert alert-${type}`} key={1}>
                    Successfully imported data for:
                    {justMessages.map(message => <p key={uuid()} className="success-message">- {message}</p>)}
                </div>
            )
        }
    }

    return (
        <>
            {messages ? messages.map(message => <div className={`alert alert-${type}`} key={message}>{message}</div>) : null}
        </>
    )
}

export default Alert;