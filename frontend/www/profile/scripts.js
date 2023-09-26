const postsData = [
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

const profileData = [
    {
        username: "Ron Megini",
        gender: "Male",
        intrested_in: ["Web Development", "Computer science"],
        degree: "Bachelor of Computer Science",
        phone: "+1234567890",
        email: "johndoe@email.com",
        groups_in: ["Application Development", "AI Research"]
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

function generatePosts(data) {
    return data.map(post => {
        return `
        <article class="mb-4">
            <div class="card">
                <img src="${post.imagePath}" class="card-img-top" alt="Post Image">
                <div class="card-body">
                    <h5 class="card-title">${post.username} <small class="text-muted">${post.timeAgo}</small></h5>
                    <p class="card-text">${post.content}</p>
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

function generateProfile(data) {
    return data.map(profile => {
        const intrested_in = profile.intrested_in.map(intrest => intrest).join(", ");
        const groups_in = profile.groups_in.map(group => `<a href="#" class="text-primary">${group}</a>`).join(", ");

        return `
        <img src="/resources/images/placeholder.png" alt="User's Profile Picture" class="profile-img mb-3">
        <h2 class="username">${profile.username}</h2>
        <p class="gender">${profile.gender}</p>
        ${ intrested_in ? `<p class="intrested_in">${intrested_in}</p>` : "" }
        <p class="degree">${profile.degree}</p>
        <p class="phone">${profile.phone}</p>
        <p class="email">${profile.email}</p>
        <h2 class="groups" href="#">Groups</h2>
        ${ groups_in ? `<p class="groups_in">${groups_in}</p>` : "" }
        `;
    }).join("");
}


$(document).ready(function() {
    $('.posts').html(generatePosts(postsData));
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

$(document).ready(function() {
    $('.profile-details').html(generateProfile(profileData));
});
