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
				ownerId: user._id,
				courseTitle: course.title,
				courseCode: course.code,
				title: lectureTitle,
				active: false,
				createdAt: new Date()
			}, function(error) {
				if (error) throw new Meteor.Error("Insert Error", 
					error.message, error.message)
			}) 
			// Update Course
			//Add Lecture to Course
			var updatedLectures = course.lectures
			updatedLectures.push(id)
			Courses.update(course._id, {
				$set: {lectures: updatedLectures}
			})
		} else throw new Meteor.Error("Insert Error", "Access denied", 
			"Access denied")
	},
	'enrollCourse': function(courseId, key) {
		var user = Meteor.user()
		var course = Courses.findOne(courseId)
		if (user && user.profile.accountType === 'student' && course.status === 'active') {
			// Add user ID into existing course enrollment list
			var temp = course.students
			temp.push(user._id)
			Courses.update(course._id, {
				$set: {students: temp}
			},function(error) {
				if (error) throw new Meteor.Error("Update error", error.message, error.message)
			})
		} else throw new Meteor.Error("Update error", "Access denied", 
			"Access denied");
	},
	'toggleLecture': function(lectureId) {
		var user = Meteor.user()
		var lecture = Lectures.findOne(lectureId)
		if (user && lecture && lecture.ownerId == user._id) {
			Lectures.update(lectureId, {
				$set: {active: !lecture.active}
			})
		}
	},
	'updateGroupSettings': function(lectureId, groupSettings) {
		// Update lecture group settings
		// if the lecture has no group, randomly initialize groups base on 
		// enrolled students, otherwise, use the existing group settings.
		var user = Meteor.user()
		var lecture = Lectures.findOne(lectureId)
		var course = Courses.findOne({code:lecture.courseCode})
		if (user && lecture && course && course.instructors.indexOf(user._id) >= 0) {
			if (lecture.mode == 'group') {
				Lectures.update(lectureId, {
					$set: {
						mode: 'lecture'
					}
				}, function(error) {
					if (error) throw new Meteor.Error("Update error", 
						error.message, error.message)
				})
			} else {
				var students = course.students
				var groupSize = parseInt(groupSettings.groupSize)
				var existingGroups = LectureGroups.find({
					lectureId:lectureId,
					active:true
				}).fetch()
				if (existingGroups.length <= 0 || parseInt(lecture.groupSize) != groupSize) {
					// deactivate old existing groups
					for (i = 0; i < existingGroups.length; i += 1) {
						LectureGroups.update(existingGroups[i]._id, {$set:{
							active:false
						}},function(error) {
							if (error) throw new Meteor.Error("Update error", 
								error.message, error.message)
						})
					}
					// create new groups
					var groups = []
					for (i = 0; i < students.length; i += groupSize) {
						groups.push(students.slice(i, i + groupSize))
					}
					for (i = 0; i < groups.length; i += 1) {
						var members = groups[i]
						var leader = members[Math.floor(Math.random()*members.length)]
						LectureGroups.insert({
							lectureId: lecture._id,
							courseId: course._id,
							leader: leader,
							number: i + 1,
							members: groups[i],
							active: true,
							createdAt: new Date()
						}, function(error) {
							if (error) throw new Meteor.Error("Update error", 
								error.message, error.message)
						})
					}
				}
				Lectures.update(lectureId, {
					$set: {
						mode: 'group',
						displayQuestion: groupSettings.question,
						groupSize: groupSettings.groupSize
					}
				}, function(error) {
					if (error) throw new Meteor.Error("Update error", 
						error.message, error.message)
				})
			}
		} else throw new Meteor.Error("Update error", "Access denied", 
			"Access denied");
	},
	'displayQuestion': function(lectureId, audioId) {
		var user = Meteor.user()
		var lecture = Lectures.findOne(lectureId)
		var audio = Questions.collection.findOne(audioId)
		if (lecture && audio && user._id == audio.userId) {
			var transcript = audio.meta.transcript
			var confidence = audio.meta.confidence
			var read = audio.meta.read
			Questions.update(audioId, {
				$set: {meta: {
					lectureId: lectureId,
					transcript: transcript,
					confidence: confidence,
					read: false,
					display: true
				}}
			})
		}
	},
	'updateUserInfo': function(userId, userInfo) {
		var user = Meteor.user()
		if (user._id == userId) {
			Meteor.users.update(user._id, {
				$set: {
					'profile.first_name': userInfo.firstname,
					'profile.last_name': userInfo.lastname,
					'profile.picture': userInfo.avatar
				}
			}, function(error) {
				if (error) throw new Meteor.Error("Update error", error.message, error.message)
			})
		} else throw new Meteor.Error("Update error", "Access denied", "Access denied");
	},
	'updateLectureDisplayQuestion': function(lectureId, question) {
		var user = Meteor.user()
		var lecture = Lectures.findOne(lectureId)
		if (user && lecture && lecture.ownerId == user._id) {
			Lectures.update(lectureId, {
				$set: {displayQuestion: question}
			})
		}
	},
	'updateGroupDiscussion': function(groupId, discussion) {
		var user = Meteor.user()
		var group = LectureGroups.findOne(groupId)
		if (user && group && user._id === group.leader) {
			LectureGroups.update(groupId, {
				$set:{
					discussion:discussion
				}
			}, function(error) {
				if (error) throw new Meteor.Error("Update error", 
					error.message, error.message)
			})
		} else throw new Meteor.Error("Update error", "Access denied", "Access denied");
	}
});
