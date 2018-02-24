// GraphData = new Meteor.Collection("GraphData");

// GraphData.before.insert(function (userId, doc) {
// 	var date = new Date();
// 	date.setMilliseconds(0);
// 	date.setSeconds(0);
// 	doc.createdAt = date;
// });

// Meteor.methods({
// 	groupGraphData: function (lectureID) {
// 		return GraphData.aggregate([
// 			{ $match: { lecture: lectureID } },
// 			{ $group: 
// 				{
// 					_id: "$createdAt",
// 					clicks: { $sum: 1 }
// 				}
// 			}, { $sort: { _id: 1 } },
// 			{ $project: { x: "$_id", y: "$clicks", _id: 0 } }
// 		]); 
// 	},
// 	removeGraphData: function () {
// 		GraphData.remove({});
// 		return true;
// 	}
// });