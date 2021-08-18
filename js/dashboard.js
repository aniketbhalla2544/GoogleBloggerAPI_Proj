

// TOP PRIORITY WORK  : TPW
const dashboardLeftBox = document.getElementById("dashboard__leftBox");
const topRightBox = document.querySelector(".topRightBox");
const options = [...dashboardLeftBox.getElementsByClassName("optionsBox__optionItem")];

const dashboardRightBox = document.getElementById("dashboard__rightBox");
const forms = [...dashboardRightBox.getElementsByTagName("form")];

const baseUrl = "https://www.googleapis.com/blogger/v3";
const bloggerUserId = "0261696XXXXXXXXX";   // change user id for gurmat Singh
const bloggerApiKey = ""; // insert API key here
const bearerToken = ''; // insert bearer token 
// const bearerToken = '';
// const bearerToken = '';
// const bearerToken = '';
const bearer = `Bearer ${bearerToken}`;
const userId = '028091139XXXXXXXXXX';
const resultBox = document.getElementById("resultBox");


// TPW : TOP PRIORITY WORK
(() => {

    console.log('TPW-1: Fetching blog Ids');

    const fullUrl = `${baseUrl}/users/${userId}/blogs`;

    (async () => {

        try {
            const httpResponse = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `${bearer}`,
                }
            });
            const fetchedData = await httpResponse.json();

            console.log(fetchedData);

            const { items: fetchedBlogsArray } = fetchedData;

            // fetching blog id & name from 1....n blog objects, & reducing it to string for options
            const generatedSelectOptionsList = fetchedBlogsArray.reduce((acc, blog) => {

                const { id, name } = blog;

                return acc + `<option value="${id}">${name}</option> `;
            }, "");

            const allDasboardSelects = [...document.querySelectorAll("select")];
            const finalGeneratedSelectOptionsList = `<option selected class="text-capitalize text - white" value="">select blog</option> ${generatedSelectOptionsList}`;


            allDasboardSelects.forEach((select) => {
                select.innerHTML = `${finalGeneratedSelectOptionsList}`;
            });


        } catch (error) {
            resultBox.innerText = `TPW ERROR OCCURRED: ${error}`;
        }

        console.log('TPW-1: Fetching blog Ids done');

    })();
})();

// ---------------------------------------------------------------------------------------------

const getHttpResponseStatusString = status => {
    return (status > 199 && status < 300) ? "successful response" : "not a successful response";
};

const addClickStyleToOptions = (option) => {

    // before adding style remove style on others
    options.forEach((optionItem) => {

        (optionItem.classList.contains("optionClickStyle")) ? optionItem.classList.remove("optionClickStyle") : null
    });

    // adding style on the clicked option
    option.classList.add("optionClickStyle");
}

const displayRequiredFormOnClick = (index) => {

    forms.forEach((formElem, formIndex) => {

        resultBox.innerHTML = "";

        // displaying required one
        if (formIndex === index) formElem.classList.remove("d-none")

        // d-none to others
        forms.forEach((form, i) => {
            if (i !== index) form.classList.add("d-none");
        });
    });

}

// get all blogs
document.getElementById('bloggerUserId').innerText = `${userId}`;

const getAllBlogsData = () => {

    const fullUrl = `${baseUrl}/users/${userId}/blogs`;

    (async () => {

        try {
            const httpResponse = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `${bearer}`,
                }
            });

            const fetchedData = await httpResponse.json();
            const { url: userBlogsUrl } = await fetchedData.items[0];
            resultBox.innerHTML = `<a href="${userBlogsUrl}" class="resultBox__linkStyle" target="_blank">Click to see all the blogs</a>`;

        } catch (error) {
            resultBox.innerText = `${error}`;
        }
    })();
}

options.forEach((option, index) => {

    // upon option clicked
    option.addEventListener('click', e => {

        addClickStyleToOptions(option);

        displayRequiredFormOnClick(index);

        switch (index) {

            // Get all blogs
            case 5:

                getAllBlogsData();

                break;

            default:
                break;
        }
        // switch case ends
    });
    // option click event finished

});


// search post form handling : user friendly
const searchPostForm = document.getElementById("searchPostForm");
const selectBlog = searchPostForm.querySelector("select");
const queryInput = searchPostForm.querySelector("input");

