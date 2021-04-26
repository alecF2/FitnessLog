'use strict';  // always start with this 

import barchart from './js/barchart.js'





/* Set default date in forms to current date */
document.getElementById('pAct-date').valueAsDate = newUTCDate()
document.getElementById('fAct-date').valueAsDate = newUTCDate()

// Date form element
let date_form = document.getElementById('pAct-date');

/* Past Activity 'Add New Activity' Button - Show Form */
let add_past_activity_button = document.getElementById("addPastActivityButton")
add_past_activity_button.addEventListener("click", add_past_activity_onclick);


/* Future Activity 'Add New Activity' Button - Show Form */
let add_future_activity_button = document.getElementById("addFutureActivityButton")
add_future_activity_button.addEventListener("click", add_future_activity_onclick);


/* Past Activity Form Dropdown */
let past_activity_dropdown = document.getElementById("pAct-activity")
past_activity_dropdown.addEventListener("change", past_activity_dropdown_onchange);


/* Past Activity 'Submit' Button - Submit Form */
let submit_past_activity_button = document.getElementById("submitPastActivityButton")
submit_past_activity_button.addEventListener("click", submit_past_activity_onclick);


/* Future Activity 'Submit' Button - Submit Form */
let submit_future_activity_button = document.getElementById("submitFutureActivityButton")
submit_future_activity_button.addEventListener("click", submit_future_activity_onclick)


/**
 * ONCLICK - Hide 'Add New Activity' Button under the Past Section and Show
 * Form to Add a Past Activity
 */
function add_past_activity_onclick() {
  /* Connect to Past Activity Sections */
  let pActAdd = document.getElementById("pAct-Add");
  let pActForm = document.getElementById("pAct-Form");

  /* Show Form, Hide 'Add New Activity' Button */
  pActAdd.classList.add("hide");
  pActForm.classList.remove("hide");
}


/**
 * ONCLICK - Hide 'Add New Activity' Button under the Future Section and Show
 * Form to Add a Future Activity
 */
function add_future_activity_onclick() {
  /* Connect to Past Activity Sections */
  let fActAdd = document.getElementById("fAct-Add");
  let fActForm = document.getElementById("fAct-Form");

  /* Show Form, Hide 'Add New Activity' Button */
  fActAdd.classList.add("hide");
  fActForm.classList.remove("hide");
}


/**
 * ONCHANGE - Automatically Change Units in Past Activty Form to accomodate the
 * selected Activity from the dropdown menu
 */
function past_activity_dropdown_onchange() {
  /* Connect to Past Activity Unit Input */
  let pActUnit = document.getElementById("pAct-unit");

  /* Show Form, Hide 'Add New Activity' Button */
  switch (past_activity_dropdown.value) {
    case 'Walk': case 'Run': case 'Bike':
      pActUnit.value = 'km';
      break;
    case 'Swim':
      pActUnit.value = 'laps';
      break;
    case 'Yoga': case 'Soccer': case 'Basketball':
      pActUnit.value = 'minutes';
      break;
    default:
      pActUnit.value = 'units';
  }
}


/**
 * ONCLICK - Validate Past Activity Form Contents, Send Data to Server, Remove
 * Form, and Display 'Add ...' Button with confirmation text above
 */
