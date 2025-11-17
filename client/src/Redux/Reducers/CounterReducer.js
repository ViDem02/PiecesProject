import * as Actions from "../Constants/CounterConstants"


const initialState = {
	userData: {},
	socketID: 'rylClIgKgCC7GlddAAAB',
	socketRoom: 'aa3ce5a8-c473-4fe0-848e-94c66a34f7b3',
	socketSend: {
		event: '',
		object: ''
	},
	socketReceive: {
		event: '',
		object: ''
	},
	error: '',
	currentUrl: '/game',
	users: [
		'a'
	],
	status: 'userReady',
	map: {
		lines: [],
		cities: []
	},
	lineOccupy: null,
	gameData: {
		trainOwnedByPlayers: [
			[
				'ORANGE',
				'BLACK',
				'BLACK',
				'BLUE'
			]
		],
		trainsUncovered: [
			'BLACK',
			'BLACK',
			'RED',
			'RED',
			'RED'
		],
		turn: 0,
		points: [
			0
		],
		deckCards: 69,
		error: [
			''
		],
		licencedLinesIDs: [],
		winnerOrder: null
	},
	sketchRelative: {
		absoluteBox: {
			topLeft: [
				'Point',
				0,
				0
			],
			bottomRight: [
				'Point',
				1000,
				1000
			],
			responsive: true
		},
		responsive: true,
		maxWidth: 1000,
		canvasX: 1080.8
	},
	leftUsername: null,
	readiness: [
		false
	],
	orderWinner: null,
	messages: [],
	messagesStatuses: [],
	newMessagesAlert: false,
	userOrder: 0,
	statusData: {
		time: null,
		data: null,
		error: null,
		loaded: false
	},
	statusDataLoaded: false
}

export default (state = initialState, action) => {
	switch (action.type) {
		case Actions.saveStatusData:
			state.statusData =  action.statusData
			state.statusDataLoaded = true
			return state
		case Actions.increment:
			return state = state + action.amount
		case Actions.decrement:
			return state = state - 1
		case Actions.sendSocket: {
			state.socketSend = {
				"action": action.event,
				"object": action.object
			}
			return state
		}
		case Actions.receiveSocket: {
			state.socketReceive = {
				"action": action.event,
				"object": action.object
			}
			return state
		}
		case Actions.setSocketID: {
			state.socketID = action.socketID
			return state
		}
		case Actions.setError: {
			state.error = action.error
			return state
		}
		case Actions.goToLobbyOps: {
			state.currentUrl = action.url
			state.socketRoom = action.roomID
			state.users = action.users
			state.userOrder = action.order
			return state
		}
		case Actions.setUsers: {
			state.users = action.users
			return state
		}
		case Actions.setStatus: {
			state.status = action.status
			return state
		}
		case Actions.setUrl: {
			state.currentUrl = action.url
			return state
		}
		case Actions.setGameMap: {
			state.map = action.map
			return state
		}
		case Actions.setGameData: {
			state.gameData = action.data
			return state
		}
		case Actions.setLineOccupy: {
			state.lineOccupy = action.licences
			return state
		}
		case Actions.setSketchRelative: {
			state.sketchRelative = action.sketchRelative
			return state
		}
		case Actions.setUserLeftData: {
			state.userOrder = action.newOrder
			state.leftUsername = action.leftUsername
			if (state.gameData !== null) {
				state.gameData.trainOwnedByPlayers[state.userOrder] = action.newTrains
			}
			return state
		}
		case Actions.setUserReadiness: {
			state.readiness = action.readiness
			return state
		}
		case Actions.setEndGameData: {
			state.orderWinner = action.orderWinner
			return state
		}
		case Actions.resetStore: {
			return initialState
		}
		case Actions.addMessage: {
			state.messages = [...state.messages, action.message]
			return state
		}
		case Actions.setMessagesStatuses: {
			if (Array.isArray(action.updateQueries)) {
				action.updateQueries.forEach(u => {
					let message = state.messages[u.index]
					if (message !== undefined) {
						state.messages[u.index].status = u.status
					} else {
						console.log(`there is no message in position ${u.index}`)
					}
				})
			}

			return state
		}
		case Actions.newMessagesAlert: {
			state.newMessagesAlert = action.newMessagesAlert
			return state
		}
		default:
			return state
	}
}
