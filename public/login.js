window.onload = function() {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", event => {
    // stop our form submission from refreshing the page
    event.preventDefault();

    // get dream value and add it to the list
    let uname = loginForm.elements.username.value;
    let pw = loginForm.elements.password.value;

    fetch("/login", {
      method: "POST",
      body: JSON.stringify({ username: uname, password: pw }),
      redirect: 'follow',
      headers: {
        
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(function(response) {
        //response from the server is going to have to contain some indication of if the username exists or not?
        // if the username doesn't exist then it's probably safe to just redirect to the main page?
       
        if (response.result === "pass") {
          // user made succesfully, direct to home page
          //window.location.replace("/index")
          //this feels jank af but my redirect didnt work
          window.location = '/index'
        } else if (response.result === "fail") {
          // username already exists, clear fields... somehow alert?
          alert("Incorrect username and/or password!");
        } else {
          // idk what happened. clear fields and somehow alert.
          alert("wut");
        }
      });

    // reset form
    loginForm.reset();
    loginForm.elements.dream.focus();
  });
};
