import { panda } from "https://pandatown.fr/lib/pandalib.php";
// import { panda } from "http://lib.panda/pandalib.js";

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
const game = {
  baseimg:"https://image.tmdb.org/t/p/w300_and_h450_bestv2",
  baseimg2:"https://image.tmdb.org/t/p/w1920_and_h1080_bestv2",
  apikey:"8738dbf792cba5abde36103dd3bc050e",
  game:null,
  selected:null,
  init:async function(){
    document.querySelector("#sendSaisie").addEventListener("click",function(e){
      let saisie = document.querySelector("#saisie").value;
      document.querySelector("#saisie").value = "";
      game.saisie(saisie);
    });
    const save = panda.cookie.read("moviequiz");
    const FilmN = document.querySelector("#FilmsN .swiper-wrapper");
    const SeriesN = document.querySelector("#SeriesN .swiper-wrapper");
    const FilmT = document.querySelector("#FilmsT .swiper-wrapper");
    const SeriesT = document.querySelector("#SeriesT .swiper-wrapper");
    var jsonfile = await fetch('./movielist.json')
      .then((response) => response.json())
      .then((json) => {
          return json;
      }
    );
    console.log("save",save);
    if(save){
      this.game = save;
    }else{
      this.game = {
        movies:[],
        series:[],
        found:{movie:[],serie:[]},
      };
    }
    
    for (const key in jsonfile.medias.movie) {
      const info = await this.getinfo(jsonfile.medias.movie[key].title,"movie");
      info.type = "movie";
      if(info.backdrop_path){
        this.game.movies.push(info);
        let image = this.baseimg+info.backdrop_path;
        const coverelem = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+image.replace(".jpg",".jpg")+"');"});
        coverelem.id = info.type+info.id;
        FilmN.appendChild(coverelem);
        coverelem.addEventListener("click",function(e){
          game.select(info);
          // panda.util.log(jsonfile.medias.movie[key].title);
        });
      }else{
        panda.util.log("aucune image disponible : "+jsonfile.medias.movie[key].title);
      }
    }
    for (const key in jsonfile.medias.serie) {
      const info = await this.getinfo(jsonfile.medias.serie[key].title,"tv");
      info.type = "tv";
      if(info.backdrop_path){
        this.game.series.push(info);
        let image = this.baseimg+info.backdrop_path;
        const coverelem = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+image.replace(".jpg",".jpg")+"');"});
        coverelem.id = info.type+info.id;
        SeriesN.appendChild(coverelem);
        coverelem.addEventListener("click",function(e){
          game.select(info);
          // panda.util.log(jsonfile.medias.movie[key].title);
        });
      }else{
        panda.util.log("aucune image disponible : "+jsonfile.medias.serie[key].title);
      }
    }
    FilmT.appendChild(panda.util.newelem("div",{"className":"swiper-slide","id":"FilmEmpty"}));
    SeriesT.appendChild(panda.util.newelem("div",{"className":"swiper-slide","id":"SerieEmpty"}));

    if(this.game.found.movie > 0){
      document.querySelector("#FilmEmpty").style.display = "none";
      for (const key in this.game.found.movie) {
        let image = this.baseimg+this.game.found.movie[key].poster_path;
        const coverelem = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+image.replace(".jpg",".jpg")+"');"});
        coverelem.dataset.id = this.selected.type+this.selected.id;
        FilmT.appendChild(coverelem);
      }
    }
    if(this.game.found.serie > 0){
      document.querySelector("#SerieEmpty").style.display = "none";
      for (const key in this.game.found.serie) {
        let image = this.baseimg+this.game.found.serie[key].poster_path;
        const coverelem = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+image.replace(".jpg",".jpg")+"');"});
        coverelem.dataset.id = this.selected.type+this.selected.id;
        SeriesT.appendChild(coverelem);
      }
    }
  },
  getinfo:async function(title,type){
    let result = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=${this.apikey}&language=fr&page=1&region=fr&query=${encodeURIComponent(title)}`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          return data.results[0];
        }else{
          return false;
        }
      });
      return result;
  },
  select:function(info){
    document.querySelector(".background > div").style.backgroundImage = `url(${this.baseimg2+info.backdrop_path})`;
    document.querySelector("#saisieUser").style.display = "";
    this.selected = info;
  },
  saisie:function(saisie) {
    if(this.selected){
      let percent = 0;
      if(this.selected.type == "movie"){
        percent = this.matchPourcentage(saisie,this.selected.title);
      }else if(this.selected.type == "tv"){
        percent = this.matchPourcentage(saisie,this.selected.name);
      }
      panda.util.log(percent,"orange");
      const reponse = document.querySelector("#resultSaisie");
      if(percent >= 75){
        reponse.style.display = "";
        reponse.innerHTML = `<p>BONNE RÉPONSE</p>`;

        switch(this.selected.type){
          case "movie":
            let i = this.game.movies.findIndex((movie) => movie.title == this.selected.title);
            this.game.movies.splice(i,1);
            this.game.found.movie.push(this.selected);
            let newfoundM = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+this.baseimg+this.selected.poster_path+"'"});
            document.querySelector("#FilmsT .swiper-wrapper").appendChild(newfoundM);
            document.querySelector("#"+this.selected.type+this.selected.id).style.display = "none";
            document.querySelector("#FilmEmpty").style.display = "none";
            break;
          case "tv":
            let s = this.game.series.findIndex((serie) => serie.title == this.selected.title);
            this.game.series.splice(s,1);
            this.game.found.serie.push(this.selected);
            let newfoundS = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+this.baseimg+this.selected.poster_path+"'"});
            document.querySelector("#SeriesT .swiper-wrapper").appendChild(newfoundS);
            document.querySelector("#"+this.selected.type+this.selected.id).style.display = "none";
            document.querySelector("#SerieEmpty").style.display = "none";
            break;
          default:
            return;
        }        
        panda.cookie.save(this.game,"moviequiz");
      }else{
        reponse.style.display = "";
        reponse.innerHTML = `<p>MAUVAISE RÉPONSE</p>`;

      }
    }
  },
  clear:function(){

  },
  matchPourcentage(saisie,origine){
    saisie = panda.util.normalize(saisie);
    origine = panda.util.normalize(origine);
    if(saisie == origine || saisie.match(origine)){
      return 100;
    }
    saisie = saisie.split("");
    origine = origine.split("");
    let point = origine.length;
    let offsetO = 0;
    let offsetS = 0;
    for (const o in saisie) {
        if(origine[parseInt(o)+parseInt(offsetO)+1] == saisie[parseInt(o)+parseInt(offsetS)] && origine[parseInt(o)+parseInt(offsetO)+1] != origine[parseInt(o)+parseInt(offsetO)]){
          offsetO++;
        }
        if(origine[parseInt(o)+parseInt(offsetO)] == saisie[parseInt(o)+parseInt(offsetS)+1] && saisie[parseInt(o)+parseInt(offsetO)+1] != saisie[parseInt(o)+parseInt(offsetO)]){
          offsetS++;
        }
        if(origine[parseInt(o)+parseInt(offsetO)] !== undefined){
          if(origine[parseInt(o)+parseInt(offsetO)] != saisie[parseInt(o)+parseInt(offsetS)]){
            point--;
          }
        }
        
    }
    if(saisie.length < origine.length){
      let dif = origine.length-saisie.length;
      dif = dif-offsetO;
      point = point-dif;
    }
    let percent = point*100/origine.length;
    if(percent < 0){
      percent = 0;
    }
    return percent;
  }
}

await game.init();
panda.timeaction.add(loader,{"list":[{"action":"style","value":"opacity:&1","init":1,"add":-1}],"start":1,"end":2});
panda.timeaction.add(loader,{"list":[{"action":"style","value":"display:none","init":0,"add":0}],"start":2,"end":3});
panda.timeaction.add(document.querySelector("#main"),{"list":[{"action":"style","value":"display:","init":0,"add":0}],"start":2,"end":3});

const swiperContainers = document.querySelectorAll('.swiper-global-container');
const swipers = document.querySelectorAll('.swiper-global-container .swiper');

swipers.forEach((swiper, index) => {
  swiper.classList.add(`swiper-${index}`);
})

swiperContainers.forEach((container, index) => {
  container.querySelector('.swiper-button-next').classList.add(`swiper-next-${index}`)
  container.querySelector('.swiper-button-prev').classList.add(`swiper-prev-${index}`)
})

setTimeout(()=>{
  swipers.forEach((swiper, index) => {
    new Swiper(`.swiper-${index}`, {
      slidesPerView: "auto",
      spaceBetween: 15,
      observer: true,
      navigation: {
        nextEl: `.swiper-next-${index}`,
        prevEl: `.swiper-prev-${index}`,
      },
    });
  });
},1000);