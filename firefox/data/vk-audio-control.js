self.port.on('player', function(code) {
  var p = unsafeWindow.audioPlayer;
  if (code == 0) code = p.player.paused() ? 1 : 2;
  switch (code) {
    case 1: p.playTrack();  break;
    case 2: p.pauseTrack(); break;
    case 3: p.prevTrack();  break;
    case 4: p.nextTrack();  break;
  }
});