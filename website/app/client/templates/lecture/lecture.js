/*****************************************************************************/
/* Lecture: Event Handlers */
/*****************************************************************************/
Template.Lecture.events({
	'change .toggle-lecture-active input': function(event) {
		// toggle active and inactive of lecture
		Meteor.call('toggleLecture', Session.get('lectureId'))
	},
	'click #lecture-file-upload-trigger': function() {
		$('#lecture-file-upload-modal').modal('open')
	},
	'click #lecture-settings-trigger': function() {
		$('#lecture-settings-modal').modal('open')
	}
});

/*****************************************************************************/
/* Lecture: Helpers */
/*****************************************************************************/
Template.Lecture.helpers({
	lecture: function() {
		return Lectures.findOne(Session.get('lectureId'))
	},
	isActive: function() {
		// return true is this lecture is active
		var lecture = Lectures.findOne(Session.get('lectureId'))
		if (lecture) return lecture.active
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
});

/*****************************************************************************/
/* Lecture: Lifecycle Hooks */
/*****************************************************************************/
Template.Lecture.onCreated(function () {
});

Template.Lecture.onRendered(function () {
	// initialize tooltips in this tempplate
	// $('#lecture-active-tooltip').tooltip({delay: 50});
	// $('#lecture-settings-tooltip').tooltip({delay: 1000});
	$('#lecture-file-upload-modal').modal()
	$('#lecture-settings-modal').modal()
	var courseCode = Router.current().params.code
	var title = Router.current().params.lecture
	var course = Courses.findOne({code: courseCode})
	var lecture = Lectures.findOne({$and: [{title: title}, {courseCode:courseCode}]})
	Session.set('courseId', course._id)
	Session.set('lectureId', lecture._id)
});

Template.Lecture.onDestroyed(function () {
});
