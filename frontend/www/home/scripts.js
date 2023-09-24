const articlesData = [
    {
        username: "Username",
        timeAgo: "3 hrs ago",
        content: "This is a sample post content. Here goes the user's post text.",
        imagePath: "/resources/images/placeholder.png"
    },
    {
        username: "Username",
        timeAgo: "3 hrs ago",
        content: "This is a sample post content. Here goes the user's post text.",
        imagePath: "/resources/images/placeholder.png"
    },
    {
        username: "Username",
        timeAgo: "3 hrs ago",
        content: "This is a sample post content. Here goes the user's post text.",
        imagePath: "/resources/images/placeholder.png"
    },
    {
        username: "Username",
        timeAgo: "3 hrs ago",
        content: "This is a sample post content. Here goes the user's post text.",
        imagePath: "/resources/images/placeholder.png"
    },
    {
        username: "Username",
        timeAgo: "3 hrs ago",
        content: "This is a sample post content. Here goes the user's post text.",
        imagePath: "/resources/images/placeholder.png"
    },
    {
        username: "Username",
        timeAgo: "3 hrs ago",
        content: "This is a sample post content. Here goes the user's post text.",
        imagePath: "/resources/images/placeholder.png"
    },
    {
        username: "Username",
        timeAgo: "3 hrs ago",
        content: "This is a sample post content. Here goes the user's post text.",
        imagePath: "/resources/images/placeholder.png"
    },
    {
        username: "Username",
        timeAgo: "3 hrs ago",
        content: "This is a sample post content. Here goes the user's post text.",
        imagePath: "/resources/images/placeholder.png"
    }
];

const usersData = [
    {
        name: "Username"
    },
    {
        name: "Username"
    },
    {
        name: "Username"
    },
    {
        name: "Username"
    },
    {
        name: "Username"
    }
];

const groupsData = [
    {
        name: "Group Name"
    },
    {
        name: "Group Name"
    },
    {
        name: "Group Name"
    },
    {
        name: "Group Name"
    },
    {
        name: "Group Name"
    }
];

function generateArticles(data) {
    return data.map(article => {
        return `
        <article class="mb-4">
            <div class="card">
                <img src="${article.imagePath}" class="card-img-top" alt="Post Image">
                <div class="card-body">
                    <h5 class="card-title">${article.username} <small class="text-muted">${article.timeAgo}</small></h5>
                    <p class="card-text">${article.content}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <a href="#" class="text-primary">Like</a> · 
                        <a href="#" class="text-primary">Comment</a> · 
                        <a href="#" class="text-primary">Share</a>
                    </li>
                </ul>
            </div>
        </article>
        `;
    }).join("");
}

function generateUsers(data) {
    return data.map(user => {
        return `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${user.name}
                <button class="btn btn-sm btn-primary">Add Friend</button>
            </li>
        `;
    }).join("");
}

function generateGroups(data) {
    return data.map(group => {
        return `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${group.name}
            <button class="btn btn-sm btn-primary">Join Group</button>
        </li>
        `;
    }).join("");
}

$(document).ready(function() {
    $('.articles').html(generateArticles(articlesData));
});

$(document).ready(function() {
    $('.suggested-users').html(generateUsers(usersData));
});

$(document).ready(function() {
    $('.suggested-groups').html(generateGroups(groupsData));
});

$(document).ready(function() {
    $('.logo-image').click(function() {
        $(this).toggleClass('rotated');
    });
});
