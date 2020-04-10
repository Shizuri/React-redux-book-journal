// This component displays details about the book.
// If the data is already fetched during the search it will be used right away.
// If is not stored in state it will be fetched again from the Google Books API.
import React, { useState, useContext, useEffect } from 'react'
import BookCoverNotAvailable from './images/BookCoverNotAvailable.png'
import { useParams, useHistory } from 'react-router-dom'
import { SearchContext } from './searchContext'
import { JournalContext } from './journalContext'
import './BookDetails.css'

const BookDetails = props => {
    const { bookId } = useParams() // Get the book id that is sent as the book parameter in the URL
    const history = useHistory() // Browsing history provided by react-router

    const { bookResults } = useContext(SearchContext) // If the page details are already in the bookResults, there is no need to fetch them from the API again
    const { myBooks, addBookToJournal } = useContext(JournalContext) // Function to add the book to the journal
    const bookIsInJournal = myBooks.some(book => book.bookId === bookId) // Check if the book is already in the Journal

    const [book, setBook] = useState({}) // State for the book that we are currently looking at

    // The Google Books API has some inconsistencies.
    // When getting data from the search APi path the description is clean but if you get the data from the
    // direct book API URI the data can containing HTML tags in it. This cleans it in a safe way.
    const cleanHtml = html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    // The Google Books API just omits the object property if there is no data! This is how we handle this problem
    const subtitle = book.subtitle ? book.subtitle : <i>Subtitle not available</i>
    const authors = book.authors ? book.authors.map(auth => auth) : <i>Authors not available</i>
    const publisher = book.publisher ? book.publisher : <i>Publisher not available</i>
    const dateOfPublishing = book.publishedDate ? book.publishedDate : <i>Date of publishing not available</i>
    const description = book.description ? cleanHtml(book.description) : <i>Description not available</i>
    const pageCount = book.pageCount ? book.pageCount : <i>Page count not available</i>
    const categories = book.categories ? book.categories.map(cat => cat) : <i>Categories not available</i>
    const userRatings = book.averageRating ? book.averageRating : <i>User rating not available</i>
    const maturityRating = book.maturityRating ? book.maturityRating === 'MATURE' ?
        'Appropriate only for mature readers' : 'Appropriate for all readers' : <i>User rating not available</i>
    const img = book.imageLinks ? book.imageLinks.thumbnail : BookCoverNotAvailable
    const language = book.language ? book.language : <i>Language rating not available</i>


    useEffect(() => {
        // Get a single book from the Google Books API
        const getABook = () => {
            fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
                .then((response) => {
                    return response.json()
                })
                .then((myJson) => {
                    setBook(myJson.volumeInfo)
                    document.title = myJson.volumeInfo.title
                })
        }

        // If we are missing the data, fetch the data again, but just for this book.
        if (!bookResults.some(book => book.id === bookId)) {
            getABook(bookId)
        } else {
            // If the data is still here from the performed search, get it from Context API
            const foundBook = bookResults.filter(book => book.id === bookId)[0].volumeInfo
            setBook(foundBook)
            document.title = foundBook.title
        }

        // document.title = book.title
    }, [bookId, bookResults])

    // Because of inconsistency issues with the Google Books API some requests require a bit of management 
    const industryIdentifiersPrintout = () => {
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

    return (
        <div className='BookDetails'>
            <h3>Book details about <i>{book.title}</i></h3>
            <div className='BookDetails-container'>
                <div className='BookDetails-left-panel'>
                    <img src={img} alt={book.title} className='BookDetails-img'/>
                    {bookIsInJournal ?
                        <div className='BookDetails-is-in-Journal'>Book is in Journal</div>
                        : <button onClick={() => addBookToJournal({ 
                            id: bookId, 
                            title: book.title, 
                            img, 
                            subtitle : book.subtitle,
                            authors: book.authors
                            })} className='BookDetails-add-to-journal-button'>Add to Journal</button>}
                </div>
                <div className='BookDetails-right-panel'>
                    <p><span className='BookDetails-descriptor'>Title:</span> {book.title}</p>
                    <p><span className='BookDetails-descriptor'>Subtitle:</span> {subtitle}</p>
                    <p><span className='BookDetails-descriptor'>Authors:</span> {authors}</p>
                    <p><span className='BookDetails-descriptor'>Publisher:</span> {publisher}</p>
                    <p><span className='BookDetails-descriptor'>Date of publishing:</span> {dateOfPublishing}</p>
                    <p><span className='BookDetails-descriptor'>Description:</span> {description}</p>
                    {industryIdentifiersPrintout()}
                    <p><span className='BookDetails-descriptor'>Page count:</span> {pageCount}</p>
                    <p><span className='BookDetails-descriptor'>Categories:</span> {categories}</p>
                    <p><span className='BookDetails-descriptor'>User rating:</span> {userRatings}</p>
                    <p><span className='BookDetails-descriptor'>Мaturity rating:</span> {maturityRating}</p>
                    <p><span className='BookDetails-descriptor'>Language:</span> {language}</p>
                </div>
            </div>
            <button onClick={history.goBack} className='BookDetails-back-button'>Back</button>
        </div>
    )
}
export default BookDetails

// Component to show all of the details about a book once it is clicked in the list of queried books