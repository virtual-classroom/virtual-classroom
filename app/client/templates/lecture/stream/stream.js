var peers = {}
var phone = false
var currentRoomId = null
connections = {}
peerConnection = null
groupid = null;
// Hack https://github.com/socketio/socket.io-client/issues/961
/*****************************************************************************/
/* Stream: Event Handlers */
/*****************************************************************************/
Template.Stream.events({
    'click #recorder-modal-trigger': function () {
        Session.set('recorder', true)
        Session.set('audioURL', false)
        document.getElementById("recorder-confidence").innerHTML = "Average Confidence: 0.00%"
        document.getElementById("textBox").value = ""
        $('#recorder-modal').modal('open')
    },
    'click #group-discussion-modal-trigger': function () {
        $('#group-discussion-modal').modal('open')
    },
    'click #group-discussion-modal-close': function () {
        $('#group-discussion-modal').modal('close')
    },
    'keyup #group-discussion-textarea': function () {
        // update discussion every 5 seconds after keyup
        clearTimeout(Session.get('typingTimer'))
        if ($('#group-discussion-textarea').val()) {
            typingTimer = setTimeout(function () {
                Meteor.call('updateGroupDiscussion', peerConnection.sessionid,
                    Template.$('#group-discussion-textarea').val())
            }, Session.get('typingInterval'))
            Session.set('typingTimer', typingTimer)
        }
    },
    'click .enter-group-discussion': function (event) {
    },
    'click #exit-group-discussion': function () {
        var lecture = Lectures.findOne(Session.get('lectureId'))
        if (lecture.mode == 'group') {

            console.log(peerConnection)
            console.log(peerConnection.getAllParticipants())
            let moderatorShifted = false
            if (peerConnection.getAllParticipants().length == 0) {
                peerConnection.closeEntireSession(function () {
                    console.log("Entire session has been closed")
                });
                peerConnection.closeSocket()
                console.log("Socket closed!")
                peerConnection.attachStreams.forEach(function (localStream) {
                    localStream.stop();
                });
            }
            else {
                peerConnection.getAllParticipants().forEach(function (participantId) {
                    if (peerConnection.userid == peerConnection.sessionid && moderatorShifted == false) {
                        peerConnection.shiftModerationControl(participantId, peerConnection.broadcasters, false);
                        console.log(peerConnection.broadcasters)
                        console.log("Moderator requesting shift to " + participantId);
                        moderatorShifted = true;
                    }
                    peerConnection.disconnectWith(participantId);
                });
                peerConnection.attachStreams.forEach(function (localStream) {
                    localStream.stop();
                });
                peerConnection.close()
            }
            peerConnection = null
            groupid = null;
        }
    }
});
/*****************************************************************************/
/* Stream: Helpers */
/*****************************************************************************/
Template.Stream.helpers({
    lecture: function () {
        var lecture = Lectures.findOne(Session.get('lectureId'))
        if (lecture) return lecture
    },
    group: function () {
        var group = Groups.findOne(Session.get('groupId'))
        if (group) return group
    },
    getGroupId: function () {
        return Session.get('groupId')
    },
    groups: function () {
        var groups = Groups.find({active: true}, {sort: {name: 1}}).fetch()
        if (groups.length) return groups
    },
    recorderIsActive: function () {
        var modal = document.getElementById('recorder-modal')
        if (Session.get('recorder') === true) return "muted"
    },
    getDisplayQuestion: function () {
        var lecture = Lectures.findOne(Session.get('lectureId'))
        if (lecture && lecture.displayQuestion) return lecture.displayQuestion
    },
    groupMode: function (mode) {
        if (mode == 'group') {
            return true
        } else {
            return false
        }
    },
    getGroupMembers: function () {
        var group = Groups.findOne(Session.get('groupId'))
        console.log(group)
        if (group) {
            var members = group.members
            members.splice(members.indexOf(Meteor.userId()), 1)
            return members
        }
    },
    avatarPosition: function (index) {
        if (index % 2 == 0) var x = 1.5 * Math.floor((index + 1) / 2)
        else var x = -1.5 * Math.floor((index + 1) / 2)
        var y = 1.2
        var z = -2.2
        return x + " " + y + " " + z
    },
    namePosition: function (index) {
        if (index % 2 == 0) var x = 1.5 * Math.floor((index + 1) / 2)
        else var x = -1.5 * Math.floor((index + 1) / 2)
        var y = 0.7
        var z = -2.2
        return x + " " + y + " " + z
    },
    getGroupNumber: function () {
        var group = Groups.findOne(Session.get('groupId'))
        if (group) return group.number
    },
    activeTextarea: function (discussion) {
        if (discussion) return 'active'
    },
    userCanEditDiscussion: function () {
        var user = Meteor.user()
        var group = currentRoomId
        if (user && group && user._id !== group.leader) return 'disabled'
    },
    groupDiscussion: function () {
        var discussion = GroupDiscussion.find({
            groupId: Session.get('groupId')
        }, {sort: {createdAt: -1}})
        if (discussion) return discussion
    }
});

