Avatars = new Mongo.Collection("Avatars");

// create schema for Courses
var AvatarsSchema = new SimpleSchema({
	name: {
		type: String,
		unique: true
	},
	url: {
		type: String
	},
	createdAt: {
		type: Date,
		label: 'Created At',
		defaultValue: new Date()
	}
})

Avatars.attachSchema(AvatarsSchema)

if (Meteor.isClient) {
}

if (Meteor.isServer) {
	Meteor.publish('Avatars', function () {
		return Avatars.find({})
	})
	Avatars.deny({
		update() { return true },
		remove() { return true }
	})
}
