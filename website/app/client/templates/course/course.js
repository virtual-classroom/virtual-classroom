/*****************************************************************************/
/* Course: Event Handlers */
/*****************************************************************************/
Template.Course.events({
	'click #create-lecture-trigger': function() {
		$('#create-lecture-modal').modal('open')
	},
	'click #cancel-create-lecture': function() {
		//Reset form
		$('#lectureName').val('')
		$('#lectureName').removeClass("invalid")
		$('#create-lecture-modal').modal('close')
	},
	'submit .create-lecture-form': function(event) {
		event.preventDefault();
		target = event.target
		var title = target.lectureName.value
		if (title == "") {
			$("#lectureName").removeClass("validate")
			$("#lectureName").removeClass("valid")
			$("#lectureName").addClass("invalid")
			$("#lectureName-label").attr("data-error", "Please give this lecture a title")
			Session.set("validLectureSection", false)
		} else if (Lectures.findOne({'lecture':title})) {
			$("#lectureName").removeClass("validate")
			$("#lectureName").removeClass("valid")
			$("#lectureName").addClass("invalid")
			$("#lectureName-label").attr("data-error", "This lecture already exists")
			Session.set("validLectureSection", false)
		} else {
			// get course
			var courseCode = Router.current().params.code.toUpperCase();
			Meteor.call('addLecture', title, courseCode, function(error, result) {
				if (error) {
					console.log(error)
					Materialize.toast('Error: ' + error.message, 8000)
				} else {
					$('#lectureName').val('')
					$('#lectureName').removeClass("invalid")
					$('#create-lecture-modal').modal('close')
					Materialize.toast('Lecture ' + title + ' has been created!', 4000)
				}
			})
		}
	}
});

/*****************************************************************************/
/* Course: Helpers */
/*****************************************************************************/
Template.Course.helpers({
	lectures: function() {
		var lectures = Lectures.find({courseCode: course.code})
		if (lectures.count() > 0) return lectures
	},
	course: function() {
		//return course
		var courseCode = Router.current().params.code
		if (courseCode) {
			courseCode = courseCode.toUpperCase()
			var course = Courses.find({
				'code': courseCode,
				'status': 'active'
			})
			if (course.count()) {
				return course
			}
		}
	},
	get_lecture: function(lecture_id) {
		var this_lecture = Lectures.findOne({_id: lecture_id});
		return this_lecture;
	}
});

/*****************************************************************************/
/* Course: Lifecycle Hooks */
/*****************************************************************************/
Template.Course.onCreated(function () {
});

Template.Course.onRendered(function () {
	Session.set("validLectureSection", false)
	$('#create-lecture-modal').modal()
	$('#class-size-tooltip').tooltip({delay: 50})

});

Template.Course.onDestroyed(function () {
});
