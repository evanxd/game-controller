/* global config */
/* global input */

(function(window, document) {
  'use strict';
  var DEFAULT_PLATFORM = 'nes';
  var DETECTION_DISTANCE = 625;
  var gamepadDocument = document._currentScript.ownerDocument;

  function GameController() {
    this.config = null;
    this.input = null;
    this.canvas = null;
  }
  GameController.input = input;
  GameController.prototype = Object.create(HTMLElement.prototype);

  GameController.prototype.createdCallback = function() {
    this.config = config[DEFAULT_PLATFORM];
    this.input = input;
    var gamepad = this.createShadowRoot();
    var gamepadTemplate = gamepadDocument.querySelector('#gameController').content;
    gamepad.appendChild(document.importNode(gamepadTemplate, true));
    this.canvas = gamepad.querySelector('canvas');
    this._registerEvents();
    this._draw();
  };

  GameController.prototype.handleEvent = function(evt) {
    var handler = '_handle_' + evt.type;
    this[handler] && this[handler](evt);
  };

  GameController.prototype._handle_mousedown = function(evt) {
    this._sendButtonTouchEvent(evt.clientX, evt.clientY, true);
  };

  GameController.prototype._handle_mouseup = function(evt) {
    this._sendButtonTouchEvent(evt.clientX, evt.clientY, false);
  };

  GameController.prototype._handle_touchstart = function(evt) {
    var x = evt.changedTouches[0].clientX;
    var y = evt.changedTouches[0].clientY;
    this._sendButtonTouchEvent(x, y, true);
  };

  GameController.prototype._handle_touchend = function(evt) {
    var x = evt.changedTouches[0].clientX;
    var y = evt.changedTouches[0].clientY;
    this._sendButtonTouchEvent(x, y, false);
  };

  GameController.prototype._sendButtonTouchEvent = function(x, y, touched) {
    var button = this._getTouchedButton(x, y);
    if (button) {
      var event = new CustomEvent('buttontouch', { detail: {
        button: button,
        action: touched ? 1 : 0,
      }});
      this.dispatchEvent(event);
    }
  };

  GameController.prototype._getTouchedButton = function(x, y) {
    var buttonName;
    this.config.buttons.forEach(function(button) {
      if (Math.pow(button.x - x, 2) +
          Math.pow(button.y - y, 2) < DETECTION_DISTANCE) {
        buttonName = button.name;
      }
    });
    return buttonName;
  };

  GameController.prototype._registerEvents = function() {
    if ('ontouchstart' in window) {
      this.canvas.addEventListener('touchstart', this);
      this.canvas.addEventListener('touchend', this);      
    } else {
      this.canvas.addEventListener('mousedown', this);
      this.canvas.addEventListener('mouseup', this);
    }
  };

  GameController.prototype._draw = function() {
    var canvas = this.canvas;
    var context = canvas.getContext('2d');
    if (this.config.image) {
      var image = new Image();
      image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
      }.bind(this);
      image.src = this.config.image;
    }
  };

  document.registerElement('game-controller', {
    prototype: GameController.prototype
  });
  window.GameController = GameController;
}(window, document));
