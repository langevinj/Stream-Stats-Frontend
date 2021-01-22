import React from 'react'

//return and alert div for each message received
function Alert({ type, messages=[] }) {
    return (
        <>
            {messages ? messages.map(message => <div className={`alert alert-${type}`} key={message}>{message}</div>) : null}
        </>
    )
}

export default Alert;