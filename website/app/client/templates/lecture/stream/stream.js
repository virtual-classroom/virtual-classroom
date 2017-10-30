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
		if (lecture && lecture.displayQuestion) return lecture.displayQuestion
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
	getGroupMembers: function() {
		var user = Meteor.user()
		var group = LectureGroups.findOne({members:user._id,active:true})
		if (group) {
			var members = group.members
			members.splice(members.indexOf(user._id),1)
			return members
		}
	},
	avatarPosition: function(index) {
		if (index % 2 == 0) var x = 1.5*index
		else var x = -1.5*index
		var y = 1.2
		var z = -2
		return x + " " + y + " " + z 
	},
	namePosition: function(index) {
		if (index % 2 == 0) var x = 1.5*index
		else var x = -1.5*index
		var y = 0.6
		var z = -2
		return x + " " + y + " " + z 
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
