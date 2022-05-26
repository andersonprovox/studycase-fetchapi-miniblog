//Definindo url da API
const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form");

//Get id from URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

//Get all posts
async function getAllPosts() {
    //Reservando a resposta no fetch API
    const response = await fetch(url);
    //Transformando em Json a resposta da API
    const data = await response.json();

    loadingElement.classList.add("hide");

    //Map no data para pegar cada post da resposta da API e transformar numa postagem na página
    //Criando os elementos para a lista de posts com JS
    data.map((post) => {
        const div = document.createElement("div");
        const title = document.createElement("h2");
        const body = document.createElement("p");
        const link = document.createElement("a");

        title.innerText = post.title;
        body.innerText = post.body;
        link.innerHTML = "Ler";
        link.setAttribute("href", `/post.html?id=${post.id}`);

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        postsContainer.appendChild(div);
    });
}

//Get individual Post
async function getPost(id) {

    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ])

    const dataPost = await responsePost.json();

    const dataComments = await responseComments.json();

    loadingElement.classList.add("hide");
    postPage.classList.remove("hide");

    const title = document.createElement("h1");
    const body = document.createElement("p");

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    dataComments.map((comment) => {
        createComment(comment);
    });
}

function createComment(comment) {
    const div = document.createElement("div");
    const email = document.createElement("h3");
    const commmentBody = document.createElement("p");

    email.innerText = comment.email;
    commmentBody.innerText = comment.body;

    div.appendChild(email);
    div.appendChild(commmentBody);

    commentsContainer.appendChild(div);
}

//Post a comment
async function postComment(comment) {

    const response = await fetch(`${url}/${postId}/comments`, {
        method: "POST",
        body: comment,
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    createComment(data);
}

if(!postId) {
    getAllPosts();
} else {
    getPost(postId);

    // Add event to comment form

    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let comment = {
            email: emailInput.value,
            body: bodyInput.value,
        };

        comment = JSON.stringify(comment);

        postComment(comment);

    });
}