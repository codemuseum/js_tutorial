var MyTutorialStory = {
  // A story is made up of descriptors, which are objects like this one (arbitrarily called "first")
  first: {
    // Define the content displayed in the dialog
    content: 'This is the html that is displayed for <em>step 1</em>.',
    // Define the target where this dialog is positioned (an actual HTML element, via JQuery)
    target: $('#steps div.step1').get(0),
    // Position that the arrow is supposed portrude from the dialog ('top', 'bottom', 'left', 'right')
    arrow: 'top', // or "targetPosition", if there's no arrow to display
    // CSS width of the dialog
    width: '250px',
    // Callback function (optional) returning the next story descriptor
    next: function() { return MyTutorialStory.second },
    // Callback function (optional), called when this step of the story is first displayed.
    callback: function() { alert("I can do crazy custom stuff because step 1 is working!"); }
  },
  second: {
    content: 'This is the html that is displayed for <em>step 2</em>.',
    target: $('#steps div.step2').get(0),
    arrow: 'right',
    width: '250px'
  }
};
// Start up the tutorial, by calling JSTutorial.play method defined in tutorial.js
JSTutorial.play(MyTutorialStory.first);