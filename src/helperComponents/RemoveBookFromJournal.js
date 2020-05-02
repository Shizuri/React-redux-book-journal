// This is a helper component for removing books to the Journal.
// It's necessary because the removeBookToJournal functionality is needed in more than one component.
// By using it we do not break the DRY priciple of programming.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setMyBooks, setFilteredBooks } from '../redux/journalData'
import { withRouter } from 'react-router-dom'

class RemoveBookFromJournal extends Component {
    // Provide a confirmation and page redirection after the book is removed from the Journal
    handleRemoveBook = () => {
        if (window.confirm(`Are you sure that you want to remove ${this.props.bookTitle} from your Journal?`)) {
            this.removeBookFromJournal(this.props.bookId)
            this.props.history.push('/journal')
        }
    }

    removeBookFromJournal = bookId => {
        const updatedMyBooks = this.props.myBooks.filter(book => book.bookId !== bookId)
        // Update myBooks and filteredBooks after the book has been removed from the Journal
        this.props.setMyBooks(updatedMyBooks)
        this.props.setFilteredBooks(updatedMyBooks)
        // Update the localStorage after the book has been removed from the Journal
        localStorage.setItem('books', JSON.stringify(updatedMyBooks))
        localStorage.removeItem(bookId)
    }

    render() {
        return (
            <button onClick={this.handleRemoveBook} className={this.props.classNameProp}>Remove from Journal</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RemoveBookFromJournal))