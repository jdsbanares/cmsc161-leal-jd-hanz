var lines;

function readTextFile(file){
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function ()
	{
		if(rawFile.readyState === 4)
		{
			if(rawFile.status === 200 || rawFile.status == 0)
			{
				lines = rawFile.responseText.split("\n");
				
			}
			
		}
	}	
	rawFile.send(null);
	//alert(lines);
	return lines;
}

/*function main(){
	readTextFile("file:///C:/Users/Acer V5/Desktop/try.txt");
}*/