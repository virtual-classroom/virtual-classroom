/*****************************************************************************/
/* Recorder: Event Handlers */
/*****************************************************************************/
Template.Recorder.events({
	'click #recorder-start': function() {
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
					const blob = new Blob(chunks, { type: 'audio/webm' });
					blob.name = Session.get('lectureId') + '-' + Meteor.userId() + '.webm'
					console.log(blob)
					// convert stream data chunks to a 'webm' audio format as a blob
					var url = URL.createObjectURL(blob)
					console.log(url)
					Session.set('url', url)

					var lectureId = Session.get('lectureId')
					var upload = Audios.insert({
						file: blob,
						streams: 'dynamic',
						chunkSize: 'dynamic',
						meta: {
							lectureId: lectureId,
							read: false,
						}
					}, false);

					upload.on('end', function(error, fileObj) {
						if (error) {
							alert('Error during upload: ' + error.reason);
						} else {
							Materialize.toast('Audio uploaded', 4000)
						}
					});

					upload.start();
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
	'click #submit': function() {
		if (Session.get('lectureId') && Session.get('blob')) {
			console.log(Session.get('blob'))
			
		}
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

	var courseCode = Router.current().params.code
	var title = Router.current().params.lecture
	var lecture = Lectures.findOne({$and: [{title: title}, {courseCode:courseCode}]})
	Session.set('lectureId', lecture._id)
});

Template.Recorder.onDestroyed(function () {
});
