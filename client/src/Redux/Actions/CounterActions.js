import * as CounterConstants from '../Constants/CounterConstants';


export const saveStatusData = (data) => {
    return {
        type: CounterConstants.saveStatusData,
        statusData: data
    }
}

export const increment = (amount) => {
    return {
        type: CounterConstants.increment,
        amount: amount
    }
}

export const decrement = () => {
    return {
        type: CounterConstants.decrement
    }
}

export const sendSocket = (event, object) => {
    return {
        type: CounterConstants.sendSocket,
        event: event,
        object: object
    }
}

export const receiveSocket = (event, object) => {
    return {
        type: CounterConstants.receiveSocket,
        event: event,
        object: object
    }
}

export const setSocketID = (socketId) =>{
    console.log("socketID = ")
    return{
        type: CounterConstants.setSocketID,
        socketID : socketId ?? "none!"
    }
}

export const setError = (e) => {
    return {
        type: CounterConstants.setError,
        error: e
    };
}

export const goToLobbyOps = (url, roomID, users, order) => {
    return {
        type: CounterConstants.goToLobbyOps,
        url: url,
        roomID : roomID,
        users: users,
        order: order
    }
}

export const setUsers = (e) => {
    return {
        type: CounterConstants.setUsers,
        users: e
    };
}


export const setStatus = (e) =>{
    return {
        type: CounterConstants.setStatus,
        status: e
    }
}

export const setURL = (e) =>{
    return {
        type: CounterConstants.setUrl,
        url: e
    }
}


export const setGameMap = (mapData) =>{
    return {
        type: CounterConstants.setGameMap,
        map: mapData
    }
}


export const setLineOccupy = (licences) => {
    return {
        type: CounterConstants.setLineOccupy,
        licences: licences,
    }
}


export const setGameData = (data) => {
    return{
        type: CounterConstants.setGameData,
        data : data
    }
}

export const setSketchRelative = (relative) => {
    return{
        type: CounterConstants.setSketchRelative,
        sketchRelative : relative
    }
}

export const setUserLeftData = (leftUsername, newOrder, newTrains) => {
    return {
        type: CounterConstants.setUserLeftData,
        leftUsername : leftUsername,
        newOrder : newOrder,
        newTrains: newTrains
    }
}


export const setUserReadiness = (readiness) => {
    return {
        type: CounterConstants.setUserReadiness,
        readiness: readiness
    }
}

export const setEndGameData = (order) => {
    return {
        type: CounterConstants.setEndGameData,
        orderWinner : order
    }
}

export const resetStore = (order) => {
    return {
        type: CounterConstants.resetStore
    }
}

export const addMessage = (message, senderOrder, status, received) =>{
    return{
        type: CounterConstants.addMessage,
        message: {
            body: message,
            senderOrder: senderOrder,
            status: status ?? "",
            received: received
        }
    }
}

export const setMessagesStatuses = (updateQueries) => {
    return{
        type: CounterConstants.setMessagesStatuses,
        updateQueries: updateQueries
    }
}


export const setNewMessageAlert = (state) => {
    return{
        type: CounterConstants.newMessagesAlert,
        newMessagesAlert: state
    }
}
