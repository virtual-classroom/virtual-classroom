/*****************************************************************************/
/* CourseCard: Event Handlers */
/*****************************************************************************/
Template.CourseCard.events({
	'click .remove-course-modal-trigger': function() {
		// store the course code and course ID in session
		Session.set('courseId', this.courseId)
		$('#remove-course-modal').modal('open')
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
