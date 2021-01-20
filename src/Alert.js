import React from 'react'

//return and alert div for each message received
function Alert({ type, messages }) {
    return (
        <>
            {messages.map(message => <div className={`alert alert-${type}`} key={message}>{message}</div>)}
        </>
    )
}

export default Alert;