import React from 'react';
import PropTypes from 'prop-types';

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
        const canvas = document.getElementById("canvas");
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

ConwayBackground.propTypes = {
    gameMode: PropTypes.string.isRequired,
    isStillCallback: PropTypes.func.isRequired
};

export default ConwayBackground;