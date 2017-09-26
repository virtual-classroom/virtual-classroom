Courses = new Mongo.Collection("courses");

// create schema for Courses
var CoursesSchema = new SimpleSchema({
	ownerId: {
		type: String,
		label: 'Ownder ID',
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
		min: 1
	},
	description: {
		type: String,
		label: 'Course Description',
		optional: true
	},
	key: {
		type: String,
		label: 'Unique Key',
		min: 4
	},
	students: {
		type: [String],
		label: 'List of Students',
		defaultValue: [],
		optional: true
	},
	createdAt: {
		type: Date,
		label: 'Created At',
		defaultValue: new Date()
	}
})
/*
if (Meteor.isServer) {
	Courses.allow({
		insert: function (userId, doc) {
			console.log(doc)
			return true;
		},

		update: function (userId, doc, fieldNames, modifier) {
			console.log(doc)
			return true;
		},

		remove: function (userId, doc) {
			console.log(doc)
			return true;
		}
	});

	// only instructors are allowed to create course
	function userIsInstructor(doc) {
		return true
		//return Meteor.user().profile.accountType === 'instructor'
	}

	Courses.deny({
		insert: function (userId, doc) {
			console.log(doc)
			return userIsInstructor(doc)
		},

		update: function (userId, doc, fieldNames, modifier) {
			console.log(doc)
			return userIsInstructor(doc)
		},

		remove: function (userId, doc) {
			console.log(doc)
			return userIsInstructor(doc)
		}
	});
}
*/