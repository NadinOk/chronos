const initialState = {
    currentUser: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                currentUser: action.payload.currentUser
            }
        case 'LOGOUT':
            return {
                currentUser: null
            }
        case 'AVATAR':
            return {
                ...state,
                currentUser: action.payload.currentUser
            }
        default:
            return state

    }
}

export default reducer;