searchPostForm.addEventListener('submit', e => {

    e.preventDefault();
    resultBox.innerHTML = "";
    resultBox.style.color = "white";

    const query = queryInput.value.trim();
    const selectedBlog = selectBlog.value;

    console.log(`query is: ${query} & selectedBlog is ${selectedBlog}`);

    if (query !== "" && selectedBlog !== "") {

        const fullUrl = `${baseUrl}/blogs/${selectedBlog}/posts/search?q=${query}&key=${bloggerApiKey}`;
        console.log(fullUrl);

        (async () => {

            try {
                const httpResponse = await fetch(fullUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const fetchedData = await httpResponse.json();
                console.log(fetchedData);

                const { url: fetchedPostUrl } = fetchedData.items[0];

                resultBox.innerHTML = `<a class='resultBox__linkStyle' href="${fetchedPostUrl}" target="_blank" >Click link to see the post online</a>`;

            } catch (error) {
                resultBox.innerHTML = `${error}`;
            }
        })();

    } else {

        const error = (query === "" || selectedBlog === "") ? "Choosen selected blog or query isn't correct" : "Some other error occured in Search Post form."
        resultBox.innerText = `${error}`;
        resultBox.style.color = "red";
    }

});


// create post form handling : user friendly
const createPostForm = document.getElementById("createPostForm");
const selectBlogCreatePost = createPostForm.querySelector("select");
const titleInputCreatePost = createPostForm.querySelector("input");
const blogContentCreatePost = createPostForm.querySelector("textarea");

createPostForm.addEventListener('submit', e => {

    e.preventDefault();
    resultBox.innerHTML = "";
    resultBox.style.color = "white";

    // values
    const selectedBlog = selectBlogCreatePost.value;
    const blogTitle = titleInputCreatePost.value.trim();    //capitalize in future
    const blogContent = blogContentCreatePost.value.trim();

    console.log(`selectedBlog is ${selectedBlog}, blogTitle is: ${blogTitle} & blogContent is ${blogContent}`);

    if (selectedBlog !== "" && blogTitle !== "" && blogContent !== "") {

        const fullUrl = `${baseUrl}/blogs/${selectedBlog}/posts/`;
        console.log(fullUrl);

        (async () => {

            try {
                const httpResponse = await fetch(fullUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${bearer}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            kind: "blogger#post",
                            blog: {
                                id: `${selectedBlog}`
                            },
                            title: `${blogTitle}`,
                            content: `${blogContent}`
                        }
                    ),
                });
                const fetchedData = await httpResponse.text();
                console.log(fetchedData);
                resultBox.innerText = "Post successfully created..!! Check Admin's account under selected blog.";
            } catch (error) {
                resultBox.innerHTML = `${error}`;
            }
        })();


    } else {
        const error = "Pls fill out form as per requirements";
        resultBox.innerText = `${error}`;
        resultBox.style.color = "red";
    }

});


// delete post form handling : user friendly
const deletePostForm = document.getElementById("deletePostForm");
const selectBlogDeletePost = deletePostForm.querySelector("select");
const titleInputDeletePost = deletePostForm.querySelector("input");

deletePostForm.addEventListener('submit', e => {

    e.preventDefault();
    resultBox.innerHTML = "";
    resultBox.style.color = "white";


    // values
    const selectedBlog = selectBlogDeletePost.value;
    const postTitleInput = titleInputDeletePost.value.trim();    //capitalize in future

    if (selectedBlog !== "" && postTitleInput !== "") {

        const fullUrl = `${baseUrl}/blogs/${selectedBlog}/posts/search?q=${postTitleInput}&key=${bloggerApiKey}`;

        (async () => {

            try {

                //-----------------------------------getting the post's id---------------------------------------------
                const httpResponse = await fetch(fullUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const fetchedData = await httpResponse.json();
                const { id } = fetchedData.items[0];    // assuming first result would be the post
                console.log(`to be deleted post's id is: ${id}`);


                //-----------------------------------Deleting the post--------------------------------------------------

                const deletePostUrl = `${baseUrl}/blogs/${selectedBlog}/posts/${id}`;

                const httpDeleteResponse = await fetch(deletePostUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `${bearer}`,
                    }
                });

                const responseStatus = await httpDeleteResponse.status;

                resultBox.innerText = (getHttpResponseStatusString(responseStatus) === "successful response") ? 'Successfully deleted..!! Check Admin\'s account under selected blog.' : "status response not good";

            } catch (error) {
                console.log(`Error occured while deleting the post: ${error}`);
            }
        })();

    } else {
        const error = "Pls fill out form as per requirements";
        resultBox.innerText = `${error}`;
        resultBox.style.color = "red";
    }
});

