/*****************************************************************************/
/* Lectures: Event Handlers */
/*****************************************************************************/
Template.Lectures.events({
	'change .toggle-lecture-active input': function(event) {
		// toggle active and inactive of lecture
		if (event.target.checked) {
			Lectures.update(lecture._id, {
				$set: {status: 'active',breakCount: 0, breakRequests: []}
			});
		} else {
			Lectures.update(lecture._id, {
				$set: {status: 'inactive', breakCount: 0, breakRequests: []}
			});
		}
	},
	'click #lecture-file-upload-trigger': function() {
		$('#lecture-file-upload-modal').openModal()
	},
	'click #lecture-settings-trigger': function() {
		$('#lecture-settings-modal').openModal()
	}
});

/*****************************************************************************/
/* Lectures: Helpers */
/*****************************************************************************/
Template.Lectures.helpers({
	lecture: function() {
		if (Router.current().params.code) {
			//return lecture
			var code = Router.current().params.code
			var lecCode = Router.current().params.lecture
			lecture = Lectures.findOne({$and: [{lectureTitle: lecCode}, {courseCode:code}]})
			return lecture
		}
		
	},
	hasLectureFiles: function() {
		// return if this lecture has any files
		return Files.find({temp:false, lecture: lecture._id}).count() > 0
	},
	lectureFiles: function() {
		// return the list of files that are related to this lecture
		return Files.find({temp:false, lecture: lecture._id})
	},
	isActive: function() {
		// return true is this lecture is active
		lec = Lectures.findOne({'_id': this._id})
		if (lec) {
			return lec.status === 'active'
		}
	},
	numberOfOnlineStudents: function() {
		// return the number of online students
		return Lectures.findOne({_id: lecture._id}).onlineStudents.length
	}
});

/*****************************************************************************/
/* Lectures: Lifecycle Hooks */
/*****************************************************************************/
Template.Lectures.onCreated(function () {
});

Template.Lectures.onRendered(function () {
	// initialize tooltips in this tempplate
	$('#lecture-active-tooltip').tooltip({delay: 50});
	$('#lecture-settings-tooltip').tooltip({delay: 1000});
	
	courseCode = lecture.courseCode
	if (Meteor.user()) {
		// if user is student, increment lecture online student counter 
		var course = Courses.findOne({code: courseCode})
		if (course.students.indexOf(Meteor.userId()) >= 0) {
			if (Lectures.findOne({_id:lecture._id}).onlineStudents.indexOf(Meteor.userId()) < 0) {
				Lectures.update(lecture._id, {
					$push: {onlineStudents: Meteor.userId()}
				})
			}
		}
	}
});

Template.Lectures.onDestroyed(function () {
	if (Meteor.user()) {
		// if user is student, increment lecture online student counter 
		var course = Courses.findOne({code: courseCode})
		if (course.students.indexOf(Meteor.userId()) >= 0) {
			if (Lectures.findOne({_id:lecture._id}).onlineStudents.indexOf(Meteor.userId()) >= 0) {
				Lectures.update(lecture._id, {
					$pull: {onlineStudents: Meteor.userId()}
				})
			}
		}
	}
});
