/*****************************************************************************/
/* GroupContent: Event Handlers */
/*****************************************************************************/
Template.GroupContent.events({
	'click .enter-group-discussion': function() {
		Session.set('groupId', this.groupId)
	}
});

/*****************************************************************************/
/* GroupContent: Helpers */
/*****************************************************************************/
Template.GroupContent.helpers({
	group: function() {
		var group = Groups.findOne(this.groupId)
		if (group) return group
	},
	getGroupDiscussion: function() {
		var group = Groups.findOne(this.groupId)
		if (group) return group.discussion
	}
});

/*****************************************************************************/
/* GroupContent: Lifecycle Hooks */
/*****************************************************************************/
Template.GroupContent.onCreated(function () {
});

Template.GroupContent.onRendered(function () {
});

Template.GroupContent.onDestroyed(function () {
});
