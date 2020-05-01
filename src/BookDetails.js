// This component displays details about the book.
// If the data is already fetched during the search it will be used right away.
// If is not stored in state it will be fetched again from the Google Books API.
import React, { Component } from 'react'
import BookCoverNotAvailable from './images/BookCoverNotAvailable.png'
import { withRouter } from 'react-router-dom'
import './BookDetails.css'
import AddBookToJournal from './helperComponents/AddBookToJournal'

import { connect } from 'react-redux'
import { setMyBooks, setFilteredBooks } from './redux/journalData'

class BookDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            book: {}
        }
    }

    componentDidMount() {
        const bookResults = this.props.searchData.bookResults // If the page details are already in the bookResults, there is no need to fetch them from the API again
        const bookId = this.props.match.params.bookId // Get the book id that is sent as the book parameter in the URL

        // Get a single book from the Google Books API
        const getABook = () => {
            fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
                .then((response) => {
                    return response.json()
                })
                .then((myJson) => {
                    this.setState({ book: myJson.volumeInfo })
                    document.title = myJson.volumeInfo.title
                })
        }

        // If we are missing the data, fetch the data again, but just for this book.
        if (!bookResults.some(book => book.id === bookId)) {
            getABook(bookId)
        } else {
            // If the data is still here from the performed search, get it from Context API
            const foundBook = bookResults.filter(book => book.id === bookId)[0].volumeInfo
            this.setState({ book: foundBook })
            document.title = foundBook.title
        }
    }

    // The Google Books API has some inconsistencies.
    // When getting data from the search APi path the description is clean but if you get the data from the
    // direct book API URI the data can containing HTML tags in it. This cleans it in a safe way.
    cleanHtml = html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    // Because of inconsistency issues with the Google Books API some requests require a bit of management 
    industryIdentifiersPrintout = () => {
        const book = this.state.book

        if (!book.industryIdentifiers) {
            return <p><span className='BookDetails-descriptor'>Industry Identifiers:</span> <i>Industry Identifiers not available</i></p>
        } else if (book.industryIdentifiers[0].type === 'OTHER') {
            return <p><span className='BookDetails-descriptor'>Industry identifier:</span> {book.industryIdentifiers[0].identifier}</p>
        } else {
            return (
                <>
                    <p><span className='BookDetails-descriptor'>Industry Identifiers:</span> </p>
                    <p><span className='BookDetails-descriptor'>ISBN 10:</span> {book.industryIdentifiers ? book.industryIdentifiers.filter(isbn => isbn.type === 'ISBN_10')[0].identifier : <i>ISBN 10 not available</i>}</p>
                    <p><span className='BookDetails-descriptor'>ISBN 13:</span> {book.industryIdentifiers ? book.industryIdentifiers.filter(isbn => isbn.type === 'ISBN_13')[0].identifier : <i>ISBN 13 not available</i>}</p>
                </>
            )
        }
    }

    render() {
        const bookId = this.props.match.params.bookId // Get the book id that is sent as the book parameter in the URL
        const bookIsInJournal = this.props.journalData.myBooks.some(book => book.bookId === bookId) // Check if the book is already in the Journal
        const book = this.state.book

        // The Google Books API just omits the object property if there is no data! This is how we handle this problem
        const subtitle = book.subtitle ? book.subtitle : <i>Subtitle not available</i>
        const authors = book.authors ? book.authors.map(auth => auth) : <i>Authors not available</i>
        const publisher = book.publisher ? book.publisher : <i>Publisher not available</i>
        const dateOfPublishing = book.publishedDate ? book.publishedDate : <i>Date of publishing not available</i>
        const description = book.description ? this.cleanHtml(book.description) : <i>Description not available</i>
        const pageCount = book.pageCount ? book.pageCount : <i>Page count not available</i>
        const categories = book.categories ? book.categories.map(cat => cat) : <i>Categories not available</i>
        const userRatings = book.averageRating ? book.averageRating : <i>User rating not available</i>
        const maturityRating = book.maturityRating ? book.maturityRating === 'MATURE' ?
            'Appropriate only for mature readers' : 'Appropriate for all readers' : <i>User rating not available</i>
        const img = book.imageLinks ? book.imageLinks.thumbnail : BookCoverNotAvailable
        const language = book.language ? book.language : <i>Language rating not available</i>

        return (
            <div className='BookDetails'>
                <h3>Book details about <i>{book.title}</i></h3>
                <div className='BookDetails-container'>
                    <div className='BookDetails-left-panel'>
                        <img src={img} alt={book.title} className='BookDetails-img' />
                        {bookIsInJournal ?
                            <div className='BookDetails-is-in-Journal'>Book is in Journal</div>
                            :
                            // This is a helper component for adding books to the Journal
                            <AddBookToJournal classNameProp='BookDetails-add-to-journal-button' bookInput={{
                                id: bookId,
                                title: book.title,
                                img,
                                subtitle: book.subtitle,
                                authors: book.authors
                            }} />
                        }
                    </div>
                    <div className='BookDetails-right-panel'>
                        <p><span className='BookDetails-descriptor'>Title:</span> {book.title}</p>
                        <p><span className='BookDetails-descriptor'>Subtitle:</span> {subtitle}</p>
                        <p><span className='BookDetails-descriptor'>Authors:</span> {authors}</p>
                        <p><span className='BookDetails-descriptor'>Publisher:</span> {publisher}</p>
                        <p><span className='BookDetails-descriptor'>Date of publishing:</span> {dateOfPublishing}</p>
                        <p><span className='BookDetails-descriptor'>Description:</span> {description}</p>
                        {this.industryIdentifiersPrintout()}
                        <p><span className='BookDetails-descriptor'>Page count:</span> {pageCount}</p>
                        <p><span className='BookDetails-descriptor'>Categories:</span> {categories}</p>
                        <p><span className='BookDetails-descriptor'>User rating:</span> {userRatings}</p>
                        <p><span className='BookDetails-descriptor'>Мaturity rating:</span> {maturityRating}</p>
                        <p><span className='BookDetails-descriptor'>Language:</span> {language}</p>
                    </div>
                </div>
                <button onClick={this.props.history.goBack} className='BookDetails-back-button'>Back</button>
            </div>
        )
    }
}

// Needed for Redux connect()
const mapStateToProps = state => ({ ...state })

// Needed for Redux connect()
const mapDispatchToProps = {
    setMyBooks,
    setFilteredBooks
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BookDetails))