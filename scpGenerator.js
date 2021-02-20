//Init basic arrays and variables
var zeroClass = {};
var oneClass = {};
var threeClass = {};
var fourClass = {};
var players = [];
var playerClasses = {};
var textStorage = [];
var colorStorage = [];
var generationAmount = 0;


var roundNum = 1;

var sheet = SpreadsheetApp.getActiveSheet();

function convertRange() {
  players.forEach(function(player){
    var classType = playerClasses[player]
    var classString;
    var classColor;
    if (classType == 0) {
      classString = 'SCP';
      classColor = 'red';
      zeroClass[player] = 0;
      oneClass[player]++;
      threeClass[player]++;
      fourClass[player]++;
    } else if (classType == 1) {
      classString = 'Guard';
      classColor = 'gray';
      zeroClass[player]++;
      oneClass[player] = 0;
      threeClass[player]++;
      fourClass[player]++;
    } else if (classType == 3) {
      classString = 'Scientist';
      classColor = 'yellow';
      zeroClass[player]++;
      oneClass[player]++;
      threeClass[player] = 0;
      fourClass[player]++;
    } else if (classType == 4) {
      classString = 'D-Class';
      classColor = 'orange';
      zeroClass[player]++;
      oneClass[player]++;
      threeClass[player]++;
      fourClass[player] = 0;
    }
    var richText = SpreadsheetApp.newRichTextValue()
      .setText(classString)
      .build();
    textStorage.push([richText]);
    colorStorage.push([classColor]);
  });
}

function createNewColumn() {
  var lastColumn = sheet.getLastColumn();
  var roundNumber = sheet.getRange(1, lastColumn).getValue().split(" ")[1];
  if (lastColumn < 2) {
    lastColumn = 1;
  }

  var text = 'Round '.concat(roundNum.toString());

  var whiteText = SpreadsheetApp.newTextStyle()
    .setForegroundColor('white')
    .build();
  var richText = SpreadsheetApp.newRichTextValue()
    .setText(text)
    .setTextStyle(0, text.length, whiteText)
    .build();
  textStorage.push([richText]);
  colorStorage.push(['blue']);
  convertRange();
  var range = sheet.getRange(1, lastColumn + 1, 21);
  range.setRichTextValues(textStorage);
  range.setBackgrounds(colorStorage);
  roundNum++;
}

//Related to setting up player tables
function getPlayers() {
  return [...players];
}

function initPlayers() {
  for (i = 1; i <= 20; i++) {
    var key = 'player'.concat(i.toString());
    players.push(key);
  }
}

function removeFromArray(array, data) {
  var index = array.indexOf(data)
  if (index > -1) {
    array.splice(index, 1);
  }
}

//Function to set all starter playable classes at 0.
function initPlayableClasses() {
  var players = getPlayers();
  players.forEach(function(player) {
    zeroClass[player] = 0;
    oneClass[player] = 0;
    threeClass[player] = 0;
    fourClass[player] = 0;
  });
}

function initNewRound() {
  players.forEach(function(player) {
    playerClasses[player] = 4;
    textStorage = [];
    colorStorage = [];
  });
}

function getHighestNumber(players, array) {
  var highestLevel = 0;
  players.forEach(function(player) {
    if (array[player] > highestLevel) {
      highestLevel = array[player];
    }
  });
  return highestLevel;
}

function addArray(array1, array2) {
  array1.forEach(function(value) {
    array2.push(value);
  });
}

function getHighestPlayers(players, array, arrayLength) {
  var level = getHighestNumber(players, array);
  var possible = [];
  var confirmed = [];

  while (level > -1 && (possible.length + confirmed.length) < arrayLength) {
    addArray(possible, confirmed)
    possible = [];
    players.forEach(function(player) {
      if (array[player] == level) {
        possible.push(player);
      }
    });
    level--;
    if ((confirmed.length + possible.length == arrayLength)) {
      addArray(possible, confirmed)
    }
  }
  return [confirmed, possible];
}

