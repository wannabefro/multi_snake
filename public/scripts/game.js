var firebase = new Firebase('https://multi-snake.firebaseIO.com');
var allSnakes = firebase.child('game');
var randomString = Math.random().toString(36).substring(7);
var mySnake = firebase.child('game/snake' + randomString);
var color = get_random_color();
function get_random_color() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}
// Constants
var Right_Arrow = 39;
var Left_Arrow = 37;
var Up_Arrow = 38;
var Down_Arrow = 40;
var Still = 1;

//Snake
var snakeWidth = 10;
var snakeHeight = 10;

//Stage
var stageWidth = 1200;
var stageHeight = 700;
var stage = new Kinetic.Stage({
  container: 'container',
  width: stageWidth,
  height: stageHeight
});

//*****Initialize grid
grid = initGrid();

//********Initialize snake
var snakeTail;
var snakeHead;
var snakeNewPart;
var snakeParts = 1;
var score = 0;
var initSnakePosition = randomCell(grid.length - 1);
var snakePart = new Kinetic.Rect({
  name: randomString,
  x: grid[initSnakePosition].col,
  y: grid[initSnakePosition].row,
  width: snakeWidth,
  height: snakeHeight,
  fill: color,
});
snakePart.position = snakeParts;
snakeHead = snakePart;
snakeTail = snakePart;

var snake = {name: randomString, snakeTail: snakeTail, snakePart: snakePart, snakeHead: snakeHead, snakeParts: snakeParts}

var randomFoodCell = randomCell(grid.length - 1);
var food = new Kinetic.Circle({
  id: 'food',
  x:grid[randomFoodCell].col+5,
  y:grid[randomFoodCell].row+5,
  radius: 5,
  fill: 'black'

});

// add the shapes (sanke and food) to the layer
var layer = new Kinetic.Layer();
layer.add(snakePart);
layer.add(food);
// add the layer to the stage
stage.add(layer);

var where = Still;
var gameInterval = self.setInterval(function(){gameLoop(snake)},70);
$( document ).ready(function() {
  mySnake.set({name: randomString, color: color, score: score});
  changeSnakes();
  removeSnakes();
  addSnakes();
  $(document).keydown(function(e) {

    switch(e.keyCode) {
      // User pressed "up" arrow
      case Up_Arrow:
        where = Up_Arrow;
      break;
      // User pressed "down" arrow
      case Down_Arrow:
        where = Down_Arrow;
      break;
      // User pressed "right" arrow
      case Right_Arrow:
        where = Right_Arrow;
      break;
      // User pressed "left" arrow
      case Left_Arrow:
        where = Left_Arrow;
      break;

    }
    mySnake.update({snake: JSON.stringify(snake), where: where});
  });

});

function gameLoop(snake)
{
  if(checkGameStatus(snake))
    move(snake, where);
  else
    {
      clearInterval(gameInterval);//Stop calling gameLoop()
      alert('Game Over!');
    }
}

function move(snake, direction)
{
  //Super hint: only move the tail
  var foodHit = false;
  switch(direction)
  {
    case Down_Arrow:
      foodHit = snakeEatsFood(snake, direction);
    var anim2 = new Kinetic.Animation(function(frame) {
      if(foodHit)
        {
          snake.snakeHead.setY(snake.snakeHead.getY()+10);
          growSnake(snake, direction);
          if(snake.snakeHead.getY() == stageHeight)
            snake.snakeHead.setY(0);
          relocateFood(snake);
        }
        else
          {
            snake.snakeTail.setY(snake.snakeHead.getY()+10);
            snake.snakeTail.setX(snake.snakeHead.getX());
            if(snake.snakeTail.getY() == stageHeight)
              snake.snakeTail.setY(0);
            rePosition(snake);
          }

    }, layer);

    anim2.start();
    anim2.stop();

    break;

    case Up_Arrow:
      foodHit = snakeEatsFood(snake, direction);
    var anim2 = new Kinetic.Animation(function(frame) {
      if(foodHit)
        {
          snake.snakeHead.setY(snake.snakeHead.getY()-10);
          growSnake(snake, direction);
          if(snake.snakeHead.getY() < 0)
            snake.snakeHead.setY(stageHeight-10);
          relocateFood(snake);
        }
        else
          {
            snake.snakeTail.setY(snake.snakeHead.getY()-10);
            snake.snakeTail.setX(snake.snakeHead.getX());
            if(snake.snakeTail.getY() < 0)
              snake.snakeTail.setY(stageHeight-10);
            rePosition(snake);
          }

    }, layer);

    anim2.start();
    anim2.stop();

    break;
    case Right_Arrow: //right arrow

      foodHit = snakeEatsFood(snake, direction);
    var anim2 = new Kinetic.Animation(function(frame) {
      if(foodHit)
        {
          snake.snakeHead.setX(snake.snakeHead.getX()+10);
          growSnake(snake, direction);
          if(snake.snakeHead.getX() == stageWidth)
            snake.snakeHead.setX(0);
          relocateFood(snake);
        }
        else
          {
            snake.snakeTail.setX(snake.snakeHead.getX()+10);
            snake.snakeTail.setY(snake.snakeHead.getY());
            if(snake.snakeTail.getX() == stageWidth)
              snake.snakeTail.setX(0);
            rePosition(snake);
          }

    }, layer);

    anim2.start();
    anim2.stop();

    break;
    case Left_Arrow: //Left arrow

      foodHit = snakeEatsFood( snake, direction);
    var anim2 = new Kinetic.Animation(function(frame) {
      if(foodHit)
        {
          snake.snakeHead.setX(snake.snakeHead.getX() - 10);
          growSnake(snake, direction);
          if(snake.snakeHead.getX() < 0)
            snake.snakeHead.setX(stageWidth - 10);
          relocateFood(snake);
        }
        else
          {
            snake.snakeTail.setX(snake.snakeHead.getX()-10);
            snake.snakeTail.setY(snake.snakeHead.getY());
            if(snake.snakeTail.getX() < 0)
              snake.snakeTail.setX(stageWidth-10);
            rePosition(snake);
          }

    }, layer);

    anim2.start();
    anim2.stop();

    break;
  }
}

