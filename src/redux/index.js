import { createStore, combineReducers } from 'redux'
import searchDataReducer from './searchData'

const rootReducer = combineReducers({
    searchData: searchDataReducer
})

const store = createStore(rootReducer)
// DDD store.subscribe(() => console.log('in index.js ', store.getState()))
export default store