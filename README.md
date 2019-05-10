# initize

#Project Stack

Front End
-React
-React Context
-Material UI
-react-sortable-hoc

Backend
-Not sure yet

#Schema For Users : 

id
username
email
phone number (optional)
groups : []
tasks: [object:{groupid, task, dateAdded}]

#Schema For Groups :

id
owner : username of owner
createdAt : date it was created
inviteCode : string (should be changeable);
users : [array of user id's or objects]
numOfUsers : number
mods : [user ids of mods]
groupType: "free", "deluxe", "premium"

#schema for private chats
userId
    otherUserId
        messagecontent
        dateSent
        user:{username, image, id}
