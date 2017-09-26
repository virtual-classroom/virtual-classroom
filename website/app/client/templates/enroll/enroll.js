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
				var temp = course.students
				temp.push(Meteor.userId())
				Courses.update(course._id, {
					$set: {students: temp}
				})
				target.enrollKey.value = ""
				$('#enroll-course-modal').closeModal();
				Materialize.toast("You've successfully enrolled in " + code + "!", 4000)
				//Router.go('/profile')
			}
		}
	},
	'click #cancel':function(event) {
		//Clear form
		$('#enrollKey').val('')
		$('#enrollKey').removeClass("invalid")
		$('#enroll-course-modal').closeModal()
	},
	'click #enroll-model-trigger': function() {
		$('#enroll-modal').openModal()
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
