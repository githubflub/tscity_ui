import React, { Component } from 'react'

class LoadingSpinner extends Component {
    render() {
        return (
            <div>
                <svg className="spinner" width="100" height="100">
                    <circle cx="50" cy="50" r="42" transform="rotate(-90,50,50)"/>
                </svg>
            </div>
        )
    }
}

export default LoadingSpinner; 