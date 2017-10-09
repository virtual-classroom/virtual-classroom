/*****************************************************************************/
/* Recorder: Event Handlers */
/*****************************************************************************/
Template.Recorder.events({
	'click #recorder-start': function() {

		// request permission to access audio stream
		navigator.mediaDevices.getUserMedia({ audio:true, video:false}).then(function(stream) {
			// store streaming data chunks in array
			const chunks = [];
			// create media recorder instance to initialize recording
			const recorder = new MediaRecorder(stream);
			// function to be called when data is received
			recorder.ondataavailable = function(e) {
				// add stream data to chunks
				chunks.push(e.data);
				// if recorder is 'inactive' then recording has finished
				if (recorder.state == 'inactive') {
					// convert stream data chunks to a 'webm' audio format as a blob
					var url = URL.createObjectURL(new Blob(chunks, { type: 'audio/webm' }))
					console.log(url)
					Session.set('url', url)
				}
			};
			recorder.start()

			Session.set("recording", true)
			document.getElementById("recorder-stop").addEventListener("click", function(){
				recorder.stop()
				Session.set("recording", 'done')
			});
		}).catch(console.error);
	},
	'click #cancel':function(event) {
		// $('#recorder-modal').modal('close');
		$('#recorder-modal').closeModal()
	}
});

/*****************************************************************************/
/* Recorder: Helpers */
/*****************************************************************************/
Template.Recorder.helpers({
	showPlayer: function() {
		return Session.get("recording") === 'done'
	},
	getAudioURL: function() {
		return Session.get("url")
	}
});

/*****************************************************************************/
/* Recorder: Lifecycle Hooks */
/*****************************************************************************/
Template.Recorder.onCreated(function () {
});

Template.Recorder.onRendered(function () {
	Session.set("recording", false)
	Session.set("url", false)
});

Template.Recorder.onDestroyed(function () {
});
