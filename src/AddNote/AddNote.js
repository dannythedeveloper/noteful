import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError/ValidationError';
import config from '../config';
import './AddNote.css';

export default class AddNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            content: '',
            folderId: '',
            modified: '',
            touched: false
        }
    };

    static defaultProps = {
        history: {
            push: () => {}
        }
    };

    static contextType = ApiContext

    updateForm = (event) => {
        this.setState({ [event.target.name] : event.target.value, touched: true })
    };
    
    validateName = () => {
        const name = this.state.name.trim();
        if (name.length === 0) {
            return 'Name is required';
        } 
    };

    validateContent = () => {
        if (this.state.content === '') {
            return true;
        } 
    };

    validateFolder = () => {
        if (this.state.folderId  === '') {
            return true;
        } 
    };

    handleSubmit = e => {
        e.preventDefault()
        const newNote = {
            name: this.state.name,
            content: this.state.content,
            folderId: this.state.folderId,
            modified: new Date()    
        }
        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newNote)
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(e => Promise.reject(e))
            } 
            return res.json()
        })
        .then(note => {
            this.context.addNote(note)
            this.props.history.push(`/folder/${note.folderId}`)
        })
        .catch(error => {
            alert(`Something went wrong: ${error}. Please refresh the page.`)
        })
    };

    render() {
        const { folders } = this.context;
        const nameError = this.validateName();

        return (
            <section className='AddNote'>
                <h2>Create a note</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='note-name-input'>
                            Name
                        </label>
                        <input 
                            type='text'
                            id='note-name-input' 
                            name='name' 
                            onChange={(e) => this.updateForm(e)}
                        />
                        {this.state.touched && (
                            <ValidationError message={nameError} />
                        )}
                    </div>
                    <div className='field'>
                        <label htmlFor='note-content-input'>
                            Content
                        </label>
                        <input 
                            type='text' 
                            id='note-content-input' 
                            name='content' 
                            onChange={(e) => this.updateForm(e)} 
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor='note-folder-select'>
                            Folder
                        </label>
                        <select 
                            id='note-folder-select' 
                            name='folderId'
                            onChange={(e) => this.updateForm(e)}
                        >
                            <option value={null}>...</option>
                            {folders.map(folder =>
                                <option key={folder.id} value={folder.id}>{folder.name}</option>
                            )}
                        </select>
                    </div>
                    <div className='buttons'>
                        <button 
                            type='submit'
                            disabled={
                                this.validateName() ||
                                this.validateContent() ||
                                this.validateFolder()
                            }
                        >
                            Add note
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
};
