const screens = [
  {id:"splash",file:"01 · Splash (1).png",title:"Splash screen",group:"Getting started",category:"WELCOME",description:"A warm, welcoming introduction to the ChatApp workspace."},
  {id:"onboarding",file:"02 · Onboarding (1).png",title:"Onboarding",group:"Getting started",category:"WELCOME",description:"A quick first look at the people, ideas, and progress that live in ChatApp."},
  {id:"sign-in",file:"03 · Sign in (1).png",title:"Sign in",group:"Getting started",category:"ACCOUNT",description:"A simple sign-in flow to bring each teammate into their workspace."},
  {id:"home",file:"04 · Home (1).png",title:"Home",group:"Messages & teams",category:"MESSAGES",description:"A personal home for recent conversations, active teammates, and updates."},
  {id:"chat",file:"05 · Chat.png",title:"Direct message",group:"Messages & teams",category:"MESSAGES",description:"A focused one-to-one conversation with shared files and message replies."},
  {id:"new-message",file:"06 · New message.png",title:"New message",group:"Messages & teams",category:"MESSAGES",description:"Start a conversation and bring the right people into the thread."},
  {id:"team-chat",file:"07 · Team chat.png",title:"Team chat",group:"Messages & teams",category:"CHANNELS",description:"Keep project discussions together in a shared team channel."},
  {id:"team-info",file:"08 · Team info.png",title:"Team info",group:"Messages & teams",category:"CHANNELS",description:"See the members, shared links, and context behind a team space."},
  {id:"workspace",file:"09 · Workspace.png",title:"Workspace",group:"Workspace",category:"WORKSPACE",description:"A calm overview of channels and teams, organized for quick access."},
  {id:"calls",file:"10 · Calls.png",title:"Calls",group:"Calls & updates",category:"CALLS",description:"Find teammates and keep recent voice and video conversations close."},
  {id:"video-call",file:"11 · Video call.png",title:"Video call",group:"Calls & updates",category:"CALLS",description:"Meet face to face in a clean, comfortable video-call experience."},
  {id:"incoming-call",file:"12 · Incoming call.png",title:"Incoming call",group:"Calls & updates",category:"CALLS",description:"A clear incoming call state with quick ways to respond."},
  {id:"notifications",file:"13 · Notifications.png",title:"Notifications",group:"Workspace",category:"UPDATES",description:"Catch up on mentions and activity without losing your place."},
  {id:"files",file:"14 · Files.png",title:"Files",group:"Workspace",category:"FILES",description:"Find documents and shared resources from across the workspace."},
  {id:"profile-settings",file:"15 · Profile & settings.png",title:"Profile & settings",group:"Workspace",category:"SETTINGS",description:"Manage your profile, preferences, and personal workspace details."}
];

const screenList = document.querySelector("#screenList");
const galleryGrid = document.querySelector("#galleryGrid");
const screenSearch = document.querySelector("#screenSearch");
const image = document.querySelector("#screenImage");
let current = 3;

function selectScreen(index, options = {}) {
  current = (index + screens.length) % screens.length;
  const screen = screens[current];
  image.src = encodeURIComponent(screen.file);
  image.alt = `ChatApp ${screen.title} screen`;
  document.querySelector("#currentCategory").textContent = screen.category;
  document.querySelector("#screenTitle").textContent = screen.title;
  document.querySelector("#screenDescription").textContent = screen.description;
  document.querySelector("#screenEyebrow").textContent = screen.group.toUpperCase();
  document.querySelector("#screenCount").textContent = `${String(current + 1).padStart(2,"0")} / ${String(screens.length).padStart(2,"0")}`;
  document.querySelector("#stageIndex").textContent = String(current + 1).padStart(2,"0");
  document.querySelectorAll(".screen-option").forEach(button => {
    const active = Number(button.dataset.index) === current;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
  document.querySelectorAll(".gallery-card").forEach(button => button.classList.toggle("active", Number(button.dataset.index) === current));
  if (options.scroll) document.querySelector("#prototype").scrollIntoView({behavior:"smooth",block:"start"});
}

function buildScreenList(query = "") {
  screenList.replaceChildren();
  let lastGroup = "";
  const normalized = query.trim().toLowerCase();
  screens.forEach((screen, index) => {
    if (normalized && !`${screen.title} ${screen.group} ${screen.category}`.toLowerCase().includes(normalized)) return;
    if (screen.group !== lastGroup) {
      const heading = document.createElement("span");
      heading.className = "screen-group";
      heading.textContent = screen.group.toUpperCase();
      screenList.append(heading);
      lastGroup = screen.group;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "screen-option";
    button.dataset.index = index;
    button.innerHTML = `<span class="screen-number">${String(index + 1).padStart(2,"0")}</span><span>${screen.title}</span>`;
    button.addEventListener("click", () => selectScreen(index));
    screenList.append(button);
  });
  if (normalized && !screenList.children.length) {
    const empty = document.createElement("p");
    empty.className = "empty-search";
    empty.textContent = "No matching screens";
    screenList.append(empty);
  }
  selectScreen(current);
}

function buildGallery() {
  galleryGrid.replaceChildren();
  screens.forEach((screen,index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-card";
    button.dataset.index = index;
    button.setAttribute("aria-label", `Preview ${screen.title}`);
    button.innerHTML = `<span class="gallery-thumb"><img src="${encodeURIComponent(screen.file)}" alt="" loading="lazy"></span><strong>${screen.title}</strong><small>${screen.group}</small>`;
    button.addEventListener("click", () => selectScreen(index,{scroll:true}));
    galleryGrid.append(button);
  });
}

screenSearch.addEventListener("input",event => buildScreenList(event.target.value));
document.querySelector("#prevScreen").addEventListener("click",() => selectScreen(current-1));
document.querySelector("#nextScreen").addEventListener("click",() => selectScreen(current+1));
document.addEventListener("keydown",event => {
  if (event.target.matches("input,textarea") || document.querySelector("#screenDialog").open) return;
  if (event.key === "ArrowLeft") selectScreen(current-1);
  if (event.key === "ArrowRight") selectScreen(current+1);
});

const dialog = document.querySelector("#screenDialog");
document.querySelector("#expandScreen").addEventListener("click",() => {
  document.querySelector("#dialogImage").src = image.src;
  document.querySelector("#dialogImage").alt = image.alt;
  dialog.showModal();
});
document.querySelector("#closeDialog").addEventListener("click",() => dialog.close());
dialog.addEventListener("click",event => { if (event.target === dialog) dialog.close(); });

buildGallery();
buildScreenList();
