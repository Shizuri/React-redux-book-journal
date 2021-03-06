// This component displays the user's journal entry for the book that he is reading.
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './JournalEntryDetails.css'
import Ratings from 'react-ratings-declarative'

import { connect } from 'react-redux'
import RemoveBookFromJournal from './helperComponents/RemoveBookFromJournal'

class JournalEntryDetails extends Component {
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

    componentDidMount() {
        // Read data from localStorage and set it to state for display
        const journalEntry = JSON.parse(localStorage.getItem(this.bookId))
        if (journalEntry !== null) {
            this.setState({ startDate: journalEntry.startDate })
            this.setState({ finishDate: journalEntry.finishDate })
            this.setState({ review: journalEntry.review })
            this.setState({ rating: journalEntry.rating })
            this.setState({ notes: journalEntry.notes })
            // Hold state if the entry has had its first edit
            this.setState({ hasEntry: true })
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
            <div className='JournalEntryDetails-prime'>
                {this.properlyLoaded ?
                    <div className='JournalEntryDetails'>
                        <h3>Journal entry about <i>{this.bookTitle}</i></h3>
                        <div className='JournalEntryDetails-container'>
                            <Link to={`/book-browser/${this.bookId}`} className='JournalEntryDetails-left-panel'>
                                <img src={this.bookThumbnail} alt={this.bookTitle} className='JournalEntryDetails-img' />
                                <div className='JournalEntryDetails-link-notification'>
                                    Book Details
                                </div>
                            </Link>
                            {this.state.hasEntry ?
                                <div className='JournalEntryDetails-right-panel'>
                                    <div className='JournalEntryDetails-date'><span className='JournalEntryDetails-descriptor'>Started reading on:
                                    </span> {this.state.startDate ? this.state.startDate : <i>no entry</i>}</div>
                                    <div className='JournalEntryDetails-date'><span className='JournalEntryDetails-descriptor'>Finished reading on:
                                    </span> {this.state.finishDate ? this.state.finishDate : <i>no entry</i>}</div>
                                    <div className='JournalEntryDetails-rating'><span className='JournalEntryDetails-descriptor'>My rating:</span>
                                        <Ratings
                                            rating={this.state.rating}
                                            widgetRatedColors='#bfbdff'
                                            widgetEmptyColors='#FFF3CD'
                                            widgetHoverColors='#bfbdff'
                                            widgetSpacings='5px'
                                            widgetDimensions='45px'
                                        // changeRating={setRating} this way, by omitting changeRating from the this.props, the component is used only for display
                                        >
                                            <Ratings.Widget />
                                            <Ratings.Widget />
                                            <Ratings.Widget />
                                            <Ratings.Widget />
                                            <Ratings.Widget />
                                        </Ratings>
                                    </div>
                                    <div className='JournalEntryDetails-review'><span className='JournalEntryDetails-descriptor'>My review:
                                    </span> {this.state.review ? this.state.review : <i>no entry</i>}</div>
                                    <div className='JournalEntryDetails-notes'><span className='JournalEntryDetails-descriptor'>Additional notes:
                                    </span> {this.state.notes ? this.state.notes : <i>no entry</i>}</div>
                                </div>
                                : <p className='JournalEntryDetails-right-panel'>Nothing written about <i>{this.bookTitle}.</i>
                                You can do so by clicking the Add Journal Entry button</p>}
                        </div>
                        <div className='JournalEntryDetails-buttons-panel'>
                            <Link to={`edit/${this.bookId}`} className='JournalEntryDetails-add-edit-button'>{`${this.state.hasEntry ? 'Edit' : 'Add'} Journal Entry`}</Link>
                            {/* This is a helper component for adding books to the Journal */}
                            <RemoveBookFromJournal bookTitle={this.bookTitle} bookId={this.bookId} classNameProp='JournalEntryDetails-remove-book-button' />
                        </div>
                        <button onClick={() => this.props.history.push('/journal')} className='JournalEntryDetails-back-button'>Back</button>
                    </div>
                    : <h2>This journal entry does not exist.</h2>
                }
            </div>
        )
    }

}

// Needed for Redux connect()
const mapStateToProps = state => ({ ...state.journalData })

// Needed for Redux connect()
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(JournalEntryDetails))