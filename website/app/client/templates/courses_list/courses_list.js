/*****************************************************************************/
/* CoursesList: Event Handlers */
/*****************************************************************************/
Template.CoursesList.events({
});

/*****************************************************************************/
/* CoursesList: Helpers */
/*****************************************************************************/
Template.CoursesList.helpers({
	courses: function() {
		// search through Courses, if search_code is given
		var search_code = Session.get('search_code')
		// not case sensative
		var regex = new RegExp(search_code, 'i')
		if (search_code == "") {
			return Courses.find()
		} else {
			return Courses.find({
				'code': {$regex: regex}
			}, {sort: {'code':1}})
		}
	}
});

/*****************************************************************************/
/* CoursesList: Lifecycle Hooks */
/*****************************************************************************/
Template.CoursesList.onCreated(function () {
});

Template.CoursesList.onRendered(function () {
});

Template.CoursesList.onDestroyed(function () {
});
