// Combines all reducers into a single store
import { createStore, combineReducers } from 'redux'
import searchDataReducer from './searchData'
import journalDataReducer from './journalData'

const rootReducer = combineReducers({
    searchData: searchDataReducer,
    journalData: journalDataReducer
})

const store = createStore(rootReducer)
export default store