// update post form handling : user friendly
const updatePostForm = document.getElementById("updatePostForm");
const selectBlogUpdatePost = updatePostForm.querySelector("select");
const titleInputUpdatePost = updatePostForm.querySelector("input");
const blogContentUpdatePost = updatePostForm.querySelector("textarea");

updatePostForm.addEventListener('submit', e => {

    e.preventDefault();
    resultBox.innerHTML = "";
    resultBox.style.color = "white";

    // values
    const selectedBlog = selectBlogUpdatePost.value;
    const postTitleInput = titleInputUpdatePost.value.trim();    //capitalize in future
    const blogContent = blogContentUpdatePost.value.trim();

    console.log(`selectedBlog is ${selectedBlog}, postTitleInput is: ${postTitleInput} & blogContent is ${blogContent}`);

    if (selectedBlog !== "" && postTitleInput !== "" && blogContent !== "") {

        const fullUrl = `${baseUrl}/blogs/${selectedBlog}/posts/search?q=${postTitleInput}&key=${bloggerApiKey}`;
        console.log(fullUrl);

        (async () => {

            try {

                //-----------------------------------getting the post's id---------------------------------------------
                const httpResponse = await fetch(fullUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const fetchedData = await httpResponse.json();
                const { id } = fetchedData.items[0];    // assuming first result would be the post
                console.log(`to be updated post's id is: ${id}`);

                // post update with post id ------------------------------------------------

                const updatePostUrl = `${baseUrl}/blogs/${selectedBlog}/posts/${id}`;

                const httpUpdatePostUrlResponse = await fetch(updatePostUrl, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `${bearer}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            content: `${blogContent}`
                        }
                    ),
                });

                const responseStatus = await httpUpdatePostUrlResponse.status;

                resultBox.innerText = (getHttpResponseStatusString(responseStatus) === "successful response") ? 'Successfully updated..!! Check Admin\'s account under selected blog.' : "status response not good";

            } catch (error) {
                resultBox.innerHTML = `${error}`;
            }
        })();


    } else {
        const error = "Pls fill out form as per requirements";
        resultBox.innerText = `${error}`;
        resultBox.style.color = "red";
    }

});


// get all posts form  |  User friendly
const getAllPostsForm = document.getElementById("getAllPostsForm");
const selectBlogGetAllPosts = getAllPostsForm.querySelector("select");

getAllPostsForm.addEventListener('submit', e => {

    e.preventDefault();
    resultBox.innerHTML = "";
    resultBox.style.color = "white";

    // values
    const selectedBlog = selectBlogGetAllPosts.value;

    console.log(`selectedBlog is ${selectedBlog}`);

    if (selectedBlog !== "") {
        // return
        const fullUrl = `${baseUrl}/blogs/${selectedBlog}/posts/?key=${bloggerApiKey}`;
        console.log(fullUrl);

        (async () => {

            try {
                const httpResponse = await fetch(fullUrl, {
                    method: 'GET'
                });
                const fetchedData = await httpResponse.json();
                console.log(fetchedData);

                const { items: postsArray } = fetchedData;
                const allLinksToPosts = postsArray.reduce((acc, { url, title }) => {

                    return acc + `<a href="${url}" class="resultBox__linkStyle" target="_blank">Click to open ${title} post</a> | `;

                }, "");

                resultBox.innerHTML = `${allLinksToPosts}`;

            } catch (error) {
                resultBox.innerHTML = `${error}`;
            }
        })();

    } else {
        const error = "Pls fill out form as per requirements";
        resultBox.innerText = `${error}`;
        resultBox.style.color = "red";
    }

});