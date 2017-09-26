/*****************************************************************************/
/* Instructor: Event Handlers */
/*****************************************************************************/
Template.Instructor.events({
	'click #removeCourse': function() {
		// store the course code and course ID in session
		Session.set('remove_course_code', this.code)
		Session.set('remove_course_id', this._id)
		$('#confirm-remove-course').openModal()
	},
	'click #confirm-remove': function() {
		var code = Session.get('remove_course_code')
		console.log("Removing course " + code)
		var course = Courses.findOne({'code':code})
		if (course) {
			Courses.update(Session.get('remove_course_id') , {
				$set: {
					'status':'inactive'
				} 
			}, function(error) {
				if (error) {
					console.log(error)
				} else {
					$('#confirm-remove-course').closeModal()
					Materialize.toast('Course ' + Session.get('remove_course_code') + ' has been removed', 4000)
				}
			})
		}
	},
	'click #confirm-cancel':function() {
		$('#confirm-remove-course').closeModal();
	}
});

/*****************************************************************************/
/* Instructor: Helpers */
/*****************************************************************************/
Template.Instructor.helpers({
	coursesAvailable: function() {
		var courses = Courses.find({
			'students': { $not : Meteor.userId() },
			'status': 'active'
		}, {sort: {'code':1}})
		return courses.count() > 0
	},
	courses: function() {
		// search through Courses, if search_code is given
		var search_code = Session.get('search_code')
		// not case sensative
		var regex = new RegExp(search_code, 'i')
		if (search_code == "") {
			return Courses.find({'status': 'active'}, {sort: {'code':1}})
		} else {
			return Courses.find({
				'code': {$regex: regex},
				'status': 'active'
			}, {sort: {'code':1}})
		}
	},
	remove_course_code: function() {
		return Session.get('remove_course_code')
	}
});

/*****************************************************************************/
/* Instructor: Lifecycle Hooks */
/*****************************************************************************/
Template.Instructor.onCreated(function () {
});

Template.Instructor.onRendered(function () {
	// initialize tooltip
	$('#class-size-tooltip').tooltip({delay: 50})
});

Template.Instructor.onDestroyed(function () {
});
