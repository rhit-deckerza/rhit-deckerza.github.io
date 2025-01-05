import React from 'react';
import PropTypes from 'prop-types';

class ProjectItem extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="ProjectItem">
                <div className="ProjectItemTitleText">
                    <div className="ProjectItemTitle">{this.props.name}</div>
                    <div className="ProjectItemDate">{this.props.date}</div>
                    <div className="ProjectItemText">{this.props.body}</div>
                </div>
                <img className="ProjectItemImage" src={this.props.image_src}></img>
            </div>
        )
    }

}

ProjectItem.propTypes = {
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    image_src: PropTypes.string.isRequired
};

export default ProjectItem;