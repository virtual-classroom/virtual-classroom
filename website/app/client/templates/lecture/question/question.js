/*****************************************************************************/
/* Question: Event Handlers */
/*****************************************************************************/
Template.Question.events({
	'click .play-button': function() {
		var questionId = this.question
		var player = document.getElementById(questionId)
		if (player.paused) {
			player.play()
			Session.set(questionId, true)
		} else {
			player.pause()
			Session.set(questionId, false)
		}
		player.addEventListener('ended', function() {
			Session.set(questionId, false)
		})
	},
	'click .read-status': function() {
		var question = Audios.findOne(this.question)
		if (!question.meta.read) 
			Meteor.call('readAudioQuestion', this.question, true)
	}
});

/*****************************************************************************/
/* Question: Helpers */
/*****************************************************************************/
Template.Question.helpers({
	question: function() {
		return Audios.findOne(this.question)
	},
	getPercentage: function(value) {
		return value.toFixed(2) * 100 + "%"
	},
	changePlayerIcon: function() {
		// change play icon when recording is playing
		if (Session.get(this.question)) return 'pause'
		else return 'play_arrow'
	}
});

/*****************************************************************************/
/* Question: Lifecycle Hooks */
/*****************************************************************************/
Template.Question.onCreated(function () {
});

Template.Question.onRendered(function () {
	var courseCode = Router.current().params.code
	var title = Router.current().params.lecture
	var lecture = Lectures.findOne({$and: [{title: title}, {courseCode:courseCode}]})
	Session.set('lectureId', lecture._id)
	Session.set(this.question, false)
});

Template.Question.onDestroyed(function () {
});
