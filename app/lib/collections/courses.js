Courses = new Mongo.Collection("Courses");

// create schema for Courses
var CoursesSchema = new SimpleSchema({
	ownerId: {
		type: String,
		label: 'Owner ID',
		defaultValue: this.userId
	},
	instructors: {
		type: [String],
		label: 'List of Instructors',
		optional: true
	},
	title: {
		type: String,
		label: 'Course Title',
		min: 1
	},
	code: {
		type: String,
		label: 'Course Code',
		unique: true,
		min: 1
	},
	status: {
		type: String,
		defaultValue: 'active',
		allowedValues: ['active', 'inactive']
	},
	description: {
		type: String,
		label: 'Course Description',
		optional: true
	},
	students: {
		type: [String],
		label: 'List of Students',
		defaultValue: [],
		optional: true
	},
	lectures: {
		type: [String],
		defaultValue: []
	},
	createdAt: {
		type: Date,
		label: 'Created At',
		defaultValue: new Date()
	}
})

Courses.attachSchema(CoursesSchema)

if (Meteor.isClient) {
}

if (Meteor.isServer) {
	Meteor.publish('Courses', function(courseCode) {
		if (courseCode) {
			return Courses.find({code:courseCode},{sort: {code:1}})
		} else {
			return Courses.find({},{sort: {code:1}})
		}
	})
	Courses.deny({
		update() { return true },
		remove() { return true }
	})
}
