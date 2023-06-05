import { panda } from "https://pandatown.fr/lib/pandalib.php";
let loader = document.querySelector("#loader");
let logo = panda.util.newelem("img",{"src":"./ressources/logo_moviequiz.png","alt":"logo moviequiz"});
let bar = panda.util.newelem("div",{"id":"loaderbar"});
loader.appendChild(logo);
loader.appendChild(bar);
panda.timeaction.add(logo,{"list":[{"action":"style","value":"transform:scale(&1)","init":4,"add":-1}],"start":0,"end":3});
panda.timeaction.add(bar,{"list":[{"action":"style","value":"width:&1%","init":0,"add":10}],"start":3,"end":5});
panda.timeaction.add(bar,{"list":[{"action":"style","value":"width:20%;position:relative;top:&1vh;left:&1vw","init":0,"add":-4}],"start":5,"end":7});
panda.timeaction.add(bar,{"list":[{"action":"style","value":"width:20%;position:relative;top:&1vh;left:&1vw","init":-8,"add":4}],"start":7,"end":9});
panda.timeaction.add(loader,{"list":[{"action":"style","value":"opacity:&1","init":1,"add":-1}],"start":10,"end":11});

// if(panda.cookie.read("moviequiz")){
//     const temp = panda.cookie.read("moviequiz");
//     console.log(temp);
// }else{
//     const temp = {"key1":prompt("test")};
//     panda.cookie.save(temp,"moviequiz");
// }