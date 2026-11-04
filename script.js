(function(){
    var script = {
 "start": "this.playAudioList([this.audio_B0C33D48_A589_9FA8_41D0_2CC7ED56ECB0]); this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12], 'gyroscopeAvailable'); if(!this.get('fullscreenAvailable')) { [this.Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4,this.Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2].forEach(function(component) { component.set('visible', false); }) }",
 "buttonToggleMute": "this.Button_E034B9BB_C1CB_F8AA_41DB_03DA5E4EDD7C",
 "scripts": {
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "existsKey": function(key){  return key in window; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "registerKey": function(key, value){  window[key] = value; },
  "getKey": function(key){  return window[key]; },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "unregisterKey": function(key){  delete window[key]; },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } }
 },
 "paddingBottom": 0,
 "children": [
  "this.MainViewer",
  "this.Container_E034C9BB_C1CB_F8AA_41DD_388A86F3EE00",
  "this.Container_E5FE5EE1_C1DA_F8D6_41D0_8876CEFE01DA",
  "this.Image_E4D0FE03_C1DB_5B5A_4180_91F6DB46D02D"
 ],
 "id": "rootPlayer",
 "width": "100%",
 "defaultVRPointer": "laser",
 "contentOpaque": false,
 "definitions": [{
 "initialPosition": {
  "yaw": -78.41,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_BD4BF6A2_A5F9_AA99_41C3_0B2A91C9BBAD",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": -158.64,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B27D761E_A5F9_ADA8_41E1_F0B4734204C4",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 7.72,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B20EB624_A5F9_AD98_41DD_6EA856484909",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_camera",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": -7.21,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B2FC15E8_A5F9_AE69_41CC_15A78476EDF0",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_camera",
 "class": "PanoramaCamera"
},
{
 "audio": {
  "mp3Url": "media/audio_B0C33D48_A589_9FA8_41D0_2CC7ED56ECB0.mp3",
  "oggUrl": "media/audio_B0C33D48_A589_9FA8_41D0_2CC7ED56ECB0.ogg",
  "class": "AudioResource"
 },
 "autoplay": true,
 "id": "audio_B0C33D48_A589_9FA8_41D0_2CC7ED56ECB0",
 "data": {
  "label": "Migibima Moltual - Hailu Mergia \u0438 Dahlak Band"
 },
 "class": "MediaAudio"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_camera",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": -93.35,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B2A765FA_A5F9_AE68_41AE_EA4CE9271BC0",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_camera",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 130.85,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B2302637_A5F9_ADF8_41E2_B9B3D3A69106",
 "class": "PanoramaCamera"
},
{
 "label": "AI _ 004",
 "id": "panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "yaw": 1.39,
   "backwardYaw": -172.28,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30"
  },
  {
   "yaw": -63.56,
   "backwardYaw": 118.61,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707"
  },
  {
   "yaw": -109.76,
   "backwardYaw": 53.14,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57"
  },
  {
   "yaw": 135.97,
   "backwardYaw": -49.15,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEF49C7_A587_6698_41DB_8CEC85578844"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_AA566C92_A58A_9EB8_41C7_2F2ABD2B5A05",
  "this.overlay_B5E3D282_A589_EA98_41A5_B5699A4F775A",
  "this.overlay_B53CF585_A589_6E98_41D5_D92DF1222A70",
  "this.overlay_B4FAB270_A586_EA78_41A9_199D13EC79FE",
  "this.overlay_B05E75BA_A5BF_6EE8_41C8_1DEAF03ED857"
 ],
 "thumbnailUrl": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_t.jpg",
 "hfovMax": 130,
 "pitch": 0,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/f/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/f/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/u/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/u/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/r/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/r/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/b/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/b/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/d/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/d/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/l/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0/l/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": -80.32,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B2E545DC_A5F9_AEA8_41A2_B3BB568D99F1",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_camera",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 107.06,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B26DE619_A5F9_ADA8_41D4_2D7E1317A662",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": -173.69,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B2B6E600_A5F9_AD98_41C5_E9E0C40D61E8",
 "class": "PanoramaCamera"
},
{
 "items": [
  {
   "media": "this.panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_AFEF49C7_A587_6698_41DB_8CEC85578844",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_camera",
   "class": "PanoramaPlayListItem"
  },
  {
   "media": "this.panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D",
   "end": "this.trigger('tourEnded')",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_camera",
   "class": "PanoramaPlayListItem"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "initialPosition": {
  "yaw": -81.19,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B2B83606_A5F9_AD99_41C0_9D035D37D472",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 116.44,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_BDC2263D_A5F9_ADE8_41BC_77838321332E",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_camera",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_camera",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_camera",
 "class": "PanoramaCamera"
},
{
 "label": "AI _ 002",
 "id": "panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "yaw": 53.14,
   "backwardYaw": -109.76,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09"
  },
  {
   "yaw": 128.85,
   "backwardYaw": -63.56,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9"
  },
  {
   "yaw": 101.59,
   "backwardYaw": -95.54,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEF49C7_A587_6698_41DB_8CEC85578844"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_ABDF13FA_A589_EA68_41D3_2810FEB07162",
  "this.overlay_B591CCEB_A589_9E68_41DC_F16742818F60",
  "this.overlay_AA08672F_A58E_ABE8_41E4_A2D0B98830E5"
 ],
 "thumbnailUrl": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_t.jpg",
 "hfovMax": 130,
 "pitch": 0,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/f/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/f/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/u/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/u/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/r/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/r/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/b/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/b/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/d/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/d/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/l/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0/l/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "class": "Panorama"
},
{
 "label": "AI _ 001",
 "id": "panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "yaw": -63.56,
   "backwardYaw": 128.85,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57"
  },
  {
   "yaw": 60.95,
   "backwardYaw": -124.84,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEF49C7_A587_6698_41DB_8CEC85578844"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_A958A8F3_A58A_A67F_41C5_A0B38669051A",
  "this.overlay_ABFD6820_A58A_A598_41CC_59E9D1676A44"
 ],
 "thumbnailUrl": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_t.jpg",
 "hfovMax": 130,
 "pitch": 0,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/f/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/f/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/u/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/u/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/r/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/r/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/b/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/b/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/d/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/d/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/l/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0/l/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": 116.44,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_BD873665_A5F9_AD98_41E1_512C32A8A5DD",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": -68.51,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B2E9D5E2_A5F9_AE98_4170_641E20B2FFE6",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": -51.15,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B24B860C_A5F9_ADA8_41DB_F0ADEB15D8FA",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 162.46,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B29505F4_A5F9_AE79_41DC_771E5D9531E3",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 55.16,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B25D9612_A5F9_ADB8_41C5_53072E440F1E",
 "class": "PanoramaCamera"
},
{
 "buttonToggleHotspots": "this.Button_E034A9BB_C1CB_F8AA_41D3_9D18C6A23D09",
 "mouseControlMode": "drag_acceleration",
 "buttonToggleGyroscope": "this.Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12",
 "displayPlaybackBar": true,
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "viewerArea": "this.MainViewer",
 "class": "PanoramaPlayer",
 "gyroscopeEnabled": true
},
{
 "initialPosition": {
  "yaw": 70.24,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_BDF7C64E_A5F9_ADA8_41C3_210CCC0B1349",
 "class": "PanoramaCamera"
},
{
 "label": "AI _ 009",
 "id": "panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "yaw": -85.1,
   "backwardYaw": 98.81,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_B6EAC838_A5B9_65E8_41BD_1463BC862F5A"
 ],
 "thumbnailUrl": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_t.jpg",
 "hfovMax": 130,
 "pitch": 0,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/f/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/f/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/u/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/u/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/r/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/r/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/b/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/b/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/d/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/d/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/l/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0/l/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": 92.65,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B2DF75D6_A5F9_AEB8_41D5_3C780CE7ECEE",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 94.9,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B280C5EE_A5F9_AE69_41E4_A7E4350884E6",
 "class": "PanoramaCamera"
},
{
 "label": "AI _ 003",
 "id": "panorama_AFEF49C7_A587_6698_41DB_8CEC85578844",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "yaw": -49.15,
   "backwardYaw": 135.97,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09"
  },
  {
   "yaw": 6.31,
   "backwardYaw": 176.26,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30"
  },
  {
   "yaw": -124.84,
   "backwardYaw": 60.95,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9"
  },
  {
   "yaw": -95.54,
   "backwardYaw": 101.59,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_AA49B905_A58E_A798_41E3_7F33AA8CAB50",
  "this.overlay_AA0104AD_A58F_AEE8_418E_B1299604B9F5",
  "this.overlay_AA751E8D_A58F_9AAB_41D6_70C31DE5221E",
  "this.overlay_B2A1189E_A5FE_A6A8_41E4_8459377D6F27"
 ],
 "thumbnailUrl": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_t.jpg",
 "hfovMax": 130,
 "pitch": 0,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/f/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/f/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/u/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/u/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/r/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/r/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/b/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/b/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/d/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/d/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/l/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0/l/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "class": "Panorama"
},
{
 "label": "AI _ 005",
 "id": "panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "yaw": 118.61,
   "backwardYaw": -63.56,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09"
  },
  {
   "yaw": 99.68,
   "backwardYaw": -94.82,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B"
  },
  {
   "yaw": 21.36,
   "backwardYaw": -151.26,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_B5254948_A587_A7A8_41B8_ED90C2B39828",
  "this.overlay_B7C26DF5_A599_9E78_41D8_63EBA4F4F0E5",
  "this.overlay_B4F63494_A58B_AEB8_41E1_6C5363271584",
  "this.overlay_B6A79914_A58A_A7B8_41B3_77895F64EFCA"
 ],
 "thumbnailUrl": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_t.jpg",
 "hfovMax": 130,
 "pitch": 0,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/f/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/f/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/u/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/u/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/r/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/r/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/b/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/b/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/d/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/d/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/l/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0/l/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_camera",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": -44.03,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_BD99167B_A5F9_AA68_41E0_E48F7D2BE6D7",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 85.18,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_BDD59643_A5F9_AD98_41DC_88E69CE4B389",
 "class": "PanoramaCamera"
},
{
 "label": "AI _ 007",
 "id": "panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "yaw": 111.49,
   "backwardYaw": -72.94,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482"
  },
  {
   "yaw": -151.26,
   "backwardYaw": 21.36,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_B7B8097B_A58B_A668_41DB_A1739941F725",
  "this.overlay_B6955F4B_A58B_BBAF_41B4_33464CC91A03",
  "this.overlay_B7229742_A586_AB98_41E0_22E108F724A9"
 ],
 "thumbnailUrl": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_t.jpg",
 "hfovMax": 130,
 "pitch": 0,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/f/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/f/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/u/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/u/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/r/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/r/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/b/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/b/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/d/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/d/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/l/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0/l/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": -3.74,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_BDABC686_A5F9_AA98_41D8_D838D04A36AE",
 "class": "PanoramaCamera"
},
{
 "label": "AI _ 006",
 "id": "panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "yaw": -172.28,
   "backwardYaw": 1.39,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09"
  },
  {
   "yaw": 86.65,
   "backwardYaw": -87.35,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30"
  },
  {
   "yaw": -94.82,
   "backwardYaw": 99.68,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707"
  },
  {
   "yaw": -72.94,
   "backwardYaw": 111.49,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD"
  },
  {
   "yaw": -17.54,
   "backwardYaw": 172.79,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_B4853EBD_A59A_BAE8_41CB_388A448BC6EC",
  "this.overlay_B4078774_A59B_AA78_41D5_818617C7191A",
  "this.overlay_B790A64B_A58B_ADA8_41B6_D2AB1F85F0A1",
  "this.overlay_B7D2AFD8_A589_BAA8_41C4_B5EDB7DBA2BD",
  "this.overlay_B6FB2126_A586_A798_41D3_BB787F37C17E"
 ],
 "thumbnailUrl": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_t.jpg",
 "hfovMax": 130,
 "pitch": 0,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/f/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/f/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/u/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/u/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/r/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/r/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/b/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/b/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/d/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/d/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/l/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0/l/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": 84.46,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_BD89366F_A5F9_AA68_41BF_33BBDE03ADAE",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": -178.61,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B2C925D0_A5F9_AEB8_41DE_766D874512CE",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": -119.05,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_BDBBD697_A5F9_AAB8_41E2_E05B66E35134",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": -61.39,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B21EF62A_A5F9_ADE8_41C0_3641EE7A5B6D",
 "class": "PanoramaCamera"
},
{
 "label": "AI _ 008",
 "id": "panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "yaw": -87.35,
   "backwardYaw": 86.65,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD"
  },
  {
   "yaw": 176.26,
   "backwardYaw": 6.31,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEF49C7_A587_6698_41DB_8CEC85578844"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_B6F6EBD1_A587_9AB8_41D8_C81EDC88FD61",
  "this.overlay_B6F4F5C3_A587_AE98_41CA_2EF37FCCDBED",
  "this.overlay_B631EDD8_A5B9_9EA8_41D1_24AF3E416B2F",
  "this.overlay_B35759F0_A5F9_6678_41D2_30B3EF55D067"
 ],
 "thumbnailUrl": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_t.jpg",
 "hfovMax": 130,
 "pitch": 0,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/f/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/f/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/u/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/u/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/r/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/r/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/b/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/b/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/d/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/d/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/l/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0/l/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "class": "Panorama"
},
{
 "label": "AI _ 010",
 "id": "panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "yaw": 98.81,
   "backwardYaw": -85.1,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482"
  },
  {
   "yaw": 172.79,
   "backwardYaw": -17.54,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_B6DEC976_A5BA_A678_41CC_BDA844E8C037",
  "this.overlay_B114B5DF_A5BB_6EA8_41D0_22EA120C884A"
 ],
 "thumbnailUrl": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_t.jpg",
 "hfovMax": 130,
 "pitch": 0,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/f/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/f/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/u/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/u/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/r/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/r/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_t.jpg",
   "back": {
    "levels": [
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/b/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/b/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/d/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/d/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/l/0/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "height": 1024,
      "class": "TiledImageResourceLevel"
     },
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0/l/1/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "height": 512,
      "class": "TiledImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "class": "Panorama"
},
{
 "initialPosition": {
  "yaw": -126.86,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_B220D630_A5F9_ADF8_41E0_0F8A60F60963",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_camera",
 "class": "PanoramaCamera"
},
{
 "initialPosition": {
  "yaw": 28.74,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_BDE50648_A5F9_ADA9_41DD_50F64D2698A5",
 "class": "PanoramaCamera"
},
{
 "textDecoration": "none",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "id": "Button_E034B9BB_C1CB_F8AA_41DB_03DA5E4EDD7C",
 "width": 60,
 "backgroundColorRatios": [
  0
 ],
 "fontFamily": "Arial",
 "iconHeight": 30,
 "shadowColor": "#000000",
 "verticalAlign": "middle",
 "shadowSpread": 1,
 "layout": "horizontal",
 "iconURL": "skin/Button_E034B9BB_C1CB_F8AA_41DB_03DA5E4EDD7C.png",
 "iconBeforeLabel": true,
 "pressedIconHeight": 30,
 "minHeight": 1,
 "paddingLeft": 0,
 "borderRadius": 0,
 "height": 60,
 "class": "Button",
 "borderColor": "#000000",
 "shadow": false,
 "borderSize": 0,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "minWidth": 1,
 "backgroundColor": [
  "#F7931E"
 ],
 "fontSize": 12,
 "mode": "toggle",
 "pressedIconWidth": 30,
 "fontStyle": "normal",
 "rollOverBackgroundOpacity": 1,
 "propagateClick": false,
 "data": {
  "name": "Button Settings Mute"
 },
 "backgroundOpacity": 1,
 "pressedIconURL": "skin/Button_E034B9BB_C1CB_F8AA_41DB_03DA5E4EDD7C_pressed.png",
 "shadowBlurRadius": 6,
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "normal",
 "gap": 5,
 "iconWidth": 30,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "cursor": "hand"
},
{
 "toolTipShadowVerticalLength": 0,
 "paddingBottom": 0,
 "transitionDuration": 500,
 "id": "MainViewer",
 "toolTipBackgroundColor": "#F6F6F6",
 "playbackBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "playbackBarHeadBorderRadius": 0,
 "width": "100%",
 "playbackBarHeadBorderColor": "#000000",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadBorderSize": 0,
 "progressRight": 0,
 "progressOpacity": 1,
 "vrPointerSelectionColor": "#FF6600",
 "paddingLeft": 0,
 "transitionMode": "blending",
 "progressBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "class": "ViewerArea",
 "progressBackgroundColorDirection": "vertical",
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "borderSize": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "height": "100%",
 "firstTransitionDuration": 0,
 "vrPointerSelectionTime": 2000,
 "toolTipShadowOpacity": 1,
 "playbackBarHeadShadow": true,
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBottom": 0,
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipBorderRadius": 3,
 "playbackBarBottom": 5,
 "playbackBarOpacity": 1,
 "progressHeight": 10,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "progressBorderColor": "#000000",
 "paddingRight": 0,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "progressBarOpacity": 1,
 "playbackBarHeadHeight": 15,
 "toolTipDisplayTime": 600,
 "toolTipBorderColor": "#767676",
 "toolTipPaddingTop": 4,
 "toolTipShadowBlurRadius": 3,
 "vrPointerColor": "#FFFFFF",
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowSpread": 0,
 "progressBorderSize": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipPaddingLeft": 6,
 "progressLeft": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarProgressOpacity": 1,
 "toolTipPaddingBottom": 4,
 "playbackBarBorderSize": 0,
 "progressBorderRadius": 0,
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeight": 10,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadWidth": 6,
 "minHeight": 50,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipFontColor": "#606060",
 "borderRadius": 0,
 "progressBarBorderColor": "#000000",
 "playbackBarBorderColor": "#FFFFFF",
 "shadow": false,
 "playbackBarProgressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "paddingTop": 0,
 "minWidth": 100,
 "toolTipShadowHorizontalLength": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderSize": 1,
 "progressBarBorderSize": 0,
 "playbackBarRight": 0,
 "playbackBarHeadOpacity": 1,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontFamily": "Arial",
 "propagateClick": false,
 "toolTipOpacity": 1,
 "toolTipFontSize": "1.11vmin",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "data": {
  "name": "Main Viewer"
 },
 "progressBarBorderRadius": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadShadowColor": "#000000",
 "toolTipPaddingRight": 6
},
{
 "paddingBottom": 0,
 "children": [
  "this.Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4",
  "this.Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12",
  "this.Button_E034B9BB_C1CB_F8AA_41DB_03DA5E4EDD7C",
  "this.Button_E034A9BB_C1CB_F8AA_41D3_9D18C6A23D09",
  "this.Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2"
 ],
 "id": "Container_E034C9BB_C1CB_F8AA_41DD_388A86F3EE00",
 "width": 60,
 "backgroundColorRatios": [
  0.02
 ],
 "right": 23,
 "contentOpaque": false,
 "verticalAlign": "middle",
 "layout": "vertical",
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "1.47%",
 "scrollBarMargin": 2,
 "borderRadius": 0,
 "height": 300,
 "class": "Container",
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "shadow": false,
 "borderSize": 0,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "minWidth": 1,
 "backgroundColor": [
  "#F7931E"
 ],
 "scrollBarVisible": "rollOver",
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "-button set"
 },
 "backgroundOpacity": 1,
 "scrollBarColor": "#000000",
 "horizontalAlign": "center",
 "paddingRight": 0,
 "gap": 0
},
{
 "paddingBottom": 0,
 "children": [
  "this.Image_E4797710_C1DF_4976_41CE_95115C48A1EF",
  "this.Image_E21AB22D_C1C5_4BAE_41AF_E5A5DA39C0BB"
 ],
 "id": "Container_E5FE5EE1_C1DA_F8D6_41D0_8876CEFE01DA",
 "left": "1.26%",
 "width": "2.872%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "contentOpaque": false,
 "verticalAlign": "top",
 "layout": "absolute",
 "minHeight": 1,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "bottom": "8.06%",
 "scrollBarWidth": 10,
 "borderRadius": 0,
 "shadow": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "class": "Container",
 "borderSize": 0,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "minWidth": 1,
 "height": "16.678%",
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "propagateClick": false,
 "data": {
  "name": "Container42159"
 },
 "backgroundOpacity": 0.3,
 "scrollBarColor": "#000000",
 "horizontalAlign": "left",
 "visible": false,
 "paddingRight": 0,
 "gap": 10
},
{
 "paddingBottom": 0,
 "maxWidth": 512,
 "id": "Image_E4D0FE03_C1DB_5B5A_4180_91F6DB46D02D",
 "left": "1.56%",
 "maxHeight": 512,
 "verticalAlign": "middle",
 "width": "2.306%",
 "url": "skin/Image_E4D0FE03_C1DB_5B5A_4180_91F6DB46D02D.png",
 "minHeight": 1,
 "paddingLeft": 0,
 "borderRadius": 0,
 "bottom": "2.17%",
 "shadow": false,
 "height": "5.046%",
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "click": "this.setComponentVisibility(this.Container_E5FE5EE1_C1DA_F8D6_41D0_8876CEFE01DA, true, 0, null, null, false)",
 "propagateClick": false,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image43230"
 },
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "paddingRight": 0
},
{
 "textDecoration": "none",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "id": "Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4",
 "width": 60,
 "backgroundColorRatios": [
  0
 ],
 "fontFamily": "Arial",
 "iconHeight": 30,
 "shadowColor": "#000000",
 "verticalAlign": "middle",
 "shadowSpread": 1,
 "layout": "horizontal",
 "iconURL": "skin/Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4.png",
 "iconBeforeLabel": true,
 "minHeight": 1,
 "paddingLeft": 0,
 "borderRadius": 0,
 "height": 60,
 "class": "Button",
 "borderColor": "#000000",
 "shadow": false,
 "borderSize": 0,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "minWidth": 1,
 "backgroundColor": [
  "#F7931E"
 ],
 "fontSize": 12,
 "mode": "toggle",
 "fontStyle": "normal",
 "rollOverBackgroundOpacity": 1,
 "propagateClick": false,
 "data": {
  "name": "Button settings VR"
 },
 "backgroundOpacity": 1,
 "pressedIconURL": "skin/Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4_pressed.png",
 "shadowBlurRadius": 6,
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "normal",
 "gap": 5,
 "iconWidth": 30,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "cursor": "hand"
},
{
 "textDecoration": "none",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "id": "Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2",
 "width": 60,
 "backgroundColorRatios": [
  0
 ],
 "fontFamily": "Arial",
 "iconHeight": 30,
 "shadowColor": "#000000",
 "verticalAlign": "middle",
 "shadowSpread": 1,
 "layout": "horizontal",
 "iconURL": "skin/Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2.png",
 "iconBeforeLabel": true,
 "pressedIconHeight": 30,
 "minHeight": 1,
 "paddingLeft": 0,
 "borderRadius": 0,
 "height": 60,
 "class": "Button",
 "borderColor": "#000000",
 "shadow": false,
 "borderSize": 0,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "minWidth": 1,
 "backgroundColor": [
  "#F7931E"
 ],
 "fontSize": 12,
 "mode": "toggle",
 "pressedIconWidth": 30,
 "fontStyle": "normal",
 "rollOverBackgroundOpacity": 1,
 "propagateClick": false,
 "data": {
  "name": "Button Settings Fullscreen"
 },
 "backgroundOpacity": 1,
 "pressedIconURL": "skin/Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2_pressed.png",
 "shadowBlurRadius": 6,
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "normal",
 "gap": 5,
 "iconWidth": 30,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "cursor": "hand"
},
{
 "maps": [
  {
   "hfov": 6.73,
   "yaw": 135.97,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0_HS_0_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.02,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B11A7C24_A59B_9D98_41E4_73A75CC7DE61",
   "yaw": 135.97,
   "pitch": -19.02,
   "hfov": 6.73,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEF49C7_A587_6698_41DB_8CEC85578844, this.camera_B2302637_A5F9_ADF8_41E2_B9B3D3A69106); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_AA566C92_A58A_9EB8_41C7_2F2ABD2B5A05",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.84,
   "yaw": -109.76,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0_HS_1_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.9,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B11A2C24_A59B_9D98_41D7_16063BC5B03B",
   "yaw": -109.76,
   "pitch": -15.9,
   "hfov": 6.84,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57, this.camera_B220D630_A5F9_ADF8_41E0_0F8A60F60963); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B5E3D282_A589_EA98_41A5_B5699A4F775A",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.82,
   "yaw": -63.56,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0_HS_2_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.59,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B11ADC24_A59B_9D98_41D4_50D8CEB82DD0",
   "yaw": -63.56,
   "pitch": -16.59,
   "hfov": 6.82,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707, this.camera_B21EF62A_A5F9_ADE8_41C0_3641EE7A5B6D); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B53CF585_A589_6E98_41D5_D92DF1222A70",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.67,
   "yaw": 64.25,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0_HS_3_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.41,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B11A8C24_A59B_9D98_41DE_E5F207963DB5",
   "yaw": 64.25,
   "pitch": -20.41,
   "hfov": 6.67,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B4FAB270_A586_EA78_41A9_199D13EC79FE",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.73,
   "yaw": 1.39,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0_HS_4_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -18.85,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B0AB581B_A58A_A5A8_41B7_E16793908C99",
   "yaw": 1.39,
   "pitch": -18.85,
   "hfov": 6.73,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B, this.camera_B20EB624_A5F9_AD98_41DD_6EA856484909); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B05E75BA_A5BF_6EE8_41C8_1DEAF03ED857",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.65,
   "yaw": 128.85,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0_HS_0_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.76,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B1184C24_A59B_9D98_41E2_42BC65F8FBB2",
   "yaw": 128.85,
   "pitch": -20.76,
   "hfov": 6.65,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9, this.camera_BD873665_A5F9_AD98_41E1_512C32A8A5DD); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_ABDF13FA_A589_EA68_41D3_2810FEB07162",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.92,
   "yaw": 101.59,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0_HS_1_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.47,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B118EC24_A59B_9D98_41D8_B56C5E55D98F",
   "yaw": 101.59,
   "pitch": -13.47,
   "hfov": 6.92,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEF49C7_A587_6698_41DB_8CEC85578844, this.camera_BD89366F_A5F9_AA68_41BF_33BBDE03ADAE); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B591CCEB_A589_9E68_41DC_F16742818F60",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.56,
   "yaw": 53.14,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0_HS_2_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.84,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B118BC24_A59B_9D98_41E1_26964D6A551C",
   "yaw": 53.14,
   "pitch": -22.84,
   "hfov": 6.56,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09, this.camera_BDF7C64E_A5F9_ADA8_41C3_210CCC0B1349); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_AA08672F_A58E_ABE8_41E4_A2D0B98830E5",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.7,
   "yaw": -63.56,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0_HS_0_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.54,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B4057A53_A58A_A5B8_41D5_BF1925D9D802",
   "yaw": -63.56,
   "pitch": -19.54,
   "hfov": 6.7,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57, this.camera_B24B860C_A5F9_ADA8_41DB_F0ADEB15D8FA); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_A958A8F3_A58A_A67F_41C5_A0B38669051A",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.64,
   "yaw": 60.95,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0_HS_1_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.93,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B119AC23_A59B_9D98_41DC_81D85388FCDB",
   "yaw": 60.95,
   "pitch": -20.93,
   "hfov": 6.64,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEF49C7_A587_6698_41DB_8CEC85578844, this.camera_B25D9612_A5F9_ADB8_41C5_53072E440F1E); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_ABFD6820_A58A_A598_41CC_59E9D1676A44",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "textDecoration": "none",
 "fontColor": "#FFFFFF",
 "paddingBottom": 0,
 "rollOverIconWidth": 30,
 "id": "Button_E034A9BB_C1CB_F8AA_41D3_9D18C6A23D09",
 "width": 60,
 "backgroundColorRatios": [
  0
 ],
 "fontFamily": "Arial",
 "iconHeight": 30,
 "shadowColor": "#000000",
 "verticalAlign": "middle",
 "rollOverIconHeight": 30,
 "shadowSpread": 1,
 "layout": "horizontal",
 "iconURL": "skin/Button_E034A9BB_C1CB_F8AA_41D3_9D18C6A23D09.png",
 "iconBeforeLabel": true,
 "pressedIconHeight": 30,
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "minHeight": 1,
 "paddingLeft": 0,
 "borderRadius": 0,
 "height": 60,
 "class": "Button",
 "borderColor": "#000000",
 "shadow": false,
 "borderSize": 0,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "minWidth": 1,
 "backgroundColor": [
  "#F7931E"
 ],
 "fontSize": 12,
 "mode": "toggle",
 "pressedIconWidth": 30,
 "fontStyle": "normal",
 "rollOverBackgroundOpacity": 1,
 "propagateClick": false,
 "data": {
  "name": "Button Settings HS"
 },
 "backgroundOpacity": 1,
 "pressedIconURL": "skin/Button_E034A9BB_C1CB_F8AA_41D3_9D18C6A23D09_pressed.png",
 "shadowBlurRadius": 6,
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "normal",
 "gap": 5,
 "iconWidth": 30,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "cursor": "hand"
},
{
 "textDecoration": "none",
 "paddingBottom": 0,
 "rollOverIconWidth": 30,
 "id": "Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12",
 "width": 60,
 "backgroundColorRatios": [
  0
 ],
 "fontColor": "#FFFFFF",
 "iconHeight": 30,
 "shadowColor": "#000000",
 "verticalAlign": "middle",
 "rollOverIconHeight": 30,
 "shadowSpread": 1,
 "layout": "horizontal",
 "iconURL": "skin/Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12.png",
 "iconBeforeLabel": true,
 "fontFamily": "Arial",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "minHeight": 1,
 "paddingLeft": 0,
 "pressedIconHeight": 30,
 "borderRadius": 0,
 "height": 60,
 "class": "Button",
 "borderColor": "#000000",
 "shadow": false,
 "borderSize": 0,
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "minWidth": 1,
 "backgroundColor": [
  "#F7931E"
 ],
 "fontSize": 12,
 "mode": "toggle",
 "pressedIconWidth": 30,
 "fontStyle": "normal",
 "rollOverBackgroundOpacity": 1,
 "propagateClick": false,
 "data": {
  "name": "Button Settings Gyro"
 },
 "backgroundOpacity": 1,
 "pressedIconURL": "skin/Button_E03489BB_C1CB_F8AA_41B6_C870465A9D12_pressed.png",
 "shadowBlurRadius": 6,
 "horizontalAlign": "center",
 "paddingRight": 0,
 "fontWeight": "normal",
 "gap": 5,
 "iconWidth": 30,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "cursor": "hand"
},
{
 "maps": [
  {
   "hfov": 6.5,
   "yaw": -85.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0_HS_0_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -24.06,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD898DBA_A5BB_BEE8_41E0_E04F73620918",
   "yaw": -85.1,
   "pitch": -24.06,
   "hfov": 6.5,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D, this.camera_B2B83606_A5F9_AD99_41C0_9D035D37D472); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B6EAC838_A5B9_65E8_41BD_1463BC862F5A",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.73,
   "yaw": -124.84,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0_HS_0_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.01,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B11B5C24_A59B_9D98_41E1_0F0BDB4D7000",
   "yaw": -124.84,
   "pitch": -19.01,
   "hfov": 6.73,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9, this.camera_BDBBD697_A5F9_AAB8_41E2_E05B66E35134); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_AA49B905_A58E_A798_41E3_7F33AA8CAB50",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.93,
   "yaw": -95.54,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0_HS_1_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.15,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B11B1C24_A59B_9D98_41E0_70F8337FF9B0",
   "yaw": -95.54,
   "pitch": -13.15,
   "hfov": 6.93,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57, this.camera_BD4BF6A2_A5F9_AA99_41C3_0B2A91C9BBAD); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_AA0104AD_A58F_AEE8_418E_B1299604B9F5",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.49,
   "yaw": -49.15,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_1_HS_2_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -24.23,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BFCBCA49_A5FB_65A8_41DF_CB26A943118A",
   "yaw": -49.15,
   "pitch": -24.23,
   "hfov": 6.49,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09, this.camera_BD99167B_A5F9_AA68_41E0_E48F7D2BE6D7); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_AA751E8D_A58F_9AAB_41D6_70C31DE5221E",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.9,
   "yaw": 6.31,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_1_HS_3_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.95,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BFCA3A49_A5FB_65A8_41DA_CCF884D2CB82",
   "yaw": 6.31,
   "pitch": -13.95,
   "hfov": 6.9,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30, this.camera_BDABC686_A5F9_AA98_41D8_D838D04A36AE); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B2A1189E_A5FE_A6A8_41E4_8459377D6F27",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.73,
   "yaw": 118.61,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0_HS_0_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.02,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B11D2C24_A59B_9D98_41CF_70CA9AE62FA4",
   "yaw": 118.61,
   "pitch": -19.02,
   "hfov": 6.73,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09, this.camera_BDC2263D_A5F9_ADE8_41BC_77838321332E); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B5254948_A587_A7A8_41B8_ED90C2B39828",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.94,
   "yaw": 99.68,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0_HS_1_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -12.77,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B11DFC24_A59B_9D98_41E1_B066B84362FD",
   "yaw": 99.68,
   "pitch": -12.77,
   "hfov": 6.94,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B, this.camera_BDD59643_A5F9_AD98_41DC_88E69CE4B389); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B7C26DF5_A599_9E78_41D8_63EBA4F4F0E5",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.67,
   "yaw": 21.36,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0_HS_2_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.24,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD859DB9_A5BB_BEE8_41C7_2F13E2F1D75E",
   "yaw": 21.36,
   "pitch": -20.24,
   "hfov": 6.67,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD, this.camera_BDE50648_A5F9_ADA9_41DD_50F64D2698A5); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B4F63494_A58B_AEB8_41E1_6C5363271584",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.75,
   "yaw": -173.14,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0_HS_3_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -18.5,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD845DB9_A5BB_BEE8_41A6_D6B130FD6FC7",
   "yaw": -173.14,
   "pitch": -18.5,
   "hfov": 6.75,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B6A79914_A58A_A7B8_41B3_77895F64EFCA",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.53,
   "yaw": -151.26,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0_HS_0_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -23.37,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD879DB9_A5BB_BEE8_41E0_B592D6D33E42",
   "yaw": -151.26,
   "pitch": -23.37,
   "hfov": 6.53,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707, this.camera_B27D761E_A5F9_ADA8_41E1_F0B4734204C4); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B7B8097B_A58B_A668_41DB_A1739941F725",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.69,
   "yaw": 111.49,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0_HS_1_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.89,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD865DB9_A5BB_BEE8_41E2_BC659FC30853",
   "yaw": 111.49,
   "pitch": -19.89,
   "hfov": 6.69,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B, this.camera_B26DE619_A5F9_ADA8_41D4_2D7E1317A662); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B6955F4B_A58B_BBAF_41B4_33464CC91A03",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.83,
   "yaw": 64.08,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0_HS_2_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.24,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD86FDBA_A5BB_BEE8_41D6_3E312E15688B",
   "yaw": 64.08,
   "pitch": -16.24,
   "hfov": 6.83,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B7229742_A586_AB98_41E0_22E108F724A9",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.72,
   "yaw": -172.28,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0_HS_0_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.2,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B11C7C24_A59B_9D98_41D2_C521426F0458",
   "yaw": -172.28,
   "pitch": -19.2,
   "hfov": 6.72,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09, this.camera_B2C925D0_A5F9_AEB8_41DE_766D874512CE); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B4853EBD_A59A_BAE8_41CB_388A448BC6EC",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.78,
   "yaw": -94.82,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0_HS_1_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -17.63,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B11C5C25_A59B_9D98_41C7_733102EB3231",
   "yaw": -94.82,
   "pitch": -17.63,
   "hfov": 6.78,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707, this.camera_B2E545DC_A5F9_AEA8_41A2_B3BB568D99F1); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B4078774_A59B_AA78_41D5_818617C7191A",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.67,
   "yaw": -72.94,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0_HS_2_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.24,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD849DB9_A5BB_BEE8_41C1_A646C7D5CB2F",
   "yaw": -72.94,
   "pitch": -20.24,
   "hfov": 6.67,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD, this.camera_B2E9D5E2_A5F9_AE98_4170_641E20B2FFE6); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B790A64B_A58B_ADA8_41B6_D2AB1F85F0A1",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.56,
   "yaw": 86.65,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0_HS_3_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.67,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD873DB9_A5BB_BEE8_41CE_439C5E0704CC",
   "yaw": 86.65,
   "pitch": -22.67,
   "hfov": 6.56,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30, this.camera_B2DF75D6_A5F9_AEB8_41D5_3C780CE7ECEE); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B7D2AFD8_A589_BAA8_41C4_B5EDB7DBA2BD",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.69,
   "yaw": -17.54,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0_HS_4_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.89,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD87EDB9_A5BB_BEE8_41DE_854ACD3886C3",
   "yaw": -17.54,
   "pitch": -19.89,
   "hfov": 6.69,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D, this.camera_B2FC15E8_A5F9_AE69_41CC_15A78476EDF0); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B6FB2126_A586_A798_41D3_BB787F37C17E",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.52,
   "yaw": -87.35,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0_HS_0_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -23.54,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD869DBA_A5BB_BEE8_41B3_2CF5789CBB9A",
   "yaw": -87.35,
   "pitch": -23.54,
   "hfov": 6.52,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B, this.camera_B2A765FA_A5F9_AE68_41AE_EA4CE9271BC0); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B6F6EBD1_A587_9AB8_41D8_C81EDC88FD61",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.9,
   "yaw": -84.92,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0_HS_1_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.99,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD892DBA_A5BB_BEE8_41E1_C75EC4B68B12",
   "yaw": -84.92,
   "pitch": -13.99,
   "hfov": 6.9,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B6F4F5C3_A587_AE98_41CA_2EF37FCCDBED",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.77,
   "yaw": -1.03,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0_HS_2_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -17.78,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD89EDBA_A5BB_BEE8_41E2_25BE4CD9C5DB",
   "yaw": -1.03,
   "pitch": -17.78,
   "hfov": 6.77,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B631EDD8_A5B9_9EA8_41D1_24AF3E416B2F",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.83,
   "yaw": 176.26,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0_HS_3_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.11,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_B33EB5C5_A5F9_AE98_41D2_3559D550331A",
   "yaw": 176.26,
   "pitch": -16.11,
   "hfov": 6.83,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEF49C7_A587_6698_41DB_8CEC85578844, this.camera_B2B6E600_A5F9_AD98_41C5_E9E0C40D61E8); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B35759F0_A5F9_6678_41D2_30B3EF55D067",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.47,
   "yaw": 98.81,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0_HS_0_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -24.58,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD882DBA_A5BB_BEE8_41D6_84430E4887C6",
   "yaw": 98.81,
   "pitch": -24.58,
   "hfov": 6.47,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482, this.camera_B280C5EE_A5F9_AE69_41E4_A7E4350884E6); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B6DEC976_A5BA_A678_41CC_BDA844E8C037",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "maps": [
  {
   "hfov": 6.7,
   "yaw": 172.79,
   "image": {
    "levels": [
     {
      "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0_HS_1_0_0_map.gif",
      "width": 49,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.54,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "image": "this.AnimatedImageResource_BD88CDBA_A5BB_BEE8_41E1_4D7D19C50404",
   "yaw": 172.79,
   "pitch": -19.54,
   "hfov": 6.7,
   "distance": 100
  }
 ],
 "enabledInCardboard": true,
 "useHandCursor": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B, this.camera_B29505F4_A5F9_AE79_41DC_771E5D9531E3); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B114B5DF_A5BB_6EA8_41D0_22EA120C884A",
 "data": {
  "label": "Circle Point 03c"
 },
 "class": "HotspotPanoramaOverlay"
},
{
 "paddingBottom": 0,
 "maxWidth": 512,
 "id": "Image_E4797710_C1DF_4976_41CE_95115C48A1EF",
 "maxHeight": 512,
 "verticalAlign": "middle",
 "right": "9.02%",
 "width": "78.788%",
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "4.6%",
 "borderRadius": 0,
 "shadow": false,
 "height": "20.504%",
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "click": "this.openLink('https://maps.app.goo.gl/oF6Kckj1YEuw1p5J6', '_blank')",
 "propagateClick": false,
 "url": "skin/Image_E4797710_C1DF_4976_41CE_95115C48A1EF.png",
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image43050"
 },
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "paddingRight": 0,
 "cursor": "hand"
},
{
 "paddingBottom": 0,
 "maxWidth": 512,
 "id": "Image_E21AB22D_C1C5_4BAE_41AF_E5A5DA39C0BB",
 "left": "0%",
 "maxHeight": 512,
 "verticalAlign": "middle",
 "width": "100%",
 "minHeight": 1,
 "paddingLeft": 0,
 "top": "32.73%",
 "borderRadius": 0,
 "shadow": false,
 "height": "19.065%",
 "class": "Image",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 1,
 "click": "this.openLink('https://mella-cs.com/', '_blank')",
 "propagateClick": false,
 "url": "skin/Image_E21AB22D_C1C5_4BAE_41AF_E5A5DA39C0BB.png",
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image43276"
 },
 "backgroundOpacity": 0,
 "horizontalAlign": "center",
 "paddingRight": 0,
 "cursor": "hand"
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0_HS_0_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B11A7C24_A59B_9D98_41E4_73A75CC7DE61",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0_HS_1_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B11A2C24_A59B_9D98_41D7_16063BC5B03B",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0_HS_2_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B11ADC24_A59B_9D98_41D4_50D8CEB82DD0",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0_HS_3_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B11A8C24_A59B_9D98_41DE_E5F207963DB5",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEF0E10_A586_9DB8_4197_96F927A61E09_0_HS_4_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B0AB581B_A58A_A5A8_41B7_E16793908C99",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0_HS_0_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B1184C24_A59B_9D98_41E2_42BC65F8FBB2",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0_HS_1_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B118EC24_A59B_9D98_41D8_B56C5E55D98F",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFE4C53D_A587_6FEB_418F_175ABFDD0A57_0_HS_2_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B118BC24_A59B_9D98_41E1_26964D6A551C",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0_HS_0_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B4057A53_A58A_A5B8_41D5_BF1925D9D802",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AF767BED_A587_7A6B_41C6_8E8251107BE9_0_HS_1_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B119AC23_A59B_9D98_41DC_81D85388FCDB",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEF94C8_A586_AEA8_41B3_2ACB9E4C9482_0_HS_0_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD898DBA_A5BB_BEE8_41E0_E04F73620918",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0_HS_0_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B11B5C24_A59B_9D98_41E1_0F0BDB4D7000",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_0_HS_1_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B11B1C24_A59B_9D98_41E0_70F8337FF9B0",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_1_HS_2_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BFCBCA49_A5FB_65A8_41DF_CB26A943118A",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEF49C7_A587_6698_41DB_8CEC85578844_1_HS_3_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BFCA3A49_A5FB_65A8_41DA_CCF884D2CB82",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0_HS_0_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B11D2C24_A59B_9D98_41CF_70CA9AE62FA4",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0_HS_1_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B11DFC24_A59B_9D98_41E1_B066B84362FD",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0_HS_2_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD859DB9_A5BB_BEE8_41C7_2F13E2F1D75E",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFE0025B_A586_A5A8_41D7_4CD2BACDB707_0_HS_3_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD845DB9_A5BB_BEE8_41A6_D6B130FD6FC7",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0_HS_0_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD879DB9_A5BB_BEE8_41E0_B592D6D33E42",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0_HS_1_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD865DB9_A5BB_BEE8_41E2_BC659FC30853",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFE04C1F_A586_BDA8_41C5_84B12F51E7DD_0_HS_2_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD86FDBA_A5BB_BEE8_41D6_3E312E15688B",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0_HS_0_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B11C7C24_A59B_9D98_41D2_C521426F0458",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0_HS_1_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B11C5C25_A59B_9D98_41C7_733102EB3231",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0_HS_2_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD849DB9_A5BB_BEE8_41C1_A646C7D5CB2F",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0_HS_3_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD873DB9_A5BB_BEE8_41CE_439C5E0704CC",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEEA6D8_A586_AAA8_41B0_5FB63E344E4B_0_HS_4_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD87EDB9_A5BB_BEE8_41DE_854ACD3886C3",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0_HS_0_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD869DBA_A5BB_BEE8_41B3_2CF5789CBB9A",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0_HS_1_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD892DBA_A5BB_BEE8_41E1_C75EC4B68B12",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0_HS_2_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD89EDBA_A5BB_BEE8_41E2_25BE4CD9C5DB",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEEF08F_A586_A6A8_41B3_7050E5A4BE30_0_HS_3_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_B33EB5C5_A5F9_AE98_41D2_3559D550331A",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0_HS_0_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD882DBA_A5BB_BEE8_41D6_84430E4887C6",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
},
{
 "colCount": 4,
 "rowCount": 6,
 "levels": [
  {
   "url": "media/panorama_AFEDB926_A586_A798_41C2_D0A60111FA6D_0_HS_1_0.png",
   "width": 800,
   "height": 390,
   "class": "ImageResourceLevel"
  }
 ],
 "id": "AnimatedImageResource_BD88CDBA_A5BB_BEE8_41E1_4D7D19C50404",
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41
}],
 "verticalAlign": "top",
 "desktopMipmappingEnabled": false,
 "layout": "absolute",
 "vrPolyfillScale": 1,
 "mobileMipmappingEnabled": false,
 "minHeight": 20,
 "paddingLeft": 0,
 "scrollBarMargin": 2,
 "borderRadius": 0,
 "scrollBarWidth": 10,
 "scrollBarOpacity": 0.5,
 "shadow": false,
 "class": "Player",
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 20,
 "height": "100%",
 "scrollBarVisible": "rollOver",
 "buttonToggleFullscreen": [
  "this.Button_E03499BB_C1CB_F8AA_41D3_4FE9257021E4",
  "this.Button_E034D9BB_C1CB_F8AA_41E2_B095A959D2D2"
 ],
 "backgroundPreloadEnabled": true,
 "overflow": "visible",
 "downloadEnabled": false,
 "mouseWheelEnabled": true,
 "propagateClick": false,
 "data": {
  "name": "Player446"
 },
 "scrollBarColor": "#000000",
 "horizontalAlign": "left",
 "paddingRight": 0,
 "gap": 10
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
