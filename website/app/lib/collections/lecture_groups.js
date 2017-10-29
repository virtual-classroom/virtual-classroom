LectureGroups = new Mongo.Collection("LectureGroups");

// create schema for Courses
var LectureGroupsSchema = new SimpleSchema({
	lectureId: {
		type:String
	},
	courseId: {
		type:String
	},
	number: {
		type: Number,
		label: 'Group number',
		unique: true
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
			return LectureGroups.find({lectureId: lectureId})
		}
	})
	Courses.deny({
		update() { return true },
		remove() { return true }
	})
}