function voiceChat() {
    if (!phone) {
        var pubnub = PubNub.findOne()
        phone = window.phone = PHONE({
            number: Meteor.userId(),
            publish_key: pubnub.publish_key,
            subscribe_key: pubnub.subscribe_key,
            media: {audio: true, video: false},
            ssl: true
        })

        phone.unable(function () {
            console.log("Your device does not support RTCPeerConnection!");
            Materialize.toast('Your device does not support RTCPeerConnection', 4000)
        })

        phone.ready(function () {
            // call all group members when phone is ready
            console.log('phone ready')
            callMembers()
        })

        phone.receive(function (session) {
            var audio = document.getElementById('voiceChat')
            session.connected(function (session) {
                // created new audio when session is connected
                console.log('session ' + session.number + ' connected')
                peers[session.number] = session.video.src
                var source = document.createElement("source")
                source.id = session.number + '-voiceChat'
                source.src = peers[session.number]
                audio.appendChild(source)
            })
            session.ended(function (session) {
                // remove audio when session has ended
                console.log('session ' + session.number + ' ended')
                session.hangup()
                peers[session.number] = false
                var source = document.getElementById(session.number + '-voiceChat')
                if (source) audio.removeChild(source)
            })
        })
    }
}

function callMembers() {
    if (phone) {
        var group = Groups.findOne(Session.get('groupId'))
        if (group) {
            for (var i = 0; i < group.members.length; i++) {
                if (group.members[i] != Meteor.userId())
                    phone.dial(group.members[i])
            }
        }
    }
}

function voiceCallEnd() {
    if (phone) phone.hangup()
    peers = {}
    var audio = document.getElementById('voiceChat')
    if (audio) audio.innerHTML = ''
}

function voiceCallTerminate() {
    if (phone) {
        phone.camera.stop()
        phone = false
    }
}

function createConnection() {
    peerConnection = new RTCMultiConnection()
    peerConnection.socketURL = "https://rtc-connection-server.herokuapp.com/";
    peerConnection.socketMessageEvent = 'audio-conference-demo';
    peerConnection.session = {
        audio: true,
        video: false
    };
    peerConnection.mediaConstraints = {
        audio: true,
        video: false
    };
    peerConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: false
    };
    peerConnection.autoCloseEntireSession = false
    peerConnection.onopen = function (event) {
        console.log('WebRTC chat opened!');
    };
    peerConnection.onShiftedModerationControl = function (sender, existingBroadcasters) {
        console.log("Moderator has been shifted to " + sender);
        // peerConnection
        peerConnection.disconnectWith(sender);
        peerConnection.acceptModerationControl(sender, existingBroadcasters);
        console.log(peerConnection)
    };
    peerConnection.onUserStatusChanged = function (event) {
        var isOnline = event.status === 'online';
        var isOffline = event.status === 'offline';
        if (isOnline) {
            console.log(event.userid + " is online")
        }
        if (isOffline) {
            console.log(event.userid + " is offline")
            peerConnection.disconnectWith(event.userid)
        }

        var targetUserId = event.userid;
        var targetUserExtraInfo = event.extra;
    };
}

