/*****************************************************************************/
/* CourseList: Event Handlers */
/*****************************************************************************/
Template.CourseList.events({
	'keyup #search': function() {
		var input = $('#search').val()
		Session.set("search", input)
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
	remove_course_code: function() {
		return Session.get('remove_course_code')
	}
});

/*****************************************************************************/
/* CourseList: Lifecycle Hooks */
/*****************************************************************************/
Template.CourseList.onCreated(function () {
});

Template.CourseList.onRendered(function () {
	$('#class-size-tooltip').tooltip({delay: 25})
	// $('#confirm-remove-course').modal()

	Session.set('search', '')
});

Template.CourseList.onDestroyed(function () {
});
