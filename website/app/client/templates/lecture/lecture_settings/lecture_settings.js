/*****************************************************************************/
/* LectureSettings: Event Handlers */
/*****************************************************************************/
Template.LectureSettings.events({
	'click #confirm-cancel': function() {
		$('#lecture-settings-modal').closeModal()
	},
	'click #confirm-changes': function() {
		var threshold = $('#notification-threshold').val()
		var course = Courses.find({code:lecture.courseCode})
		if (course) {
			Lectures.update(lecture._id, {
				$set: {threshold:threshold}
			}, function(error) {
				if (error) {
					console.log(error)
				} else {
					Materialize.toast('Changes saved!', 4000)
				}
				$('#lecture-settings-modal').closeModal()
			})
		}
	},
	'change #notification-threshold': function() {
		// update the current threshold range slider value
		Session.set("threshold", $('#notification-threshold').val())
	}
});

/*****************************************************************************/
/* LectureSettings: Helpers */
/*****************************************************************************/
Template.LectureSettings.helpers({
	classSize: function() {
		// return the number of students in course
		var course = Courses.find({code:lecture.courseCode})
		if (course) {
			return course.fetch()[0].students.length
		}
	},
	threshold: function() {
		// display the threshold range slider value
		return Session.get("threshold")
	}
});

/*****************************************************************************/
/* LectureSettings: Lifecycle Hooks */
/*****************************************************************************/
Template.LectureSettings.onCreated(function () {
});

Template.LectureSettings.onRendered(function () {
	// set the saved value
	$('#notification-threshold').val(lecture.threshold)
	Session.set("threshold", lecture.threshold)
});

Template.LectureSettings.onDestroyed(function () {
});
