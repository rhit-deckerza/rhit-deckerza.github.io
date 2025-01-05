import React from 'react';
import PropTypes from 'prop-types';

class Title extends React.Component{

    constructor(props){
        super(props)
    }


    render(){
        return(
            <div id="titleContainer" className={this.props.containerFade}>
                <div className={this.props.textFade} id="title">Zachary Decker</div>
                <div className={this.props.textFade} id="subtitle">Portfolio Website</div>
                <div className={this.props.textFade} id="options"><span id="AboutMe" onClick={this.props.aboutMeOnClick}>About Me</span> | <span id="Projects" onClick={this.props.projectsOnClick}>Projects</span> | <span id="Experience" onClick={this.props.expirencesOnClick}>Experience</span></div>
            </div>
        )
    }

}

Title.propTypes = {
    containerFade: PropTypes.string.isRequired,
    textFade: PropTypes.string.isRequired,
    aboutMeOnClick: PropTypes.func.isRequired,
    projectsOnClick: PropTypes.func.isRequired,
    expirencesOnClick: PropTypes.func.isRequired
};

export default Title;