function submit_past_activity_onclick() {
  /* Connect to Past Activity Sections */
  let pActAdd = document.getElementById("pAct-Add");
  let pActForm = document.getElementById("pAct-Form");

  /* Activity Data to Send to Server */
  let data = {
    date: document.getElementById('pAct-date').value,
    activity: document.getElementById('pAct-activity').value,
    scalar: document.getElementById('pAct-scalar').value,
    units: document.getElementById('pAct-unit').value
  }

  if (!past_activity_form_is_valid(data)) {
    alert("Invalid Past Activity. Please fill in the entire form.");
    return
  }

  /* Hide Form, Show 'Add New Activity' Button */
  pActAdd.classList.remove("hide");
  pActForm.classList.add("hide");

  /* Add 'p' tag above 'Add New Activity' Button */
  let newActivity = create_submission_success_element(
    "Got it! ",
    `${data.activity} for ${data.scalar} ${data.units}. `,
    "Keep it up!"
  )
  insert_latest_response(pActAdd, newActivity)

  console.log('Past Activity Sending:', data);

  /* Post Activity Data to Server */
  fetch(`/pastActivity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data), // post body
  })
    .then(response => response.json())
    .then(data => {
      console.log('Past Activity Success:', data);
    })
    .catch((error) => {
      console.error('Past Activity Error:', error);
    });

  /* Reset Form */
  document.getElementById('pAct-date').valueAsDate = newUTCDate()
  document.getElementById('pAct-activity').value = "Walk"
  document.getElementById('pAct-scalar').value = ""
  document.getElementById('pAct-unit').value = "km"
}


/**
 * ONCLICK - Validate Future Activity Form Contents, Send Data to Server, Remove
 * Form, and Display 'Add ...' Button with confirmation text above
 */
function submit_future_activity_onclick() {
  /* Connect to Future Activity Sections */
  let fActAdd = document.getElementById("fAct-Add");
  let fActForm = document.getElementById("fAct-Form");

  /* Activity Data to Send to Server */
  let data = {
    date: document.getElementById('fAct-date').value,
    activity: document.getElementById('fAct-activity').value
  }

  /* Form Validation */
  if (!future_activity_form_is_valid(data)) {
    alert("Invalid Future Plan. Please fill in the entire form.");
    return
  }

  /* Hide Form, Show 'Add New Activity' Button */
  fActAdd.classList.remove("hide");
  fActForm.classList.add("hide");

  /* Add 'p' tag above 'Add New Activity' Button  */
  let newActivity = create_submission_success_element(
    "Sounds good! Don't forget to come back to update your session for ",
    `${data.activity} on ${reformat_date(data.date)}`,
    "!"
  )
  insert_latest_response(fActAdd, newActivity)

  console.log('Future Plans Sending:', data);

  /* Post Activity Data to Server */
  fetch(`/store`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data), // post body
  })
    .then(response => response.json())
    .then(data => {
      console.log('Future Plans Success:', data);
    })
    .catch((error) => {
      console.error('Future Plans Error:', error);
    });

  /* Reset Form */
  document.getElementById('fAct-date').valueAsDate = newUTCDate()
  document.getElementById('fAct-activity').value = "Walk"
}


/**
 * Create DOM element for acknowledgment message to send to user for submitting a form
 * @param {string} beg - regular starting section
 * @param {string} mid - bolded middle section
 * @param {string} end - regular trailing text
 * @returns {HTMLElement} DOM element combining beg, mid, end
 */
function create_submission_success_element(beg, mid, end) {
  /* Create all HTML elements to add */
  let newMessage = document.createElement('p')
  let baseText = document.createElement('span')
  let dynamicText = document.createElement('strong')
  let exclamationText = document.createElement('span')

  /* Update textContent of all generated DOM elements */
  baseText.textContent = beg
  dynamicText.textContent = mid
  exclamationText.textContent = end

  /* Append all text contents back to back in wrapper 'p' tag */
  newMessage.appendChild(baseText)
  newMessage.appendChild(dynamicText)
  newMessage.appendChild(exclamationText)

  return newMessage
}


/**
 * Checks if past activity data is valid
 * @param {Object} data
 * @param {string} data.date - format 'mm-dd-yyyy'
 * @param {string} data.activity
 * @param {string} data.scalar - time or distance integer or float
 * @param {string} data.units - units for scalar value
 * @returns {boolean} Boolean represents if data is valid
 */
function past_activity_form_is_valid(data) {
  let date = new Date(data.date.replace('-', '/'))
  if (date != "Invalid Date" && date > newUTCDate()) {
    return false
  }

  return !(data.date == "" || data.activity == "" || data.scalar == "" || data.units == "")
}


/**
 * Checks if future activity data is valid
 * @param {Object} data
 * @param {string} data.date
 * @param {string} data.activity
 * @returns {boolean} Boolean represents if data is valid
 */
function future_activity_form_is_valid(data) {
  let date = new Date(data.date.replace('-', '/'))
  if (date != "Invalid Date" && date < newUTCDate()) {
    return false
  }

  return !(data.date == "" || data.activity == "")
}


/**
 * Insert Prompt at the top of parent and remove old prompts
 * @param {HTMLElement} parent - DOM element 
 * @param {HTMLElement} child - DOM element
 */
function insert_latest_response(parent, child) {
  if (parent.children.length > 1) {
    parent.removeChild(parent.children[0])
  }
  parent.insertBefore(child, parent.childNodes[0])
}


/**
 * Convert 'yyyy-mm-dd' to 'mm/dd/yy'
 * @param {string} date 
 * @returns {string} same date, but reformated
 */
function reformat_date(date) {
  let [yyyy, mm, dd] = date.split("-");
  return `${mm}/${dd}/${yyyy.substring(2, 4)}`
}


/**
 * Convert GMT date to UTC
 * @returns {Date} current date, but converts GMT date to UTC date
 */
function newUTCDate() {
  let gmtDate = new Date()
  return new Date(gmtDate.toLocaleDateString())
}

// Reminder container queries 
let reminder_container = document.getElementsByClassName("reminder_container")[0];
let reminder_activity = "";

function getReminder() {
  fetch(`/reminder`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);
    let reminder_message = document.getElementById("reminder_message");
    reminder_message.textContent = `Did you ${data.activity} yesterday?`;
    reminder_activity = data.activity;
    document.getElementsByClassName("reminder_container")[0].classList.remove('hide');
  })
  .catch(err => {
    console.log("No reminder to show", err);
  });
}

// Onload Event Listener to call getReminder
window.addEventListener('load', () => {
  getReminder();
});

// Reminder bar
let yes_btn = document.getElementById("yes_btn");
let no_btn = document.getElementById("no_btn");

// View Progress Button
let view_progress_btn = document.getElementById("view_prog");

// Format date 
function format_date(date) {
  if (date < 10) {
    let result = `0${date}`;
    return result;
  }
  return date;
}

// Opens up the add new activity box with the activity we reminded them about
yes_btn.addEventListener('click', ()=> {
  add_past_activity_button.click();
  reminder_container.classList.add('hide');
  past_activity_dropdown.value = reminder_activity;
  const today = new Date();
  let yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  console.log('yesterday', yesterday);
  let year = yesterday.getFullYear();
  let month = format_date(yesterday.getMonth() + 1);
  let day = format_date(yesterday.getDate());
  document.getElementById('pAct-date').value = `${year}-${month}-${day}`;
  past_activity_dropdown_onchange();
});

// Close the reminder box
no_btn.addEventListener('click', ()=> {
  reminder_container.classList.add('hide');
});

// Open Chart Modal 
view_progress_btn.addEventListener('click', () => {
  
  // Default Setting - Get ending date from one week ago 
  let today = new Date();
  let week_ago = new Date(today);
  week_ago.setDate(today.getDate() - 7);
  console.log(`todays date: ${today.getTime()} and date from a week ago: ${week_ago}`);
  
  // Make GET request and use date from one week ago and an empty activity
  fetch(`/week?date=${week_ago.getTime()}&activity=`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json();
  }).then(list => {
    console.log(list);
    let act_arr = [];
    list.forEach(obj => {
      console.log(obj);
      console.log({'date': obj.date, 'value': obj.amount});
      act_arr.push({'date': obj.date, 'value': obj.amount});
    });
    console.log("act_arr after pushing:",act_arr);
    
    let act = '';
    switch(list[0].activity) {
      case "Walk":
        act = "Kilometers walked";
        break;
      case "Run":
        act = "Kilometers ran";
        break;
      case "Bike":
        act = "Kilometers biked";
        break;
      case "Swim":
        act = "Laps swam";
        break;
      case "Yoga":
        act = "Minutes of Yoga";
        break;
      case "Basketball":
        act = "Minutes of Basketball";
        break;
    }

    console.log("activity name:", act);
    
    // Update Chart Date 
    let chart_date = document.getElementById('chart-date');
    let chart_year = week_ago.getFullYear();
    let chart_month = format_date(week_ago.getMonth() + 1);
    let chart_day = format_date(week_ago.getDate());
    chart_date.value = `${chart_year}-${chart_month}-${chart_day}`;
    console.log(chart_date);

    document.getElementsByClassName('modal_background')[0].classList.remove('hide');
    console.log("after hiding");
    barchart.init('chart-anchor', 500, 300);
    console.log(`act_arr: ${act_arr} act: ${act}`);
    barchart.render(act_arr, act);
  });
});

// Exit Modal Button 
let exit_btn = document.getElementById('exit_btn');
exit_btn.addEventListener('click', ()=> {
  document.getElementsByClassName('modal_background')[0].classList.add('hide');
  document.getElementsByClassName('barchart')[0].remove();
});
