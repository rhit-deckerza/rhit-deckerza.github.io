import React from 'react';
import PropTypes from 'prop-types';
import { ConsoleLogger } from 'aws-amplify/utils';

class ConwayBackground extends React.Component{

    constructor(props){
        super(props)
        this.space = []
        this.old_space = []
        window.addEventListener("resize", this.reload.bind(this))
        this.yCounter = 0; // Initialize y-counter
        window.addEventListener("wheel", this.handleScroll.bind(this)); // Add scroll event listener
        this.currRefreshRate = 1000;

        // Define the letters as sets of coordinates relative to the box's top-left corner
        this.letters = {
            Z: [
                // Top horizontal line (y=0)
                [0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0], [9,0],
                [0,1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1],
                [9,2],
                // Diagonal from top-right to bottom-left
                [8,3], [7,4],
                [6,5], [5,6],
                [4,7], [3,8],
                [2,9], [1,9],
                // Bottom horizontal line (y=9)
                [0,9], [1,9], [2,9], [3,9], [4,9], [5,9], [6,9], [7,9], [8,9], [9,9],
                [0,8], [1,8], [2,8], [3,8], [4,8], [5,8], [6,8], [7,8], [8,8], [9,8],
                [0,7], 
                
                [1,6], [2, 5],
                [3, 4], [4, 3],
                [5, 2], [6, 1],
                [7, 0], [8, 0],
            ],
            A: [[4, 0], [5, 0], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [1, 2], [8, 2], [1, 3], [4, 3], [5, 3], [8, 3], [1, 4], [8, 4], [9, 4], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [0, 7], [1, 7], [8, 7], [9, 7], [0, 8], [1, 8], [8, 8], [9, 8], [0, 9], [1, 9], [8, 9], [9, 9]],
            C: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [1, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [1, 2], [3, 2], [1, 3], [3, 3], [1, 4], [3, 4], [1, 5], [3, 5], [1, 6], [3, 6], [1, 7], [3, 7], [1, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9]],
            H: [[0, 0], [1, 0], [2, 0], [7, 0], [8, 0], [9, 0], [0, 1], [2, 1], [7, 1], [9, 1], [0, 2], [2, 2], [7, 2], [9, 2], [0, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [9, 3], [0, 4], [2, 4], [7, 4], [9, 4], [0, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [9, 5], [0, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [9, 6], [0, 7], [2, 7], [7, 7], [9, 7], [0, 8], [2, 8], [7, 8], [9, 8], [0, 9], [1, 9], [2, 9], [7, 9], [8, 9], [9, 9]],
            
            R: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [0, 1], [2, 1], [8, 1], [0, 2], [2, 2], [4, 2], [5, 2], [6, 2], [8, 2], [0, 3], [2, 3], [8, 3], [0, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [0, 5], [2, 5], [3, 5], [6, 5], [0, 6], [2, 6], [4, 6], [5, 6], [7, 6], [0, 7], [2, 7], [5, 7], [6, 7], [8, 7], [0, 8], [2, 8], [6, 8], [8, 8], [0, 9], [1, 9], [2, 9], [7, 9], [8, 9]],
            Y: [[0, 0], [1, 0], [2, 0], [7, 0], [8, 0], [9, 0], [0, 1], [3, 1], [6, 1], [9, 1], [0, 2], [1, 2], [4, 2], [5, 2], [8, 2], [9, 2], [1, 3], [2, 3], [7, 3], [8, 3], [2, 4], [3, 4], [6, 4], [7, 4], [3, 5], [6, 5], [3, 6], [6, 6], [3, 7], [6, 7], [3, 8], [6, 8], [3, 9], [4, 9], [5, 9], [6, 9]],
            D: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [0, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [0, 2], [2, 2], [7, 2], [0, 3], [2, 3], [7, 3], [8, 3], [0, 4], [2, 4], [4, 4], [5, 4], [7, 4], [8, 4], [0, 5], [2, 5], [7, 5], [8, 5], [0, 6], [2, 6], [7, 6], [8, 6], [0, 7], [2, 7], [7, 7], [8, 7], [0, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9]],
            E: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [0, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [0, 2], [2, 2], [0, 3], [2, 3], [0, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [0, 5], [8, 5], [0, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [0, 7], [2, 7], [0, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9]],
            K: [[0, 0], [1, 0], [2, 0], [5, 0], [6, 0], [7, 0], [0, 1], [2, 1], [4, 1], [5, 1], [7, 1], [0, 2], [2, 2], [3, 2], [4, 2], [7, 2], [0, 3], [2, 3], [3, 3], [6, 3], [0, 4], [2, 4], [5, 4], [0, 5], [2, 5], [4, 5], [5, 5], [0, 6], [2, 6], [3, 6], [4, 6], [6, 6], [0, 7], [2, 7], [5, 7], [7, 7], [0, 8], [2, 8], [6, 8], [8, 8], [0, 9], [1, 9], [2, 9], [7, 9], [8, 9]],
            PAUSE:[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [0, 2], [1, 2], [4, 2], [7, 2], [8, 2], [0, 3], [1, 3], [4, 3], [7, 3], [8, 3], [0, 4], [1, 4], [4, 4], [7, 4], [8, 4], [0, 5], [1, 5], [4, 5], [7, 5], [8, 5], [0, 6], [1, 6], [4, 6], [7, 6], [8, 6], [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8]],
            PLAY: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [0, 1], [1, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [0, 2], [1, 2], [6, 2], [7, 2], [8, 2], [0, 3], [1, 3], [7, 3], [8, 3], [0, 4], [1, 4], [8, 4], [0, 5], [1, 5], [7, 5], [8, 5], [0, 6], [1, 6], [6, 6], [7, 6], [8, 6], [0, 7], [1, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8]]
            // Add any additional letters if needed
        };
        
        
        
    }

    handleScroll(event) {
        this.yCounter += Math.floor(event.deltaY / 50); // Update y-counter based on wheel movement
        if (this.yCounter < 0){
            this.yCounter = 0
        }
        console.log(`Y-Counter: ${this.yCounter}`); // Log the y-counter value
    }

    getNameCoordinates(startX, startY) {
        const spacing = 6; // Space between letters
        let coordinates = [];
        
        // Define the sequence of letters to spell "Zachary Decker"
        const nameSequence = ['Z', 'A', 'C', 'H', 'A', 'R', 'Y', 'space', 'D', 'E', 'C', 'K', 'E', 'R', 'PAUSE', 'PLAY'];

        nameSequence.forEach((letter, index) => {
            if (letter === 'space') {
                return;
            }
            this.letters[letter].forEach(([x, y]) => {
                coordinates.push([startX + index * (5 + spacing) + x, startY + y]);
            });
        });

        return coordinates;
    }

    

    initSpace() {
        for (let y = 0; y < this.height / 4; y++) {
            this.space[y] = [];
            for (let x = 0; x < this.width / 4; x++) {
                // Initialize cells randomly
                this.space[y][x] = Math.random() >= 0.9 ? 1 : 0;
            }
        }

        this.interval = setInterval(this.draw.bind(this), 100);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    changeInterval(){
        clearInterval(this.interval);
        this.interval = setInterval(this.draw.bind(this), 100)
        this.currRefreshRate = 100;
    }

    checkRemove(x,y){
        let fourth_of_height = this.height / 4;
        let fourth_of_width = this.width / 8;
        
        // Define the rectangle boundaries
        const rectStartX = Math.floor(fourth_of_width / 4) - 10;
        const rectEndX = Math.floor(3 * fourth_of_width / 4) + 10;
        const rectStartY = Math.floor(fourth_of_height / 4) - 10 - this.yCounter;
        const rectEndY = Math.floor(fourth_of_height / 4) + 20 - this.yCounter;
        if (x >= rectStartX && x <= rectEndX && y >= rectStartY && y <= rectEndY){
            return true
        }
        return false
    }

    checkKeep(x, y){
        let fourth_of_height = this.height / 4;
        let fourth_of_width = this.width / 8;
        // Define the starting position of the name within the box
        const startX = Math.floor((fourth_of_width - 140) / 2 - 11); // Adjust as needed
        const startY = Math.floor(fourth_of_height / 8) - this.yCounter - 25;
        
        // Get the coordinates for the name
        const nameCoords = this.getNameCoordinates(startX, startY);

        // Define the rectangle under the name
        const rectWidth = 140; // Width of the rectangle
        const rectHeight = 30; // Height of the rectangle
        const rectStartX = startX; // Start X position of the rectangle
        const rectStartY = startY + 15; // Start Y position of the rectangle

        // Check if the current (x, y) is part of the name or the rectangle outline
        return nameCoords.some(coord => coord[0] === x && coord[1] === y) ||
            //    (x === rectStartX || x === rectStartX + rectWidth - 1 || // Left or right border
                (y === rectStartY ) || ((x === fourth_of_width/2) && (y >= rectStartY)) //&& // Top or bottom border
            //    (x >= rectStartX && x < rectStartX + rectWidth && y >= rectStartY && y < rectStartY + rectHeight);
    }

    stepSpace(){
        const startTime = performance.now();
        let newSpace = [];
        let fourth_of_height = this.height / 4;
        let fourth_of_width = this.width / 8;
        // let remove = false;
        let keep = false;

        for (let y = 0; y < fourth_of_height; y++) {
            newSpace[y] = [];
            for (let x = 0; x < fourth_of_width; x++) {
                // remove = this.checkRemove(x, y);
                keep = this.checkKeep(x, y);

                
                // if (keep) {
                //     newSpace[y][x] = 1;
                //     continue
                // }
                if (keep && Math.random() < 0.3) {
                    newSpace[y][x] = 1
                    continue
                }
                if (Math.random() < 0.01) {
                    if (!keep) {
                        newSpace[y][x] = 0;
                    }
                } else {
                    // newSpace[y][x] = 1
                    if (this.props.gameMode === "fill") {
                        newSpace[y][x] = this.updateLocationFillMode(y, x);
                    } else if (this.props.gameMode === "conway") {
                        newSpace[y][x] = this.updateLocationConway(y, x);
                    } else if (this.props.gameMode === "clear") {
                        newSpace[y][x] = this.updateLocationClearMode(y, x);
                    } else if (this.props.gameMode === "move") {
                        if (this.currRefreshRate !== 100) {
                            this.changeInterval();
                        }
                        newSpace[y][x] = this.updateLocationMoveToSide(y, x);
                    }
                }
                
            }
        }

        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        // console.log(`Function execution time: ${elapsedTime} milliseconds`);
        this.space = newSpace;
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
        if (this.space[y][x] == 1 && this.checkKeep(x, y)){
            return 1
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
            // console.log("still")
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
                if (this.checkKeep(x, y) && this.space[y][x] == 1){
                    offscreenCtx.fillStyle = "grey";
                } else if (this.checkKeep(x, y)) {
                    offscreenCtx.fillStyle = this.space[y][x] === 0 ? "white" : "grey";
                }else{
                    offscreenCtx.fillStyle = this.space[y][x] === 0 ? "white" : "#ededed";
                }
                offscreenCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
              }
            }
        
            // Draw the off-screen canvas onto the visible canvas
            ctx.drawImage(offscreenCanvas, 0, 0);
            var end = new Date();
            var millisecondsElapsed = end - start;
            // console.log(millisecondsElapsed)
            this.stepSpace();
            if (this.props.gameMode === "move"){
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