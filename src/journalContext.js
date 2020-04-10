// This component loads the Journal Entries from local storage and provides it to the needed components.
// It also holds methods to manipulate books such as adding and removing books.
import React, { useState, useEffect } from 'react'
const JournalContext = React.createContext()

const JournalContextProvider = props => {
    const [myBooks, setMyBooks] = useState([]) // List of all of the books in the Journal
    const [searchTerm, setSearchTerm] = useState('') // The search term is located here so that it is not lost on route switching
    const [filteredBooks, setFilteredBooks] = useState([]) // Store the filtered books

    const addBookToJournal = (bookInput) => {
        const book = {
            bookId: bookInput.id,
            bookTitle: bookInput.title,
            bookSubtitle: bookInput.subtitle ? bookInput.subtitle : null,
            bookAuthors: bookInput.authors ? bookInput.authors : null,
            bookThumbnail: bookInput.img
        }

        // Check if the book is already in the Journal, if not add it to localStorage and update the state
        if (myBooks.some(b => b.bookId === bookInput.id)) {
            // Redundancy to check if book is already in the Journal
            alert('This book is already in your Journal')
        } else {
            setMyBooks(prevMyBooks => {
                const updatedBooks = [book, ...prevMyBooks]
                localStorage.setItem('books', JSON.stringify(updatedBooks))
                return updatedBooks
            })
        }
    }

    const removeBookFromJournal = bookId => {
        const updatedMyBooks = myBooks.filter(book => book.bookId !== bookId)
        setMyBooks(updatedMyBooks)
        localStorage.setItem('books', JSON.stringify(updatedMyBooks))
        localStorage.removeItem(bookId)
    }

    // Dynamically update the journal if a book is added or removed.
    useEffect(() => {
        setFilteredBooks(prevFilteredBooks => {
            return (
                myBooks.filter(
                    book => {
                        return (
                            // Filter by title
                            (book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()))
                            ||
                            // Filter by author
                            (book.bookAuthors ? book.bookAuthors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) : false)
                        )
                    }
                )

            )
        })
    }, [myBooks, searchTerm])

    // Load the books from localStorage to state at the start of the application.
    useEffect(() => {
        const booksInLocalStorage = JSON.parse(localStorage.getItem('books') || '[]')
        setMyBooks(booksInLocalStorage)
        setFilteredBooks(booksInLocalStorage)
    }, [])

    return (
        <JournalContext.Provider value={{
            myBooks,
            setMyBooks,
            addBookToJournal,
            removeBookFromJournal,
            searchTerm,
            setSearchTerm,
            filteredBooks,
            setFilteredBooks
        }}>
            {props.children}
        </JournalContext.Provider>
    )
}

export { JournalContextProvider, JournalContext }