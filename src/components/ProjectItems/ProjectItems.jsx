import React from 'react';
import PropTypes from 'prop-types';
import ProjectItem from '../ProjectItem/ProjectItem';

class ProjectItems extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          projects: [],
        };
      }
    componentDidMount() {
        // Fetch the project data from the local JSON file
        fetch(this.props.path)
          .then(response => response.json())
          .then(data => {
            this.setState({ projects: data });
          })
          .catch(error => {
            console.error('Error fetching project data:', error);
          });
    }

    render() {
        const isUnmounting = this.props.isUnmounting;
        const containerClass = isUnmounting ? 'fly-out' : '';

        return (
            <div className={`ProjectItems ${containerClass}`}>
                {this.state.projects.map((project, index) => (
                    <ProjectItem
                        key={index}
                        name={project.name}
                        date={project.date}
                        body={project.body}
                        image_src={project.image_src}
                    />
                ))}
            </div>
        );
    }
}

ProjectItems.propTypes = {
    isUnmounting: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired
};

export default ProjectItems;