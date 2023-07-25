/**
 * Author: Joshua Hizgiaev
 * Date: 2023/07/21
 * Instructions:
 * Place this in the <head> of your HTML file:
 * <script id="webring" src="https://sitring.eric.si/js/webring.js?id=YOUR_ID_HERE"></script>
 * Make sure in ur html file you have a div with the id "ring" to place the webring in
 */

function getQuery() {
    return document.getElementById('webringjs').src.split('id=')[1];
}

async function getAllNeighbors() {
    let id = getQuery();
    let neighbors;
    let randomNeighbors;
    //Get the random neighbor and the two neighbors
    try {
        const response = await fetch(`https://sitring.eric.si/${id}/neighbors`, {
            method: 'GET',
        });
        const randomResponse =  await fetch(`https://sitring.eric.si/${id}/random`, {
            method: 'GET',
        });

        neighbors = await response.json();
        randomNeighbors = await randomResponse.json();
    }
    catch (error) {
        console.error(error);
    }

    // Make a new JSON object with the random neighbor in the middle
    let newNeighbors = [neighbors[0], randomNeighbors, neighbors[1]];
    //Returns an array of json objects (basically dictionaries)
    return newNeighbors
}

async function constructDiv(){
    let data = await getAllNeighbors();
    let ringLinks = createLinks(data);
    placeLinks(ringLinks);
}

function createLinks(data){
    let ringLinks = [];

    for(var i = 0; i < data.length; i++) {
        let link = window.document.createElement('a');
        link.href = data[i].url;
        link.innerText = data[i].name;
        link.target = "_blank";
        if(i === 1) link.innerHTML = "Random";
        ringLinks.push(link);
        if(ringLinks.length < 5){
            let bullet = document.createTextNode(" • ");
            ringLinks.push(bullet);
        }
    }
    return ringLinks;
}

function createEventListener(ringLinks, i){
    return async function(){
        console.log("clicked");
        let data = await getAllNeighbors();
        console.log(data);
        let newLink = window.document.createElement('a');
        newLink.href = data[1].url;
        newLink.innerText = data[1].name;
        newLink.target = "_blank";
        newLink.innerHTML = "Random";
        this.replaceWith(newLink); // replace the current link element with newLink

        newLink.addEventListener('click', createEventListener(ringLinks, i)); // Add the event listener to the newLink
        ringLinks[i] = newLink; // Replace the link element in the array
    }
}

function placeLinks(ringLinks){
    //Insert an arrow as the first and last element of the array
    let arrowLeft = document.createTextNode("<-");
    let arrowRight = document.createTextNode("->");
    ringLinks.unshift(arrowLeft);
    ringLinks.push(arrowRight);

    let paragraph = document.createElement('p');

    //Insert the links into the DOM
    for(var i = 0; i < ringLinks.length; i++) {
        if(i === 3) {
            ringLinks[i].addEventListener("click", createEventListener(ringLinks, i));
        }
        paragraph.appendChild(ringLinks[i]);
    }
    //Insert a new sentence into the DOM below the links
    paragraph.appendChild(document.createElement("br"));
    let sentence = document.createTextNode("This website is part of the Stevens Students Webring.");
    paragraph.appendChild(sentence);
    document.getElementById("webring").appendChild(paragraph);
}

//Entry point
constructDiv();
