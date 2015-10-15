$(document).ready(function() {
  var arrCards = [ 'akita', 'corgi', 'dalmation', 'golden', 'husky', 'kingcharles', 'labrador'
                    , 'papillon' , 'pug', 'rottweiler', 'shibainu', 'westie' ];
  var numOfCards = 12;
  var selectedCards = arrCards.slice(0, numOfCards);
  var cardDeck = selectedCards.slice(0);
  cardDeck = $.merge(cardDeck, selectedCards);
  cardDeck = _.shuffle(cardDeck);
  var firstCard = '';
  var secondCard = '';
  var numOfGuess = 30; // more to change this somewhere else!
  var numOfCorrect = 0;
  var timelimit = 90; // in second
  var timerInterval = ''
  var display = $('#count-down');

  console.log( cardDeck );
  $('#restart-btn').hide();
  $('.status-bar').hide()
  // showDeck function
  var showDeck = function() {
    startTimer(timelimit, display);
    $('#chances-left').html(numOfGuess);
    // in window show 8 card images
    // assign each card with value from array
    $cardList = $('<div>').attr('class', 'list-of-card');
    $deckOfCard = $('.deck-of-card');
    $.each(cardDeck, function(index, card) {
    // assign all cards to a variable
      var $card = $('<div>').attr({ class: 'card down', 'data-card': card } );
      $cardList.append($card);
    });
    $deckOfCard.append($cardList);
    console.log('all card in the deck')
    $('.card').removeClass('disableKey');
    $('.status-bar').show();
    $('#restart-btn').show();
  }

  // Click a card event
  $('.deck-of-card').on('click', '.card', function() {
    checkValidity();

    if (firstCard === '') {
      // event to get the value card clicked
      // save the value
      firstCard = $(event.target).data('card');
    } else {
      secondCard = $(event.target).data('card');
    }

    // if 2 value saved, run compareCard
    if ( $('.ready').length == 2 ) {
      compareCard(firstCard, secondCard);
    }
    numOfGuess--;
    $('#chances-left').html(numOfGuess);

    if ( numOfCorrect === ( cardDeck.length / 2 ) ) {
      celebrate();
      return
    } else if ( numOfGuess === 0 ) {
      gameOver();
      return
    }

  });

  var checkValidity = function() {
    if ( $(event.target).attr('class') === 'card up' ) {
      $('#comment').html('Pick another card!');
    } else {
      flipCardUp();
    }
  };

  var compareCard = function(first, second) {
    console.log('comparing cards');
    if ( first === second ) {
      $('.ready').removeClass('ready');
      numOfCorrect++;
    } else {
      setTimeout(flipCardDown, 1000);
    }
    firstCard = '';
    secondCard = '';
  }; 

  var celebrate = function() {
    $('#win-lose').html('YEY!');
    $('#comment').html('You found them all in ' + (cardDeck.length - numOfGuess) + ' guesses!');
    clearInterval(timerInterval);
    $('.card').addClass('disableKey');
  };

  var gameOver = function() {
    $('#win-lose').html('YEY!');
    $('#comment').html('You ... nevermind, who\'s next?');
    clearInterval(timerInterval);
    $('.card').addClass('disableKey');
  };

  var flipCardUp = function() {
    $(event.target).attr( 'class', 'card up ready' );
    $(event.target).css('background-image', 'url(img/' + $(event.target).data('card') + '.jpg)');
    console.log('card flipped up');
  }

  var flipCardDown = function() {
    $('.ready').removeClass('up').addClass('down').removeClass('ready');
    $('.down').css('background-image', 'url(img/card-back.png)');
    console.log('card flipped down');
  }

  var startGame = function() {
    $('.start-game').hide();
    $('.head').toggleClass('head-start');
    $('#title').toggleClass('title-start');
    showDeck();
  };

  var restartGame = function() {
    cardDeck = _.shuffle(cardDeck);
    firstCard = '';
    secondCard = '';
    numOfGuess = 30;
    numOfCorrect = 0;
    clearInterval(timerInterval);
    $('.list-of-card').remove();
    showDeck();
    // to welcome section
  };

  startTimer = function(duration, display) {
    
    var timer = duration, minutes, seconds;
    timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.html(minutes + ":" + seconds);

        if (--timer < 0) {
            // timer = duration;
            gameOver();
            return
          }
      }, 1000);
  }

  $('#restart-btn').on('click', restartGame);
  $('#start-btn').on('click', startGame);

});