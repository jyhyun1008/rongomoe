const githubUserName = 'jyhyun1008' // 깃허브 아이디
const githubRepoName = 'rongomoe' // 깃허브 레포지토리 이름


function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

var qs = getQueryStringObject();
var page = qs.p;
var category = qs.c;
var article = qs.a;
var episode = qs.e;

if (!page && !article && !episode) {
    var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+"/main/README.md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector(".page_content").innerHTML += marked.parse(out)
    })
} else if (page == 'blog') {
    document.querySelector(".page_title").innerText = '활동 기록'
    if (category) {
        document.querySelector(".page_title").innerText += '/'+category
    } 
    document.querySelector(".page_content").innerHTML += '<div class="modoru"><a href="./?p=blog">전체보기</a></div>'
    document.querySelector(".page_content").innerHTML += '<div class="article_list"></div>'
    var url = "https://api.github.com/repos/"+githubUserName+"/"+githubRepoName+"/git/trees/main"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        var resultree1 = JSON.parse(out).tree;
        for (var k=0; k < resultree1.length; k++) {
            if (resultree1[k].path == 'posts') {
                var resulturl1 = resultree1[k].url
                fetch(resulturl1)
                .then(res2 => res2.text())
                .then((out2) => {
                    var resultree2 = JSON.parse(out2).tree;
                    console.log(resultree2)

                    resultree2.sort((a, b) => parseInt(b.path.split('_')[1]) - parseInt(a.path.split('_')[1]));
                    var articles = []
                    var categories = []
                    for (var j=0; j<resultree2.length;j++) {
                        articles.push({
                            title: resultree2[j].path.split('_')[2].split('.')[0],
                            category: resultree2[j].path.split('_')[0],
                            date: resultree2[j].path.split('_')[1]
                        })
                        categories.push(resultree2[j].path.split('_')[0])
                    }

                    console.log(articles)

                    var categorieset = new Set(categories);
                    categories = [...categorieset];
                    for (var j=0; j<categories.length; j++){
                    document.querySelector(".modoru").innerHTML += ' · <a href="./?p=blog&c='+categories[j]+'">'+categories[j] + '</a>'
                    }

                    for (var j=0; j<articles.length; j++){
                        if (articles[j].category == category || !category){
                            document.querySelector(".article_list").innerHTML += '<div class="article"><a href="./?a='+articles[j].category+'_'+articles[j].date+'_'+articles[j].title+'"><span>'+articles[j].title+'</span> <span><code>'+articles[j].category+'</code> <code>'+articles[j].date+'</code></span></a></div>'
                        }
                    }
                })
            }
        }
    })
} else if (article) {
    var article_category = article.split('_')[0]
    var article_date = article.split('_')[1]
    var article_title = article.split('_')[2].split('.')[0]
    var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+"/main/posts/"+article+".md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector(".page_title").innerText = article_title
        document.querySelector(".page_content").innerHTML += '<div class="article_category"></div><div class="article_content"></div>'
        document.querySelector(".article_category").innerHTML = '<a href="./?p=blog&c='+article_category+'">' + article_category+'</a> · '+article_date
        document.querySelector(".article_content").innerHTML += marked.parse(out)
    })
} else if (page == 'story') {
    document.querySelector(".page_title").innerText = '스토리'
    if (category) {
        document.querySelector(".page_title").innerText += '/'+category
    } 
    document.querySelector(".page_content").innerHTML += '<div class="modoru"><a href="./?p=story">전체보기</a></div>'
    document.querySelector(".page_content").innerHTML += '<div class="article_list"></div>';

    const CORS_PROXY = "https://proxy.rongo.moe/?url=" //나중에 다른 서버로 바꿔줘야함
    let parser = new RSSParser();
    (async () => {

        let feed = await parser.parseURL(CORS_PROXY + 'https://postype.com/@175ame/rss');
        var episodes = feed.items
        
        var articles = []
        var categories = []
        for (var j=0; j<episodes.length;j++) {
            if (episodes[j].title.includes('논어.모에!')) {
                articles.push({
                    title: episodes[j].title.split(' ')[2],
                    category: episodes[j].title.split(' ')[1],
                    url: episodes[j].link.split('post/')[1]
                })
                categories.push(episodes[j].title.split(' ')[1])
            }
        }

        var categorieset = new Set(categories);
        categories = [...categorieset];
        for (var j=0; j<categories.length; j++){
        document.querySelector(".modoru").innerHTML += ' · <a href="./?p=blog&c='+categories[j]+'">'+categories[j] + '</a>'
        }

        for (var j=0; j<articles.length; j++){
            if (articles[j].category == category || !category){
                document.querySelector(".article_list").innerHTML += '<div class="article"><a href="./?e='+articles[j].url+'"><span>'+articles[j].title+'</span> <span><code>'+articles[j].category+'</code></span></a></div>'
            }
        }

       }
    )();
    // var url = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fpostype.com%2F%40175ame%2Frss"
    // fetch(url)
    // .then(res => res.json())
    // .then((out) => {
    //     var episodes = out.items

    // })
 } else if (episode) {
//     var article_category = episode.split('_')[0]
//     var article_date = episode.split('_')[1]
//     var article_title = episode.split('_')[2].split('.')[0]
//     var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+"/main/story/"+episode+".md"
//     fetch(url)
//     .then(res => res.text())
    // .then((out) => {
    //     document.querySelector(".page_title").innerText = article_title
    //     document.querySelector(".page_content").innerHTML += '<div class="article_category"></div><div class="article_content"></div>'
    //     document.querySelector(".article_category").innerHTML = '<a href="./?p=story&c='+article_category+'">' + article_category+'</a> · '+article_date
    //     document.querySelector(".article_content").innerHTML += marked.parse(out)

        const CORS_PROXY = "https://proxy.rongo.moe/?url=https://postype.com/@175ame/post/"
        fetch(CORS_PROXY + episode)
        .then(res => res.text())
        .then((content) => {

            var content_title = content.split('<h1 class="MuiTypography-root MuiTypography-body-md joy-73k6v1">')[1].split('</h1>')[0].split(' ')[2]
            var content_category = content.split('<h1 class="MuiTypography-root MuiTypography-body-md joy-73k6v1">')[1].split('</h1>')[0].split(' ')[1]
            var content_prev, content_next
            if (content.includes('joy-6mbqgc')) {
                content_prev = content.split('<section class="MuiStack-root post-navigation joy-1tk24vt">')[1].split('class="MuiStack-root joy-6mbqgc" href="/@175ame/post/')[1].split('"')[0]
            }
            if (content.includes('joy-vce80x')) {
                content_next = content.split('<section class="MuiStack-root post-navigation joy-1tk24vt">')[1].split('class="MuiStack-root joy-vce80x" href="/@175ame/post/')[1].split('"')[0]
            }
            document.querySelector(".page_title").innerText = content_title
            document.querySelector(".page_content").innerHTML += '<div class="article_category"></div><div class="article_content"></div><div class="article_prevnext"></div><div class="article_reply"></div>'
            document.querySelector(".article_category").innerHTML = '<a href="./?p=story&c='+content_category+'">' + content_category+'</a>'
            if (content_prev) {
                document.querySelector(".article_prevnext").innerHTML += '<div id="prev"><a href="./?e='+content_prev+'">이전글</a></div>'
            } else {
                document.querySelector(".article_prevnext").innerHTML += '<div id="prev">첫 에피소드입니다.</div>'
            }
            if (content_next) {
                document.querySelector(".article_prevnext").innerHTML += '<div id="next"><a href="./?e='+content_next+'">다음글</a></div>'
            } else {
                document.querySelector(".article_prevnext").innerHTML += '<div id="next">마지막 에피소드입니다.</div>'
            }
            document.querySelector(".article_reply").innerHTML = '<a href="https://postype.com/@175ame/post/'+episode+'">덧글 달고 후원하러 가기</a>'

            var content_list = content.split('<div class="photoset-inner">')
            for (var j=1; j<content_list.length; j++){
                if (!content_list[j].includes('" alt=""')){
                    document.querySelector(".article_content").innerHTML += '<img class="story_img" src="'+content_list[j].split('" alt="')[1].split('">')[0]+'">'
                }
            }
        })
} else if (page) {
    var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+"/main/pages/"+page+".md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector(".page_content").innerHTML += marked.parse(out)

        $(document).ready(function(){
	
            $('ul.tabs li').click(function(){
                var tab_id = $(this).attr('data-tab');
        
                $('ul.tabs li').removeClass('current');
                $('.tab-content').removeClass('current');
        
                $(this).addClass('current');
                $("#"+tab_id).addClass('current');
            })
        
        })
    })
} 