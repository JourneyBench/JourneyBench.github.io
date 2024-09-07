window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;
var TABLE_CONTENT_BASE = "./data/tables/table_content.json";
var interp_images = [];

document.addEventListener('DOMContentLoaded', function() {
  fetch("./data/tables/table_content.json")
      .then(response => response.json())
      .then(data => {
          populateTable(data);
          sortTable(0,true); 
      })
      .catch(error => console.error('Error loading data:', error));
});
function refreshData(){
  let navbar = document.getElementById('browser-navbar');
  let currentTask = navbar.innerText;
  currentTask = currentTask.replace(/(\r\n|\n|\r)/gm, "");
  displayDatapoints(currentTask);
  return false;
}
function displayMCOT(itemdiv, data){
  let img = document.createElement('img');
  img.src = data['url'];
  let p = document.createElement('p');
  p.innerHTML = '<b>Question</b><br>'+data['question']+'<br><b>Answer</b><br>'+data['answer'];
  itemdiv.appendChild(img);
  itemdiv.appendChild(p);
}
function displayDatapoints(task) {
  // Step 1: Load the JSON file
  let navbar = document.getElementById('browser-navbar');
  navbar.innerText = task;
  let displayData = displayMCOT;
  fetch(`./static/examples/${task}.json`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Failed to load ${task}.json`);
          }
          return response.json();
      })
      .then(data => {
          // Step 2: Randomly sample 8 items
          let items = data;
          if (!Array.isArray(items) || items.length < 8) {
              throw new Error('Not enough items in the JSON list!');
          }

          // Shuffle and pick 8 random items
          items = items.sort(() => 0.5 - Math.random()).slice(0, 8);

          // Step 3: Locate the div with id="results-carousel"
          const carousel = document.getElementById('results-carousel');
          if (!carousel) {
              throw new Error('Could not find the div with id="results-carousel"');
          }

          // Replace the contents of divs with class="item item-<i>"
          items.forEach((item, index) => {
              const itemDivs = carousel.querySelectorAll(`.item.item-${index}`);
              if (itemDivs) {
                itemDivs.forEach((itemDiv,_) =>{
                  itemDiv.innerHTML='';
                  displayData(itemDiv,item);});
              } else {
                  console.warn(`Could not find the div with class "item item-${index}"`);
              }
          });
      })
      .catch(error => {
          console.error('Error:', error);
      });
}

function populateTable(data) {
  let tableBody = document.querySelector('#leaderboard tbody');
  let entries = document.querySelector('#leaderboard thead').innerText.split("\t")
  tableBody.innerHTML = '';  // Clear existing content
  data.forEach(item => {
      let row = document.createElement('tr');

      entries.forEach(entry => {
          let cell = document.createElement('td');
          cell.textContent = item[entry];
          row.appendChild(cell);
      });

      tableBody.appendChild(row);
  });
}

function sortTable(n,initialSort = false) {
  let table = document.getElementById("leaderboard");
  let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  switching = true;
  dir = "asc"; // Set the sorting direction to ascending initially

  table.querySelectorAll("th").forEach(th => th.classList.remove("sorted-asc", "sorted-desc"));

  while (switching) {
      switching = false;
      rows = table.rows;
      
      for (i = 1; i < (rows.length - 1); i++) {
          shouldSwitch = false;
          x = rows[i].getElementsByTagName("TD")[n];
          y = rows[i + 1].getElementsByTagName("TD")[n];
          let xContent = x.textContent.trim();
          let yContent = y.textContent.trim();
          if (!isNaN(xContent) && !isNaN(yContent)) {
            xContent = parseFloat(xContent);
            yContent = parseFloat(yContent);
        }
          if (dir == "asc") {
              if (xContent > yContent) {
                  shouldSwitch = true;
              }
          } else if (dir == "desc") {
              if (xContent < yContent) {
                  shouldSwitch = true;
              }
          }
          if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        }
      }
      if (switchcount === 0 && dir === "asc" && !initialSort) {
            dir = "desc";
            switching = true;
      }
  }
  table.querySelector(`th:nth-child(${n + 1})`).classList.add(dir === "asc" ? "sorted-asc" : "sorted-desc");

}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }
    displayDatapoints("MCOT");
    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    // preloadInterpolationImages();

    // $('#interpolation-slider').on('input', function(event) {
    //   setInterpolationImage(this.value);
    // });
    // setInterpolationImage(0);
    // $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    // bulmaSlider.attach();
})
