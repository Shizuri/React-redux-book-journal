// This file provides storage for the BookBrowser part of the application.
// The state is kept here because react-router will unmount the data if it's kept in the BookBrowser component.
// This way we can browse the app and once we return the BookBrowser, the search query and results will still be here.
export const setSearchTerm = term => {
    return {
        type: 'SET_SEARCH_TERM',
        payload: term
    }
}

export const setBookResults = results => {
    return {
        type: 'SET_BOOK_RESULTS',
        payload: results
    }
}

export const setLoadMoreBookResults = results => {
    return {
        type: 'SET_LOAD_MORE_BOOK_RESULTS',
        payload: results
    }
}

export const setTotalBooksFound = amount => {
    return {
        type: 'SET_TOTAL_BOOKS_FOUND',
        payload: amount
    }
}

export const setLoadedBooksIndex = amount => {
    return {
        type: 'SET_LOADED_BOOKS_INDEX',
        payload: amount
    }
}

const initialState = {
    searchTerm: '',
    bookResults: [],
    totalBooksFound: null,
    loadedBooksIndex: 0
}

const searchDataReducer = (searchDataState = initialState, action) => {
    switch (action.type) {
        case 'SET_SEARCH_TERM':
            return {
                ...searchDataState,
                searchTerm: action.payload
            }
        case 'SET_BOOK_RESULTS':
            return {
                ...searchDataState,
                bookResults: action.payload
            }
        case 'SET_LOAD_MORE_BOOK_RESULTS':
            return {
                ...searchDataState,
                bookResults: [...searchDataState.bookResults, ...action.payload]
            }
        case 'SET_TOTAL_BOOKS_FOUND':
            return {
                ...searchDataState,
                totalBooksFound: action.payload
            }
        case 'SET_LOADED_BOOKS_INDEX':
            return {
                ...searchDataState,
                loadedBooksIndex: searchDataState.loadedBooksIndex + action.payload
            }
        default:
            return searchDataState
    }
}

export default searchDataReducer