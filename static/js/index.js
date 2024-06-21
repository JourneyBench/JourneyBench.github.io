window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;
var TABLE_CONTENT_BASE = "./static/tables/table_content.json";
var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}
document.addEventListener('DOMContentLoaded', function() {
  fetch("./static/tables/table_content.json")
      .then(response => response.json())
      .then(data => {
          populateTable(data);
          sortTable(0,true); 
      })
      .catch(error => console.error('Error loading data:', error));
});

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
