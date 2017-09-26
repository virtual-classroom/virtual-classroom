Template.MasterLayout.helpers({
	onCoursePage: function() {
		// if user is on a course page, return the course code
		if (Router.current().params.code) {
			return Router.current().params.code
		}
	},
	onLecturePage: function() {
		// if user is on a lecture page, return the lecture name
		if (Router.current().params.lecture) {
			return Router.current().params.lecture
		}
	}
});

Template.MasterLayout.events({
	'click #login-model-trigger': function() {
		$('#login-modal').openModal()
	},
	'click #register-model-trigger': function() {
		$('#register-modal').openModal()
	},
	'click #logout': function(event){
		event.preventDefault();
		Meteor.logout();
		Router.go('/');
	}
});

Template.MasterLayout.onRendered(function() {
	// initialize dropdown menu
	$("#dropdown-button").dropdown();
	$("#dropdown-button").dropdown();
});
