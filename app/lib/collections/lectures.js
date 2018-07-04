Lectures = new Mongo.Collection("Lectures");

var LecturesSchema = new SimpleSchema({
	ownerId: {
		type: String,
		defaultValue: this.userId
	},
	courseTitle: {
		type: String
	},
	courseCode: {
		type: String
	},
	title: {
		type: String
	},
	onlineStudent: {
		type: [String],
		defaultValue: []
	},
	active: {
		type: Boolean,
		defaultValue: false
	},
    available: {
        type: Boolean,
        defaultValue: false
    },
	others: {
		type: String,
		optional: true
	},
	displayQuestion: {
		type: String,
		defaultValue: "",
		optional: true
	},
	mode: {
		type: String,
		defaultValue: 'lecture',
		allowedValues: ['lecture','group']
	},
	groupSize: {
		type: Number,
		defaultValue: 2
	},
	youtube: {
		type: String,
		optional: true
	},
	createdAt: {
		type: Date,
		defaultValue: new Date()
	}
})

Lectures.attachSchema(LecturesSchema)

if (Meteor.isClient) {
}

if (Meteor.isServer) {
	Meteor.publish('Lectures', function(courseCode, title) {
		if (courseCode && title) {
			// return lecture with course code and lecture title
			return Lectures.find({$and: [{title: title}, {courseCode:courseCode}]},{sort: {createdAt:1}})
		} else if (courseCode) {
			// return lectures with course code
			return Lectures.find({courseCode: courseCode},{sort: {createdAt:1}})
		} else {
			// return active lectures
			var user = Meteor.user()
			if (user) {
				// get list of courses that this user has enrolled in
				var courses = Courses.find({
					$or: [
						{students: user._id},
						{instructors: user._id}
					]
				}).fetch()
				// get list of lectures that are currently active
				var lectures = []
				for (var i = 0; i < courses.length; i ++) {
					lectures = lectures.concat(courses[i].lectures)
				}
				return Lectures.find({
					_id: {$in: lectures}
				})
			}
		}
	})
	Lectures.deny({
		update() { return true },
		remove() { return true }
	})
}