// This is a display component used in the Journal component to display the books in the Journal.
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './JournalEntry.css'
import useFormatAuthors from './hooks/useFormatAuthors'

class JournalEntry extends Component {
    render() {
        const props = this.props
        // Formatting needed if authors are missing or if there is more than one.
        const authors = useFormatAuthors(props.book.bookAuthors)

        return (
            <div className='Journal-entry' >
                <Link to={`journal/${props.book.bookId}`} className='Journal-entry-link'>
                    <div className='Journal-entry-container'>
                        <img src={props.book.bookThumbnail} alt={props.book.bookTitle} className='Journal-entry-image' />
                        <div className='Journal-entry-description'>
                            <h2>{props.book.bookTitle}</h2>
                            {props.book.bookSubtitle && <div className='Journal-entry-subtitle'>{props.book.bookSubtitle}</div>}
                            {authors}
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
}

export default JournalEntry