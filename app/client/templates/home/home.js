/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
	background_image: function() {
		// randomly return a background image
		var backgroundImages = ['background1.jpg', 'background2.jpg', 'background3.jpg', 'background4.jpg', 'background5.jpg']
		var i = Math.floor(Math.random() * backgroundImages.length)
		return backgroundImages[i]
	}
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.onCreated(function () {
});

Template.Home.onRendered(function () {
	$(document).ready(function(){
		$('.parallax').parallax();
	})
});

Template.Home.onDestroyed(function () {
});
