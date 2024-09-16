window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;
var TABLE_CONTENT_BASE = "./static/data/leaderboard_content.json";
var interp_images = [];

document.addEventListener('DOMContentLoaded', function() {
  fetch(TABLE_CONTENT_BASE)
      .then(response => response.json())
      .then(data => {
          populateTable(data);
          sortTable(0,true); 
      })
      .catch(error => console.error('Error loading data:', error));
});

function createScroller(itemdiv,direction, height=null){
  let scroll_container = document.createElement('div');
  itemdiv.appendChild(scroll_container);
  scroll_container.classList.add("scroll-container-"+direction);
  if (height){
    scroll_container.style.height=height;
  }
  let scroll_content = document.createElement('div');
  scroll_container.appendChild(scroll_content);
  scroll_content.classList.add("scroll-content-"+direction);
  return scroll_content;
}

function createDatapointImage(url){
  let img = document.createElement('img');
  img.src = url;
  img.classList.add('datapointImg');
  return img;
}

function refreshData(){
  let navbar = document.getElementById('browser-navbar');
  let currentTask = navbar.innerText;
  currentTask = currentTask.replace(/(\r\n|\n|\r)/gm, "");
  displayDatapoints(currentTask);
  return false;
}
function displayMCOT(itemdiv, data){
  let scroll_content_image = createScroller(itemdiv,'v');
  let img = createDatapointImage(data['url']);
  scroll_content_image.appendChild(img);

  let p = document.createElement('p');
  p.innerHTML = '<b>Question</b><br>'+data['question']+'<br><b>Answer</b><br>'+data['answer'];

  let scroll_content_text = createScroller(itemdiv,'v',height='300px');
  scroll_content_text.appendChild(p);
}

function displayHaloQuest(itemdiv, data){
  let scroll_content_image = createScroller(itemdiv,'v');
  scroll_content_image.appendChild(createDatapointImage(data['url']));
  
  let scroll_content_text = createScroller(itemdiv,'v',height='200px');
  let p = document.createElement('p');
  p.innerHTML = '<b>Question</b><br>'+data['question']+'<br><b>Answer</b><br>'+data['answer'][0];
  scroll_content_text.appendChild(p);
}

function displayRetrieval(itemdiv, data){
  let scroll_content_image = createScroller(itemdiv,'v');
  scroll_content_image.innerHTML+="<b>Groundtruth Image</b><br>";
  scroll_content_image.appendChild(createDatapointImage(data['url']));

  let scroll_content_text = createScroller(itemdiv,'v');
  scroll_content_text.innerHTML += "<b>Groundtruth Text</b><br>";
  data['captions'].forEach((caption) => {
    let p = document.createElement('p');
    p.innerHTML=caption;
    scroll_content_text.appendChild(p);
  });

  let scroll_content_image_distractor = createScroller(itemdiv,'v');
  scroll_content_image_distractor.innerHTML+="<b>Image Distractors</b><br>";
  data['image_distractor_url'].forEach((distractor_url) => {
    let distractor_img = createDatapointImage(distractor_url);
    scroll_content_image_distractor.appendChild(distractor_img);
  });

  let scroll_content_text_neg = createScroller(itemdiv,'v');
  scroll_content_text_neg.innerHTML += "<b>Text Distractors</b><br>";
  data['text_distractors'].forEach((caption) => {
    let p = document.createElement('p');
    p.innerHTML=caption;
    scroll_content_text_neg.appendChild(p);
  });
}

function displayMultiImageVQA(itemdiv, data){
  let scroll_content = createScroller(itemdiv,'v');
  let img1 = createDatapointImage(data['url1']);

  let img2 = createDatapointImage(data['url2']);
  
  scroll_content.appendChild(img1)
  scroll_content.appendChild(img2)
  
  let scroll_content_text = createScroller(itemdiv,'v');

  let p = document.createElement('p');
  p.innerHTML = '<b>Question</b><br>'+data['question']+'<br><b>Answer</b><br>'+data['answer'];
  scroll_content_text.appendChild(p)
}

function displayCaptioning(itemdiv, data){
  let scroll_content_img = createScroller(itemdiv,'v');
  scroll_content_img.appendChild(createDatapointImage(data['url']));
  
  let scroll_content = createScroller(itemdiv,'v');
  scroll_content.innerHTML += "<b>Captions</b><br>";
  data['captions'].forEach((caption) => {
    let p = document.createElement('p');
    p.innerHTML=caption;
    scroll_content.appendChild(p);
  });
}
function getDisplayData(task){
  switch (task) {
    case "MCOT":
      return displayMCOT
    case "Multi-image VQA":
      return displayMultiImageVQA;
    case "Imaginary Image Captioning":
      return displayCaptioning;
    case "HaloQuest":
      return displayHaloQuest
    case "Cross-modal Retrieval":
      return displayRetrieval
    default:
      throw new Error('Invalid task: ' + task); 
  }  
}
function displayDatapoints(task) {
  // Step 1: Load the JSON file
  let navbar = document.getElementById('browser-navbar');
  navbar.innerText = task;
  let displayData = getDisplayData(task);
  fetch(`./static/data/${task}.json`)
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
      setImageHeights();
}

function setImageHeights(){
  const images = document.querySelectorAll('.datapointImg');
  let minHeight = Infinity;

  // Find the shortest image height
  images.forEach(img => {
    img.onload = function() {
      if (img.height < minHeight) {
        minHeight = img.height;
      }
      // After all images are loaded, set their heights to the shortest one
      images.forEach(img => {
        img.style.height = minHeight + 'px';
      });
    };
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
