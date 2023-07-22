/**
 * Author: Joshua Hizgiaev
 * Date: 2023/07/21
 * Instructions:
 * Place this in the <head> of your HTML file:
 * <script id="webring" src="https://sitring.eric.si/js/webring.js?id=YOUR_ID_HERE"></script>
 * Make sure in ur html file you have a div with the id "ring" to place the webring in
 */
var data; 
var ring = [];
var id;

function getQuery() {
    return document.getElementById("webring").src.split("id=")[1]
}

async function getNeighbors() {
    const id = getQuery();
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
    data = await getNeighbors();
    for(var i = 0; i < data.length; i++) {
        ring.push(data[i]);
    }
    for(var i = 0; i < ring.length; i++) {
        createLinks(ring[i]);
    }
}

var ringLinks = [];

function createLinks(data){
    let link = window.document.createElement('a');
    link.href = data.url;
    link.innerText = data.name;
    link.target = "_blank";
    ringLinks.push(link);

    if (ringLinks.length === 1) {
        // Insert • This site is part of the Stevens Students Webring • after the first link 
        let ringText = window.document.createElement('span');
        ringText.innerText = " • This site is part of the Stevens Students Webring • ";
        ringLinks.push(ringText);
    }

    if(ringLinks.length === 3) {
        placeLinks(ringLinks);
    }
}

function placeLinks(ringLinks){
    //Insert an arrow as the first and last element of the array
    let arrowLeft = document.createTextNode("<--");
    let arrowRight = document.createTextNode("-->");
    ringLinks.unshift(arrowLeft);
    ringLinks.push(arrowRight);

    //Insert the links into the DOM
    for(var i = 0; i < ringLinks.length; i++) {
        document.getElementById("ring").appendChild(ringLinks[i]);
    }
}
//Entry point
parseNeighbors();
