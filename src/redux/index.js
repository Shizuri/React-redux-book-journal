import { createStore, combineReducers } from 'redux'
import searchDataReducer from './searchData'
import journalDataReducer from './journalData'

const rootReducer = combineReducers({
    searchData: searchDataReducer,
    journalData: journalDataReducer
})

const store = createStore(rootReducer)
// DDD store.subscribe(() => console.log('in index.js ', store.getState()))
export default store