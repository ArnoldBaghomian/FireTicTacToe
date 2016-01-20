

// global variables initialized in resetGame();
var x; // = true;


var ref = new Firebase('https://arnoldtictac.firebaseio.com/');
var playersRef = ref.child('players');

var newMoveX = ref.child('newMoveX');  // which box the new move
var newMoveO = ref.child('newMoveO');  // what key to wait on
var newMove;  // = newMoveX; // will hold key for this player
var count = 0;

var g_start; // = false;



$(document).ready(init);

var mainRef = new Firebase('https://arnoldtictac.firebaseio.com/');
var userRef = mainRef.push();
var connectedRef = new Firebase("https://arnoldtictac.firebaseio.com//.info/connected");


connectedRef.on("value", function(isOnline) {
    if (isOnline.val()) {
        userRef.onDisconnect().remove();
    }
});


function init(){


    restartGame();
    $('#newGame').on('click',restartGame);
    $('.box').on('click', turnHandler)
    $('#submit').on('click',enterName)



}

function checkRemove(error)
{
    playersRef.once('value',function(snap){
        count = snap.numChildren();
    });

}

function restartGame(event)
{
    x = true;
    g_start = false;
    playersRef.remove(checkRemove);  // removal did not work until I added the callback function
    playersRef.once('value',function(snap){    // this just counts the number of players for debugging
        count = snap.numChildren();
    });

    newMoveX.set('');  // make sure keys exist
    newMoveO.set('');
    newMove = newMoveX; // will hold key for this player
    clearBoard();

}

function enterName(){


    console.log($('#username').val());
    playersRef.once('value',function(snapshot){
        console.log(snapshot.val());

        if(!snapshot.val()){
            playersRef.push($('#username').val());

            g_token = 'O';
            $('.turn').text("X's turn ... please wait for other player to move.");

            newMoveX.on('value', handleRemoteTurn);
            newMove = newMoveO;  // register new moves for O
            g_start = true;
            x = true;
        }


        else if(Object.keys(snapshot.val()).length===1){
            playersRef.push($('#username').val());

            g_token = 'X';
            x = true;
            $('.turn').text("X's turn ... your move.");
            newMoveO.on("value",handleRemoteTurn);
            newMove = newMoveX; // register new moves for X

            g_start = true;
        }
        else{

            return;
        }
    });

}

function clearBoard()
{
    var box;
    for (var boxnum = 1; boxnum < 10; ++boxnum)
    {
        box = $('#square'+boxnum);
        box.text('')

    }
    g_start = false;
    $('.turn').text("");

}

function handleRemoteTurn(snapshot)
{

    var boxNumber = snapshot.val();
    if (!g_start || boxNumber == null || boxNumber === '' )
    {

        return;
    }

    var box = $('#square'+boxNumber);
    if (x===true){
        if(box.text() !== 'O' && box.text() === ''){
            box.text('X');
            if (g_token === 'O') {
                $('.turn').text("O's turn ... your move.");

            }
            else {
                $('.turn').text("X's turn ... your move.");
                //alert("Sync bug line 140");
            }
            x = false;
        }
    }

    else{
        if(box.text()!=='X' && box.text() === ''){
            box.text('O')

            if (g_token === 'O') {
                $('.turn').text("O's turn ... your move.");

                //alert("Sync bug line 153");
            }
            else {
                $('.turn').text("X's turn ... your move.");
            }
            x = true;
        }
    }
    winner();
}

function turnHandler(event){

    // game not started
    if (!g_start)
        return;

    // did player click when not its turn
    if ((g_token === 'X' && !x) ||(g_token === 'O' && x))
       return;

    var boxNumber = (event.target.id.slice(-1));
    newMove.set(boxNumber);
    if (x===true){
        if($(this).text() !== 'O' && $(this).text() === ''){
            $(this).text('X');
            if (g_token === 'X')
                $('.turn').text("O's turn ... wait for other player to move.");
            x = false;
        }
    }

    else{
        if($(this).text()!=='X' && $(this).text() === ''){
            $(this).text('O')

            if (g_token === 'O')
                $('.turn').text("X's turn ... wait for other player to move.");
            x = true;
        }
    }
    winner();
}

function winner()
{
    squares = squareMatrix();

    if (rowWin(squares) === 3 ||colWin(squares) === 3 ||diagWin(squares) === 3)
    {
        if (g_start) alert("X Wins !!! ");
        g_start = false;
    } else if (rowWin(squares) === -3 ||colWin(squares) === -3 ||diagWin(squares) === -3)
    {
        if (g_start) alert("O Wins !!! ");
        g_start = false;       
    }

    if (fullTie(squares))
    {
        if (g_start) alert("Tie game!!!");
        g_start = false;
    }
};

function squareMatrix() {

    squares = [];  // an array of 3 arrays

    $(".row").each(function()
    {
        row = [];   // an array of 3 numbers
        $(this).children(".box").each(function()
        {
            val = 0;
            if ($(this).text() === 'X') val = 1;
            if ($(this).text() === 'O') val = -1;
            row.push(val);
        })
        squares.push(row);  // add this array of three numbers to the array of 3 arrays
    })

    return squares;   // squares is a 3x3 matrix, an array of arrays
}

function rowWin(squares)
{

    for (i = 0; i < 3; ++i) {
        sum = 0;

        for (j = 0; j < 3; ++j)
            sum += squares[i][j];
        if (Math.abs(sum) === 3)
            return sum;
    }


    return 0;
}


function fullTie(squares)
{
    for (i = 0; i < 3; ++i) {

        for (j = 0; j < 3; ++j)
          if (squares[i][j] == 0)
            return false;
    }


    return true;
}

function colWin(squares)
{
    for (i = 0; i < 3; ++i) {
        sum = 0;
        for (j = 0; j < 3; ++j)
            sum += squares[j][i];
        if (Math.abs(sum) === 3)
            return sum;
    }

    return 0;
}

function diagWin(squares)
{
    sum = 0;
    for (i = 0; i < 3; ++i) {
        sum += squares[i][i];
    }
    if (Math.abs(sum) === 3)
        return sum;
    sum = 0;
    for (i = 0; i < 3; ++i) {
        sum += squares[2-i][i];
    }
    if (Math.abs(sum) === 3)
        return sum;

    return 0;
}
