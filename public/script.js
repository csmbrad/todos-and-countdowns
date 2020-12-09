// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");
//import React from "react";
//import ReactDOM from "react-dom";

class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dreamText: "",
      dreamLength: 0.5,
      dreams: [],
      dreamLengths: [],
      dreamCompletion: [],
      originalDream: "",
      originalTime: 0.5,
      editMode: false,
      cdEditMode: false,
      cdText: "",
      cdHour: 0,
      cdMinute: 0,
      cdNames: [],
      cdTimes: [],
      currTime: new Date(),
      cdEditingIndex: -1
    };

    //https://reactjs.org/docs/faq-functions.html
    //make things nice by binding functions we'll need in the constructor
    this.addDream = this.addDream.bind(this);
    this.editDream = this.editDream.bind(this);
    this.deleteDream = this.deleteDream.bind(this);
    this.getDreams = this.getDreams.bind(this);
    this.addDreamToArray = this.addDreamToArray.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.calculateTimes = this.calculateTimes.bind(this);
    this.calculateDoneTime = this.calculateDoneTime.bind(this);
    this.addCountdown = this.addCountdown.bind(this);
    this.editCountdown = this.editCountdown.bind(this);
    this.deleteCountdown = this.deleteCountdown.bind(this);
    this.addCountdownToArray = this.addCountdownToArray.bind(this);
    this.getMinutesFromMillis = this.getMinutesFromMillis.bind(this);
    this.getHoursFromMillis = this.getHoursFromMillis.bind(this);
    this.formatResetTime = this.formatResetTime.bind(this);
    this.calculateRemainingTime = this.calculateRemainingTime.bind(this);
    this.formatRemainingTime = this.formatRemainingTime.bind(this);
  }

  addDream(e) {
    e.preventDefault();
    if (!this.state.editMode) {
      if (
        this.state.dreamText == "" ||
        this.state.dreamText == null ||
        this.state.dreamText == undefined
      ) {
        alert("Please enter a valid title.");
        return;
      }
      if (this.state.dreamLength % 0.5 != 0) {
        alert("Please only enter times that are multiples of 0.5.");
        return;
      }
      var dreamJSON = {
        dream: this.state.dreamText,
        time: this.state.dreamLength.toString()
      };
      var body = JSON.stringify(dreamJSON);
      fetch("/add", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          this.addDreamToArray(json.dream, json.time.toString());
        });

      this.setState({ dreamText: "", dreamLength: 0.5 });
    } else if (this.state.editMode) {
      var newDream = this.state.dreamText;
      var newTime = this.state.dreamLength.toString();
      if (
        this.state.dreamText == "" ||
        this.state.dreamText == null ||
        this.state.dreamText == undefined
      ) {
        alert("Please enter a valid title.");
        return;
      }
      if (this.state.dreamLength % 0.5 != 0) {
        alert("Please only enter times that are multiples of 0.5.");
        return;
      }
      if (
        newDream != null &&
        newDream != undefined &&
        newDream != "" &&
        newTime != null &&
        newTime != undefined &&
        newTime != ""
      ) {
        //send the string over
        var result = {
          oldText: this.state.originalDream,
          newText: newDream,
          time: newTime
        };
        fetch("/edit", {
          method: "POST",
          body: JSON.stringify(result),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(dreams => {
            const editedDreamList = this.state.dreams.map(dream => {
              // if this task has the same ID as the edited task
              if (dream === this.state.originalDream) {
                //
                return newDream;
              }
              return dream;
            });
            const editedTimeList = this.state.dreamLengths.map(length => {
              // if this task has the same ID as the edited task
              if (length === this.state.originalTime) {
                //
                return newTime;
              }
              return length;
            });
            this.setState({
              dreams: editedDreamList,
              dreamLengths: editedTimeList,
              dreamText: "",
              dreamLength: 0.5,
              editMode: false,
              originalDream: ""
            });
            /*var index = this.state.dreams.findIndex(oldDream);
          var newState = this.state.dreams;
          newState[index] = newDream;
          this.setState({ dreams: newState });*/
          });
      }
    }
  }

  editDream(e) {
    e.preventDefault();
    var startOfTime = e.target.getAttribute("id").indexOf("^") + 1;
    var endOfTime = e.target.getAttribute("id").indexOf("*");
    var oldDream = e.target.getAttribute("id").substring(endOfTime + 1);
    var oldTime = e.target
      .getAttribute("id")
      .substring(startOfTime, endOfTime)
      .toString();
    this.setState({
      originalDream: oldDream,
      originalTime: oldTime,
      editMode: true,
      dreamText: oldDream,
      dreamLength: oldTime
    });
    var elmnt = document.getElementById("dreamForm");
    elmnt.scrollIntoView();
    // var oldTime = TODO: identify time somehow
  }

  deleteDream(e) {
    e.preventDefault();
    var oldDream = e.target
      .getAttribute("id")
      .substring(e.target.getAttribute("id").indexOf("*") + 1);
    if (confirm("Are you sure you want to delete your todo?")) {
      fetch("/delete", {
        method: "POST",
        body: JSON.stringify({ dream: oldDream }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          var index = this.state.dreams.indexOf(oldDream);
          var filtered = this.state.dreams.filter(function(e) {
            return e !== oldDream;
          });
          var newComplete = this.state.dreamCompletion;
          newComplete.splice(index, 1);
          var newTimes = this.state.dreamLengths;
          newTimes.splice(index, 1);
          this.setState({
            dreams: filtered,
            dreamLengths: newTimes,
            dreamCompletion: newComplete
          });
        });
    }
  }

  toggleComplete(e) {
    e.preventDefault();
    var endOfTime = e.target.getAttribute("id").indexOf("*");
    var updateDream = e.target.getAttribute("id").substring(endOfTime + 1);
    fetch("/complete", {
      method: "POST",
      body: JSON.stringify({ dream: updateDream }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        // find the index of the desired dream
        // set the value of that index in the completed array to what you recieved
        // update the state with the array as changed.
        var completed = json.completedVar,
          index = this.state.dreams.indexOf(json.dream),
          list = this.state.dreamCompletion;
        //console.log(completed);
        list[index] = completed.toString();
        this.setState({ dreamCompletion: list });
      });
  }

  calculateTimes() {
    var size = this.state.dreams.length;
    //console.log("Size: " + size);
    var finalCount = 0;
    if (size > 0) {
      for (var i = 0; i < size; i++) {
        /*console.log(
          "complete state of " +
            i +
            " : " +
            this.state.dreamCompletion[i].toString()
        );*/
        if (this.state.dreamCompletion[i].toString() === "false") {
          //add the dream's time to the count
          /*console.log(
            "Int: " + parseFloat(this.state.dreamLengths[i].toString())
          );*/
          finalCount += parseFloat(this.state.dreamLengths[i]);
        }
      }
    }

    return finalCount;
  }
  calculateDoneTime() {
    var timeTaken = this.calculateTimes(),
      d = new Date();
    var minutes = d.getMinutes(),
      hours = d.getHours();
    if (timeTaken - Math.floor(timeTaken) !== 0) {
      //there is half an hour to be added
      minutes += 30;
    }
    hours += Math.floor(timeTaken);
    if (minutes >= 60) {
      hours += 1;
      minutes = "00";
    }
    if (minutes < 10) {
      minutes = "0" + minutes.toString();
    }
    if (minutes == 0) {
      minutes = "00";
    }
    //handle warpping around from 23
    if (hours > 23) {
      hours = hours - 23;
    }
    if (hours < 10) {
      hours = "0" + hours.toString();
    }
    //console.log(hours + " : " + minutes);
    return hours + ":" + minutes.toString();
  }

  getDreams() {
    //fetches from /dreams
    //puts everything from the array it gets into the this.state.dreams[] array
    //basically the old start function but with some minor changes
    fetch("/dreams")
      .then(response => response.json()) // parse the JSON from the server
      .then(json => {
        var dreamsArr = json.list;
        var timesArr = json.times;
        var completeArr = json.complete;
        var cdNamesArr = json.cdNames;
        var cdTimesArr = json.cdTimes;
        this.setState({
          dreams: dreamsArr,
          dreamLengths: timesArr,
          dreamCompletion: completeArr,
          cdNames: cdNamesArr,
          cdTimes: cdTimesArr
        });
        //dreams.forEach(appendNewDream);
        console.log(dreamsArr);
        console.log(timesArr);
        console.log(completeArr);
        console.log(cdNamesArr);
        console.log(cdTimesArr);
      });
  }

  addDreamToArray(aDream, aTime) {
    this.setState(state => {
      // Important: read `state` instead of `this.state` when updating.
      var dreams2 = state.dreams;
      dreams2.push(aDream);
      var times2 = state.dreamLengths;
      times2.push(aTime);
      var completeds2 = state.dreamCompletion;
      completeds2.push("false");
      return {
        dreams: dreams2,
        dreamLengths: times2,
        dreamCompletion: completeds2
      };
    });
  }

  addCountdownToArray(cdTitle, cdTime) {
    this.setState(state => {
      var cdNames2 = state.cdNames;
      cdNames2.push(cdTitle);
      var cdTimes2 = state.cdTimes;
      cdTimes2.push(cdTime);
      return {
        cdNames: cdNames2,
        cdTimes: cdTimes2
      };
    });
  }

  addCountdown(e, index) {
    e.preventDefault();
    if (!this.state.cdEditMode) {
      //get the title
      var title = this.state.cdText;
      if (title == "" || title == null || title == "undefined") {
        alert("Please enter a valid title.");
        return;
      }
      if (
        (this.state.cdHour % 1 != 0) ||
        (this.state.cdMinute % 1 != 0)
      ) {
        alert("Please only enter whole number times.");
        return;
      }
      //compute the time in ms from the start of the day
      var secondInMs = 1000;
      var minuteInMs = secondInMs * 60;
      var hourInMs = minuteInMs * 60;
      var time =
        this.state.cdHour * hourInMs + this.state.cdMinute * minuteInMs;
      var cdJson = {
        cdName: title,
        cdTime: time
      };
      var body = JSON.stringify(cdJson);
      fetch("/addCd", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          this.addCountdownToArray(json.cdName, json.cdTime);
        });

      this.setState({ cdText: "", cdHour: 0, cdMinute: 0 });
    } else if (this.state.cdEditMode) {
      //make sure the title is valid
      var title = this.state.cdText;
      if (title == "" || title == null || title == "undefined") {
        alert("Please enter a valid title.");
        return;
      }
      if (
        (this.state.cdHour % 1 != 0) ||
        (this.state.cdMinute % 1 != 0)
      ) {
        alert("Please only enter whole number times.");
        return;
      }
      var secondInMs = 1000;
      var minuteInMs = secondInMs * 60;
      var hourInMs = minuteInMs * 60;
      var time =
        this.state.cdHour * hourInMs + this.state.cdMinute * minuteInMs;
      var cdJson = {
        cdName: title,
        cdTime: time,
        index: index
      };
      var body = JSON.stringify(cdJson);
      fetch("/editCd", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          //edit the countdown in the array
          var editedCdNames = this.state.cdNames;
          var editedCdTimes = this.state.cdTimes;
          editedCdNames[json.index] = json.cdName;
          editedCdTimes[json.index] = json.cdTime;
          this.setState({
            cdText: "",
            cdHour: 0,
            cdMinute: 0,
            cdEditingIndex: -1,
            cdEditMode: false,
            cdNames: editedCdNames,
            cdTimes: editedCdTimes
          });
        });
    }
  }

  editCountdown(e, index) {
    e.preventDefault();
    var oldText = this.state.cdNames[index];
    //calculate the number of hours and minutes based on the given time
    var oldTimeNum = this.state.cdTimes[index];
    var oldMinutes = this.getMinutesFromMillis(oldTimeNum);
    var oldHours = this.getHoursFromMillis(oldTimeNum);
    this.setState({
      cdEditingIndex: index,
      cdEditMode: true,
      cdText: oldText,
      cdHour: oldHours,
      cdMinute: oldMinutes
    });
    var elmnt = document.getElementById("cdForm");
    elmnt.scrollIntoView();
  }

  deleteCountdown(e, index) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete your countdown?")) {
      fetch("/deleteCd", {
        method: "POST",
        body: JSON.stringify({ index: index }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(json => {
          var filtered = this.state.cdNames;
          filtered.splice(index, 1);
          var filteredTimes = this.state.cdTimes;
          filteredTimes.splice(index, 1);
          this.setState({ cdNames: filtered, cdTimes: filteredTimes });
        });
    }
  }

  // takes in a number of milliseconds, for example 18780000,
  // and returns the number of minutes since the last hour.
  // in the case of our example, 13 minutes.
  getMinutesFromMillis(timeInMillis) {
    return (timeInMillis / (1000 * 60)) % 60;
  }

  // takes in a number of milliseconds, for example 18780000,
  // and returns the number of whole hours contained. I expect
  // the values of hours to be between 0 and 23.
  // in the case of our example, it is 5 hours.
  getHoursFromMillis(timeInMillis) {
    return Math.floor(timeInMillis / (1000 * 60 * 60));
  }

  formatResetTime(timeInMillis) {
    var hours = this.getHoursFromMillis(timeInMillis);
    var minutes = this.getMinutesFromMillis(timeInMillis);
    var hoursString, minutesString;
    hoursString = hours.toString();
    minutesString = minutes.toString();
    if (hours < 10) {
      hoursString = "0" + hours.toString();
    }
    if (minutes < 10) {
      minutesString = "0" + minutes.toString();
    }
    return hoursString + ":" + minutesString;
  }

  formatRemainingTime(timeInMillis) {
    var hours = this.getHoursFromMillis(timeInMillis);
    var minutes = Math.floor(this.getMinutesFromMillis(timeInMillis));
    var seconds = Math.floor(((timeInMillis / 1000) % 3600) % 60);
    var hoursString, minutesString, secondsString;
    hoursString = hours.toString();
    minutesString = minutes.toString();
    secondsString = seconds.toString();
    if (hours < 10) {
      hoursString = "0" + hours.toString();
    }
    if (minutes < 10) {
      minutesString = "0" + minutes.toString();
    }
    if (seconds < 10) {
      secondsString = "0" + seconds.toString();
    }
    return hoursString + ":" + minutesString + ":" + secondsString;
  }

  calculateRemainingTime(index) {
    // modify the state's date object to give the time in ms since midnight last night.
    var currTime = this.state.currTime;
    var d = new Date(currTime);
    currTime = currTime - d.setHours(0, 0, 0, 0);
    // the time in ms since midnight last night when this countdown restarts.
    var cdTime = this.state.cdTimes[index];
    var remaining;
    if (currTime <= cdTime) {
      // we are before the end of the countdown, remaining is just cdTime - currTime
      remaining = cdTime - currTime;
      return remaining;
    } else {
      // we are after the end of the countdown, time to get fancy
      // get the difference between cdTime and currTime, this is negative
      // subtract the absolute value of it from 24h in ms
      var secondInMs = 1000;
      var minuteInMs = secondInMs * 60;
      var hourInMs = minuteInMs * 60;
      var dayInMs = hourInMs * 24;
      remaining = dayInMs - Math.abs(cdTime - currTime);
      return remaining;
    }
  }

  componentDidMount() {
    this.getDreams();
    this.interval = setInterval(
      () => this.setState({ currTime: Date.now() }),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <div className="topBar">
          <div className="pure-g">
            <div className="pure-u-18-24">
              <h1 className="base-margin">Do Now (Better Name Pending) </h1>
            </div>
            <div className="pure-u-6-24 logout-button-container">
              <a href="/help" className="pure-button edit-button logout-button">
                Help
              </a>
              <a
                href="/logout"
                className="pure-button delete-button logout-button"
              >
                Logout
              </a>
            </div>
          </div>
        </div>
        <div className="pure-g section-title-bar">
          <div className="pure-u base-margin">
            <h3 className="title-text" style={{ color: "#eee" }}>
              Your To Do List
            </h3>
          </div>
        </div>
        <div className="base-margin todo-list-app-container">
          <div className="time-container">
            <p className="time-text">
              {" "}
              Based on your estimates, you could be done in{" "}
              <b>{this.calculateTimes()}</b> hours. <br />
              This means that if you start now, you will be done at{" "}
              <b>{this.calculateDoneTime()}</b>.
            </p>
          </div>
          <form
            id="dreamForm"
            className="pure-form"
            style={{
              backgroundColor: this.state.editMode ? "#75A9EB" : "#eee"
            }}
          >
            <b>
              {this.state.editMode
                ? "Edit Item From To Do List"
                : "Add Item To To Do List"}
            </b>
            <label>
              Task title:
              <input
                name="dream"
                type="text"
                value={this.state.dreamText}
                placeholder="Task"
                maxLength="100"
                onChange={e => this.setState({ dreamText: e.target.value })}
                required={true}
              />
            </label>
            <label>
              Estimated length:
              <input
                name="dream"
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                value={this.state.dreamLength}
                placeholder="Length (Number)"
                maxLength="100"
                required={true}
                onChange={e => this.setState({ dreamLength: e.target.value })}
              />
            </label>
            <button
              type="submit"
              id="submit-dream"
              className="pure-button pure-button-primary button-success"
              onClick={e => this.addDream(e)}
            >
              Submit {this.state.editMode ? "Edit" : "Task"}
            </button>
          </form>
          <section className="dreams">
            <ul id="Dreams">
              {this.state.dreams.map((dream, index) => {
                return (
                  <li key={index}>
                    <div
                      className="grid-container"
                      style={{
                        backgroundColor:
                          dream === this.state.originalDream
                            ? "#75A9EB"
                            : this.state.dreamCompletion[index] === "true"
                            ? "palegreen"
                            : "#eee"
                      }}
                    >
                      <div className="button-area">
                        {" "}
                        <button
                          className="button-success pure-button complete-button button-gives-space"
                          id={`C@${index}^${this.state.dreamLengths[index]}*${dream}`}
                          onClick={e => this.toggleComplete(e)}
                          disabled={
                            dream === this.state.originalDream ? "true" : ""
                          }
                        >
                          {this.state.dreamCompletion[index] === "true"
                            ? "Uncomplete."
                            : "Complete!"}
                        </button>
                        <button
                          className="edit-button pure-button"
                          id={`E@${index}^${this.state.dreamLengths[index]}*${dream}`}
                          onClick={e => this.editDream(e)}
                          disabled={
                            dream === this.state.originalDream ? "true" : ""
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button pure-button"
                          id={`D@${index}^${this.state.dreamLengths[index]}*${dream}`}
                          onClick={e => this.deleteDream(e)}
                          disabled={
                            dream === this.state.originalDream ? "true" : ""
                          }
                        >
                          Delete
                        </button>
                      </div>
                      <div className="title-area">
                        {" "}
                        <div className="base-margin">{dream}</div>
                      </div>
                      <div className="time-area">
                        {" "}
                        <div className="base-margin">
                          Duration: {this.state.dreamLengths[index]} hours.
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <div className="pure-g section-title-bar">
          <div className="pure-u base-margin">
            <h3 className="title-text" style={{ color: "#eee" }}>
              Your Daily Countdowns
            </h3>
          </div>
        </div>
        <div className="base-margin countdown-app-container">
          <form
            id="cdForm"
            className="pure-form"
            style={{
              backgroundColor: this.state.cdEditMode ? "#75A9EB" : "#eee"
            }}
          >
            <b>{this.state.cdEditMode ? "Edit Countdown" : "Add Countdown"}</b>
            <label>
              Countdown title:
              <input
                name="dream"
                type="text"
                value={this.state.cdText}
                placeholder="Countdown"
                maxLength="100"
                onChange={e => this.setState({ cdText: e.target.value })}
                required={true}
              />
            </label>
            <label>
              Reset Hour (0 to 23):
              <input
                name="dream"
                type="number"
                step="1"
                min="0"
                max="23"
                value={this.state.cdHour}
                placeholder="Hour (Number)"
                maxLength="100"
                required={true}
                onChange={e => this.setState({ cdHour: e.target.value })}
              />{" "}
            </label>
            <label>
              Reset Minute (0 to 59):
              <input
                name="dream"
                type="number"
                step="1"
                min="0"
                max="59"
                value={this.state.cdMinute}
                placeholder="Minute (Number)"
                maxLength="100"
                required={true}
                onChange={e => this.setState({ cdMinute: e.target.value })}
              />
            </label>
            <button
              type="submit"
              id="submit-dream"
              className="pure-button pure-button-primary button-success"
              onClick={e => this.addCountdown(e, this.state.cdEditingIndex)}
            >
              Submit {this.state.cdEditMode ? "Edit" : "Countdown"}
            </button>
          </form>
          <section className="countdowns">
            <ul id="countdowns">
              {this.state.cdNames.map((cdName, index) => {
                return (
                  <li key={`c${index}`}>
                    <div
                      className="grid-container"
                      style={{
                        backgroundColor:
                          index === this.state.cdEditingIndex
                            ? "#75A9EB"
                            : "#eee"
                      }}
                    >
                      <div
                        className="button-area"
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        {" "}
                        <button
                          className="edit-button pure-button button-gives-space"
                          id={`Z@${index}^${this.state.cdTimes[index]}*${cdName}`}
                          onClick={e => this.editCountdown(e, index)}
                          disabled={
                            index === this.state.cdEditingIndex ? "true" : ""
                          }
                          style={{ float: "right" }}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button pure-button"
                          id={`X@${index}^${this.state.cdTimes[index]}*${cdName}`}
                          onClick={e => this.deleteCountdown(e, index)}
                          disabled={
                            index === this.state.cdEditingIndex ? "true" : ""
                          }
                          style={{ float: "right" }}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="title-area">
                        {" "}
                        <div className="base-margin">{cdName}</div>
                      </div>
                      <div className="time-area">
                        {" "}
                        <div className="not-base-margin">
                          <div className="times-grid-container">
                            <div className="remaining-area">
                              <b>
                                Remaining:{" "}
                                {this.formatRemainingTime(
                                  this.calculateRemainingTime(index)
                                )}
                              </b>
                            </div>
                            <div className="reset-area">
                              <div className="base-margin">
                                Reset Time:{" "}
                                {this.formatRemainingTime(
                                  this.state.cdTimes[index]
                                )}
                              </div>
                            </div>
                            <div className="progress-area">
                              <progress
                                value={`${1000 * 60 * 60 * 24 -
                                  this.calculateRemainingTime(index)}`}
                                max={`${1000 * 60 * 60 * 24}`}
                              >
                                Time Remaining
                              </progress>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    );
  }
}
ReactDOM.render(
  React.createElement(TodoList),
  document.getElementById("list-for-react")
);
