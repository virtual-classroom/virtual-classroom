/*****************************************************************************/
/* Stream: Event Handlers */
/*****************************************************************************/
Template.Stream.events({
	'click #recorder-modal-trigger': function() {
		$('#recorder-modal').modal('open')
		Session.set('recorder', true)
	}
});

/*****************************************************************************/
/* Stream: Helpers */
/*****************************************************************************/
Template.Stream.helpers({
	recorderIsActive: function() {
		var modal = document.getElementById('recorder-modal')
		if (Session.get('recorder') === true) return "muted"
	},
	getDisplayQuestion: function() {
		var lecture = Lectures.findOne(Session.get('lectureId'))
		if (lecture && lecture.displayQuestion) {
			return "align: center; width: 6; color: #000; value: " + lecture.displayQuestion
		}
	},
	groupMode: function() {
		var lecture = Lectures.findOne(Session.get('lectureId'))
		if (lecture) return lecture.mode === 'group'
	},
	group: function() {
		var user = Meteor.user()
		var group = LectureGroups.findOne({members:user._id,active:true})
		if (group) return group
	},
	avatarPosition: function(index) {
		var x = -1
		var y = 1.2
		var z = -2
		return (x + 1.5*index) + " " + y + " " + z 
	},
	namePosition: function(index) {
		var x = -1
		var y = 1
		var z = -2
		return (x + 1.5*index) + " " + y + " " + z 
	}
});

/*****************************************************************************/
/* Stream: Lifecycle Hooks */
/*****************************************************************************/
Template.Stream.onCreated(function () {
});

Template.Stream.onRendered(function () {
	var courseCode = Router.current().params.code
	var title = Router.current().params.lecture
	var lecture = Lectures.findOne({$and: [{title: title}, {courseCode:courseCode}]})
	Session.set('lectureId', lecture._id)
	Session.set('recorder', false)
	$('#recorder-modal').modal()
	document.documentElement.style.overflow = "hidden"
	document.getElementById('footer').style.display = "none"
	document.getElementById('nav').style.display = "none"
});

Template.Stream.onDestroyed(function () {
	document.documentElement.style.overflow = "auto"
	document.getElementById('footer').style.display = "inherit"
	document.getElementById('nav').style.display = "inherit"
});