function selectZero(playerList) {
  var data = getHighestPlayers(playerList, zeroClass, 4);
  var confirmed = data[0],
  possible = data[1];



  var highestScore = 0;
  var cache = [];
  while (confirmed.length !== 4) {
    if (cache.length > 1) {
      var chosenIndex = Math.floor(Math.random() * cache.length)
      var chosenObject = cache[chosenIndex];
      confirmed.push(chosenObject);
      removeFromArray(cache, chosenObject);
      removeFromArray(possible, chosenObject)
      continue;
    } else if (cache.length == 1) {
      confirmed.push(cache[0]);
      removeFromArray(possible, cache[0])
      cache.pop();
      continue;
    }

    highestScore = 0;

    possible.forEach(function(player){
      var playerScore = (oneClass[player] + threeClass[player]) - fourClass[player]; 
      if (playerScore == highestScore) {
        cache.push(player);
      } else if (playerScore > highestScore) {
        cache = [player];
        highestScore = playerScore;
      }
    });
  }

  confirmed.forEach(function(player) {
    removeFromArray(playerList, player);
    playerClasses[player] = 0;
  });
  return confirmed;
}

function selectOne(playerList) {
  var data = getHighestPlayers(playerList, oneClass, 5);
  var confirmed = data[0],
  possible = data[1];



  var highestScore = 0;
  var cache = [];
  while (confirmed.length !== 5) {
    if (cache.length > 1) {
      var chosenIndex = Math.floor(Math.random() * cache.length)
      var chosenObject = cache[chosenIndex];
      confirmed.push(chosenObject);
      removeFromArray(cache, chosenObject);
      removeFromArray(possible, chosenObject)
      continue;
    } else if (cache.length == 1) {
      confirmed.push(cache[0]);
      removeFromArray(possible, cache[0])
      cache.pop();
      continue;
    }

    highestScore = 0;

    possible.forEach(function(player){
      var playerScore = (zeroClass[player] + threeClass[player]) - fourClass[player]; 
      if (playerScore == highestScore) {
        cache.push(player);
      } else if (playerScore > highestScore) {
        cache = [player];
        highestScore = playerScore;
      }
    });
  }

  confirmed.forEach(function(player) {
    removeFromArray(playerList, player);
    playerClasses[player] = 1;
  });
  return confirmed;
}

function selectThree(playerList) {
  var data = getHighestPlayers(playerList, threeClass, 3);
  var confirmed = data[0],
  possible = data[1];



  var highestScore = 0;
  var cache = [];
  while (confirmed.length !== 3) {
    if (cache.length > 1) {
      var chosenIndex = Math.floor(Math.random() * cache.length)
      var chosenObject = cache[chosenIndex];
      confirmed.push(chosenObject);
      removeFromArray(cache, chosenObject);
      removeFromArray(possible, chosenObject)
      continue;
    } else if (cache.length == 1) {
      confirmed.push(cache[0]);
      removeFromArray(possible, cache[0])
      cache.pop();
      continue;
    }

    highestScore = 0;

    possible.forEach(function(player){
      var playerScore = (zeroClass[player] + threeClass[player]) - fourClass[player]; 
      if (playerScore == highestScore) {
        cache.push(player);
      } else if (playerScore > highestScore) {
        cache = [player];
        highestScore = playerScore;
      }
    });
  }

  confirmed.forEach(function(player) {
    removeFromArray(playerList, player);
    playerClasses[player] = 3;
  });
  return confirmed;
}

function main() {
  //Create new game instance
  Logger.log('Started')
  initPlayers();
  initPlayableClasses();
  for (i = 0; i < generationAmount; i++) {
    Logger.log('Started Round');
    var roundPlayers = getPlayers();
    initNewRound();
    //playerClasses = {};
    selectZero(roundPlayers);
    Logger.log('Zero Created');
    selectOne(roundPlayers);
    Logger.log('One Created');
    selectThree(roundPlayers);
    Logger.log('Three Created');
    createNewColumn();
    Logger.log('Ended Round');
    Utilities.sleep(500);
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SCP Generation')
    .addItem('Generate', 'generate')
    .addToUi();
}

function generate() {
  var ui = SpreadsheetApp.getUi();
  var promptResp = ui.prompt('How many rounds would you like to generate?');
  var response = promptResp.getResponseText();
  var parsedInt = parseInt(response);
  if (!isNaN(parsedInt) && parsedInt > 0) {
    ui.alert('Generation Started.', ui.ButtonSet.OK);
    generationAmount = parsedInt;
    main();
  } else {
    ui.alert('Please input a valid positive number.', ui.ButtonSet.OK);
  }
}
