if(localStorage.getItem("login")!=="true"){
    window.location.href="login.html";
}
const API="https://phi-lab-server.vercel.app/api/v1/lab/issues"
const container=document.getElementById("issuesContainer")
async function loadIssues() {
    const res = await fetch(API);
    const data = await res.json();
    console.log(data);
    displayIssues(data.data);
    
}
loadIssues()
function displayIssues(issues){
    if(!issues) return;
    container.innerHTML=""
    document.getElementById("issueCount").innerText=issues.length+ " Issues "
    
    issues.forEach(issue=>{
        let border=issue.status==="open"?"border-green-500":"border-purple-500"
        let card=document.createElement("div")
        let priorityClass= issue.priority.toLowerCase()==="high"? "bg-red-100 text-red-600": issue.priority.toLowerCase()==="medium"?"bg-yellow-100 text-yellow-600":"bg-gray-100 text-gray-600"
        card.className=` relative bg-white p-4 pt-8 rounded shadow border-t-4 ${border} cursor-pointer hover:shadow-lg `
        let statusIcon= issue.status.toLowerCase() === "open" ? "image/Open-Status.png" : "image/Closed-Status.png";

        
        let labelsHTML="";
        issue.labels.forEach(label =>{
            let color = "bg-gray-200 text-gray-700";
            if(label ==="bug"){
                color="bg-red-100 text-red-600";
            }
            else if(label === "enhancement"){
                color= "bg-blue-100 text-blue-600";
            }
            else if(label === "documentation"){
                color ="bg-purple-100 text-purple-600";
            }
            else if(label === "good first issue"){
                color="bg-green-100 text-green-600";
            }
            labelsHTML+=`<span class="px-2 py-1 rounded ${color}">${label}</span>`;
        });

        card.innerHTML=`<div class="flex justify-between mb-2">
                        <img src="${statusIcon}" class="absolute top-2 left-2 w-5 h-5">
                        <span class="absolute top-2 right-2 text-xs px-2 py-1 rounded ${priorityClass}">${issue.priority}</span>
                        </div>
                        
                        <h3 class="font-semibold text-sm mb-1 mt-2">${issue.title}</h3>

                        <p class="text-gray-500 text-xs mb-3 line-clamp-2">${issue.description}</p>

                        <div class="flex gap-2 mb-3 text-xs flex-wrap">${labelsHTML}</div>


                        <div class="text-xs text-gray-400">
                        #${issue.id} by ${issue.author}<br> ${new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                        `;
        card.onclick = () =>openModal(issue.id)
        container.appendChild(card)
        
    });
    document.getElementById("modalLabels").innerHTML=labelsHTML;
};
async function setActive(type) {
    document.querySelectorAll(".tab-btn").forEach(btn=> btn.classList.remove("bg-purple-600", "text-white"))
    document.getElementById(type + "Tab").classList.add("bg-purple-600", "text-white")

    if(type === "all"){
        loadIssues()
        return
    }

    const res= await fetch(API)
    const data = await res.json()
    const filtered = data.data.filter(i=> i.status ===type)
    displayIssues(filtered)
    
}
async function searchIssue() {
    let text = document.getElementById("searchInput").value 
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)
    const data = await res.json()
    displayIssues(data.data)
}

async function openModal(id) {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    const data =await res.json()
    const issue = data.data

    
        let labelsHTML="";
        issue.labels.forEach(label =>{
            let color = "bg-gray-200 text-gray-700";
            if(label ==="bug"){
                color="bg-red-100 text-red-600";
            }
            else if(label === "enhancement"){
                color= "bg-blue-100 text-blue-600";
            }
            else if(label === "documentation"){
                color ="bg-purple-100 text-purple-600";
            }
            else if(label === "good first issue"){
                color="bg-green-100 text-green-600";
            }
            labelsHTML+=`<span class="px-2 py-1 rounded ${color}">${label}</span>`;
        });

    document.getElementById("modalLabels").innerHTML=labelsHTML;
    document.getElementById("modalTitle").innerText= issue.title
    document.getElementById("modalDescription").innerText= issue.description
    document.getElementById("modalAuthor").innerText= `Opened by ${issue.author} - ${new Date(issue.createdAt).toLocaleDateString()}`
    document.getElementById("modalAssignee").innerText= issue.author

    let priorityColor= issue.priority.toLowerCase() === "high"? "bg-red-500":issue.priority.toLowerCase()==="medium"? "bg-yellow-500":"bg-gray-400"
    let modalPriority= document.getElementById("modalPriority")
    modalPriority.innerText= issue.priority
    modalPriority.className= `${priorityColor} text-white px-3 py-1 rounded text-xs`

    document.getElementById("issueModal").showModal()
}
