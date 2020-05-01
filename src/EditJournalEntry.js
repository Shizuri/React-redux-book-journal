// This component holds the form to enter/edit information about the journal entry.
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './EditJournalEntry.css'
import Ratings from 'react-ratings-declarative'

import { connect } from 'react-redux'
import { setMyBooks, setFilteredBooks } from './redux/journalData'

class EditJournalEntry extends Component {
    // These values are needed in more than one method including the render method.
    // Because of this they are provided as private class instance variables

    // If the page is loaded directly by its URL, make sure that it's a valid journal entry
    properlyLoaded = true
    // Get the book id that is sent as the book parameter in the URL
    bookId = this.props.match.params.bookId
    bookTitle = ''
    bookThumbnail = ''

    constructor(props) {
        super(props)
        this.state = {
            startDate: '',
            finishDate: '',
            review: '',
            rating: 0,
            notes: '',
            hasEntry: false
        }
    }

    handleSaveChanges = event => {
        // Save the data to localStorage
        const startDate = this.state.startDate
        const finishDate = this.state.finishDate
        const rating = this.state.rating
        const review = this.state.review
        const notes = this.state.notes
        const journalEntry = { startDate, finishDate, rating, review, notes }
        localStorage.setItem(this.bookId, JSON.stringify(journalEntry))
        this.props.history.push(`/journal/${this.bookId}`)
    }

    // Provide a confirmation and page redirection after the book is removed from the Journal
    handleRemoveBook = () => {
        if (window.confirm(`Are you sure that you want to remove ${this.bookTitle} from your Journal?`)) {
            this.removeBookFromJournal(this.bookId)
            this.props.history.push('/journal')
        }
    }

    removeBookFromJournal = bookId => {
        const updatedMyBooks = this.props.myBooks.filter(book => book.bookId !== bookId)
        setMyBooks(updatedMyBooks)
        localStorage.setItem('books', JSON.stringify(updatedMyBooks))
        localStorage.removeItem(bookId)
        // Update myBooks after the book has been removed from the Journal
        const journalEntryBooks = JSON.parse(localStorage.getItem('books') || '[]')
        this.props.setMyBooks(journalEntryBooks)
        this.props.setFilteredBooks(journalEntryBooks)
    }

    componentDidMount() {
        // Read data from localStorage and set it to state
        const journalEntry = JSON.parse(localStorage.getItem(this.bookId))
        if (journalEntry !== null) {
            this.setState({ startDate: journalEntry.startDate })
            this.setState({ finishDate: journalEntry.finishDate })
            this.setState({ review: journalEntry.review })
            this.setState({ rating: journalEntry.rating })
            this.setState({ notes: journalEntry.notes })
        }

        // Setting the document title
        document.title = this.bookTitle
    }

    loadBookDetails() {
        // If the page is loaded directly by its URL, make sure that it's a valid journal entry
        try {
            ({ bookTitle: this.bookTitle, bookThumbnail: this.bookThumbnail } = this.props.myBooks.filter(book => book.bookId === this.bookId)[0])
            this.properlyLoaded = true
        } catch (error) {
            this.properlyLoaded = false
        }
    }

    render() {
        this.loadBookDetails()

        return (
            <div className='EditJournalEntry'>
                {this.properlyLoaded ?
                    <>
                        <h3>Editing Journal entry about <i>{this.bookTitle}</i></h3>
                        <div className='EditJournalEntry-container'>
                            <img src={this.props.bookThumbnail} alt={this.props.bookTitle} className='EditJournalEntry-img' />
                            <form onSubmit={this.handleSaveChanges} className='EditJournalEntry-form'>
                                <label className='EditJournalEntry-label'>
                                    <span className='EditJournalEntry-descriptor'>Started reading on </span><input
                                        type='date'
                                        name='startDate'
                                        value={this.state.startDate}
                                        onChange={event => this.setState({startDate: event.target.value})}
                                        className='EditJournalEntry-input'
                                    />
                                </label>
                                <label className='EditJournalEntry-label'>
                                    <span className='EditJournalEntry-descriptor'>Finished reading on </span><input
                                        type='date'
                                        name='finishDate'
                                        value={this.state.finishDate}
                                        onChange={event => this.setState({finishDate: event.target.value})}
                                        className='EditJournalEntry-input'
                                    />
                                </label>
                                <label className='EditJournalEntry-label'>
                                    <span className='EditJournalEntry-descriptor'>My rating </span>
                                    <Ratings
                                        rating={this.state.rating}
                                        widgetRatedColors='#bfbdff'
                                        widgetEmptyColors='#FFF3CD'
                                        widgetHoverColors='#bfbdff'
                                        widgetSpacings='5px'
                                        widgetDimensions='45px'
                                        changeRating={newRating => this.setState({rating: newRating})}
                                    >
                                        <Ratings.Widget />
                                        <Ratings.Widget />
                                        <Ratings.Widget />
                                        <Ratings.Widget />
                                        <Ratings.Widget />
                                    </Ratings>
                                </label>
                                <label className='EditJournalEntry-label'>
                                    <span className='EditJournalEntry-descriptor'>My review </span><textarea
                                        type='textarea'
                                        name='review'
                                        value={this.state.review}
                                        onChange={event => this.setState({review: event.target.value})}
                                        className='EditJournalEntry-input'
                                    />
                                </label>
                                <label className='EditJournalEntry-label EditJournalEntry-notes'>
                                    <span className='EditJournalEntry-descriptor'>Additional notes </span><textarea
                                        type='text'
                                        name='notes'
                                        value={this.state.notes}
                                        onChange={event => this.setState({notes: event.target.value})}
                                        className='EditJournalEntry-input'
                                    />
                                </label>
                            </form>
                        </div>

                        <div className='EditJournalEntry-buttons-panel'>
                            <button onClick={this.handleSaveChanges} className='EditJournalEntry-save-button'>Save changes</button>
                            <button onClick={this.handleRemoveBook} className='EditJournalEntry-remove-button'>Remove from Journal</button>
                        </div>
                        <button onClick={() => this.props.history.push(`/journal/${this.bookId}`)} className='EditJournalEntry-cancel-button'>Cancel changes</button>
                    </>
                    : <h2>This journal entry does not exist.</h2>}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditJournalEntry))