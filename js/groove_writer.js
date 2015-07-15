	// Javascript for the Groove Writer HTML application
	// Groove Writer is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
	//
	// Author: Lou Montulli   
	// Original Creation date: Feb 2015.

// GrooveWriter class.   The only one in this file. 
function GrooveWriter() { "use strict";

	var root = this;

	var myGrooveUtils = new GrooveUtils();
	
	// public class vars
	var class_number_of_measures = 2;  // only 2 for now (future expansion to more possible)
	var class_notes_per_measure = parseInt(myGrooveUtils.getQueryVariableFromURL("Div", "8"));	// default to 8ths



	// private vars in the scope of the class
	var class_app_title = "Groove Writer";
	var class_empty_note_array = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
	var class_permutationType = "none";
	var class_advancedEditIsOn = false;
	var class_measure_for_note_label_click = 0;
	var class_which_index_last_clicked = 0;    // which note was last clicked for the context menu
	
	// constants
	var constant_default_tempo = 80;
	var constant_note_stem_off_color = "transparent";
	var constant_note_on_color_hex  = "#000000";  // black
	var constant_note_on_color_rgb  = 'rgb(0, 0, 0)';  // black
	var constant_note_off_color_hex = "#CCCCCC";  // gray
	var constant_note_off_color_rgb = 'rgb(204, 204, 204)';  // gray
	var constant_note_hidden_color_rgb = "transparent";
	var constant_ABC_STICK_R=  '"R"x';
	var constant_ABC_STICK_L=  '"L"x';
	var constant_ABC_STICK_OFF=  '""x';
	var constant_ABC_HH_Ride=  "^f";       
	var constant_ABC_HH_Crash=  "^A'";       
	var constant_ABC_HH_Open=   "!open!^g";  
	var constant_ABC_HH_Close=  "!plus!^g";  
	var constant_ABC_HH_Accent= "!accent!^g";  
	var constant_ABC_HH_Normal= "^g"; 
	var constant_ABC_SN_Ghost=  "!(.!!).!c";  
	var constant_ABC_SN_Accent= "!accent!c";   
	var constant_ABC_SN_Normal= "c";   
	var constant_ABC_SN_XStick= "^c"; 
	var constant_ABC_KI_SandK=  "[F^d,]";  // kick & splash
	var constant_ABC_KI_Splash= "^d,";     // splash only
	var constant_ABC_KI_Normal= "F";   
				
	// functions


	root.numberOfMeasures = function () {
		return class_number_of_measures;
	}
	
	root.notesPerMeasure = function () {
		return class_notes_per_measure;
	}	
	// check for firefox browser
	function isFirefox() {
		var val = navigator.userAgent.toLowerCase(); 
		if(val.indexOf("firefox") > -1)
			return true;
			
		return false;
	}
		
	// is the division a triplet groove?   6, 12, or 24 notes
	function usingTriplets() {
		if(myGrooveUtils.isTripletDivision(class_notes_per_measure, 4, 4))
			return true;
			
		return false;
	}
	
		
	// public function
	// is the browser a touch device.   Usually this means no right click
	root.is_touch_device = function() {
		 return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
	};

	
	
	function is_snare_on(id) {
		var state = get_snare_state(id, "ABC");
		
		if(state != false)
			return true;
			
		return false;
	}
	
	// returns the ABC notation for the snare state
	// false = off
	// 
	//  c == Snare Normal</li>
	//  !accent!c == Snare Accent</li>
	//  _c == Ghost Note    shows an x with a circle around it.   Needs improvement
	//  ^c == xstick   shows an x
	function get_snare_state(id, returnType) {
		
		if(returnType != "ABC" && returnType != "URL")
		{
			alert("bad returnType in get_snare_state()")
			returnType = "ABC";
		}	
								
		if(document.getElementById("snare_ghost" + id).style.color == constant_note_on_color_rgb) {
			if(returnType == "ABC")
				return constant_ABC_SN_Ghost;   // ghost note
			else if(returnType == "URL")
				return "g";   // ghost note
		}
		if(document.getElementById("snare_accent" + id).style.color == constant_note_on_color_rgb) {
			if(returnType == "ABC")
				return constant_ABC_SN_Accent;   // snare accent
			else if(returnType == "URL")
				return "O";   // snare accent
		}
		if(document.getElementById("snare_circle" + id).style.backgroundColor == constant_note_on_color_rgb) {
			if(returnType == "ABC")
				return constant_ABC_SN_Normal;   // snare normal
			else if(returnType == "URL")
				return "o";   // snare normal
		}
		if(document.getElementById("snare_xstick" + id).style.color == constant_note_on_color_rgb) {
			if(returnType == "ABC")
				return constant_ABC_SN_XStick;   // snare normal
			else if(returnType == "URL")
				return "x";   // snare xstick
		}
		
		
		if(returnType == "ABC")
				return false;  // off (rest)
			else if(returnType == "URL")
				return "-";  // off (rest)
	}
	
	// is the any kick note on for this note in the measure?
	function is_kick_on(id) {
		var state = get_kick_state(id, "ABC");
		
		if(state != false)
			return true;
			
		return false;
	}

	// returns the ABC notation for the kick state
	// false = off
	// "F" = normal kick
	// "^d," = splash
	// "F^d,"  = kick & splash
	function get_kick_state(id, returnType) {
	
		var splashOn = (document.getElementById("kick_splash" + id).style.color == constant_note_on_color_rgb);
		var kickOn = (document.getElementById("kick_circle" + id).style.backgroundColor == constant_note_on_color_rgb);
	
		if(returnType != "ABC" && returnType != "URL")
		{
			alert("bad returnType in get_kick_state()")
			returnType = "ABC";
		}	
					
		if(splashOn && kickOn) {
			if(returnType == "ABC")
				return constant_ABC_KI_SandK;  // kick & splash
			else if(returnType == "URL")
				return "X";   // kick & splash
		} else if(splashOn) {
			if(returnType == "ABC")
				return constant_ABC_KI_Splash;   // splash only
			else if(returnType == "URL")
				return "x";   // splash only
		} else if(kickOn) {
			if(returnType == "ABC")
				return constant_ABC_KI_Normal;   // kick normal
			else if(returnType == "URL")
				return "o";   // kick normal
		}
			
		if(returnType == "ABC")
				return false;  // off (rest)
			else if(returnType == "URL")
				return "-";  // off (rest)
	}
	
	// set the kick note on with type
	function set_kick_state(id, mode) {

		// hide everything optional
		document.getElementById("kick_circle" + id).style.backgroundColor = constant_note_hidden_color_rgb;
		document.getElementById("kick_splash" + id).style.color = constant_note_hidden_color_rgb;
		
								
		// turn stuff on conditionally
		switch(mode) {
		case "off":
			document.getElementById("kick_circle" + id).style.backgroundColor = constant_note_off_color_hex;
			break;
		case "normal":
			document.getElementById("kick_circle" + id).style.backgroundColor = constant_note_on_color_hex;
			break;
		case "splash":
			document.getElementById("kick_splash" + id).style.color = constant_note_on_color_hex;
			break;
		case "kick_and_splash":
			document.getElementById("kick_circle" + id).style.backgroundColor = constant_note_on_color_hex;
			document.getElementById("kick_splash" + id).style.color = constant_note_on_color_hex;
			break;
		default:
			alert("bad switch in set_kick_state");
		}
	}
	
	
	function set_snare_state(id, mode) {
						
		// hide everything optional
		document.getElementById("snare_circle" + id).style.backgroundColor = constant_note_hidden_color_rgb;
		document.getElementById("snare_ghost" + id).style.color = constant_note_hidden_color_rgb;
		document.getElementById("snare_accent" + id).style.color = constant_note_hidden_color_rgb;
		document.getElementById("snare_xstick" + id).style.color = constant_note_hidden_color_rgb;
						
		// turn stuff on conditionally
		switch(mode) {
		case "off":
			document.getElementById("snare_circle" + id).style.backgroundColor = constant_note_off_color_hex;
			break;
		case "normal":
			document.getElementById("snare_circle" + id).style.backgroundColor = constant_note_on_color_hex;
			break;
		case "ghost":
			document.getElementById("snare_ghost" + id).style.color = constant_note_on_color_hex;
			break;
		case "accent":
			document.getElementById("snare_circle" + id).style.backgroundColor = constant_note_on_color_hex;
			document.getElementById("snare_accent" + id).style.color = constant_note_on_color_hex;
			break;
		case "xstick":
			document.getElementById("snare_xstick" + id).style.color = constant_note_on_color_hex;
			break;
		default:
			alert("bad switch in set_snare_state");
		}
	}
	
	function is_hh_on(id) {
		var state = get_hh_state(id, "ABC");
		
		if(state != false)
			return true;
			
		return false;
	}

	// returns the ABC notation for the HH state
	// false = off
	// see the top constants for mappings
	function get_hh_state(id, returnType) {
			
		if(returnType != "ABC" && returnType != "URL")
		{
			alert("bad returnType in get_hh_state()")
			returnType = "ABC";
		}	
		
		if(document.getElementById("hh_ride" + id).style.color == constant_note_on_color_rgb) {
			if(returnType == "ABC")
				return constant_ABC_HH_Ride;   // ride
			else if(returnType == "URL")
				return "r";   // ride
		}
		if(document.getElementById("hh_crash" + id).style.color == constant_note_on_color_rgb) {
			if(returnType == "ABC")
				return constant_ABC_HH_Crash;   // crash
			else if(returnType == "URL")
				return "c";   // crash
		}
		if(document.getElementById("hh_open" + id).style.color == constant_note_on_color_rgb) {
			if(returnType == "ABC")
				return constant_ABC_HH_Open;   // hh Open
			else if(returnType == "URL")
				return "o";   // hh Open
				
		}
		if(document.getElementById("hh_close" + id).style.color == constant_note_on_color_rgb) {
			if(returnType == "ABC")
				return constant_ABC_HH_Close;   // hh close
			else if(returnType == "URL")
				return "+";   // hh close
		}
		if(document.getElementById("hh_accent" + id).style.color == constant_note_on_color_rgb) {
			if(returnType == "ABC")
				return constant_ABC_HH_Accent;   // hh accent
			else if(returnType == "URL")
				return "X";   // hh accent
		}
		if(document.getElementById("hh_cross" + id).style.color == constant_note_on_color_rgb) {
			if(returnType == "ABC")
				return constant_ABC_HH_Normal;   // hh normal
			else if(returnType == "URL")
				return "x";   // hh normal
		}
		
		if(returnType == "ABC")
				return false;  // off (rest)
		else if(returnType == "URL")
				return "-";  // off (rest)
	}
	
	function set_hh_state(id, mode) {
		
		// hide everything optional
		document.getElementById("hh_cross" + id).style.color = constant_note_hidden_color_rgb;
		document.getElementById("hh_ride" + id).style.color = constant_note_hidden_color_rgb;
		document.getElementById("hh_crash" + id).style.color = constant_note_hidden_color_rgb;
		document.getElementById("hh_open" + id).style.color = constant_note_hidden_color_rgb;
		document.getElementById("hh_close" + id).style.color = constant_note_hidden_color_rgb;
		document.getElementById("hh_accent" + id).style.color = constant_note_hidden_color_rgb;
		
		// turn stuff on conditionally
		switch(mode) {
		case "off":
			document.getElementById("hh_cross" + id).style.color = constant_note_off_color_hex;
			break;
		case "normal":
			document.getElementById("hh_cross" + id).style.color = constant_note_on_color_hex;
			break;
		case "ride":
			document.getElementById("hh_ride" + id).style.color = constant_note_on_color_hex;
			break;
		case "crash":
			document.getElementById("hh_crash" + id).style.color = constant_note_on_color_hex;
			break;
		case "open":
			document.getElementById("hh_cross" + id).style.color = constant_note_on_color_hex;
			document.getElementById("hh_open" + id).style.color = constant_note_on_color_hex;
			break;
		case "close":
			document.getElementById("hh_cross" + id).style.color = constant_note_on_color_hex;
			document.getElementById("hh_close" + id).style.color = constant_note_on_color_hex;
			break;
		case "accent":
			document.getElementById("hh_cross" + id).style.color = constant_note_on_color_hex;
			document.getElementById("hh_accent" + id).style.color = constant_note_on_color_hex;
			break;
		default:
			alert("bad switch in set_hh_state");
		}
	}
	
	function set_sticking_state(id, new_state) {
		
		// turn both off
		document.getElementById("sticking_right" + id).style.color = constant_note_hidden_color_rgb;
		document.getElementById("sticking_left" + id).style.color = constant_note_hidden_color_rgb;
			
		switch(new_state) {
		case "off":
			// show them both greyed out.
			document.getElementById("sticking_right" + id).style.color = constant_note_off_color_hex;
			document.getElementById("sticking_left" + id).style.color = constant_note_off_color_hex;
			break;
		case "right":
			document.getElementById("sticking_right" + id).style.color = constant_note_on_color_hex;
			break;
		case "left":
			document.getElementById("sticking_left" + id).style.color = constant_note_on_color_hex;
			break;
		default:
			alert("Bad state in set_sticking_on");
			break;
		}
	}
	
	function get_sticking_state(id, returnType) {
		var sticking_state = false;
		if(returnType != "ABC" && returnType != "URL")
		{
			alert("bad returnType in get_kick_state()")
			returnType = "ABC";
		}	
			
		var element = document.getElementById("sticking_right" + id);
	
		// since colors are inherited, if we have not set a color it will be blank in the ID'd element
		// we set all colors to off in the stylesheet, so it must be off.
		if( (document.getElementById("sticking_right" + id).style.color == "" && document.getElementById("sticking_left" + id).style.color == "") 
			|| (document.getElementById("sticking_right" + id).style.color == constant_note_off_color_rgb && document.getElementById("sticking_left" + id).style.color == constant_note_off_color_rgb)) {
			
			// both are off.   Call it off
			if(returnType == "ABC")
				return constant_ABC_STICK_OFF;  // off (rest)
			else if(returnType == "URL")
				return "-";  // off (rest)
		
		} else if(document.getElementById("sticking_right" + id).style.color == constant_note_on_color_rgb) {
			
			if(returnType == "ABC")
				return constant_ABC_STICK_R;  
			else if(returnType == "URL")
				return "R";  
			
		} else {  // assume left is on, because it's a logic error if it isn't
			
			if(returnType == "ABC")
				return constant_ABC_STICK_L;  
			else if(returnType == "URL")
				return "L";  
		} 
		
		return false;  // should never get here
	}
	
	
	function sticking_rotate_state(id) {
		var new_state = false;
		var sticking_state = get_sticking_state(id, "ABC");
		
		// figure out the next state
		// we could get fancy here and default down strokes to R and upstrokes to L
		// for now we will rotate through (Off, R, L) in order
		if(sticking_state == constant_ABC_STICK_OFF) {
			new_state = "right";
		} else if(sticking_state == constant_ABC_STICK_R) {
			new_state = "left";
		} else if(sticking_state == constant_ABC_STICK_L) {
			new_state = "off";
		}
	
		set_sticking_state(id, new_state);
	}
	
	// highlight the note, this is used to play along with the midi track
	// only one note for each instrument can be highlighted at a time
	// Also unhighlight other instruments if their index is not equal to the passed in index
	// this means that only notes falling on the current beat will be highlighted.
	var class_cur_hh_highlight_id = false;
	var class_cur_snare_highlight_id = false;
	var class_cur_kick_highlight_id = false;
	function hilight_note(instrument, id) {
		
		id = Math.floor(id);
		if(id < 0 || id >= class_notes_per_measure*class_number_of_measures)
			return;
		
		// turn this one on;
		document.getElementById(instrument + id).style.borderColor = "orange";
		
		// turn off all the previously highlighted notes that are not on the same beat
		if(class_cur_hh_highlight_id !== false && class_cur_hh_highlight_id != id) {
				if(class_cur_hh_highlight_id < class_notes_per_measure*class_number_of_measures)
					document.getElementById("hi-hat" + class_cur_hh_highlight_id).style.borderColor = "transparent";
				class_cur_hh_highlight_id = false;
		}
		if(class_cur_snare_highlight_id !== false && class_cur_snare_highlight_id != id) {
				if(class_cur_snare_highlight_id < class_notes_per_measure*class_number_of_measures)
					document.getElementById("snare" + class_cur_snare_highlight_id).style.borderColor = "transparent";
				class_cur_snare_highlight_id = false;
		}
		if(class_cur_kick_highlight_id !== false && class_cur_kick_highlight_id != id) {
				if(class_cur_kick_highlight_id < class_notes_per_measure*class_number_of_measures)
					document.getElementById("kick" + class_cur_kick_highlight_id).style.borderColor = "transparent";
				class_cur_kick_highlight_id = false;
		}
			
		switch(instrument) {
			case "hi-hat":
				class_cur_hh_highlight_id = id;
				break;
			case "snare":
				class_cur_snare_highlight_id = id;
				break;
			case "kick":
				class_cur_kick_highlight_id = id;
				break;
			default: 
				alert("bad case in hilight_note");
				break;
		}
	}
	
	function clear_all_highlights(instrument) {
		
		// now turn off  notes if necessary;
		if(class_cur_hh_highlight_id !== false) {
				document.getElementById("hi-hat" + class_cur_hh_highlight_id).style.borderColor = "transparent";
				class_cur_hh_highlight_id = false;
		}
		if(class_cur_snare_highlight_id !== false) {
				document.getElementById("snare" + class_cur_snare_highlight_id).style.borderColor = "transparent";
				class_cur_snare_highlight_id = false;
		}
		if(class_cur_kick_highlight_id !== false) {
				document.getElementById("kick" + class_cur_kick_highlight_id).style.borderColor = "transparent";
				class_cur_kick_highlight_id = false;
		}
		
	}
	
	
	
	
	// the user has clicked on the permutation menu
	root.permutationAnchorClick = function(event) {
		
		var contextMenu = document.getElementById("permutationContextMenu");
		if(contextMenu) {
			if (!event) var event = window.event;
			if (event.pageX || event.pageY)
			{
				contextMenu.style.top = event.pageY + "px";
				contextMenu.style.left = event.pageX-75 + "px";
			}
			myGrooveUtils.showContextMenu(contextMenu);
		}
	}
	
	// the user has clicked on the grooves menu
	root.groovesAnchorClick = function(event) {
		
		var contextMenu = document.getElementById("grooveListWrapper");
		if(contextMenu) {
			if (!event) var event = window.event;
			if (event.pageX || event.pageY)
			{
				contextMenu.style.top = event.pageY + "px";
				contextMenu.style.left = event.pageX-240 + "px";
			}
			myGrooveUtils.showContextMenu(contextMenu);
		}
	}
	
	// the user has clicked on the help menu
	root.helpAnchorClick = function(event) {
		
		var contextMenu = document.getElementById("helpContextMenu");
		if(contextMenu) {
			if (!event) var event = window.event;
			if (event.pageX || event.pageY)
			{
				contextMenu.style.top = event.pageY + "px";
				contextMenu.style.left = event.pageX-60 + "px";
			}
			myGrooveUtils.showContextMenu(contextMenu);
		}
	}
	
	function setupPermutationMenu() {
		// disable for triplets
		if(!document.getElementById("permutationAnchor"))
			return;
		
		if(usingTriplets) {
			document.getElementById("permutationAnchor").style.fontColor = "gray";
		} else {
			document.getElementById("permutationAnchor").style.fontColor = "blue";
		}
		
	}
	
	root.permutationPopupClick = function(perm_type) {
		class_permutationType = perm_type;
		
		switch (perm_type) {
		case "kick_16ths":
		case "kick_16ths_with_upbeats":
			showHideCSS_ClassVisibility(".kick-container", true, false);  // hide it
			showHideCSS_ClassVisibility(".snare-container", true, true);  // show it
			document.getElementById("staff-container2").style.display = "none";
			document.getElementById("permutationAnchor").style.backgroundColor = "orange";
			break;
			
		case "snare_16ths":
		case "snare_16ths_with_upbeats":
		case "snare_accent_16ths":
		case "snare_accent_16ths_with_upbeats":
		case "snare_accented_and_diddled_16ths":
		case "snare_accented_and_diddled_16ths_with_upbeats":
			showHideCSS_ClassVisibility(".kick-container", true, true);  // show it
			showHideCSS_ClassVisibility(".snare-container", true, false);  // hide it
			document.getElementById("staff-container2").style.display = "none";
			document.getElementById("permutationAnchor").style.backgroundColor = "orange";
			break;

		case "none":
		default:
			showHideCSS_ClassVisibility(".kick-container", true, true);  // show it
			showHideCSS_ClassVisibility(".snare-container", true, true);  // show it
			// document.getElementById("staff-container2").style.display = "block";
			class_permutationType = "none";
			document.getElementById("permutationAnchor").style.backgroundColor = "#FFFFCC";;
			break;
		}
		
		create_ABC();
	}
	
	// user has clicked on the advanced edit button
	this.toggleAdvancedEdit = function() {
		if(class_advancedEditIsOn) {
			// turn it off
			class_advancedEditIsOn = false;
			document.getElementById("advancedEditAnchor").style.backgroundColor = "#FFFFCC";;
		} else {
			class_advancedEditIsOn = true;
			document.getElementById("advancedEditAnchor").style.backgroundColor = "orange";;
		}
	}
	
	
	// context menu for labels
	root.noteLabelClick = function(event, instrument, measure) {
		var contextMenu = false;
		
		// store this in a global, there can only ever be one context menu open at a time.
		// Yes, I agree this sucks
		class_measure_for_note_label_click = measure;
		
		switch(instrument) {
		case "stickings":
			contextMenu = document.getElementById("stickingsLabelContextMenu")
			break;
		case "hh":
			contextMenu = document.getElementById("hhLabelContextMenu")
			break;
		case "snare":
			contextMenu = document.getElementById("snareLabelContextMenu")
			break;
		case "kick":
			contextMenu = document.getElementById("kickLabelContextMenu")
			break;
		default:
			alert("bad case in noteLabelClick");
		}
		
		if(contextMenu) {
			if (!event) var event = window.event;
			if (event.pageX || event.pageY)
			{
				contextMenu.style.top = event.pageY-30 + "px";
				contextMenu.style.left = event.pageX-35 + "px";
			}
			myGrooveUtils.showContextMenu(contextMenu);
		}
		
		return false;
	}
	
	
	root.noteLabelPopupClick = function(instrument, action) {
		var setFunction = false;
		var contextMenu = false;
		
		switch(instrument) {
		case "stickings":
			contextMenu = document.getElementById("stickingsLabelContextMenu")
			setFunction = set_sticking_state;
			break;
		case "hh":
			contextMenu = document.getElementById("hhLabelContextMenu")
			setFunction = set_hh_state;
			break;
		case "snare":
			contextMenu = document.getElementById("snareLabelContextMenu")
			setFunction = set_snare_state;
			break;
		case "kick":
			contextMenu = document.getElementById("kickLabelContextMenu")
			setFunction = set_kick_state;
			break;
		default:
			alert("bad case in noteLabelPopupClick");
			return false;
		}
		
		// start at the first note of the measure we want to effect.   Only fill in the 
		// notes for that measure
		var startIndex = class_notes_per_measure * (class_measure_for_note_label_click-1);
		for(var i=startIndex; i-startIndex < class_notes_per_measure; i++) {
			if(action == "all_off")
				setFunction(i, "off")
			else if(instrument == "stickings" && action == "all_right")
				setFunction(i, "right");
			else if(instrument == "stickings" && action == "all_left")
				setFunction(i, "left");
			else if(instrument == "stickings" && action == "alternate")
				setFunction(i, (i % 2 == 0 ? "right" :"left") );
			else if(instrument == "hh" && action == "downbeats")
				setFunction(i, (i % 2 == 0 ? "normal" :"off") );
			else if(instrument == "hh" && action == "upbeats")
				setFunction(i, (i % 2 == 0 ? "off" :"normal") );
			else if(instrument == "snare" && action == "all_on")
				setFunction(i, "accent");
			else if(action == "all_on")
				setFunction(i, "normal");
			else if(action == "cancel")
				continue;  // do nothing.
			else 
				alert("Bad IF case in noteLabelPopupClick");
		}
		
		class_measure_for_note_label_click = 0;  // reset
		
		create_ABC();
		
		return false;
	}
	
	// returns true on error!
	// returns false if working.  (this is because of the onContextMenu handler 
	root.noteRightClick = function(event, type, id) {
		class_which_index_last_clicked = id;
		var contextMenu;
		
		switch(type) {
		case "sticking":
			contextMenu = document.getElementById("stickingContextMenu")
			break;
		case "hh":
			contextMenu = document.getElementById("hhContextMenu")
			break;
		case "snare":
			contextMenu = document.getElementById("snareContextMenu")
			break;
		case "kick":
			contextMenu = document.getElementById("kickContextMenu")
			break;
		default:
			alert("Bad case in handleNotePopup")
		}
		
		if(contextMenu) {
			if (!event) var event = window.event;
			if (event.pageX || event.pageY)
			{
				contextMenu.style.top = event.pageY-30 + "px";
				contextMenu.style.left = event.pageX-75 + "px";
			}
			myGrooveUtils.showContextMenu(contextMenu);
		}
		else {
			return true;  //error
		}
		
		return false;
	}
	
	root.noteLeftClick = function(event, type, id) {
		
		// use a popup if advanced edit is on
		if(class_advancedEditIsOn == true) {
			root.noteRightClick(event, type, id);
		
		} else {	
		
			// this is a non advanced edit left click
			switch(type) {
			case "hh":
				set_hh_state(id, is_hh_on(id) ? "off" : "normal");
				break;
			case "snare":
				set_snare_state(id, is_snare_on(id) ? "off" : "accent");
				break;
			case "kick":
				set_kick_state(id, is_kick_on(id) ? "off" : "normal");
				break;
			case "sticking":
				sticking_rotate_state(id);
				break;
			default:
				alert("Bad case in noteLeftClick")
			}
		
			create_ABC();
		}
		
	};

	root.notePopupClick = function(type, new_setting) {
		var id = class_which_index_last_clicked
		
		switch(type) {
			case "sticking":
				set_sticking_state(id, new_setting);
				break;
			case "hh":
				set_hh_state(id, new_setting);
				break;
			case "snare":
				set_snare_state(id, new_setting);
				break;
			case "kick":
				set_kick_state(id, new_setting);
				break;
			default:
				alert("Bad case in contextMenuClick")
		}
		
		create_ABC();
	};
	
	// called when we initially mouseOver a note.   
	// We can use it to sense left or right mouse or ctrl events
	root.noteOnMouseEnter = function(event, instrument, id) {
	
		var action = false;
		
		if(event.ctrlKey)
			action = "on";
		if(event.altKey)
			action = "off";
			
		if(action) {
			switch(instrument) {
				case "hh":
					set_hh_state(id, action == "off" ? "off" : "normal");
					break;
				case "snare":
					set_snare_state(id, action == "off" ? "off" : "accent");
					break;
				case "kick":
					set_kick_state(id, action == "off" ? "off" : "normal");
					break;
				default:
					alert("Bad case in noteOnMouseEnter");
			}
			create_ABC();  // update music
		}
		
		return false;
	}
				
	function is_hh_or_snare_on(id) {
		if( is_hh_on(id) ) return true;
		if( is_snare_on(id) ) return true;
		
		return false;
	}
	
	
	

	function get_permutation_pre_ABC(section, includeUpbeatsAndDownbeats) {
		var abc = "";
		
		if(!includeUpbeatsAndDownbeats && section > 8)
			section += 2;  // skip past the upbeats & downbeats
		
		
		if(usingTriplets()) {
			// skip every fourth one
			section += Math.floor(section/4);
			
			if(section == 8)
				section = 9;
		}
		
		switch(section) {
		case 0:
			abc += "P:Ostinato\n%\n%\n%Just the Ositnato\n"
			break;
		case 1:
			abc += "T: \nP: Singles\n%\n%\n% singles on the \"1\"\n%\n"
			break;
		case 2:
			abc += "%\n%\n% singles on the \"e\"\n%\n"
			break;
		case 3:
			abc += "%\n%\n% singles on the \"&\"\n%\n";
			break;
		case 4:
			abc += "%\n%\n% singles on the \"a\"\n%\n";		
			break;
		case 5:
			abc += "T: \nP: Doubles\n%\n%\n% doubles on the \"1\"\n%\n"
			break;
		case 6:
			abc += "%\n%\n% doubles on the \"e\"\n%\n"
			break;
		case 7:
			abc += "%\n%\n% doubles on the \"&\"\n%\n";
			break;
		case 8:
			abc += "%\n%\n% doubles on the \"a\"\n%\n";		
			break;
		case 9:
			abc += "T: \nP: Up/Down Beats\n%\n%\n% upbeats on the \"1\"\n%\n"
			break;
		case 10:
			abc += "%\n%\n% downbeats on the \"e\"\n%\n"
			break;
		case 11:
			abc += "T: \nP: Triples\n%\n%\n% triples on the \"1\"\n%\n"
			break;
		case 12:
			abc += "%\n%\n% triples on the \"e\"\n%\n"
			break;
		case 13:
			abc += "%\n%\n% triples on the \"&\"\n%\n";
			break;
		case 14:
			abc += "%\n%\n% triples on the \"a\"\n%\n";		
			break;
		case 15:
			abc += "T: \nP: Quads\n%\n%\n% quads\n%\n";		
			break;
		default:
			abc += "\nT: Error: No index passed\n";
			break;
		}
		
		return abc;
	}
	
	function get_permutation_post_ABC(section, includeUpbeatsAndDownbeats) {
		var abc = "";
		
		if(!includeUpbeatsAndDownbeats && section > 8)
			section += 2;  // skip past the upbeats & downbeats
		
		if(usingTriplets()) {
			// skip every third one
			section += Math.floor(section/3);
		}
		
		switch(section) {
		case 0:
			abc += "|\n";
			break;
		case 1:
			abc += "\\\n";
			break;
		case 2:
			abc += "\n";
			break;
		case 3:
			abc += "\\\n";
			break;
		case 4:
			abc += "|\n";	
			break;
		case 5:
			abc += "\\\n";
			break;
		case 6:
			abc += "\n";
			break;
		case 7:
			abc += "\\\n";
			break;
		case 8:
			abc += "|\n";		
			break;
		case 9:
			abc += "\\\n";
			break;
		case 10:
			abc += "|\n";
			break;
		case 11:
			abc += "\\\n";
			break;
		case 12:
			abc += "\n";		
			break;
		case 13:
			abc += "\\\n";
			break;
		case 14:
			abc += "|\n";		
			break;
		case 15:
			abc += "|\n";		
			break;
		default:
			abc += "\nT: Error: No index passed\n";
			break;
		}
		
		return abc;
	}
	
	// 16th note permutation array expressed in 32nd notes
	// some kicks are excluded at the beginning of the measure to make the groupings
	// easier to play through continuously
	function get_kick16th_minus_some_strait_permutation_array(section, includeUpbeatsAndDownbeats) {
		var kick_array;
		
		if(!includeUpbeatsAndDownbeats && section > 8)
			section += 2;  // skip past the upbeats & downbeats
		
		switch(section) {
		case 0:
			kick_array = [false, false, false, false, false, false, false, false, 
						  false, false, false, false, false, false, false, false, 
						  false, false, false, false, false, false, false, false, 
						  false, false, false, false, false, false, false, false];
			break;
		case 1:
			kick_array = ["F", false, false, false, false, false, false, false,
						  "F", false, false, false, false, false, false, false,
						  "F", false, false, false, false, false, false, false, 
						  "F", false, false, false, false, false, false, false];
			break;
		case 2:
			kick_array = [false, false, "F", false, false, false, false, false, 
						  false, false, "F", false, false, false, false, false, 
						  false, false, "F", false, false, false, false, false, 
						  false, false, "F", false, false, false, false, false];
			break;
		case 3:
			kick_array = [false, false, false, false, "F", false, false, false, 
						  false, false, false, false, "F", false, false, false, 
						  false, false, false, false, "F", false, false, false, 
						  false, false, false, false, "F", false, false, false];
			break;
		case 4:
			kick_array = [false, false, false, false, false, false, "F", false, 
						  false, false, false, false, false, false, "F", false, 
						  false, false, false, false, false, false, "F", false, 
						  false, false, false, false, false, false, "F", false];
			break
		case 5:
			kick_array = ["F", false, "F", false, false, false, false, false, 
						  "F", false, "F", false, false, false, false, false, 
						  "F", false, "F", false, false, false, false, false, 
						  "F", false, "F", false, false, false, false, false];
			break;
		case 6:
			kick_array = [false, false, "F", false, "F", false, false, false, 
						  false, false, "F", false, "F", false, false, false, 
						  false, false, "F", false, "F", false, false, false, 
						  false, false, "F", false, "F", false, false, false];
			break;
		case 7:
			kick_array = [false, false, false, false, "F", false, "F", false, 
						  false, false, false, false, "F", false, "F", false, 
						  false, false, false, false, "F", false, "F", false, 
						  false, false, false, false, "F", false, "F", false];
			break;
		case 8:
			kick_array = [false, false, false, false, false, false, "F", false, 
						  "F", false, false, false, false, false, "F", false, 
						  "F", false, false, false, false, false, "F", false, 
						  "F", false, false, false, false, false, "F", false];
			break;
		case 9:   // downbeats
			kick_array = ["F", false, false, false, "F", false, false, false, 
						  "F", false, false, false, "F", false, false, false, 
						  "F", false, false, false, "F", false, false, false, 
						  "F", false, false, false, "F", false, false, false];
			break;
		case 10:  // upbeats
			kick_array = [false, false, "F", false, false, false, "F", false, 
						  false, false, "F", false, false, false, "F", false, 
						  false, false, "F", false, false, false, "F", false, 
						  false, false, "F", false, false, false, "F", false];
			break;
		case 11:
			kick_array = ["F", false, "F", false, "F", false, false, false, 
						  "F", false, "F", false, "F", false, false, false, 
						  "F", false, "F", false, "F", false, false, false, 
						  "F", false, "F", false, "F", false, false, false];
			break;
		case 12:
			kick_array = [false, false, "F", false, "F", false, "F", false, 
						  false, false, "F", false, "F", false, "F", false, 
						  false, false, "F", false, "F", false, "F", false, 
						  false, false, "F", false, "F", false, "F", false];
			break;
		case 13:
			kick_array = [false, false, false, false, "F", false, "F", false, 
						  "F", false, false, false, "F", false, "F", false, 
						  "F", false, false, false, "F", false, "F", false, 
						  "F", false, false, false, "F", false, "F", false];
			break;
		case 14:
			kick_array = [false, false, false, false, false, false, "F", false, 
						  "F", false, "F", false, false, false, "F", false, 
						  "F", false, "F", false, false, false, "F", false, 
						  "F", false, "F", false, false, false, "F", false];
			break;
		case 15:
		default:
			kick_array = ["F", false, "F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false, "F", false]
			break;
		}
		
		return kick_array;
	}
	
	// 16th note permutation array expressed in 32nd notes
	// all kicks are included, including the ones that start the measure
	function get_kick16th_strait_permutation_array(section, includeUpbeatsAndDownbeats) {
		var kick_array;
		
		if(!includeUpbeatsAndDownbeats && section > 8)
			section += 2;  // skip past the upbeats & downbeats
		
		switch(section) {
		case 0:
			kick_array = [false, false, false, false, false, false, false, false, 
						  false, false, false, false, false, false, false, false, 
						  false, false, false, false, false, false, false, false, 
						  false, false, false, false, false, false, false, false];
			break;
		case 1:
			kick_array = ["F", false, false, false, false, false, false, false,
						  "F", false, false, false, false, false, false, false,
						  "F", false, false, false, false, false, false, false, 
						  "F", false, false, false, false, false, false, false];
			break;
		case 2:
			kick_array = [false, false, "F", false, false, false, false, false, 
						  false, false, "F", false, false, false, false, false, 
						  false, false, "F", false, false, false, false, false, 
						  false, false, "F", false, false, false, false, false];
			break;
		case 3:
			kick_array = [false, false, false, false, "F", false, false, false, 
						  false, false, false, false, "F", false, false, false, 
						  false, false, false, false, "F", false, false, false, 
						  false, false, false, false, "F", false, false, false];
			break;
		case 4:
			kick_array = [false, false, false, false, false, false, "F", false, 
						  false, false, false, false, false, false, "F", false, 
						  false, false, false, false, false, false, "F", false, 
						  false, false, false, false, false, false, "F", false];
			break
		case 5:
			kick_array = ["F", false, "F", false, false, false, false, false, 
						  "F", false, "F", false, false, false, false, false, 
						  "F", false, "F", false, false, false, false, false, 
						  "F", false, "F", false, false, false, false, false];
			break;
		case 6:
			kick_array = [false, false, "F", false, "F", false, false, false, 
						  false, false, "F", false, "F", false, false, false, 
						  false, false, "F", false, "F", false, false, false, 
						  false, false, "F", false, "F", false, false, false];
			break;
		case 7:
			kick_array = [false, false, false, false, "F", false, "F", false, 
						  false, false, false, false, "F", false, "F", false, 
						  false, false, false, false, "F", false, "F", false, 
						  false, false, false, false, "F", false, "F", false];
			break;
		case 8:
			kick_array = ["F", false, false, false, false, false, "F", false, 
						  "F", false, false, false, false, false, "F", false, 
						  "F", false, false, false, false, false, "F", false, 
						  "F", false, false, false, false, false, "F", false];
			break;
		case 9:   // downbeats
			kick_array = ["F", false, false, false, "F", false, false, false, 
						  "F", false, false, false, "F", false, false, false, 
						  "F", false, false, false, "F", false, false, false, 
						  "F", false, false, false, "F", false, false, false];
			break;
		case 10:  // upbeats
			kick_array = [false, false, "F", false, false, false, "F", false, 
						  false, false, "F", false, false, false, "F", false, 
						  false, false, "F", false, false, false, "F", false, 
						  false, false, "F", false, false, false, "F", false];
			break;
		case 11:
			kick_array = ["F", false, "F", false, "F", false, false, false, 
						  "F", false, "F", false, "F", false, false, false, 
						  "F", false, "F", false, "F", false, false, false, 
						  "F", false, "F", false, "F", false, false, false];
			break;
		case 12:
			kick_array = [false, false, "F", false, "F", false, "F", false, 
						  false, false, "F", false, "F", false, "F", false, 
						  false, false, "F", false, "F", false, "F", false, 
						  false, false, "F", false, "F", false, "F", false];
			break;
		case 13:
			kick_array = ["F", false, false, false, "F", false, "F", false, 
						  "F", false, false, false, "F", false, "F", false, 
						  "F", false, false, false, "F", false, "F", false, 
						  "F", false, false, false, "F", false, "F", false];
			break;
		case 14:
			kick_array = ["F", false, "F", false, false, false, "F", false, 
						  "F", false, "F", false, false, false, "F", false, 
						  "F", false, "F", false, false, false, "F", false, 
						  "F", false, "F", false, false, false, "F", false];
			break;
		case 15:
		default:
			kick_array = ["F", false, "F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false, "F", false]
			break;
		}
		
		return kick_array;
	}
	
	// 24 note triplet kick permutation expressed in 16th notes
	function get_kick16th_triplets_permutation_array_for_16ths(section) {
		var kick_array;
		
		switch(section) {
		case 0:
			kick_array = [false, false, false, false, false, false, 
						  false, false, false, false, false, false, 
						  false, false, false, false, false, false, 
						  false, false, false, false, false, false]
			break;
		case 1:
			kick_array = ["F", false, false, false, false, false, 
						  "F", false, false, false, false, false, 
						  "F", false, false, false, false, false, 
						  "F", false, false, false, false, false];
			break;
		case 2:
			kick_array = [false, false, "F", false, false, false, 
						  false, false, "F", false, false, false,
						  false, false, "F", false, false, false,
						  false, false, "F", false, false, false];
			break;
		case 3:
			kick_array = [false, false, false, false, "F", false, 
						  false, false, false, false, "F", false, 
						  false, false, false, false, "F", false, 
						  false, false, false, false, "F", false]
			break;
		case 4:
			kick_array = ["F", false, "F", false, false, false, 
						  "F", false, "F", false, false, false, 
						  "F", false, "F", false, false, false, 
						  "F", false, "F", false, false, false];
			break;
		case 5:
			kick_array = [false, false, "F", false, "F", false, 
						  false, false, "F", false, "F", false, 
						  false, false, "F", false, "F", false, 
						  false, false, "F", false, "F", false];
			break;
		case 6:
			kick_array = [false, false, false, false, "F", false,
						  "F", false, false, false, "F", false,
						  "F", false, false, false, "F", false,
						  "F", false, false, false, "F", false];
			break;
		case 7:
		default:
			kick_array = ["F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false];
			break;
		}
		
		return kick_array;
	}
	
	// 12th note triplet kick permutation expressed in 8th notes
	function get_kick16th_triplets_permutation_array_for_8ths(section) {
		var kick_array;
		
		switch(section) {
		case 0:
			kick_array = [false, false, false, false, false, false, 
						  false, false, false, false, false, false, 
						  false, false, false, false, false, false, 
						  false, false, false, false, false, false]
			break;
		case 1:
			kick_array = ["F", false, false, false, false, false, 
						  "F", false, false, false, false, false, 
						  "F", false, false, false, false, false, 
						  "F", false, false, false, false, false];
			break;
		case 2:
			kick_array = [false, false, "F", false, false, false, 
						  false, false, "F", false, false, false,
						  false, false, "F", false, false, false,
						  false, false, "F", false, false, false];
			break;
		case 3:
			kick_array = [false, false, false, false, "F", false, 
						  false, false, false, false, "F", false, 
						  false, false, false, false, "F", false, 
						  false, false, false, false, "F", false]
			break;
		case 4:
			kick_array = ["F", false, "F", false, false, false, 
						  "F", false, "F", false, false, false, 
						  "F", false, "F", false, false, false, 
						  "F", false, "F", false, false, false];
			break;
		case 5:
			kick_array = [false, false, "F", false, "F", false, 
						  false, false, "F", false, "F", false, 
						  false, false, "F", false, "F", false, 
						  false, false, "F", false, "F", false];
			break;
		case 6:
			kick_array = [false, false, false, false, "F", false,
						  "F", false, false, false, "F", false,
						  "F", false, false, false, "F", false,
						  "F", false, false, false, "F", false];
			break;
		case 7:
		default:
			kick_array = ["F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false, 
						  "F", false, "F", false, "F", false];
			break;
		}
		
		return kick_array;
	}
	
	// 6 note triplet kick permutation expressed in 4th notes
	function get_kick16th_triplets_permutation_array_for_4ths(section) {
		var kick_array;
			
		switch(section) {
		case 0:
			kick_array = [false, false, false, false, false, false, 
						  false, false, false, false, false, false, 
						  false, false, false, false, false, false, 
						  false, false, false, false, false, false]
			break;
		case 1:
			kick_array = ["F", false, false, false, false, false, 
						  false, false, false, false, false, false, 
						  "F", false, false, false, false, false, 
						  false, false, false, false, false, false];
			break;
		case 2:
			kick_array = [false, false, false, false, "F", false, 
						  false, false, false, false, false, false,
						  false, false, false, false, "F", false,
						  false, false, false, false, false, false];
			break;
		case 3:
			kick_array = [false, false, false, false, false, false, 
						  false, false, "F", false, false, false, 
						  false, false, false, false, false, false, 
						  false, false, "F", false, false, false]
			break;
		case 4:
			kick_array = ["F", false, false, false, "F", false, 
						  false, false, false, false, false, false, 
						  "F", false, false, false, "F", false, 
						  false, false, false, false, false, false];
			break;
		case 5:
			kick_array = [false, false, false, false, "F", false, 
						  false, false, "F", false, false, false,
						  false, false, false, false, "F", false,
						  false, false, "F", false, false, false];
			break;
		case 6:
			kick_array = ["F", false, false, false, false, false, 
						  false, false, "F", false, false, false, 
						  "F", false, false, false, false, false, 
						  false, false, "F", false, false, false]
			break;
		case 7:
		default:
			kick_array = ["F", false, false, false, "F", false, 
						  false, false, "F", false, false, false, 
						  "F", false, false, false, "F", false, 
						  false, false, "F", false, false, false];
			break;
		}
		
		return kick_array;
	}
	
	function get_kick16th_permutation_array(section, includeUpbeatsAndDownbeats) {
		if(usingTriplets()) {
			if(class_notes_per_measure == 6)
				return get_kick16th_triplets_permutation_array_for_4ths(section);
			else if(class_notes_per_measure == 12)
				return get_kick16th_triplets_permutation_array_for_8ths(section);
			else if(class_notes_per_measure == 24)
				return get_kick16th_triplets_permutation_array_for_16ths(section);
			else
				return class_empty_note_array.slice(0);  // copy by value;
		} else	{
			return get_kick16th_strait_permutation_array(section, includeUpbeatsAndDownbeats);
		}
	}
	
	// snare permutation 
	function get_snare_permutation_array(section, includeUpbeatsAndDownbeats) {

		// its the same as the 16th kick permutation, but with different notes
		var snare_array = get_kick16th_permutation_array(section, includeUpbeatsAndDownbeats);
		
		// turn the kicks into snares
		for(var i=0; i < snare_array.length; i++)
		{
			if(snare_array[i] != false)
				snare_array[i] = constant_ABC_SN_Normal;
		}
		
		return snare_array;
	}
	
	// Snare permutation, with Accented permutation.   Snare hits every 16th note, accent moves
	function get_snare_accent_permutation_array(section, includeUpbeatsAndDownbeats) {

		// its the same as the 16th kick permutation, but with different notes
		var snare_array = get_kick16th_permutation_array(section, includeUpbeatsAndDownbeats);
		
		if(section > 0) {   // Don't convert notes for the first measure since it is the ostinado
			for(var i=0; i < snare_array.length; i++)
			{
				if(snare_array[i] != false)
					snare_array[i] = constant_ABC_SN_Accent;
				else if((i%2) == 0)  // all other even notes are ghosted snares  
					snare_array[i] = constant_ABC_SN_Normal;
			}
		}
		
		return snare_array;
	}
	
	// Snare permutation, with Accented and diddled permutation.   Accented notes are singles, non accents are diddled
	function get_snare_accent_with_diddle_permutation_array(section, includeUpbeatsAndDownbeats) {

		// its the same as the 16th kick permutation, but with different notes
		var snare_array = get_kick16th_permutation_array(section, includeUpbeatsAndDownbeats);
		
		if(section > 0) {   // Don't convert notes for the first measure since it is the ostinado
			for(var i=0; i < snare_array.length; i++)
			{
				if(snare_array[i] != false) {  
					snare_array[i] = constant_ABC_SN_Accent;
					i++;   // the next one is not diddled  (leave it false)
				} else { // all other even notes are diddled, which means 32nd notes  
					snare_array[i] = constant_ABC_SN_Normal;
				}
			}
		}
		
		return snare_array;
	}
	
	function get_numSectionsFor_permutation_array(includeUpbeatsAndDownbeats) {
		var numSections = 0;
		
		if(usingTriplets()) {
			numSections = 8;
		} else {
			if(includeUpbeatsAndDownbeats)
				numSections = 16;
			else
				numSections = 14;
		}
		
		return numSections;
	}
		
	
	function get_kick_on_1_and_3_array(section) {
		
		var kick_array 
		
		if(usingTriplets())
			kick_array = ["F", false, false, false, false, false, 
						  "F", false, false, false, false, false,
						  "F", false, false, false, false, false, 
						  "F", false, false, false, false, false];
		else
			kick_array = ["F", false, false, false, false, false, false, false, 
						  "F", false, false, false, false, false, false, false, 
						  "F", false, false, false, false, false, false, false, 
						  "F", false, false, false, false, false, false, false];

		return kick_array;
	}
	
	function get_samba_kick_array(section) {
		
		var kick_array = ["F", false, false, false, "^D", false, "F", false,
						  "F", false, false, false, "^D", false, "F", false,
						  "F", false, false, false, "^D", false, "F", false,
						  "F", false, false, false, "^D", false, "F", false];
		return kick_array;
	}
	
	function get_tumbao_kick_array(section) {
		
		var kick_array = ["^D", false, false, false, false, false, "F", false,  
						  "^D", false, false, false, "F", false, false, false, 
						  "^D", false, false, false, false, false, "F", false,  
						  "^D", false, false, false, "F", false, false, false];
		return kick_array;
	}
	
	function get_baiao_kick_array(section) {
		
		var kick_array = ["F", false, false, false, "^D", false, "F", false,  
						  false, false, false, false, "[F^D]", false, false, false, 
						  "F", false, false, false, "^D", false, "F", false,  
						  false, false, false, false, "[F^D]", false, false, false];
		return kick_array;
	}
	
	// query the clickable UI and generate a 32 element array representing the notes of one measure
	// note: the ui may have fewer notes, but we scale them to fit into the 32 elements proportionally
	// If using triplets returns 24 notes.   Otherwise always 32.
	//
	// (note: Only one measure, not all the notes on the page if multiple measures are present)
	// Return value is the number of notes.
	function getArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, startIndexForClickableUI) {
		
		var scaler = myGrooveUtils.getNoteScaler(class_notes_per_measure, 4, 4);  // fill proportionally
		
		// fill in the arrays from the clickable UI
		for(var i=0; i < class_notes_per_measure+0; i++) {
			var array_index = (i)*scaler;
			
			// only grab the stickings if they are visible
			if(isStickingsVisible())
				Sticking_Array[array_index] = get_sticking_state(i+startIndexForClickableUI, "ABC");
			
			HH_Array[array_index] = get_hh_state(i+startIndexForClickableUI, "ABC");
		
			Snare_Array[array_index] = get_snare_state(i+startIndexForClickableUI, "ABC");
		
			Kick_Array[array_index] = get_kick_state(i+startIndexForClickableUI, "ABC");
		}
		
		var num_notes = (usingTriplets() ? 24 : 32);
		return num_notes;
	}
	
	
	function createMidiUrlFromClickableUI(MIDI_type) {
		var Sticking_Array = class_empty_note_array.slice(0);  // copy by value
		var HH_Array = class_empty_note_array.slice(0);  // copy by value
		var Snare_Array = class_empty_note_array.slice(0);  // copy by value
		var Kick_Array = class_empty_note_array.slice(0);  // copy by value
		
		var metronomeFrequency = myGrooveUtils.getMetronomeFrequency(); 
		
		// just the first measure
		var num_notes = getArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, 0);
		
		var midiFile = new Midi.File();
		var midiTrack = new Midi.Track();
		midiFile.addTrack(midiTrack);

		midiTrack.setTempo(myGrooveUtils.getTempo());
		midiTrack.setInstrument(0, 0x13);
		
		var swing_percentage = myGrooveUtils.getSwing()/100;
		
		// all of the permutations use just the first measure
		switch (class_permutationType) {
		case "kick_16ths":
		case "kick_16ths_with_upbeats":
			var includeUpbeatsAndDownbeats = (class_permutationType == "kick_16ths_with_upbeats" ? true : false);
			var numSections = get_numSectionsFor_permutation_array(includeUpbeatsAndDownbeats)
			
			// compute sections with different kick patterns
			for(var i=0; i < numSections; i++) {
				var new_kick_array;
				
				new_kick_array = get_kick16th_permutation_array(i, includeUpbeatsAndDownbeats);

				var num_notes_for_swing = 16;
				if(class_notes_per_measure > 16)
					num_notes_for_swing = class_notes_per_measure;
			
				myGrooveUtils.MIDI_from_HH_Snare_Kick_Arrays(midiTrack, HH_Array, Snare_Array, new_kick_array, MIDI_type, metronomeFrequency, num_notes, num_notes_for_swing, swing_percentage, 4, 4);
			}
			break;
			
		
		case "snare_16ths":  // use the hh & snare from the user
		case "snare_16ths_with_upbeats":
			var includeUpbeatsAndDownbeats = (class_permutationType == "snare_16ths_with_upbeats" ? true : false);
			var numSections = get_numSectionsFor_permutation_array(includeUpbeatsAndDownbeats)
			
			//compute sections with different snare patterns		
			for(var i=0; i < numSections; i++) {
				var new_snare_array = get_snare_permutation_array(i, includeUpbeatsAndDownbeats);
				
				var num_notes_for_swing = 16;
				if(class_notes_per_measure > 16)
					num_notes_for_swing = class_notes_per_measure;
			
				myGrooveUtils.MIDI_from_HH_Snare_Kick_Arrays(midiTrack, HH_Array, new_snare_array, Kick_Array, MIDI_type, metronomeFrequency, num_notes, num_notes_for_swing, swing_percentage, 4, 4);
			}
			break;
			
		case "snare_accent_16ths":  // use the hh & snare from the user
		case "snare_accent_16ths_with_upbeats": 
			var includeUpbeatsAndDownbeats = (class_permutationType == "snare_accent_16ths_with_upbeats" ? true : false);
			var numSections = get_numSectionsFor_permutation_array(includeUpbeatsAndDownbeats)
			
			//compute sections with different snare patterns		
			for(var i=0; i < numSections; i++) {
				var new_snare_array = get_snare_accent_permutation_array(i, includeUpbeatsAndDownbeats);
				
				var num_notes_for_swing = 16;
				if(class_notes_per_measure > 16)
					num_notes_for_swing = class_notes_per_measure;
			
				myGrooveUtils.MIDI_from_HH_Snare_Kick_Arrays(midiTrack, HH_Array, new_snare_array, Kick_Array, MIDI_type, metronomeFrequency, num_notes, num_notes_for_swing, swing_percentage, 4, 4);
			}
			break;
			
		case "snare_accented_and_diddled_16ths":  // use the hh & snare from the user
		case "snare_accented_and_diddled_16ths_with_upbeats": 
			var includeUpbeatsAndDownbeats = (class_permutationType == "snare_accented_and_diddled_16ths_with_upbeats" ? true : false);
			var numSections = get_numSectionsFor_permutation_array(includeUpbeatsAndDownbeats)
			
			//compute sections with different snare patterns		
			for(var i=0; i < numSections; i++) {
				var new_snare_array = get_snare_accent_with_diddle_permutation_array(i, includeUpbeatsAndDownbeats);
				
				var num_notes_for_swing = 16;
				if(class_notes_per_measure > 16)
					num_notes_for_swing = class_notes_per_measure;
			
				myGrooveUtils.MIDI_from_HH_Snare_Kick_Arrays(midiTrack, HH_Array, new_snare_array, Kick_Array, MIDI_type, metronomeFrequency, num_notes, num_notes_for_swing, swing_percentage, 4, 4);
			}
			break;
			
		case "none":
		default:
			myGrooveUtils.MIDI_from_HH_Snare_Kick_Arrays(midiTrack, HH_Array, Snare_Array, Kick_Array, MIDI_type, metronomeFrequency, num_notes, class_notes_per_measure, swing_percentage, 4, 4);
			
			if(isSecondMeasureVisable()) {
				// reset arrays
				Sticking_Array = class_empty_note_array.slice(0);  // copy by value
				HH_Array = class_empty_note_array.slice(0);  // copy by value
				Snare_Array = class_empty_note_array.slice(0);  // copy by value
				Kick_Array = class_empty_note_array.slice(0);  // copy by value
		
				// get second measure
				getArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, class_notes_per_measure);
				
				myGrooveUtils.MIDI_from_HH_Snare_Kick_Arrays(midiTrack, HH_Array, Snare_Array, Kick_Array, MIDI_type, metronomeFrequency, num_notes, class_notes_per_measure, swing_percentage, 4, 4);
			}
		}
		
		var midi_url = "data:audio/midi;base64," + btoa(midiFile.toBytes());
		
		
		return midi_url;
	}
	
	root.MIDI_save_as = function() {
		var midi_url = createMidiUrlFromClickableUI("general_MIDI");
		
		// save as 
		document.location = midi_url;
	}

	// creates a grooveData class from the clickable UI elements of the page
	//
	root.grooveDataFromClickableUI = function() {
		var myGrooveData = new myGrooveUtils.grooveData();
		
		myGrooveData.notesPerMeasure   = class_notes_per_measure;
		myGrooveData.numberOfMeasures  = class_number_of_measures;
		myGrooveData.showMeasures      = (isSecondMeasureVisable() ? 2 : 1);
		myGrooveData.showStickings     = isStickingsVisible();
		myGrooveData.title             = document.getElementById("tuneTitle").value;
		myGrooveData.author            = document.getElementById("tuneAuthor").value;
		myGrooveData.comments          = document.getElementById("tuneComments").value;
		myGrooveData.showLegend        = document.getElementById("showLegend").checked;
		myGrooveData.swingPercent      = myGrooveUtils.getSwing();
		myGrooveData.tempo             = myGrooveUtils.getTempo();
		myGrooveData.kickStemsUp       = true;
		
		for(var i=0; i < class_number_of_measures; i++) {
			var Sticking_Array = class_empty_note_array.slice(0);  // copy by value
			var HH_Array = class_empty_note_array.slice(0);  // copy by value
			var Snare_Array = class_empty_note_array.slice(0);  // copy by value
			var Kick_Array = class_empty_note_array.slice(0);  // copy by value
			
			var num_notes = getArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, i*class_notes_per_measure);
			
			if(i == 0) {  // assign
				myGrooveData.sticking_array    =  Sticking_Array;
				myGrooveData.hh_array          =  HH_Array;
				myGrooveData.snare_array       =  Snare_Array;
				myGrooveData.kick_array        =  Kick_Array;
			} else {  // add on toGMTString
				myGrooveData.sticking_array = myGrooveData.sticking_array.concat(Sticking_Array);
				myGrooveData.hh_array = myGrooveData.hh_array.concat(HH_Array);
				myGrooveData.snare_array = myGrooveData.snare_array.concat(Snare_Array);
				myGrooveData.kick_array = myGrooveData.kick_array.concat(Kick_Array);
			}
		}
		
		return myGrooveData;
	}
	
	// called by the HTML when changes happen to forms that require the ABC to update
	root.refresh_ABC = function() {
		create_ABC();
	}
	
		
	// Want to create something like this:
	//
	// {{GrooveTab
	// |HasTempo=90
	// |HasDivision=16
	// |HasMeasures=2
	// |HasNotesPerMeasure=32
	// |HasTimeSignature=4/4
	// |HasHiHatTab=x---o---+---x---x---o---+---x---x---o---+---x---x---o---+---x---
	// |HasSnareAccentTab=--------O-------------------O-----------O---------------O-------
	// |HasSnareOtherTab=--------------g-------------------g-----------g-----------------
	// |HasKickTab=o---------------o---o---------------o-----------o---o---------o-
	// |HasFootOtherTab=----------------------------------------------------------------
	// }}
    //
	root.updateGrooveDBSource = function() {
		if(!document.getElementById("GrooveDB_source"))
			return;   // nothing to update
			
		var myGrooveData = root.grooveDataFromClickableUI();	
		
		var notesPerMeasureInTab = (myGrooveUtils.isTripletDivision(myGrooveData.notesPerMeasure, 4, 4) ? 24 : 32);
		var maxNotesInTab = myGrooveData.showMeasures * notesPerMeasureInTab;
		
		var DBString = "{{GrooveTab";
		
		DBString += "\n|HasTempo=" + myGrooveData.tempo;
		DBString += "\n|HasDivision=" + myGrooveData.notesPerMeasure;
		DBString += "\n|HasMeasures=" + myGrooveData.showMeasures;
		DBString += "\n|HasNotesPerMeasure=" + notesPerMeasureInTab;
		DBString += "\n|HasTimeSignature=4/4";
		DBString += "\n|HasHiHatTab=" + myGrooveUtils.tabLineFromAbcNoteArray("H", myGrooveData.hh_array, true, true, maxNotesInTab, 0);
		DBString += "\n|HasSnareAccentTab=" + myGrooveUtils.tabLineFromAbcNoteArray("S", myGrooveData.snare_array, true, false, maxNotesInTab, 0);
		DBString += "\n|HasSnareOtherTab=" + myGrooveUtils.tabLineFromAbcNoteArray("S", myGrooveData.snare_array, false, true, maxNotesInTab, 0);
		DBString += "\n|HasKickTab=" + myGrooveUtils.tabLineFromAbcNoteArray("K", myGrooveData.kick_array, true, false, maxNotesInTab, 0);
		DBString += "\n|HasFootOtherTab="  + myGrooveUtils.tabLineFromAbcNoteArray("K", myGrooveData.kick_array, false, true, maxNotesInTab, 0);
		
		DBString += "\n}}";
		
		document.getElementById("GrooveDB_source").value = DBString;
	}
	
	// update the current URL so that reloads and history traversal and link shares and bookmarks work correctly
	root.updateCurrentURL = function() {
		var newURL = get_FullURLForPage();
		var newTitle = false;
		
		var title = document.getElementById("tuneTitle").value.trim();
		if(title != "")
			newTitle = title;
			
		var author = document.getElementById("tuneAuthor").value.trim();
		if(author != "") {
			if(title)
				newTitle += " by " + author;
			else	
				newTitle = "Groove by " + author;
		}
		
		if(!newTitle) 
			newTitle = "Groove Writer";
		
		document.title = newTitle
		window.history.replaceState(null, newTitle, newURL);
	
	}
	
	// this is called by a bunch of places anytime we modify the musical notes on the page
	// this will recreate the ABC code and will then use the ABC to rerender the sheet music
	// on the page.
	function create_ABC() {
	
		var Sticking_Array = class_empty_note_array.slice(0);  // copy by value
		var HH_Array = class_empty_note_array.slice(0);  // copy by value
		var Snare_Array = class_empty_note_array.slice(0);  // copy by value
		var Kick_Array = class_empty_note_array.slice(0);  // copy by value
		var includeUpbeatsAndDownbeats = false;
		var numSections = get_numSectionsFor_permutation_array(includeUpbeatsAndDownbeats)
		
		var num_notes = getArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, 0);
		
		// abc header boilerplate
		var tuneTitle = document.getElementById("tuneTitle").value;
		var tuneAuthor = document.getElementById("tuneAuthor").value;
		var tuneComments = document.getElementById("tuneComments").value;
		var showLegend = document.getElementById("showLegend").checked;
		var fullABC = "";
		
		switch (class_permutationType) {
		case "kick_16ths":  // use the hh & snare from the user
		case "kick_16ths_with_upbeats":
			var includeUpbeatsAndDownbeats = (class_permutationType == "kick_16ths_with_upbeats" ? true : false);
			var numSections = get_numSectionsFor_permutation_array(includeUpbeatsAndDownbeats)
		
			fullABC = myGrooveUtils.get_top_ABC_BoilerPlate(class_permutationType != "none", tuneTitle, tuneAuthor, tuneComments, showLegend, usingTriplets(), false, 4, 4);
		
			// compute sections with different kick patterns
			for(var i=0; i < numSections; i++) {
				var new_kick_array;
				
				new_kick_array = get_kick16th_permutation_array(i, includeUpbeatsAndDownbeats);
				var post_abc = get_permutation_post_ABC(i, includeUpbeatsAndDownbeats);
								
				fullABC += get_permutation_pre_ABC(i, includeUpbeatsAndDownbeats);
				fullABC += myGrooveUtils.create_ABC_from_snare_HH_kick_arrays(Sticking_Array, HH_Array, Snare_Array, new_kick_array, post_abc, num_notes, class_notes_per_measure, false, 4, 4);
			}
			break;
			
		case "snare_16ths":  // use the hh & kick from the user
		case "snare_16ths_with_upbeats":
			var includeUpbeatsAndDownbeats = (class_permutationType == "snare_16ths_with_upbeats" ? true : false);
			var numSections = get_numSectionsFor_permutation_array(includeUpbeatsAndDownbeats)
		
			fullABC = myGrooveUtils.get_top_ABC_BoilerPlate(class_permutationType != "none", tuneTitle, tuneAuthor, tuneComments, showLegend, usingTriplets(), false, 4, 4);
		
			//compute 16 sections with different snare patterns		
			for(var i=0; i < numSections; i++) {
				var new_snare_array = get_snare_permutation_array(i, includeUpbeatsAndDownbeats);
				var post_abc = get_permutation_post_ABC(i, includeUpbeatsAndDownbeats);
				
				fullABC += get_permutation_pre_ABC(i, includeUpbeatsAndDownbeats);
				fullABC += myGrooveUtils.create_ABC_from_snare_HH_kick_arrays(Sticking_Array, HH_Array, new_snare_array, Kick_Array, post_abc, num_notes, class_notes_per_measure, false, 4, 4);
			}
			break;
			
		case "snare_accent_16ths":  // use the hh & snare from the user
		case "snare_accent_16ths_with_upbeats":
			var includeUpbeatsAndDownbeats = (class_permutationType == "snare_accent_16ths_with_upbeats" ? true : false);
			var numSections = get_numSectionsFor_permutation_array(includeUpbeatsAndDownbeats)
		
			fullABC = myGrooveUtils.get_top_ABC_BoilerPlate(class_permutationType != "none", tuneTitle, tuneAuthor, tuneComments, showLegend, usingTriplets(), false, 4, 4);
		
			//compute 16 sections with different snare patterns		
			for(var i=0; i < numSections; i++) {
				var new_snare_array = get_snare_accent_permutation_array(i, includeUpbeatsAndDownbeats);
				var post_abc = get_permutation_post_ABC(i, includeUpbeatsAndDownbeats);
				
				fullABC += get_permutation_pre_ABC(i, includeUpbeatsAndDownbeats);
				fullABC += myGrooveUtils.create_ABC_from_snare_HH_kick_arrays(Sticking_Array, HH_Array, new_snare_array, Kick_Array, post_abc, num_notes, class_notes_per_measure, false, 4, 4);
			}
			break;
		
		case "snare_accented_and_diddled_16ths":  // use the hh & snare from the user
		case "snare_accented_and_diddled_16ths_with_upbeats":
			var includeUpbeatsAndDownbeats = (class_permutationType == "snare_accented_and_diddled_16ths_with_upbeats" ? true : false);
			var numSections = get_numSectionsFor_permutation_array(includeUpbeatsAndDownbeats)
		
			fullABC = myGrooveUtils.get_top_ABC_BoilerPlate(class_permutationType != "none", tuneTitle, tuneAuthor, tuneComments, showLegend, usingTriplets(), false, 4, 4);
		
			//compute 16 sections with different snare patterns		
			for(var i=0; i < numSections; i++) {
				var new_snare_array = get_snare_accent_with_diddle_permutation_array(i, includeUpbeatsAndDownbeats);
				var post_abc = get_permutation_post_ABC(i, includeUpbeatsAndDownbeats);
				
				fullABC += get_permutation_pre_ABC(i, includeUpbeatsAndDownbeats);
				fullABC += myGrooveUtils.create_ABC_from_snare_HH_kick_arrays(Sticking_Array, HH_Array, new_snare_array, Kick_Array, post_abc, num_notes, class_notes_per_measure, false, 4, 4);
			}
			break;
			
		case "none":
		default:
			fullABC = myGrooveUtils.get_top_ABC_BoilerPlate(class_permutationType != "none", tuneTitle, tuneAuthor, tuneComments, showLegend, usingTriplets(), true, 4, 4);
		
			fullABC += myGrooveUtils.create_ABC_from_snare_HH_kick_arrays(Sticking_Array, HH_Array, Snare_Array, Kick_Array, "\\\n", num_notes, class_notes_per_measure, true, 4, 4);
			
			if(isSecondMeasureVisable()) {
				// reset arrays
				Sticking_Array = class_empty_note_array.slice(0);  // copy by value
				HH_Array = class_empty_note_array.slice(0);  // copy by value
				Snare_Array = class_empty_note_array.slice(0);  // copy by value
				Kick_Array = class_empty_note_array.slice(0);  // copy by value
		
				getArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, class_notes_per_measure);
				fullABC += myGrooveUtils.create_ABC_from_snare_HH_kick_arrays(Sticking_Array, HH_Array, Snare_Array, Kick_Array, "|\n", num_notes, class_notes_per_measure, true, 4, 4);
			}
			
			break;
		}
		
		
		document.getElementById("ABCsource").value = fullABC;
		root.updateGrooveDBSource();

		myGrooveUtils.midiNoteHasChanged(); // pretty likely the case
		
		// update the current URL so that reloads and history traversal and link shares and bookmarks work correctly
		root.updateCurrentURL();
		
		root.displayNewSVG();
	}
	
	
	// called by create_ABC to remake the sheet music on the page
	root.displayNewSVG = function() {
		var	svgTarget = document.getElementById("svgTarget"),
			diverr = document.getElementById("diverr");
		
		var abc_source = document.getElementById("ABCsource").value
		var svg_return = myGrooveUtils.renderABCtoSVG(abc_source);
		
		diverr.innerHTML = svg_return.error_html;
		svgTarget.innerHTML = svg_return.svg;
			
	}
	
	
	function showHideNonPrintableAreas(showElseHide) {
		var myElements = document.querySelectorAll(".nonPrintable");

		for (var i = 0; i < myElements.length; i++) {
			var divBlock = myElements[i];
			divBlock.style.display = showElseHide ? "block" : "none";
		}
		
	}
	
	root.ShowHideABCResults = function() {
		var ABCResults = document.getElementById("ABC_Results");
		
		
		if(ABCResults.style.display == "block")
			ABCResults.style.display = "none";
		else
			ABCResults.style.display = "block";
						
		return false;  // don't follow the link
	}

	function isSecondMeasureVisable() {
		var secondMeasure = document.getElementById("staff-container2");
		
		if(secondMeasure.style.display == "inline-block")
			return true;
						
		return false;  // don't follow the link
	}
	
	root.showHideSecondMeasure = function(force, showElseHide) {
		var secondMeasure = document.getElementById("staff-container2");
		
		if(force) {
			if(showElseHide)
				secondMeasure.style.display = "inline-block";
			else
				secondMeasure.style.display = "none";
		} else {
			// no-force means to swap on each call
			if(secondMeasure.style.display == "inline-block")
				secondMeasure.style.display = "none";
			else
				secondMeasure.style.display = "inline-block";
		}
		
		create_ABC();
		return false;  // don't follow the link
	}
	
	function showHideCSS_ClassDisplay(className, force, showElseHide, showState) {
		var myElements = document.querySelectorAll(className);
		for (var i = 0; i < myElements.length; i++) {
			var stickings = myElements[i];
	
			if(force) {
				if(showElseHide)
					stickings.style.display = showState;
				else
					stickings.style.display = "none";
			} else {
				// no-force means to swap on each call
				if(stickings.style.display == showState)
					stickings.style.display = "none";
				else 
					stickings.style.display = showState;
			}
		}
	}
	
	function showHideCSS_ClassVisibility(className, force, showElseHide) {
		var myElements = document.querySelectorAll(className);
		for (var i = 0; i < myElements.length; i++) {
			var stickings = myElements[i];
	
			if(force) {
				if(showElseHide)
					stickings.style.visibility = "visible";
				else
					stickings.style.visibility = "hidden";
			} else {
				// no-force means to swap on each call
				if(stickings.style.visibility == "visible")
					stickings.style.visibility = "hidden";
				else 
					stickings.style.visibility = "visible";
				
			}
		}
	}
	
	function isStickingsVisible() {
		var myElements = document.querySelectorAll(".stickings-container");
		for (var i = 0; i < myElements.length; i++) {
			if(myElements[i].style.display == "block")
				return true;
		}
		
		return false;
	}
	
	root.showHideStickings = function(force, showElseHide) {
	
		showHideCSS_ClassDisplay(".stickings-container", force, showElseHide, "block");
		showHideCSS_ClassDisplay(".stickings-label", force, showElseHide, "block");
		
		create_ABC();
		
		return false;  // don't follow the link
	}
	
	root.printMusic = function() {
		var oldMethod = isFirefox();
		
		if(oldMethod) {
			// hide everything but the music and force a print
			// doesn't work for browsers that don't have a blocking print call. (iOS)
			showHideNonPrintableAreas(false);	
			var style = window.getComputedStyle(document.body);
			var oldColor = style.backgroundColor;
			document.body.style.backgroundColor = "#FFF";
			
			var svgTargetDiv = document.getElementById("svgTarget");
			var style = window.getComputedStyle(svgTargetDiv);
			var oldBoxShadow = style.boxShadow;
		
			svgTargetDiv.style.boxShadow = "none";
			
			window.print();
			
			// reset
			document.body.style.backgroundColor = oldColor;
			svgTargetDiv.style.boxShadow = oldBoxShadow;
			
			showHideNonPrintableAreas(true);
		} else {
			// open a new window just for printing
			var win = window.open("", class_app_title + " Print");
			win.document.body.innerHTML = "<title>" + class_app_title + "</title>\n";
			win.document.body.innerHTML += document.getElementById("svgTarget").innerHTML;
			win.print();
		}
		
	}

		
	// public function.
	// This function initializes the data for the groove writer web page
	root.runsOnPageLoad = function() {
		
		// setup for URL shortener
		gapi.client.setApiKey('AIzaSyBnjOal_AHASONxMQSZPk6E5w9M04CGLcA'); 
		gapi.client.load('urlshortener', 'v1',function(){});
		
		//setupHotKeys();  Runs on midi load now
		
		setupPermutationMenu();
						
		// set the background color of the current subdivision
		document.getElementById(class_notes_per_measure + "ths").style.background = "orange";
		
		// add html for the midi player
		myGrooveUtils.AddMidiPlayerToPage("midiPlayer");
		
		// load the groove from the URL data if it was passed in.
		set_Default_notes(window.location.search);
		
		myGrooveUtils.midiEventCallbacks.loadMidiDataEvent = function(myroot) { 
			
			var midiURL = createMidiUrlFromClickableUI("our_MIDI");
			myGrooveUtils.loadMIDIFromURL(midiURL);
			myGrooveUtils.midiResetNoteHasChanged();
			root.updateGrooveDBSource();
		}
		
		myGrooveUtils.midiEventCallbacks.notePlaying = function(myroot, note_type, note_position) {
			hilight_note(note_type, (note_position/myGrooveUtils.getNoteScaler(class_notes_per_measure, 4, 4)));
		}
		
		myGrooveUtils.oneTimeInitializeMidi();
		
	}
	
	// takes a string of notes encoded in a serialized string and sets the notes on or off
	// uses drum tab format adapted from wikipedia: http://en.wikipedia.org/wiki/Drum_tablature
	//
	//
	//  HiHat support:   
	//     	x: normal
	//     	X: accent
	//     	o: open
	//		+: close
	//     	c: crash
	//      r: ride
	//     	-: off
	//
	//   Snare support:
	//     	o: normal
	//     	O: accent
	//     	g: ghost
	//      x: cross stick
	//     	-: off
	//  
	//   Kick support:
	//     	o: normal
	//     	x: hi hat splash with foot
	//     	X: kick & hi hat splash with foot simultaneously
	//
	//  Note that "|" and " " will be skipped so that standard drum tabs can be applied
	//  Example:
	//     H=|x---x---x---x---|x---x---x---x---|x---x---x---x---|
	// or  H=x-x-x-x-x-x-x-x-x-x-x-x-
	//     S=|----o-------o---|----o-------o---|----o-------o---|
	// or  S=--o---o---o---o---o---o-
	//     B=|o-------o-------|o-------o-o-----|o-----o-o-------|
	// or  B=o---o---o----oo-o--oo---|
	//
	function setNotesFromURLData(drumType, noteString, numberOfMeasures)  {
		var setFunction;
		
		if(drumType == "Stickings") {
			setFunction = set_sticking_state;
		} else if(drumType == "H") {
			setFunction = set_hh_state;
		} else if(drumType == "S") {
			setFunction = set_snare_state;
		} else if(drumType == "K") {
			setFunction = set_kick_state;
		}
		
		// decode the %7C url encoding types
		noteString = decodeURIComponent(noteString);
		
		// ignore ":" and "|" by removing them
		var notes = noteString.replace(/:|\|/g, '');
	
		
		
		// multiple measures of "how_many_notes"
		var notesOnScreen = class_notes_per_measure * numberOfMeasures;
		
		var noteStringScaler = 1;
		var displayScaler = 1;
		if(notes.length > notesOnScreen && notes.length/notesOnScreen >= 2) {
			// if we encounter a 16th note groove for an 8th note board, let's scale it	down	
			noteStringScaler = Math.ceil(notes.length/notesOnScreen);
		} else if(notes.length < notesOnScreen && notesOnScreen/notes.length >= 2) {
			// if we encounter a 8th note groove for an 16th note board, let's scale it up
			displayScaler = Math.ceil(notesOnScreen/notes.length);
		} 

			
		//  DisplayIndex is the index into the notes on the HTML page  starts at 1/32\n%%flatbeams
		var displayIndex = 0;
		var topDisplay = class_notes_per_measure*class_number_of_measures;
		for(var i=0; i < notes.length && displayIndex < topDisplay; i += noteStringScaler, displayIndex += displayScaler) {
		
			switch(notes[i]) {
			case "c":
				setFunction(displayIndex, "crash");
				break;
			case "g":
				setFunction(displayIndex, "ghost");
				break;
			case "l":
			case "L":
				if(drumType == "Stickings")
					setFunction(displayIndex, "left")
			break;
			case "O":
				setFunction(displayIndex, "accent");
				break;
			case "o":
				if(drumType == "H")
					setFunction(displayIndex, "open");
				else
					setFunction(displayIndex, "normal");
				break;
			case "r":
			case "R":
				if(drumType == "H")
					setFunction(displayIndex, "ride");
				else if(drumType == "Stickings")
					setFunction(displayIndex, "right")
				break;
			case "x":
				if(drumType == "S")
					setFunction(displayIndex, "xstick");
				else if(drumType == "K")
					setFunction(displayIndex, "splash");
				else
					setFunction(displayIndex, "normal");
				break;
			case "X":
				if(drumType == "K")
					setFunction(displayIndex, "kick_and_splash");
				else	
					setFunction(displayIndex, "accent");
				break;
			case "+":
				setFunction(displayIndex, "close");
				break;
			case "-":
				setFunction(displayIndex, "off");
				break;
			default:
				alert("Bad note in setNotesFromURLData: " + notes[i])
				break;
			}	
		}
	}
	
	function setNotesFromABCArray(drumType, abcArray, numberOfMeasures)  {
		var setFunction;
		
		// multiple measures of "how_many_notes"
		var notesOnScreen = class_notes_per_measure * numberOfMeasures;
		
		var noteStringScaler = 1;
		var displayScaler = 1;
		if(abcArray.length > notesOnScreen && abcArray.length/notesOnScreen >= 2) {
			// if we encounter a 16th note groove for an 8th note board, let's scale it	down	
			noteStringScaler = Math.ceil(abcArray.length/notesOnScreen);
		} else if(abcArray.length < notesOnScreen && notesOnScreen/notes.length >= 2) {
			// if we encounter a 8th note groove for an 16th note board, let's scale it up
			displayScaler = Math.ceil(notesOnScreen/notes.length);
		} 
		
		if(drumType == "Stickings") {
			setFunction = set_sticking_state;
		} else if(drumType == "H") {
			setFunction = set_hh_state;
		} else if(drumType == "S") {
			setFunction = set_snare_state;
		} else if(drumType == "K") {
			setFunction = set_kick_state;
		}
	
		//  DisplayIndex is the index into the notes on the HTML page  starts at 1/32\n%%flatbeams
		var displayIndex = 0;
		var topDisplay = class_notes_per_measure*class_number_of_measures;
		for(var i=0; i < abcArray.length && displayIndex < topDisplay; i += noteStringScaler, displayIndex += displayScaler) {
		
			switch(abcArray[i]) {
			case constant_ABC_STICK_R:
				setFunction(displayIndex, "right");
				break;
			case constant_ABC_STICK_L:
				setFunction(displayIndex, "left");
				break;
			case constant_ABC_STICK_OFF:
				setFunction(displayIndex, "off");
				break;
			case constant_ABC_HH_Ride: 
				setFunction(displayIndex, "ride");
				break;
			case constant_ABC_HH_Crash:   
				setFunction(displayIndex, "crash");
				break;
			case constant_ABC_HH_Open: 
				setFunction(displayIndex, "open");
				break;
			case constant_ABC_HH_Close:  
				setFunction(displayIndex, "close");
				break;
			case constant_ABC_HH_Accent: 
				setFunction(displayIndex, "accent");
				break;
			case constant_ABC_HH_Normal:
				setFunction(displayIndex, "normal");
				break;
			case constant_ABC_SN_Ghost:
				setFunction(displayIndex, "ghost");
				break;
			case constant_ABC_SN_Accent:
				setFunction(displayIndex, "accent");
				break;
			case constant_ABC_SN_Normal:
				setFunction(displayIndex, "normal");
				break;
			case constant_ABC_SN_XStick:
				setFunction(displayIndex, "xstick");
				break;
			case constant_ABC_KI_SandK:
				setFunction(displayIndex, "kick_and_splash");
				break;
			case constant_ABC_KI_Splash:
				setFunction(displayIndex, "splash");
				break;
			case constant_ABC_KI_Normal:
				setFunction(displayIndex, "normal");
				break;
			case false:
				setFunction(displayIndex, "off")
				break;
			default:
				alert("Bad note in setNotesFromABCArray: " + abcArray[i])
				break;
			}	
		}
	}
	
	// get a really long URL that encodes all of the notes and the rest of the state of the page.
	// this will allow us to bookmark or reference a groove.
	//
	function get_FullURLForPage() {
	
		var fullURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
		
		// # of notes
		fullURL += "?Div=" + class_notes_per_measure;
		
		var title = document.getElementById("tuneTitle").value.trim();
		if(title != "")
			fullURL += "&Title=" + encodeURI(title);
			
		var author = document.getElementById("tuneAuthor").value.trim();
		if(author != "")
			fullURL += "&Author=" + encodeURI(author);
		
		var comments = document.getElementById("tuneComments").value.trim();
		if(comments != "")
			fullURL += "&Comments=" + encodeURI(comments);
		
		fullURL += "&Tempo=" + myGrooveUtils.getTempo();
		
		if(myGrooveUtils.getSwing() > 0)
			fullURL += "&Swing=" + myGrooveUtils.getSwing();
		
		// # of measures
		fullURL += "&Measures=2";
		
		if(isSecondMeasureVisable())
			fullURL += "&showMeasures=2";
		else	
			fullURL += "&showMeasures=1";
		
		// notes
		var HH = "&H=|"
		var Snare = "&S=|";
		var Kick = "&K=|";
		var Stickings = "&Stickings=|";
		
		// run through both measures.
		var topIndex = class_notes_per_measure*class_number_of_measures;
		for(var i=0; i < topIndex; i++) {
			Stickings += get_sticking_state(i, "URL"); 
			HH += get_hh_state(i, "URL"); 
			Snare += get_snare_state(i, "URL");
			Kick += get_kick_state(i, "URL");
		
			if(((i+1) % class_notes_per_measure) == 0) {
				Stickings += "|";
				HH += "|";
				Snare += "|";
				Kick += "|";
			}
		}
		
		fullURL += HH + Snare + Kick;
		
		// only add if we need them.  // they are long and ugly. :)
		if(isStickingsVisible())
			fullURL += Stickings;
		
		return fullURL;
	}
	
	root.show_FullURLPopup = function() {
		var popup = document.getElementById("fullURLPopup");
				
		var ShareButton = new Share("#shareButton", {
		  networks: {
			facebook: {
				before: function() {
					this.url = document.getElementById("fullURLTextField").value;
					this.description = "Check out this groove.";
				},
			  app_id: "839699029418014",
			},
			google_plus: {
				before: function() {
					this.url = encodeURIComponent(document.getElementById("fullURLTextField").value);
					this.description = "Check out this groove.";
				},
			},
			twitter: {
				before: function() {
					this.url = encodeURIComponent(document.getElementById("fullURLTextField").value);
					this.description = "Check out this groove. %0A%0A " + encodeURIComponent(document.getElementById("fullURLTextField").value);
				},
			},
			pinterest: {
				enabled: false,
			},
			email: {
				before: function() {
					this.url = document.getElementById("fullURLTextField").value;
					this.description = "Check out this groove. %0A%0A " + encodeURIComponent(document.getElementById("fullURLTextField").value);
				},
				after: function() {
					console.log("User shared:", this.url);
				}
			},
		  }
		});
				
		if(popup) {
			var fullURL = get_FullURLForPage();
			var textField = document.getElementById("fullURLTextField");
			textField.value = fullURL;
			
			popup.style.visibility = "visible";
			
			// select the URL for copy/paste
			textField.focus();
			textField.select();
			
			// fill in link at bottom
			document.getElementById("fullURLLink").href = fullURL;
		}
	}
	
	root.close_FullURLPopup = function() {
		var popup = document.getElementById("fullURLPopup");
				
		if(popup) 
			popup.style.visibility = "hidden";
	}
	
	function get_ShortendURL(fullURL, cssIdOfTextFieldToFill) {
	
		if(gapi.client.urlshortener) {
			var request = gapi.client.urlshortener.url.insert({
				'resource': {
				  'longUrl': fullURL
				}
			});
			request.execute(function(response) {      
				if((response.id != null)){
					var textField = document.getElementById(cssIdOfTextFieldToFill);
					textField.value = response.id;
				
					// select the URL for copy/paste
					textField.focus();
					textField.select();
				}
			});
		} else {
			alert("Error: URL Shortener API is not loaded")
		}
		
	}
	
	root.shortenerCheckboxChanged = function () {
		if(document.getElementById("shortenerCheckbox").checked)
			get_ShortendURL(get_FullURLForPage(), 'fullURLTextField');
		else	
			show_FullURLPopup();
	}
	
	function set_Default_notes(encodedURLData) {
		var Division;
		var Stickings;
		var HH;
		var Snare;
		var Kick;
		var numberOfMeasures = 2;
		var stickings_set_from_URL = false;
		
		var myGrooveData = myGrooveUtils.getGrooveDataFromUrlString(encodedURLData);
		
		if(myGrooveData.notesPerMeasure != class_notes_per_measure) {
			changeDivisionWithNotes(myGrooveData.notesPerMeasure);
		}
		
		setNotesFromABCArray("Stickings", myGrooveData.sticking_array, numberOfMeasures);
		setNotesFromABCArray("H", myGrooveData.hh_array, numberOfMeasures);
		setNotesFromABCArray("S", myGrooveData.snare_array, numberOfMeasures);
		setNotesFromABCArray("K", myGrooveData.kick_array, numberOfMeasures);
		
		if(myGrooveData.showMeasures == 2)
			root.showHideSecondMeasure(true, true);
		else
			root.showHideSecondMeasure(true, false);
		
		if(myGrooveData.showStickings) 
			root.showHideStickings(true, true);
		
		document.getElementById("tuneTitle").value = myGrooveData.title;
						
		document.getElementById("tuneAuthor").value = myGrooveData.author;
		
		document.getElementById("tuneComments").value = myGrooveData.comments;
		
		myGrooveUtils.setTempo(myGrooveData.tempo);
		
		myGrooveUtils.swingUpdate(myGrooveData.swingPercent);
		
		create_ABC();
	}
	
	root.loadNewGroove = function(encodedURLData)  {
		set_Default_notes(encodedURLData)
	}
	
	function getABCDataWithLineEndings() {
		var myABC = document.getElementById("ABCsource").value;

		// add proper line endings for windows
		myABC = myABC.replace(/\r?\n/g, "\r\n");
		
		return myABC;
	}
		
	root.saveABCtoFile = function() {
		myABC = getABCDataWithLineEndings();
		
		myURL = 'data:text/plain;charset=utf-8;base64,' + btoa(myABC);
		
		alert("Use \"Save As\" to save the new page to a local file");
		window.open(myURL);
		
	}
	
	// change the base division to something else.
	// eg  16th to 8ths or   32nds to 8th note triplets
	// need to re-layout the html notes, change any globals and then reinitialize
	function changeDivisionWithNotes (newDivision, Stickings, HH, Snare, Kick) {
		var oldDivision = class_notes_per_measure;
		var wasSecondMeasureVisabile = isSecondMeasureVisable();
		var wasStickingsVisable = isStickingsVisible();
		class_notes_per_measure = newDivision;
		
		var newHTML = "";
		for(var cur_measure=1; cur_measure <= class_number_of_measures; cur_measure++) {
			newHTML += root.HTMLforStaffContainer(cur_measure, (cur_measure-1)*class_notes_per_measure);
		}
		
		// rewrite the HTML for the HTML note grid
		document.getElementById("musicalInput").innerHTML = newHTML;
		
		if(wasSecondMeasureVisabile)
			root.showHideSecondMeasure(true, true);
		
		if(wasStickingsVisable)
			root.showHideStickings(true, true);
		
		// now set the right notes on and off
		if(Stickings && HH && Snare && Kick) {
			setNotesFromURLData("Stickings", Stickings, 2);
			setNotesFromURLData("H", HH, 2);
			setNotesFromURLData("S", Snare, 2);
			setNotesFromURLData("K", Kick, 2);
		}
		
		// un-highlight the old div 
		document.getElementById(oldDivision + "ths").style.background = "#FFFFCC";
		
		// highlight the new div
		document.getElementById(class_notes_per_measure + "ths").style.background = "orange";
		
		// if the permutation menu is not "none" this will change the layout
		// otherwise it should do nothing
		setupPermutationMenu();
		
		// enable or disable swing
		myGrooveUtils.swingEnabled( myGrooveUtils.doesDivisionSupportSwing(newDivision) );
		// update the swing output display
		myGrooveUtils.swingUpdate();
	}
	
	// change the base division to something else.
	// eg  16th to 8ths or   32nds to 8th note triplets
	// need to re-layout the html notes, change any globals and then reinitialize
	root.changeDivision = function(newDivision) {
		var uiStickings="|";
		var uiHH="|";
		var uiSnare="|";
		var uiKick="|";
		
		if(!myGrooveUtils.isTripletDivision(class_notes_per_measure, 4, 4) && !myGrooveUtils.isTripletDivision(newDivision)) {
			// get the encoded notes out of the UI.
			// run through both measures.
			var topIndex = class_notes_per_measure*class_number_of_measures;
			for(var i=0; i < topIndex; i++) {
					uiStickings += get_sticking_state(i, "URL"); 
					uiHH += get_hh_state(i, "URL"); 
					uiSnare += get_snare_state(i, "URL");
					uiKick += get_kick_state(i, "URL");
				
				if(i == class_notes_per_measure-1) {
					uiStickings += "|"
					uiHH += "|"
					uiSnare += "|";
					uiKick += "|";
				}
			}
			
			// override the hi-hat if we are going to a higher division.
			// otherwise the notes get lost in translation (not enough)
			if(newDivision > class_notes_per_measure)
				uiHH = myGrooveUtils.GetDefaultHHGroove(newDivision, 2);
		} else {
			// triplets don't scale well, so use defaults when we change
			uiStickings = myGrooveUtils.GetDefaultStickingsGroove(newDivision, 2);
			uiHH = myGrooveUtils.GetDefaultHHGroove(newDivision, 2);
			uiSnare = myGrooveUtils.GetDefaultSnareGroove(newDivision, 2);
			uiKick = myGrooveUtils.GetDefaultKickGroove(newDivision, 2);
		}
		
		changeDivisionWithNotes(newDivision, uiStickings, uiHH, uiSnare, uiKick);
		
		create_ABC();
	}
		
	// public function
	// function to create HTML for the music staff and notes.   We usually want more than one of these
	// baseIndex is the index for the css labels "staff-container1, staff-container2"
	// indexStartForNotes is the index for the note ids.  
	root.HTMLforStaffContainer = function(baseindex, indexStartForNotes) {
		var newHTML = ('\
			<div class="staff-container" id="staff-container' + baseindex + '">\
				<div class="row-container">\
					<div class="line-labels">\
						<div class="stickings-label" onClick="myGrooveWriter.noteLabelClick(event, \'stickings\', ' + baseindex + ')" oncontextmenu="event.preventDefault(); myGrooveWriter.noteLabelClick(event, \'stickings\', ' + baseindex + ')">stickings</div>\
					</div>\
					<div class="music-line-container">\
						\
						<div class="notes-container">');
						
						newHTML += ('\
							<div class="stickings-container">\
								<div class="opening_note_space"> </div>');
								for(var i = indexStartForNotes; i < class_notes_per_measure+indexStartForNotes; i++) {
								
									newHTML += ('\
										<div id="sticking' + i + '" class="sticking">\
											<div class="sticking_right"  id="sticking_right' + i + '"  onClick="myGrooveWriter.noteLeftClick(event, \'sticking\', ' + i + ')" oncontextmenu="event.preventDefault(); myGrooveWriter.noteRightClick(event, \'sticking\', ' + i + ') onmouseenter="myGrooveWriter.noteOnMouseEnter(event, \'sticking\'">R</div>\
											<div class="sticking_left"  id="sticking_left' + i + '"  onClick="myGrooveWriter.noteLeftClick(event, \'sticking\', ' + i + ')" oncontextmenu="event.preventDefault(); myGrooveWriter.noteRightClick(event, \'sticking\', ' + i + ')", ' + i + ')">L</div>\
										</div>\
									');
									
									// add space between notes, exept on the last note
									if((i-(indexStartForNotes-1)) % myGrooveUtils.noteGroupingSize(class_notes_per_measure, 4, 4) == 0 && i < class_notes_per_measure+indexStartForNotes-1) {
										newHTML += ('<div class="space_between_note_groups"> </div> ');
									}
								}
							newHTML += ('<div class="end_note_space"></div>\n</div>');
						
						newHTML += ('\
						</div>\
					</div>\
				</div>');
				
		newHTML += ('\
				<div class="row-container">\
					<div class="line-labels">\
						<div class="hh-label" onClick="myGrooveWriter.noteLabelClick(event, \'hh\', ' + baseindex + ')" oncontextmenu="event.preventDefault(); myGrooveWriter.noteLabelClick(event, \'hh\', ' + baseindex + ')">hi-hat</div>\
						<div class="snare-label" onClick="myGrooveWriter.noteLabelClick(event, \'snare\', ' + baseindex + ')" oncontextmenu="event.preventDefault(); myGrooveWriter.noteLabelClick(event, \'snare\', ' + baseindex + ')">snare</div>\
						<div class="kick-label" onClick="myGrooveWriter.noteLabelClick(event, \'kick\', ' + baseindex + ')" oncontextmenu="event.preventDefault(); myGrooveWriter.noteLabelClick(event, \'kick\', ' + baseindex + ')">kick</div>\
					</div>\
					<div class="music-line-container">\
						\
						<div class="notes-container">\
						<div class="staff-line-1"></div>\
						<div class="staff-line-2"></div>\
						<div class="staff-line-3"></div>\
						<div class="staff-line-4"></div>\
						<div class="staff-line-5"></div>');

						
						newHTML += ('\
							<div class="hi-hat-container">\
								<div class="opening_note_space"> </div>');
								for(var i = indexStartForNotes; i < class_notes_per_measure+indexStartForNotes; i++) {
								
									newHTML += ('\
										<div id="hi-hat' + i + '" class="hi-hat" onClick="myGrooveWriter.noteLeftClick(event, \'hh\', ' + i + ')" oncontextmenu="event.preventDefault(); myGrooveWriter.noteRightClick(event, \'hh\', ' + i + ')" onmouseenter="myGrooveWriter.noteOnMouseEnter(event, \'hh\', ' + i + ')">\
											<div class="hh_crash"  id="hh_crash'  + i + '">*</div>\
											<div class="hh_ride"   id="hh_ride'   + i + '">R</div>\
											<div class="hh_cross"  id="hh_cross'  + i + '">X</div>\
											<div class="hh_open"   id="hh_open'   + i + '">o</div>\
											<div class="hh_close"  id="hh_close'  + i + '">+</div>\
											<div class="hh_accent" id="hh_accent' + i + '">&gt;</div>\
										</div>\
									');
									
									if((i-(indexStartForNotes-1)) % myGrooveUtils.noteGroupingSize(class_notes_per_measure, 4, 4) == 0 && i < class_notes_per_measure+indexStartForNotes-1) {
										newHTML += ('<div class="space_between_note_groups"> </div> ');
									}
								}
							newHTML += ('<div class="end_note_space"></div>\n</div>');
							
							newHTML += ('\
							<div class="snare-container">\
								<div class="opening_note_space"> </div> ');
								for(var i = indexStartForNotes; i < class_notes_per_measure+indexStartForNotes; i++) {
									newHTML += ('\
										<div id="snare' + i + '" class="snare" onClick="myGrooveWriter.noteLeftClick(event, \'snare\', ' + i + ')" oncontextmenu="event.preventDefault(); myGrooveWriter.noteRightClick(event, \'snare\', ' + i + ')" onmouseenter="myGrooveWriter.noteOnMouseEnter(event, \'snare\', ' + i + ')">\
										<div class="snare_ghost"  id="snare_ghost'  + i + '">(&bull;)</div>\
										<div class="snare_circle" id="snare_circle' + i + '"></div>\
										<div class="snare_xstick" id="snare_xstick' + i + '">X</div>\
										<div class="snare_accent" id="snare_accent' + i + '">&gt;</div>\
										</div> \
										');
										
									if((i-(indexStartForNotes-1)) % myGrooveUtils.noteGroupingSize(class_notes_per_measure, 4, 4) == 0 && i < class_notes_per_measure+indexStartForNotes-1) {
										newHTML += ('<div class="space_between_note_groups"> </div> ');
									}
								}
							newHTML += ('<div class="end_note_space"></div>\n</div>');
							
							newHTML += ('\
							<div class="kick-container">\
								<div class="opening_note_space"> </div> ');
								for(var i = indexStartForNotes; i < class_notes_per_measure+indexStartForNotes; i++) {
									newHTML += ('\
										<div id="kick' + i + '" class="kick" onClick="myGrooveWriter.noteLeftClick(event, \'kick\', ' + i + ')" oncontextmenu="event.preventDefault(); myGrooveWriter.noteRightClick(event, \'kick\', ' + i + ')" onmouseenter="myGrooveWriter.noteOnMouseEnter(event, \'kick\', ' + i + ')">\
										<div class="kick_splash" id="kick_splash' + i + '">X</div></a>\
										<div class="kick_circle" id="kick_circle' + i + '"></div></a>\
										</div> \
									');
									
									if((i-(indexStartForNotes-1)) % myGrooveUtils.noteGroupingSize(class_notes_per_measure, 4, 4) == 0 && i < class_notes_per_measure+indexStartForNotes-1) {
										newHTML += ('<div class="space_between_note_groups"> </div> ');
									}
								}
							newHTML += ('<div class="end_note_space"></div>\n</div>');
							
			newHTML += ('\
					</div>\
				</div>\
			</div>\
		</div>')
		
		return newHTML;
	}  // end function HTMLforStaffContainer
};  // end of class
		
		