// add these users with these emails address as admin
var admin = ['mybryan.li@mail.utoronto.ca', 'cecilia.lo@mail.utoronto.ca', 'hristina.iordanova@mail.utoronto.ca', 'adamo.carolli@mail.utoronto.ca'];
_.map(admin, function(email) {
	var user = Accounts.findUserByEmail(email)
	if(user) {
		if (user.roles != 'admin') {
			Meteor.users.update({_id:user._id}, {$set: {roles:'admin'}})
		}
	}
})

// initialize SEO for each page
SeoCollection.update(
	{
		route_name:"home"
	}, {
		$set: {
			route_name : "home",
			title : "Virtual Class",
			meta: {
				"description": "Utilize affordable 360 cameras and VR headset like Google Cardboard to create a virtual environment"
			},
			og: {
				"title":"Virtual Class",
				"description": "Utilize affordable 360 cameras and VR headset like Google Cardboard to create a virtual environment",
				"type":"website",
				"url":"http://rtmp.bryanli.xyz",
				"site_name":"Virtual Class",
				"image":"icons/cardboard.png",
				"image:type":"image/png",
				"image:width":"1000",
				"image:height":"1000",
				"locale":"en_US"
			}
		}
	}, {
		upsert:true
	}
);

SeoCollection.update(
	{
		route_name:"createNewCourse"
	}, {
		$set: {
			route_name : "createNewCourse",
			title : "Create Course | Virtual Class",
			meta: {
				"description": "Utilize affordable 360 cameras and VR headset like Google Cardboard to create a virtual environment"
			}
		}
	}, {
		upsert:true
	}
);

SeoCollection.update(
	{
		route_name:"settings"
	}, {
		$set: {
			route_name : "settings",
			title : "Settings | Virtual Class",
			meta: {
				"description": "Utilize affordable 360 cameras and VR headset like Google Cardboard to create a virtual environment"
			}
		}
	}, {
		upsert:true
	}
);

SeoCollection.update(
	{
		route_name:"coursesList"
	}, {
		$set: {
			route_name : "coursesList",
			title : "Courses | Virtual Class",
			meta: {
				"description": "Utilize affordable 360 cameras and VR headset like Google Cardboard to create a virtual environment"
			}
		}
	}, {
		upsert:true
	}
);