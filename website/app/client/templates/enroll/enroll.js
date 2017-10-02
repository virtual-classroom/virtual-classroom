/*****************************************************************************/
/* Enroll: Event Handlers */
/*****************************************************************************/
Template.Enroll.events({
	'submit .enroll-form': function(event) {
		event.preventDefault()
		target = event.target
		var code = Session.get("courseCode")
		var key = target.enrollKey.value
		if (code != "" && key != "") {
			var course = Courses.findOne({'code': code})
			if (course.key != key) {
				$("#enrollKey").removeClass("validate")
				$("#enrollKey").removeClass("valid")
				$("#enrollKey").addClass("invalid")
				$("#enrollKey-label").attr("data-error", "Key does not match.")
			} else {
				Meteor.call('enrollCourse', code, key, function(error, result) {
					if (error) {
						console.log(error)
						Materialize.toast('Error: ' + error.message, 8000)
					} else {
						target.enrollKey.value = ""
						// $('#enroll-course-modal').modal('close')
						$('#enroll-course-modal').closeModal()
						Materialize.toast('Enrolled in ' + code, 4000)
						Router.go('/course/' + code)
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
/* Enroll: Helpers */
/*****************************************************************************/
Template.Enroll.helpers({
	'getCourseCode': function(courseID) {
		if (courseID) {
			var course = Courses.find({'_id':courseID})
			Session.set("courseCode", course.fetch()[0].code)
			return course.fetch()[0].code
		}
	}
});

/*****************************************************************************/
/* Enroll: Lifecycle Hooks */
/*****************************************************************************/
Template.Enroll.onCreated(function () {
});

Template.Enroll.onRendered(function () {
});

Template.Enroll.onDestroyed(function () {
});
