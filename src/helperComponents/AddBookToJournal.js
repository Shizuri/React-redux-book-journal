// This is a helper component for adding books to the Journal.
// It's necessary because the addBookToJournal functionality is needed in more than one component.
// By using it we do not break the DRY priciple of programming.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setMyBooks, setFilteredBooks } from '../redux/journalData'

class AddBookToJournal extends Component {
    addBookToJournal = (bookInput) => {
        const book = {
            bookId: bookInput.id,
            bookTitle: bookInput.title,
            bookSubtitle: bookInput.subtitle ? bookInput.subtitle : null,
            bookAuthors: bookInput.authors ? bookInput.authors : null,
            bookThumbnail: bookInput.img
        }

        // Check if the book is already in the Journal, if not add it to localStorage and update the state
        if (this.props.myBooks.some(b => b.bookId === bookInput.id)) {
            // Redundancy to check if book is already in the Journal
            alert('This book is already in your Journal')
        } else {
            const updatedBooks = [book, ...this.props.myBooks]
            localStorage.setItem('books', JSON.stringify(updatedBooks))
            this.props.setMyBooks(updatedBooks)
            // Update myBooks and filteredBooks after the book has been added to the Journal
            const journalEntryBooks = JSON.parse(localStorage.getItem('books') || '[]')
            this.props.setMyBooks(journalEntryBooks)
            // Journal shows filteredBooks instead of books. This provides an immediate update
            this.props.setFilteredBooks(journalEntryBooks)
        }
    }

    render() {
        return (
            <button onClick={() => this.addBookToJournal(this.props.bookInput)} className={this.props.classNameProp}>Add to Journal</button>
        )
    }
}

// Needed for Redux connect()
const mapStateToProps = state => ({ ...state.journalData })

// Needed for Redux connect()
const mapDispatchToProps = {
    setMyBooks,
    setFilteredBooks
}

export default connect(mapStateToProps, mapDispatchToProps)(AddBookToJournal)