import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import ValidationError from '../ValidationError'
import config from '../config'
import './AddFolder.css'

export default class AddFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            touched: false
        }
    }
   
    static defaultProps = {
        history: {
            push: () => {}
        }
    }
    
    static contextType = ApiContext

    updateFolderName = (event) => {
        this.setState ({
            name: event.target.value,
            touched: true
        })
    }

    validateFolderName = () => {
        const name = this.state.name.trim();
        if (name.length === 0) {
            return 'Folder name is required';
        } 
    }

    handleSubmit = e => {
        e.preventDefault()
        const folder = {
            name: this.state.name
        }
        fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(folder)
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(e => Promise.reject(e))
            } 
            return res.json()
        })
        .then(folder => {
            this.context.addFolder(folder)
            this.props.history.push(`/folder/${folder.id}`)
        })
        .catch(error => {
            console.error({ error })
        })
    }

    render() {
        return (
            <section className='AddFolder'>
                <h2>Create a folder</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='folder-name-input'>
                            Name
                        </label>
                        <input 
                            type='text' 
                            id='folder-name-input' 
                            name='folder-name' 
                            onChange={e => this.updateFolderName(e)}
                        />
                        {this.state.touched && (
                            <ValidationError message={this.validateFolderName()} />
                        )}
                    </div>
                    <div className='buttons'>
                        <button 
                            type='submit'
                            disabled= {
                                this.validateFolderName()
                            }
                        >
                            Add folder
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}