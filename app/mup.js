module.exports = {
	servers: {
		one: {
			// TODO: set host address, username, and authentication method
			host: '165.227.44.8',
			username: 'root',
			pem: '~/.ssh/id_rsa.pub'
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
			ROOT_URL: 'https://vr.bryanli.io',
			MONGO_URL: 'mongodb://localhost/meteor',
		},

		ssl: { // (optional)
		// Enables let's encrypt (optional)
			autogenerate: {
				email: 'bryan@bryanli.io',
				// comma separated list of domains
				domains: 'vr.bryanli.io,www.vr.bryanli.io'
			}
		},

		docker: {
			// change to 'kadirahq/meteord' if your app is using Meteor 1.3 or older
			//image: 'abernix/meteord:base',
			image: 'abernix/meteord:node-8.4.0-base',
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
