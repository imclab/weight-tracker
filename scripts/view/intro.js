/**
 * Represent the introduction view. Shows cards sequentially for user settings
 * and orientation information.
 * @license see /LICENSE
 */
WT.View.Intro = function(elementId) {

	var element = document.getElementById(elementId);
  var cards = element.querySelectorAll('.card');
  var next = element.querySelectorAll('.next');
  var options = element.querySelectorAll('.options a');
  var currentCard = 0;
  var currentCardControl = null;
  var user = WT.App.getUser();

  function addEventListeners () {

    for (var n = 0; n < next.length; n++) {
      next[n].addEventListener('click', onNextClick, false);
      next[n].addEventListener('touchend', onNextClick, false);
    }

    for (var o = 0; o < options.length; o++) {
      options[o].addEventListener('click', onOptionSelect, false);
      options[o].addEventListener('touchend', onOptionSelect, false);
    }
  }

  function removeEventListeners () {
    for (var n = 0; n < next.length; n++) {
      next[n].removeEventListener('click', onNextClick, false);
      next[n].removeEventListener('touchend', onNextClick, false);
    }

    for (var o = 0; o < options.length; o++) {
      options[o].removeEventListener('click', onOptionSelect, false);
      options[o].removeEventListener('touchend', onOptionSelect, false);
    }
  }

  function onOptionSelect(evt) {

    evt.preventDefault();

    var target = evt.target;
    var optionGroup = target.parentNode;
    var optionsInGroup = optionGroup.querySelectorAll('a');

    for (var o = 0; o < optionsInGroup.length; o++) {
      optionsInGroup[o].classList.remove('selected');
    }

    target.classList.add('selected');
  }

  function onNextClick(evt) {

    evt.preventDefault();

    destructCard();

    var nextCard = currentCard + 1;
    var currentCardElement = cards[currentCard];
    var nextCardElement = cards[nextCard];
    var options = currentCardElement.querySelector('.options');

    if (!!options) {
      var selectedOption = options.querySelector('.selected');
      var optionTarget = options.dataset.target;
      var optionValue = selectedOption.dataset.value;

      WT.App.dispatchEvent(element, 'updatedsetting', {
        target: optionTarget,
        value: optionValue
      });
    }

    currentCardElement.classList.add('previous');
    currentCardElement.classList.remove('current');

    if (nextCard < cards.length) {
      nextCardElement.classList.add('current');
      nextCardElement.classList.remove('next');

      currentCard++;
      constructCard();
    } else {
      WT.App.dispatchEvent(element, 'introcomplete');
    }
  }

  function constructCard() {

    var canvas = cards[currentCard].querySelector('canvas');

    if (!!canvas) {

      switch (canvas.dataset.type) {

        case "dial":

          var max = parseFloat(canvas.dataset.max);
          var value = WT.App.getValue(canvas.dataset.label);
          var ratio = parseFloat(canvas.dataset.ratio);
          var label = canvas.dataset.label;

          max = WT.App.convertToImperialIfNeeded(label, max);
          value = WT.App.convertToImperialIfNeeded(label, value);
          ratio = WT.App.convertToImperialIfNeeded(label, ratio);

          currentCardControl = new WT.View.DialEntry(canvas.getAttribute('id'));
          currentCardControl.show();
          currentCardControl.setup({
            max: max,
            value: value,
            label: WT.App.getFullLabel(label),
            color: WT.Colors[canvas.dataset.color],
            eventName: canvas.dataset.eventComplete,
            trackColor: (canvas.dataset.trackColor === "true"),
            decimalPlaces: WT.App.getDecimalPlaces(label),
            ratio: ratio
          });

          break;

        default: break;
      }
    }
  }

  function destructCard() {

    if (currentCardControl &&
      typeof currentCardControl.hideAndDispatch === "function") {
      currentCardControl.hideAndDispatch();
    }

    currentCardControl = null;
  }

  this.show = function() {
    currentCard = 0;

    for (var c = 0; c < cards.length; c++) {
      if (c > 0) {
        cards[c].classList.add('next');
      } else {
        cards[c].classList.add('current');
      }
    }

    element.classList.add('active');
    addEventListeners ();
    constructCard();
  };

  this.hide = function() {
    element.classList.remove('active');
    removeEventListeners ();
  };

  this.getCardCount = function() {
    return cards.length;
  };

};

WT.View.Intro.prototype = new WT.View.Base();
