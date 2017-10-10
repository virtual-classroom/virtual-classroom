import {audioLevel} from './audio-meter'
/*****************************************************************************/
/* Recorder: Event Handlers */
/*****************************************************************************/
Template.Recorder.events({
	'click #recorder-start': function() {
		navigator.mediaDevices.getUserMedia({ audio:true, video:false}).then(function(stream) {
			const chunks = []
			const recorder = new MediaRecorder(stream)

			var recognition = new webkitSpeechRecognition()
			var transcript = ''
			var confidence = 0
			recognition.continuous = false;
			recognition.interimResults = false;
			recognition.lang = "en-US";
			
			recognition.onresult = function(event) { 
				Session.set("recording", 'done')
				var result = event.results[0][0]
  				recorder.stop()
				level.shutdown()
				recognition.stop()
				transcript = result.transcript
				confidence = result.confidence
			}

			// function to be called when data is received
			recorder.ondataavailable = function(e) {
				// add stream data to chunks
				chunks.push(e.data);
				// if recorder is 'inactive' then recording has finished
				if (recorder.state == 'inactive') {
					const blob = new Blob(chunks, { type: 'audio/webm' });
					blob.name = Session.get('lectureId') + '-' + Meteor.userId() + '.webm'
					// convert stream data chunks to a 'webm' audio format as a blob
					var url = URL.createObjectURL(blob)
					Session.set('url', url)

					var lectureId = Session.get('lectureId')
					var upload = Questions.insert({
						file: blob,
						streams: 'dynamic',
						chunkSize: 'dynamic',
						meta: {
							lectureId: lectureId,
							transcript: transcript,
							confidence: confidence,
							read: false,
							display: false
						}
					}, false);

					upload.on('end', function(error, fileObj) {
						if (error) {
							alert('Error during upload: ' + error.reason);
						} else {
							Session.set("audioId", upload.config.fileId)
						}
					});

					upload.start();
				}
			};
			recorder.start()
			recognition.start()
			Session.set("recording", true)
			
			var level = audioLevel(stream)
			Meteor.setInterval((function() {
				if (Session.get('recording') === true) Session.set('level', level.volume.toFixed(2))
			}), 1000);
		}).catch(console.error);
	},
	'click #submit': function() {
		if (Session.get('audioId')) {
			Meteor.call('displayQuestion', Session.get('lectureId'), 
				Session.get('audioId'))
			Materialize.toast('Question sent', 4000)
			$('#recorder-modal').closeModal()
			Session.set('recorder', false)
			Session.set('recording', 'inactive')
		}
	},
	'click #cancel':function(event) {
		// $('#recorder-modal').modal('close');
		$('#recorder-modal').closeModal()
		Session.set('recorder', false)
		Session.set('recording', 'inactive')
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
	},
	getAudioLevel: function() {
		if (Session.get('recording') === true && Session.get('level')) {
			return Session.get('level')
		}
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
	Session.set('audioId', false)
	Session.set('level',false)

	var courseCode = Router.current().params.code
	var title = Router.current().params.lecture
	var lecture = Lectures.findOne({$and: [{title: title}, {courseCode:courseCode}]})
	Session.set('lectureId', lecture._id)
});

Template.Recorder.onDestroyed(function () {
});
