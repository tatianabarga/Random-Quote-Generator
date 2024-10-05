import React from "https://esm.sh/react";
import ReduxjsToolkit from "https://esm.sh/@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reactRedux from "https://esm.sh/react-redux";

//REDUX

const PULL = 'PULL';
const RECEIVED = 'RECEIVED';

// action creator for pulling a quote
const pullQuote = () => {
	return { type: PULL };
};

const quoteReceived = (data) => {
	return { 
		type: RECEIVED,
		content: data.content,
		author: data.author
	};
}


// async action creator for dispatching api calls
const handlePullQuote = () => {
	return function(dispatch) {
		dispatch(pullQuote());
		// fetch data
		fetch('https://api.quotable.io/random')
		.then((response) => response.json())
		.then((data) => {
			dispatch(quoteReceived(data)); //dispatch received action
		})
		.catch((error) => {
			console.error('Error fetching quote:', error);
		});
	};
};

//Redux store with async reducer:
const store = Redux.createStore(
	reducer,
	Redux.applyMiddleware(ReduxThunk.default)
);

//default state
const defaultState = {
	fetching: false,
	content: '',
	author: ''
}


// reducer for async data
const reducer = (state = defaultState, action) => {
	switch (action.type) {
		case PULL:
			return {
				...state,
				fetching: true,
				content: '',
				author: ''
			};
		case RECEIVED:
			return {
				...state,
				fetching: false,
				content: action.content,
				author: action.author
			};
		default:
			return state;
    }
}



//REACT


// quote display react element
class QuoteBox extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		this.props.dispatch(handlePullQuote());
	}
	render() {
		const { fetching, content, author } = this.props;
		return (
			<div id="quote">
				{fetching ? (
					<p>Loading...</p>
				) : (
					<div>
						<div id="text">"{content}"</div>
						<div id="author">- {author}</div>
					</div>
				)}
				<a href='twitter.com/intent/tweet' passHref id="tweet-quote"> Tweet Quote </a>
				<button id="new-quote" onClick={this.props.dispatch(handlePullQuote())}> New Quote </button>
			</div>
		);
	}
}

//React-Redux

const mapStateToProps = (state) => {
	return {
		fetching: state.fetching,
		content: state.content,
		author: state.author,
	};
}

const mapDispatchToProps = (dispatch) => {
	handlePulQuote: () => dispatch(handlePullQuote())
}

const Container = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuoteBox)

class AppWrapper extends React.Component {
	constructor(props) {
		super(props);
	}
	render () {
		return (
			<Provider store={store}>
				<Container/>
			</Provider>
		)
	}
}

ReactDom.render(<AppWrapper/>, document.getElementById("react-element"));
