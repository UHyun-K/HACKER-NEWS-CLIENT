interface Score {
  currentPage: number;
  feeds: NewsFeed[]; //뉴스피드의 타입이 들억나ㅡㄴ 배열 
}
interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;

}
interface NewsFeed extends News  {
  readonly point: number;
  readonly comments_count : number;
  read?: boolean; //처음에는 데이터가 없다가 나중ㅇ 추가하는 거라
}

interface NewsDetail extends News {
  readonly comments:NewsComment[];
}

interface NewsComment extends News {
  readonly comments:NewsComment[];
  readonly level:number;
}

const ajax: XMLHttpRequest = new XMLHttpRequest(); //해커뉴스데이터 가져올 도구 가져오기, 저장하기
const container: HTMLElement | null = document.getElementById("root");
const NEWS_URL =  'https://api.hnpwa.com/v0/news/1.json';
const CONTENTS_URL = 'https://api.hnpwa.com/v0/item/@id.json';


const store:Score = {
  currentPage: 1,
  feeds:[],
};

function getData<ajaxResponse>(url:string):ajaxResponse{
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function makeFeeds(feeds:NewsFeed[]):NewsFeed[]{ //getdata에 속성 추가 할 용도인데 getData는 자주쓰이니까
  for(let i =0; i < feeds.length; i++){
    feeds[i].read =false; //처음엔 다 안읽었으니까
  }
  return feeds;
}


function updateView(html:string):void{ //타입가드 들어오는 코드 유형이 2가지일때 
  if(container != null){
    container.innerHTML= html;
  }else{
    console.log('최상위 컨테이너가 없어 ui진행하지 못함');
  }
}
function newsFeed():void{
let newsFeed:NewsFeed[] = store.feeds;
const newsList = [];
let template = `

<div class="bg-gray-600 min-h-screen">
<div class="bg-white text-xl">
  <div class="mx-auto px-4">
    <div class="flex justify-between items-center py-6">
      <div class="flex justify-start">
        <h1 class="font-extrabold">Hacker News</h1>
      </div>
      <div class="items-center justify-end">
        <a href="#/page/{{__prev_page__}}" class="text-gray-500">
          Previous
        </a>
        <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
          Next
        </a>
      </div>
    </div> 
  </div>
</div>
<div class="p-4 text-2xl text-gray-700">
  {{__news_feed__}}        
</div>
</div>
`;
if (newsFeed.length === 0){ //데이터가 없다면
  newsFeed = store.feeds = makeFeeds(getData<NewsFeed[]>(NEWS_URL));  //a맨오른쪽 데이터가 왼쪽으로 그게 왼쪽으로 덮어 들어간다. 
}
//아래 삼항연상자 아이번째 뉴스피드의 리드 속성이 참이면 백그라운드 컬러 레드 500 아니면 화이트
for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){
  newsList.push(`
  <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
  <div class="flex">
    <div class="flex-auto">
      <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
    </div>
    <div class="text-center text-sm">
      <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
    </div>
  </div>
  <div class="flex mt-3">
    <div class="grid grid-cols-3 text-sm text-gray-500">
      <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
      <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].point}</div>
      <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
    </div>  
  </div>
</div>    
  `);
}
template = template.replace('{{__news_feed__}}', newsList.join(''));
template = template.replace('{{__prev_page__}}', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
template = template.replace('{{__next_page__}}',String(store.currentPage + 1));

//if문 쓰기에는 너무짧으니 삼항연산자로 
updateView(template);

}

function newsDetail():void{
  const id = location.hash.substr(7);
  const newsContent =getData<NewsDetail>(CONTENTS_URL.replace('@id', id)); //데이터받기

  let template = `
  <div class="bg-gray-600 min-h-screen pb-8">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="items-center justify-end">
            <a href="#/page/${store.currentPage}" class="text-gray-500">
              <i class="fa fa-times"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="h-full border rounded-xl bg-white m-6 p-4 ">
      <h2>${newsContent.title}</h2>
      <div class="text-gray-400 h-20">
        ${newsContent.content}
      </div>

      {{__comments__}}

    </div>
  </div>
`;

for(let i =0; i<store.feeds.length; i++){
  if(store.feeds[i].id === Number(id)){
    store.feeds[i].read = true;
    break;
  }
}


  updateView( template.replace('{{__comments__}}', makeComment(newsContent.comments)));
}

function makeComment(comments:NewsComment[]):string { //called는 호출된 횟수 , 0으로 기본값 설정
  const commentString = [];

  for(let i = 0; i < comments.length; i++) {
    const comment:NewsComment = comments[i];
    commentString.push(`
      <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>      
    `);

    if (comment.comments.length > 0) {
      commentString.push(makeComment(comment.comments)); //재귀호출 makecomments 끝을 알 수 없을 때 유용
    }
  }

  return commentString.join('');
}
function router():void{
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
