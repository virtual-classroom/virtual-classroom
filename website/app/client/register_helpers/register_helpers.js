//****************************************************************************************************
//											User based
//****************************************************************************************************
Template.registerHelper('userIsInstructor', function() {
	// return true is current user is an instructor
	var user = Meteor.user()
	if (user) return user.profile.accountType === 'instructor'
})

Template.registerHelper('userIsStudent', function() {
	// return true is current user is a student
	var user = Meteor.user()
	if (user) return user.profile.accountType === 'student'
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

Template.registerHelper('getCourseOwner', function(code) {
	// return course owner with the given course code otherwise false
	var course = Courses.findOne({'code':code})
	if (course) return Meteor.users.findOne({'_id':course.ownerId})
})

Template.registerHelper('userIsCourseInstructor', function(code) {
	// return true if this course is own by this instructor
	var course = Courses.findOne({'code': code})
	if (course) return course.instructors.indexOf(Meteor.userId()) >= 0
})

Template.registerHelper('studentIsInCourse', function(courseCode) {
	// return true if this student is enrolled in this course
	var course = Courses.findOne({code: courseCode})
	var user = Meteor.user()
	if (course && user) 
		return (course.students.indexOf(user._id) >= 0)
})

Template.registerHelper('studentNotInCourse', function(courseCode) {
	// return true if this student is enrolled in this course
	var course = Courses.findOne({code: courseCode})
	var user = Meteor.user()
	if (course && user && user.profile.accountType === 'student') 
		return (course.students.indexOf(user._id) < 0)
})

Template.registerHelper('userIsInCourse', function(courseCode) {
	// return true if current user is either the instructor or student of a course
	var course = Courses.findOne({code: courseCode})
	var user = Meteor.user()
	if (user) {
		var studnet = course.students.indexOf(user._id)
		return (user._id === course.ownerId || studnet >= 0)
	}
})

Template.registerHelper('getUserAvatar', function(userId) {
	var user = Meteor.users.findOne(userId)
	if (user) {
		var avatar = Avatars.findOne(user.profile.picture)
		if (avatar) return avatar.url
	}
})

Template.registerHelper('getUserNameById', function(userId) {
	var user = Meteor.users.findOne(userId)
	if (user) return user.profile.first_name + " " + user.profile.last_name
})

Template.registerHelper('prettyDate', function(date) {
	return date.toDateString().slice(0, 15)
})

Template.registerHelper('lectureIsActive', function(id) {
	// return true if this course is own by this instructor
	var lecture = Lectures.findOne({'_id': id})
	if (lecture) return lecture.active
})

Template.registerHelper('numberOfEnrolledStudent', function(courseId) {
	// return a list of students who enrolled into courseId
	var course = Courses.findOne({code:courseId})
	if (course) return course.students.length
})



//****************************************************************************************************
//											Route based
//****************************************************************************************************

Template.registerHelper('route_is', function(type) {
	// return true is user currently on the given page
	return Router.current().location.get().path === type
})