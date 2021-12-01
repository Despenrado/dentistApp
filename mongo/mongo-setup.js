rsconf = {
    _id : "rsmongo",
    members: [
        {
            "_id": 0,
            "host": "mongodb1:27017",
            "priority": 4,
            "votes" : 1
        },
        {
            "_id": 1,
            "host": "mongodb2:27017",
            "priority": 2,
            "votes" : 1
        },
        {
            "_id": 2,
            "host": "mongodb3:27017",
            "priority": 1,
            "votes" : 1
        }
    ],
    "settings" : {
		"chainingAllowed" : true,
		"electionTimeoutMillis" : 10000,
		"catchUpTimeoutMillis" : 60000,
	}
}
rs.initiate(rsconf);
// rs.secondaryOk();
// 