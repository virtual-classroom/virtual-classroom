GroupDiscussion = new Mongo.Collection("GroupDiscussion");

// create schema for Courses
var GroupDiscussionSchema = new SimpleSchema({
	lectureId: {
		type: String
	},
	groupId: {
		type: String
	},
	userId: {
		type: String
	},
	transcript: {
		type: String
	},
	confidence: {
		type: String
	},
	createdAt: {
		type: Date,
		label: 'Created At',
		defaultValue: new Date()
	}
})

GroupDiscussion.attachSchema(GroupDiscussionSchema)

if (Meteor.isClient) {
}

if (Meteor.isServer) {
	Meteor.publish('GroupDiscussion', function(lectureId) {
		var user = Meteor.user()
		// TODO: Implement publish such that student only subscribe their own group's discussion
		if (lectureId && user) {
			var lecture = Lectures.findOne(lectureId)
			var group = Groups.findOne({
				members: user._id,
				active: true
			})
			var course = Courses.findOne({code:lecture.courseCode})
			if (user && course) {
				if (course.instructors.indexOf(user._id) >= 0) {
					return GroupDiscussion.find({
						lectureId:lectureId
					}, {sort: {createdAt: -1}})
				} else if (course.students.indexOf(user._id) >= 0) {
					return GroupDiscussion.find({
						lectureId: lectureId
					}, {sort: {createdAt: -1}})
				}
			}
		}
	})
	Courses.deny({
		update() { return true },
		remove() { return true }
	})
}
