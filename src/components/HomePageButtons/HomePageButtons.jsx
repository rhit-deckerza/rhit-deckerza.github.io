import React from 'react';
import PropTypes from 'prop-types';

class HomePageButtons extends React.Component {
    render() {
        return (
            <div className="HomePageButtons">
                <div id="buttonContainer" className="centered">
                    <button id="AboutMe" onClick={this.props.switchToAboutMe}>About Me</button>
                    <button id="Projects" onClick={this.props.switchToProjects}>Projects</button>
                    <button id="Experience" onClick={this.props.switchToExperiences}>Experience</button>
                    <button id="Contact" onClick={this.props.switchToContact}>Contact</button>
                </div>
            </div>
        );
    }
}

HomePageButtons.propTypes = {
    switchToAboutMe: PropTypes.func.isRequired,
    switchToProjects: PropTypes.func.isRequired,
    switchToExperiences: PropTypes.func.isRequired,
    switchToContact: PropTypes.func.isRequired
};

export default HomePageButtons;