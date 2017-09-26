Meteor.publish('usersEmail', function() {
	return Meteor.users.find({}, {fields: {'emails': 1}});
});

Meteor.publish('courses', function() {
	return Courses.find();
});

Meteor.publish('course', function () {
	return Course.find();
});