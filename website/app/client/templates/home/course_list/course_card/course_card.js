/*****************************************************************************/
/* CourseCard: Event Handlers */
/*****************************************************************************/
Template.CourseCard.events({
	'click .remove-course-modal-trigger': function() {
		// store the course code and course ID in session
		Session.set('course', this.courseId)
		$('#remove-course-modal').openModal()
		// $('#confirm-remove-course').modal('open')
	},
	'click .enroll-modal-trigger': function() {
		Session.set('course', this.courseId)
		// $('#enroll-course-modal').modal('open')
		$('#enroll-course-modal').openModal()
	}
});

/*****************************************************************************/
/* CourseCard: Helpers */
/*****************************************************************************/
Template.CourseCard.helpers({
	course: function() {
		return Courses.findOne(this.courseId)
	}
});

/*****************************************************************************/
/* CourseCard: Lifecycle Hooks */
/*****************************************************************************/
Template.CourseCard.onCreated(function () {
});

Template.CourseCard.onRendered(function () {
	Session.set('course', false)
});

Template.CourseCard.onDestroyed(function () {
});
