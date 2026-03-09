const cardContainer = document.getElementById("issuesContainer")
const issueCount = document.getElementById("issueCount")
const loader = document.getElementById("loader")

let issueStore = []

//Issues

const fetchIssues = () => {
    showLoader(true)
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            issueStore = data.data
            renderIssues(issueStore)
        })
}


//Show Loader

const showLoader = (state) => {

    if (state) {
        loader.classList.remove("hidden")
        cardContainer.classList.add("hidden")
    }
    else {
        loader.classList.add("hidden")
        cardContainer.classList.remove("hidden")
    }
}


//Issues

const renderIssues = (issues) => {

    cardContainer.innerHTML = ""
    issueCount.innerText = issues.length + " Issues"

    issues.forEach(issue => {

        let borderColor = "border-green-500"
        let statusIcon = "Open-Status.png"

        if (issue.status === "closed") {
            borderColor = "border-purple-500"
            statusIcon = "Closed.png"
        }
        const card = document.createElement("div");
        card.className = `bg-white rounded-lg shadow p-5 border-t-4 cursor-pointer ${borderColor}`;
        card.innerHTML = `
        <div class="flex justify-between">
            <img src="./assets/${statusIcon}">
            <span>${showPriority(issue.priority)}</span>
        </div>
        <h2 class="font-semibold mt-2">${issue.title}</h2>
        <p class="text-gray-500 text-sm mt-1">${issue.description}</p>
        <div class="flex flex-wrap gap-2 my-3">
            ${showLabels(issue.labels)}
        </div>
        <hr>
        <div class="text-gray-500 text-sm mt-3">
            <p>#${issue.author}</p>
            <p>#${issue.priority}</p>
            <p>${issue.createdAt}</p>
            <p>${issue.updatedAt}</p>
        </div>
        `
        card.addEventListener("click", () => {
            openIssue(issue.id)
        })
        cardContainer.appendChild(card)
    })
    showLoader(false);
}


//Priority Function

const showPriority = (priority) => {

    let color = "";

    if (priority === "high") {
        color = " text-red-500 bg-red-200";
    }
    else if (priority === "medium") {
        color = "badge-warning text-yellow-600 bg-yellow-200";
    }
    else if (priority === "low") {
        color = "badge-success text-[#9CA3AF] bg-[#EEEFF2]";
    }
    return `
        <span class="rounded-xl px-4 py-0.5 ${color}">
            ${priority}
        </span>
    `;
}


//Label Function

const showLabels = (labels) => {

    const html = labels.map(label => {

        let color = "badge-neutral";

        if (label === "bug") {
            color = "badge-error text-red-400 bg-red-200";
            return `<span class="badge ${color} badge-outline"><i class="fa-solid fa-bug"></i>${label}</span>`
        }
        else if (label === "help wanted") {
            color = "badge-warning text-yellow-600 bg-yellow-200";
            return `<span class="badge ${color} badge-outline"><i class="fa-solid fa-life-ring"></i>${label}</span>`
        }
        else if (label === "enhancement") {
            color = "badge-success text-green-400 bg-green-100";
            return `<span class="badge ${color} badge-outline"><i class="fa-solid fa-bolt"></i>${label}</span>`
        }
        else if (label === "good first issue") {
            color = "badge-neutral text-black-400 bg-blue-100";
            return `<span class="badge ${color} badge-outline"><i class="fa-solid fa-hand-holding-heart"></i>${label}</span>`
        }
        else if (label === "documentation") {
            color = "badge-primary bg-blue-200 text-blue-600";
            return `<span class="badge ${color} badge-outline"><i class="fa-solid fa-book"></i>${label}</span>`
        }
    })
    return html.join(" ");
}


//Filter Button

document.getElementById("btn-all").addEventListener("click", () => {
    filterWithLoader(issueStore);
})

document.getElementById("btn-open").addEventListener("click", () => {
    const openList = issueStore.filter(i => i.status === "open")
    filterWithLoader(openList);
})

document.getElementById("btn-closed").addEventListener("click", () => {
    const closedList = issueStore.filter(i => i.status === "closed")
    filterWithLoader(closedList);
})


//Filter Button With Delay

const filterWithLoader = (list) => {
    showLoader(true)

    setTimeout(() => {
        renderIssues(list)
        showLoader(false)
    }, 400)
}



//Search Button Work

document.getElementById("searchInput").addEventListener("input", () => {

    const text = document.getElementById("searchInput").value.toLowerCase().trim()

    if (text === "") {
        renderIssues(issueStore);
        return;
    }

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)
        .then(res => res.json())
        .then(data => {
            renderIssues(data.data);
        })
})


//Modal

const openIssue = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(data => {
            showModalInfo(data.data);
        })
}


//Modal Display

const showModalInfo = (issue) => {

    let statusColor = "";
    let priorityColor = "";

    if (issue.status === "open") {
        statusColor = "bg-green-500 text-white";
    } else {
        statusColor = "bg-purple-500 text-white";
    }


    if (issue.priority === "high") {
        priorityColor = "bg-red-500 text-white";
    }
    else if (issue.priority === "medium") {
        priorityColor = "bg-yellow-400 text-black";
    }
    else {
        priorityColor = "bg-gray-400 text-white";
    }

    document.getElementById("modal_content").innerHTML = `
    <h2 class="text-2xl font-bold text-gray-800 mb-3">
        ${issue.title}
    </h2>

    <div class="flex items-center gap-3 text-gray-500 mb-4">
        <span class="px-3 py-1 rounded-full text-sm font-semibold ${statusColor}">
            ${issue.status}
        </span>
        <span>Opened by <b>${issue.author}</b></span>
        <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
    </div>

    <div class="flex flex-wrap gap-2 mb-4">
        ${showLabels(issue.labels)}
    </div>

    <p class="text-gray-600 mb-6">${issue.description}</p>

    <div class="grid grid-cols-2 gap-6 bg-gray-100 p-4 rounded-lg">

        <div>
            <p class="text-gray-500 text-sm">Assignee</p>
            <p class="font-semibold">
                ${issue.assignee || issue.author}
            </p>
        </div>

        <div>
            <p class="text-gray-500 text-sm">Priority</p>
            <span class="px-3 py-1 rounded-full text-sm font-semibold ${priorityColor}">
                ${issue.priority.toUpperCase()}
            </span>
        </div>
    </div>
    `
    document.getElementById("issue_modal").showModal()
}

//Button Style

const toggleTab = (id) => {

    document.querySelectorAll("#btn-all,#btn-open,#btn-closed").forEach(btn => {
        btn.classList.remove("bg-blue-600", "text-white");
        btn.classList.add("bg-white", "text-black/60");
    })
    const activeBtn = document.getElementById(id);
    activeBtn.classList.remove("bg-white", "text-black/60");
    activeBtn.classList.add("bg-blue-600", "text-white");
}

window.addEventListener("DOMContentLoaded", fetchIssues);