console.log('Dashboard page')


async function searchIssue() {

    const text = document.getElementById("searchInput").value

    showLoader()

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)

    const data = await res.json()

    displayIssues(data.data)

    hideLoader()

}