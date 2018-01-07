$.ajax({ url: "intern_list.tsv",
	dataType:"text", 
	success: function(file_content) {
		processData(file_content);
	},
	error: function(xhr){
		alert("An error occured: " + xhr.status + " " + xhr.statusText);
	}
});

var headers;
var data_dicts;

function processData(allText) 
{
	var allTextLines = allText.split(/\r\n|\n/);
	headers = allTextLines[0].split('\t');
	data_dicts = [];

	for (var i=1; i<allTextLines.length; i++) {
		var dict = {}
		var data = allTextLines[i].split('\t');
		if(data.length != headers.length)
		{
			continue;
		}
		for(var j = 0; j < data.length; j++)
		{
			dict[headers[j]] = data[j];
		}
		data_dicts.push(dict);
	}
	console.log(data_dicts);
	ordered_list = sortOnKey(data_dicts,"Name",true);
	console.log(ordered_list);
	makeHTMLElements(data_dicts,ordered_list)
}


function sortOnKey(dicts,key,ascending)
{
	var ordered_list = Array.apply(null, Array(dicts.length)).map(function (_, i) {return i;});
	for(var i  = 0; i < ordered_list.length; i++)
	{
		for(var j  = i+1; j < ordered_list.length; j++)
		{
			if(ascending)
			{
				var out = " " + dicts[ordered_list[j]][key] + " " + dicts[ordered_list[i]][key] + " ";
				if(dicts[ordered_list[j]][key] < dicts[ordered_list[i]][key])
				{
					var tmp = ordered_list[i];
					ordered_list[i] = ordered_list[j];
					ordered_list[j] = tmp;
				}
			}
			else
			{
				if(dicts[ordered_list[j]][key] > dicts[ordered_list[i]][key])
				{
					var tmp = ordered_list[i];
					ordered_list[i] = ordered_list[j];
					ordered_list[j] = tmp;
				}
			}
		}
	}
	return ordered_list;
}

function makeHTMLElements(data_dicts,ordered_list)
{
	var old_elements = document.getElementsByName("reu_listing");
	var num_elements = old_elements.length;
	for(var i = 0; i < num_elements; i++)
	{
		old_elements[0].parentElement.removeChild(old_elements[0]);
	}

	for(var i = 0; i < ordered_list.length; i++)
	{
		this_dict = data_dicts[ordered_list[i]];
		var div = document.createElement("div");
		var header = document.createElement("h2");
		var paragraph1 = document.createElement("p");
		var paragraph2 = document.createElement("p");
		var paragraph3 = document.createElement("p");
		var paragraph4 = document.createElement("p");
		div.setAttribute("class","w3-container w3-card-2 w3-white w3-margin-bottom opp");
		div.setAttribute("name","reu_listing");
		header.setAttribute("class","w3-text-grey w3-padding-16");


		header.textContent = this_dict["Name"]
		paragraph1.textContent = this_dict["Description"]
		paragraph2.textContent = "Deadline: " + this_dict["Deadline"]
		paragraph3.textContent = "Pay: " + this_dict["Pay"]
		paragraph4.innerHTML = "<a href=\""+this_dict["Link"]+"\">"+this_dict["Link"]+"</a>"

		div.appendChild(header);
		div.appendChild(paragraph1);
		div.appendChild(paragraph2);
		div.appendChild(paragraph3);
		div.appendChild(paragraph4);

		document.getElementById("listings").appendChild(div);
	}
}
function userSort()
{
	key = document.getElementById("sort_val").value;
	console.log(sortOnKey(data_dicts,key,true));
	makeHTMLElements(data_dicts,sortOnKey(data_dicts,key,true));
}
