/*****************************************************************************/
/* Lecture: Event Handlers */
/*****************************************************************************/
Template.Lecture.events({
	'change .toggle-lecture-active input': function(event) {
		// toggle active and inactive of lecture
		var youtube = $('#youtubeURL').val()
		if (youtube) {
			Meteor.call('toggleLecture', Session.get('lectureId'), youtube)
		} else {
			Materialize.toast('Please provide YouTube URL', 4000)
		}
	},
	'click #lecture-file-upload-trigger': function() {
		$('#lecture-file-upload-modal').modal('open')
	},
	'click #lecture-settings-trigger': function() {
		$('#lecture-settings-modal').modal('open')
	},
	'click #clear-display-question': function() {
		$('#displayQuestion').val('')
		$('#displayQuestion-label').removeClass("active")
		Meteor.call('updateLectureDisplayQuestion', this._id, '')
	},
	'click #update-display-question': function() {
		var question = $('#displayQuestion').val()
		if (question) {
			Meteor.call('updateLectureDisplayQuestion', this._id, question, 
				function(error, result) {
					if (error) {
						console.log(error)
					} else {
						Materialize.toast('Question updated', 4000)
					}
				}
			)
		}
	},
	'change .toggle-group-active input': function(event) {
		var groupSettings = {}
		groupSettings.question = $('#displayQuestion').val()
		groupSettings.groupSize = $('#group-size-range').val()
		Meteor.call('updateGroupSettings', this._id, groupSettings, function(error,result) {
			if (error) {
				console.log(error)
			} else {
				Materialize.toast('Group settings updated', 4000)
			}
		})
		Meteor.setTimeout(function() {$('#groups-collapsible').collapsible()}, 100)
	}
});

/*****************************************************************************/
/* Lecture: Helpers */
/*****************************************************************************/
Template.Lecture.helpers({
	lecture: function() {
		return Lectures.findOne(Session.get('lectureId'))
	},
	lectureIsActive: function() {
		// return true is this lecture is active
		var lecture = Lectures.findOne(Session.get('lectureId'))
		if (lecture) return lecture.active
	},
	groupIsActive: function() {
		var lecture = Lectures.findOne(Session.get('lectureId'))
		if (lecture) return lecture.mode === 'group'
	},
	numberOfEnrolledStudents: function() {
		var enrolledStudents = Courses.findOne(Session.get('courseId')).students
		if (enrolledStudents) return enrolledStudents.length
	},
	numberOfOnlineStudents: function() {
		var enrolledStudents = Courses.findOne(Session.get('courseId')).students
		var onlineStudents = []
		enrolledStudents.forEach(function(studentId) {
			var user = Meteor.users.findOne(studentId)
			if (user.profile.online) onlineStudents.push(studentId)
		})
		return onlineStudents.length
	},
	questions: function() {
		var questions = Questions.collection.find({
			"meta.lectureId": Session.get("lectureId"),
			"meta.display": true
		}, {sort: {createdAt: -1}})
		if (questions.count()) return questions
	},
	activeDisplayQuestion: function() {
		if (this.displayQuestion) return 'active'
	},
	getGroupSize: function() {
		if (this.groupSize) return this.groupSize
	},
	groups: function() {
		var groups = LectureGroups.find({lectureId:this._id,active:true},{sort: {number:1}})
		if (groups.fetch().length) return groups
	},
	disableGroupSizeRange: function() {
		var lecture = Lectures.findOne(Session.get('lectureId'))
		if (lecture && lecture.mode === 'group') return 'disabled'
	},
	getGroupDiscussion: function() {
		var group = LectureGroups.findOne(groupId)
		if (group) {
			console.log(group.discussion)
			return group.discussion
		}
	},
	activeYouTubeInputField: function(yotube) {
		var lecture = Lectures.findOne(Session.get('lectureId'))
		if (lecture && lecture.youtube) return 'active'
	}
});

/*****************************************************************************/
/* Lecture: Lifecycle Hooks */
/*****************************************************************************/
Template.Lecture.onCreated(function () {
});

Template.Lecture.onRendered(function () {
	$('#lecture-file-upload-modal').modal()
	$('#lecture-settings-modal').modal()
	Meteor.setTimeout(function() {$('#groups-collapsible').collapsible()}, 100)
	
	var courseCode = Router.current().params.code
	var title = Router.current().params.lecture
	var course = Courses.findOne({code: courseCode})
	var lecture = Lectures.findOne({$and: [{title: title}, {courseCode:courseCode}]})
	if (course) Session.set('courseId', course._id)
	if (lecture) Session.set('lectureId', lecture._id)
});

Template.Lecture.onDestroyed(function () {
});
