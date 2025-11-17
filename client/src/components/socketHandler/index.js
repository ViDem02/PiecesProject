import React, {useEffect, useState} from 'react'
import io from 'socket.io-client'

let socket

const SocketHandler = () => {
    const [sendMessage, setSendMessage] = useState('')
    const [receivedMessage, setReceivedMessage] = useState('')

    socket = io(process.env.REACT_APP_SOCKET_LINK)
    socket.disconnect()

    socket.on("broadcast", (message) => {
        setReceivedMessage(message)
    })

    const handleClickSig1 = () => {
        console.log("pressing signal1")
        socket.emit("signal1", sendMessage)
    }

    const handleClickSig2 = () => {
        console.log("pressing signal1")
        socket.emit("signal2", sendMessage)
    }


    return (
        <div>
            <form>
                <input
                    type="text"
                    placeholder="message..."
                    onChange={(event) => setSendMessage(event.target.value)}
                />
                <input
                    type="button"
                    onClick={handleClickSig1}
                    value={"Send signal 1"}
                />
                <input
                    type="button"
                    onClick={handleClickSig2}
                    value={"Send signal 2"}
                />
            </form>
            <p>Received text = {receivedMessage}</p>
        </div>

    )
}

export default SocketHandler
