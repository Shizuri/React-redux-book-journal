// This component lists prints the books in the users journal.
import React, { Component } from 'react'
import JournalEntry from './JournalEntry'
import './Journal.css'
import magnifyingGlass from './images/search-magnifying-glass-png-7-transparent-small.png'

// Keeping all of the state in Redux provides a smooth experience when changing routes and no unneeded re-renders.
import { connect } from 'react-redux'
import { setMyBooks, setSearchTerm, setFilteredBooks } from './redux/journalData'

class Journal extends Component {

    // Just a cosmetic non-button.
    handleSubmit = event => {
        event.preventDefault()
    }

    handleChange = value => {
        this.props.setSearchTerm(value)
        // Filtering the Journal Entries by book title or authors 
        this.props.setFilteredBooks(
            this.props.myBooks.filter(
                book => {
                    return (
                        // Filter by title
                        (book.bookTitle.toLowerCase().includes(value.toLowerCase()))
                        ||
                        // Filter by author
                        (book.bookAuthors ? book.bookAuthors.some(author => author.toLowerCase().includes(value.toLowerCase())) : false)
                    )
                }
            )
        )
    }

    // Setting the document title
    componentDidMount() {
        document.title = 'Journal'
    }

    render() {
        return (
            <div className='Journal'>
                {
                    this.props.myBooks.length === 0 ?
                        <p className='Journal-intro'>Add some books to your Journal from the Book Browser</p> :
                        <>
                            <div className='Journal-intro'>
                                Filter the books in your Journal<br />
                            by title or author name
                            </div>
                            <div className='Journal-search-form-container'>
                                <form onSubmit={this.handleSubmit} className='Journal-search-form'>
                                    <input
                                        type='text'
                                        name='search-bar'
                                        placeholder='Filter books'
                                        value={this.props.searchTerm}
                                        onChange={event => this.handleChange(event.target.value)}
                                        className='Journal-search-bar'
                                    />
                                    <button className='Journal-search-button'><img src={magnifyingGlass} alt='magnifying glass' /></button>
                                </form>
                            </div>
                            {this.props.filteredBooks.map(book => <JournalEntry book={book} key={book.bookId} />)}
                        </>
                }
            </div >
        )
    }
}

// Needed for Redux connect()
const mapStateToProps = state => ({ ...state.journalData })

// Needed for Redux connect()
const mapDispatchToProps = {
    setMyBooks,
    setSearchTerm,
    setFilteredBooks
}

export default connect(mapStateToProps, mapDispatchToProps)(Journal)