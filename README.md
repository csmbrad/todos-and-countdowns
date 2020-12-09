## A Combination To Do List and Countdown Tracker

This site was created as part of a class-long HCI project.

This app provides a to-do list and a countdown timer. You can create to-do list entries 
that contain an estimated time to complete the task. The system will provide an estimate 
of when you can be finished with your to-dos based on these estimates. You can mark items
complete so they do not count towards this time, or edit or delete them. You can also 
create countdowns that count down to a specific time of day, then reset. These countdowns
automatically update their remaining time and visual representation every second. You can
edit and delete countdowns.

The site is availiable for people with the test account and is hosted at [this Glitch page](https://daffy-brief-lynx.glitch.me).

**Running this site:**

The easiest way to run this site is to create an account over at [Glitch](glitch.com) and 
import a copy of this repository. You can also remix [this Glitch project](https://glitch.com/edit/#!/daffy-brief-lynx).
Either way, you will still have to set the environment variables listed below.
To run this project manually, you need to do the following:

1. Configure a MongoDB cluster, and change Line 15 of server.js to match your cluster
2. Set the following environment variables:
   - `DBPASSWORD`, the password to your database
   - `DBACC`, the username to your database
   - `PORT`, the port on which the server will listen for requests.
3. Install Node and install all dependencies listed in package.json. This can be easily done using a script called [NPM Install Missing](https://www.npmjs.com/package/npm-install-missing).

**Some Notes on Useability, Issues, and Future Work**

This project is still a work in progress, things like the Edit functionality using the same
form as the Add functionality are known drawbacks and are not ideal. In testing, a few 
useability issues came up too late to be fixed before the project deadline. These include
issues with having multiple to-dos with the same name, which can be fixed by updating the 
to-do code (which was made early in the project) to use indexes like the countdowns do. 
There is also no cancel edit button. The countdowns being linear doesn't really make that 
much sense, and they are even less responsive to window size than the rest of the site. 
Idealy, they would be circular to more resemble a clock and be more intuitive. The help page 
is also just text, with no images, which is not  ideal. The site is also very much in a pre-
production state, using the in-browser Babel transformer and including React as a whole in 
the HTML, and using one single component for everything. In the future, I would like to 
separate the individual components, tidy up the code, and use tools to build and minify 
the separate files into one lighter, deployable site while being easier to work on.
