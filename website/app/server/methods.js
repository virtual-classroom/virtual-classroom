/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

Meteor.methods({
	'server/method_name': function () {
	// server method logic
	},
	'addCourse': function(courseInfo) {
		var user = Meteor.user()
		if (user && user.profile.accountType == 'instructor') {
			var error = false
			Courses.insert({
				ownerId: user._id,
				instructors: [user._id],
				title: courseInfo.title,
				code: courseInfo.code,
				status: "active",
				lectures: [],
				description: courseInfo.description,
				key: courseInfo.key,
				students: [],
				createdAt: new Date()
			}, function(error) {
				if (error) throw new Meteor.Error("Update error", error.message, error.message)
			});
		} else throw new Meteor.Error("Update error", "Access denied", "Access denied");
	},
	'addLecture': function(lectureTitle, courseCode) {
		var user = Meteor.user()
		var course = Courses.findOne({code: courseCode})
		if (user && course && course.instructors.indexOf(user._id) >= 0) {
			var errror = false
			// Add lecture
			id = Lectures.insert({
				owerId: user._id,
				courseTitle: course.title,
				courseCode: course.code,
				title: lectureTitle,
				active: false,
				createdAt: new Date()
			}, function(error) {
				if (error) throw new Meteor.Error("Insert Error", error.message, error.message)
			}) 
			// Update Course
			//Add Lecture to Course
			var updatedLectures = course.lectures
			updatedLectures.push(id)
			Courses.update(course._id, {
				$set: {lectures: updatedLectures}
			})
		} else throw new Meteor.Error("Insert Error", "Access denied", "Access denied")
	},
	'enrollCourse': function(courseCode, key) {
		var user = Meteor.user()
		var course = Courses.findOne({'code': courseCode})
		if (user && user.profile.accountType == 'student' && course.status == 'active') {
			// Add user ID into existing course enrollment list
			var temp = course.students
			temp.push(user._id)
			Courses.update(course._id, {
				$set: {students: temp}
			},function(error) {
				if (error) throw new Meteor.Error("Update error", error.message, error.message)
			})
		} else throw new Meteor.Error("Update error", "Access denied", "Access denied");
	},
	'toggleLecture': function(lectureId) {
		var user = Meteor.user()
		var lecture = Lectures.findOne(lectureId)
		if (user && lecture && lecture.ownerId == user._id) {
			console.log(lecture.active)
			Lectures.update(lectureId, {
				$set: {active: !lecture.active}
			})
		}
	}
});
