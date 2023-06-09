import { panda } from "./pandalib.js";
// import { panda } from "http://lib.panda/pandalib.js";

let loader = document.querySelector("#loader");
let logo = panda.util.newelem("img",{"src":"./ressources/logo_moviequiz.png","alt":"logo moviequiz"});
let bar = panda.util.newelem("div",{"id":"loaderbar"});
loader.querySelector(".content").appendChild(logo);
loader.querySelector(".content").appendChild(bar);
panda.timeaction.add(logo,{"list":[{"action":"style","value":"transform:scale(&1)","init":4,"add":-1}],"start":0,"end":3});

const game = {
  baseimg:"https://image.tmdb.org/t/p/w300_and_h450_bestv2",
  baseimg2:"https://image.tmdb.org/t/p/w1920_and_h1080_bestv2",
  apikey:"8738dbf792cba5abde36103dd3bc050e",
  game:null,
  selected:null,
  coverelem:null,
  initnav:function(){
    let nav = document.querySelector("#main > nav");
    nav.querySelectorAll(".m_home").forEach(elementS => {
      elementS.addEventListener("click",function(e){
        document.querySelector(".acceuil .content").style.display = "";
        document.querySelector(".acceuil .detail").style.display = "none";
        game.top();
      });
    });
    nav.querySelector("p.m_serie").addEventListener("click",function(e){
      document.querySelector(".acceuil .content").style.display = "";
      document.querySelector(".acceuil .detail").style.display = "none";
      game.top(document.querySelector("#SeriesN"));
    });
    nav.querySelector("p.m_film").addEventListener("click",function(e){
      document.querySelector(".acceuil .content").style.display = "";
      document.querySelector(".acceuil .detail").style.display = "none";
      game.top(document.querySelector("#FilmsN"));
    });
    nav.querySelector("p.m_all").addEventListener("click",function(e){
      document.querySelector(".acceuil .content").style.display = "";
      document.querySelector(".acceuil .detail").style.display = "none";
      game.top(document.querySelector("#FilmsT"));
    });
    nav.querySelectorAll(".m_help").forEach(elementU => {
      elementU.addEventListener("click",function(){
        document.querySelector(".acceuil .content").style.display = "";
        document.querySelector(".acceuil .detail").style.display = "none";
        game.top();
        const modal = document.querySelector("#modal");
        modal.querySelector(".contents h3").innerHTML = "Comment Jouer";
        modal.querySelector(".contents p").innerHTML = "Ci-dessous, vous trouverez une liste de films et de séries.<br>Pour visualiser l'une des œuvres, il suffit de cliquer sur sa couverture.<br>L'image s'affichera alors en grand format, en noir et blanc.<br>En bas de l'image, une zone de saisie apparaîtra.<br>Saisissez le titre du film ou nom de la série<br>Vous devez cliquer sur \"Valider\" ou appuyer sur la touche \"Entrée\".<br>Si votre réponse est correcte, l'image passera en couleur et un message s'affichera au centre pour vous en informer.<br><br>En revanche, si vous vous trompez, l'image restera en noir et blanc et un message au centre vous indiquera votre erreur.";
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
      });
    });
    nav.querySelector(".m_menu").addEventListener("click",function(e){
      const elementT = nav.querySelector(".menu");
      if (elementT.style.display === 'none') {
        elementT.style.display = 'block';
      } else {
        elementT.style.display = 'none';
      }
    });
    document.querySelector("#modal").addEventListener("click",function(e){
      if (e.target != document.querySelector("#modal .contents") && e.target.parentElement != document.querySelector("#modal .contents")){
        document.querySelector("#modal").style.display = "none";
        document.body.style.overflow = "";
        document.querySelector("#modal .contents p").innerHTML = "";
      }
    });
  },
  init:async function(){
    this.initnav();
    document.querySelector("#sendSaisie").addEventListener("click",function(e){
      let saisie = document.querySelector("#saisie").value;
      document.querySelector("#saisie").value = "";
      game.saisie(saisie);
    });
    document.querySelector("#saisieUser #saisie").addEventListener("keyup",function(e){
      if(e.keyCode == 13){
        let saisie = document.querySelector("#saisie").value;
        document.querySelector("#saisie").value = "";
        game.saisie(saisie);
      }
    });
    document.querySelector(".btn_info").addEventListener("click",function(e){
      game.info();
    });
    document.querySelector(".btn_bande").addEventListener("click",function(e){
      game.bande();
    })
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
    if(save){
      this.game = {
        list:{movies:[],series:[]},
        found:save
      }
    }else{
      this.game = {
        list:{movies:[],series:[]},
        found:{movie:[],serie:[]}
      };
    }
    FilmT.appendChild(panda.util.newelem("div",{"className":"swiper-slide","id":"FilmEmpty"}));
    SeriesT.appendChild(panda.util.newelem("div",{"className":"swiper-slide","id":"SerieEmpty"}));

    for (const key in jsonfile.medias.movie) {
      let f_id;
      if(jsonfile.medias.movie[key].f_s_id){
        f_id = jsonfile.medias.movie[key].f_s_id;
      }
      const info = await this.getinfo(jsonfile.medias.movie[key].title,"movie",jsonfile.medias.movie[key].f_id);
      
      if(info.backdrop_path){
        let data = {"type":"movie","id":info.id,"title":info.title.split(" : ")[0],"poster_path":info.poster_path,"backdrop_path":info.backdrop_path,"overview":info.overview};
        if(jsonfile.medias.movie[key].f_trailer){
          data.f_trailer = jsonfile.medias.movie[key].f_trailer;
        }
        this.game.list.movies.push(data);
        if(this.game.found.movie.findIndex((movie) => movie == info.id) == -1){
          let image = this.baseimg+info.backdrop_path;
          const coverelem = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+image.replace(".jpg",".jpg")+"');"});
          coverelem.id = data.type+data.id;
          FilmN.appendChild(coverelem);
          coverelem.addEventListener("click",function(e){
            game.select(data);
          });
        }else{
          document.querySelector("#FilmEmpty").style.display = "none";
          let image = this.baseimg+data.poster_path;
          const coverelem = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+image.replace(".jpg",".jpg")+"');"});
          coverelem.id = data.type+data.id;
          FilmT.appendChild(coverelem);
          coverelem.addEventListener("click",function(e){
            game.cover(data);
          });
        }
      }else{
        if(!info.backdrop_path){
          panda.util.log("aucune image disponible : "+jsonfile.medias.movie[key].title,"red");
        }
      }
    }
    for (const key in jsonfile.medias.serie) {
      let f_id;
      if(jsonfile.medias.serie[key].f_s_id){
        f_id = jsonfile.medias.serie[key].f_s_id;
      }
      const info = await this.getinfo(jsonfile.medias.serie[key].title,"tv",f_id);
      if(info.backdrop_path){
        let data = {"type":"tv","id":info.id,"name":info.name.split(" : ")[0],"poster_path":info.poster_path,"backdrop_path":info.backdrop_path,"overview":info.overview};
        if(jsonfile.medias.serie[key].f_trailer){
          data.f_trailer = jsonfile.medias.serie[key].f_trailer;
        }
        this.game.list.series.push(data);
        if(this.game.found.serie.findIndex((serie) => serie == info.id) == -1){
          let image = this.baseimg+info.backdrop_path;
          const coverelem = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+image.replace(".jpg",".jpg")+"');"});
          coverelem.id = data.type+data.id;
          SeriesN.appendChild(coverelem);
          coverelem.addEventListener("click",function(e){
            game.select(data);
          });
        }else{
          document.querySelector("#SerieEmpty").style.display = "none";
          let image = this.baseimg+data.poster_path;
          const coverelem = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+image.replace(".jpg",".jpg")+"');"});
          coverelem.id = data.type+data.id;
          SeriesT.appendChild(coverelem);
          coverelem.addEventListener("click",function(e){
            game.cover(data);
          });
        } 
      }else{
        if(!info.backdrop_path){
          panda.util.log("aucune image disponible : "+jsonfile.medias.movie[key].title,"red");
        }
      }
    }    
    if(this.game.found.movie.length+this.game.found.serie.length != 0){
      let rdm = panda.util.rdm(1,this.game.found.movie.length+this.game.found.serie.length);
      let select = null;
      if(this.game.found.movie.length >= rdm){
        select = this.game.found.movie[rdm-1];
        select = this.game.list.movies.find((movie) => movie.id == select);
      }else{ 
        select = this.game.found.serie[rdm-this.game.found.movie.length-1];
        select = this.game.list.series.find((serie) => serie.id == select);
      };
      this.coverelem = select;
      let head = document.querySelector(".acceuil > .head");
      head.style.display = "";
      if(select.type == "movie"){
        head.querySelector("h1").innerHTML = select.title;
      }else if(select.type == "tv"){
        head.querySelector("h1").innerHTML = select.name;
      }
      document.querySelector(".background > div").style.backgroundImage = `url(${this.baseimg2+select.backdrop_path})`;  
      document.querySelector(".background > div").style.filter = "grayscale(0)";
    }
  },
  getinfo:async function(title,type,f_s){
    let result = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=${this.apikey}&language=fr&page=1&region=fr&query=${encodeURIComponent(title)}`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          if(f_s){
            return data.results.find((movie) => movie.id == f_s);
          }
          return data.results[0];
        }else{
          return false;
        }
      });
      return result;
  },
  credit:async function(id,type){
    let result = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${this.apikey}&language=fr`)
    .then(response => response.json())
    .then(data => {
      return data;
    });
    return result;
  },
  trailer:async function(id,type){
    let result = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${this.apikey}&language=fr-FR`)
      .then(response => response.json())
      .then(data => { return data; });
    if(result.results.length == 0){
      result = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${this.apikey}`)
      .then(response => response.json())
      .then(data => { return data; });
    }
      return result.results[0].key;
  },
  select:function(info){
    if(this.interval){
      clearInterval(this.interval);
    }
    document.querySelector(".acceuil > .head").style.display = "none";
    document.querySelector(".background > div").style.backgroundImage = `url(${this.baseimg2+info.backdrop_path})`;
    document.querySelector(".background > div").style.filter = "grayscale(1)";
    document.querySelector("#saisieUser").style.display = "";
    this.selected = info;
    this.top();
    document.querySelector("#saisieUser #saisie").focus();
  },
  saisie:function(saisie) {
    if(this.selected){
      let percent = 0;
      if(this.selected.type == "movie"){
        percent = this.matchPourcentage(saisie,this.selected.title);
      }else if(this.selected.type == "tv"){
        percent = this.matchPourcentage(saisie,this.selected.name);
      }
      const reponse = document.querySelector("#resultSaisie");
      if(percent >= 85){
        reponse.style.display = "";
        reponse.innerHTML = `<p>BONNE RÉPONSE</p>`;

        switch(this.selected.type){
          case "movie":
            this.game.found.movie.push(this.selected.id);
            let newfoundM = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+this.baseimg+this.selected.poster_path+"'"});
            document.querySelector("#FilmsT .swiper-wrapper").appendChild(newfoundM);
            document.querySelector("#"+this.selected.type+this.selected.id).style.display = "none";
            document.querySelector("#FilmEmpty").style.display = "none";
            const select = this.selected;
            newfoundM.addEventListener("click",function(e){
              game.cover(select);
            });
            break;
          case "tv":
            this.game.found.serie.push(this.selected.id);
            let newfoundS = panda.util.newelem("div",{"className":"swiper-slide","style":"background-image: url('"+this.baseimg+this.selected.poster_path+"'"});
            document.querySelector("#SeriesT .swiper-wrapper").appendChild(newfoundS);
            document.querySelector("#"+this.selected.type+this.selected.id).style.display = "none";
            document.querySelector("#SerieEmpty").style.display = "none";
            const selecte = this.selected;
            newfoundS.addEventListener("click",function(e){
              game.cover(selecte);
            });
            break;
          default:
            return;
        }
        document.querySelector(".background > div").style.backgroundImage = `url(${this.baseimg2+this.selected.backdrop_path})`;
        document.querySelector(".background > div").style.filter = "grayscale(0)";
        const selecte = this.selected;  
        this.interval = setInterval(() => {
          document.querySelector("#saisieUser").style.display = "none";
          game.cover(selecte);
        },5000);
        panda.cookie.save(game.game.found,"moviequiz");
      }else{
        reponse.style.display = "";
        reponse.innerHTML = `<p>MAUVAISE RÉPONSE</p>`;
      }
      setInterval(()=>{reponse.style.display = "none";},5000);
    }
  },
  clear:function(){

  },
  matchPourcentage:function(saisie,origine){
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
  },
  cover:function(data){
    if(this.interval){
      clearInterval(this.interval);
    }
    document.querySelector("#saisieUser").style.display = "none";
    if(data.type == "movie"){
      document.querySelector(".background > div").style.backgroundImage = `url(${this.baseimg2+data.backdrop_path})`;
      document.querySelector(".background > div").style.filter = "grayscale(0)";
      let head = document.querySelector(".acceuil >.head");
      head.style.display = "";
      head.querySelector("h1").innerHTML = data.title;
    }else if(data.type == "tv"){
      document.querySelector(".background > div").style.backgroundImage = `url(${this.baseimg2+data.backdrop_path})`;
      document.querySelector(".background > div").style.filter = "grayscale(0)";
      let head = document.querySelector(".acceuil >.head");
      head.style.display = "";
      head.querySelector("h1").innerHTML = data.name;
    }
    this.coverelem = data;
    this.top();
  },
  info:async function(){
    if(this.coverelem){
      let data = await this.credit(this.coverelem.id,this.coverelem.type);
      let detail = document.querySelector(".acceuil .detail");
      detail.querySelector(".sinopsis > p").innerHTML = this.coverelem.overview;
      detail.querySelector(".swiper-wrapper").innerHTML = "";
      for (const key in data.cast) {
        if(data.cast[key].profile_path != null){
          let elem = panda.util.newelem("div",{"className":"swiper-slide"});
          elem.appendChild(panda.util.newelem("div",{"style":"background-image: url('"+this.baseimg+data.cast[key].profile_path+"')"}));
          let elemtext = panda.util.newelem("div",{});
          elemtext.appendChild(panda.util.newelem("p",{"className":"name","innerHTML":data.cast[key].name}));
          elemtext.appendChild(panda.util.newelem("p",{"className":"role","innerHTML":data.cast[key].character}));
          elem.appendChild(elemtext);
          detail.querySelector(".swiper-wrapper").appendChild(elem);
        }
      }
      detail.style.display = "";
      document.querySelector(".acceuil .content").style.display = "none";
    }
  },
  bande:async function(){
    if(this.coverelem){
        game.top();
        let modal = document.querySelector("#modal");
        switch (this.coverelem.type) {
          case "movie":
            modal.querySelector(".contents h3").innerHTML = this.coverelem.title;
            break;
          case "tv":
            modal.querySelector(".contents h3").innerHTML = this.coverelem.name;
            break;
        }
        let videocode = "";
        if(this.coverelem.f_trailer){
          videocode = this.coverelem.f_trailer;
        }else{
          videocode = await game.trailer(this.coverelem.id,this.coverelem.type);
        }
        modal.querySelector(".contents p").innerHTML = "<iframe src=\"https://www.youtube.com/embed/"+videocode+"?start=1&autoplay=1\" width=\"280\" height=\"200\" title=\"fdfdf\" frameborder=\"0\" allowfullscreen></iframe>";
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
  },
  top:function(div){
    if(div){
      // Faire défiler vers la position de la div avec une animation fluide
      div.scrollIntoView({block:"start", behavior: "smooth"});
    }else{
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // pour un défilement fluide, vous pouvez également utiliser 'auto' pour un défilement instantané
      });
    }
  },
}

await game.init();
// panda.timeaction.add(loader,{"list":[{"action":"style","value":"opacity:&1","init":1,"add":-1}],"start":2,"end":3});
// panda.timeaction.add(loader,{"list":[{"action":"style","value":"display:none;&1","init":0,"add":0}],"start":4,"end":5});
panda.timeaction.add(bar,{"list":[{"action":"style","value":"width:&1%","init":0,"add":20}],"start":3,"end":7});
panda.timeaction.add(loader,{"list":[{"action":"style","value":"opacity:&1","init":1,"add":-1}],"start":7,"end":8});
panda.timeaction.add(loader,{"list":[{"action":"style","value":"display:none;&1","init":0,"add":0}],"start":8,"end":9});
panda.timeaction.add(document.querySelector("#main"),{"list":[{"action":"style","value":"&1","init":0,"add":0}],"start":8,"end":9});

// panda.timeaction.add(document.querySelector("#main .acceuil .content"),{"list":[{"action":"style","value":"display:none","init":0,"add":0}],"start":3,"end":4});
// panda.timeaction.add(document.querySelector("#main .acceuil .detail"),{"list":[{"action":"style","value":"","init":0,"add":0}],"start":4,"end":5});
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