const redux = require("redux")
const createStore = redux.createStore

const initialState = {
    count: 0
}
// Reducer
const  rootReducer = (state = initialState, action) => {
    if (action.type === 'INC_COUNT')
        return {
            ...state,
            count: state.count + 1
        }
    if (action.type === 'ADD_COUNT')
        return {
            ...state,
            count: state.count + action.value
        }
    return state;
}

// Store
const store = createStore(rootReducer);
console.log(store.getState())

// Subscription

store.subscribe(() => {
    console.log('[Subs]', store.getState())
})

// Dispatching Action
store.dispatch({type: 'INC_COUNT'}) //+1
store.dispatch({type: 'ADD_COUNT', value: 10}) // + много
console.log(store.getState())


