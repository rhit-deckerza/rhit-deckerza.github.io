import PropTypes from 'prop-types';
import React from 'react';
import Title from '../Title/Title';

class Homepage extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            containerFade: "fade-in",
            textFade: "none",
            displayTitle: false
        }
    }

    projectsOnClick(){
        this.setState({
            containerFade: "fade-out"
        })
        this.props.switchToProjects()
    }


    aboutMeOnClick(){
        this.setState({
            textFade: "fade-out"
        })
        this.props.switchToAboutMe()
    }

    expirencesOnClick(){
        this.setState({
            containerFade: "fade-out"
        })
        this.props.switchToExpirences()
    }

    componentDidMount(){
        setTimeout( () => this.setState({
            displayTitle: true
        }), 2000)
    }


    render(){
        if (this.state.displayTitle){
            return(
                <div className="Homepage">
                    {<Title containerFade={this.state.containerFade} textFade={this.state.textFade} projectsOnClick={this.projectsOnClick.bind(this)} aboutMeOnClick={this.aboutMeOnClick.bind(this)} expirencesOnClick={this.expirencesOnClick.bind(this)}></Title>}
                </div>
            )
        }else{
            return(
                <div className="Homepage">
                </div>
            )
        }
        
    }
}

Homepage.propTypes = {
    switchToProjects: PropTypes.func.isRequired,
    switchToAboutMe: PropTypes.func.isRequired,
    switchToExpirences: PropTypes.func.isRequired
};

export default Homepage;