function enterGroupStreamRoom(roomid) {
    console.log('checking presence...');
    peerConnection.checkPresence(roomid, function (roomExist, roomid) {
        console.log('Room exists=' + roomExist);
        if (roomExist === true) {
            console.log('I am a participant');
            connections[roomid] = peerConnection.join(roomid);
        } else {
            console.log('I am the moderator');
            peerConnection.open(roomid);
            // peerConnection.
        }
    });
    currentRoomId = roomid
    // peerConnection.open(roomid)
    // connections[roomid] = peerConnection.join(roomid)
    // peerConnection.openOrJoin(roomid)
}

function reEnterGroupStreamRoom(roomid) {
    console.log("Rejoined!");
    peerConnection.rejoin(connections[roomid])
    currentRoomId = roomid
}

function aframeInit() {
    AFRAME.registerComponent('button_down', {
        schema: {
            text: {default: 'Press For Help'}
        },

        init: function () {
            var data = this.data;
            var el = this.el;

            el.addEventListener('mousedown', function () {
                var ui = document.querySelector('#UI');
                var button = document.querySelector('#buttonText');


                if (ui.getAttribute('visible')) {
                    //console.log(ui);
                    ui.setAttribute('visible', false);
                    button.setAttribute('value', 'Press For Help');

                } else {
                    ui.setAttribute('visible', true);
                    button.setAttribute('value', 'Press To Cancel');
                    //send the message here
                }

            });
        }
    });

    AFRAME.registerComponent('teleport', {
        schema: {},

        init: function () {
            var data = this.data;
            var el = this.el;

            var steps = document.querySelector('#steps');

            el.addEventListener('mousedown', function () {
                var player = document.querySelector('#player');
                var pos = el.getAttribute('position');

                player.setAttribute('position', pos.x + " 1.3 " + pos.z);

            });

            el.addEventListener('mouseenter', function (evt) {
                steps.setAttribute("visible", "true");
            });

            el.addEventListener('mouseleave', function (evt) {
                steps.setAttribute("visible", "false");
            });

        }
    });

    AFRAME.registerComponent('teleport2', {
        schema: {
            entered: {default: false}
        },

        init: function () {
            var data = this.data;
            var el = this.el;


            // var crosshair = document.querySelector('#crosshair');
            var circle = document.querySelector('#circle');

            var steps = document.querySelector('#steps');
            var target = document.querySelector('#target');


            el.addEventListener('mousedown', function () {
                var player = document.querySelector('#player');

                // player.setAttribute('position', pos.x + " 1.3 " + pos.z);

                var camera = document.querySelector('#player');
                var cameraPos = camera.getAttribute('position');
                var cameraRot = camera.object3D.getWorldDirection();

                var mult = cameraPos.y / cameraRot.y;
                var line_rot = {
                    x: cameraPos.x - cameraRot.x * mult,
                    y: cameraPos.y - cameraRot.y * mult,
                    z: cameraPos.z - cameraRot.z * mult
                };

                //var test = document.querySelector('#test');

                //test.setAttribute('position', line_rot);

                player.setAttribute('position', line_rot.x + " 1.3 " + line_rot.z);


            });

            el.addEventListener('mouseenter', function (evt) {
                steps.setAttribute("visible", "true");
                //   crosshair.setAttribute("visible", "true");
                circle.setAttribute("visible", "false");

                data.entered = true;
                target.setAttribute('visible', true);
            });

            el.addEventListener('mouseleave', function (evt) {
                steps.setAttribute("visible", "false");
                //  crosshair.setAttribute("visible", "false");
                circle.setAttribute("visible", "true");

                data.entered = false;
                target.setAttribute('visible', false);


            });
        },

        tick: function (time, timeDelta) {

            if (this.data.entered) {
                var target = document.querySelector('#target');

                var camera = document.querySelector('#player');
                var cameraPos = camera.getAttribute('position');
                var cameraRot = camera.object3D.getWorldDirection();

                var mult = cameraPos.y / cameraRot.y;
                var line_rot = {
                    x: cameraPos.x - cameraRot.x * mult,
                    y: cameraPos.y - cameraRot.y * mult,
                    z: cameraPos.z - cameraRot.z * mult
                };

                target.setAttribute('position', line_rot);
            }
        }


    });


//Drawing on the Board
    AFRAME.registerComponent('button_down_board', {
        schema: {
            index: {default: 0},
            doodle_index: {default: 0},
            drawing: {default: false},
            start: {default: false},
            color: {default: 'blue'},
            //counter stuff
            counter: {default: 0},
            delay: {default: 0}
        },

        init: function () {
            var data = this.data;
            var el = this.el;
            var scene = document.querySelector('a-scene');
            var cursor = document.querySelector('#cursor');

            var crosshair = document.querySelector('#crosshair');
            var circle = document.querySelector('#circle');

            var pen = document.querySelector('#pen');


            el.addEventListener('mousedown', function (evt) {
                //console.log(scene);
                data.start = true;
                data.drawing = true;
                data.index = 0;
                data.counter = 0;
            });

            el.addEventListener('mouseup', function (evt) {
                if (data.drawing) {
                    data.doodle_index++;
                    data.drawing = false;
                    data.index = 0;
                    data.counter = 0;
                }
            });

            el.addEventListener('mouseenter', function (evt) {
                crosshair.setAttribute("visible", "true");
                circle.setAttribute("visible", "false");

                pen.setAttribute("visible", "true");


            });

            el.addEventListener('mouseleave', function (evt) {
                if (data.drawing) {
                    data.doodle_index++;
                    data.drawing = false;
                    data.index = 0;
                    data.counter = 0;
                }

                crosshair.setAttribute("visible", "false");
                circle.setAttribute("visible", "true");

                pen.setAttribute("visible", "false");
            });

            el.addEventListener('change_color', function (event) {
                //console.log('Entity collided with', event.detail.collidingEntity);
                //console.log('new color: ' + event.detail.color);
                data.color = event.detail.color;
            });

            el.addEventListener('erase_toggle', function (event) {
                //console.log('Entity collided with', event.detail.collidingEntity);
                //console.log('erase_toggle');

                //console.log(scene.querySelectorAll('[index]'));
                scene.querySelectorAll('[line]').forEach(function (element) {
                    element.parentNode.removeChild(element);
                    //console.log(element);
                });

            });

        },

        tick: function (time, timeDelta) {

            var cursor = document.querySelector('#cursor');

            if (cursor.getAttribute("geometry")) {
                cursor.removeAttribute("geometry");
            }

            var data = this.data;

            if (data.drawing) {
                if (data.counter === data.delay) {
                    data.counter = 0;
                    var scene = document.querySelector('a-scene');
                    var line = document.createElement('a-entity');

                    line.setAttribute('networked', 'template:#doodle-template');
                    line.setAttribute('id', 'doodle__' + data.doodle_index);
                    line.setAttribute('class', 'eraseable');
                    line.setAttribute('erase_line', 'color: red');

                    //console.log(line);
                    scene.appendChild(line);

                    var camera = document.querySelector('#player');


                    var cameraPos = camera.getAttribute('position');
                    var cameraRot = camera.object3D.getWorldDirection();

                    var mult = (6.9 - cameraPos.z) / -cameraRot.z;
                    var line_rot = line_rot = {
                        x: cameraPos.x - cameraRot.x * mult,
                        y: cameraPos.y - cameraRot.y * mult,
                        z: cameraPos.z - cameraRot.z * mult
                    };

                    if (data.start) {
                        //console.log(data.doodle_index);

                        line.setAttribute('line', {
                            start: {
                                x: line_rot.x,
                                y: line_rot.y,
                                z: line_rot.z
                            },
                            end: {
                                x: line_rot.x,
                                y: line_rot.y,
                                z: line_rot.z
                            },
                            color: data.color
                        });

                        data.start = false;
                    } else {

                        //TODO add a distance threshold to update to save memory
                        //console.log('#doodle__' + (data.doodle_index - 1));
                        var previous_doodle = document.querySelector('#doodle__' + (data.doodle_index - 1));
                        var previous_line = previous_doodle.getDOMAttribute('line');
                        line.setAttribute('line', {
                                start: {
                                    x: previous_line.end.x,
                                    y: previous_line.end.y,
                                    z: previous_line.end.z
                                },
                                end: {
                                    x: line_rot.x,
                                    y: line_rot.y,
                                    z: line_rot.z
                                },
                                color: data.color
                            }
                        );
                    }
                    data.doodle_index++;
                } else {
                    //counter
                    data.counter++;
                }
            }
        },

        change_color: function (color) {
            data.color = color;
        }
    });

    AFRAME.registerComponent('change-color-on-hover', {
        schema: {
            color: {default: 'red'}
        },

        init: function () {
            var data = this.data;
            var el = this.el;  // <a-box>
            var defaultColor = el.getAttribute('material').color;

            var crosshair = document.querySelector('#crosshair');
            var circle = document.querySelector('#circle');

            el.addEventListener('mouseenter', function () {
                el.setAttribute('color', data.color);

                crosshair.setAttribute("visible", "true");
                circle.setAttribute("visible", "false");
            });

            el.addEventListener('mouseleave', function () {
                el.setAttribute('color', defaultColor);

                crosshair.setAttribute("visible", "false");
                circle.setAttribute("visible", "true");
            });
        }
    });

    AFRAME.registerComponent('change-drawing-color', {
        schema: {
            color: {default: 'red'}
        },

        init: function () {
            var data = this.data;
            var el = this.el;

            var crosshair = document.querySelector('#crosshair');
            var circle = document.querySelector('#circle');

            var paint = document.querySelector('#paint');

            el.addEventListener('mouseenter', function () {
                crosshair.setAttribute("visible", "true");
                circle.setAttribute("visible", "false");

                paint.setAttribute("visible", "true");

            });

            el.addEventListener('mouseleave', function () {
                crosshair.setAttribute("visible", "false");
                circle.setAttribute("visible", "true");

                paint.setAttribute("visible", "false");

            });

            el.addEventListener('mousedown', function () {

                var pen_color = document.querySelector('#board');
                pen_color.emit('change_color', {color: data.color}, false);

                paint.setAttribute("material", {color: data.color});
            });
        }
    });

    AFRAME.registerComponent('erase_toggle', {
        init: function () {
            var data = this.data;
            var el = this.el;

            var eraser = document.querySelector('#eraser');
            var crosshair = document.querySelector('#crosshair');
            var circle = document.querySelector('#circle');

            el.addEventListener('mouseenter', function () {
                crosshair.setAttribute("visible", "true");
                circle.setAttribute("visible", "false");
                eraser.setAttribute("visible", "true");

            });

            el.addEventListener('mouseleave', function () {
                crosshair.setAttribute("visible", "false");
                circle.setAttribute("visible", "true");

                eraser.setAttribute("visible", "false");

            });

            el.addEventListener('mousedown', function () {

                var board = document.querySelector('#board');

                board.emit('erase_toggle');
            });
        }
    });

    AFRAME.registerComponent('index', {
        schema: {
            ind: {default: 0}
        }
    });

    AFRAME.registerComponent('erase_line', {
        schema: {
            color: {default: 'red'}
        },
        init: function () {
            var data = this.data;
            var el = this.el;

            el.addEventListener('mouseenter', function (evt) {

                //console.log(evt.detail);

                var board = document.querySelector('#board');

                el.parentNode.removeChild(el);

            });
        }
    });
}

