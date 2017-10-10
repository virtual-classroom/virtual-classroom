/*****************************************************************************/
/* DisplayRecordings: Event Handlers */
/*****************************************************************************/
Template.DisplayRecordings.events({
	'click .play-button': function() {
		console.log(Session.get('url'))
		if (Session.get('url')) {
			recording = new Audio(Session.get('url'))
			recording.play()
		}
	}
});

/*****************************************************************************/
/* DisplayRecordings: Helpers */
/*****************************************************************************/
Template.DisplayRecordings.helpers({
	question: function() {
		return Questions.findOne(this.question)
	},
	getPercentage: function(value) {
		return value.toFixed(2) * 100 + "%"
	},
	storeURL: function(url) {
		console.log(url)
		Session.set('url', url)
	}
});

/*****************************************************************************/
/* DisplayRecordings: Lifecycle Hooks */
/*****************************************************************************/
Template.DisplayRecordings.onCreated(function () {
});

Template.DisplayRecordings.onRendered(function () {
	var courseCode = Router.current().params.code
	var title = Router.current().params.lecture
	var lecture = Lectures.findOne({$and: [{title: title}, {courseCode:courseCode}]})
	Session.set('lectureId', lecture._id)
});

Template.DisplayRecordings.onDestroyed(function () {
});
