'use strict';

const angular = require('angular');

angular.module('saltMachineApp')
.service('playerService', [ '$window', 'mapService', function($window, mapService){
  let saveState = () => {
    try {
      $window.localStorage.player = JSON.stringify(player);
    } catch(e) {
      return {};
    }
  };

  let getState = () => {
    try {
      let result = JSON.parse($window.localStorage.player);
      console.log('result', result);
      return result;
    } catch(e) {
      return {};
    }
  };

  let player = getState();
  console.log('player', player);
  if(!player.name)
    player.name = 'slug';
  if(!player.location)
    player.location = mapService.SALTROOM_A;
  if(!player.history)
    player.history = [];

  player.pushHistory = (location) => {
    if(location){
      player.history.unshift({
        location: location,
        desc: `${player.name} is now in ${location.desc}`,
        id: Math.random(),
      });
    } else {
      player.history.unshift({
        location: player.location,
        desc: `${player.name} hit a wall`,
        id: Math.random(),
      });
    }
    console.log('history', player.history);
    saveState();
  };

  player.move = (direction) => {
    console.log('dir', direction);
    let nextLocation = player.location[direction];
    console.log('nextLoc', nextLocation);
    if(nextLocation){
      player.location = mapService[nextLocation];
      player.pushHistory(player.location);
      saveState();
      return;
    }
    player.pushHistory(null);
    saveState();
  };

  player.undo = () => {
    player.history.shift();
    let top = player.history[0];
    if (top)
      player.location = top.location;
    saveState();
  };

  player.removeMove = (id) => {
    player.history = player.history.filter(move => {
      return move.id != id;
    });
    saveState();
  };

  return player;
}]);
