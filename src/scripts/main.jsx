function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

function main(){
    root.render(<RootPage></RootPage>)
}

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
                {this.state.currentPage == 0 ? <Homepage switchToProjects={this.switchToProjects.bind(this)} switchToAboutMe={this.switchToAboutMe.bind(this)} switchToExpirences={this.switchToExpirences.bind(this)} isUnmounting={this.state.isUnmounting}></Homepage> : null}
                {this.state.currentPage == 1 ? <ProjectsPage backgroundIsStill={this.state.backgroundIsStill} isUnmounting={this.state.isUnmounting}></ProjectsPage> : null}
                {this.state.currentPage == 2 ? <AboutMePage backgroundIsStill={this.state.backgroundIsStill} isUnmounting={this.state.isUnmounting}></AboutMePage> : null}
                {this.state.currentPage == 3 ? <ExpirencesPage backgroundIsStill={this.state.backgroundIsStill} isUnmounting={this.state.isUnmounting}></ExpirencesPage> : null}
                {this.state.currentPage != 0 ? <SwitchBar switchToProjects={this.switchToProjects.bind(this)} switchToAboutMe={this.switchToAboutMe.bind(this)} switchToExpirences={this.switchToExpirences.bind(this)}></SwitchBar> : null}
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



class ProjectsPage extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="ProjectsPage">
                <ProjectItems isUnmounting={this.props.isUnmounting} path={'information/projects.json'} backgroundIsStill={this.props.backgroundIsStill}></ProjectItems>
            </div>
        )
    }
}

class ExpirencesPage extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="ProjectsPage">
                
                <ProjectItems isUnmounting={this.props.isUnmounting} path={'information/expirences.json'} backgroundIsStill={this.props.backgroundIsStill}></ProjectItems>
            </div>
        )
    }
}


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
 


class ConwayBackground extends React.Component{

    constructor(props){
        super(props)
        this.space = []
        this.old_space = []
        window.addEventListener("resize", this.reload.bind(this))
        this.currRefreshRate = 1000
    }

