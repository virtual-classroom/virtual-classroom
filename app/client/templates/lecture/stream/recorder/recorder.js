import {audioLevel} from './audio-meter'

let blob = []
let transcript = 'Unable to transcript audio'
let confidence = 0
let average_confidence = 0;

/*****************************************************************************/
/* Recorder: Event Handlers */
/*****************************************************************************/
Template.Recorder.events({
    'click #recorder-toggle': function () {
        if (Session.get('state') == 'inactive') {
            Session.set('audioURL', false)
            resetTranscriptConfidence()
            recorder()
        }
    },
    'click #recorder-submit': function () {
        if (Session.get('state') == 'inactive' && (Session.get('audioURL')
            && document.getElementById("textBox").value != "")) {
            setAudioSessions(false, false, null, false)
            resetTranscriptConfidence()
            uploadAudio()
            $('#recorder-modal').modal('close')
        } else if (Session.get('state') == 'inactive' && (Session.get('audioURL')
            && document.getElementById("textBox").value == "")) {
            setAudioSessions(false, false, null, false)
            resetTranscriptConfidence()
            uploadAudio()
            $('#recorder-modal').modal('close')
        } else if (Session.get('state') == 'recording') {
            Materialize.toast('Please press the recorder button to stop recording.', 4000)
        } else if (document.getElementById("textBox").value != "") {
            //TODO: Have to implement system where user can submit a typed answer
            resetTranscriptConfidence()
            Materialize.toast('Message Sent!', 4000)
        } else if (document.getElementById("textBox").value == "") {
            Materialize.toast('Please press the recorder button to record a question, or manually type a question.', 4000)
        } else {
            Materialize.toast('Unable to record, please try again.', 4000)
        }
    },
    'click #recorder-cancel': function () {
        setAudioSessions(false, false, null, false)
        resetTranscriptConfidence()
        $('#recorder-modal').modal('close')
    }
});

/*****************************************************************************/
/* Recorder: Helpers */
/*****************************************************************************/
Template.Recorder.helpers({
    showPlayer: function () {
        return Session.get('audioURL')
    },
    getAudioURL: function () {
        return Session.get('audioURL')
    },
    getAudioLevel: function () {
        if (Session.get('recording') === true && Session.get('level'))
            return Session.get('level')
    },
    isRecording: function () {
        return Session.get('state') == 'recording'
    }
});

function recorder() {
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
        .then(function (stream) {
            const chunks = []

            var recorder = new MediaRecorder(stream)
            var recognition = new webkitSpeechRecognition()
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US"

            recorder.onstart = function () {
                Session.set('state', recorder.state)
                transcript = '';
                recognition.start();
                console.log("Recorder service has started")
            }

            recorder.onstop = function () {
                Session.set('state', recorder.state)
                // TODO: Stop media properly
                console.log("Recorder service has ended")
                stream.getTracks().forEach(track => track.stop())
            }

            // function to be called when data is received
            recorder.ondataavailable = function (event) {
                console.log("Recorder server has available data")
                // add stream data to chunks
                chunks.push(event.data)
                // if recorder is 'inactive' then recording has finished
                if (recorder.state == 'inactive') {
                    blob = new Blob(chunks, {type: 'audio/webm'})
                    var time = new Date().getTime()
                    blob.name = Session.get('lectureId') + '-' + Meteor.userId() + '-' + time + '.webm'

                    // convert stream data chunks to a 'webm' audio format as a blob
                    var url = URL.createObjectURL(blob)
                    Session.set('audioURL', url)
                }
            }

            recognition.onresult = function (event) {
                let interim_transcript = '';
                for (var i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                        confidence += event.results[i][0].confidence;
                        let new_confidence = confidence / event.results.length;
                        average_confidence = new_confidence
                        document.getElementById("recorder-confidence").innerHTML = "Average Confidence: " +
                            (new_confidence * 100).toFixed(2) + "%"
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }

                document.getElementById("textBox").value = transcript + interim_transcript
            }
            $('#recorder-toggle').click(function () {
                if (recorder.state != 'inactive') {
                    recorder.close()
                }
            })
            $('#recorder-cancel').click(function () {
                if (recorder.state != 'inactive') {
                    recorder.stop()
                }
            })
            recorder.start()
        }).catch(console.error)
}

function uploadAudio() {
    console.log(blob)
    var lecture = Lectures.findOne(Session.get('lectureId'))
    var upload = Audios.insert({
        file: blob,
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: {
            lectureId: lecture._id,
            groupId: Session.get('groundId'),
            transcript: transcript,
            confidence: average_confidence,
            mode: lecture.mode,
            read: false,
            notified: false
        }
    }, false)
    upload.on('end', function (error, fileObj) {
        if (error) {
            alert('Error during upload: ' + error.reason)
        } else {
            blob = []
            transcript = ''
            confidence = 0
            average_confidence = 0
            Materialize.toast('Question sent!', 4000)
        }
    })
    upload.start()
}
function resetTranscriptConfidence() {
    confidence = 0
    average_confidence = 0
    document.getElementById("recorder-confidence").innerHTML = "Average Confidence: 0.00%"
    document.getElementById("textBox").value = ""
}
function setAudioSessions(audioUrl, audioId, state, recorder) {
    if (audioUrl != null) Session.set("audioURL", audioUrl)
    if (audioId != null) Session.set('audioId', audioId)
    if (state != null) Session.set('state', state)
    if (recorder != null) Session.set('recorder', recorder)
}

/*****************************************************************************/
/* Recorder: Lifecycle Hooks */
/*****************************************************************************/
Template
    .Recorder.onCreated(function () {
});

Template.Recorder.onRendered(function () {
    setAudioSessions(false, false, 'inactive', null)
    var courseCode = Router.current().params.code
    var title = Router.current().params.lecture
    var lecture = Lectures.findOne({$and: [{title: title}, {courseCode: courseCode}]})
    Session.set('lectureId', lecture._id)
});

Template.Recorder.onDestroyed(function () {
});
