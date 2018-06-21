/**
 * Created by MichaelWang on 2018-06-13.
 */
// function Connection() {
//     this.connection = new RTCMultiConnection();
//     this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
//     this.connection.socketMessageEvent = 'audio-conference-demo';
//     this.connection.session = {
//         audio: true,
//         video: false
//     };
//     this.connection.mediaConstraints = {
//         audio: true,
//         video: false
//     };
//     this.connection.sdpConstraints.mandatory = {
//         OfferToReceiveAudio: true,
//         OfferToReceiveVideo: false
//     };
//     this.connection.autoCloseEntireSession = false
// }
//
//

var pc1;
var pc2;
var localStream;


var offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 0,
    voiceActivityDetection: false
};

function gotStream(stream) {
    console.log('Received local stream');
    localStream = stream;
    var audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
        console.log('Using Audio device: ' + audioTracks[0].label);
    }
    localStream.getTracks().forEach(
        function(track) {
            pc1.addTrack(
                track,
                localStream
            );
        }
    );
    console.log('Adding Local Stream to peer connection');

    pc1.createOffer(
        offerOptions
    ).then(
        gotDescription1,
        onCreateSessionDescriptionError
    );
}

function onCreateSessionDescriptionError(error) {
    console.log('Failed to create session description: ' + error.toString());
}

function call() {
    callButton.disabled = true;
    codecSelector.disabled = true;
    console.log('Starting call');
    var servers = null;
    pc1 = new RTCPeerConnection(servers);
    console.log('Created local peer connection object pc1');
    pc1.onicecandidate = function(e) {
        onIceCandidate(pc1, e);
    };
    pc2 = new RTCPeerConnection(servers);
    console.log('Created remote peer connection object pc2');
    pc2.onicecandidate = function(e) {
        onIceCandidate(pc2, e);
    };
    pc2.ontrack = gotRemoteStream;
    console.log('Requesting local stream');
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    })
        .then(gotStream)
        .catch(function(e) {
            alert('getUserMedia() error: ' + e.name);
        });
}

function gotDescription1(desc) {
    console.log('Offer from pc1 \n' + desc.sdp);
    pc1.setLocalDescription(desc).then(
        function() {
            pc2.setRemoteDescription(desc).then(
                function() {
                    pc2.createAnswer().then(
                        gotDescription2,
                        onCreateSessionDescriptionError
                    );
                },
                onSetSessionDescriptionError
            );
        },
        onSetSessionDescriptionError
    );
}

function gotDescription2(desc) {
    console.log('Answer from pc2 \n' + desc.sdp);
    pc2.setLocalDescription(desc).then(
        function() {
            pc1.setRemoteDescription(desc).then(
                function() {
                },
                onSetSessionDescriptionError
            );
        },
        onSetSessionDescriptionError
    );
}

function hangup() {
    console.log('Ending call');
    localStream.getTracks().forEach(function(track) {
        track.stop();
    });
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;
}

function gotRemoteStream(e) {
    if (audio2.srcObject !== e.streams[0]) {
        audio2.srcObject = e.streams[0];
        console.log('Received remote stream');
    }
}

function getOtherPc(pc) {
    return (pc === pc1) ? pc2 : pc1;
}

function getName(pc) {
    return (pc === pc1) ? 'pc1' : 'pc2';
}

function onIceCandidate(pc, event) {
    getOtherPc(pc).addIceCandidate(event.candidate)
        .then(
            function() {
                onAddIceCandidateSuccess(pc);
            },
            function(err) {
                onAddIceCandidateError(pc, err);
            }
        );
    console.log(getName(pc) + ' ICE candidate: \n' + (event.candidate ?
            event.candidate.candidate : '(null)'));
}

function onAddIceCandidateSuccess() {
    console.log('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
    console.log('Failed to add ICE Candidate: ' + error.toString());
}

function onSetSessionDescriptionError(error) {
    console.log('Failed to set session description: ' + error.toString());
}