    initSpace() {
        
        for (let y = 0; y < this.height/4; y++){
            this.space[y] = []
            for (let x = 0; x < this.width/4; x++){
                if (Math.random() >= .9){
                    this.space[y][x] = 1
                }else{
                    this.space[y][x] = 0
                }
            }
        }
        
        this.interval = setInterval(this.draw.bind(this), 1500)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    changeInterval(){
        clearInterval(this.interval);
        this.interval = setInterval(this.draw.bind(this), 100)
        this.currRefreshRate = 100;
    }
    
    stepSpace(){
        const startTime = performance.now();
        let newSpace = []
        let fourth_of_height = this.height/4
        let fourth_of_width = this.width/8
        for (let y = 0; y < fourth_of_height; y++){
            newSpace[y] = []
            for (let x = 0; x < fourth_of_width; x++){
                if (this.props.gameMode == "fill"){
                    newSpace[y][x] = this.updateLocationFillMode(y, x)
                }else if (this.props.gameMode == "conway"){
                    newSpace[y][x] = this.updateLocationConway(y, x)
                }else if (this.props.gameMode == "clear"){
                    newSpace[y][x] = this.updateLocationClearMode(y, x)
                }else if (this.props.gameMode == "move"){
                    if (this.currRefreshRate != 100){
                        this.changeInterval()
                    }
                    newSpace[y][x] = this.updateLocationMoveToSide(y, x)
                }
            }
        }
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        
        console.log(`Function execution time: ${elapsedTime} milliseconds`);
        this.space = newSpace
    }

    updateLocationClearMode(y,x){
        let count = 0
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                if (y+i >= 0 && y+i < this.height/4 && x+j >= 0 && x+j < this.width/4){
                    if (this.space[y+i][x+j] == 1){
                        count +=1
                    }
                }
            }
        }
        if (this.space[y][x] == 1){
            count -= 1
        }
        if (this.space[y][x] == 1 && count < 2) { // If live and <2 live neighbors
            return 0
        } else if (this.space[y][x] == 1 && count > 3) { // If live and >3 live neighbors
            return 0
        } else if (this.space[y][x] == 0 && count == 3) { // If dead and 3 live neighbors
            return 0
        }
        return this.space[y][x]
    }

    updateLocationFillMode(y,x){
        let count = 0
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                if (y+i >= 0 && y+i < this.height/4 && x+j >= 0 && x+j < this.width/4){
                    if (this.space[y+i][x+j] == 1){
                        count +=1
                    }
                }
            }
        }
        if (this.space[y][x] == 1){
            count -= 1
        }
        if (this.space[y][x] == 1 && count < 2) { // If live and <2 live neighbors
            return 1
        } else if (this.space[y][x] == 1 && count > 3) { // If live and >3 live neighbors
            return 1
        } else if (this.space[y][x] == 0 && count == 3) { // If dead and 3 live neighbors
            return 1
        }
        return this.space[y][x]
    }

    updateLocationConway(y,x){
        let count = 0
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                if (y+i >= 0 && y+i < this.height/4 && x+j >= 0 && x+j < this.width/4){
                    if (this.space[y+i][x+j] == 1){
                        count +=1
                    }
                }
            }
        }
        if (this.space[y][x] == 1){
            count -= 1
        }
        if (this.space[y][x] == 1 && count < 2) { // If live and <2 live neighbors
            return 0
        } else if (this.space[y][x] == 1 && count > 3) { // If live and >3 live neighbors
            return 0
        } else if (this.space[y][x] == 0 && count == 3) { // If dead and 3 live neighbors
            return 1
        }
        return this.space[y][x]
    }

    // updateLocationMoveToSide(y,x){//Interesting dissapear thing
    //     let num = Math.floor(Math.random() * 2);
    //     if (num == 1){
    //         if (x > this.width/8 + 2){
    //             if (this.space[y][x-2] == 1 && this.space[y][x] == 0){
    //                 return 1
    //             }
    //             if (this.space[y][x] == 1 && this.space[y][x+2] == 0){
    //                 return 0
    //             }
    //         }else if (x < this.width/8 - 2){
    //             if (this.space[y][x+2] == 1 && this.space[y][x] == 0){
    //                 return 1
    //             }
    //             if (this.space[y][x] == 1 && this.space[y][x-2] == 0){
    //                 return 0
    //             }
    //         }
    //     }
    //     return 0
    // }


    updateLocationMoveToSide(y,x){ 
        let num = Math.floor(Math.random() * 5);
        let diff = 0
        if (num == 1){
            diff = 1
        }else{
            diff = 2
        }
        if (x > this.width/16){
            diff = -diff
        }
        if (this.space[y][x + diff] == 1 && this.space[y][x] == 0){
            return 1
        }
        if (this.space[y][x] == 1 && this.space[y][x - diff] == 0){
            return 0
        }
        return this.space[y][x]
    }

    draw(){
        let percent = this.are2DArraysPercentEqual(this.old_space, this.space)
        if (percent >= 0){
            this.props.isStillCallback(true)
            console.log("still")
            if (percent >= 100){
                return
            }
        }
        if (canvas.getContext) {
            this.props.isStillCallback(false)
            this.old_space = this.space
            var start = new Date();
            const ctx = canvas.getContext("2d", { alpha: false });
            const cellSize = 8;
            const width = canvas.width / cellSize;
            const height = canvas.height / cellSize;
            
            // Create an off-screen canvas to draw the grid
            const offscreenCanvas = document.createElement("canvas");
            offscreenCanvas.width = canvas.width;
            offscreenCanvas.height = canvas.height;
            const offscreenCtx = offscreenCanvas.getContext("2d");
        
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                offscreenCtx.fillStyle = this.space[y][x] === 0 ? "white" : "grey";
                offscreenCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
              }
            }
        
            // Draw the off-screen canvas onto the visible canvas
            ctx.drawImage(offscreenCanvas, 0, 0);
            var end = new Date();
            var millisecondsElapsed = end - start;
            console.log(millisecondsElapsed)
            this.stepSpace();
            if (this.props.gameMode == "move"){
                this.stepSpace();
                this.stepSpace();
                // this.stepSpace();
                // this.stepSpace();
            }
          }
    }

    are2DArraysPercentEqual(arr1, arr2) {
        if (!arr1 || !arr2) return false;
        if (arr1.length !== arr2.length || arr1[0].length !== arr2[0].length) return false;
    
        let totalElements = arr1.length * arr1[0].length;
        let equalElements = 0;
    
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr1[i].length; j++) {
                if (arr1[i][j] === arr2[i][j]) {
                    equalElements++;
                }
            }
        }
        let equalityPercentage = (equalElements / totalElements) * 100
        return equalityPercentage;
    }
    // draw(){
    //     if (canvas.getContext) {
    //         var start = new Date();
    //         const ctx = canvas.getContext("2d", { alpha: false });
    //         const cellSize = 4;
    //         const width = canvas.width / cellSize;
    //         const height = canvas.height / cellSize;

    //         // Create ImageData and buffer
    //         var imageData = ctx.createImageData(canvas.width, canvas.height);
    //         var buf = new Uint32Array(imageData.data.buffer);

    //         for (let y = 0; y < height; y++) {
    //             for (let x = 0; x < width; x++) {
    //                 const isAlive = this.space[y][x] === 1;
    //                 const color = isAlive ? 0xFFA9A9A9 : 0xFFFFFFFF; // Grey : White
    //                 const xPos = Math.floor(x * cellSize);
    //                 const yPos = Math.floor(y * cellSize);

    //                 for (let i = 0; i < cellSize; i++) {
    //                     for (let j = 0; j < cellSize; j++) {
    //                         const pixelIndex = (yPos + j) * canvas.width + (xPos + i);
    //                         buf[pixelIndex] = color;
    //                     }
    //                 }
    //             }
    //         }

    //         // Draw buffer to the canvas
    //         ctx.putImageData(imageData, 0, 0);

    //         var end = new Date();
    //         var millisecondsElapsed = end - start;
    //         console.log(millisecondsElapsed);
    //         this.stepSpace();

    //         }
    // }

    canvasSetUp(){
        const canvas = document.getElementById("canvas")
        canvas.width  = window.innerWidth
        canvas.height = window.innerHeight
        this.width = canvas.width
        this.height = canvas.height
    }

    componentDidMount(){
        this.canvasSetUp()
        this.initSpace()
    }

    reload(){
        this.canvasSetUp()
        this.initSpace()
    }

    render(){
        return(
            <canvas id="canvas"></canvas>
        )
    }
}



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

const root = ReactDOM.createRoot(document.querySelector("root"))
main();