/*****************************************************************************/
/* Stream: Lifecycle Hooks */
/*****************************************************************************/
Template.Stream.onCreated(function () {
    console.log('Group ID of this VR room is: '+ Session.get('groupId'))
});

Template.Stream.onRendered(function () {
    var courseCode = Router.current().params.code
    var title = Router.current().params.lecture
    var lecture = Lectures.findOne({$and: [{title: title}, {courseCode: courseCode}]})
    Session.set('lectureId', lecture._id)
    Session.set('recorder', false)
    var group = Groups.findOne({members: Meteor.userId(), active: true})
    if (group) Session.set('groupId', group._id)

    Meteor.setTimeout(function () {
        $('#group-discussion-modal').modal()
        $('#recorder-modal').modal()
    }, 50)
    document.documentElement.style.overflow = "hidden"

    // variables to textarea update timer
    var typingTimer
    Session.set('typingTimer', typingTimer)
    Session.set('typingInterval', 5000)
    if (lecture.mode == 'group') {
        if (peerConnection == null) {
            createConnection()
            console.log(peerConnection)
        }
        if (connections[groupid] == null) {
            enterGroupStreamRoom(groupid)
        }
        else {
            reEnterGroupStreamRoom(groupid)
        }
    }
    aframeInit();
});

Template.Stream.onDestroyed(function () {
    document.documentElement.style.overflow = "auto"
    Session.set('groupId', false)
});


