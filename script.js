const posts = [];
const postDivs = document.createElement('div');


const fetchData = (url) => {
    return new Promise((resolve, reject) => {
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error while fetching JSON data');
        }
        return response.json();
    })
    .then(data => {
        resolve(data);
    })
    .catch(error => {
        reject(error);
    });
})};

const process = async (url) => {
    const data = await fetchData(url);
    try{
        processData(data);
    }
    catch{
        console.log("error");
    }
}

const compare = (a, b) => {
    if ( a.upvotes < b.upvotes ){
      return 1;
    }
    if ( a.upvotes > b.upvotes ){
      return -1;
    }
    return 0;
}

const processData = (data) => {
    postDivs.innerHTML = "";
    posts.length = 0;
    for (let i = 0; i < data.data.children.length; i++){
        let object = {};
        object["upvotes"] = data.data.children[i].data.ups;
        object["title"] = data.data.children[i].data.title;
        object["body"] = data.data.children[i].data.selftext;
        if (typeof data.data.children[i].data.url_overridden_by_dest == "undefined"){
            object["image"] = "self";
        }
        else{
            object["image"] = data.data.children[i].data.url_overridden_by_dest;
        }
        object["nsfw"] = data.data.children[i].data.whitelist_status.includes("promo_adult_nsfw") ? true : false;
        object["url"] = `https://www.reddit.com${data.data.children[i].data.permalink}`
        posts.push(object);
    }
    posts.sort(compare); 
    for (let i = 0; i < posts.length; i++){
        const content = document.createElement('div');
        content.classList.add('post');
        const title = document.createElement('div');
        const upvotes = document.createElement('div');
        const body = document.createElement('div');
        const image = document.createElement('img');
        const link = document.createElement('a');
    
        upvotes.textContent = "upvotes: " + posts[i].upvotes;
        image.setAttribute("src", posts[i].image);
        body.textContent = posts[i].body;
        
        link.addEventListener("click", () => {
            if (posts[i].nsfw){
                let confirmation = confirm("this post is NSFW. Are you sure you would like to go?");
                if (confirmation){
                    window.open(posts[i].url, '_blank').focus();
                }
            }
            else{
                window.open(posts[i].url, '_blank').focus();
            }
        });
        link.textContent = posts[i].title

        title.appendChild(link);
        content.appendChild(title);
        content.appendChild(upvotes);
        if (posts[i].nsfw){
            const nsfw = document.createElement('div');
            nsfw.textContent = "CAUTION: NSFW";
            nsfw.style.color = "red";
            content.appendChild(nsfw);
        }
        else{
            content.appendChild(body);
        }
        
        if (posts[i].image != "self" && !posts[i].nsfw){
            content.appendChild(image);
        }
        postDivs.appendChild(content);
    }
    document.body.appendChild(postDivs);
}

document.querySelector("#submit").addEventListener("click", (e) => {
    e.preventDefault();
    process(`https://www.reddit.com/r/${document.querySelector("#subreddit").value}.json?limit=100`);
})


