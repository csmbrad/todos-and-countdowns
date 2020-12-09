window.onload = function() {
  const registrationForm = document.querySelector("form");

  registrationForm.addEventListener("submit", event => {
    // stop our form submission from refreshing the page
    event.preventDefault();
    //registration is disabled
    return;

    // get dream value and add it to the list
    let uname = registrationForm.elements.username.value;
    let pw = registrationForm.elements.password.value;

    fetch("/register", {
      method: "POST",
      body: JSON.stringify({ username: uname, password: pw }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(function(response) {
        //response from the server is going to have to contain some indication of if the username exists or not?
        // if the username doesn't exist then it's probably safe to just redirect to the main page?
        if (response.result === "success") {
          // user made succesfully, direct to home page
          window.location.replace("/index")
        } else if (response.result === "exists") {
          // username already exists, clear fields... somehow alert?
          alert("Username already exists!");
        } else {
          // idk what happened. clear fields and somehow alert.
          alert("wut");
        }
      });

    // reset form
    registrationForm.reset();
    registrationForm.elements.dream.focus();
  });
};
