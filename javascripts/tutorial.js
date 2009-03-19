// JSTutorial lets you show breadcrumbs to users as a form of tutorial.
// For more, visit https://github.com/thrivesmart/js_tutorial
// 
// You build your own tutorial story (javascript) files, each of which should call 
// <code>JSTutorial.play(storyDescriptorObject)</code>
var JSTutorial = {
  version: '1.0.0',
  
  dialogPad: 3, // pixels between dialog and target object
  nextContent: 'Next &raquo;', // Next button text
  closeContent: 'close', // Close button text
  arrowPositions: ['top', 'right', 'bottom', 'left' ], // all available arrow positions

  dialog: null, // dialog box element.  Only one shown at a time. 
  content: null, // Content element within dialog
  nextButton: null, 
  displaying: null, // Descriptor currently displayed
  
  // Starts the tutorial on this descriptor object
  play: function(descriptor) {
    try {
      if (!this.dialog) this._build();
      this._display(descriptor);
    }
    catch(ignored) { this._error(descriptor); }
  },
  
  // Displays next descriptor object as defined by currently displayed descriptor
  next: function() {
    if (!this.displaying || !this.displaying.next) { this.quit(); return; }

    try {
      if (!this.dialog) this._build();
      this._display(this.displaying.next());
    }
    catch(ignored) { this._error(this.displaying.next()); }
  },
  
  // Cancel displaying tutorial
  quit: function() {
    if (this.dialog) { this.dialog.remove(); $(window).unbind('resize', JSTutorial._repositionCurrentDialog); }
    this.dialog = null;
  },
  
  // Be nice and display some debug info.  Typically happens when target couldn't be found.
  _error: function(descriptor) {
    var msg = '';
    for (var i in descriptor) msg+=i+": `"+descriptor[i]+"',\n"
    alert("Oh no! There was an error displaying this part of the tutorial." + 
          "  If you know how to get in touch with the developers, here's the error message to send them: \n\n" + 
          msg);
  },

  // Builds the dialog box with current descriptor, and triggers the callback
  _display: function(descriptor) {
    this.dialog.addClass('hidden');
    this.nextButton.html(this.nextContent);
    if (descriptor.next) this.nextButton.removeClass('hidden'); else this.nextButton.addClass('hidden');
    this.content.html(descriptor.content);
    
    this.dialog.css({ width: descriptor.width, position: 'absolute' });
    
    // remove all arrows and set the correct one
    for (var i = 0; i < this.arrowPositions.length; ++i) this.dialog.removeClass(this.arrowPositions[i] + '-arrow');
    if (descriptor.arrow) this.dialog.addClass(descriptor.arrow + '-arrow');
    
    // only set position when everything's been added on the dialog
    this._repositionDialog(descriptor);
    
    this.dialog.removeClass('hidden');
    $('html,body').animate({scrollTop: $(descriptor.target).offset().top - 100}, 1000);

    this.displaying = descriptor;
    if (descriptor.callback) descriptor.callback();
  },
  
  // Positions dialog box correctly given a descriptor
  _repositionDialog: function(descriptor) {
    this.dialog.css(this._dialogPosition($(descriptor.target), $(descriptor.target).offset(), descriptor.arrow));
  },
  
  // Positions dialog box correctly given descriptor in JSTutorial.displaying (used in window.resize)
  _repositionCurrentDialog: function() {
    JSTutorial._repositionDialog(JSTutorial.displaying);
  },
  
  // Calculates position css given the correct target and arrow orientation
  _dialogPosition: function(target, targetPosition, arrowPosition) {
    if (arrowPosition == 'top') { 
      return { 
        top: (targetPosition.top + target.outerHeight())  + 'px', 
        left: ((target.outerWidth() - this.dialog.outerWidth()) / 2 + targetPosition.left) + 'px'  // center horizontally
      }; 
    }
    if (arrowPosition == 'bottom') { 
      return { 
        bottom: targetPosition.top + 'px', 
        left: ((target.outerWidth() - this.dialog.outerWidth()) / 2 + targetPosition.left) + 'px'  // center horizontally
      };
    }
    if (arrowPosition == 'left') { 
      return { 
        top: ((target.outerHeight() - this.dialog.outerHeight()) / 2 + targetPosition.top) + 'px', // center vertically
        left: (targetPosition.left + this.dialog.outerWidth() +  this.dialogPad) + 'px' 
      };
    } 
    if (arrowPosition == 'right') { 
      return { 
        top: ((target.outerHeight() - this.dialog.outerHeight()) / 2 + targetPosition.top) + 'px',  // center vertically
        left: (targetPosition.left - this.dialog.outerWidth() - this.dialogPad) + 'px' 
      };
    }
  },

  // Creates and adds the correct dialog box, along with buttons
  _build: function() {
    var d1=document.createElement('div');
    d1.id = 'js-tutorial-balloon';
    d1.className='js-tutorial-balloon hidden';
    this.dialog = $(d1);
    
    var d2=document.createElement('div');
    d2.className='arrow';
    d1.appendChild(d2);
    var d3=document.createElement('div');
    d3.className='body';
    d1.appendChild(d3);
    
    var d4=document.createElement('div');
    d4.className='content';
    d3.appendChild(d4);
    this.content = $(d4);

    var d5=document.createElement('div');
    d5.className='buttons';
    d3.appendChild(d5);
    
    var span1=document.createElement('span');
    span1.className='cancel';
    d5.appendChild(span1);
    var a1=document.createElement('a');
    span1.appendChild(a1);
    var txt9=document.createTextNode(this.closeContent);
    a1.appendChild(txt9);
    a1.onclick = function() { JSTutorial.quit() };
    
    var span2=document.createElement('span');
    span2.className='continue';
    d5.appendChild(span2);
    var a2=document.createElement('a');
    this.nextButton = $(a2);
    
    span2.appendChild(a2);
    var txt11=document.createTextNode(this.nextContent);
    a2.appendChild(txt11);
    a2.onclick = function() { JSTutorial.next() };
    
    document.body.appendChild(d1);
    $(window).resize(JSTutorial._repositionCurrentDialog);
  }
};
