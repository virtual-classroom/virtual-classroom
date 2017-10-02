// Meteor.publish('usersEmail', function() {
// 	return Meteor.users.find({}, {fields: {'emails': 1}});
// });
Meteor.publish('userData', function () {
	return Meteor.users.find({}, {
		fields: {'emails': 1, 'profile': 1}
	})
})

Meteor.publish('courses', function() {
	return Courses.find();
});

Meteor.publish('course', function () {
	return Course.find();
});