var x = true;
var o = false;
var userid = Date.now();
var ref = new Firebase('https://arnoldtictac.firebaseio.com/');
var playersRef = ref.child('players');
var player;
var myTurn;



$(document).ready(init);

var mainRef = new Firebase('https://arnoldtictac.firebaseio.com/');
var userRef = mainRef.push();
var connectedRef = new Firebase("https://arnoldtictac.firebaseio.com//.info/connected");


userRef.on('value', function(snapshot) {
	console.log("luck");
	// if (snapshot.val()) {
	// 	userRef.onDisconnect().remove();
	// 	userRef.set(true);
	// }
});

connectedRef.on("value", function(isOnline) {
	if (isOnline.val()) {
	  userRef.onDisconnect().remove();
	}
});

function init(){
	userRef.set("here");

	 $('.box').on('click', turnHandler)
	 $('#submit').on('click',enterName)

	 ref.child('turn').on('value',function(snap){
	 	var whoseTurnIsIt = snap.val();
	 	if(!whoseTurnIsIt){
	 		return;
	 	} 
	 	if(whoseTurnIsIt === player)
	 		myTurn = true;
	 })	 	
	var x = true;
}

function markBox(){
	if(myTurn !== player){
		return;
	}
	if(myTurn === player){
		//markBox
	}
}


function enterName(){

	console.log($('#username').val());
	playersRef.once('value',function(snapshot){
		console.log(snapshot.val());

		if(!snapshot.val()){
		   playersRef.push($('#username').val());
		   player = 'player1'
		}

		else if(Object.keys(snapshot.val()).length===1){
			playersRef.push($('#username').val());
			player = 'player2'
			startGame();
		}
		else{
			return;
		}
	});
}

function startGame(){
ref.child('turn').set('player1');


}






function turnHandler(event){
	if (x===true){
		if($(this).text() !== 'O' && $(this).text() === ''){
			$(this).text('X')
			$('.turn').text("O's");
			x = false;
		}
	}	

	else{
		if($(this).text()!=='X' && $(this).text() === ''){
			$(this).text('O')
			$('.turn').text("X's");
			x = true;	
		}
	}
	winner();
}

function winner()
{
	squares = squareMatrix();

	if (rowWin(squares) === 3 ||colWin(squares) === 3 ||diagWin(squares) === 3)
		alert("X Wins !!! ");
	else if (rowWin(squares) === -3 ||colWin(squares) === -3 ||diagWin(squares) === -3)
		alert("O Wins !!! ");
	
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
