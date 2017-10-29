/*****************************************************************************/
/* CourseList: Event Handlers */
/*****************************************************************************/
Template.CourseList.events({
	'keyup #search': function() {
		var input = $('#search').val()
		Session.set("search", input)
	},
	'click #confirm-remove': function() {
		var user = Meteor.user()
		var course = Session.get('courseId')
		console.log("remove course " + Session.get('courseId'))
		$('#remove-course-modal').modal('close')
		// if (user && course && (user._id === course.ownerId || (user.roles === 'admin'))) {
		// 	Courses.update(course._id, {
		// 		$set: {
		// 			'status':'inactive'
		// 		} 
		// 	}, function(error) {
		// 		if (error) {
		// 			console.log(error)
		// 		} else {
		// 			$('#remove-course-modal').modal('close')
		// 			Materialize.toast('Course ' + Session.get('remove_course_code') + ' has been removed', 4000)
		// 		}
		// 	})
		// }
	},
	'click #remove-course-cancel':function() {
		$('#remove-course-modal').modal('close')
	},
	'submit #enroll-form': function(event) {
		event.preventDefault()
		target = event.target
		var key = $('#enrollKey').val()
		var course = Courses.findOne(Session.get('courseId'))
		if (course && key != "") {
			if (course.key != key) {
				$("#enrollKey").removeClass("validate")
				$("#enrollKey").removeClass("valid")
				$("#enrollKey").addClass("invalid")
				$("#enrollKey-label").attr("data-error", "Key does not match.")
			} else {
				Meteor.call('enrollCourse', course._id, key, function(error, result) {
					if (error) {
						console.log(error)
						Materialize.toast('Error: ' + error.message, 8000)
					} else {
						target.enrollKey.value = ""
						$('#enroll-course-modal').modal('close')
						Materialize.toast('Enrolled in ' + course.code, 4000)
						Router.go('/course/' + course.code)
					}
				})
			}
		}
	},
	'click #enroll-course-cancel':function(event) {
		//Clear form
		$('#enrollKey').val('')
		$('#enrollKey').removeClass("invalid")
		$('#enroll-course-modal').modal('close')
	}
});

/*****************************************************************************/
/* CourseList: Helpers */
/*****************************************************************************/
Template.CourseList.helpers({
	courses: function() {
		return Courses.find({'status': 'active'}).fetch().length > 0 
	},
	relatedCourses: function() {
		// get courses that are related to use, or get courses base on search regex
		var user = Meteor.user()
		if (user) {
			if (user && Session.get('search') === '') {
				return Courses.find({'status': 'active', $or: 
					[{'instructors': user._id},{'students': user._id}]
				}, {sort: {'code':1}})
			} else {
				var regex = new RegExp(Session.get('search'), 'i')
				return Courses.find({
					'code': {$regex: regex},
					'status': 'active',
					$or: [{'instructors': user._id},{'students': user._id}]	
				}, {sort: {'code':1}})
			}
		}
	},
	unrelatedCourses: function() {
		// get that are not related to user, or get courses base on search regex
		var user = Meteor.user()
		if (user) {
			if (user && Session.get('search') === '') {
				return Courses.find({
					'status': 'active',
					'instructors': {$not: user._id},
					'students': {$not: user._id}
				}, {sort: {'code':1}})
			} else {
				var regex = new RegExp(Session.get('search'), 'i')
				return Courses.find({
					'code': {$regex: regex},
					'status': 'active',
					'instructors': {$not: user._id},
					'students': {$not: user._id}
				}, {sort: {'code':1}})
			}
		}
	},
	getSelectedCourseCode: function() {
		var course = Courses.findOne(Session.get('courseId'))
		if (course) return course.code
	}
});

/*****************************************************************************/
/* CourseList: Lifecycle Hooks */
/*****************************************************************************/
Template.CourseList.onCreated(function () {
});

Template.CourseList.onRendered(function () {
	$('#class-size-tooltip').tooltip({delay: 25})
	$('#remove-course-modal').modal()
	$('#enroll-course-modal').modal()
	Session.set('search', '')
});

Template.CourseList.onDestroyed(function () {
});
