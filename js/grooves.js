/*
 * Grooves class.   Contains some common grooves that is used to populate the grooves menu
 *
 *
 */

if (typeof(grooves) === "undefined")
	var grooves = {};

(function () {
	"use strict";

	var root = grooves;

	root.Rock_Grooves = {
		'Empty 16th Note Groove':'?TimeSig=4/4&Div=16&Tempo=80&Measures=1&H=|----------------|&S=|----------------|&K=|----------------|&T1=|----------------|&T4=|----------------|',
		'Quarter Note Rock':'?TimeSig=4/4&Div=8&Title=Quarter%20Note%20Rock&Comments=aka.%20Crotchets&Tempo=80&Measures=1&H=|x-x-x-x-|&S=|--O---O-|&K=|o---o---|',
		'Eighth Note Rock':'?TimeSig=4/4&Div=8&Title=Eighth%20Note%20Rock&Comments=aka.%20Quavers&Tempo=80&Measures=1&H=|xxxxxxxx|&S=|--O---O-|&K=|o---o---|',
		'Sixteenth Note Rock':'?TimeSig=4/4&Div=16&Title=Sixteenth%20Note%20Rock&Comments=aka.%20SemiQuavers&Tempo=80&Measures=1&H=|xxxx-xxxxxxx-xxx|&S=|----O-------O---|&K=|o-------o-------|&Stickings=|RLRLRLRLRLRLRLRL|',
		'Four to the Floor':'?TimeSig=4/4&Div=8&Title=Four%20to%20the%20Floor&Tempo=117&Measures=1&H=|xxxxxxxx|&S=|--o---o-|&K=|o-o-o-o-|',
		'Train Beat':'?TimeSig=4/4&Div=16&Title=Train%20Beat&Tempo=95&Measures=1&H=|----------------|&S=|ggOgggOgggOgggOO|&K=|o-x-o-x-o-x-o-x-|'
	}

	root.Funk_Grooves = { 
		'Basic Boogaloo Funk':'?TimeSig=4/4&Div=16&Title=Basic%20Boogaloo%20Funk&Tempo=80&Measures=1&H=|x-x-x-x-x-x-x-o-|&S=|----o--g----o---|&K=|o-------o-o-----|&Stickings=|c-c-c-ccc-c-c-c-|',
		'Basic Chameleon Funk':'?TimeSig=4/4&Div=16&Title=Basic%20Chameleon%20Funk&Tempo=90&Measures=1&H=|x-x-x-x-x-x-x-x-|&S=|---o--------o---|&K=|o--------oo---o-|&Stickings=|c-ccc-c-ccc-c-c-|',
		'Cold Sweat Funk':'?TimeSig=4/4&Div=16&Title=Cold%20Sweat%20Funk&Tempo=104&Measures=2&H=|x-o-x-x-x-o-x-x-|x-o-x-x-x-o-x-x-|&S=|----O--g------O-|-g--O--g----O---|&K=|o-------o-o-----|--o-----o-o---o-|'
	}

	root.Triplet_Grooves = {
		'12/8 Blues':'?TimeSig=4/4&Div=12&Title=Twelve-Eight%20Blues%20Feel&Tempo=70&Measures=1&H=|rrrrrrrrrrrr|&S=|---o-----o--|&K=|o--x--o--x-o|',
		'Basic Shuffle':'?TimeSig=4/4&Div=12&Title=Basic%20Shuffle&Tempo=90&Measures=1&H=|x-xx-xx-xx-x|&S=|---O-----O--|&K=|o-----o-----|',
		'Hand to Hand Shuffle':'?TimeSig=4/4&Div=12&Title=Hand%20to%20Hand%20Shuffle&Comments=Everybody%20wants%20to%20rule%20the%20world...&Tempo=90&Measures=1&H=|x-x-x-x-x-x-|&S=|-g-O-g-g-O-g|&K=|o-----o-----|',
		'Jazz Ride 4 feel':'?TimeSig=4/4&Div=12&Title=Jazz%20Ride%20in%204&Comments=Try%20%27feathering%27%20the%20Bass%20Drum&Tempo=80&Measures=1&H=|r--r-rr--r-r|&S=|------------|&K=|---x-----x--|',
		'Jazz HiHat 2 feel':'?TimeSig=4/4&Div=12&Title=Jazz%20HiHat%20in%202&Tempo=120&Measures=1&H=|o--X-oo--X-o|&S=|------------|&K=|---x-----x--|',
		'Jazz Waltz':'?TimeSig=3/4&Div=12&Title=Jazz%20Waltz%20in%20%27One%27&Tempo=120&Measures=1&H=|r--r-rr--|&S=|--------g|&K=|o--x-----|',
		'Half-Time Shuffle in 8th Notes':'?TimeSig=4/4&Div=12&Title=Half%20Time%20Shuffle&Tempo=80&Measures=1&H=|x-xx-xx-xx-x|&S=|-g--g-Og--g-|&K=|o-----------|',
		'Half-Time Shuffle in 16th Notes':'?TimeSig=4/4&Div=24&Title=Half-Time%20Shuffle%20in%2016th%20Notes.%20&Tempo=85&Measures=1&H=|x-xx-xx-xx-xx-xx-xx-xx-x|&S=|-g--g-Og--g--g--g-Og--g-|&K=|o-----------o-----------|',
		'Purdie Shuffle':'?TimeSig=4/4&Div=12&Title=Purdie%20Shuffle&Tempo=120&Measures=1&H=|x-xx-xx-xx-x|&S=|-g--g-Og--g-|&K=|o----o-----o|'
	}

	root.World_Grooves = {
		'Basic Afro-Beat':'?TimeSig=2/4&Div=16&Title=Basic%20Afro-Beat&Tempo=112&Measures=1&H=|x-x-xxx-|&S=|---O--O-|&K=|o---o---|',
		'Mozambique (Gadd)':'?TimeSig=4/4&Div=8&Title=Mozambique%20(Gadd)&Comments=Late%20in%20the%20Evening&Tempo=200&Measures=2&H=|m-m-mm-m|-mm-mm-m|&S=|O-------|O-------|&K=|X---X---|X---X---|&T1=|---o----|---o----|&T4=|------o-|------o-|&Stickings=|B-RLRRLR|LRRLRRLR|',
		'Son Clave 2:3':'?TimeSig=4/4&Div=8&Title=Son%20Clave%202%3A3&Tempo=200&Measures=2&H=|--------|--------|&S=|--x-x---|x--x--x-|&K=|--------|--------|',
		'Son Clave 3:2':'?TimeSig=4/4&Div=8&Title=Son%20Clave%203%3A2&Tempo=200&Measures=2&H=|--------|--------|&S=|x--x--x-|--x-x---|&K=|--------|--------|',
		'Cuban Cascara 2:3':'?TimeSig=4/4&Div=8&Title=Cuban%20Cascara%202%3A3&Comments=with%20Bombo%20on%20Bass%20Drum&Tempo=200&Measures=2&H=|b-b-bb-b|b-bb-b-b|&S=|--x-x---|x--x--x-|&K=|--------|---o----|',
		'Mambo':'?TimeSig=4/4&Div=8&Title=Mambo%202%3A3&Tempo=180&Measures=2&H=|m-m-mmmm|-mmmm-mm|&S=|--x-----|--x-----|&K=|--xo--x-|--xo--x-|&T1=|------oo|------oo|&T4=|--------|--------|',
		'Bossa Nova':'?TimeSig=4/4&Div=8&Title=Bossa%20Nova&Tempo=140&Measures=2&H=|xxxxxxxx|xxxxxxxx|&S=|--x--x--|x--x--x-|&K=|o-xoo-xo|o-xoo-xo|&T1=|--------|--------|&T4=|--------|--------|',
		'Samba':'?TimeSig=4/4&Div=16&Title=Samba&Tempo=100&Measures=1&H=|r-rrr-rrr-rrr-rr|&S=|o-o----o-o------|&K=|o-xoo-xoo-xoo-xo|&T1=|----oo----------|&T4=|------------o-o-|',
		'Songo':'?TimeSig=4/4&Div=16&Title=Songo&Tempo=80&Measures=1&H=|x---x---x---x---|&S=|--O--g-O-gg--g-g|&K=|---o--o----o--o-|&T1=|----------------|&T4=|----------------|',
		'Reggae One Drop':'?TimeSig=4/4&Div=12&Title=Reggae%20One%20Drop&Tempo=127&Measures=2&H=|x--x--x--x--|x--x--x--x-o|&S=|------x-----|------x-----|&K=|------o-----|------o-----|&T1=|------------|------------|&T4=|------------|------------|',
		'Reggae Four Drop':'?TimeSig=4/4&Div=12&Title=Reggae%20Four%20Drop&Tempo=127&Measures=2&H=|x-xx-xx-xx-o|xxxx-xx-xo--|&S=|------x-----|------x-----|&K=|o--o--o--o--|o--o--o--o--|&T1=|------------|------------|&T4=|------------|------------|',
		'Afro-Cuban 6/8':'?TimeSig=6/8&Div=16&Title=Afro-Cuban%20Bembe%206%2F8&Tempo=68&Measures=1&H=|m-m-mm-m-m-m|&S=|--x-----x---|&K=|X--X--X--X--|&T1=|----oo------|&T4=|----------oo|'
	}

	root.FullArray = {
		"Rock grooves" : root.Rock_Grooves,
		"Funk grooves" : root.Funk_Grooves,
		"Triplet grooves" : root.Triplet_Grooves,
		"World grooves" : root.World_Grooves
	};

	root.isArray = function (myArray) {
		var str = myArray.constructor.toString();
		return (str.indexOf("Object") > -1);
	};

	root.arrayAsHTMLList = function (arrayToPrint) {
		var HTML = '<ul class="grooveListUL">\n';
		for (var key in arrayToPrint) {
			if (root.isArray(arrayToPrint[key])) {
				HTML += '<li class="grooveListHeaderLI">' + key + "</li>\n";
				HTML += root.arrayAsHTMLList(arrayToPrint[key]);
			} else {
				HTML += '<li class="grooveListLI" onClick="myGrooveWriter.loadNewGroove(\'' + arrayToPrint[key] + '\')">' + key + '</li>\n';
			}
		}
		HTML += "</ul>\n";

		return HTML;
	};

	root.getGroovesAsHTML = function () {
		var HTML = "";

		HTML = root.arrayAsHTMLList(root.FullArray);

		return HTML;
	};

})();
