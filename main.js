import { panda } from "https://pandatown.fr/lib/pandalib.php";
let loader = document.querySelector("#loader");
let logo = panda.util.newelem("img",{"src":"./ressources/logo_moviequiz.png","alt":"logo moviequiz"});
let bar = panda.util.newelem("div",{"id":"loaderbar"});
loader.querySelector(".content").appendChild(logo);
loader.querySelector(".content").appendChild(bar);
// panda.timeaction.add(logo,{"list":[{"action":"style","value":"transform:scale(&1)","init":4,"add":-1}],"start":0,"end":3});
// panda.timeaction.add(bar,{"list":[{"action":"style","value":"width:&1%","init":0,"add":20}],"start":3,"end":7});
// panda.timeaction.add(bar,{"list":[{"action":"style","value":"width:100%;position:relative;top:&1%;left:&1vw","init":0,"add":-7}],"start":7,"end":9});
// panda.timeaction.add(bar,{"list":[{"action":"style","value":"width:100%;position:relative;top:&1%;left:&1vw","init":-14,"add":7}],"start":10,"end":12});
// panda.timeaction.add(loader,{"list":[{"action":"style","value":"opacity:&1","init":1,"add":-1}],"start":10,"end":11});
panda.timeaction.add(document.querySelector("#main"),{"list":[{"action":"style","value":"display:none","init":0,"add":0}],"start":0,"end":1});
panda.timeaction.add(loader,{"list":[{"action":"style","value":"opacity:&1","init":0,"add":0}],"start":1,"end":2});
panda.timeaction.add(loader,{"list":[{"action":"style","value":"display:none","init":0,"add":0}],"start":1,"end":2});
panda.timeaction.add(document.querySelector("#main"),{"list":[{"action":"style","value":"display:","init":0,"add":0}],"start":1,"end":2});

var swiper = new Swiper('.swiper', {
    slidesPerView: "auto",
    spaceBetween: 15,
    // breakpoints: {
    //   640: {
    //     slidesPerView: 3,
    //     spaceBetween: 5,
    //   },
    //   1024: {
    //     slidesPerView: 7,
    //     spaceBetween: 15,
    //   }
    // },
    //direction: getDirection(),
    mousewheel: {
        releaseOnEdges: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      hiddenClass: '.hidden',
    },
    mousewheel: {
      forceToAxis: true,
    },
    on: {
        // resize: function () {
        //   swiper.changeDirection(getDirection());
        // },
    },
  });

  function getDirection() {
    var windowWidth = window.innerWidth;
    var direction = window.innerWidth <= 760 ? 'vertical' : 'horizontal';

    return direction;
  }