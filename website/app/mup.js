module.exports = {
	servers: {
		one: {
			// TODO: set host address, username, and authentication method
			host: '165.227.44.8',
			username: 'root',
			password: "icfHKi11!"
			// pem: './path/to/pem'
			// password: 'server-password'
			// or neither for authenticate from ssh-agent
		}
	},

	app: {
		// TODO: change app name and path
		name: 'vr',
		path: '../app',

		servers: {
			one: {},
		},

		buildOptions: {
			serverOnly: true,
		},

		env: {
			// TODO: Change to your app's url
			// If you are using ssl, it needs to start with https://
			ROOT_URL: 'https://vr.bryanli.xyz',
			MONGO_URL: 'mongodb://localhost/meteor',
		},

		ssl: { // (optional)
		// Enables let's encrypt (optional)
			autogenerate: {
				email: 'bryan@bryanli.xyz',
				// comma separated list of domains
				domains: 'vr.bryanli.xyz,www.vr.bryanli.xyz'
			}
		},

		docker: {
			// change to 'kadirahq/meteord' if your app is using Meteor 1.3 or older
			image: 'abernix/meteord:base',
		},

		// Show progress bar while uploading bundle to server
		// You might need to disable it on CI servers
		enableUploadProgressBar: true,
		deployCheckWaitTime: 240
	},

	mongo: {
		version: '3.4.1',
		servers: {
			one: {}
		}
	}
};
