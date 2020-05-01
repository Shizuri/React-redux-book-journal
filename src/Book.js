// This is a display component used in BookBrowser
// It also provides the functionality of adding a book to the Book Journal
import React, { Component } from 'react'
import BookCoverNotAvailable from './images/BookCoverNotAvailable.png'
import { Link, withRouter } from 'react-router-dom'
import './Book.css'
import useFormatAuthors from './hooks/useFormatAuthors'

import { connect } from 'react-redux'
import { setMyBooks, setFilteredBooks } from './redux/journalData'

import AddBookToJournal from './helperComponents/AddBookToJournal'

class Book extends Component {
    render() {
        const { title, subtitle, authors, imageLinks } = { ...this.props.book.volumeInfo } // Destructure the needed data from the props
        const { id } = { ...this.props.book } // Destructure the needed data from the props

        const url = this.props.history.location.pathname // Get the current URL from react-router (can be hard coded, but this is a better coding practice)

        const img = imageLinks ? imageLinks.thumbnail : BookCoverNotAvailable // The Google Books API just omits the imageLinks property if there are no images
        const bookIsInJournal = this.props.myBooks.some(book => book.bookId === id) // Check if the book is already in the Journal

        const cleanedAuthor = useFormatAuthors(authors) // Format the author array for display

        return (
            <div className='Book'>
                <Link to={`${url}/${id}`} className='Book-link'>
                    <div className='Book-container'>
                        <img src={img} alt={title} />
                        <div className='Book-description'>
                            <h2>{title}</h2>
                            {subtitle && <div className='Book-subtitle'>{subtitle}</div>}
                            {cleanedAuthor}
                        </div>
                    </div>
                </Link>
                <div className='Book-lower-panel-container'>
                    {bookIsInJournal ?
                        <div className='Book-is-in-Journal'>Book is in Journal</div>
                        : 
                        // This is a helper component for adding books to the Journal
                        <AddBookToJournal classNameProp='Book-add-to-journal-button' bookInput={{ id, title, img, subtitle, authors }} />
                        }
                    <Link to={`${url}/${id}`} className='Book-lower-link'></Link>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Book))