document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    

    const mini_grid = document.querySelector('.mini-grid')
    for (let i = 0; i < 200; i++){
        let node = document.createElement("div")
        grid.appendChild(node)
      }
      for (let i = 0; i < 10; i++){
        let node = document.createElement("div")
        node.classList.add('taken')
        grid.appendChild(node)
      }
      for (let i = 0; i < 16; i++){
        let node = document.createElement("div")
        mini_grid.appendChild(node)
      }




    let squares = Array.from(document.querySelectorAll('.grid div'))
    let miniGridSquares = Array.from(document.querySelectorAll('.mini-grid div'))
    const scoreDisplay = document.querySelector('#score')
    const levelDisplay = document.querySelector("#level")
    const startBtn = document.querySelector('#start-button')
    const leftBtn = document.querySelector("#left-button")
    const upBtn = document.querySelector("#up-button")
    const downBtn = document.querySelector("#down-button")
    const rightBtn = document.querySelector("#right-button")


    const width = 10
    let nextRandom = 0
    let timerId
    let timerIdInterval = 1000
    let score = 0
    let overAllScore = checkforOverAllScoreInLocalStorage()
    // let level = checkForLevelsInLocalStorage()
    let level = localStorage.getItem('LEVEL') || 1;
levelDisplay.innerHTML = level;

    const colors = [
        '#ff595e',
        '#ffca3a',
        '#8ac926',
        '#3a86ff',
        '#ffffff'
    ]
    function checkForLevelUp() {
        if (score >= 10 && level === 1) {
            level++;
            localStorage.setItem('LEVEL', level);
            levelDisplay.innerHTML = level;
            clearInterval(timerId);
            timerIdInterval *= 0.75;
            timerId = setInterval(moveDown, timerIdInterval);
        } else if (score >= 20 && level === 2) {
            level++;
            localStorage.setItem('LEVEL', level);
            levelDisplay.innerHTML = level;
            clearInterval(timerId);
            timerIdInterval *= 0.75;
            timerId = setInterval(moveDown, timerIdInterval);
        }
        // add more else if statements for additional levels
    }
    function updateScore(points) {
        score += points;
        scoreDisplay.innerHTML = score;
        checkForLevelUp();
    }
    timerId = setInterval(moveDown, timerIdInterval);

        //arrow buttons functionality

        leftBtn.addEventListener('click',moveLeft)
        upBtn.addEventListener('click',rotate)
        downBtn.addEventListener('click',moveDown)
        rightBtn.addEventListener('click',moveRight)
    
    // The tetrominos
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2],
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]



    let currentPosition = 4
    let currentRotation = 0
    //randomly select a tetromino and its first rotation
    let random = Math.floor(Math.random() * theTetrominos.length)
    let current = theTetrominos[random][currentRotation]

    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //undrow the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }


    // make tetromino move down every certain time
    // timerId = setInterval(moveDown, 600)

    // assign functions to keyCodes
    function control(e) {

        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        }
        else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }

    }
    document.addEventListener('keyup', control)


    //move down function 
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    let currentMiniTetromino = []


    //freeze function
    function freeze() {

        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))

            //start a new tetromino
            // clearTetromino()

            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominos.length)
            current = theTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }


    //move the tetromino left unless is at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }


    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if (!isAtRightEdge) currentPosition += 1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }

    ///FIX ROTATION OF TETROMINOS A THE EDGE 
    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)  
      }
      
      function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
      }
      
      function checkRotatedPosition(P){
        P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
          if (isAtRight()){            //use actual position to check if it's flipped over to right side
            currentPosition += 1    //if so, add one to wrap it back around
            checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
          if (isAtLeft()){
            currentPosition -= 1
          checkRotatedPosition(P)
          }
        }
    }
    
    //rotate the tetromino

    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
          currentRotation = 0
        }
        current = theTetrominos[random][currentRotation]
        checkRotatedPosition()
        draw()
      }

    // dispaly next tetromino in minigrid 
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    // the tetromios without rotations

    const upNextTetriminos = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //ltetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetremino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetremino
        [0, 1, displayWidth, displayWidth + 1], //oTetremino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetremino
    ]

    //display the shape in the mini grid

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''

        })
        upNextTetriminos[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //add functionality to the button
    startBtn.addEventListener('click', start)
    
    function goToNextLevel(){
        level += 1 
        localStorage.setItem('LEVEL',level)
        localStorage.setItem('overAllScore',overAllScore)
        timerIdInterval *= 0.75
        overAllScore += score
        score = 0
        scoreDisplay.innerHTML = score
        levelDisplay.innerHTML = level
        clearAllSquares()
        start()

    }


   //add score
   function addScore() {
      
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
    
    
    if (score >= level * 50){
      goToNextLevel()
      
    }
  }


    // game over

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
          scoreDisplay.innerHTML = 0
          localStorage.setItem("LEVEL",1)
          localStorage.setItem('overAllScore',0)
          resetToDefaults()
          clearAllSquares()
          alert("  \t\t\t\t\t GAME OVER! \n \t\t\t\t     Overall score is " + overAllScore)
  
          clearInterval(timerId)
        }
      }
      function clearAllSquares(){
          for(let i =0 ; i < 200 ; i ++){
              removeElementStyleAndClass(squares[i])
          }
          miniGridSquares.forEach(element => removeElementStyleAndClass(element))
      }
      function removeElementStyleAndClass(element){
          element.classList = []
          element.style = ''
      }
      function resetToDefaults(){
          level = 0
          overAllScore = 0
          timerIdInterval = 1000
    }
    
    function start(){
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, timerIdInterval)

            displayShape()
        }
    }

        // check for level in local-storage
        function checkForLevelsInLocalStorage(){
            let foundLevel = localStorage.getItem('LEVEL')
            if (foundLevel === null){
               return 1
            }
            levelDisplay.innerHTML = foundLevel
           
   
   
            for(let i = 0; i < foundLevel-1;i++){
               timerIdInterval *= 0.75
            }
            
            return foundLevel
       
       }
       function checkforOverAllScoreInLocalStorage(){
           let overAllScoreFound = localStorage.getItem('overAllScore')
           if (overAllScoreFound === null){
               return 0
           }
           return overAllScoreFound
       }
})