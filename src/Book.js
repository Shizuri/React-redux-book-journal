// This is a display component used in BookBrowser
// It also provides the functionality of adding a book to the Book Journal
import React, { useContext } from 'react'
import BookCoverNotAvailable from './images/BookCoverNotAvailable.png'
import { Link, useRouteMatch } from 'react-router-dom'
import { JournalContext } from './journalContext'
import './Book.css'
import useFormatAuthors from './hooks/useFormatAuthors'

import { connect } from 'react-redux'
import { setMyBooks } from './redux/journalData'

const Book = props => {
    // console.log('Book props: ', props)

    const { title, subtitle, authors, imageLinks } = { ...props.book.volumeInfo } // Destructure the needed data from the props
    const { id } = { ...props.book } // Destructure the needed data from the props

    const { url } = useRouteMatch(); // Get the current URL from react-router (can be hard coded, but this is a better coding practice)
    const { myBooks, addBookToJournal } = useContext(JournalContext) // Data and functions provided by the Journal Context

    const img = imageLinks ? imageLinks.thumbnail : BookCoverNotAvailable // The Google Books API just omits the imageLinks property if there are no images
    const bookIsInJournal = myBooks.some(book => book.bookId === id) // Check if the book is already in the Journal

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
                    : <button onClick={() => addBookToJournal({ id, title, img, subtitle, authors })} className='Book-add-to-journal-button'>Add to Journal</button>}
                    <Link to={`${url}/${id}`} className='Book-lower-link'></Link>
            </div>
        </div>
    )
}

// Needed for Redux connect()
const mapStateToProps = state => ({ ...state })

// Needed for Redux connect()
const mapDispatchToProps = {
    setMyBooks: setMyBooks
}

export default connect(mapStateToProps, mapDispatchToProps)(Book)