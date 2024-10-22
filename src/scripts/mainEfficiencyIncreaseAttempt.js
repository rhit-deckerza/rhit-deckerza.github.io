function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

function main(){
    root.render(<Homepage></Homepage>)
}

class Homepage extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            fillTime: "conway",
            containerFade: "fade-in"
        }
    }

    aboutMeOnClick(){
        this.setState({
            fillTime: "fill",
            containerFade: "fade-out"
        })
        setTimeout()
    }

    changeToClearMode(){

    }


    render(){
        return(
            <div className="Homepage">
                <Title containerFade={this.state.containerFade} aboutMeOnClick={this.aboutMeOnClick.bind(this)}></Title>
                <ConwayBackground gameMode={this.state.fillTime}></ConwayBackground>
            </div>
        )
    }
}


class ConwayBackground extends React.Component{

    constructor(props){
        super(props)
        this.space = []
        window.addEventListener("resize", this.reload.bind(this))
        this.didSwitch = false
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
        this.interval = setInterval(this.draw.bind(this), 50)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    changeInterval(){
        clearInterval(this.interval);
        this.interval = setInterval(this.draw.bind(this), 50)
        this.didSwitch = true;
    }

    stepSpace(){
        let newSpace = []
        for (let y = 0; y < this.height/4; y++){
            newSpace[y] = []
            for (let x = 0; x < this.width/4; x++){
                if (this.props.gameMode == "fill"){
                    if (!this.didSwitch){
                        this.changeInterval()
                    }
                    newSpace[y][x] = this.updateLocationFillMode(y, x)
                }else if (this.props.gameMode == "conway"){
                    newSpace[y][x] = this.updateLocationConway(y, x)
                }else if (this.props.gameMode == "clear"){
                    newSpace[y][x] = this.updateLocationClearMode(y, x)
                }
            }
        }
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

    draw(){
        if (canvas.getContext) {
            const ctx = canvas.getContext("2d", {alpha:false});
            var imageData = ctx.createImageData(canvas.width, canvas.height)
            var i = 0
            for (let y = 0; y < canvas.height/4 ; y++){
                for (let x = 0; x < canvas.width/4 ; x++){
                    if (this.space[y][x] == 0){
                        this.setPixel(imageData, x, y, 255, 255, 255, 255)                    
                    }else{
                        this.setPixel(imageData, x, y, 128, 128, 128, 255)                         
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0)
            this.stepSpace()
        }
    }

    setPixel(imageData, x, y, r, g, b, a) {
        const index = x + y * imageData.width;
        imageData.data[index * 4] = r;
        imageData.data[index * 4 + 1] = g;
        imageData.data[index * 4 + 2] = b;
        imageData.data[index * 4 + 3] = a;
    }

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
        clearInterval(this.interval)
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
                <div id="title">Zachary Decker</div>
                <div id="subtitle">Portfolio Website</div>
                <div id="options"><span id="AboutMe" onClick={this.props.aboutMeOnClick}>About Me</span> | <span id="Projects">Projects</span> | <span id="Experience">Experience</span></div>
            </div>
        )
    }

}

const root = ReactDOM.createRoot(document.querySelector("root"))
main();