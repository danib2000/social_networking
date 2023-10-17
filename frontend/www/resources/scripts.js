const postsData = [
  {
    username: "User Name",
    timeAgo: "3 hrs ago",
    content: "This is a sample post content. Here goes the user's post text.",
    imagePath: "/resources/images/placeholder.png",
  },
  {
    username: "User Name",
    timeAgo: "3 hrs ago",
    content: "This is a sample post content. Here goes the user's post text.",
    imagePath: "/resources/images/placeholder.png",
  },
  {
    username: "User Name",
    timeAgo: "3 hrs ago",
    content: "This is a sample post content. Here goes the user's post text.",
    imagePath: "/resources/images/placeholder.png",
  },
  {
    username: "User Name",
    timeAgo: "3 hrs ago",
    content: "This is a sample post content. Here goes the user's post text.",
    imagePath: "/resources/images/placeholder.png",
  },
  {
    username: "User Name",
    timeAgo: "3 hrs ago",
    content: "This is a sample post content. Here goes the user's post text.",
    imagePath: "/resources/images/placeholder.png",
  },
  {
    username: "User Name",
    timeAgo: "3 hrs ago",
    content: "This is a sample post content. Here goes the user's post text.",
    imagePath: "/resources/images/placeholder.png",
  },
  {
    username: "User Name",
    timeAgo: "3 hrs ago",
    content: "This is a sample post content. Here goes the user's post text.",
    imagePath: "/resources/images/placeholder.png",
  },
  {
    username: "User Name",
    timeAgo: "3 hrs ago",
    content: "This is a sample post content. Here goes the user's post text.",
    imagePath: "/resources/images/placeholder.png",
  },
];

const groupsData = [
  {
    name: "Group Name",
  },
  {
    name: "Group Name",
  },
  {
    name: "Group Name",
  },
  {
    name: "Group Name",
  },
  {
    name: "Group Name",
  },
];

const usersData = [
  {
    name: "User Name",
  },
  {
    name: "User Name",
  },
  {
    name: "User Name",
  },
  {
    name: "User Name",
  },
  {
    name: "User Name",
  },
];

function generatePosts(data) {
  return data
    .map((post) => {
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
    })
    .join("");
}

function generateUsers(data) {
  return data
    .map((user) => {
      return `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <a href="/profile/${user.name}">${user.name}</a>
                <button class="btn btn-sm btn-primary">Add Friend</button>
            </li>
        `;
    })
    .join("");
}

function generateGroups(data) {
  return data
    .map((group) => {
      return `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <a href="/group/${group.name}">${group.name}</a>
            <button class="btn btn-sm btn-primary">Join Group</button>
        </li>
        `;
    })
    .join("");
}

function generateProfile(username) {
  profileData = [
    {
      username: username,
      gender: "Male",
      intrested_in: ["Web Development", "Computer science"],
      degree: "Bachelor of Computer Science",
      phone: "+1234567890",
      email: "johndoe@email.com",
      groups: ["Application Development", "AI Research"],
    },
  ];
  return profileData
    .map((profile) => {
      const intrested_in = profile.intrested_in
        .map((intrest) => intrest)
        .join(", ");
      const groups = profile.groups
        .map(
          (group) =>
            `<a href="/group/${group}" class="text-primary">${group}</a>`
        )
        .join(", ");

      return `
        <img src="/resources/images/placeholder.png" alt="User's Profile Picture" class="profile-img mb-3">
        <h2 class="subtitle">${profile.username}</h2>
        <p class="detail">${profile.gender}</p>
        ${intrested_in ? `<p class="detail">${intrested_in}</p>` : ""}
        <p class="detail">${profile.degree}</p>
        <p class="detail">${profile.phone}</p>
        <p class="detail">${profile.email}</p>
        <h2 class="subtitle">Groups:</h2>
        ${groups ? `<p class="detail">${groups}</p>` : ""}
        `;
    })
    .join("");
}

function generateGroup(groupname) {
  groupData = [
    {
      groupname: groupname,
      subject: "subject",
      description: "description",
      location: "location",
      members: ["Ron Megini", "Adi Hakimi", "Dani Sudani"],
    },
  ];
  return groupData
    .map((group) => {
      const members = group.members
        .map(
          (member) =>
            `<a href="/profile/${member}" class="text-primary">${member}</a>`
        )
        .join(", ");

      return `
        <img src="/resources/images/placeholder.png" alt="User's Profile Picture" class="profile-img mb-3">
        <h2 class="subtitle">${group.groupname}</h2>
        <p class="detail">${group.subject}</p>
        <p class="detail">${group.description}</p>
        <p class="detail">${group.location}</p>
        <h2 class="subtitle">Members:</h2>
        ${members ? `<p class="detail">${members}</p>` : ""}
        `;
    })
    .join("");
}

$(document).ready(function () {
  $(".posts").html(generatePosts(postsData));
  $(".suggested-users").html(generateUsers(usersData));
  $(".suggested-groups").html(generateGroups(groupsData));

  $(".logo-image").click(function () {
    $(this).toggleClass("rotated");
  });

  const pathComponents = window.location.pathname.split("/");
  const object = pathComponents[2];
  $(".profile-details").html(generateProfile(object));
  $(".group-details").html(generateGroup(object));
});

$("#modal_trigger").on("click", function () {
  $("#includedContent").load("../login/model.html", function () {
    $(".popupContainer").css({ "z-index": "100", display: "unset" });
    // Calling Login Form
    $("#login_form").click(function () {
      $(".social_login").hide();
      $(".user_login").show();
      return false;
    });

    // Calling Register Form
    $("#register_form").click(function () {
      $(".social_login").hide();
      $(".user_register").show();
      $(".header_title").text("Register");
      return false;
    });

    // Going back to Social Forms
    $(".back_btn").click(function () {
      $(".user_login").hide();
      $(".user_register").hide();
      $(".social_login").show();
      $(".header_title").text("Login");
      return false;
    });
    $(".modal_close").click(function () {
      $(".popupContainer").hide();
      return false;
    });
  });
});
