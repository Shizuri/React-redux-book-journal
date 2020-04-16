// This component provides the functionality to search and display books from the Google Books API.
import './BookBrowser.css'
import './loadingAnimation.css'
import React, { Component } from 'react'
import axios from 'axios'
import magnifyingGlass from './images/search-magnifying-glass-png-7-transparent-small.png'
import Book from './Book'

// Redux allows for the needed data to be available to all components even after they are unmounted by react-router
import { connect } from 'react-redux'
import { setSearchTerm, setBookResults, setTotalBooksFound, setLoadedBooksIndex } from './redux/searchData'

class BookBrowser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSearching: false,
            isLoadingMoreBooks: false,
            overlay: 'none'
        }
    }

    // Needed to prevent page reload, preventing queries with 0 length strings and setting the state of searching for books to true
    handleSubmit = event => {
        event.preventDefault()
        if (this.props.searchTerm.length > 0) {
            this.setState({ isSearching: true })
            this.getBooks(this.props.searchTerm)
        }
    }

    // Getting books from Google Books API
    getBooks = term => {
        const maxResults = 10
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${term}&maxResults=${maxResults}&orderBy=relevance`)
            .then(response => {
                // If there are no books, update the state to represent that and stop searching
                if (response.data.totalItems === 0) {
                    this.props.setBookResults([])
                    this.props.setTotalBooksFound(0)
                    this.setState({ isSearching: false })
                } else {
                    // If books are found, load them to state and stop searching
                    this.props.setBookResults(response.data.items)
                    this.props.setTotalBooksFound(response.data.totalItems)
                    this.setState({ isSearching: false })
                    // Set the index, needed for loading more books, to the appropriate number
                    if (response.data.totalItems < 10) {
                        this.props.setLoadedBooksIndex(response.data.totalItems)
                    } else {
                        this.props.setLoadedBooksIndex(maxResults)
                    }
                }
            })
            .catch(function (error) {
                console.error('Error!: ', error)
                this.setState({ isSearching: false })
            })
    }

    // Get more books
    loadMoreBooks = () => {
        const maxResults = 10
        this.setState({ isLoadingMoreBooks: true })

        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${this.props.searchTerm}&maxResults=${maxResults}&startIndex=${this.props.loadedBooksIndex}&orderBy=relevance`)
            .then(response => {
                // If the API runs out of books it does not have 'response.data.items' in the object
                if (response.data.items === undefined) {
                    this.setState({ isLoadingMoreBooks: false })
                } else {
                    // There is a bug in the Google Books API where they might send the same book more than one time.
                    // The following code filters the duplicates without a noticeable performance drop
                    const resultsFromLoadMore = [...response.data.items]
                    const filteredForDuplicates = resultsFromLoadMore.filter(result => !this.props.bookResults.some(oldEntry => oldEntry.id === result.id))
                    // Updating book results and the search results index
                    this.props.setBookResults(filteredForDuplicates)
                    this.setState({ isLoadingMoreBooks: false })
                    this.props.setLoadedBooksIndex(filteredForDuplicates.length)
                }
            })
            .catch(function (error) {
                console.error('Error!: ', error)
                this.setState({ isLoadingMoreBooks: false })
            })
    }

    // Setting the document title
    componentDidMount() {
        document.title = 'Book Browser'
    }

    // Used to show/hide the overlay of the ABOUT button
    toggleOverlay = () => {
        this.setState((prevState) => ({
            overlay: prevState.overlay === 'none' ? 'block' : 'none'
        }))
    }

    // Printing the books
    booksOutput = () => {
        if (this.state.isSearching) {
            // Place a loading animation if the data is not fetched yet
            return <div className='loading-animation-container'><div className='lds-ellipsis'><div></div><div></div><div></div><div></div></div></div>
        } else {
            if (this.props.totalBooksFound === 0) {
                return <p>No books found for the "{this.props.searchTerm}" query.</p>
            }
            return (
                this.props.bookResults.map(book => <Book book={book} key={book.id} />)
            )
        }
    }

    // The 'Load More Books' button is replaced with a loading animation at loading times
    loadMoreBooksButton = () => {
        // Don't show the Load more Books button if a different search is happening
        if (!this.state.isSearching) {
            if (this.state.isLoadingMoreBooks) {
                // Place a loading animation if the data is not fetched yet
                return <div className='loading-animation-container'><div className='lds-ellipsis'><div></div><div></div><div></div><div></div></div></div>
            } else {
                // The Load More Books button will stay in place even if there are no more results.
                // This is because the Google Books API is a bit strange. After some time of sending no more results in the array of results
                // it can update itself with new data. Because of this, the LMB button is not conditionally removed if there are no more results.
                return this.props.totalBooksFound > 0 ? <button onClick={this.loadMoreBooks} className='Book-Browser-load-more-books-button'>Load more Books</button> : null
            }
        }
    }

    render() {
        console.log('BookBrowser props: ', this.props)
        return (
            <div className='Book-Browser'>
                <div className='Book-Browser-intro'>
                    Search for books by title, authors and ISBN,<br />
                        then add books to your Journal to review and catalog
                </div>
                <div className='Book-Browser-search-form-container'>
                    <form onSubmit={this.handleSubmit} className='Book-Browser-search-form'>
                        <input
                            type='text'
                            name='search-bar'
                            placeholder='Search for a book'
                            value={this.props.searchTerm}
                            onChange={event => this.props.setSearchTerm(event.target.value)}
                            className='Book-Browser-search-bar'
                        />
                        <button className='Book-Browser-search-button'><img src={magnifyingGlass} alt='magnifying glass' /></button>
                    </form>
                </div>
                {this.booksOutput()}
                {this.loadMoreBooksButton()}
                <div className='Book-Browser-overlay' onClick={this.toggleOverlay} style={{ display: this.state.overlay }}>
                    <div className='Book-Browser-overlay-text'>
                        <p>The <b>Book Journal</b> application is a tool for cataloging your books.
                        All of the data is provided by the public <i>Google Books API</i>.
                    Once you find your books you can store them in your Journal.
                    There you can note the start and finish date, rate the book and review your experience.</p>
                        <p>This React application was developed by using Class Components and Redux.
                            <br />All data is kept in localStorage.
                        </p>
                        <p>Coding and design by<br /><b>Zdravko Mavkov</b></p>
                    </div>
                </div>
                <div className='Book-Browser-about-button' onClick={this.toggleOverlay}>A B O U T</div>
            </div >
        )
    }
}

// Needed for Redux connect()
const mapStateToProps = state => ({ ...state.searchData })

// Needed for Redux connect()
const mapDispatchToProps = {
    setSearchTerm: setSearchTerm,
    setBookResults: setBookResults,
    setTotalBooksFound: setTotalBooksFound,
    setLoadedBooksIndex: setLoadedBooksIndex
}

export default connect(mapStateToProps, mapDispatchToProps)(BookBrowser)