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
			return Lectures.find({$and: [{title: title}, {courseCode:courseCode}]},{sort: {createdAt:1}})
		} else if (courseCode) {
			return Lectures.find({courseCode: courseCode},{sort: {createdAt:1}})
		}
	})
	Lectures.deny({
		update() { return true },
		remove() { return true }
	})
}