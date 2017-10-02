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
	createdAt: {
		type: Date,
		defaultValue: new Date()
	}
})

Lectures.attachSchema(LecturesSchema)

if (Meteor.isClient) {
}

if (Meteor.isServer) {
	Meteor.publish('Lectures', function () {
		return Lectures.find({})
	})
	Lectures.deny({
		update() { return true },
		remove() { return true }
	})
}