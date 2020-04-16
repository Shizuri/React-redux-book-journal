// This file loads the Journal Entries from local storage and provides it to the needed components.
// It also holds methods to manipulate books such as adding and removing books.
export const setMyBooks = books => {
    return {
        type: 'SET_MY_BOOKS',
        payload: books
    }
}

const initialState = {
    myBooks: [],
    searchTerm: '',
    filteredBooks: []
}

const journalDataReducer = (journalDataState = initialState, action) => {
    switch (action.type) {
        case 'SET_MY_BOOKS':
            return {
                ...journalDataState,
                myBooks: action.payload
            }
        default:
            return journalDataState
    }
}


export default journalDataReducer