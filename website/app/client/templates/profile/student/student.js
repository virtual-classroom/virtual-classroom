/*****************************************************************************/
/* Student: Event Handlers */
/*****************************************************************************/
Template.Student.events({
	'click #enroll-model-trigger': function() {
		Session.set("enroll_course_code", this._id)
		$('#enroll-course-modal').openModal()
	}
});

/*****************************************************************************/
/* Student: Helpers */
/*****************************************************************************/
Template.Student.helpers({
	coursesAvailable: function() {
		var courses = Courses.find({
			'students': { $not : Meteor.userId() },
			'status': 'active'
		}, {sort: {'code':1}})
		return courses.count() > 0
	},
	courses: function() {
		//return list of courses that this student is not enrolled in
		// search through Courses, if search_code is given
		var search_code = Session.get('search_code')
		// not case sensitive
		var regex = new RegExp(search_code, 'i')
		if (search_code == "") {
			return Courses.find({
				'students': { $not : Meteor.userId() },
				'status': 'active'
			}, {sort: {'code':1}})
		} else {
			return Courses.find({
				'code': {$regex: regex},
				'students': { $not : Meteor.userId() },
				'status': 'active'			
			}, {sort: {'code':1}})
		}
	},
	enrolledCourses: function() {
		// return the list of courses that the current user is taken
		// otherwise return false
		if (Meteor.user()) {
			var courses = Courses.find({
				'students': Meteor.userId(),
				'status': 'active'
			}, {sort: {'code':1}})
			if (courses.count() > 0) {
				return courses
			} else {
				return false
			}
		}
	},
	enroll_course_code: function() {
		// this function is to pass in the course code to the Enroll template
		return Session.get("enroll_course_code")
	}
});

/*****************************************************************************/
/* Student: Lifecycle Hooks */
/*****************************************************************************/
Template.Student.onCreated(function () {
});

Template.Student.onRendered(function () {
});

Template.Student.onDestroyed(function () {
});
