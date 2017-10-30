LectureGroups = new Mongo.Collection("LectureGroups");

// create schema for Courses
var LectureGroupsSchema = new SimpleSchema({
	lectureId: {
		type:String
	},
	courseId: {
		type:String
	},
	leader: {
		type:String
	},
	number: {
		type: Number,
		label: 'Group number'
	},
	active: {
		type: Boolean,
		defaultValue: true
	},
	members: {
		type: [String],
		label: 'List of Students'
	},
	createdAt: {
		type: Date,
		label: 'Created At',
		defaultValue: new Date()
	}
})

LectureGroups.attachSchema(LectureGroupsSchema)

if (Meteor.isClient) {
}

if (Meteor.isServer) {
	Meteor.publish('LectureGroups', function(lectureId) {
		if (lectureId) {
			var user = Meteor.user()
			var lecture = Lectures.findOne(lectureId)
			var course = Courses.findOne({code:lecture.courseCode})
			if (user && course) {
				if (course.instructors.indexOf(user._id) >= 0) {
					return LectureGroups.find({lectureId:lectureId}, 
						{sort: {number:1}})
				} else if (course.students.indexOf(user._id) >= 0) {
					return LectureGroups.find({lectureId:lectureId,members:user._id}, 
						{sort: {number:1}})
				}
			}
		}
	})
	Courses.deny({
		update() { return true },
		remove() { return true }
	})
}
