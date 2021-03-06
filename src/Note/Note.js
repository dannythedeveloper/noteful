import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import ApiContext from '../ApiContext';
import config from '../config';
import './Note.css';

export default class Note extends React.Component {
  static defaultProps = {
    modified: new Date(),
    onDeleteNote: () => {}
  }

  static contextType = ApiContext;

  handleClickDelete = e => {
    e.preventDefault()
    const noteId = this.props.id
    fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
    .then(res => {
      if (!res.ok) {
          return res.json().then(e => Promise.reject(e))
        }
      return res.json()
    })
    .then(() => {
      this.context.deleteNote(noteId)
      this.props.onDeleteNote(noteId)
    })
    .catch(error => {
      alert(`Something went wrong: ${error}. Please refresh the page.`)
    })
  }

  render() {
    const { name, id, modified } = this.props

    return (
      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/note/${id}`}>
            {name}
          </Link>
        </h2>
        <button 
          className='Note__delete' 
          type='button'
          onClick={this.handleClickDelete}
        >
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
              {format(new Date(modified), 'do MMM yyyy')}
            </span>
          </div>
        </div>
      </div>
    )
  }
};

Note.propTypes = {
  noteId: PropTypes.number,
  name: PropTypes.string,
  id: PropTypes.string,
  modified: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)]), 
  onDeleteNote: PropTypes.func
};