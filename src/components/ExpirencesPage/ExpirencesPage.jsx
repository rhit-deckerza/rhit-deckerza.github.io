import React from 'react';
import PropTypes from 'prop-types';
import ProjectItems from '../ProjectItems/ProjectItems';

class ExpirencesPage extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="ProjectsPage">
                
                <ProjectItems isUnmounting={this.props.isUnmounting} path={'data/expirences.json'} backgroundIsStill={this.props.backgroundIsStill}></ProjectItems>
            </div>
        )
    }
}

ExpirencesPage.propTypes = {
    isUnmounting: PropTypes.bool.isRequired,
    backgroundIsStill: PropTypes.bool.isRequired
};

export default ExpirencesPage;