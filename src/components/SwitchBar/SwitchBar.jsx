import React from 'react';
import PropTypes from 'prop-types';

class SwitchBar extends React.Component{
    render(){
        return(
            <div className="SwitchBar">
                <div id="switchBarContainer" className="fade-in">
                    <div id="switchBarOptions"><span id="AboutMe" onClick={this.props.switchToAboutMe}>About Me</span> | <span id="Projects" onClick={this.props.switchToProjects}>Projects</span> | <span id="Experience" onClick={this.props.switchToExpirences}>Experience</span></div>
                </div>
            </div>
        )
    }
}

SwitchBar.propTypes = {
    switchToAboutMe: PropTypes.func.isRequired,
    switchToProjects: PropTypes.func.isRequired,
    switchToExpirences: PropTypes.func.isRequired
};

export default SwitchBar;