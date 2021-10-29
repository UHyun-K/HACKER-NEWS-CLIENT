

const ajax = new XMLHttpRequest(); //해커뉴스데이터 가져올 도구 가져오기, 저장하기
const container = document.getElementById("root");
const NEWS_URL =  'https://api.hnpwa.com/v0/news/1.json';
const CONTENTS_URL = 'https://api.hnpwa.com/v0/item/@id.json';
/*ajax.open('GET', NEWS_URL, false); //동기적으로 처리 한다는 옵션
ajax.send();//실제로 가져오기, open만한다고 가져와주는 것이 아님 
//console.log(ajax.response); //데이터확인- 데이터는 ajax.response에 저장됨 

//----------------여기까지 데이터를 가져오는 입력 

//----------------여기부터 처리
//자바스크립트에서 다루기 쉽도록 response에 있는 것을 preview처럼 바꿔보겠음/응답값 --> 객체
const newsFeed = JSON.parse(ajax.response);
*/

function getData(url){
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function newsFeed(){
const newsFeed = getData(NEWS_URL);
const newsList = [];

newsList.push('<ul>');
for(let i=0; i<10; i++){

  newsList.push(`
    <li>
      <a href="#${newsFeed[i].id}">
        ${newsFeed[i].title}(${newsFeed[i].comments_count})
      </a>
    </li>
  `
  )
}
newsList.push('</ul>');

container.innerHTML= newsList.join('');

}

function newsDetail(){
  const id = location.hash.substr(1);
  const newsContent =getData(CONTENTS_URL.replace('@id', id)); //데이터받기

  container.innerHTML=`
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#">목록으로</a>
    </div>
    `
}

function router(){
  const routePath = location.hash;
  if(routePath === ''){
    newsFeed();
  }else{
    newsDetail();
  }
  
}

window.addEventListener('hashchange', router);
router();
/*
for(let i=0; i<10; i++){
  const li = document.createElement('li');
  const a = document.createElement('a');

  a.href = `#${newsFeed[i].id}`;
  a.innerHTML=`${newsFeed[i].title}(${newsFeed[i].comments_count})`;
  
  li.appendChild(a);
  ul.appendChild(li);
}
*/

/*
//문자열을 활용한 방법 //구조파악이 쉽다.
for(let i=0; i<10; i++){
  const div = document.createElement('div');

  div.innerHTML=`
    <li>
      <a href="#${newsFeed[i].id}">
        ${newsFeed[i].title}(${newsFeed[i].comments_count})
      </a>
    </li>
  `
 // ul.appendChild(div.children[0]);
  ul.appendChild(div.firstElementChild);
}
container.appendChild(ul);
container.appendChild(content);
*/
