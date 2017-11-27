PubNub = new Mongo.Collection("PubNub");

// create schema for Courses
var PubNubSchema = new SimpleSchema({
	publish_key: {
		type: String,
		unique: true
	},
	subscribe_key: {
		type: String,
		unique: true
	}
})

PubNub.attachSchema(PubNubSchema)

if (Meteor.isClient) {
}

if (Meteor.isServer) {
	Meteor.publish('PubNub', function () {
		return PubNub.find({})
	})
	PubNub.deny({
		update() { return true },
		remove() { return true }
	})
}
