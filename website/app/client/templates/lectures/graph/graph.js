GraphData = new Meteor.Collection("GraphData")
// set the timer for 30 seconds between button clicks
var buttonClickCountDown = new ReactiveCountdown(30)
// notification for instructor can only happens every 10 minutes
var instructorTimer = 600
var instructorNotification = new ReactiveCountdown(instructorTimer)

/*****************************************************************************/
/* Graph: Event Handlers */
/*****************************************************************************/

Template.Graph.events({
	'click #confusedButton': function() {
		if (!Session.get("justClicked")) {
			GraphData.insert({lecture: lecture._id})
			Materialize.toast('Confusion noted!', 4000)
			// set the just clicked boolean to true
			Session.set("justClicked", true)
			// start count down timer
			buttonClickCountDown.start()
		}
	},
	'click #resetDataButton': function() {
		Meteor.call('removeGraphData',function(error, response) {
			if (error) console.log(error, response);
		});
	},
	'click #breakButton': function() {
		if (!Session.get("breakRequestSent")) {
			// increment the breaks counter and add the user to list
			Lectures.update(lecture._id, {
				$inc: {breakCount: 1}, $push: {breakRequests: Meteor.userId()}
			})
			Session.set("breakRequestSent", true)
			Materialize.toast('Break request sent!', 4000)
		}
	},
	'click #resetBreakButton': function() {
		Lectures.update(lecture._id, {
			$set: {breakCount: 0, breakRequests: []}
		});
	}
});

Template.Graph.rendered = function() {
	var user = Meteor.user()
	if (user) {
		if (user.profile.accountType === 'instructor' || user.roles === 'admin') {
			
			var chart = nv.models.lineChart()
				.margin({left: 100})  			//Adjust chart margins to give the x-axis some breathing room.
				.useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
				.transitionDuration(1000)  		//how fast do you want the lines to transition?
				.showLegend(true)       		//Show the legend, allowing users to turn on/off line series.
				.showYAxis(true)        		//Show the y-axis
				.showXAxis(true)        		//Show the x-axis
				.interpolate("cardinal"); 		//Smooth lines 


			nv.addGraph(function() {
				chart.xAxis.axisLabel('Time').tickFormat(function(d) {
					return d3.time.format('%H:%M:%S')(new Date(d))
				});
				chart.forceY(0);
				chart.yAxis.axisLabel('# of Confused Students').tickFormat(d3.format('d'))
				d3.select('#chart svg').datum([{
					values: GraphData.find().fetch(),
					key: '# of Confused Students'
				}]).call(chart)
				nv.utils.windowResize(function() { chart.update() })
				return chart
			});

			this.autorun(function () {
				GraphData.find().fetch() // Note: Here to make graph reactive to data changes,
										 //       since aggregated data function calls reactivity
										 //       is not supported in Meteor
				Meteor.call('groupGraphData', lecture._id, function (err, response) {
					d3.select('#chart svg').datum([{
						values: response,
						key: '# of Confused Students'
					}]).call(chart)
					chart.update()
				})
				// algorithm to create notification for instructor
				if (instructorNotification.get() <= 0) {
					// this check if instructor notification counter has been initialized or if the counter has drop to 0
					// if so, check the number of confusion
					instructorNotification.stop()
					checkNumberOfConfusion()
				}
				function checkNumberOfConfusion() {
					// get the data entry that is within 5 minutes 
					var number = GraphData.find({
						lecture: lecture._id,
						createdAt: {
							$gt: new Date(new Date().getTime() - 1000*60*5)
						}
					})
					if (Notification.permission == "default") {
						Notification.requestPermission()
					}
					if (number.count() >= lecture.threshold) {
						console.log(number.count() + " students are confused")
						// notify instructor if there is more than threshold students are confused
						new Notification("Stop!", {
							body:"Students are confused!",
							icon:"/icons/stop.png"
						})
						instructorNotification.start()
					}
				}
			});
		}
	}
};

/*****************************************************************************/
/* Graph: Helpers */
/*****************************************************************************/
Template.Graph.helpers({
	lecture: function() {
		//return lecture
		var code = Router.current().params.code
		var lecCode = Router.current().params.lecture
		lecture = Lectures.findOne({
			$and:[{lectureTitle: lecCode}, {courseCode:code}]
		});
		return lecture
	},
	graphHasDataOrActive: function() {
		// return true if this lecture has data for graph or if its active
		lec = Lectures.findOne({'_id': lecture._id})
		if (lec) {
			return (lec.status === 'active') || (GraphData.find({lecture:lecture._id}).count() > 0)
		}
	},
	justClicked: function() {
		// return true if the button has just been clicked
		return Session.get("justClicked")
	},
	timeLeft: function() {
		// return the seconds left
		if (buttonClickCountDown.get() <= 0) {
			// if countdown timer gets to zero
			// stop the timer and reset the boolean for just clicked
			buttonClickCountDown.stop()
			Session.set("justClicked", false)
		}
		return buttonClickCountDown.get()
	},
	hasRequested: function() {
		// check user hasn't already requested a break
		var hasRequested = lecture.breakRequests.indexOf(Meteor.user()._id) > -1
		Session.set("breakRequestSent", hasRequested)
		return hasRequested
	}
});

/*****************************************************************************/
/* Graph: Lifecycle Hooks */
/*****************************************************************************/
Template.Graph.onCreated(function () {
	
});

Template.Graph.onRendered(function () {
	// initialize the just click Session as false
	Session.set("justClicked", false)
	var user = Meteor.user()
	if (user) {
		// only run notification center if user is instructor
		if (user.profile.accountType === 'instructor' || user.roles == 'admin') {
			// request for HTML5 notification permission
			if (Notification.permission == "default") {
				Notification.requestPermission()
			}
			// initialize counter
			instructorNotification.start()
			instructorNotification.stop()
			instructorNotification.remove(instructorTimer)
		}
	}
});

Template.Graph.onDestroyed(function () {

});
