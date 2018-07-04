let interval = null
/*****************************************************************************/
/* Lecture: Event Handlers */
/*****************************************************************************/
Template.Lecture.events({
    'change .toggle-lecture-active input': function (event) {
        // toggle active and inactive of lecture
        var youtube = $('#youtubeURL').val()
        if (!youtube) Materialize.toast('Please provide YouTube URL', 4000)
        Meteor.call('toggleLecture', Session.get('lectureId'), youtube)
    },
    'change .toggle-lecture-available input': function(event) {
        // toggle active and inactive of lecture
        var youtube = $('#youtubeURL').val()
        if (!youtube) Materialize.toast('Please provide YouTube URL', 4000)
        Meteor.call('toggleLecturePermaLink', Session.get('lectureId'), youtube)
    },
    'click #lecture-file-upload-trigger': function () {
        $('#lecture-file-upload-modal').modal('open')
    },
    'click #lecture-settings-trigger': function () {
        $('#lecture-settings-modal').modal('open')
    },
    'click #clear-display-question': function () {
        $('#displayQuestion').val('')
        $('#displayQuestion-label').removeClass("active")
        Meteor.call('updateLectureDisplayQuestion', this._id, '')
    },
    'click #update-display-question': function () {
        var question = $('#displayQuestion').val()
        if (question) {
            Meteor.call('updateLectureDisplayQuestion', this._id, question,
                function (error, result) {
                    if (error) {
                        console.log(error)
                    } else {
                        Materialize.toast('Question updated', 4000)
                    }
                }
            )
        }
    },
    'change .toggle-group-active input': function (event) {
        var groupSettings = {}
        groupSettings.question = $('#displayQuestion').val()
        groupSettings.groupSize = $('#group-size-range').val()
        Meteor.call('updateGroupSettings', this._id, groupSettings, function (error, result) {
            if (error) {
                console.log(error)
            } else {
                Materialize.toast('Group settings updated', 4000)
            }
        })
        Meteor.setTimeout(function () {
            $('#groups-collapsible').collapsible()
        }, 100)
    },
    'change #instructorNotification': function () {
        var notification = document.getElementById('instructorNotification').checked
        if (notification) {
            Notification.requestPermission().then(function (result) {
                if (result === 'denied') {
                    console.log('Permission wasn\'t granted. Allow a retry.')
                }
                if (result === 'default') {
                    console.log('The permission request was dismissed.')
                }
            })
            instructorNotification()
        } else {
            Meteor.clearInterval(interval)
            interval = null
        }
    },
    'click .enter-group-stream': function (event) {
        groupid = event.target.dataset.value;
        let roomGroupId = event.target.dataset.value;
        console.log(roomGroupId)
        Session.set('groupId', roomGroupId);

    }
});

/*****************************************************************************/
/* Lecture: Helpers */
/*****************************************************************************/
Template.Lecture.helpers({
    lecture: function () {
        return Lectures.findOne(Session.get('lectureId'))
    },
    lectureIsActive: function () {
        // return true is this lecture is active
        var lecture = Lectures.findOne(Session.get('lectureId'))
        if (lecture) return lecture.active
    },
    lectureIsAvailable: function() {
        // return true is this lecture is active
        var lecture = Lectures.findOne(Session.get('lectureId'))
        if (lecture) return lecture.available
    },
    groupIsActive: function () {
        var lecture = Lectures.findOne(Session.get('lectureId'))
        if (lecture) return lecture.mode === 'group'
    },
    numberOfEnrolledStudents: function () {
        var course = Courses.findOne(Session.get('courseId'))
        if (course && course.students) return course.students.length
    },
    numberOfOnlineStudents: function () {
        var course = Courses.findOne(Session.get('courseId'))
        if (course) {
            var onlineStudents = []
            course.students.forEach(function (studentId) {
                var user = Meteor.users.findOne(studentId)
                if (user.profile.online) onlineStudents.push(studentId)
            })
            return onlineStudents.length
        }
    },
    questions: function () {
        var audios = Audios.collection.find({
            "meta.lectureId": Session.get("lectureId")
        }, {sort: {createdAt: -1}})
        if (audios.count()) return audios
    },
    activeDisplayQuestion: function () {
        if (this.displayQuestion) return 'active'
    },
    getGroupSize: function () {
        if (this.groupSize) return this.groupSize
    },
    groups: function () {
        var groups = Groups.find({
            lectureId: this._id,
            active: true
        }, {sort: {number: 1}}).fetch()
        if (groups.length) return groups
    },
    disableGroupSizeRange: function () {
        var lecture = Lectures.findOne(Session.get('lectureId'))
        if (lecture && lecture.mode === 'group') return 'disabled'
    },
    getGroupDiscussion: function () {
        var group = Groups.findOne(groupId)
        if (group) {
            console.log(group.discussion)
            return group.discussion
        }
    },
    activeYouTubeInputField: function (yotube) {
        var lecture = Lectures.findOne(Session.get('lectureId'))
        if (lecture && lecture.youtube) return 'active'
    },
    canViewLecture: function(){
        var lecture = Lectures.findOne(Session.get('lectureId'))
        return lecture.active || lecture.available
    }
});

function userIsCourseInstructor(userId) {
    var course = Courses.findOne(Session.get('courseId'))
    if (course) {
        if (userId) return course.instructors.indexOf(userId) >= 0
        else return course.instructors.indexOf(Meteor.userId()) >= 0
    }
}

function userIsCourseOwner(userId) {
    var course = Courses.findOne(Session.get('courseId'))
    if (course) {
        if (userId) return course.ownerId == userId
        else return course.ownerId == Meteor.userId()
    }
}

function instructorNotification() {
    var lecture = Lectures.findOne(Session.get('lectureId'))
    // check if there are new unread questions every 5 seconds
    if (userIsCourseInstructor() && lecture && lecture.active) {
        interval = Meteor.setInterval((function () {
            var questions = Audios.collection.find({
                'meta.lectureId': lecture._id,
                'meta.notified': false
            })
            if (questions.count()) {
                var title = Router.current().params.lecture
                var options = {
                    body: 'You have ' + questions.count() + ' new questions!',
                    icon: "/icons/cardboard.png"
                }
                new Notification(title, options)
                Meteor.call('notifiedAudioQuestion', lecture._id, questions.fetch())
            }
        }), 5000)
    }
}

/*****************************************************************************/
/* Lecture: Lifecycle Hooks */
/*****************************************************************************/
Template.Lecture.onCreated(function () {
});

Template.Lecture.onRendered(function () {
    $('#lecture-file-upload-modal').modal()
    $('#lecture-settings-modal').modal()
    Meteor.setTimeout(function () {
        $('#groups-collapsible').collapsible()
    }, 100)

    var courseCode = Router.current().params.code
    var title = Router.current().params.lecture
    var course = Courses.findOne({code: courseCode})
    var lecture = Lectures.findOne({$and: [{title: title}, {courseCode: courseCode}]})
    if (course) Session.set('courseId', course._id)
    if (lecture) Session.set('lectureId', lecture._id)
});

Template.Lecture.onDestroyed(function () {
});
