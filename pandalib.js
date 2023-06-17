const panda = {
    util: {
        word: {
            multiple:function(item,message,speed) { 
              var vars = {
                "part":null,
                "i": 0,
                "offset": 0,
                "len": message.length,
                "forwards": true,
                "skip_count": 0,
                "skip_delay": 15,
                "speed": speed
              }
              var intervale = null;
              intervale = setInterval(function () {
                item.dataset.intervale = intervale;
                if (vars.forwards) {
                  // console.log(item.dataset.stop , vars.i == vars.len-1 , vars.offset == message[vars.i].length)
                  if (vars.offset >= message[vars.i].length) {
                    ++vars.skip_count;
                    if (vars.skip_count == vars.skip_delay) {
                      vars.forwards = false;
                      vars.skip_count = 0;
                    }
                  }
                  if(item.dataset.stop && vars.i == vars.len-1 && vars.offset == message[vars.i].length){
                    clearInterval(intervale);
                    delete item.dataset.intervale;
                  }
                }
                else {
                  if (vars.offset == 0) {
                    vars.forwards = true;
                    vars.i++;
                    vars.offset = 0;
                    if (vars.i >= vars.len) {
                      vars.i = 0;

                    }
                  }
                }
                vars.part = message[vars.i].substr(0, vars.offset);
                if (vars.skip_count == 0) {
                  if (vars.forwards) {
                    vars.offset++;
                  }
                  else {
                    vars.offset--;
                  }
                }
                // console.log();
                if(vars.part == ""){
                  item.innerHTML = "_";
                }else{
                  item.innerHTML = vars.part;
                }
                
              },speed);
            },
            simple:function(item,message,speed,width) {
              if(width){
                var styles = item.getBoundingClientRect();
                let finalWidth = parseFloat(styles.width);//tempElement.offsetWidth;
                let finalHeight = parseFloat(styles.height);//tempElement.offsetHeight;
                item.style.display = "inline-block";
                item.style.width = finalWidth + "px";
                item.style.height = finalHeight + "px";
              }
              var vars = {
                "part":null,
                "offset": 0,
                "forwards": true,
                "skip_count": 0,
                "skip_delay": 15,
                "speed": speed
              }
              var intervale = null;
              intervale = setInterval(function () {
                item.dataset.intervale = intervale;
                if (vars.forwards) {
                  if (vars.offset >= message.length) {
                    ++vars.skip_count;
                    if (vars.skip_count == vars.skip_delay) {
                      vars.forwards = false;
                      vars.skip_count = 0;
                      clearInterval(intervale);
                      delete item.dataset.intervale;
                    }
                  }
                }
                vars.part = message.substr(0, vars.offset);
                if (vars.skip_count == 0) {
                  if (vars.forwards) {
                    vars.offset++;
                  }
                }
                item.innerHTML = vars.part;
              },speed);
            },
        },
        log:function(content,color){
          if(!color){
            color = "#ff66a5";
          }
          var r = ["\n %c %c %c log > "+content+" %c \n\n", "background: "+color+"; padding:5px 0;",  "background: "+color+"; padding:5px 0;","color: "+color+"; background: #030307; padding:5px 0;","background: "+color+"; padding:5px 0;"];
          var e = globalThis.console;
          e.log.apply(e, r);
        },
        rdm:function(min,max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        /** 
        * create new element html.
        * @summary create new element whith your parametre.
        * @param {string} type - type de l'element a créé exemple p.
        * @param {object} option - vos parametre exemple: {"className": "class1 class2","style":"color:red","innerHTML": "Bonjour"}
        * @return {element}  retourne votre element avec les parametre deffinit dans object.
        */
        newelem:function(type, object){
            var element = document.createElement(type);    
            for(var i in object){
                element[i] = object[i];
            }
            return element;
        },
        secondToHHMMSS:function(val){
          let texttimer = "";
          let h = Math.floor(val/3600);
          let m = Math.floor((val-(h*3600))/60);
          let s = val-((h*3600)+(m*60));
          if(h <= 0){
              texttimer += "";
          }else if(h < 10){
              texttimer += "0"+h+":";
          }else{
              texttimer += h+":";
          }
          if(m <= 0){
              texttimer += "00:";
          }else if(m < 10){
              texttimer += "0"+m+":";
          }else{
              texttimer += m+":";
          }
          if(s <= 0){
              texttimer += "00";
          }else if(s < 10){
              texttimer += "0"+s;
          }else{
              texttimer += s;
          }
          return texttimer;
        },
        normalize:function(text){
          return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        },
        uditem: {
          add:function(elem,value,fuct){
            let ArrowUp = panda.util.newelem("span",{"className":"top","innerHTML":">"});
            let ArrowDown = panda.util.newelem("span",{"className":"bottom","innerHTML":">"});
            elem.appendChild(ArrowUp);
            elem.innerHTML += value;
            elem.appendChild(ArrowDown);
            elem.addEventListener("click",(e)=>{
              if(e.target.className == "top"){
                fuct(elem,"+");
              }else if(e.target.className == "bottom"){
                fuct(elem,"-");
              }
            });
          },
          set:function(elem,value){
            elem.innerHTML = '<span class="top">&gt;</span>'+value+'<span class="bottom">&gt;</span>';
          },
          get:function(elem){
            let regex = /<span class="top">&gt;<\/span>(-?\d+)<span class="bottom">&gt;<\/span>/;
            return regex.exec(elem.innerHTML);
          }
        }
    },
    loader: {
      var:{init:false},
      init:function(loader,menu){
        this.var.init = true;
        this.var.loader = loader;
        this.var.menu = menu;
        this.var.loadimage = 0;
        this.var.image = [];
        this.update("show");
        var images = document.querySelectorAll("img, audio");
        if(images.length == 0){
          this.update(50);
          setTimeout(()=>{this.update(100);this.update("hide")},1000)
          
          // this.update("hide");
        }else{
          images.forEach(element => {
            this.new(element,menu);
          });
        }
      },
      setmenu:function(menu){
        this.var.menu = menu;
      },
      new:function(item,menu,type,ext){
        if(this.init == false){
          console.log("need init(elem loader,elemall menu)");
          return;
        }
        this.var.menu = menu;
        let cheminImage = "";
        if(type == "css"){
          cheminImage = window.getComputedStyle(item).style.background.slice(4, -1).replace(/"/g, "");
          item = new Image();
        }
        if(type == "ext"){
          cheminImage = ext;
          item = new Image();
        }
        
        this.var.image.push(item);
        item.addEventListener("load",(e) => {
          // console.log(e);
          panda.loader.resourceLoaded();
        });
        if(cheminImage != ""){
          item.src = cheminImage;
        }
      },
      resourceLoaded:function(){
        this.var.loadimage++;
        if (this.var.loadimage === this.var.image.length) {
          this.update("hide");
          this.var.image = [];
          this.var.loadimage = 0;
        }else{
          this.update("show");
          // console.log(this.var,Math.round((this.var.loadimage / this.var.image.length) * 100));
          this.update(Math.round((this.var.loadimage / this.var.image.length) * 100));
        }
      },
      update:function(state){
        switch (state) {
          case "show":
            this.var.loader.style.display = "";
            this.var.menu.style.display = "none";
            break;
          case "hide":
            this.var.loader.style.display = "none";
            this.var.menu.style.display = "";
            break;
          default:
            this.var.loader.querySelector('progress').value = state;
            break;
        }
      }
    /** @constant {constantDataTypeHere} - savegardé et lire des cookie*/},
    cookie: {
      /** 
        * save coockie to variable in localstorage.
        * @summary formate la chaîne de caractére avant sauvegarde dans l'emplacement voulu.
        * @param {Object} parametres - je contenue a sauvegardé format object.
        * @param {String} emplacement - l'emplacement de la sauvegarde.
      */
      save:function(parametres,emplacement){
        function formatOptions(options) {
          var cookieOptions = '';
        
          // Parcourez toutes les options pour formater la chaîne.
          for (var option in options) {
            if (options.hasOwnProperty(option)) {
              cookieOptions += option + '=' + options[option] + ';';
            }
          }
          return cookieOptions;
        }
        const options = {
          expires: 365,
          path: '/'
        };
        let parametresJSON = JSON.stringify(parametres);
        document.cookie = emplacement+'=' + encodeURIComponent(parametresJSON) + ';' + formatOptions(options);
      },
      /** 
        * read coockie to variable in localstorage.
        * @summary li l'emplacement et formate la chaîne de caractére en object.
        * @param {String} emplacement - l'emplacement de la sauvegarde.
      */
      read:function(emplacement){
        
        var cookies = document.cookie.split(';');
        var parametres = false;
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
      
          if (cookie.indexOf(emplacement+'=') === 0) {
            var parametresJSON = decodeURIComponent(cookie.substring((emplacement+'=').length));
            parametres = JSON.parse(parametresJSON);
            break;
          }
        }
      
        return parametres;
      }
    },
    timeaction: {
        memoire:{time:0,list:[],event:null,state:0},
        add:function(item,option){
            if(this.memoire.event === null){
                this.clear();
                this.memoire.list.push({"item":item,"option":option});
                this.initinterval();
            }else{
                if(option.start < this.memoire.time){
                    option.start = this.memoire.time;
                    option.end += this.memoire.time;
                }
                this.memoire.list.push({"item":item,"option":option});
            }
        },
        pause:function(){
          if(this.memoire.state){
            clearInterval(this.memoire.event);
            this.memoire.state = 0;
          }else{
            this.initinterval();
          }
        },
        stop:function(){
            clearInterval(this.memoire.event);
            this.memoire.state = 0;
            this.clear();
        },
        clear(){
            this.memoire.time = 0;
            this.memoire.event = null;
            this.memoire.list = [];
        },
        initinterval:function(){
            this.memoire.state = 1;
            this.memoire.event = setInterval(() => {
                const time = this.memoire.time;
                if(this.memoire.list.length == 0){
                    this.stop();
                }
                for (const select of this.memoire.list) {
                    if(select.option.end >= time && select.option.start <= time){
                        for(const i of select.option.list){
                            let timer = (time-select.option.start);
                            let replace = i.init;
                            for (let index = 0; index < timer; index++) {
                                replace += i.add;
                            }
                            let iresult = i.value.replace("&1",replace);
                            select.item[i.action] = iresult;
                        }
                    }else{
                        if(time > select.option.end){
                            const index = this.memoire.list.indexOf(select);
                            if (index !== -1) {
                                
                            }
                        }
                    }
                }
                this.memoire.time = time+1;
            }, 1000);
        }
    }
}

var r = ["\n %c %c %c Pandalib - 0.2.8.1 ✰ 1 ✰  %c  %c  http://www.pandatown.fr/  %c %c ♥%c♥%c♥ \n\n", "background: #ff66a5; padding:5px 0;", "background: #ff66a5; padding:5px 0;", "color: #ff66a5; background: #030307; padding:5px 0;", "background: #ff66a5; padding:5px 0;", "background: #ffc3dc; padding:5px 0;", "background: #ff66a5; padding:5px 0;", "color: #ff2424; background: #fff; padding:5px 0;", "color: #ff2424; background: #fff; padding:5px 0;", "color: #ff2424; background: #fff; padding:5px 0;"];
var e = globalThis.console;
e.log.apply(e, r);

export { panda };