//Check game status like...game over
function checkGameStatus(snake)
{
  var gameStatus = true;
  if(!(snake.snakeHead == snake.snakeTail))
    {
      var snakePartsArray = stage.get('.' + snake.name);
      for( partIndex = 0; partIndex < snake.snakeParts; partIndex++)
      {
        if(snake.snakeHead != snakePartsArray[partIndex])
          {
            if(snake.snakeHead.getX() == snakePartsArray[partIndex].getX() && snake.snakeHead.getY() == snakePartsArray[partIndex].getY())
              gameStatus =  false;
          }
      }
    }
    return gameStatus;
}

//Allocate position to food item
function relocateFood(snake)
{
  //*****Reinitialize grid to find exclusive food position, eliminate the areas under snake
  var cell;
  var grid=[];
  var columns = stageWidth/snakeWidth;
  var rows = stageHeight / snakeHeight;
  for(col=1; col< columns; col++)
  for(row=1; row< rows; row++)
  {
    var addToGrid = true;
    cell = {"col":col*snakeHeight, "row":row*snakeWidth};
    var snakePartsArray = stage.get('.' + snake.name);
    for( partIndex = 0; partIndex < snakeParts; partIndex++)
    {
      if(snakePartsArray[partIndex].getX() == cell.col && snakePartsArray[partIndex].getY() == cell.row)
        {
          addToGrid = false;
          break;
        }
    }
    if(addToGrid)
      grid.push(cell);
  }

  var randomFoodCell = randomCell(grid.length - 1);
  food.setX(grid[randomFoodCell].col+5);
  food.setY(grid[randomFoodCell].row+5);

}
function snakeEatsFood(snake, direction)
{
  var eats = false;
  switch(direction)
  {
    case Down_Arrow:
      eats = snake.snakeHead.getX() == food.getX()-food.getWidth()/2 && snake.snakeHead.getY()+10 == food.getY()-food.getHeight()/2;
    break;
    case Up_Arrow:
      eats = snake.snakeHead.getX() == food.getX()-food.getWidth()/2 && snake.snakeHead.getY()-10 == food.getY()-food.getHeight()/2;
    break;
    case Right_Arrow:
      eats = snake.snakeHead.getX()+10 == food.getX()-food.getWidth()/2 && snake.snakeHead.getY() == food.getY()-food.getHeight()/2;
    break;
    case Left_Arrow:
      eats = snake.snakeHead.getX()-10 == food.getX()-food.getWidth()/2 && snake.snakeHead.getY() == food.getY()-food.getHeight()/2;
    break;
  }
  if(eats == true) {
    score++; $('#score').html('<p>' + score + '</p>');
    mySnake.update({score: score});
  }
  return eats ;
}

//Re-assign position numbers as snake moves
function rePosition(snake)
{
  var snakePartsArray = stage.get('.' + snake.name);
  for( partIndex = 0; partIndex < snake.snakeParts; partIndex++)
  {
    snakePartsArray[partIndex].position = snakePartsArray[partIndex].position +1 ;
  }
  for( partIndex = 0; partIndex < snakeParts; partIndex++)
  {
    if(snakePartsArray[partIndex].position > snakeParts)
      {
        snakePartsArray[partIndex].position = 1;
        snakeHead = snakePartsArray[partIndex];
      }
      if(snakePartsArray[partIndex].position == snakeParts)
        {
          snakeTail = snakePartsArray[partIndex];
        }

  }
}

