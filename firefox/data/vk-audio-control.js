self.port.on('player', function (command) {
    var p = unsafeWindow.audioPlayer;
    var response = p.player.paused() ? 'paused' : 'playing';
    if (command == 'toggle') command = p.player.paused() ? 'play' : 'pause';
    switch (command) {
        case 'play':
            p.playTrack();
            break;
        case 'pause':
            p.pauseTrack();
            break;
        case 'prev':
            p.prevTrack();
            break;
        case 'next':
            p.nextTrack();
            break;
    }
    self.port.emit('response', response)
});