//****************************************************************************************************
//											User based
//****************************************************************************************************
Template.registerHelper('userIsInstructor', function() {
	// return true is current user is an instructor
	if (Meteor.user()) {
		return Meteor.user().profile.accountType === 'instructor'
	}
})

Template.registerHelper('userIsStudent', function() {
	// return true is current user is a student
	if (Meteor.user()) {
		return Meteor.user().profile.accountType === 'student'
	}
})

Template.registerHelper('userIsAdmin', function() {
	// return true is current user is admin
	var user = Meteor.user()
	if (user) {
		return user.roles == 'admin'
	}
})

Template.registerHelper('userIsInstructorOrAdmin', function() {
	// return true is current user is an instructor
	var user = Meteor.user()
	if (user) {
		return (user.profile.accountType === 'instructor') || (user.roles === 'admin')
	}
})

Template.registerHelper('this_user', function() {
	// return user object
	if (Meteor.user()) {
		return Meteor.user()
	}
})

Template.registerHelper('course_owner', function(code) {
	// return course owner with the given course code otherwise false
	course = Courses.findOne({'code':code})
	if (course) {
		return Meteor.users.findOne({'_id':course.ownerId})
	} else {
		return false
	}
})

Template.registerHelper('courseIsOwnBy', function(code) {
	// return true if this course is own by this instructor
	course = Courses.findOne({'code': code})
	if (course) {
		return Meteor.userId() === course.ownerId
	} else {
		return false
	}
})

Template.registerHelper('studentIsEnrolledIn', function(code) {
	// return true if this student is enrolled in this course
	var course = Courses.findOne({code: code})
	if (course) {
		return course.students.indexOf(Meteor.userId()) >= 0
	}
})

Template.registerHelper('userIsInCourse', function(code) {
	// return true if current user is either the instructor or student of a course
	var course = Courses.findOne({code: code})
	if (Meteor.user()) {
		var student = course.students.indexOf(Meteor.userId())
		return (Meteor.userId() == course.ownerId || student >= 0)
	}
}) 

Template.registerHelper('prettyDate', function(date) {
	var prettyDate = date.toDateString().slice(0, 15)
	return prettyDate
})

Template.registerHelper('lecIsActive', function(id) {
	// return true if this course is own by this instructor
	lec = Lectures.findOne({'_id': id})
	if (lec) return lec.status === 'active'
})

Template.registerHelper('numberOfEnrolledStudent', function(code) {
	// return the number of students that are currently enrolled in this course
	var course = Courses.find({code: code})
	return course.fetch()[0].students.length
})

//****************************************************************************************************
//											Route based
//****************************************************************************************************

Template.registerHelper('route_is', function(type) {
	// return true is user currently on the given page
	return Router.current().location.get().path === type
})