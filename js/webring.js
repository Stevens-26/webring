/**
 * Author: Joshua Hizgiaev
 * Date: 2023/07/21
 * Instructions:
 * Place this in the <head> of your HTML file:
 * <script id="webring" src="https://sitring.eric.si/js/webring.js?id=YOUR_ID_HERE"></script>
 * Make sure in ur html file you have a div with the id "ring" to place the webring in
 */
// Allocate memory to make arrays
var ring = [];
var ringLinks = [];

function getQuery() {
    return document.getElementById("webringjs").src.split("id=")[1]
}

async function getRandomNeighbors() {
    // Use let for efficent memory allocation
    let id = getQuery();
    try {
        const response = await fetch(`https://sitring.eric.si/${id}/random`, {
            method: 'GET',
        });
        const randomNeighbor = await response.json();
        return randomNeighbor;
    } catch (error) {
        console.error(error);
    }
}

async function getNeighbors() {
    // Use let for efficent memory allocation
    let id = getQuery();
    try {
        const response = await fetch(`https://sitring.eric.si/${id}/neighbors`, {
            method: 'GET',
        });
        const neighbors = await response.json();
        return neighbors;
    } catch (error) {
        console.error(error);
    }
}

async function parseNeighbors(){
    let data = await getNeighbors();
    let randomNeighbor = await getRandomNeighbors();
    //Data will always be of length 2, so just push to array in constant time
    ring.push(data[0]);
    ring.push(randomNeighbor);
    ring.push(data[1]);
    for(var i = 0; i < ring.length; i++) {
        createLinks(ring[i]);
    }
    placeLinks(ringLinks);
}


function createLinks(data){
    let link = window.document.createElement('a');
    // Contant time opps
    if(ringLinks.length === 2) {
        link.href = data.url;
        link.innerText = data.name;
        link.innerHTML = "Random";
        link.target = "_blank";
        ringLinks.push(link);
    } else {
        link.href = data.url;
        link.innerText = data.name;
        link.target = "_blank";
        ringLinks.push(link);
    }
    if(ringLinks.length < 5) {
        let bullet = document.createTextNode(" • ");
        ringLinks.push(bullet);
    }
}

function placeLinks(ringLinks){
    //Insert an arrow as the first and last element of the array
    let arrowLeft = document.createTextNode("<-");
    let arrowRight = document.createTextNode("->");
    ringLinks.unshift(arrowLeft);
    ringLinks.push(arrowRight);

    //Insert the links into the DOM
    for(var i = 0; i < ringLinks.length; i++) {
        document.getElementById("webring").appendChild(ringLinks[i]);
    }
    //Insert a new sentence into the DOM below the links
    document.getElementById("webring").appendChild(document.createElement("br"));
    let sentence = document.createTextNode("This website is part of the Stevens Community Webring.");
    document.getElementById("webring").appendChild(sentence);

}

//Entry point
parseNeighbors();
