/*****************************************************************************/
/* Profile: Event Handlers */
/*****************************************************************************/
Template.Profile.events({
	'keyup #username': function() {
		// check if username already taken or invalid format
		var input = $('#username').val()
		var usernameRegex = new RegExp('[^A-Za-z0-9]', 'gi')
		var usernameTest = usernameRegex.test(input)

		var user = Meteor.users.find({'username': input})
		if (usernameTest) {
			$("#username").removeClass("valid")
			$("#username").addClass("invalid")
			$("#username-label").attr("data-error", "Username can only contains letters and numbers")
		} else if (user.count() === 1 && Meteor.user().username !== input) {
			$("#username").removeClass("valid")
			$("#username").addClass("invalid")
			$("#username-label").attr("data-error", "Username has already been used")
		} else {
			$('#username').addClass("valid")
			$("#username").removeClass("invalid")
		}
	},
	'keyup #course-search': function() {
		Session.set('search_code', $('#course-search').val())
	}
});

/*****************************************************************************/
/* Profile: Helpers */
/*****************************************************************************/
Template.Profile.helpers({
	courses: function() {
		// search through Courses, if search_code is given
		var search_code = Session.get('search_code')
		// not case sensative
		var regex = new RegExp(search_code, 'i')
		if (search_code == "") {
			return Courses.find({
				'status':'active'
			})
		} else {
			return Courses.find({
				'code': {$regex: regex},
				'status':'active'
			})
		}
	},
	enrolledCourses: function() {
		// return the list of courses that the current user is taken
		// otherwise return false
		if (Meteor.user()) {
			var courses = Courses.find({
				'students': Meteor.userId()
			})
			if (courses.count() > 0) {
				return courses
			} else {
				return false
			}
		}
	},
	totalUsers: function() {
		// return the total number of users
		if (Meteor.user().roles == 'admin') {
			return Meteor.users.find().count()
		}
	}
});

/*****************************************************************************/
/* Profile: Lifecycle Hooks */
/*****************************************************************************/
Template.Profile.onCreated(function () {
});

Template.Profile.onRendered(function () {
	// intitialize search code to be empty
	Session.set('search_code', '')
});

Template.Profile.onDestroyed(function () {
});
