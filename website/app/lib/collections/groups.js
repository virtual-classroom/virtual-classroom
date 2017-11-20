Groups = new Mongo.Collection("Groups");

// create schema for Courses
var GroupsSchema = new SimpleSchema({
	lectureId: {
		type: String,
		optional: true
	},
	courseId: {
		type: String
	},
	creator: {
		type: String
	},
	leader: {
		type: String
	},
	name: {
		type: String,
		label: 'Group name'
	},
	default: {
		type: Boolean,
		defaultValue: false
	},
	active: {
		type: Boolean,
		defaultValue: false
	},
	members: {
		type: [String],
		label: 'List of Students'
	},
	discussion: {
		type: String,
		optional: true
	},
	createdAt: {
		type: Date,
		label: 'Created At',
		defaultValue: new Date()
	}
})

Groups.attachSchema(GroupsSchema)

if (Meteor.isClient) {
}

if (Meteor.isServer) {
	Meteor.publish('Groups', function(courseCode, lectureId) {
		// return default groups if it is in course page, return active group if 
		// it is in lecture page
		var user = Meteor.user()
		if (user && courseCode) {
			var user = Meteor.user()
			var course = Courses.findOne({code: courseCode})
			var isInstructor = course.instructors.indexOf(user._id) >= 0
			var isStudent = course.students.indexOf(user._id) >= 0
			if (course) {
				if (lectureId) {
					// user in lecture page
					if (isInstructor) {
						return Groups.find({
							lectureId:lectureId
						}, {sort: {active:-1,name:1}})
					} else if (isStudent) {
						return Groups.find({
							lectureId:lectureId,
							members:user._id,
							active:true
						}, {sort: {name:1}})
					}
				} else {
					// user is course page
					return Groups.find({
						courseId: course._id,
						default: true
					}, {sort: {name:1}})
				}
				
			}
		}
	})
	Courses.deny({
		update() { return true },
		remove() { return true }
	})
}
