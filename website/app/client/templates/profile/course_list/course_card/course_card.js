/*****************************************************************************/
/* CourseCard: Event Handlers */
/*****************************************************************************/
Template.CourseCard.events({
	'click #remove-course-modal-trigger': function() {
		// store the course code and course ID in session
		Session.set('course', this.courseId)
		$('#remove-course-modal').openModal()
		// $('#confirm-remove-course').modal('open')
	},
	'click #confirm-remove': function() {
		var user = Meteor.user()
		var course = Session.get('course')
		console.log("remove course " + Session.get('course'))
		$('#remove-course-modal').closeModal()
		// if (user && course && (user._id === course.ownerId || (user.roles === 'admin'))) {
		// 	Courses.update(course._id, {
		// 		$set: {
		// 			'status':'inactive'
		// 		} 
		// 	}, function(error) {
		// 		if (error) {
		// 			console.log(error)
		// 		} else {
		// 			$('#remove-course-modal').closeModal()
		// 			// $('#confirm-remove-course').modal('close')
		// 			Materialize.toast('Course ' + Session.get('remove_course_code') + ' has been removed', 4000)
		// 		}
		// 	})
		// }
	},
	'click #remove-course-cancel':function() {
		$('#remove-course-modal').closeModal()
		// $('#confirm-remove-course').modal('close')
	},
	'click #enroll-modal-trigger': function() {
		Session.set('course', this.courseId)
		// $('#enroll-course-modal').modal('open')
		$('#enroll-course-modal').openModal()
	},
	'submit .enroll-form': function(event) {
		event.preventDefault()
		target = event.target
		var key = target.enrollKey.value
		if (key != "") {
			var course = Courses.findOne({'code': this.courseId})
			if (course.key != key) {
				$("#enrollKey").removeClass("validate")
				$("#enrollKey").removeClass("valid")
				$("#enrollKey").addClass("invalid")
				$("#enrollKey-label").attr("data-error", "Key does not match.")
			} else {
				Meteor.call('enrollCourse', this.courseId, key, function(error, result) {
					if (error) {
						console.log(error)
						Materialize.toast('Error: ' + error.message, 8000)
					} else {
						target.enrollKey.value = ""
						// $('#enroll-course-modal').modal('close')
						$('#enroll-course-modal').closeModal()
						Materialize.toast('Enrolled in ' + this.courseId, 4000)
						Router.go('/course/' + this.courseId)
					}
				})
			}
		}
	},
	'click #cancel':function(event) {
		//Clear form
		$('#enrollKey').val('')
		$('#enrollKey').removeClass("invalid")
		// $('#enroll-course-modal').modal('close')
		$('#enroll-course-modal').closeModal()
	}
});

/*****************************************************************************/
/* CourseCard: Helpers */
/*****************************************************************************/
Template.CourseCard.helpers({
	course: function() {
		return Courses.findOne(this.courseId)
	},
	getSelectedCourseCode: function() {
		var course = Courses.findOne(Session.get('course'))
		if (course) return course.code
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
