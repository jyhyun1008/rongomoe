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

if (!page && !article) {
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
                            document.querySelector(".article_list").innerHTML += '<div class="article"><a href="./?e='+articles[j].category+'_'+articles[j].date+'_'+articles[j].title+'"><span>'+articles[j].title+'</span><span><code>'+articles[j].category+'</code> <code>'+articles[j].date+'</code></span></a></div>'
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
    document.querySelector(".page_title").innerText = '활동 기록'
    if (category) {
        document.querySelector(".page_title").innerText += '/'+category
    } 
    document.querySelector(".page_content").innerHTML += '<div class="modoru"><a href="./?p=story">전체보기</a></div>'
    document.querySelector(".page_content").innerHTML += '<div class="article_list"></div>'
    var url = "https://api.github.com/repos/"+githubUserName+"/"+githubRepoName+"/git/trees/main"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        var resultree1 = JSON.parse(out).tree;
        for (var k=0; k < resultree1.length; k++) {
            if (resultree1[k].path == 'story') {
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
                    document.querySelector(".modoru").innerHTML += ' · <a href="./?p=story&c='+categories[j]+'">'+categories[j] + '</a>'
                    }

                    for (var j=0; j<articles.length; j++){
                        if (articles[j].category == category || !category){
                            document.querySelector(".article_list").innerHTML += '<div class="article"><a href="./?a='+articles[j].category+'_'+articles[j].date+'_'+articles[j].title+'"><span>'+articles[j].title+'</span><span><code>'+articles[j].category+'</code> <code>'+articles[j].date+'</code></span></a></div>'
                        }
                    }
                })
            }
        }
    })
} else if (episode) {
    var article_category = episode.split('_')[0]
    var article_date = episode.split('_')[1]
    var article_title = episode.split('_')[2].split('.')[0]
    var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+"/main/story/"+episode+".md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector(".page_title").innerText = article_title
        document.querySelector(".page_content").innerHTML += '<div class="article_category"></div><div class="article_content"></div>'
        document.querySelector(".article_category").innerHTML = '<a href="./?p=story&c='+article_category+'">' + article_category+'</a> · '+article_date
        document.querySelector(".article_content").innerHTML += marked.parse(out)
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