//Reset snake parts and positions if new part is added
function resetPositions(snake)
{
  snake.snakeParts++;

  if(snake.snakeHead == snake.snakeTail)
    {
      snake.snakeTail = snake.snakePart;
      snakePart.position = snake.snakeParts;
    }
    else
      {
        snake.snakePart.position = snake.snakeHead.position + 1;
        snakeNewPart =  snake.snakePart;
      }
      var snakePartsArray = stage.get('.' + snake.name);
      for( partIndex = 0; partIndex < snake.snakeParts; partIndex++)
      {
        if(!(snakePartsArray[partIndex] == snake.snakeHead || snakePartsArray[partIndex] == snakeNewPart))
          {
            snakePartsArray[partIndex].position = snakePartsArray[partIndex].position + 1;
          }
      }
}
//Create new snake part
function createSnakePart(snake, x,y)
{
  var snakePart = new Kinetic.Rect({
    name: snake.name,
    x: x,
    y: y,
    width: snakeWidth,
    height: snakeHeight,
    fill: color,

  });
  layer.add(snakePart);

  return snakePart;
}
//Grow snake length after eating food
function growSnake(snake, direction)
{
  switch(direction)
  {
    case Down_Arrow:
      var x, y;
    x = snake.snakeHead.getX();
    y = snake.snakeHead.getY()-10;
    resetPositions(createSnakePart(snake, x,y));

    break;
    case Up_Arrow:
      var x, y;
    x = snake.snakeHead.getX();
    y = snake.snakeHead.getY()+10;
    resetPositions(createSnakePart(snake, x,y));

    break;
    case Right_Arrow:
      var x, y;
    x = snake.snakeHead.getX()-10;
    y = snake.snakeHead.getY();
    resetPositions(createSnakePart(snake, x,y));

    break;
    case Left_Arrow:
      var x, y;
    x = snake.snakeHead.getX()+10;
    y = snake.snakeHead.getY();
    resetPositions(createSnakePart(snake,x,y));

    break;
  }
}

function randomCell(cells)
{
  return Math.floor((Math.random()*cells));
}
function initGrid()
{
  //*****Initialize Grid
  var grid=[];
  var columns = stageWidth/snakeWidth;
  var rows = stageHeight / snakeHeight;
  for(col=0; col< columns; col++)
  for(row=0; row< rows; row++)
  {
    cell = {"col":col*snakeHeight, "row":row*snakeWidth};
    grid.push(cell);
  }

  return grid;
}

$(window).unload(function(){
  mySnake.remove();
});

function changeSnakes(){
  allSnakes.on('child_changed', function(snake, prevChildName) {
    if (snake.val().color != color){
      clearInterval(snake.val().name);
      var oldSnakes = stage.get('.'+snake.val().name);
      if (oldSnakes.length > 0){
        for (var i = 0; i < oldSnakes.length; i++){
          oldSnakes[i].remove();
        }
      }
      parsedSnake = parseSnake(JSON.parse(snake.val().snake));
      snake.val().name = setInterval(gameLoop(parsedSnake, 70));
    }
  });
}

function addSnakes(){
  allSnakes.on('child_added', function(snake, prevChildName) {
    if (snake.val().color != color && snake.val().snake != undefined){
      makeSnake(snake.val());
    }
  });
}

function removeSnakes(){
  allSnakes.on('child_removed', function(oldSnake){
    if (oldSnake.val().snake != undefined){
      var oldSnakes = stage.get('.'+oldSnake.val().name);
      if (oldSnakes.length > 0){
        for (var i = 0; i < oldSnakes.length; i++){
          oldSnakes[i].remove();
        }
      }
    }
  });
}

function parseSnake(newSnake){
  var snakePart = Kinetic.Node.create(newSnake.snakePart, 'rectangle');
  var snakeTail = Kinetic.Node.create(newSnake.snakeTail, 'rectangle');
  var snakeHead = Kinetic.Node.create(newSnake.snakeHead, 'rectangle');
  var snake = {snakeParts: newSnake.snakeparts, snakePart: snakePart, snakeTail: snakeTail, snakeHead: snakeHead, name: newSnake.name}
  layer.add(snakePart);
  layer.add(snakeTail);
  layer.add(snakeHead);
  return snake;
}

function makeSnake(snake){
  var newSnake = JSON.parse(snake.snake)
  snake = parseSnake(newSnake);
  snake.name = setInterval(gameLoop(snake, 70));
}
