import React, { Component } from 'react'
import './App.css'
import BookBrowser from './BookBrowser'
import BookDetails from './BookDetails'
import Journal from './Journal'
import JournalEntryDetails from './JournalEntryDetails'
import EditJournalEntry from './EditJournalEntry'
import { NavLink, Route, Switch, Redirect, withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { setMyBooks } from './redux/journalData'

class App extends Component {
	swipeNavigate() {
		// The code here is for the purpose of swipe navigation on mobile devices

		// Swipe Up / Down / Left / Right
		let initialX = null
		let initialY = null

		const startTouch = e => {
			initialX = e.touches[0].clientX
			initialY = e.touches[0].clientY
		}

		const moveTouch = e => {
			if (!initialX || !initialY) {
				return
			}

			const currentX = e.touches[0].clientX
			const currentY = e.touches[0].clientY

			const diffX = initialX - currentX
			const diffY = initialY - currentY

			if (Math.abs(diffX) > Math.abs(diffY)) {
				// sliding horizontally
				if (diffX > 0) {
					// swiped left
					if (this.props.history.location.pathname === '/book-browser') {
						this.props.history.push('/journal')
					}
				} else {
					// swiped right
					if (this.props.history.location.pathname === '/journal') {
						this.props.history.push('/book-browser')
					}
				}
			} else {
				// sliding vertically
				if (diffY > 0) {
					// swiped up
				} else {
					// swiped down
				}
			}

			initialX = null
			initialY = null

			e.preventDefault()
		}

		document.addEventListener('touchstart', startTouch, false)
		document.addEventListener('touchmove', moveTouch, false)
	}

	componentDidMount() {
		// Load the books from localStorage to state at the start of the application.
		this.props.setMyBooks(JSON.parse(localStorage.getItem('books') || '[]'))
	}

	render() {
		this.swipeNavigate()
		// console.log('App props: ', this.props)	

		return (
			<div className='App'>
				<nav className='App-nav'>
					<NavLink exact to='/book-browser' activeClassName='App-nav-active' className='App-nav-link'>Book Browser</NavLink>
					<NavLink exact to='/journal' activeClassName='App-nav-active' className='App-nav-link'>Book Journal</NavLink>
				</nav>

				<Switch>
					<Route exact path='/book-browser'>
						<BookBrowser />
					</Route>
					<Route exact path='/journal'>
						<Journal />
					</Route>
					<Route exact path={'/book-browser/:bookId'}>
						<BookDetails />
					</Route>
					<Route exact path={'/journal/:bookId'}>
						<JournalEntryDetails />
					</Route>
					<Route exact path={'/journal/edit/:bookId'}>
						<EditJournalEntry />
					</Route>
					<Redirect exact from='/' to='/book-browser' />
				</Switch>
			</div>
		)
	}
}

// Needed for Redux connect()
const mapStateToProps = state => ({ ...state.journalData })

// Needed for Redux connect()
const mapDispatchToProps = {
    setMyBooks: setMyBooks
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
// withRouter is needed for the access of the current page location this.props.history.location.pathname