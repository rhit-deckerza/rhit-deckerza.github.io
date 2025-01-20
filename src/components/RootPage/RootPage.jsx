import React from 'react';
import Homepage from '../Homepage/HomePage';
import ProjectsPage from '../ProjectsPage/ProjectsPage';
import AboutMePage from '../AboutMePage/AboutMePage';
import ExpirencesPage from '../ExpirencesPage/ExpirencesPage';
import HomePageButtons from '../HomePageButtons/HomePageButtons';
import ConwayBackground from '../ConwayBackground/ConwayBackground';


class RootPage extends React.Component{
  constructor(props){
      super(props)
      this.state = {
          fillTime: "conway",
          displayTitle: false,
          currentPage: 0,
          backgroundIsStill: false,
          isUnmounting: false
      }
  }

  moveBackground(){
      this.setState({
          fillTime: "move"
      })
  }

  switchToProjects(){
      if (this.state.currentPage !== 1) {
          this.moveBackground()
          this.setState({
              isUnmounting: true
          })
          setTimeout(() => {this.setState({currentPage: 1, isUnmounting: false})}, 2500)
      }
  }
  switchToAboutMe(){
      if (this.state.currentPage !== 2) {
          this.setState({
              fillTime: "conway"
          })
          this.setState({
              isUnmounting: true
          })
          setTimeout(() => {this.setState({currentPage: 2, isUnmounting: false})}, 2500)
      }
  }

  switchToExpirences(){
      if (this.state.currentPage !== 3) {
          this.moveBackground()
          this.setState({
              isUnmounting: true
          })
          setTimeout(() => {this.setState({currentPage: 3, isUnmounting: false})}, 2500)
      }
  }

  render(){

      return(
          <div className="RootPage">
              {/* {this.state.currentPage == 0 ? <AboutMePage backgroundIsStill={this.state.backgroundIsStill} isUnmounting={this.state.isUnmounting}></AboutMePage> : null}
              {this.state.currentPage == 1 ? <ProjectsPage backgroundIsStill={this.state.backgroundIsStill} isUnmounting={this.state.isUnmounting}></ProjectsPage> : null}
              {this.state.currentPage == 3 ? <ExpirencesPage backgroundIsStill={this.state.backgroundIsStill} isUnmounting={this.state.isUnmounting}></ExpirencesPage> : null} */}
              {/* <HomePageButtons switchToProjects={this.switchToProjects.bind(this)} switchToAboutMe={this.switchToAboutMe.bind(this)} switchToExpirences={this.switchToExpirences.bind(this)}></HomePageButtons> */}
              <ConwayBackground gameMode={this.state.fillTime} isStillCallback={this.isStillCallback.bind(this)}></ConwayBackground>
          </div>
      )
  }

  isStillCallback(bool){
      this.setState({
          backgroundIsStill: bool
      })
  }
}

export default RootPage;