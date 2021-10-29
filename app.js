

const ajax = new XMLHttpRequest(); //해커뉴스데이터 가져올 도구 가져오기, 저장하기
const container = document.getElementById("root");
const NEWS_URL =  'https://api.hnpwa.com/v0/news/1.json';
const CONTENTS_URL = 'https://api.hnpwa.com/v0/item/@id.json';

const content = document.createElement('div');
const store = {
  currentPage: 1,
};

function getData(url){
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function newsFeed(){
const newsFeed = getData(NEWS_URL);
const newsList = [];

newsList.push('<ul>');
for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){

  newsList.push(`
    <li>
      <a href="#/show/${newsFeed[i].id}">
        ${newsFeed[i].title}(${newsFeed[i].comments_count})
      </a>
    </li>
  `
  );
}
newsList.push('</ul>');
newsList.push(`
  <div>
    <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전페이지</a>
    <a href="#/page/${store.currentPage + 1}">다음페이지</a>
  </div>
`)
//if문 쓰기에는 너무짧으니 삼항연산자로 

container.innerHTML= newsList.join('');

}

function newsDetail(){
  const id = location.hash.substr(7);
  const newsContent =getData(CONTENTS_URL.replace('@id', id)); //데이터받기

  container.innerHTML=`
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
    `;
}

function router(){
  const routePath = location.hash;
  if(routePath === ''){
    newsFeed();
  }else if(routePath.indexOf('#/page/') >= 0){
    store.currentPage= Number(routePath.substr(7));
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
