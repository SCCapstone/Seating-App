# Capstone Seating App

MEAN Stack Seating App

## Frameworks
Angular CLI `v6.0.0` <br>
Express `v4.16.3` <br>
Mongoose `v5.1.2` <br>
RXJS `v6.0.0` <br>

## Initial Install

Clone the repo. <br>
Run `npm install` to install dependencies. <br>
Run `npm run start:server` to start backend and connect to DB. <br>
Run `ng serve -o` to start Angular and open locally. <br>

Set up MongoDB and connect backend to it.

## MongoDB

Go to https://cloud.mongodb.com and set up an account. <br>
Open a free cluster, select all free settings (don't have to change anything). <br>

Under the header of your new cluster you will see a `Overview` and `Security` tab, click on the `Security` tab. <br>
> Under MongoDB Users, click `Add new User` and pick any name and password, but remember these. <br>
>> Under `User Privileges` click `Read and Write to any database` and save user.

Go back to your cluster and click `Connect`. <br>
Under `Choose a connection method:` choose `Connect Your Application`. <br>
> Select `SRV connection string (3.6+ driver)` and copy the text. <br>
Put this text in the `App.js` file when `mongoose.connect` is called. <br>
> Make sure the name and password without the `<``>` are from the User you created. <br>

# Source Control Milestone Section

This is a location where we can all practice committing and pushing changes to github without affecting our actual code.

### Dalton Rothenberger was Here
### Brett Taylor enters the fight

This is an unordered list. Anyone want to put it in the right order? (No using the in browser editor!)

I ordered your list Dalton.
- January
- February
- March
- April
- May
- June
- July
- August
- September
- October
- November
- December

This line was written in a new branch.

So was this line.
<<<<<<< HEAD
New branch linee
=======

This is a line edited in the master branch. I created it to cause a merge conflict with my side branch.

Oh look, another line written!
>>>>>>> master
