
		var interval = 0;
		
        $(document).ready(function () {
                vr = document.getElementById("vr"),
                vg = document.getElementById("vg"),
                vb = document.getElementById("vb"),
                sp = document.getElementById("sample"),
                bl = document.getElementById("btn-low"),
                bh = document.getElementById("btn-high"),
                
            
            // this is where colorpicker created
                cp = Raphael.colorwheel(10, 50, 300, "#ffdd00"),
            
                clr = Raphael.color("#ffdd00");
            vr.innerHTML = clr.r;
            vg.innerHTML = clr.g;
            vb.innerHTML = clr.b;
            sp.style.backgroundColor = clr;
            $('#bl').mousedown(function() {
            	interval = setInterval("dimDown()",100);
			});;
            $('#bh').mousedown(function() {
            	interval = setInterval("dimUp()",100);
			});
            $('#bl').touchstart(function() {
            	interval = setInterval("dimDown()",100);
			});;
            $('#bh').touchstart(function() {
            	interval = setInterval("dimUp()",100);
			});
            $("body").mouseup(function() {
            	clearInterval(interval);
			});
            $("body").touchend(function() {
            	clearInterval(interval);
			});       
            // assigning onchange event handler
            var onchange = function (item) {
                return function (clr) {
                    //out.value = clr.replace(/^#(.)\1(.)\2(.)\3$/, "#$1$2$3");
                    item.color(clr);
                    sample.style.backgroundColor = clr;
                    //h1.style.color = (Raphael.rgb2hsb(clr).h > .55 && Raphael.rgb2hsb(clr).h < .78) ? "#fff" : "#000";
                    //console.log(Raphael.rgb2hsb(clr).h);
                    //console.log(clr);
                    clr = Raphael.color(clr);
                    vr.innerHTML = clr.r;
                    vg.innerHTML = clr.g;
                    vb.innerHTML = clr.b;
                    socket.emit('updateRGB', { r: clr.r, g: clr.g, b: clr.b })
                };
            };
            cp.onchange = onchange(cp);
            // that’s it. Too easy
        });    
        function dimUp(){
			var val = parseInt(vr.innerHTML);				// RED
		  	if (val < 252) vr.innerHTML = val + 4;
			else vr.innerHTML = 255;
			val = parseInt(vg.innerHTML);					// GREEN
		  	if (val < 252) vg.innerHTML = val + 4;
			else vg.innerHTML = 255;
			val = parseInt(vb.innerHTML);					// BLUE
		  	if (val < 252) vb.innerHTML = val + 4;
			else vb.innerHTML = 255;
			sample.style.backgroundColor="rgb(" + vr.innerHTML + ", "+ vg.innerHTML + ", "+ vb.innerHTML + ")";
			$.get("c", { r: vr.innerHTML, g: vg.innerHTML, b: vb.innerHTML } );
		};       
		function dimDown(){
			var val = parseInt(vr.innerHTML);
			if (val > 3) vr.innerHTML = val - 4;
			else vr.innerHTML = 0;
			val = parseInt(vg.innerHTML);
			if (val > 3) vg.innerHTML = val - 4;
			else vg.innerHTML = 0;
			val = parseInt(vb.innerHTML);
			if (val > 3) vb.innerHTML = val - 4;
			else vb.innerHTML = 0;
			sample.style.backgroundColor="rgb(" + vr.innerHTML + ", "+ vg.innerHTML + ", "+ vb.innerHTML + ")";
			$.get("c", { r: vr.innerHTML, g: vg.innerHTML, b: vb.innerHTML } );
		};        
        function sendUpdate(elem) {
    		//console.log(elem.value);
		}