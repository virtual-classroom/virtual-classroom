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

var avatars = ['1F602.svg', '1F606.svg', '1F610.svg', '1F611.svg', '1F626.svg', '1F634.svg', '1F642.svg', '1F913.svg']
_.map(avatars, function(avatarName) {
	var avatar = Avatars.findOne({name: avatarName})
	if (!avatar) {
		Avatars.insert({
			name: avatarName,
			url : 'avatars/' + avatarName
		}, function(error) {
			if (error) console.log(error)
		})
	}
})

var users = Meteor.users.find().fetch()
_.map(users, function(user) {
	var avatar = Avatars.findOne({name: '1F642.svg'})
	if (avatar) Meteor.users.update(user._id, {$set: {'profile.picture': avatar._id}})
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