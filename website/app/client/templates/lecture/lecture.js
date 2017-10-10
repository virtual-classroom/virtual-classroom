/*****************************************************************************/
/* Lecture: Event Handlers */
/*****************************************************************************/
Template.Lecture.events({
	'change .toggle-lecture-active input': function(event) {
		// toggle active and inactive of lecture
		Meteor.call('toggleLecture', Session.get('lectureId'))
	},
	'click #lecture-file-upload-trigger': function() {
		$('#lecture-file-upload-modal').openModal()
	},
	'click #lecture-settings-trigger': function() {
		$('#lecture-settings-modal').openModal()
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
		// return the number of online students
		return Lectures.findOne({_id: this._id}).onlineStudents.length
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
	$('#lecture-active-tooltip').tooltip({delay: 50});
	$('#lecture-settings-tooltip').tooltip({delay: 1000});

	var courseCode = Router.current().params.code
	var title = Router.current().params.lecture
	var lecture = Lectures.findOne({$and: [{title: title}, {courseCode:courseCode}]})
	Session.set('lectureId', lecture._id)
});

Template.Lecture.onDestroyed(function () {
});
