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
	if (user) return user.roles === 'admin'
})

Template.registerHelper('userIsInstructorOrAdmin', function() {
	// return true is current user is an instructor
	var user = Meteor.user()
	if (user) {
		return (user.profile.accountType === 'instructor') || (user.roles === 'admin')
	}
})

Template.registerHelper('userIsCourseOwner', function(code) {
	// return true if user is course owner
	var course = Courses.findOne({'code': code})
	if (course) return course.ownerId == Meteor.userId()
})

Template.registerHelper('getCourseOwner', function(code) {
	// return course owner with the given course code otherwise false
	var course = Courses.findOne({'code':code})
	if (course) return Meteor.users.findOne({'_id':course.ownerId})
})

Template.registerHelper('getAvailableInstructors', function() {
	// get a list of instructors
	var users = Meteor.users.find({
		'profile.accountType': 'instructor'
	}, {sort: {'profile.last_name':1, 'profile.first_name': 1}}).fetch()
	return users
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
	if (course && user && user.profile.accountType == 'student')
		return course.students.indexOf(user._id) >= 0
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
	if (user && course) {
		var students = course.students
		var instructors = course.instructors
		return (students.indexOf(user._id) >= 0 || 
			instructors.indexOf(user._id) >= 0)
	}
})

Template.registerHelper('getUserAvatar', function(userId) {
	var user = Meteor.users.findOne(userId)
	if (user) {
		var avatar = Avatars.findOne(user.profile.picture)
		if (avatar) return avatar.url
	}
})

Template.registerHelper('template1', function () {
	return '<template id="doodle-template"><a-entity class="test" line></a-entity></template>'
})

Template.registerHelper('template2', function(){
	return '<template id="avatar-template"> <a-entity class="avatar" networked-audio-source> <a-sphere class="head" color="#5985ff" scale="0.45 0.5 0.4" ></a-sphere> <a-entity class="face" position="0 0.05 0" > <a-sphere class="eye" color="#efefef" position="0.16 0.1 -0.35" scale="0.12 0.12 0.12" > <a-sphere class="pupil" color="#000" position="0 0 -1" scale="0.2 0.2 0.2" ></a-sphere> </a-sphere> <a-sphere class="eye" color="#efefef" position="-0.16 0.1 -0.35" scale="0.12 0.12 0.12" > <a-sphere class="pupil" color="#000" position="0 0 -1" scale="0.2 0.2 0.2" ></a-sphere> </a-sphere> </a-entity> </a-entity> </template>'
})

Template.registerHelper('getUserNameById', function(userId) {
	var user = Meteor.users.findOne(userId)
	if (user) return user.profile.first_name + " " + user.profile.last_name
})

Template.registerHelper('prettyDate', function(date) {
	// convert "Mon Oct 30 2017 13:21:08 GMT-0400 (EDT)"" to "Oct 30"
	return date.toDateString().slice(4,10)
})

Template.registerHelper('lectureIsActive', function(id) {
	// return true if this course is own by this instructor
	var lecture = Lectures.findOne({'_id': id})
	if (lecture) return lecture.active
})

Template.registerHelper('groupExists', function(id) {
    // return true if this course is own by this instructor
    var group = Groups.findOne({'lectureId': id})
	console.log(id)
	console.log(group)
    if (group) return group
})

Template.registerHelper('numberOfEnrolledStudent', function(courseId) {
	// return a list of students who enrolled into courseId
	var course = Courses.findOne({code:courseId})
	if (course && course.students) return course.students.length
})

Template.registerHelper('getLectureYouTubeURL', function(lectureId) {
	var lecture = Lectures.findOne(lectureId)
	if (lecture && lecture.youtube) return lecture.youtube + "?rel=0&amp;controls=0&amp;showinfo=0"
})

Template.registerHelper('getLectureYouTubeURL2', function(lectureId) {
	var lecture = Lectures.findOne(lectureId)
	console.log(lectureId)
	console.log(lecture.youtube)
	if (lecture && lecture.youtube) {
		var splitURL =  lecture.youtube.split("watch?v=")
		return splitURL[0] + "embed/" + splitURL[1]	
	}
})


//****************************************************************************************************
//											Route based
//****************************************************************************************************

Template.registerHelper('route_is', function(type) {
	// return true is user currently on the given page
	return Router.current().location.get().path === type
})

Template.registerHelper('hideInStream', function() {
	var route = Router.current().location.get().path
	if (route.slice(-6) === 'stream') return "display:none;"
})

Template.registerHelper('getURL', function() {
	return Router.current().location.get().path
})