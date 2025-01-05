import React from 'react';
import PropTypes from 'prop-types';

class AboutMePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayedText: '',
            fullText: "My name is Zachary Decker, and I am currently pursuing a master's degree in computer science at Cornell Tech, with a strong focus on artificial intelligence and robotics. Previously, I completed my undergraduate studies as a double major in Computer Science and Software Engineering at Rose-Hulman Institute of Technology, where I graduated magna cum laude. \n I have gained valuable experience through internships at companies like DEKA and AON Devices, working on innovative projects that involved terrain mapping algorithms and neural networks. My research endeavors include collaborating on deep learning applications and contributing to publications in artificial life. \n In addition to my technical skills in languages such as Python, Java, and C++, I thrive in team environments and enjoy tackling complex problems. Outside of academics, I am an avid basketball player and stay active through CrossFit and outdoor activities. I am excited to continue exploring the intersection of technology and creativity in my future endeavors!",
        };
    }

    componentDidMount() {
        // Set the displayedText immediately to the fullText without the typewriter effect
        this.setState({ displayedText: this.state.fullText });
    }

    render() {
        const { isUnmounting } = this.props;
        const containerClass = isUnmounting ? 'fade-out' : '';

        return (
            <div id="aboutMeContainer" className={containerClass}>
                {/* <img 
                    id="aboutMeImage" 
                    src="path/to/your/image.jpg" 
                    alt="About Me Image" 
                /> */}
                <p id="aboutMeText">
                    {this.state.displayedText}
                </p>
            </div>
        );
    }
}

AboutMePage.propTypes = {
    isUnmounting: PropTypes.bool.isRequired
};

export default AboutMePage;