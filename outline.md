**The general idea:**
- Insert the data into list items, just like the basic site
- Each user has their own doccument, with their entries represented as an array? seems easy if mongodb can handle that.

**Structure:** 
- Main page:
  - Entry form
  - List
  - Link to logout?
  - redirects people to login if they're not logged in (use cookies to tell?)
  - Grabs the existing data for a logged in user and puts it in the list
  - deletion/editing/adding of list items
- Login page:
  - form to enter username or password
  - link to register page
  - some method of reporting that you failed to log in? or just redirect back to login page lol thats easier ig
- Register page: 
  - form for username and password
  - needs to have some way to tell you the account already exists
  
**TODO Next:**
- ~~Finish registration function, sending back a token to report error for user existing~~ DONE
- ~~If the user doesnt exist, registration creates a doc for them and sends the user to the main page~~ DONE
- ~~Registration page responds to the "result" field of the returned json~~ DONE
- ~~Main page detects if people are logged in or not, sends to login if not (using cookies?)~~ DONE
- ~~Login page needs to check things~~ DONE
  - ~~Grab uname, pw, send to server~~ DONE
- ~~Server responds to login page with a sucess or fail~~ DONE
  - ~~on fail, login page continues~~ DONE
  - ~~on success, login pages sends you back to the main page~~ DONE
- ~~convert data storage to store in people's docs rather than each entry being its own doc~~ DONE
  - ~~Deleting needs to look through the array in peoples doc~~ DONE
  - ~~Editing needs to do the same~~ DONE
- ~~CSS Framework and manual styling~~ DONE