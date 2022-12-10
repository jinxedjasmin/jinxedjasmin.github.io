
function countBs() {
    var meinString = prompt ("Zähle alle B's im Wort:");
    var zählegrossb=meinString.split("B").length-1;
    //var zählekleinb=meinString.split("b").length-1;
    zählebs = zählegrossb+zählekleinb;
    document.write(zählebs);
}

//countBs(); 

function countChar() {
 var dieseswort = prompt ("Zähle alle Zeichen im Wort:");
 var zählezeichen = prompt("Welches Zeichen willst du zählen?");
    if (zählezeichen.length>1){
        alert("Nur EIN Zeichen bitte :(");
    }
    else {
        var anzahl = dieseswort.split(zählezeichen).length-1;
        document.write(anzahl);
    }

}

//countChar(); 


let countCharpfeilchen = (zählezeichen) => { 
    var dieseswort = prompt ("Zähle alle Zeichen im Wort:");
    var zählezeichen = prompt("Welches Zeichen willst du zählen?");
   if (zählezeichen.length>1){
       alert("Nur EIN Zeichen bitte :(");
   }
   else {
       var anzahl = dieseswort.split(zählezeichen).length-1;
       document.write(anzahl);
   }
}

countCharpfeilchen();

/*let countBs = () => countCharpfeilchen("B");
countBs();*/


