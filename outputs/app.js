/* NETRA role-based prototype. Mock content and preferences stay in this browser. */
const STORE_KEY = "netra-consumer-prototype-v1";
const products = [
  { id:"flask", brand:"AURA Audio", name:"AURA Audio Flask 550ml", short:"A warm, tactile bottle made for long desk days.", price:"₹2,499", trust:89, bites:"2.8K", label:"Acoustic drinkware", img:"assets/flask.jpg", note:"A double-walled stainless steel bottle, made for long desk days." },
  { id:"espresso", brand:"NordicForm", name:"Nordic Mini-Press V2 Espresso", short:"A compact espresso maker for slower mornings.", price:"₹3,899", trust:91, bites:"4.2K", label:"Coffee architecture", img:"assets/espresso.jpg", note:"Handheld 18-bar manual extraction chamber with CNC-milled aluminium housing." },
  { id:"kettle", brand:"UrbanKettle", name:"UrbanKettle Gooseneck Precision", short:"A balanced pour and a calm start to the morning.", price:"₹3,299", trust:88, bites:"1.9K", label:"Thermal precision", img:"assets/kettle.jpg", note:"PID-controlled pour speed curve with 0.5°C temperature stability." },
  { id:"lamp", brand:"Forma", name:"Forma Acoustic Desk Light", short:"A warm pool of light for the end of a long day.", price:"₹1,799", trust:94, bites:"3.1K", label:"Ambient illumination", img:"assets/lamp.jpg", note:"A sculptural desk lamp with a soft, focused glow." }
];
const additionalProducts = [
  ["airdots","Nira Sound","AirDots Mini","Light earbuds for commutes and study blocks.","₹1,899",88,"2.1K","Everyday audio","A tiny case and a comfortable fit for everyday listening."],
  ["studioloop","Mellow Audio","Studio Loop Headphones","Soft ear cushions, big sound, no fuss.","₹2,799",92,"3.8K","Over-ear audio","Over-ear headphones designed for long listening sessions."],
  ["pebble","Fieldtone","Pebble Bluetooth Speaker","Small speaker, surprisingly full room sound.","₹1,499",90,"1.7K","Portable sound","A compact speaker for kitchen playlists and balcony evenings."],
  ["sleeve","Tidy Carry","13-inch Laptop Sleeve","A padded sleeve with a neat, easy-access pocket.","₹899",86,"960","Workday carry","A slim padded sleeve that protects a 13-inch laptop."],
  ["keykind","Keykind","68-Key Mechanical Keyboard","A satisfying little click for your desk setup.","₹2,799",94,"4.4K","Desk essentials","A compact mechanical keyboard with a tactile, quiet profile."],
  ["daytrip","Daytrip","10K Pocket Power Bank","A dependable top-up that slips into any bag.","₹1,299",89,"1.8K","Travel tech","A pocket-sized power bank for busy days away from a socket."],
  ["slowhour","Slowhour","Ceramic Pour-over Set","A calm coffee ritual, one careful pour at a time.","₹1,199",93,"2.7K","Coffee tools","A ceramic dripper and carafe set for slow morning coffee."],
  ["monsoon-grinder","Monsoon Coffee","Hand Coffee Grinder","Fresh grounds, without giving up counter space.","₹1,799",91,"2.3K","Coffee tools","A small hand grinder with a smooth, adjustable ceramic burr."],
  ["morrow-mug","Studio Morrow","Everyday Travel Mug","A leak-resistant mug that keeps your first sip warm.","₹699",87,"1.2K","On-the-go rituals","A reusable travel mug with a snug lid and easy-grip finish."],
  ["little-bowl","Little Bowl","Insulated Lunch Box","A tidy lunch companion for desk days and day trips.","₹1,099",90,"1.5K","Food & daily life","An insulated lunch box with a compact, secure shape."],
  ["clear-day","Clear Day","Glass Electric Kettle","A clear view of the small things that make tea.","₹2,499",92,"2.9K","Kitchen rituals","A glass kettle with a clean silhouette and warm LED glow."],
  ["morning-arc","Morning Arc","Handheld Milk Frother","A soft cloud on top, in a few quick seconds.","₹1,299",88,"1.4K","Coffee tools","A rechargeable frother for coffee, matcha, and hot chocolate."],
  ["forma-caddy","Forma Living","Wooden Desk Caddy","Pens, notes, and little things finally have a home.","₹1,499",94,"2.6K","Desk objects","A warm wood organizer with room for everyday desk tools."],
  ["soft-corner","Soft Corner","Portable Glow Lamp","Take a softer pool of light from room to room.","₹2,299",93,"3.2K","Ambient lighting","A cordless accent lamp for reading corners and bedside tables."],
  ["northline-mouse","Northline","Ergo Wireless Mouse","A more comfortable shape for long work sessions.","₹1,799",89,"2.2K","Workday tech","An ergonomic wireless mouse with a quiet, tactile click."],
  ["good-paper","Good Paper Club","Journal & Pen Pair","A fresh page and a pen that feels good in hand.","₹599",96,"1.1K","Paper goods","A cloth-bound notebook paired with a balanced brass pen."],
  ["dayglow-bar","Dayglow","Monitor Light Bar","A brighter desk, without taking up more desk.","₹2,499",91,"2.8K","Desk lighting","An adjustable monitor light bar with warm and cool settings."],
  ["pelli-wallet","Pelli Goods","Slim Leather Wallet","A light everyday wallet that keeps the essentials close.","₹1,999",90,"1.9K","Everyday carry","A slim leather wallet with quick-access card slots."],
  ["solskin-serum","SolSkin Labs","Bright Day Serum","A simple morning layer with a light, quick finish.","₹1,499",89,"3.1K","Skin care","A lightweight vitamin C serum made for everyday routines."],
  ["dew-house","Dew House","Everyday Face Mist","A cool little reset for warm afternoons.","₹649",87,"1.3K","Skin care","A gentle face mist in a travel-friendly bottle."],
  ["bare-kind","Bare Kind","Barrier Cream","Comforting moisture for a slower evening routine.","₹899",92,"2.4K","Skin care","A fragrance-free barrier cream for daily use."],
  ["sunroom-spf","Sunroom","Mineral SPF 50","A light mineral sunscreen for everyday outdoor plans.","₹799",95,"3.6K","Sun care","A mineral sunscreen with a comfortable, easy-spread texture."],
  ["attar-air","Attar & Air","No. 04 Eau de Parfum","Warm citrus and cedar, made for close encounters.","₹2,199",90,"2.5K","Fragrance","A warm, woody eau de parfum in a compact glass bottle."],
  ["weekend-kit","Weekend Kit","Canvas Wash Pouch","A roomy pouch for the small things you take everywhere.","₹899",86,"870","Travel essentials","A sturdy zip pouch with a wipe-clean lining."],
  ["stride-cloud","Stride Lab","Cloud Runner Shoes","A cushioned everyday pair for one more long walk.","₹2,999",93,"5.2K","Everyday movement","Lightweight walking shoes with a springy, cushioned sole."],
  ["everyday-tote","Everyday Objects","Canvas Market Tote","Room for the market run, laptop, and extra plans.","₹699",91,"2.0K","Everyday carry","A strong canvas tote with an inner pocket and wide straps."],
  ["open-mat","Open Mat","Daily Yoga Mat","A grippy, easy-to-carry mat for a little movement.","₹1,299",89,"1.6K","Movement","A lightweight yoga mat with a textured, non-slip surface."],
  ["pocket-frame","Pocket Frame","Mini Digital Camera","A tiny camera for keeping the day as it felt.","₹2,999",94,"4.8K","Creative tools","A compact digital camera with a simple point-and-shoot feel."],
  ["green-ritual","Green Ritual","Ceramic Planter","A bright corner begins with one happy little leaf.","₹899",92,"1.7K","Home & plants","A glazed ceramic planter sized for a desk or sunny sill."],
  ["tablefolk","Tablefolk","Glass Food Storage Set","Keep the good bits visible and the leftovers fresh.","₹1,699",90,"2.1K","Kitchen storage","A set of stackable glass containers with secure bamboo lids."]
].map(function(item,index){return {id:item[0],brand:item[1],name:item[2],short:item[3],price:item[4],trust:item[5],bites:item[6],label:item[7],note:item[8],img:"assets/trend-"+String(index+1).padStart(2,"0")+".jpg"};});
const businesses = [
  { id:"nordic", name:"NordicForm", category:"Coffee & home", followers:"288K", trust:90, initials:"N", img:"assets/espresso.jpg", bites:"4.2K Bites" },
  { id:"aura", name:"AURA Audio", category:"Sound for every day", followers:"142K", trust:91, initials:"A", img:"assets/flask.jpg", bites:"2.8K Bites" },
  { id:"urbankettle", name:"UrbanKettle", category:"Tools for slow mornings", followers:"86K", trust:88, initials:"U", img:"assets/kettle.jpg", bites:"1.9K Bites" },
  { id:"forma", name:"Forma Living", category:"Light & useful objects", followers:"74K", trust:94, initials:"F", img:"assets/lamp.jpg", bites:"3.1K Bites" },
  { id:"solskin", name:"SolSkin Labs", category:"Care without the fuss", followers:"186K", trust:89, initials:"S", img:"assets/flask.jpg", bites:"2.4K Bites" },
  { id:"monsoon", name:"Monsoon Coffee", category:"Coffee, close to home", followers:"61K", trust:92, initials:"M", img:"assets/espresso.jpg", bites:"1.2K Bites" },
  { id:"fieldaudio", name:"Field Audio", category:"Listen a little closer", followers:"93K", trust:90, initials:"F", img:"assets/flask.jpg", bites:"980 Bites" },
  { id:"morrow", name:"Studio Morrow", category:"Made for small spaces", followers:"52K", trust:87, initials:"M", img:"assets/lamp.jpg", bites:"840 Bites" },
  { id:"littlegrain", name:"Little Grain", category:"Rituals for the table", followers:"38K", trust:93, initials:"L", img:"assets/kettle.jpg", bites:"720 Bites" },
  { id:"plumeroom", name:"Plume Room", category:"Everyday skin care", followers:"110K", trust:91, initials:"P", img:"assets/flask.jpg", bites:"1.6K Bites" },
  { id:"amberworks", name:"Amber Works", category:"Objects with a story", followers:"47K", trust:88, initials:"A", img:"assets/lamp.jpg", bites:"610 Bites" },
  { id:"sundaysupply", name:"Sunday Supply", category:"A softer start", followers:"69K", trust:92, initials:"S", img:"assets/espresso.jpg", bites:"1.1K Bites" }
];
const storyCreators = [
  {name:"Mira", handle:"@miramakes", panel:0, label:"New drop"},
  {name:"Dev", handle:"@devkulkarni", panel:1, label:"On set"},
  {name:"Asha", handle:"@ashafinds", panel:2, label:"First look"},
  {name:"Kabir", handle:"@kabirbuilds", panel:3, label:"Desk tour"},
  {name:"Rhea", handle:"@rheareviews", panel:4, label:"Quick take"},
  {name:"Neil", handle:"@neiltries", panel:5, label:"Worth a look"}
];
const creatorNotes = [
  {name:"Mira Shah", handle:"@miramakes", time:"8 min", text:"A tiny coffee corner can change the whole morning. Tried this before work today.", img:"assets/espresso.jpg", panel:0, replies:"248"},
  {name:"Dev Kulkarni", handle:"@devkulkarni", time:"21 min", text:"Turn the sound up. That little click is the best part of this design.", img:"assets/flask.jpg", panel:1, replies:"186"},
  {name:"Rhea Menon", handle:"@rheareviews", time:"34 min", text:"Three weeks in: the warm light is still the first thing I switch on.", img:"assets/lamp.jpg", panel:4, replies:"92"}
];
const trendingTopics = [
  {name:"Small-space desks", lift:"↑ 28%"}, {name:"Coffee at home", lift:"↑ 21%"}, {name:"Soft lighting", lift:"↑ 18%"},
  {name:"Skin-care routines", lift:"↑ 14%"}, {name:"Better sound", lift:"↑ 11%"}
];
const biteClips = [
  {product:"espresso", creator:"Mira Shah", handle:"@miramakes", name:"My 7:12 coffee break", views:"84K views", likes:"12.8K", duration:"0:26", img:"assets/bite-coffee-creator.png", panel:0, genres:["creative","classic"]},
  {product:"flask", creator:"Kabir Rao", handle:"@kabirbuilds", name:"Does this bottle stay cold?", views:"52K views", likes:"8,420", duration:"0:34", img:"assets/flask.jpg", panel:3, genres:["funny","creative"]},
  {product:"lamp", creator:"Rhea Menon", handle:"@rheareviews", name:"The light I use every night", views:"38K views", likes:"6,104", duration:"0:19", img:"assets/lamp.jpg", panel:4, genres:["well-edited","classic"]},
  {product:"kettle", creator:"Dev Kulkarni", handle:"@devkulkarni", name:"A quieter way to pour", views:"27K views", likes:"4,208", duration:"0:31", img:"assets/kettle.jpg", panel:1, genres:["suspense","well-edited"]},
  {product:"espresso", creator:"Anya Bose", handle:"@anyabose", name:"Countertop, before and after", views:"19K views", likes:"2,940", duration:"0:22", img:"assets/espresso.jpg", panel:2, genres:["horror","funny"]}
];
const adGenres = [
  {id:"funny",name:"Funny ads",copy:"A good laugh, a clever idea",tile:0,count:"1.4K clips"},
  {id:"creative",name:"Creative ads",copy:"Big ideas, made with care",tile:1,count:"2.1K clips"},
  {id:"classic",name:"Classic ads",copy:"Old favourites, still brilliant",tile:2,count:"860 clips"},
  {id:"well-edited",name:"Well-edited ads",copy:"Cuts that keep you watching",tile:3,count:"3.2K clips"},
  {id:"suspense",name:"Suspense ads",copy:"A little pause before the reveal",tile:4,count:"890 clips"},
  {id:"horror",name:"Horror & thrills",copy:"Spooky, strange, and fun to watch",tile:5,count:"420 clips"}
];
// Full-bleed campaign artwork for the one-time intro before the existing welcome flow.
// Keep this list data-driven so the story can be reordered without duplicating UI.
const netraStorySlides = [
  {id:"welcome", image:"assets/story-01-welcome.jpeg", alt:"A glowing NETRA mascot warmly welcoming visitors at a doorway."},
  {id:"sofa-explainer", image:"assets/story-02-sofa-explainer.jpeg", alt:"The NETRA mascot on a sofa introducing the story."},
  {id:"paper-overview", image:"assets/story-03-paper-overview.jpeg", alt:"A table covered with printed NETRA campaign story panels, with a lets begin speech bubble."},
  {id:"adcommerce", image:"assets/story-04-adcommerce.jpeg", alt:"Friends around a table under the NETRA India's first Adcommerce campaign artwork."},
  {id:"biryani-story", image:"assets/story-05-biryani-story.jpeg", alt:"A creator speaking with a street food vendor beside trays of biryani."},
  {id:"content-as-ads", image:"assets/story-06-content-as-ads.jpeg", alt:"A young man laughing while watching something on his phone."},
  {id:"creator-value", image:"assets/story-08-creator-value.jpeg", alt:"A creator recording a product-related video in a warmly lit room."},
  {id:"honest-opinions", image:"assets/story-09-honest-opinions.jpeg", alt:"A person recording an honest opinion on a phone."},
  {id:"product-memory", image:"assets/story-10-product-memory.jpeg", alt:"Two people discussing products and a saved product memory."},
  {id:"commercial-identity", image:"assets/story-11-commercial-identity.jpeg", alt:"A concert scene with a creator and a commercial opportunity notification."},
  {id:"sofa-goodbye", image:"assets/story-12-sofa-goodbye.jpeg", alt:"The playful NETRA mascot signing off from a sofa."}
];
const gameIds = ["spot","deal","thisor","guess"];
function loadState() {
  let persisted = {};
  try { persisted = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {}; } catch (e) {}
  const loaded = Object.assign({
    screen:"welcome", tab:"home", selectedRole:"consumer", onboardingStep:1,
    interests:["Specialty Coffee","Premium Audio","Desk Aesthetics","Clean Skincare"],
    contents:["Storytelling","Founder stories","Product demos"], intent:"I’m exploring",
    discovery:"Show me what’s relevant", budget:"₹3,000 / month",
    about:"Design-curious. Always looking for useful objects with a good story.",
    saved:["flask","espresso"], liked:{}, trusted:{}, followed:{}, votes:{}, completedGames:[],
    coins:2840, profileSubtab:"memory", searchText:"", accountMode:"signup", discoveryMode:"Interactive", gamePicks:{spot:[],deal:[]}, profileMode:"consumer",
    activeMessage:"friends", notificationRead:false, replies:[], hasSeenNetraStory:false, storyIndex:0,
    creatorDisciplines:["Filmmaking","Storytelling","Video Editing"], creatorStyles:["Cinematic","Story-driven","Unexpected & Satirical"], creatorExperience:"Professional",
    creatorGoals:["Compete in CFunds","Earn Escrow Bounties","Work with Indie Brands"], creatorAvailability:true, creatorConnected:false,
    creatorFormat:"Short Film (9:16)", creatorAudit:["identity","music","disclosure","runtime"], creatorAnalyticsTab:"Overview", creatorFundFilter:"For You",
    creatorIdea:"A fast-paced comedy sketch where an absurd Mumbai landlord is interviewed by the flat’s smart appliance.",
    creatorHook:"The hook opens within 1.2 seconds: a toaster violently ejects a slice of burned bread directly into the landlord’s hands.",
    creatorIntegration:"The modular kitchen and noise-dampening acoustic wall panels become central comedic plot devices without feeling forced.",
    creatorMediaName:"urban_nest_final_master_v3.mp4", creatorDraftSaved:false,
    brandName:"Aura Home Studio", brandHandle:"aurahomestudio", brandDiscipline:"Design Studio",
    brandOrigin:"Aura Home Studio crafts minimal acoustic artifacts and tactile brass desk objects. Designed to decelerate modern work and restore mindful presence.",
    brandManifesto:"We make thoughtful objects for a slower, more intentional everyday.", brandStoryName:"", brandLogoName:"",
    brandCreateType:"Video Reel", brandCampaignAim:"Conversion / Direct Sale", brandBudget:"₹300 / day",
    brandConsumerTab:"Overview", brandFundView:"hub", brandFundFilter:"Live CFunds", brandReply:""
  }, persisted);
  delete loaded.profilePhoto;
  delete loaded.brandLogoData;
  if(loaded.accountMode==="verify-pending"||loaded.accountMode==="reset-password")loaded.accountMode="signin";
  // Existing users get the cinematic story once; after Launch/Skip the normal
  // welcome screen remains the first screen on subsequent visits.
  if (!loaded.hasSeenNetraStory) loaded.screen="story";
  return loaded;
}
let state = loadState();
if(!state.followed || !Object.keys(state.followed).length) state.followed={nordic:true,aura:true,solskin:true,forma:true};
let modal = null;
let noticeTimer = 0;
let searchQuery = "";
let serverMe = null;
let authBusy = false;
let onboardingSaveTimer = 0;
const app = document.getElementById("app");
document.documentElement.dataset.theme=state.theme||"warm";
let bitesFeed = [];
let bitesLoading = false;
let bitesError = null;
let bitesOffset = 0;
let bitesHasMore = true;
let bitesLoadingMore = false;
let biteObserver = null;
const viewedBites = new Set();
const BITES_PAGE_SIZE = 10;

async function apiRequest(path, options) {
  const response=await fetch(path,Object.assign({credentials:"same-origin",headers:{"content-type":"application/json"}},options||{}));
  const raw=await response.text();
  let payload={};
  try{payload=raw?JSON.parse(raw):{};}catch(e){payload={message:raw};}
  if(!response.ok){const failure=new Error(payload.error&&payload.error.message||payload.message||payload.code||"The request could not be completed.");failure.code=payload.error&&payload.error.code||payload.code;failure.status=response.status;throw failure;}
  return payload;
}
function backendProfile(role){return role==="brand"||role==="advertiser"?"business":role==="creator"?"creator":"consumer";}
function uiProfile(profile){return profile==="business"?"brand":profile||"consumer";}
function accountCallbackUrl(profile){const url=new URL("/",location.origin);if(profile==="creator"||profile==="business")url.searchParams.set("activateProfile",profile);return url.toString();}
function isProfileComplete(data, profile){
  if(profile==="consumer")return Boolean(data.profile&&data.profile.onboardingComplete);
  const record=profile==="creator"?data.profileSetup:data.profileSetup;
  return Boolean(record&&(record.onboardingStep==="complete"||record.completedAt));
}
function onboardingStepFor(data, profile){
  const raw=profile==="consumer"?(data.profileSetup&&data.profileSetup.currentStep||data.profile&&data.profile.onboardingStep):data.profileSetup&&data.profileSetup.currentStep||data.profileSetup&&data.profileSetup.onboardingStep;
  const known={personalization:1,discovery:2,details:3,identity:1,creative_dna:2,trajectory:3,review:4,complete:profile==="creator"?4:3};
  if(Number.isInteger(Number(raw))&&Number(raw)>0)return Math.min(Number(raw),profile==="creator"?4:profile==="business"?2:3);
  return known[raw]||1;
}
function applyServerMe(data){
  serverMe=data;state.authenticated=true;state.name=data.user.name||"";state.email=data.user.email||"";state.username=data.user.username||"";state.profilePhoto=data.user.image||"";
  state.activatedProfiles=(data.activatedProfiles||[]).map(uiProfile);state.profileMode=uiProfile(data.activeProfile);state.selectedRole=state.profileMode;
  if(data.consumer){state.interests=data.consumer.interests||[];state.contents=data.consumer.contentPreferences||[];state.intent=data.consumer.activeIntent||"I’m exploring";state.discoveryMode=data.consumer.discoveryMode||"Interactive";state.budget=data.consumer.buyingCapacity||"₹3,000 / month";state.radar=data.consumer.radar||"";}
  const setup=data.profileSetup||{};
  if(state.profileMode==="brand"){state.brandName=setup.businessName||state.brandName;state.brandHandle=setup.handle||state.brandHandle;state.brandDiscipline=setup.discipline||state.brandDiscipline;state.brandOrigin=setup.origin||state.brandOrigin;state.brandManifesto=setup.manifesto||state.brandManifesto;}
  if(state.profileMode==="brand")state.businessVerificationStatus=setup.verificationStatus||"UNVERIFIED";
  state.onboardingComplete=isProfileComplete(data,data.activeProfile);state.onboardingStep=onboardingStepFor(data,data.activeProfile);
}
async function refreshServerMe(){const data=await apiRequest("/api/v1/me",{method:"GET",headers:{}});applyServerMe(data);return data;}
function onboardingData(){
  if(state.profileMode==="creator")return {name:state.name,username:state.username,creatorBase:state.creatorBase,disciplines:state.creatorDisciplines,rankOrder:state.creatorRankOrder,styles:state.creatorStyles,experience:state.creatorExperience,goals:state.creatorGoals,availability:state.creatorAvailability,connected:state.creatorConnected};
  if(state.profileMode==="brand")return {businessName:state.brandName,handle:state.brandHandle,discipline:state.brandDiscipline,origin:state.brandOrigin,manifesto:state.brandManifesto,logoName:state.brandLogoName,storyName:state.brandStoryName};
  return {interests:state.interests,contentPreferences:state.contents,activeIntent:state.intent,discoveryMode:state.discoveryMode,buyingCapacity:state.budget,radar:state.radar,about:state.about};
}
function scheduleOnboardingSave(){
  if(!serverMe||state.screen!=="onboarding")return;
  clearTimeout(onboardingSaveTimer);
  onboardingSaveTimer=setTimeout(async function(){
    try{
      const steps=state.profileMode==="creator"?["identity","creative_dna","trajectory","review"]:state.profileMode==="brand"?["identity","story"]:["personalization","discovery","details"];
      await apiRequest("/api/v1/me/onboarding",{method:"PATCH",body:JSON.stringify({step:steps[Math.max(0,Math.min(steps.length-1,(Number(state.onboardingStep)||1)-1))],data:onboardingData()})});
      if(state.profileMode==="consumer")await apiRequest("/api/v1/me/preferences",{method:"PUT",body:JSON.stringify({interests:state.interests||[],contentPreferences:state.contents||[],activeIntent:state.intent||"I’m exploring",discoveryMode:state.discoveryMode||"Interactive",buyingCapacity:state.budget||"₹3,000 / month",radar:state.radar||""})});
    }catch(error){showNotice(error.message||"Could not save onboarding yet.");}
  },350);
}
async function enterProfile(profile, activate){
  const type=backendProfile(profile);
  if(!serverMe){state.profileMode=uiProfile(type);state.selectedRole=state.profileMode;state.screen="app";state.tab="home";modal=null;persist();render();showNotice("Profile switching is available after signing in.");return;}
  if(activate){await apiRequest("/api/v1/me/profiles/"+type+"/activate",{method:"POST",body:"{}"});}
  else await apiRequest("/api/v1/me/active-profile",{method:"PUT",body:JSON.stringify({profileType:type})});
  const data=await refreshServerMe();
  state.screen=isProfileComplete(data,type)?"app":"onboarding";state.tab="home";state.onboardingStep=onboardingStepFor(data,type);modal=null;persist();render();
  showNotice(state.screen==="onboarding"?"Continue setting up your "+uiProfile(type)+" profile.":uiProfile(type).charAt(0).toUpperCase()+uiProfile(type).slice(1)+" profile is now active.");
}
async function restoreServerSession(){
  const params=new URLSearchParams(location.search);
  const token=params.get("token")||params.get("resetToken")||"";
  if(token){state.resetToken=token;state.accountMode="reset-password";state.screen="account";render();return;}
  try{
    const data=await refreshServerMe();
    const requested=params.get("activateProfile");
    if(requested==="creator"||requested==="business"){
      await apiRequest("/api/v1/me/profiles/"+requested+"/activate",{method:"POST",body:"{}"});
      await refreshServerMe();
      history.replaceState({},"",location.pathname);
    }
    state.screen=isProfileComplete(serverMe,serverMe.activeProfile)?"app":"onboarding";
    state.tab="home";state.onboardingStep=onboardingStepFor(serverMe,serverMe.activeProfile);
    if(!state.hasSeenNetraStory&&state.screen==="app")state.hasSeenNetraStory=true;
    persist();render();
  }catch(error){
    if(params.has("activateProfile"))showNotice("Verify your email before activating this profile.");
    if(params.has("reset")){state.accountMode="reset-request";state.screen="account";render();if(params.get("error"))showNotice("That reset link has expired. Request a new one.");}
  }finally{
    fetchBitesFeed();
  }
}

function persist() {
  const copy = Object.assign({}, state, { screen:"welcome", tab:"home", onboardingStep:1 });
  ["name","email","username","profilePhoto","brandLogoData","authenticated","activatedProfiles","accountPendingEmail","accountEmailDraft","resetToken"].forEach(function(key){delete copy[key];});
  delete copy.commentAttachment;
  delete copy.commentDraft;
  delete copy.biteComments;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(copy)); } catch (e) {}
  scheduleOnboardingSave();
}
function esc(value) {
  return String(value == null ? "" : value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
}
function formatCount(num) {
  if (num == null) return "0";
  const n = Number(num);
  if (isNaN(n)) return String(num);
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}
function timeAgo(dateStr) {
  if (!dateStr) return "recently";
  const delta = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (delta < 60) return "just now";
  if (delta < 3600) return Math.floor(delta / 60) + "m";
  if (delta < 86400) return Math.floor(delta / 3600) + "h";
  return Math.floor(delta / 86400) + "d";
}
async function fetchBitesFeed(reset) {
  if (bitesLoading) return;
  if (reset) {
    bitesOffset = 0;
    bitesHasMore = true;
    bitesError = null;
  }
  bitesLoading = true;
  if (state.tab === "bites") render();
  try {
    const data = await apiRequest("/api/v1/bites/feed?limit=" + BITES_PAGE_SIZE + "&offset=" + bitesOffset);
    const items = Array.isArray(data.items) ? data.items : [];
    bitesFeed = reset || bitesOffset === 0 ? items : bitesFeed.concat(items);
    bitesOffset += items.length;
    bitesHasMore = items.length >= BITES_PAGE_SIZE;
    bitesError = null;
  } catch (err) {
    bitesError = err.message || "Failed to load Bites feed.";
  } finally {
    bitesLoading = false;
    if (state.tab === "bites" || state.tab === "home") render();
  }
}
async function loadNextBitesPage() {
  if (bitesLoading || bitesLoadingMore || !bitesHasMore) return;
  bitesLoadingMore = true;
  if (state.tab === "bites") render();
  try {
    const data = await apiRequest("/api/v1/bites/feed?limit=" + BITES_PAGE_SIZE + "&offset=" + bitesOffset);
    const items = Array.isArray(data.items) ? data.items : [];
    bitesFeed = bitesFeed.concat(items);
    bitesOffset += items.length;
    bitesHasMore = items.length >= BITES_PAGE_SIZE;
  } catch (err) {
  } finally {
    bitesLoadingMore = false;
    if (state.tab === "bites") render();
  }
}
function setupBiteVideoObserver() {
  if (biteObserver) {
    biteObserver.disconnect();
    biteObserver = null;
  }
  const feed = document.querySelector(".bite-feed");
  if (!feed) return;
  biteObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      const video = entry.target.querySelector("video.bite-video");
      if (!video) return;
      const biteId = entry.target.dataset.biteId;
      const isExplicitlyPaused = state.playingBite === biteId;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        if (!isExplicitlyPaused) {
          video.muted = true;
          video.playsInline = true;
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function() {});
          }
        }
        if (serverMe && biteId && !viewedBites.has(biteId)) {
          viewedBites.add(biteId);
          apiRequest("/api/v1/bites/" + biteId + "/interactions", { method: "POST", body: JSON.stringify({ type: "VIEW" }) }).catch(function(){});
        }
      } else {
        video.pause();
      }
    });
  }, {
    root: feed,
    threshold: [0, 0.5, 1.0]
  });
  const bites = feed.querySelectorAll(".full-bite");
  bites.forEach(function(b) {
    biteObserver.observe(b);
  });
}
function icon(name, size) {
  const paths = {
    eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff:'<path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A11.5 11.5 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1 0 2-.2 2.9-.5"/>',
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    play:'<rect x="3" y="4" width="18" height="16" rx="4"/><path d="m10 8 6 4-6 4z"/>',
    playFill:'<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>',
    pause:'<path d="M8 5v14M16 5v14" stroke-width="3"/>',
    dice:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>',
    message:'<path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-4-.9L4 20l1.3-3.4A7.2 7.2 0 0 1 4 12c0-4.2 3.6-7.5 8-7.5s8 2.9 8 7Z"/>',
    person:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.6-3.1 3-5 7-5s6.4 1.9 7 5"/>',
    search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    bell:'<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 22h4"/>',
    tune:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    heart:'<path d="M20.8 8.8c0 5.2-8.8 10.1-8.8 10.1S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z"/>',
    trust:'<path d="M12 3v18M6 7h12M7 7l-3 6h6L7 7ZM17 7l-3 6h6l-3-6Z"/>',
    comment:'<path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-4-.9L4 20l1.3-3.4A7.2 7.2 0 0 1 4 12c0-4.2 3.6-7.5 8-7.5s8 2.9 8 7Z"/>',
    share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4"/>',
    bookmark:'<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    back:'<path d="m15 18-6-6 6-6M9 12h12"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    spark:'<path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
    bag:'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 2.9-.2-.1a1.7 1.7 0 0 0-1.9-.2 1.7 1.7 0 0 0-1 1.5v.2h-3.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.2l-.2.1-1.7-2.9.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H5.5v-3.4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.7-2.9.2.1a1.7 1.7 0 0 0 1.9.2 1.7 1.7 0 0 0 1-1.5v-.2H15v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.2l.2-.1 1.7 2.9-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z"/>',
    pin:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    gift:'<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M2 6h20v4H2zM12 6v15M12 6H8.5a2.5 2.5 0 1 1 2.2-3.7L12 6Zm0 0h3.5a2.5 2.5 0 1 0-2.2-3.7L12 6Z"/>',
    mic:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
    send:'<path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/>',
    image:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/>',
    sparkles:'<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
    trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"/>',
    briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/>',
    people:'<path d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 4.3a3.5 3.5 0 0 1 0 6.7M18 14h1a4 4 0 0 1 4 4v2"/>',
    chart:'<path d="M4 19V5M4 19h17M8 15l4-4 3 2 5-6M16 7h4v4"/>',
    video:'<rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 10 4-3v10l-4-3zM9 9l4 3-4 3z"/>',
    wallet:'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M16 14h2"/>',
    camera:'<path d="M4 7h3l1.5-2h7L17 7h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
    shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    trend:'<path d="m3 17 6-6 4 4 8-9M15 6h6v6"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4"/>'
  };
  return '<svg aria-hidden="true" width="'+(size || 20)+'" height="'+(size || 20)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(paths[name] || paths.spark)+'</svg>';
}
function logo() { return '<span class="brand-mark">'+icon("eye",17)+'<i></i></span>'; }
function productById(id) { return products.find(function(p){ return p.id === id; }) || additionalProducts.find(function(p){ return p.id === id; }) || products[0]; }
function businessForProduct(product) {
  const known={"NordicForm":"nordic","AURA Audio":"aura","UrbanKettle":"urbankettle","Forma":"forma","Forma Living":"forma","SolSkin Labs":"solskin","Monsoon Coffee":"monsoon"};
  const match=businesses.find(function(b){return b.id===known[product.brand]||b.name===product.brand;});
  return match||{id:"brand-"+product.brand.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:product.brand,category:product.label,followers:"18K",trust:product.trust,initials:initials(product.brand),img:product.img,bites:product.bites+" Bites"};
}
function buyingCapacity() {
  if(String(state.budget||"").toLowerCase().includes("under")) return 1000;
  const match=String(state.budget||"").match(/[\d,]+/);
  return match?Number(match[0].replaceAll(",","")):3000;
}
function selectedProductIds() { return state.saved || []; }
function initials(name) { return String(name || "Tanvi Rao").trim().split(" ").filter(Boolean).slice(0,2).map(function(part){return part[0]||"";}).join("").toUpperCase(); }
function roleBadge(mode) {
  const type=mode||"consumer", label=type==="creator"?"cr":type==="brand"?"b":"c";
  return '<span class="role-avatar-badge badge-'+type+'" aria-label="'+type+' profile">'+label+'</span>';
}
function profilePhotoContent() { return state.profilePhoto?'<img src="'+esc(state.profilePhoto)+'" alt="Profile photo" />':initials(state.name); }
function creatorPhoto(size) { return '<span class="creator-photo '+(size||'')+'">'+profilePhotoContent()+'</span>'; }
function profileAvatar(size, mode) {
  const type=mode||state.profileMode||"consumer";
  return '<span class="avatar-stack avatar-stack-'+type+'"><span class="avatar '+(size||'')+'">'+profilePhotoContent()+'</span>'+roleBadge(type)+'</span>';
}
function showNotice(message) {
  const old = document.querySelector(".notice"); if (old) old.remove();
  const node = document.createElement("div"); node.className = "notice"; node.textContent = message; document.body.appendChild(node);
  clearTimeout(noticeTimer); noticeTimer = setTimeout(function(){ node.remove(); }, 2400);
}
function setScreen(screen, tab) {
  state.screen = screen;
  if (tab) state.tab = tab;
  modal = null; persist(); render(true);
}
function button(label, action, cls, extra) {
  return '<button type="button" class="'+(cls || "small-button")+'" data-action="'+action+'" '+(extra || "")+'>'+label+'</button>';
}
function navItem(key, label, glyph) {
  return '<button class="nav-item '+(state.tab===key && state.screen==="app" ? "active" : "")+'" data-action="nav" data-tab="'+key+'" aria-label="'+label+'" title="'+label+'">'+icon(glyph,21)+'</button>';
}
function bottomNav() {
  if(state.profileMode==="creator") return creatorBottomNav();
  if(state.profileMode==="brand") return brandBottomNav();
  return '<nav class="bottom-nav" aria-label="Consumer navigation">'+
    navItem("home","Home","home")+navItem("bites","Bites","play")+navItem("create","Ad Games","dice")+navItem("profile","Profile","person")+
    '</nav>';
}
function brandBottomNav() {
  const items=[["home","Home","home"],["create","Create","plus"],["bites","Bites","play"],["cfund","CFund","trophy"],["consumer","Consumers","people"],["profile","Profile","store"]];
  return '<nav class="bottom-nav brand-bottom-nav" aria-label="Brand navigation">'+items.map(function(item){return '<button class="nav-item '+(state.tab===item[0]&&state.screen==="app"?"active":"")+'" data-action="nav" data-tab="'+item[0]+'" aria-label="'+item[1]+'" title="'+item[1]+'">'+icon(item[2],20)+'<span>'+item[1]+'</span></button>';}).join("")+'</nav>';
}
function creatorBottomNav() {
  const items=[
    ["home","Home","home"],["create","Create","plus"],["bites","Bites","play"],
    ["cfund","CFund","trophy"],["consumer","Consumer","compass"],["profile","Profile","person"]
  ];
  return '<nav class="bottom-nav creator-bottom-nav" aria-label="Creator navigation">'+items.map(function(item){return '<button class="nav-item '+(state.tab===item[0]&&state.screen==="app"?"active":"")+'" data-action="nav" data-tab="'+item[0]+'" aria-label="'+item[1]+'" title="'+item[1]+'">'+icon(item[2],20)+'<span>'+item[1]+'</span></button>';}).join("")+'</nav>';
}
function creatorHeader(title) {
  return header(title);
}
function header(title, kicker) {
  return '<header class="topbar consumer-topbar"><button class="icon-button messages-button" data-action="messages" aria-label="Messages">'+icon("message")+'</button>'+
    '<button class="header-brand" data-action="nav" data-tab="home" aria-label="NETRA home">NETRA<span class="brand-glint">✦</span></button>'+
    '<div class="header-actions"><button class="icon-button search-header-button" data-action="search-open" aria-label="Search">'+icon("search")+'</button><button class="icon-button profile-button" data-action="profile-menu" aria-label="Open profile menu">'+profileAvatar("")+'</button></div>'+
    '</header>';
}
function sectionHeader(eyebrow, title, link, desc) {
  return '<div class="section-heading"><div>'+(eyebrow?'<span class="eyebrow">'+eyebrow+'</span>':'')+'<h2>'+title+'</h2>'+(desc?'<p>'+desc+'</p>':'')+'</div>'+(link?'<button class="text-link" data-action="'+(link.action||'noop')+'" data-tab="'+(link.tab||'')+'">'+link.label+' →</button>':'')+'</div>';
}
function businessCard(b) {
  const following = !!state.followed[b.id];
  return '<article class="business-card card"><button class="business-image" data-action="business" data-id="'+b.id+'"><img src="'+b.img+'" alt="'+esc(b.name)+' products" /><span class="business-logo">'+b.initials+'</span><span class="business-image-trust"><i class="t-mark">t</i>'+b.trust+'</span></button>'+
    '<div class="business-copy"><h3>'+b.name+'</h3><p>'+b.category+'</p><div class="business-stats"><span>'+b.followers+' followers</span><span>'+b.bites+'</span></div>'+
    '<button class="small-button '+(following?'following':'')+'" data-action="follow" data-id="'+b.id+'">'+(following?'Following':'＋ Follow')+'</button></div></article>';
}
function productRow(p, memory) {
  const remembered = selectedProductIds().includes(p.id);
  return '<article class="product-row card"><div class="product-thumb"><img src="'+p.img+'" alt="'+esc(p.name)+'" /></div><div class="product-info"><span class="product-brand">'+p.brand+'</span><h3>'+p.name+'</h3><p>'+p.short+'</p><div class="product-meta"><span class="trust-pill"><i class="t-mark">T</i>'+p.trust+'</span><span>✦ Thoughtful pick</span></div></div><div class="product-price">'+p.price+'</div><div class="product-actions">'+
    '<button class="small-button red" data-action="buy" data-id="'+p.id+'">Know more</button>'+
    '<button class="small-button" data-action="remember" data-id="'+p.id+'">'+(remembered?'✓ Remembered':'＋ Remember')+'</button></div></article>';
}
function homePage() {
  const catalog=products.concat(additionalProducts);
  const affordable=catalog.filter(function(p){return Number(p.price.replace(/[^\d]/g,""))<=buyingCapacity();});
  const trending=affordable.length?affordable:catalog.slice(0,2);
  const stories=storyCreators.map(function(s,i){return '<button class="story-item" data-action="bite-open" data-index="'+(i%biteClips.length)+'"><span class="story-ring"><span class="portrait-panel portrait-'+s.panel+'"></span></span><strong>'+s.name+'</strong><small>'+s.label+'</small></button>';}).join("");
  const notes=creatorNotes.map(function(n,i){return '<button class="creator-note-card card" data-action="bite-open" data-index="'+(i%biteClips.length)+'"><div class="note-photo"><img src="'+n.img+'" alt="" /><span class="note-live">● '+n.time+'</span></div><div class="note-copy"><span class="note-person"><span class="portrait-panel portrait-'+n.panel+'"></span><b>'+n.name+'</b></span><p>'+n.text+'</p><small>'+icon("comment",12)+' '+n.replies+' replies</small></div></button>';}).join("");
  const feedItems = bitesFeed.length ? bitesFeed : biteClips;
  const picks = feedItems.slice(0, 5).map(function(c, i) {
    const isReal = !!c.mediaAssetId || !!c.mediaUrl;
    const title = isReal ? (c.title || "Untitled") : c.name;
    const creator = isReal ? (c.creator?.name || "Creator") : c.creator;
    const views = isReal ? formatCount(c.viewCount) + " views" : c.views;
    const img = isReal ? (c.creator?.image || "assets/bite-coffee-creator.png") : c.img;
    const duration = isReal ? "0:30" : c.duration;
    return '<button class="pick-card" data-action="bite-open" data-index="'+i+'"><img src="'+esc(img)+'" alt="'+esc(title)+'" /><span class="pick-play">'+icon("play",17)+'</span><span class="pick-duration">'+duration+'</span><span class="pick-copy"><b>'+esc(title)+'</b><small>'+esc(creator)+' · '+views+'</small></span></button>';
  }).join("");
  const topics=trendingTopics.map(function(t,i){return '<button class="topic-chip" data-action="topic" data-value="'+esc(t.name)+'"><span class="topic-rank">0'+(i+1)+'</span><b>'+t.name+'</b><small>'+t.lift+' this week</small></button>';}).join("");
  const genres=adGenres.map(function(g){return '<button class="genre-card" data-action="genre" data-value="'+g.id+'"><span class="genre-photo genre-tile-'+g.tile+'"></span><span class="genre-caption"><b>'+g.name+'</b><small>'+g.copy+'</small><i>'+g.count+' →</i></span></button>';}).join("");
  return '<div class="screen-scroll home-scroll"><div class="content home-content">'+
    '<section class="story-section daily-mix-region" aria-label="Your daily mix"><video class="daily-mix-video" autoplay muted loop playsinline preload="auto" poster="assets/bite-coffee-creator.png" aria-hidden="true"><source src="assets/netra-daily-mix.mp4" type="video/mp4" /></video><span class="daily-mix-shade" aria-hidden="true"></span><div class="daily-mix-content"><div class="home-greeting"><div><span class="eyebrow">Your daily mix</span><h1>Good things, right on time.</h1></div><span class="feed-live"><i></i> Fresh today</span></div></div></section>'+
    '<section class="daily-mix-stories" aria-label="Creator stories"><div class="story-row"><button class="story-item your-story" data-action="your-story"><span class="story-ring own-story"><span class="own-avatar">'+initials(state.name)+'</span><i>+</i></span><strong>Your story</strong><small>Share a find</small></button>'+stories+'</div></section>'+
    '<section class="section"><div class="section-heading"><div><span class="eyebrow">From the brands in your world</span><h2>Businesses you follow</h2><p>Follow a favourite or find a new one.</p></div><button class="tiny-arrow" data-action="nav" data-tab="consumer" aria-label="See all businesses">'+icon("arrow",17)+'</button></div><div class="business-scroll">'+businesses.map(businessCard).join("")+'</div></section>'+
    '<section class="section"><div class="section-heading"><div><span class="eyebrow">Notes from your creators</span><h2>What’s happening</h2></div><button class="tiny-arrow" data-action="nav" data-tab="bites" aria-label="See creator updates">'+icon("arrow",17)+'</button></div><div class="notes-scroll">'+notes+'</div></section>'+
    '<section class="section"><div class="section-heading"><div><span class="eyebrow">Picked for your '+esc(state.budget||"₹3,000 / month")+' comfort</span><h2>Trending at your pace</h2><p>'+trending.length+' picks in your range · swipe to explore.</p></div></div><div class="product-trend-scroll">'+trending.map(function(p){return '<button class="product-trend card" data-action="product" data-id="'+p.id+'"><span class="trend-photo '+(p.id.indexOf("flask")===0||p.id==="espresso"||p.id==="kettle"||p.id==="lamp"?"":"trend-photo-new")+'"><img src="'+p.img+'" alt="" /><span class="trend-price">'+p.price+'</span></span><span class="trend-copy"><b>'+p.name+'</b><small>'+p.brand+'</small><span class="trend-metrics"><span>▶ '+p.bites+' Bites</span><span><i class="t-mark">t</i> '+p.trust+'</span></span></span></button>';}).join("")+'</div></section>'+
    '<section class="section"><div class="section-heading"><div><span class="eyebrow">What people are making</span><h2>Trending topics</h2><p>Little ideas turning into big conversations.</p></div></div><div class="topic-scroll">'+topics+'</div></section>'+
    '<section class="section"><div class="section-heading"><div><span class="eyebrow">Picked from the Bites feed</span><h2>Top picks for you</h2></div><button class="tiny-arrow" data-action="nav" data-tab="bites" aria-label="Open Bites">'+icon("arrow",17)+'</button></div><div class="picks-scroll">'+picks+'</div></section>'+
    '<section class="section explore-section"><div class="section-heading"><div><span class="eyebrow">Watch what you love</span><h2>Explore ads</h2><p>Funny, clever, spooky, and everything between.</p></div></div><div class="genre-grid">'+genres+'</div></section>'+
    '<div class="trust-note"><span class="badge">t</span><span><b>Trust, in plain sight.</b><br />A quick read of community signals. It’s useful context, never a promise.</span></div>'+
    '</div></div>';
}
function welcomePage() {
  const roles = [
    ["consumer",icon("play",20),"Watch & discover","CONSUMER","Enjoy new products, people, and CFund stories."],
    ["brand",icon("bag",20),"Build your brand","BRAND","Share your products with the right people."],
    ["creator",icon("spark",20),"Make & grow","CREATOR","Make Bites and find paid briefs on CFund."],
    ["advertiser",icon("globe",20),"Share a campaign","ADVERTISER","Put a good idea in front of real people."]
  ];
  return '<div class="welcome-screen"><div class="welcome-logo">'+logo()+'<small>NETRA</small></div><span class="page-kicker welcome-kicker"><i class="dot"></i> First launch onboarding</span>'+
    '<h1>Welcome to NETRA <span>✦</span></h1><p class="intro">What brings you here today?</p>'+
    '<div class="role-grid">'+roles.map(function(r){return '<button class="role-card '+(state.selectedRole===r[0]?'selected':'')+'" data-action="role" data-role="'+r[0]+'"><span class="role-icon">'+r[1]+'</span><span class="role-check">'+(state.selectedRole===r[0]?icon("check",14):'·')+'</span><span class="role-tag">'+r[2]+'</span><h2>'+r[3]+'</h2><p>'+r[4]+'</p></button>';}).join("")+'</div>'+
    '<div class="starter-note"><span class="starter-icon">✦</span><span><strong>One small difference</strong>Creators find paid briefs through CFund. Consumers watch and enjoy the stories creators make.</span></div>'+
    '<div class="welcome-bottom"><button class="cta full" data-action="continue">Continue as '+esc(state.selectedRole||"consumer").replace(/^./,function(c){return c.toUpperCase();})+' '+icon("arrow",15)+'</button><div class="welcome-links">Already have an account? <button data-action="account">Sign in</button><span class="subtle"> · </span><button class="dark-link" data-action="skip">Browse as guest</button></div></div></div>';
}
function accountPage() {
  const mode=state.accountMode||"signup";
  const signingIn=mode==="signin";
  const requestingReset=mode==="reset-request";
  const completingReset=mode==="reset-password";
  const roleName=(state.selectedRole||"consumer").charAt(0).toUpperCase()+(state.selectedRole||"consumer").slice(1);
  const passwordField='<label class="password-field">'+(completingReset?"New password":"Password")+'<span class="password-input-wrap"><input id="account-password" name="'+(completingReset?"newPassword":"password")+'" type="password" autocomplete="'+(signingIn?"current-password":"new-password")+'" placeholder="'+(signingIn?"Your password":"Choose a password")+'" required minlength="10" /><button type="button" class="password-toggle" data-action="password-toggle" data-target="account-password" aria-label="Show password" aria-pressed="false">'+icon("eye",19)+'</button></span></label>';
  const confirmField='<label class="password-field">Confirm password<span class="password-input-wrap"><input id="account-confirm-password" name="confirmPassword" type="password" autocomplete="new-password" placeholder="Type your password again" required /><button type="button" class="password-toggle" data-action="password-toggle" data-target="account-confirm-password" aria-label="Show confirm password" aria-pressed="false">'+icon("eye",19)+'</button></span></label>';
  const formType=requestingReset?"request-password-reset":completingReset?"reset-password":signingIn?"signin":"signup";
  const fields='<form data-form="'+formType+'" class="auth-card account-fields">'+
    (formType==="signup"?'<label>Name<input name="name" autocomplete="name" placeholder="Your name" required /></label>':'')+
    (completingReset?'':'<label>Email address<input name="email" type="email" autocomplete="email" placeholder="you@example.com" value="'+esc(state.accountEmailDraft||"")+'" required /></label>')+
    (requestingReset?'':passwordField)+(formType==="signup"?confirmField:'')+
    (formType==="signup"?'<label>Username<input name="username" autocomplete="username" placeholder="@yourname" required /></label>':'')+
    (completingReset?'<input type="hidden" name="token" value="'+esc(state.resetToken||"")+'" />':'')+
    '<button class="cta full" style="margin-top:4px">'+(requestingReset?"Send password reset link":completingReset?"Update password":signingIn?"Sign in":"Create a new account")+' '+icon("arrow",14)+'</button>'+
    (signingIn?'<button type="button" class="account-switch" data-action="forgot-password">Forgot your password?</button>':'')+
    '</form>';
  const title=requestingReset?"Reset your password":completingReset?"Choose a new password":signingIn?"Good to see you again.":"Let’s get you into NETRA.";
  const lead=requestingReset?"We’ll email you a secure link to reset your password.":completingReset?"Choose a strong password you haven’t used before.":signingIn?"Sign in and pick up where you left off.":"Just the basics for now. You can add the rest later.";
  const footer=requestingReset||completingReset?'<button class="account-switch" data-action="account-mode">Back to sign in</button>':
    '<button class="account-switch" data-action="account-mode">'+(signingIn?'New to NETRA? <strong>Create a new account</strong>':'Already have an account? <strong>Sign in</strong>')+'</button>';
  return '<div class="screen-scroll"><div class="flow-top"><button class="back" data-action="back">'+icon("back")+'</button><div class="flow-brand">'+logo()+' NETRA</div><span style="color:var(--red)">●</span></div>'+
    '<div class="progress-row"><div class="progress-label"><span>Step 1 of 4</span><b>Account creation</b></div><div class="progress-bars"><i class="on"></i><i></i><i></i><i></i></div></div>'+
    '<div class="flow-content"><span class="pill"><i style="color:var(--red)">●</i> '+(requestingReset||completingReset?"Account recovery":signingIn?"Welcome back":"Joining as "+roleName)+'</span><h1>'+title+'</h1><p class="lead">'+lead+'</p>'+fields+'</div>'+
    '<div class="account-footer">One NETRA account keeps your Consumer, Creator, and Business profiles together.'+footer+'</div></div>';
}
function chips(values, active, group) {
  return '<div class="chip-list">'+values.map(function(v){const on=active.includes(v);return '<button class="chip '+(on?'active':'')+'" data-action="chip" data-group="'+group+'" data-value="'+esc(v)+'">'+(on?'✓ ':'')+v+'</button>';}).join("")+'</div>';
}
function onboardingPage() {
  return state.selectedRole==="creator"?creatorOnboardingPage():state.selectedRole==="brand"?brandOnboardingPage():consumerOnboardingPage();
}
function brandOnboardingPage() {
  const step=Math.max(1,Number(state.onboardingStep)||1);
  const disciplines=["Design Studio","Specialty Coffee","Fashion & Textiles","Tactile Craft Gear","Pure Beauty","Architectural Home"];
  const stepOne='<span class="pill red">● BRAND IDENTITY · STEP 2 OF 3</span><h1>Welcome to NETRA.<br/>Let’s build your presence.</h1><p class="lead">Help people discover your brand through products, stories, ideas, and experiences they genuinely want to engage with.</p>'+ 
    '<section class="flow-card brand-onboard-card"><div class="brand-card-heading"><h2>Brand Name &amp; Alias</h2><span class="pill violet">✦ Verified Index Ready</span></div><label class="brand-field">Brand name<input data-field="brandName" value="'+esc(state.brandName||"")+'" placeholder="Your brand name" /></label><p class="brand-handle"><b>@</b> Live handle: <strong>netra.is/'+esc(state.brandHandle||"yourbrand")+'</strong></p><label class="brand-field">Editorial discipline</label><div class="brand-discipline-grid">'+disciplines.map(function(d){return '<button class="brand-discipline '+(state.brandDiscipline===d?'active':'')+'" data-action="brand-discipline" data-value="'+esc(d)+'">'+esc(d)+'</button>';}).join("")+'</div></section>'+ 
    '<section class="flow-card brand-onboard-card"><div class="brand-card-heading"><div><h2>The Origin Narrative</h2><p>What drives your studio every morning?</p></div><button class="small-button" data-action="brand-polish">✦ Polish with AI</button></div><div class="brand-prompt-chips"><span>“WHY EXIST?”</span><span>“PROBLEM SOLVED”</span><span>“WHAT MAKES YOU”</span></div><textarea class="text-area brand-manifesto-input" data-field="brandOrigin" maxlength="280" placeholder="Tell people what makes your brand worth discovering.">'+esc(state.brandOrigin||"")+'</textarea><div class="brand-field-meta"><span>● Curator voice recommended</span><b>'+(state.brandOrigin||"").length+' / 280</b></div></section>'+ 
    '<section class="flow-card brand-onboard-card"><div class="brand-card-heading"><div><h2>Atmospheric Framing</h2><p>Editorial identity that feels like your brand.</p></div></div><div class="brand-atmosphere-grid"><div class="brand-atmosphere-tile"><img src="assets/espresso.jpg" alt="Warm editorial coffee still life"/><b>Aperture Mark</b><small>1:1 High Res Stamp</small></div><div class="brand-atmosphere-tile"><img src="assets/kettle.jpg" alt="A tactile product in a home setting"/><b>Atmosphere</b><small>4:5 Cinematic Cover</small></div></div><div class="brand-palette"><span>Signature Canvas Tint</span><b>NETRA TERRACOTTA</b><div>'+["#bf2100","#5c5f69","#762be8","#1c1d1b","#e42d12"].map(function(c){return '<button class="brand-swatch '+((state.brandColor||"#bf2100")===c?'active':'')+'" style="--swatch:'+c+'" data-action="brand-color" data-value="'+c+'" aria-label="Choose brand color"></button>';}).join("")+'</div></div></section>'+ 
    '<section class="flow-card brand-onboard-card brand-profile-photo-card"><div class="brand-card-heading"><div><h2>Your profile photo</h2><p>Add a photo for your NETRA business profile.</p></div>'+profileAvatar("", "brand")+'</div><button class="outline-button full" data-action="avatar">'+icon("camera",15)+' '+(state.profilePhoto?"Change profile photo":"Upload profile photo")+'</button><input id="profile-photo-input" class="visually-hidden profile-photo-picker" type="file" accept="image/*" aria-label="Upload a profile photo"/></section>'+
    '<div class="brand-discovery-preview"><span class="eyebrow">◉ DISCOVERY STREAM PREVIEW</span><b>'+esc(state.brandName||"Aura Home Studio")+'</b><span class="pill violet">T INDEX 96</span><p>'+esc(state.brandOrigin||"")+'</p></div>';
  const stepTwo='<span class="pill red">● BRAND IDENTITY &amp; STORY · STEP 3 OF 3</span><h1>Bring your brand to life.</h1><p class="lead">Set your visual mark, introduce what you stand for, and debut your signature 1–2 minute Brand Story to the NETRA discovery stream.</p>'+ 
    '<section class="flow-card brand-onboard-card"><div class="brand-card-heading"><h2>▧ Business Logo &amp; Mark</h2><span class="pill violet">1:1 EMBLEM</span></div><div class="brand-logo-preview">'+(state.brandLogoData?'<img src="'+esc(state.brandLogoData)+'" alt="Uploaded brand mark"/>':'<span>'+esc(initials(state.brandName||"Aura"))+'</span>')+'</div><b>Upload Square Emblem</b><p>Recommended min. 500×500px in vector SVG, transparent PNG, or high-density JPG. Renders as your official verified avatar across all editorial feeds.</p><label class="brand-upload-button">▧ Choose logo<input class="brand-logo-picker" type="file" accept="image/*" aria-label="Upload business logo" /></label><small class="brand-upload-name">'+esc(state.brandLogoName||"No logo selected")+'</small></section>'+ 
    '<section class="flow-card brand-onboard-card"><h2>❞ Brand Description &amp; Manifesto</h2><p>Tell customers what sets your craft apart in 2–3 evocative, cinematic sentences.</p><textarea class="text-area" data-field="brandManifesto" maxlength="300" placeholder="Your brand manifesto">'+esc(state.brandManifesto||"")+'</textarea><div class="brand-field-meta"><button class="small-button" data-action="brand-polish">✦ Polish tone with AI</button><b>'+(state.brandManifesto||"").length+' / 300</b></div><div class="brand-tags"><span>Poetic &amp; Tactile</span><span>Direct &amp; Minimal</span></div></section>'+ 
    '<section class="flow-card brand-onboard-card"><div class="brand-card-heading"><div><h2>▣ Brand Story</h2><p>The genesis video that welcomes visitors to your Brand Universe.</p></div><span class="pill red">1–2 MIN REEL</span></div><div class="brand-story-upload"><div class="brand-story-placeholder"><span>▶</span><b>'+esc(state.brandStoryName||"Your brand story")+'</b><small>Upload your brand story video to preview it here</small></div><label class="cta full brand-upload-video">▣ Upload Brand Story Video<input class="brand-story-picker" type="file" accept="video/*" aria-label="Upload brand story video" /></label><p>Supports vertical 9:16 or widescreen 16:9</p></div><div class="brand-benefit">✦ Boosts stream discovery by +40%</div><div class="brand-benefit">◈ Featured on Brand Universe rail</div></section>';
  const panel=step===1?1:2;
  const progress='<div class="brand-onboard-progress"><span>NETRA　·　BRAND ONBOARDING</span><b>Step '+(panel+1)+' of 3</b><i><em></em><em class="on"></em><em class="'+(panel===2?'on':'')+'"></em></i></div>';
  return '<div class="screen-scroll brand-onboarding"><div class="brand-onboard-top"><button class="back" data-action="back">'+icon("back",18)+'</button><span class="brand-onboard-wordmark">NETRA <small>BRAND ONBOARDING</small></span><span class="brand-step-pill">Step '+(panel+1)+' of 3</span><button class="avatar-mini" data-action="avatar" aria-label="Upload profile photo">'+profileAvatar("", "brand")+'</button></div>'+progress+'<div class="brand-onboard-body">'+(panel===1?stepOne:stepTwo)+'</div><div class="brand-onboard-footer"><button class="outline-button" data-action="brand-save-draft">Save Draft</button><button class="cta" data-action="brand-onboard-next">'+(panel===1?'Continue to Products & Story':'Complete Setup & Enter')+' '+icon("arrow",14)+'</button><small>Brand details can be refined any time in Business Settings.</small></div></div>';
}
function creatorOnboardingPage() {
  const step=Number(state.onboardingStep)||1;
  const disciplines=["Filmmaking","Storytelling","Video Editing","Comedy / Satire","3D & Motion Design","Sound & Foley","Photography","Graphic Design","Copywriting"];
  const ranked=state.creatorRankOrder||["Filmmaking","Storytelling","Video Editing"];
  let content="";
  if(step===1){
    content='<span class="creator-kicker">FOUNDATIONAL DOSSIER</span><h1>Let’s start with your identity.</h1><p>Set up your verified creator handle and secure your editorial portfolio domain.</p><div class="creator-id-card">'+creatorPhoto()+'<span><b>'+esc(state.name||"Ayush Prabhu")+' <i>✓</i></b><small>@'+esc(state.username||"ayushcreates")+' · Verified creator candidate</small></span><span class="creator-index"><b>T-INDEX 98</b><small>Tier 1 node</small></span></div><button class="small-button creator-change-photo" data-action="creator-avatar-upload">'+icon("camera",14)+' '+(state.profilePhoto?"Change profile photo":"Upload profile photo")+'</button><input id="profile-photo-input" class="visually-hidden profile-photo-picker" type="file" accept="image/*" aria-label="Upload a profile photo"/><button class="creator-google" data-action="creator-google">🌐　Continue with Google</button><div class="creator-divider">OR MANUALLY CREDENTIAL</div><label class="creator-field">FULL LEGAL & CREATIVE NAME<input data-field="name" value="'+esc(state.name||"")+'" placeholder="Your name" /></label><label class="creator-field">CREATIVE HANDLE / GLOBAL URL<input data-field="username" value="'+esc(state.username||"")+'" placeholder="@yourhandle" /></label><label class="creator-field">PRIMARY DIRECT EMAIL<input data-field="email" value="'+esc(state.email||"")+'" placeholder="you@example.com" /></label><label class="creator-field">CREATOR HOME BASE<input data-field="creatorBase" value="'+esc(state.creatorBase||"Bengaluru · Tech & Media")+'" placeholder="City · Industry" /></label><div class="creator-pair"><div class="creator-mini-card">CREATION HUB<strong>Bengaluru</strong><small>Tech & Media</small></div><div class="creator-mini-card">SECONDARY HUB<strong>Mumbai</strong><small>Cinema & Ads</small></div></div><div class="creator-policy"><b>◈ Privacy & discretion guaranteed</b><small>Your contact information is never shown to marketing brokers. Verified brands may reach you only through official NETRA opportunities.</small></div>';
  }else if(step===2){
    content='<span class="creator-kicker">CREATIVE DNA</span><h1>What do you create?</h1><p>Choose everything you genuinely enjoy making. NETRA will match CFund opportunities to your authentic craft.</p><div class="creator-block-head"><b>MEDIUMS & DISCIPLINES</b><small>'+((state.creatorDisciplines||[]).length)+' selected</small></div><div class="creator-choice-grid">'+disciplines.map(function(name){const active=(state.creatorDisciplines||[]).includes(name);return '<button class="creator-choice '+(active?'active':'')+'" data-action="creator-discipline" data-value="'+esc(name)+'">'+(active?'✓　':'＋　')+name+'</button>';}).join('')+'</div><section class="creator-soft-panel"><div class="creator-block-head"><b>YOUR CREATIVE STRENGTHS</b><small>Rank your top 3</small></div><div class="creator-rank-list">'+ranked.map(function(name,i){return '<div class="creator-rank-row"><span class="creator-rank-number">'+(i+1)+'</span><span><b>'+esc(name)+'</b><small>'+(i===0?'Primary Discipline & Directing':i===1?'Narrative Art & Conceptual Pace':'Rhythm, Cut Assembly & Color Timing')+'</small></span><button data-action="creator-rank" data-value="'+esc(name)+'" data-direction="up" aria-label="Move up">↑</button><button data-action="creator-rank" data-value="'+esc(name)+'" data-direction="down" aria-label="Move down">↓</button></div>';}).join('')+'</div></section><div class="creator-block-head"><b>WHAT’S YOUR AESTHETIC STYLE?</b><small>'+(state.creatorStyles||[]).length+' tagged</small></div><p class="creator-small-copy">How does your work feel to an audience?</p><div class="creator-style-grid">'+[["Cinematic","Atmospheric, 2.39:1 scope, rich grade"],["Story-driven","Character-first narrative depth"],["Unexpected & Satirical","Sharp wit, ironic twists"],["Minimal & Tactile","Raw materials, quiet pacing"],["Raw & Documentary","Handheld, authentic moments"],["Fast-Paced Hook","High kinetic energy, rapid retention"]].map(function(pair){const active=(state.creatorStyles||[]).includes(pair[0]);return '<button class="creator-style '+(active?'active':'')+'" data-action="creator-style" data-value="'+esc(pair[0])+'"><b>'+pair[0]+'</b><small>'+pair[1]+'</small></button>';}).join('')+'</div><div class="creator-cfund-match"><span class="creator-match-mark">✦</span><span><b>CFUND MATCH ENGINE</b><small>'+esc((state.creatorDisciplines||[]).slice(0,2).join(' with ')||'Creative craft')+' currently qualifies for 18 active briefs</small></span></div><div class="creator-block-head"><b>SELF-DESCRIBED EXPERIENCE LEVEL</b><small>◎</small></div><div class="creator-experience-list">'+[["Just Starting","Learning, testing formats & experimenting freely"],["Growing","Creating consistently with a developing audience"],["Experienced","Solid body of work, refined personal aesthetic"],["Professional","I create commercially / professionally" ]].map(function(pair){return '<button class="creator-experience '+(state.creatorExperience===pair[0]?'active':'')+'" data-action="creator-experience" data-value="'+pair[0]+'"><i></i><span><b>'+pair[0]+'</b><small>'+pair[1]+'</small></span>'+(state.creatorExperience===pair[0]?'<em>ACTIVE</em>':'')+'</button>';}).join('')+'</div><div class="creator-policy"><b>◈ Zero Gatekeeping</b><small>Experience is self-described. Follower count has <strong>0% algorithmic influence</strong> on challenge eligibility or CFund matching.</small></div>';
  }else if(step===3){
    content='<span class="creator-kicker">TRAJECTORY & EXPOSURE</span><h1>Define your creative trajectory.</h1><p>What kind of challenges and commercial worlds do you want to participate in?</p><div class="creator-pool-banner"><span class="creator-pool-art"><b>CF</b><i>✦</i></span><span><b>NETRA CREATOR POOL</b><strong>140+ Brand Challenges Open</strong><small>◈ Merit-Locked</small></span></div><div class="creator-block-head"><b>What do you want from NETRA?</b><small>Multi-select</small></div><p class="creator-small-copy">Select all milestones that align with your practice.</p><div class="creator-goal-list">'+[["Compete in CFunds","Win creative challenges","trophy"],["Earn Escrow Bounties","Get paid for commissioned work","wallet"],["Work with Indie Brands","Build direct creative partnerships","briefcase"],["Build Verifiable Reputation","Turn your body of work into proof","shield"],["Get Licensed Worldwide","Make your work travel further","globe"],["Connect with Filmmakers","Meet your next collaborator","people"]].map(function(item){const active=(state.creatorGoals||[]).includes(item[0]);return '<button class="creator-goal '+(active?'active':'')+'" data-action="creator-goal" data-value="'+esc(item[0])+'">'+icon(item[2],15)+'<span>'+item[0]+'</span><small>'+ (active?'✓':'＋')+'</small></button>';}).join('')+'</div><section class="creator-soft-panel"><div class="creator-block-head"><b>CONNECT EXTERNAL PRESENCE</b><small>OPTIONAL</small></div><p class="creator-small-copy">Authenticate platforms you already use as portfolio proof.</p><div class="creator-connected">'+creatorPhoto('small')+'<span><b>@'+esc(state.username||"ayushcreates")+'　✓</b><small>128K followers · Meta verified</small></span><button class="creator-toggle '+(state.creatorConnected?'on':'')+'" data-action="creator-connect">'+(state.creatorConnected?'Connected':'Connect')+'</button></div><div class="creator-platforms"><button data-action="creator-platform">▣　YouTube or Showreel <b>＋ Add link</b></button><button data-action="creator-platform">◉　Independent Portfolio / Readymag <b>＋ Add link</b></button></div><div class="creator-availability"><span><b>Collaboration Availability</b><small>Verified brands can propose private briefs and negotiate non-exclusive licensing.</small></span><button class="creator-toggle '+(state.creatorAvailability?'on':'')+'" data-action="creator-availability" aria-label="Toggle collaboration availability"></button></div></section><div class="creator-trust-anchor"><span>▣</span><b>Initial Trust Anchor Generated</b><small>Identity cryptographically attested for Step 4</small><em>READY</em></div>';
  }else{
    content='<span class="creator-kicker">CREATOR PROFILE READY</span><h1>Your creative identity is set.</h1><p>Here’s what NETRA will use to match your work with the right opportunities.</p><div class="creator-review-card"><div class="creator-id-card">'+creatorPhoto()+'<span><b>'+esc(state.name||"Ayush Prabhu")+' <i>✓</i></b><small>@'+esc(state.username||"ayushcreates")+' · '+esc(state.creatorBase||"Bengaluru")+'</small></span><span class="creator-index"><b>T-INDEX 98</b><small>Tier 1 node</small></span></div><div class="creator-review-line"><b>Creative disciplines</b><span>'+esc((state.creatorDisciplines||[]).join(' · '))+'</span></div><div class="creator-review-line"><b>Aesthetic</b><span>'+esc((state.creatorStyles||[]).join(' · '))+'</span></div><div class="creator-review-line"><b>Experience</b><span>'+esc(state.creatorExperience||'Growing')+'</span></div><div class="creator-review-line"><b>Opportunity interests</b><span>'+esc((state.creatorGoals||[]).join(' · '))+'</span></div></div><div class="creator-cfund-match"><span class="creator-match-star">✦</span><span><b>Your CFund matches are ready</b><small>Fresh briefs, escrow bounties, and creator collaborations are waiting in your Creator Arena.</small></span></div><div class="creator-policy"><b>◈ You stay in control</b><small>Your public profile shows the creative details you choose to share. You can update every preference later.</small></div>';
  }
  const steps=["Identity","Creative DNA","Trajectory","Review"];
  return '<div class="screen-scroll creator-onboarding"><div class="creator-onboard-top"><button class="back" data-action="back" aria-label="Back">'+icon("back",18)+'</button><span class="creator-logo">N</span><button class="skip-button" data-action="skip">Skip</button><span class="creator-user">'+roleBadge("creator")+'</span></div><div class="creator-progress"><div class="creator-progress-meta"><span>● CREATOR ONBOARDING</span><b>STEP '+step+' OF 4</b></div><div class="creator-progress-track">'+steps.map(function(_,i){return '<i class="'+(i<step?'on':'')+'"></i>';}).join('')+'</div><div class="creator-step-name">'+steps[step-1]+'</div></div><div class="creator-onboard-body">'+content+'</div><div class="creator-onboard-sticky"><span><b>STEP '+step+' SAVED</b><small>'+ (step===2?'Creative Identity Ready':step===3?'Trajectory Saved':'Your creator profile stays in your control')+'</small></span><button class="cta" data-action="onboard-next">'+(step<4?'Continue':'Enter Creator Arena')+' '+icon("arrow",14)+'</button></div></div>';
}
function consumerOnboardingPage() {
  const step = state.onboardingStep;
  const stepContent = step===1 ?
    '<span class="pill red">● Intent tuning engine</span><h1>Personalize Your Experience</h1><p class="lead">Tell us what products and stories belong in your feed. We only surface commercial content you’ll genuinely enjoy.</p>'+
    '<section class="flow-card"><h2><span class="number-chip">01</span>What are you curious about?</h2><p>Pick a few worlds you’d like NETRA to explore with you.</p>'+chips(["Technology","Fashion","Phones","Gadgets","Laptops","Gaming","Skincare","Beauty","Food","Fitness","Travel","Home","Lifestyle","Cars","Startups","Finance","Entertainment","Education"],state.interests,"interests")+'</section>'+
    '<section class="flow-card"><h2><span class="number-chip">02</span>What are you looking for right now?</h2><p>This active intent can change whenever you do.</p><div class="intent-list">'+["I’m exploring","I’m looking to buy","I’m just curious","I’m looking for something specific","I want inspiration","I want to discover new brands","I want to test products"].map(function(v){return '<button class="intent-option '+(state.intent===v?'active':'')+'" data-action="intent" data-value="'+esc(v)+'"><i class="radio"></i>'+v+'</button>';}).join("")+'</div><textarea class="text-area" data-field="radar" placeholder="What is on your radar? For example, a laptop for college under ₹70,000.">'+esc(state.radar||"")+'</textarea></section>':
    step===2 ?
    '<span class="pill red">✦ Your stream, your pace</span><h1>How do you like to discover?</h1><p class="lead">Choose how much you want to participate. You can change this at any time.</p>'+
    '<section class="flow-card"><h2><span class="number-chip">03</span>Discovery style</h2><div class="intent-list">'+[["Simple","Mostly watch and discover."],["Interactive","Vote, compare, react and participate."],["Very interactive","Games, predictions, comparisons and opinions."]].map(function(pair){return '<button class="intent-option '+(state.discoveryMode===pair[0]?'active':'')+'" data-action="mode" data-value="'+pair[0]+'"><i class="radio"></i><span><strong>'+pair[0]+'</strong><small style="display:block;color:var(--muted);font-weight:400;margin-top:2px">'+pair[1]+'</small></span></button>';}).join("")+'</div></section>'+
    '<section class="flow-card"><h2><span class="number-chip">04</span>What kind of content do you enjoy?</h2>'+chips(["Funny","Educational","Product demos","Reviews","Storytelling","Founder stories","Comparisons","Behind the scenes","Launches","Creator content","Short comedy","Experimental","Unexpected products","Inspirational"],state.contents,"contents")+'</section>'+
    '<section class="flow-card"><h2><span class="number-chip">05</span>Monthly buying comfort</h2><p>This helps us highlight price tiers that fit. It never limits what you discover.</p><div class="segmented">'+["Under ₹1,000","₹3,000 / month","₹7,500+","₹25,000+"].map(function(v){return '<button class="'+(state.budget===v?'active':'')+'" data-action="budget" data-value="'+v+'">'+v+'</button>';}).join("")+'</div></section>':
    '<span class="pill red">● A little more about you</span><h1>Make it feel like yours.</h1><p class="lead">Optional details help NETRA bring the right products and stories closer.</p>'+
    '<section class="flow-card"><h2>Profile Picture <span class="pill">Optional</span><span class="topbar-spacer"></span><button class="text-link" data-action="skip-avatar">Skip</button></h2><div style="text-align:center;padding:12px 0"><div style="margin:auto;width:max-content">'+profileAvatar("large",state.selectedRole||"consumer")+'</div><p style="margin:10px 0 0">Your profile photo can be changed any time.</p></div><button class="outline-button full" data-action="avatar">'+icon("camera",16)+' '+(state.profilePhoto?"Change photo":"Add a photo")+'</button><input id="profile-photo-input" class="visually-hidden profile-photo-picker" type="file" accept="image/*" aria-label="Upload a profile photo"/></section>'+
    '<section class="flow-card"><h2>About You <span class="pill">Optional</span></h2><p>A sentence on what excites your taste, craft, or daily lifestyle.</p><textarea class="text-area" data-field="about" maxlength="160" placeholder="Tell us a little about your taste...">'+esc(state.about||"")+'</textarea></section>'+
    '<section class="flow-card"><h2>What products do you love?</h2><p>Choose spheres you care to explore often.</p>'+chips(["Technology","Fashion","Phones","Gadgets","Laptops","Gaming","Skincare","Beauty","Food","Fitness","Travel","Home","Lifestyle","Cars","Startups","Finance","Entertainment","Education"],state.interests,"interests")+'</section>';
  const title = step===1?"Personalization":step===2?"Discovery preferences":"Profile details";
  return '<div class="screen-scroll"><div class="flow-top"><button class="back" data-action="back">'+icon("back")+'</button><div class="flow-brand">'+logo()+' NETRA</div><button class="skip-button" data-action="skip">Skip</button></div><div class="progress-row"><div class="progress-label"><span>'+title+'</span><b>Step '+(step+1)+' of 4</b></div><div class="progress-bars"><i class="on"></i><i class="on"></i><i class="'+(step>=2?'on':'')+'"></i><i class="'+(step>=3?'on':'')+'"></i></div></div><div class="flow-content">'+stepContent+'</div><div class="flow-sticky"><button class="cta full" data-action="onboard-next">'+(step<3?'Continue':'Launch NETRA Experience')+' '+icon("arrow",14)+'</button><p style="margin:9px 0 0;text-align:center;color:var(--muted);font-size:9px">Your preferences tune the feed instantly. Update them any time in Profile.</p></div></div>';
}
function bitePage() {
  if (bitesLoading && bitesFeed.length === 0) {
    return '<div class="bite-feed" aria-label="Vertical Bites video feed" style="display:grid;place-items:center;background:#080808;color:white;"><div style="text-align:center;padding:32px;"><div style="font-size:28px;margin-bottom:12px;opacity:.7;">✦</div><p style="font-size:13px;font-weight:700;margin:0 0 6px;">Loading Bites feed…</p><p style="font-size:11px;color:rgba(255,255,255,.6);margin:0;">Discovering commercial stories</p></div></div>';
  }
  if (bitesError && bitesFeed.length === 0) {
    return '<div class="bite-feed" aria-label="Vertical Bites video feed" style="display:grid;place-items:center;background:#080808;color:white;"><div style="text-align:center;padding:32px;"><div style="font-size:28px;margin-bottom:12px;color:#ff6d58;">!</div><h2 style="font-size:15px;font-weight:800;margin:0 0 6px;">Could Not Load Bites</h2><p style="font-size:11px;color:rgba(255,255,255,.7);margin:0 0 16px;max-width:240px;line-height:1.4;">'+esc(bitesError)+'</p><button class="cta" data-action="retry-bites">Try Again</button></div></div>';
  }
  if (!bitesLoading && bitesFeed.length === 0) {
    return '<div class="bite-feed" aria-label="Vertical Bites video feed" style="display:grid;place-items:center;background:#080808;color:white;"><div style="text-align:center;padding:32px;"><div style="font-size:32px;margin-bottom:12px;opacity:.7;">✦</div><h2 style="font-size:16px;font-weight:800;margin:0 0 6px;">No Bites Published Yet</h2><p style="font-size:11px;color:rgba(255,255,255,.7);margin:0 0 18px;max-width:240px;line-height:1.5;">New creator and commercial stories will appear here as they are published.</p><button class="cta" data-action="refresh-bites">Refresh Feed</button></div></div>';
  }

  const clips = bitesFeed.map(function(b, i) {
    const paused = state.playingBite === b.id;
    const mediaTag = b.mediaUrl
      ? '<video class="bite-video" data-bite-id="'+b.id+'" src="'+esc(b.mediaUrl)+'" playsinline loop muted preload="none" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"></video>'
      : '<div class="scene" style="position:absolute;inset:0;background:#181311;display:grid;place-items:center;color:rgba(255,255,255,.45);"><div style="text-align:center;"><div style="margin-bottom:6px;">'+icon("video",32)+'</div><p style="margin:0;font-size:10px;">Media unavailable</p></div></div>';

    const creatorName = b.creator?.name || "Creator";
    const creatorHandle = b.creator?.username ? "@" + b.creator.username : "@creator";
    const avatarHtml = b.creator?.image
      ? '<img src="'+esc(b.creator.image)+'" alt="'+esc(creatorName)+'" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid #ef5835;" />'
      : '<span class="portrait-panel" style="display:grid;place-items:center;background:#2a1f1b;font-weight:700;font-size:12px;color:#fff;">'+esc(creatorName.charAt(0).toUpperCase())+'</span>';

    return '<article class="full-bite '+(paused?'clip-paused':'')+'" data-bite-id="'+b.id+'" data-index="'+i+'">'+
      '<div class="scene">'+mediaTag+'</div>'+
      '<div class="bite-shade"></div>'+
      '<div class="clip-progress"><i></i></div>'+
      '<div class="bite-topline">'+
        '<div class="bite-tabs"><button class="'+((state.biteMode||"for-you")==="for-you"?"active":"")+'" data-action="bite-mode" data-value="for-you">For you</button><button class="'+(state.biteMode==="following"?"active":"")+'" data-action="bite-mode" data-value="following">Following</button></div>'+
        '<span class="watching-pill">✦ '+formatCount(b.viewCount)+' views</span>'+
      '</div>'+
      '<button class="clip-play" data-action="play-clip" data-id="'+b.id+'" aria-label="Play clip">'+icon(paused?"playFill":"pause",23)+'</button>'+
      '<div class="bite-right">'+
        '<button class="bite-action '+(b.hasLiked?'red':'')+'" data-action="like" data-id="'+b.id+'" aria-label="Like Bite" aria-pressed="'+!!b.hasLiked+'">'+icon("heart")+'<small>'+formatCount(b.likeCount)+'</small></button>'+
        '<button class="bite-action trust-action" data-action="trust" data-id="'+b.id+'" aria-label="Trust signal"><span class="trust-glyph">T</span><small>96</small></button>'+
        '<button class="bite-action" data-action="comments" data-id="'+b.id+'" aria-label="Comments">'+icon("comment")+'<small>'+formatCount(b.commentCount)+'</small></button>'+
        '<button class="bite-action buy-action" data-action="buy" data-id="'+b.id+'" aria-label="Buy"><span class="bite-letter-mark"><b>B</b>'+icon("bag",15)+'</span><small>Buy</small></button>'+
        '<button class="bite-action inquire-action" data-action="inquire" data-id="'+b.id+'" aria-label="Inquire"><span class="bite-letter">I</span><small>Inquire</small></button>'+
        '<button class="bite-action remember-action '+(b.hasSaved?'remembered':'')+'" data-action="remember" data-id="'+b.id+'" aria-label="Remember" aria-pressed="'+!!b.hasSaved+'"><span class="bite-letter">R</span><small>'+formatCount(b.saveCount)+'</small></button>'+
      '</div>'+
      '<div class="bite-product">'+
        '<div class="creator-id">'+
          '<span class="clip-avatar-stack">'+avatarHtml+roleBadge("creator")+'</span>'+
          '<span><b>'+esc(creatorName)+'</b><small>'+esc(creatorHandle)+' · '+timeAgo(b.publishedAt)+'</small></span>'+
          '<button class="small-button follow-clip" data-action="follow" data-id="'+esc(creatorHandle)+'">+ Follow</button>'+
        '</div>'+
        '<span class="clip-feature-label"><i>✦</i> CREATOR TAKE</span>'+
        '<span class="clip-caption">'+esc(b.title || "Untitled Bite")+'</span>'+
        '<p>'+esc(b.description || "")+'</p>'+
      '</div>'+
    '</article>';
  }).join("");

  const loadingMoreIndicator = bitesLoadingMore ? '<div style="padding:16px;text-align:center;color:rgba(255,255,255,.6);font-size:11px;">Loading more Bites…</div>' : '';

  return '<div class="bite-feed" aria-label="Vertical Bites video feed">'+clips+loadingMoreIndicator+'</div>';
}
function businessPage() {
  const product=productById(state.inquiryProduct||"flask"), business=businessForProduct(product);
  const messages=(state.businessChats||{})[business.id]||[{from:"business",text:"Hi! Ask us anything about "+product.name+". We’re here to help.",time:"Now"}];
  return '<div class="screen-scroll business-page"><div class="content"><button class="business-back" data-action="back-to-bites">'+icon("back",17)+' Back to Bites</button><section class="business-hero card"><div class="business-hero-image"><img src="'+business.img+'" alt="'+esc(business.name)+'"/><span class="trust-pill"><i class="trust-glyph">T</i> '+business.trust+'</span></div><div class="business-hero-copy"><span class="eyebrow">OFFICIAL BUSINESS PAGE</span><h1>'+esc(business.name)+'</h1><p>'+esc(business.category)+' · '+esc(business.followers)+' followers</p><button class="small-button '+(state.followed[business.id]?'following':'red')+'" data-action="follow" data-id="'+business.id+'">'+(state.followed[business.id]?'Following':'＋ Follow')+'</button></div></section><section class="business-product-card card"><img src="'+product.img+'" alt="'+esc(product.name)+'"/><span><small>ABOUT THIS BITE</small><b>'+esc(product.name)+'</b><em>'+esc(product.price)+' · <i class="trust-glyph">T</i> '+product.trust+' trust</em></span><button class="outline-button" data-action="remember" data-id="'+product.id+'">'+(selectedProductIds().includes(product.id)?'✓ Saved':'R · Remember')+'</button></section><section class="business-chat-card card"><div class="business-chat-heading"><span><b>Ask the business</b><small>Product questions, answered</small></span><span class="business-live"><i></i> Here to help</span></div><div class="business-demo-note">Sample chat preview</div><div class="business-chat-thread">'+messages.map(function(message){return '<div class="business-chat-row '+(message.from==="you"?'from-you':'from-business')+'">'+(message.from==="business"?'<span class="business-chat-avatar">'+esc(business.initials)+'</span>':'')+'<div><p>'+esc(message.text)+'</p><small>'+esc(message.time||"Now")+'</small></div></div>';}).join('')+'</div><form class="business-chat-form" data-form="business-chat"><input name="message" maxlength="240" placeholder="Ask about '+esc(product.name)+'…" aria-label="Message '+esc(business.name)+'" required/><button class="cta" aria-label="Send message">'+icon("send",16)+'</button></form><p class="business-chat-footnote">Messages stay with this business. This preview replies with a sample answer.</p></section></div></div>';
}
function createPage() {
  const logos=businesses.slice(0,4).map(function(b){return '<span class="review-logo" title="'+esc(b.name)+'"><img src="'+b.img+'" alt="" /><b>'+b.initials+'</b></span>';}).join("");
  return '<div class="screen-scroll"><div class="content"><div class="games-heading"><span class="pill gray">A little play, a little pay</span><h1 class="hero-title">Ad Games</h1><p class="lead">Play quick rounds, share your honest take, and collect NETRA Coins.</p></div>'+
    '<section class="critique-card critique-feature"><div class="critique-top"><span class="pill red">Featured · AURA Audio</span><span class="critique-amount">₹300 + 2 coins</span></div><h2>Ad Critiques</h2><p>Watch a short ad and tell the brand what you really think. You earn for your time, not for saying something nice.</p><div class="critique-prompt"><span class="critique-video-thumb"><img src="assets/flask.jpg" alt="AURA Audio product" /><span>'+icon("playFill",16)+'</span></span><span><b>AURA Audio Flask</b><small>Watch a 45-second ad · Share a 60-second reaction</small></span></div><div class="review-searching"><div class="review-logos">'+logos+'<span class="review-logo more-logo">+</span></div><span><b>More brands want your review</b><small>New paid critiques are added every week.</small></span></div><div class="critique-footer"><span>About 3 minutes</span><button class="cta" data-action="critique">Earn now '+icon("arrow",14)+'</button></div></section>'+
    '<section class="score-panel card"><div class="score-top"><strong>✦ Your NETRA Coins</strong><strong>'+state.coins.toLocaleString()+'</strong></div><p class="muted" style="font-size:10px;margin:6px 0 0">Coins are demo rewards in this preview.</p></section>'+
    '<section class="section">'+sectionHeader("Quick rounds","Play a game",null,"Small challenges, honest votes, and a few coins when you finish.")+gameSpot()+gameDeal()+gameThisOrThat()+gameGuess()+'</section>'+
    '<div class="coin-callout"><span class="coin">✦</span><span><strong>Your next round is ready</strong><p>NETRA Coins are platform rewards, separate from cash rewards.</p></span></div></div></div>';
}
function gameSpot() {
  return '<article class="game-card card"><div class="game-label-row"><span class="pill violet">◎ Spot the difference</span><span class="pill gray">♧ +2 Coins · 2 min</span></div><h3>Nordic Mini-Press Prototype</h3><p>Find three subtle design changes between early prototype V1 and the production V2.</p><div class="compare-images"><div class="compare-image"><img src="assets/espresso.jpg" alt="Prototype design, detail view" /><span>V1 PROTOTYPE</span></div><div class="compare-image alternate-finish"><img src="assets/espresso.jpg" alt="Production design, detail view" /><span>V2 FINAL</span></div></div><div class="game-footer"><span>◉ Sample round</span>'+button(state.completedGames.includes("spot")?"Completed ✓":"Play challenge","game","small-button red",'data-game="spot"')+'</div></article>';
}
function gameDeal() {
  return '<article class="game-card card"><div class="game-label-row"><span class="pill gray">▣ Beat the deal</span><span class="pill gray">♧ +2 Coins · Price master</span></div><h3>Hidden Price Desk Run</h3><p>Pick 10 curated desk essentials under a ₹2,000 budget before their prices are revealed.</p><div class="compare-images" style="grid-template-columns:repeat(4,1fr)"><div class="pill">✧ Leather pad</div><div class="pill">✎ Brass pen</div><div class="pill">⌑ Cable dock</div><div class="pill">＋ 7 items</div></div><div class="game-footer"><span>Target: ≤ ₹2,000.00</span>'+button(state.completedGames.includes("deal")?"Completed ✓":"Start budget run","game","small-button red",'data-game="deal"')+'</div></article>';
}
function gameThisOrThat() {
  return '<article class="game-card card"><div class="game-label-row"><span class="pill gray">◉ This or that</span><span class="pill gray">♧ +2 Coins · Instant poll</span></div><h3>SolSkin Summer Bottle Design</h3><p>Cast your vote on the next bottle finish: matte obsidian or brushed clay.</p><div class="two-choice">'+
    '<button class="choice '+(state.votes.thisor==="A"?"selected":"")+' alternate-finish" data-action="vote" data-value="A"><img src="assets/flask.jpg" alt="Option A, matte finish" /><span>Option A · Matte Obsidian <small>64% votes</small></span></button>'+
    '<button class="choice '+(state.votes.thisor==="B"?"selected":"")+'" data-action="vote" data-value="B"><img src="assets/flask.jpg" alt="Option B, brushed clay" /><span>Option B · Brushed Clay <small>36% votes</small></span></button></div><button class="small-button red" style="width:100%;margin-top:8px" data-action="complete-game" data-id="thisor">'+(state.completedGames.includes("thisor")?"Vote recorded ✓":"Submit vote · +2 demo coins")+'</button></article>';
}
function gameGuess() {
  return '<article class="game-card card"><div class="game-label-row"><span class="pill gray">▤ Guess the price</span><span class="pill gray">♧ +2 Coins</span></div><div style="display:flex;align-items:center;gap:10px;margin-top:10px"><div class="product-thumb"><img src="assets/kettle.jpg" alt="Precision gooseneck kettle" /></div><div><h3 style="margin:0 0 4px">UrbanKettle Gooseneck</h3><p style="margin:0">What would you expect to pay?</p></div></div><div class="price-choices">'+["₹2,499","₹3,299","₹4,200"].map(function(v,i){return '<button class="choice '+(state.votes.guess===String(i)?'selected':'')+'" data-action="guess" data-value="'+i+'">'+v+'</button>';}).join("")+'</div><button class="small-button red" style="width:100%;margin-top:8px" data-action="submit-guess">'+(state.completedGames.includes("guess")?"Guess submitted ✓":"Lock in my guess")+'</button></article>';
}
function cfundPage() {
  const funds = [
    {title:"Make urban renting feel different",brand:"Nest / CFund #08",amount:"₹10,00,000",meta:"7 days left · 312 / 500 creators",img:"assets/lamp.jpg",copy:"A live creative challenge for ideas that help young Indians care about the spaces they rent.",progress:62},
    {title:"The little ritual that starts your day",brand:"NordicForm / CFund #12",amount:"₹4,50,000",meta:"3 days left · Submissions open",img:"assets/kettle.jpg",copy:"Watch creator-made stories and cast a community vote for the work that stayed with you.",progress:78}
  ];
  return '<div class="screen-scroll"><div class="content"><span class="pill violet">✦ Creative fund</span><h1 class="hero-title">The creative arena</h1><p class="lead">Businesses fund a brief. Creators make something worth watching. You discover the work and share what stays with you.</p><section class="section">'+
    sectionHeader("Live creative challenges","CFund, in motion",{label:"How CFund works",action:"fund-help"})+
    funds.map(function(f,i){return '<article class="fund-card card"><div class="fund-art"><img src="'+f.img+'" alt="" /><span class="fund-badge">LIVE · '+f.amount+'</span></div><div class="fund-body"><div class="fund-meta"><span class="eyebrow" style="margin:0">'+f.brand+'</span><span style="margin-left:auto">⏱ '+f.meta.split(" · ")[0]+'</span></div><h3>'+f.title+'</h3><p>'+f.copy+'</p><div class="fund-progress"><i style="width:'+f.progress+'%"></i></div><div class="game-footer"><span>'+f.meta+'</span><button class="small-button red" data-action="fund" data-id="'+i+'">Explore work →</button></div></div></article>';}).join("")+
    '</section><section class="flow-card"><h2><span class="number-chip">✦</span>What is CFund?</h2><p>CFund means Creative Fund. A business sets a clear creative brief, budget, participant cap, and deadline. Creators submit work; the published reward rules explain recognition and any prizes.</p><p>Consumers can watch the resulting Bites and share their opinions. CFund is not winner-takes-all; its reward distribution is set before the challenge opens.</p></section></div></div>';
}
function consumerPage() {
  const categories = ["For you","Trending","New launches","Most saved","Most trusted","Creator finds"];
  return '<div class="screen-scroll"><div class="content"><span class="eyebrow">Consumer discovery</span><h1 class="hero-title" style="margin-top:5px">What are people discovering?</h1><p class="lead">A wider look at the products, businesses, and ideas entering the conversation.</p><div class="discovery-chips">'+categories.map(function(x,i){return '<button class="'+(i===0?'active':'')+'" data-action="discovery-filter" data-value="'+x+'">'+x+'</button>';}).join("")+'</div>'+
    '<section class="section">'+sectionHeader("People are saving","Worth remembering",{label:"Your memory",action:"nav",tab:"profile"})+
      '<article class="editorial-card card"><div class="editorial-thumb"><img src="assets/flask.jpg" alt="" /></div><div><span class="eyebrow">AURA Audio · 550ml</span><h3>A desk companion built for long sessions</h3><p>Product story · <span class="trust-pill"><i class="t-mark">t</i>89</span> · 1.2K people remembered it</p></div></article>'+
      '<article class="editorial-card card"><div class="editorial-thumb"><img src="assets/espresso.jpg" alt="" /></div><div><span class="eyebrow">NordicForm · Coffee</span><h3>Manual espresso, made for smaller spaces</h3><p>Product demo · <span class="trust-pill"><i class="t-mark">t</i>91</span> · 840 people discussed it</p></div></article></section>'+
    '<section class="section">'+sectionHeader("Verified entities","Top businesses",{label:"View index",action:"noop"})+'<div class="h-scroll">'+businesses.map(businessCard).join("")+'</div></section>'+
    '<section class="section">'+sectionHeader("Creator discoveries","Work worth a closer look")+
      '<article class="editorial-card card"><div class="mini-avatar" style="width:66px;height:66px;border-radius:12px">DK</div><div><span class="pill violet">NETRA Select</span><h3>Dev Kulkarni</h3><p>Creative technologist · Coffee, objects & quiet details<br/>14.2K NETRA followers</p><button class="text-link" data-action="follow" data-id="dev">Follow creator →</button></div></article></section>'+
    '<section class="section">'+sectionHeader("Commercial trends","New & interesting")+'<div class="genre-row"><button class="genre-tile" data-action="product" data-id="flask"><span class="genre-icon">☕</span><span><strong>Objects with a daily ritual</strong><small>9 products · 14 new Bites</small></span><span class="arrow">→</span></button><button class="genre-tile" data-action="product" data-id="espresso"><span class="genre-icon">✦</span><span><strong>Compact craft for small spaces</strong><small>6 makers worth meeting</small></span><span class="arrow">→</span></button></div></section></div></div>';
}
function creatorStudioPage() {
  const audit=[
    ["identity","Brand identity integrated organically","Logos & modules featured organically in story context."],
    ["music","No third-party copyright music","Original sound design & licensed audio stem attached."],
    ["disclosure","Mandatory NETRA disclosure watermark","Commercial transparency label baked into lower-third buffer."],
    ["runtime","90s runtime constraint respected","Exact timeline length validated at 84 seconds."]
  ];
  return '<div class="screen-scroll creator-page creator-studio"><div class="content creator-page-content"><div class="creator-page-heading"><span class="creator-kicker">● LIVE SUBMISSION PIPELINE</span><span class="pill red-soft">✦ Draft Auto-saved 2m ago</span><h1>Create Studio</h1><p>Turn ideas into competitive creative submissions and build your legacy.</p><div class="creator-action-row"><button class="cta" data-action="creator-submit">'+icon("video",16)+' Submit to CFund (Active)</button><button class="outline-button" data-action="creator-original">'+icon("plus",14)+' Create Original Work</button></div></div><section class="creator-brief-card"><div class="creator-brief-top"><span><b>UN</b> TARGET BRIEF #409</span><span>◷ 5D 14H Left</span></div><h2>Make Urban Living Impossible to Ignore</h2><p>Bring small-space design to life through a story people want to share.</p><div class="creator-brief-meta"><span>◉ Slot #343 Reserved</span><span>Pool: ₹10,00,000</span><span>Format: Vertical 9:16</span></div></section><section class="creator-studio-card"><div class="creator-section-title"><span>01</span><div><b>The Creative Concept</b><small>REQUIRED</small></div></div><label>What is your core idea?<textarea data-field="creatorIdea" maxlength="400" placeholder="Describe your idea in a few lines">'+esc(state.creatorIdea||"")+'</textarea><small class="creator-counter">'+(state.creatorIdea||"").length+'/400</small></label><label>Why will people want to watch this voluntary cut?<textarea data-field="creatorHook" maxlength="420" placeholder="What happens in the first seconds?">'+esc(state.creatorHook||"")+'</textarea></label></section><section class="creator-studio-card"><div class="creator-section-title"><span>02</span><div><b>Select Permitted Format</b><small>Single choice</small></div></div><div class="creator-format-grid">'+[["Short Film (9:16)","Vertical · 4K ProRes · 1080p"],["Cinematic Vignette","16:9 Widescreen · Narrative"],["Motion Graphic / 3D","CGI · Mixed Media Spec"],["Photo Essay","Editorial 5–8 Carousel Stills"]].map(function(pair,i){return '<button class="creator-format '+(state.creatorFormat===pair[0]?'active':'')+'" data-action="creator-format" data-value="'+esc(pair[0])+'">'+icon(["video","film","sparkles","image"][i],16)+'<b>'+pair[0]+'</b><small>'+pair[1]+'</small></button>';}).join('')+'</div></section><section class="creator-studio-card"><div class="creator-section-title"><span>03</span><div><b>Media Staging & Timeline</b><small>● SAFE</small></div></div><button class="creator-preview" data-action="creator-preview" aria-label="Preview staged video">'+(state.creatorDraftMediaUrl?'<video src="'+esc(state.creatorDraftMediaUrl)+'" class="creator-preview-scene" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" autoplay loop muted></video>':'<span class="creator-preview-scene"><i></i><b>YOUR STORY<br/>STARTS HERE</b><em>◉</em></span>')+'<span class="creator-preview-top">● 00:81:24:12 <b>SAFE GUIDES ON</b></span><span class="creator-safe-zone"></span><span class="creator-preview-play">'+icon("playFill",23)+'</span><span class="creator-preview-timeline"><i></i></span><span class="creator-preview-time">00:34　　84s Total (Target: 90s)</span></button><div class="creator-media-file"><span>'+icon("video",15)+'</span><b>'+esc(state.creatorMediaName||"urban_nest_final_master_v3.mp4")+'</b><small>142 MB · 4K 24fps · Audio: 48kHz Stereo Mastered</small><em>Ready for review</em></div><input id="creator-media-input" type="file" accept="video/*" class="visually-hidden creator-media-picker"/><div class="creator-action-row"><button class="outline-button" data-action="creator-upload">＋ Replace Master</button><button class="outline-button" data-action="creator-preview">▣ Inspect Safe Zones</button></div></section><section class="creator-studio-card"><div class="creator-section-title"><span>04</span><div><b>Brand Integration Audit</b><small>▣ Verified 4/4</small></div></div><label>How does UrbanNest appear in your story?<textarea data-field="creatorIntegration" maxlength="350">'+esc(state.creatorIntegration||"")+'</textarea></label><div class="creator-audit-list">'+audit.map(function(item){const checked=(state.creatorAudit||[]).includes(item[0]);return '<button class="creator-audit '+(checked?'checked':'')+'" data-action="creator-audit" data-value="'+item[0]+'"><i>'+icon("check",12)+'</i><span><b>'+item[1]+'</b><small>'+item[2]+'</small></span></button>';}).join('')+'</div></section><section class="creator-studio-card"><div class="creator-section-title"><span>05</span><div><b>Escrow & Creator Rights</b><small>◈</small></div></div><div class="creator-rights-list"><div><b>◈ 100% Creator IP Ownership</b><small>Submissions remain yours unless officially licensed or awarded prize funds.</small></div><div><b>₹10,00,000 Balanced Reward Pool</b><small>Secured in NETRA Smart Escrow. Immediate payout upon round final.</small></div><div><b>✦ +150 Creator Standing Points</b><small>Awarded instantly after successful editorial verification pass.</small></div></div><button class="cta full" data-action="creator-submit">Submit Entry to CFund Arena '+icon("arrow",15)+'</button><button class="outline-button full creator-save" data-action="creator-save">Save as Working Draft</button></section><section class="creator-recent"><div class="creator-section-title"><b>RECENT PORTFOLIO SUBMISSIONS</b><button class="text-link" data-action="creator-portfolio">View All (8) →</button></div><article class="creator-submission"><img src="assets/espresso.jpg" alt="Nordic Mini-Press video still"/><span><b>Nordic Mini-Press Vignette</b><small>Ranked #03 · Won ₹50,000</small><small>◉ Licensed & Concluded</small></span><strong>94 Score</strong></article></section></div></div>';
}
function creatorFundPage() {
  const filters=["For You","Ending Soon","High Fund (₹10L+)","Film & Story"];
  const feed=[
    {id:"arena-01",brand:"URBANNEST LIVING",tag:"ESCROW GUARANTEED",title:"The 350 sq.ft Apartment Interview",type:"NETRA Select",img:"assets/lamp.jpg",rank:"Rank #01",score:"96",views:"14.8K"},
    {id:"arena-02",brand:"AURA AUDIO",tag:"ACOUSTIC STORIES",title:"Renting, But Wes Anderson Directed It",type:"Audience Choice",img:"assets/espresso.jpg",rank:"Rank #02",score:"94",views:"11.2K"}
  ];
  const funds=[
    {brand:"AURA SOUND",tag:"ALMOST FULL",amount:"₹5,00,000",title:"45s Acoustic Vignette",meta:"192 / 200 slots claimed · 18 Hours Left",copy:"Audio Design · Soundscapes · Micro-Short"},
    {brand:"KURA KITCHENS",tag:"FILMMAKERS & SOUND",amount:"₹8,00,000",title:"Uncut Culinary ASMR",meta:"120 / 400 slots claimed · 6 Days Left",copy:"Macro Cinematography · Foley · No Dialogue"},
    {brand:"SOLSKIN CARE",tag:"COMEDY / SKIT",amount:"₹6,00,000",title:"The Mineral White Cast Satire",meta:"310 / 500 slots claimed · 4 Days Left",copy:"Humor · Sunscreen Tropes · Modern Makeup"}
  ];
  return '<div class="screen-scroll creator-page creator-fund"><div class="content creator-page-content"><div class="creator-fund-head"><div><span class="creator-kicker">✦ CREATOR CFUND</span><h1>'+icon("trophy",19)+' CFUND ARENA</h1><p>Businesses fund creativity. Creators compete. Best work wins.</p></div><span class="pill red-soft">● 4 LIVE HUBS</span></div><div class="creator-fund-stats"><span><small>ACTIVE FUND</small><b>₹29,00,000</b></span><span><small>ESCROW LOCKED</small><b class="teal">100% Verified</b></span><span><small>CREATOR POOL</small><b>964 Slots Left</b></span></div><div class="creator-filter-row">'+filters.map(function(name){return '<button class="'+(state.creatorFundFilter===name?'active':'')+'" data-action="creator-fund-filter" data-value="'+esc(name)+'">'+name+'</button>';}).join('')+'</div><article class="creator-feature-fund"><div class="creator-feature-art"><img src="assets/lamp.jpg" alt="Warmly lit modern apartment"/><span>URBANNEST LIVING</span><b>◈ ESCROW GUARANTEED</b><div><small>FLAGSHIP SPOTLIGHT</small><h2>Make Urban Living Impossible to Ignore</h2></div></div><div class="creator-feature-copy"><div class="creator-prize"><small>PRIZE POOL ALLOCATION</small><strong>₹10,00,000</strong></div><div class="creator-slots"><div><b>♙ 342 / 500 Slots Claimed</b><strong>Only 158 left!</strong></div><i><em></em></i><small>◷ 5d 14h Left　 ·　 Hard-locks at 500 entries</small></div><div class="creator-prize-matrix"><span><small>1ST PLACE</small><b>₹2.5L</b></span><span><small>2ND PLACE</small><b>₹1.5L</b></span><span><small>TOP 10</small><b>₹50K ea</b></span><span><small>TOP 50</small><b>Merit Pay</b></span></div><div class="creator-freedom"><b>◉ HIGH CREATIVE FREEDOM</b><p>Open interpretation: Satire, documentary, or emotional vignette welcomed. No mandatory ad scripts.</p></div><button class="cta full" data-action="creator-fund-enter">'+icon("bolt",15)+' Enter CFund (Claim Slot) · 158 spots</button></div></article><section class="creator-section"><div class="creator-section-title"><div><b>CREATIVE ARENA FEED</b><small>One Brief. 500 Creators. 500 Ideas.</small></div><button class="text-link" data-action="creator-feed">View all 342 →</button></div><div class="creator-arena-feed">'+feed.map(function(item){return '<article class="creator-arena-card"><img src="'+item.img+'" alt="Creator submission for '+item.brand+'"/><span class="creator-arena-rank">'+item.rank+'</span><span class="creator-arena-score">✦ '+item.score+'</span><div><small>'+item.type+'</small><b>'+item.title+'</b><span>◉ '+item.views+'　<a data-action="creator-review">◉ Review</a></span></div></article>';}).join('')+'</div><button class="outline-button full" data-action="creator-feed">▶ Watch Submissions Arena (342 entries streaming)</button></section><section class="creator-section"><div class="creator-section-title"><b>SECONDARY HIGH-STAKES CFUNDS</b><small>Active Escrows</small></div>'+funds.map(function(item){return '<article class="creator-mini-fund"><div><small>'+item.brand+'　<span>'+item.tag+'</span></small><b>'+item.title+'</b><strong>'+item.amount+' <small>Fund</small></strong></div><i><em style="width:'+ (item.brand.indexOf('AURA')===0?'96':item.brand.indexOf('KURA')===0?'35':'62')+'%"></em></i><p>'+item.meta+'</p><small>'+item.copy+'</small><button data-action="creator-fund-enter">Claim Slot</button></article>';}).join('')+'</section><div class="creator-zero-vanity"><span>'+icon("shield",20)+'</span><div><b>ZERO VANITY FOLLOWERS · TRUST STANDARD</b><p>Submissions are evaluated purely on creative storytelling, visual execution, and voluntary viewer watch duration. Follower count has exactly 0% influence on judging.</p><small>◈ Instant Smart Escrow　◈ Blind Jury Evaluation</small></div></div></div></div>';
}
function creatorConsumerPage() {
  const sections=["Overview","Journey","Behaviour","Audience"];
  const funnel=[
    ["REACHED","482,600","Organic Bites, Explorer Feed, Ad Games, Creators","100% BASE",100],
    ["DISCOVERED","126,400","First-time encounter; watched >50% or brand tap","26.2% of reach",75],
    ["ENGAGED","54,820","Liked, Trusted, Shared, Ad-Game tap, comments","43.4% stage",57],
    ["PRODUCT EXPLORED","18,420","Interacted with attached product tag / catalog spec","33.6% of stage",38],
    ["REMEMBERED","6,240","Saved to personal NETRA Product Memory drawer","33.9% of stage",26],
    ["CONSIDERED","2,184","Repeated visits, trust ledger checks, comparison","35.0% of stage",16],
    ["CONVERTED","684","₹32.8L tracked gross revenue · ₹4,795 avg basket","31.3% of stage",100]
  ];
  return '<div class="screen-scroll creator-page creator-analytics"><div class="content creator-page-content"><div class="creator-intel-head"><div><span class="creator-kicker">NETRA BUSINESS</span><h1>Consumer Intelligence</h1></div><button class="icon-button creator-notice" data-action="notifications" aria-label="Notifications">'+icon("bell",19)+'</button>'+profileAvatar("")+'</div><div class="creator-analytics-tabs">'+sections.map(function(name){return '<button class="'+((state.creatorAnalyticsTab||"Overview")===name?'active':'')+'" data-action="creator-analytics-tab" data-value="'+name+'">'+name+'</button>';}).join('')+'</div><div class="creator-analytics-subhead"><span class="creator-kicker">COMMERCIAL INTELLIGENCE</span><span class="pill violet">● Live Ingestion</span></div><h2>Consumers</h2><p class="creator-analytics-lead">Understand what people do after they discover your brand.</p><div class="creator-analytics-tools"><button data-action="creator-range">▣ Last 30 days⌄</button><button data-action="creator-content-filter">▤ All Content⌄</button><button data-action="creator-export">↧ Export</button><span>PERIOD COMPARISON<br/><b>↗ +18.4% Discovery vs Previous 30d</b></span></div><section class="creator-section"><div class="creator-section-title"><b>Cohort Diagnostics</b><small>30D Rollup</small></div><div class="creator-kpi-grid">'+[["Total Reached","482.6k","↗ +14.2%","eye"],["Discoveries","126.4k","↗ +22.8%","compass"],["Engaged","54.8k","↗ +18.1%","heart"],["Product Interest","18.4k","↗ +31.0%","bag"],["Product Memory","6,240","↗ +44.2%","bookmark"],["Conversions","684","31.3% of considered","sparkles"]].map(function(item){return '<article class="creator-kpi"><small>'+item[0]+'</small>'+icon(item[3],16)+'<b>'+item[1]+'</b><span>'+item[2]+'</span></article>';}).join('')+'</div></section><section class="creator-section creator-funnel-section"><div class="creator-section-title"><div><span class="creator-kicker">FUNNEL DYNAMICS</span><b>Your NETRA Consumer Journey</b><small>What happens after people encounter your work?</small></div><span class="pill gray">Active Window</span></div>'+funnel.map(function(item,index){return '<article class="creator-funnel-step"><div><span class="creator-funnel-num">'+(index+1)+'</span><span><b>'+item[0]+'</b><small>'+item[2]+'</small></span><strong>'+item[1]+'<small>'+item[3]+'</small></strong></div><i><em style="width:'+item[4]+'%"></em></i>'+(index<funnel.length-1?'<small class="creator-drop">↓ '+["26.2% discovery rate","43.4% engagement rate","33.6% explore rate","33.9% remember rate","35.0% intent rate","31.3% conversion rate"][index]+' <b>· '+["356.2k churned","71.6k passive","36.4k non-shoppers","Memory Crucible","4,056 idle saves","Industry High"][index]+'</b></small>':'')+'</article>';}).join('')+'</section><section class="creator-section"><div class="creator-section-title"><div><span class="creator-kicker">ATTRIBUTION PATHS</span><b>Where did consumers discover you?</b></div>'+icon("share",16)+'</div>'+[["Bites Reels",46],["Home Stream",22],["Creator Content",14],["Ad Games",8],["Search & Curated",6],["Brand Profile Direct",4]].map(function(pair){return '<div class="creator-attribution"><b>'+pair[0]+'</b><i><em style="width:'+pair[1]+'%"></em></i><strong>'+pair[1]+'%</strong></div>';}).join('')+'</section><section class="creator-section"><div class="creator-section-title"><div><span class="creator-kicker">GRANULAR ACTIVITY</span><b>What are people doing?</b></div><small>Swipe actions →</small></div><div class="creator-activity-row"><article><span>▶ WATCH</span><b>482.6k</b><small>Avg 18.4s voluntary watch time</small></article><article><span>♧ INTERACT</span><b>54.8k</b><small>Trust signals & tags tapped</small></article></div></section><section class="creator-section"><div class="creator-section-title"><div><span class="creator-kicker">LONG-TERM RESONANCE</span><b>What are people remembering?</b></div><span class="pill red-soft">▣</span></div><p>High-intent consumer stories products in their permanent memory well before purchase.</p>'+[["Forma Espresso Unit","3,420 saved","Top saved signature piece","espresso.jpg"],["Vatten Smart Kettle","1,890 saved","High velocity discovery item","kettle.jpg"],["Kvarn Burr Grinder","930 saved","Connoisseur consideration driver","lamp.jpg"]].map(function(item){return '<article class="creator-memory-row"><img src="assets/'+item[3]+'" alt=""/><span><b>'+item[0]+'</b><small>'+item[2]+'</small></span><strong>'+item[1]+'</strong></article>';}).join('')+'</section></div></div>';
}
function memoryCard(id) {
  const p=productById(id); return '<article class="memory-card card"><div class="memory-image"><img src="'+p.img+'" alt="'+esc(p.name)+'" /><span class="memory-stamp">▧ Remembered from discovery · Product Memory</span></div><div class="memory-body"><div class="memory-title"><div><span class="product-brand">'+p.label+'</span><h3>'+p.name+'</h3><span class="muted" style="font-size:9px">by @'+p.brand.replaceAll(" ","")+'</span></div><span class="memory-price">'+p.price+'<small style="display:block;color:var(--muted);font-size:8px;text-align:right"><i class="t-mark">t</i> '+p.trust+'</small></span></div><p>'+p.short+'</p><div class="memory-actions"><button class="cta" data-action="buy" data-id="'+p.id+'">Buy now ↗</button><button class="small-button" data-action="product" data-id="'+p.id+'">Brand story</button><button class="small-button" data-action="remember" data-id="'+p.id+'" aria-label="Remove from Product Memory">'+icon("bookmark",16)+'</button></div></div></article>';
}
function profileShowcase(mode, status, name, badge, description, stats, cover, actions) {
  return '<section class="profile-showcase profile-showcase-'+mode+'"><div class="profile-cover"><img src="'+cover+'" alt="" /><span class="profile-cover-shade"></span><div class="profile-cover-top"><span class="profile-status"><i></i>'+status+'</span><span class="profile-cover-actions">'+actions+'</span></div><span class="cover-spark cover-spark-one">✦</span><span class="cover-spark cover-spark-two">✧</span></div><div class="profile-showcase-body">'+profileAvatar("large",mode)+'<div class="profile-showcase-copy"><h2>'+name+' <span class="profile-type-pill type-'+mode+'">'+badge+'</span></h2><p>'+description+'</p><div class="profile-stats">'+stats+'</div></div></div></section>';
}
function profilePage() {
  if(state.profileMode==="creator") return creatorProfilePage();
  if(state.profileMode==="brand") return brandProfilePage();
  const saved=selectedProductIds();
  return '<div class="screen-scroll profile-screen"><div class="content profile-content">'+
    profileShowcase("consumer","YOUR DISCOVERY CORNER",esc(state.name||"Tanvi Rao"),"CURIOUS","@"+esc(state.username||"tanvidraws")+" · Design curator & taste enthusiast",'<span><strong>'+saved.length+'</strong><small>saved finds</small></span><span><strong>28</strong><small>brands</small></span><span><strong>34</strong><small>creators</small></span>',"assets/bite-coffee-creator.png",'<button class="icon-button" data-action="share-profile" aria-label="Share profile">'+icon("share")+'</button><button class="icon-button" data-action="settings" aria-label="Settings">'+icon("settings")+'</button>')+
    '<div class="profile-banner"><span>◉</span><span><strong>Active intent radar</strong>'+esc(state.radar||"Desk setups & specialty coffee")+'</span><button class="small-button" style="margin-left:auto" data-action="edit-intent">Tune it</button></div>'+
    '<div class="discovery-chips" style="margin-top:13px">'+
    '<button class="'+(state.profileSubtab==="memory"?"active":"")+'" data-action="profile-tab" data-value="memory">Product Memory '+saved.length+'</button><button class="'+(state.profileSubtab==="bites"?"active":"")+'" data-action="profile-tab" data-value="bites">Liked Bites 89</button><button class="'+(state.profileSubtab==="rewards"?"active":"")+'" data-action="profile-tab" data-value="rewards">Rewards</button></div>'+
    (state.profileSubtab==="memory"?
      '<section class="section">'+sectionHeader("From Bites & discovery","Products I don’t want to forget",null,"Saved for later. A memory, not a shopping list.")+(saved.length?saved.map(memoryCard).join(""):'<div class="empty-state card"><div class="empty-icon">⌑</div>Your Product Memory is waiting for something worth remembering. Save a product from Home or Bites.</div>')+'</section>'+
      '<div class="bounty-box"><div class="section-heading"><div><span class="eyebrow violet">Ad critique bounty hub</span><h2>Your honest feedback</h2></div><span class="pill violet">₹1,200 paid</span></div><div class="bounty-row"><span class="bounty-icon">◉</span><span><strong>UrbanKettle · 60s video</strong><small>UPI completed · Your candid take</small></span><span class="spacer"></span><b>+₹300</b></div><div class="bounty-row"><span class="bounty-icon">◷</span><span><strong>SolSkin Labs · Formula trial</strong><small>Brand verification underway</small></span><span class="spacer"></span><b>Pending</b></div><button class="text-link" data-action="nav" data-tab="create">Browse open critiques →</button></div>':
      state.profileSubtab==="bites"?
        '<section class="section">'+sectionHeader("Your reactions","Bites you liked")+'<article class="feature-bite card"><div class="bite-cover"><img src="assets/kettle.jpg" alt="" /><div class="cover-bottom"><strong>The ritual before the first meeting</strong><span>NordicForm · Product story</span></div></div><div class="bite-controls"><span>♥ Liked</span><button data-action="comments">'+icon("comment",14)+' What people think</button></div></article></section>':
        '<section class="section">'+sectionHeader("NETRA Coins","Your rewards")+'<div class="coin-callout"><span class="coin">♧</span><span><strong>'+state.coins.toLocaleString()+' NETRA Coins</strong><p>Platform rewards, not cash. See active ways to earn in Ad Games.</p></span></div><div class="flow-card"><h2>Recently earned</h2><div class="bounty-row"><span>Spot the difference</span><span class="spacer"></span><strong>+2 coins</strong></div><div class="bounty-row"><span>This or that · SolSkin</span><span class="spacer"></span><strong>+2 coins</strong></div></div></section>')+
    '<section class="section">'+sectionHeader("Your commercial world","Preferences & activity")+
      '<button class="profile-nav-card card" data-action="edit-intent"><span class="tile-icon">'+icon("spark",18)+'</span><span><strong>Active Intent</strong><small>'+esc(state.intent)+' · change whenever you do</small></span><span class="arrow">→</span></button>'+
      '<button class="profile-nav-card card" data-action="settings"><span class="tile-icon">'+icon("globe",18)+'</span><span><strong>Interests & discovery</strong><small>'+state.interests.slice(0,3).map(esc).join(" · ")+'</small></span><span class="arrow">→</span></button>'+
      '<button class="profile-nav-card card" data-action="settings"><span class="tile-icon">'+icon("settings",18)+'</span><span><strong>Notifications & settings</strong><small>Choose what NETRA brings closer</small></span><span class="arrow">→</span></button>'+
      '</section><div class="profile-mode-card card"><h3>Profile settings</h3><p>Manage your account type, interests, and discovery preferences.</p><button class="outline-button full" data-action="settings">Open profile settings →</button></div><div class="trust-note"><span class="badge">t</span><span><b>Your personal commercial world</b><br/>Products, brands, creators, and ideas you chose to keep close.</span></div></div></div>';
}
function creatorProfilePage() {
  return '<div class="screen-scroll creator-page creator-profile"><div class="content creator-page-content"><div class="creator-reputation-head"><span class="creator-kicker">◎ REPUTATION LEDGER #0492</span><button class="outline-button" data-action="creator-portfolio">▣ Portfolio</button><button class="icon-button" data-action="settings" aria-label="Settings">'+icon("settings",18)+'</button></div><section class="creator-profile-card"><div class="creator-profile-main"><span class="creator-profile-photo">'+initials(state.name)+'</span><div><b>'+esc(state.name||"Ayush Sen")+' <i>✓</i></b><small>@'+esc(state.username||"ayushcreates")+'</small><p>Cinematic Storyteller & Satirist · Bengaluru, India</p><strong>NETRA SELECT · TOP 1% STORYTELLER</strong></div><span class="creator-level">T</span></div><p class="creator-profile-bio">Turning ordinary utilitarian products into cinematic narratives. 12 CFund podium finishes. Visual architect for modern consumer hardware & audio vignettes.</p></section><section class="creator-profile-section"><div class="creator-section-title"><b>⚖ THE MERIT DIFFERENTIATOR</b><span class="pill blue-soft">Verified Audit</span></div><p>On NETRA, commercial eligibility and brand rank are powered solely by audited Creative Proof & verified scorecards, never by external follower vanity.</p><div class="creator-merit-grid"><div><small>▣ NETRA LEDGER</small><b>18,420</b><small>CREATOR POINTS</small><span>True Audience　<strong>2,840</strong></span><span>CFund Podiums　<strong>12 Wins</strong></span><span>Select Honors　<strong>4 Badges</strong></span></div><div><small>◎ INSTAGRAM</small><b>128K <i>Connected</i></b><small>RAW FOLLOWER COUNT</small><span>Vanity Weight: 0% in<br/>algorithmic allocation.</span></div></div></section><section class="creator-profile-section"><div class="creator-tier-line"><span><small>ACTIVE TIER</small><b>Tier III Senior Storyteller</b></span><strong>18,420 <small>/ 25,000 Pts</small></strong></div><i class="creator-meter"><em style="width:73%"></em></i><small class="creator-tier-next">Tier III: Elite Director　　<strong>6,580 pts to 25K · 3 CFunds</strong></small><div class="creator-section-title creator-subsection-title"><div><span class="creator-kicker">RECENT POINT VELOCITY</span></div></div>'+[["1st Place Win — NordicForm","+1,500 Pts","Premium Minimalist Product","trophy"],["NETRA Select Recognition","+300 Pts","Aura Acoustic Vignette Editorial","sparkles"],["Qualified Completion","+120 Pts","UrbanKettle Sensor Bite","check"]].map(function(item){return '<div class="creator-point-row"><span>'+icon(item[3],15)+'</span><b>'+item[0]+'<small>'+item[2]+'</small></b><strong>'+item[1]+'</strong></div>';}).join('')+'</section><section class="creator-profile-section creator-vault"><div class="creator-section-title"><b>▣ ESCROW EARNINGS VAULT</b><span class="pill red-soft">UPI Linked</span></div><div class="creator-vault-values"><span><small>AVAILABLE PAYOUT</small><b>₹84,500</b><em>◉ Instant to @okhdfcbank</em></span><span><small>PENDING ESCROW</small><b>₹25,000</b><em>Settling in ~36 hours</em></span></div><div class="creator-vault-mix"><span>Platform Gross: <b>₹4,82,000 INR</b></span><span>Verified Smart Escrow</span><div><i>CFund 74%</i><i>Licensing 22%</i><i>Bounties 4%</i></div></div><button class="cta full" data-action="creator-withdraw">ϟ Withdraw ₹84,500 (UPI Instant)</button></section><section class="creator-profile-section"><div class="creator-section-title"><b>♧ INBOUND DIRECT INQUIRIES</b><span class="creator-online">Licensing ON　●</span></div><article class="creator-inquiry"><div><b>NordicForm Studio <span class="pill violet">Enterprise</span></b><strong>₹65,000</strong></div><small>Direct 3-Bite Campaign Commission <span>Escrow Ready</span></small><p>“We would love you to direct our Autumn Minimalist Desk collection narrative with the same sensory texture as your prize-winning vignette.”</p><div class="creator-inquiry-actions"><button data-action="creator-inquiry">Review Brief</button><button data-action="creator-counter">Counter</button><button data-action="creator-accept">Accept</button></div></article></section><section class="creator-profile-section"><div class="creator-section-title"><b>▣ WINNING WORK SHOWCASE</b><small>Audited Ledger Records</small></div><div class="creator-winning-grid"><article><img src="assets/espresso.jpg" alt="A warm espresso maker editorial"/><span>RANK #01</span><b>The Silent Morning</b><small>NordicForm Challenge</small><strong>₹1.5L Earned　·　96</strong></article><article><img src="assets/flask.jpg" alt="AURA audio product vignette"/><span>NETRA SELECT</span><b>18 Months of Silence</b><small>Aura Acoustic Studio</small><strong>Featured Honor　·　94</strong></article></div><article class="creator-winning-list"><img src="assets/kettle.jpg" alt="Kettle creator campaign"/><span><b>UrbanKettle Podia</b><small>The Counterbalance Heist · Humorous sensory breakdown comparing ritualistic manual brew mechanics against fiscal restraint.</small></span><strong>₹45,000 Earned</strong></article></section><button class="outline-button full" data-action="switch-profile">Switch to Consumer profile</button></div></div>';
}
function brandMetric(label,value,detail,iconName,color) {
  return '<article class="brand-metric"><span class="brand-metric-icon '+(color||'')+'">'+icon(iconName||'spark',17)+'</span><strong>'+value+'</strong><b>'+label+'</b><small>'+detail+'</small><i></i></article>';
}
function brandHomePage() {
  const brand=esc(state.brandName||"Aura Home Studio");
  return '<div class="screen-scroll brand-page"><div class="brand-content">'+
    '<div class="brand-trust-strip"><span>✦ NETRA VERIFIED BRAND</span><b>◈ TRUST 94</b><i>● Live Sync</i></div><section class="brand-greeting"><span class="eyebrow">BRAND SUITE</span><h1>Good morning, '+brand+'.</h1><p>Here’s what’s happening with your brand on NETRA today.</p></section>'+
    '<section class="brand-dispatch"><div class="brand-section-line"><b>DIRECT DISPATCH</b><span>5 tools ready</span></div><div class="brand-dispatch-row"><button class="brand-primary-action" data-action="nav" data-tab="create">▣ <span><b>Create a Bite</b><small>Short Video Vignette</small></span></button><button class="brand-secondary-action" data-action="brand-add-product">⊕ <span><b>Add Product</b><small>Catalog Entry</small></span></button></div></section>'+
    '<section class="brand-section"><div class="brand-section-line"><h2>Ecosystem Overview</h2><span>Last 7 Days</span></div><div class="brand-metric-grid">'+brandMetric('Bite Views','42.8k','High discovery velocity','play','coral')+brandMetric('Listed Products','6','₹2.4L value · In Stock','store','slate')+brandMetric('Positive Vibe','94%','“What People Think” feed','heart','violet')+brandMetric('Creator Ties','4 Active','Editorial collaborations','people','red')+'</div></section>'+
    '<section class="brand-presence"><div class="brand-presence-head"><div class="brand-progress-ring">84%</div><span><h2>Your Brand Presence</h2><p>Almost fully editorial-ready for global discovery</p></span></div><b class="brand-section-caption">SUGGESTED ACTIONS</b><button class="brand-suggested" data-action="brand-story-upload"><span>▣</span><span><b>Add Brand Story</b><small>1–2 min origin craft video</small></span><em>+ Add Video</em></button><button class="brand-suggested" data-action="nav" data-tab="create"><span>♨</span><span><b>Spring Drop Bite</b><small>Scheduled for editorial placement</small></span><em>+ Upload Bite</em></button></section>'+
    '<section class="brand-section"><div class="brand-section-line"><h2>● What’s Happening Live</h2><button class="text-link" data-action="nav" data-tab="consumer">REALTIME PULSE →</button></div><article class="brand-live-card"><div class="brand-live-head"><span class="brand-product-thumb"><img src="assets/kettle.jpg" alt="Gooseneck kettle"/></span><span><small>TOP DISCOVERY BITE · 24m ago</small><b>Field Pour-Over Kettle v2</b><p>Precision balance &amp; tactile thermal grip…</p><strong>◉ 14.2k　♧ 342　▣ 89 intents</strong></span></div></article><article class="brand-quote-card"><div class="brand-quote-user"><span class="brand-user-face">AM</span><span><b>@ananya_m</b><small>Verified Buyer</small></span><em>★ 5 TRUST SIGNAL</em></div><blockquote>“The weighted handle feels so balanced during slow pours. Honestly the best tactile brew gear I’ve acquired on NETRA.”</blockquote><div class="brand-quote-actions"><span>Regarding: <b>Field Pour-Over Kettle v2</b></span><button data-action="brand-reply">Reply as '+brand+'　➤</button></div></article><article class="brand-collab-card"><span class="brand-user-face teal">DV</span><span><b>@dev_design　<span>ACCEPTED</span></b><small>Joined “Bite Storytelling Bounty” · Deliverable expected in 3 days</small></span><button data-action="brand-reply">Open Chat</button></article></section>'+
    '<section class="brand-shield"><span>◈</span><h2>Authenticity Shield Active</h2><p>Your NETRA brand reputation is protected with dual-signature creator verification and verified review locks.</p><button data-action="brand-trust-ledger">Inspect Brand Trust Ledger →</button></section></div></div>';
}
function brandCreatePage() {
  const type=state.brandCreateType||"Video Reel", catalog=products.concat(additionalProducts), item=catalog.find(function(p){return p.id===(state.brandCatalog||"kettle");})||products[2];
  return '<div class="screen-scroll brand-page"><div class="brand-content brand-create-content"><div class="brand-create-title"><button class="back" data-action="nav" data-tab="home">'+icon("back",18)+'</button><span><small>CAMPAIGN STUDIO · PARTS 13, 14, 27</small><h1>Create a Bite</h1></span><button class="icon-button" data-action="profile-menu">'+profileAvatar("")+'</button></div><p class="brand-page-lead">On NETRA, advertising is voluntary entertainment. Don’t interrupt attention. Earn it.</p><div class="brand-format-switch">'+["Video Reel","Editorial Stills"].map(function(label){return '<button class="'+(type===label?'active':'')+'" data-action="brand-create-type" data-value="'+label+'">'+(label==="Video Reel"?'▣':'▧')+' '+label+'</button>';}).join("")+'</div><div class="brand-create-subhead"><span>◉ LIVE READER VIEWPORT</span><b>Verified Canvas</b></div><section class="brand-bite-preview">'+(state.brandDraftMediaUrl?(state.brandBiteMediaName&&state.brandBiteMediaName.match(/\.(mp4|webm|mov)$/i)?'<video src="'+esc(state.brandDraftMediaUrl)+'" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" autoplay loop muted></video>':'<img src="'+esc(state.brandDraftMediaUrl)+'" alt="Preview" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0"/>'):'<img src="'+item.img+'" alt="'+esc(item.name)+'"/>')+'<span class="brand-preview-badge">A　'+esc(state.brandName||"Aura Home Studio")+'　✦</span><span class="brand-preview-score">T 96 INDEX</span><div class="brand-preview-reactions"><i>♥<small>1.8k</small></i><i>▢<small>94</small></i><i>♧<small>Boost</small></i></div><div class="brand-preview-product">▣　'+esc(item.name)+'<b>'+item.price+'　›</b></div><div class="brand-preview-controls"><button data-action="brand-save-draft">Save Draft</button><button data-action="brand-publish">Publish &amp; Boost Bite　→</button></div><input class="brand-bite-picker" type="file" accept="video/*,image/*" aria-label="Upload Bite media"/><button class="brand-replace-media" data-action="brand-create-upload">↑ Replace Media</button></section>'+(state.brandBiteMediaName?'<p class="brand-media-status">Ready for review · '+esc(state.brandBiteMediaName)+'</p>':'')+'<p class="brand-help-line">Tap preview to test hot-spot tags. <button data-action="brand-create-upload">Replace Media</button></p><section class="brand-catalog-card"><span><small>ATTACHED CATALOG ITEM</small><b>'+esc(item.name)+'</b><em>● In Stock · <i class="t-mark">T</i> '+item.trust+'</em></span><img src="'+item.img+'" alt=""/><button data-action="brand-catalog">Change</button></section><section class="brand-narrative"><div class="brand-section-line"><h2>Editorial Narrative Frame</h2><span>Choose 1 tone</span></div><div class="brand-tone-list">'+["Founder Story","Behind The Scenes","Product Craft Demo","Educational","Emotional & Cinematic"].map(function(t){return '<button class="'+((state.brandTone||"Product Craft Demo")===t?'active':'')+'" data-action="brand-tone" data-value="'+esc(t)+'">'+t+'</button>';}).join("")+'</div></section><section class="brand-form-card"><h2>♧ Describe your Target Audience &amp; Campaign Aim</h2><p>Tell NETRA who should discover this Bite and what outcome you want to drive.</p><label>Target Audience Description<textarea data-field="brandAudience" maxlength="300" placeholder="e.g., Specialty coffee enthusiasts, minimal desk setup collectors, modern urban professionals looking for tactile everyday craft…">'+esc(state.brandAudience||"")+'</textarea></label><div class="brand-field-meta"><span>AI Refine</span><b>'+(state.brandAudience||"").length+' / 300 chars</b></div><b class="brand-form-label">Campaign Aim</b>'+[["Conversion / Direct Sale","Turn viewers into instant buyers with product tags"],["Brand & Craft Awareness","Maximize voluntary watch time and aesthetic affinity"],["Product Consideration","Engage discerning buyers comparing high-craft options"],["Community & Feedback","Spark conversation and discover what people think"]].map(function(a){return '<button class="brand-aim-option '+((state.brandCampaignAim||a[0])===a[0]?'active':'')+'" data-action="brand-campaign-aim" data-value="'+esc(a[0])+'"><i></i><span><b>'+a[0]+'</b><small>'+a[1]+'</small></span></button>';}).join("")+'</section><section class="brand-boost"><div class="brand-section-line"><h2>🚀 Want More Reach?</h2><span>DISTRIBUTION BOOST</span></div><p>NETRA Platform Disclosure: Higher promotional budgets provide additional distribution opportunities, subject to content relevance and authentic craft quality.</p>'+[["Organic Launch","Standard discovery algorithm","₹0"],["Community Boost","Targeted to niche craft enthusiasts","₹100 / day"],["High Discovery","Priority placement in explore & Bite feeds","₹300 / day"],["Custom Budget","Scale for wider editorial campaigns","₹500+ / day"]].map(function(a){return '<button class="brand-budget-option '+((state.brandBudget||"₹300 / day")===a[2]?'active':'')+'" data-action="brand-budget" data-value="'+esc(a[2])+'"><span><b>'+a[0]+'</b><small>'+a[1]+'</small></span><strong>'+a[2]+'</strong><i></i></button>';}).join("")+'</section><div class="brand-quality">▤　NETRA Editorial Quality Guarantee <span>Zero Ad Clutter Policy</span></div></div></div>';
}
function brandFundPage() {
  const detail=state.brandFundView==="detail";
  if(state.brandFundView==="create") return '<div class="screen-scroll brand-page"><div class="brand-content"><div class="brand-page-topline"><button class="back" data-action="brand-fund-back">'+icon("back",18)+'</button><b>Create a CFund</b><span>Step 1 of 3</span></div><span class="eyebrow">NETRA SUITE · CFUND STUDIO</span><h1 class="brand-fund-title">Build a creative challenge.</h1><p class="brand-page-lead">Set a clear brief and protected reward pool. Creators compete through voluntary, original work.</p><section class="brand-onboard-card flow-card"><label class="brand-field">Campaign title<input data-field="brandFundTitle" value="'+esc(state.brandFundTitle||"")+'" placeholder="e.g. Make Urban Living Impossible to Ignore"/></label><label class="brand-field">Creative brief<textarea data-field="brandFundBrief" placeholder="What should creators make, and what do you want audiences to feel?">'+esc(state.brandFundBrief||"")+'</textarea></label><div class="brand-cfund-create-options"><button class="active">₹1,00,000</button><button>₹2,50,000</button><button>₹5,00,000</button><button>₹10,00,000</button></div><p>Prize pool protected by NETRA escrow. Choose creator capacity and submission window in the next step.</p><button class="cta full" data-action="brand-fund-save">Save Brief &amp; Continue →</button></section></div></div>';
  if(detail) return '<div class="screen-scroll brand-page"><div class="brand-content"><div class="brand-page-topline"><button class="back" data-action="brand-fund-back">'+icon("back",18)+'</button><b>CFund Campaign Detail</b><button data-action="share">'+icon("share",17)+'</button></div><span class="eyebrow">CFUNDS　/　#CF-9402　 ● LIVE ARENA</span><h1 class="brand-fund-title">REAL ESTATE STORY: The Future Home Challenge</h1><p class="brand-page-lead">Aura Living Spaces · Verified Enterprise Host</p><section class="brand-fund-pool"><small>ACTIVE PRIZE &amp; LICENSING POOL</small><strong>₹10,00,000 <i>CFUND</i></strong><p>Merit-based creator rewards protected with NETRA escrow.</p><div class="brand-slot-progress"><b>347 / 500 CREATOR SLOTS CLAIMED</b><span>153 spots left</span><i><em style="width:69%"></em></i></div><p>◷ 6 DAYS 14 HOURS LEFT　·　Submissions lock Nov 28, 23:59 IST</p></section><div class="brand-fund-stats"><div><small>Submissions</small><b>1,284</b></div><div><small>Qualified cut</small><b>742</b></div><div><small>Watch views</small><b>18.4M</b></div><div><small>Interactions</small><b>4.2M</b></div></div><section class="brand-section"><div class="brand-section-line"><h2>Top Creative Work</h2><button class="small-button">Filter</button></div><article class="brand-ranked-work"><img src="assets/espresso.jpg" alt="Creator work still"/><span><b>#01 RANK　4K UHD</b><h3>The Breathing Architecture</h3><small>Arjun Verma · 96 / 100 Creative Score</small><button data-action="brand-license">License ₹75,000</button><button data-action="brand-reply">Approach</button></span></article><button class="brand-secondary-action full" data-action="brand-share-fund">Share CFund Link　→</button></section></div></div>';
  const filter=state.brandFundFilter||"Live CFunds";
  if(filter!=="Live CFunds") return '<div class="screen-scroll brand-page"><div class="brand-content"><div class="brand-suite-title"><span class="brand-suite-icon">◉</span><span><b>NETRA SUITE</b><small>CFund Campaigns</small></span><em>◈ CFund Live</em></div><div class="brand-cfund-intro"><span class="eyebrow">CROWD-FINANCED CREATIVE ENGINE</span><h1>CFUNDS</h1><p>Review your '+(filter==="Drafts"?"saved briefs":"settled creator challenges")+'.</p></div><div class="brand-cfund-tabs">'+["Live CFunds","Drafts","Completed"].map(function(x){return '<button class="'+(filter===x?'active':'')+'" data-action="brand-fund-filter" data-value="'+x+'">'+x+'</button>';}).join("")+'</div>'+(filter==="Drafts"?'<article class="brand-pipeline"><small>WORKING DRAFT</small><h2>'+esc(state.brandFundTitle||"New creative challenge")+'</h2><p>'+(state.brandFundBrief?esc(state.brandFundBrief):"Continue writing the brief and set your reward pool.")+'</p><button data-action="brand-create-fund">Continue draft →</button></article><button class="brand-cfund-create" data-action="brand-create-fund">＋ Create another CFund</button>':'<article class="brand-pipeline"><small>COMPLETED &amp; SETTLED</small><h2>MINIMALIST KITCHEN NOISELESS LIVING</h2><p>Fund deployed ₹7,50,000 · 412 creators rewarded · ₹1,18,000 refunded</p><button data-action="brand-fund-detail">View settlement &amp; top work →</button></article>')+'</div></div>';
  return '<div class="screen-scroll brand-page"><div class="brand-content"><div class="brand-suite-title"><span class="brand-suite-icon">◉</span><span><b>NETRA SUITE</b><small>CFund Campaigns</small></span><em>◈ CFund Live</em></div><div class="brand-cfund-intro"><span class="eyebrow">CROWD-FINANCED CREATIVE ENGINE</span><b>NETRA Verified Hub</b><h1>CFUNDS</h1><p>Fund creativity. Discover talent. Build something people actually want to watch.</p></div><section class="brand-model-card"><b>◌ TRADITIONAL MODEL</b><p>Business → Pay Influencer → Sponsored Post → <i>Hope it works</i></p><div><b>ϟ NETRA CFUND ENGINE</b><span>DECENTRALIZED</span><p>Brand → Launch Fund → Creators Compete → Organic Reach → Talent Wins</p></div></section><button class="brand-cfund-create" data-action="brand-create-fund">⊕ + CREATE A CFUND</button><div class="brand-cfund-tabs">'+["Live CFunds","Drafts","Completed"].map(function(x){return '<button class="'+(filter===x?'active':'')+'" data-action="brand-fund-filter" data-value="'+x+'">'+x+'</button>';}).join("")+'</div><section class="brand-section brand-live-fund"><div class="brand-section-line"><span class="eyebrow">● HIGH-TENSION LIVE BRIEF</span><b>Real-time Attribution</b></div><article class="brand-fund-card"><small>Aura Living　•　Nordic Spaces　◉</small><h2>REAL ESTATE STORY: The Future Home Challenge</h2><span class="pill red">● LIVE NOW</span><div class="brand-fund-amount"><small>TOTAL ALLOCATED LIQUIDITY</small><b>₹10,00,000 CREATIVE FUND</b><span>◈ Escrow locked · 100% guaranteed</span></div><div class="brand-fund-cap"><div><span>Creator Roster</span><b>153 Slots Remaining</b></div><strong>347 / 500 CREATOR SLOTS CLAIMED</strong><i><em style="width:69%"></em></i><small>Cap limit protects engagement yield per participant.</small></div><div class="brand-fund-cap"><div><span>Submission Window</span><b>◷ Strict Deadline</b></div><strong>6 DAYS 14 HOURS LEFT</strong><small>Automatic closure at 23:59 IST · Rankings recalculate hourly</small></div><div class="brand-fund-stats"><div><small>Submissions</small><b>1,284</b><small>+184 today</small></div><div><small>Qualified</small><b>742</b><small>57.7% pass rate</small></div><div><small>Voluntary views</small><b>18.4M</b></div><div><small>Distributed</small><b>₹6,82,000</b></div></div><button class="brand-warroom" data-action="brand-fund-detail">Open CFund War-Room　→</button></article></section><section class="brand-section"><div class="brand-section-line"><span class="eyebrow">SECONDARY ACTIVE PIPELINE</span><b>Critical Capacity</b></div><article class="brand-pipeline"><small>AURA AUDIO LABS　·　ALMOST FULL</small><h2>AURA AUDIO FLASK: 45s Acoustic Vignette Challenge</h2><p>Ambient spatial sound demonstrations using pure mobile audio captures. No studio Foley allowed.</p><b>▣ ₹5,00,000 CFund　·　192 / 200 Slots (8 Left)</b><button data-action="brand-fund-detail">View Challenge →</button></article></section><section class="brand-proof-card"><span>INCENTIVE SAFEGUARD</span><b>NETRA Select Creator Guarantee</b><p>Top 5% creators in every CFund earn permanent NETRA Select accreditation and future exclusive brief access.</p><button data-action="brand-trust-ledger">View Accreditation Criteria</button></section></div></div>';
}
function brandConsumersPage() {
  const tab=state.brandConsumerTab||"Overview";
  const tabs=["Overview","Journey","Behaviour","Content","Opinions"];
  const opinion=tab==="Opinions";
  return '<div class="screen-scroll brand-page"><div class="brand-content brand-consumer-content"><div class="brand-consumer-heading"><span class="eyebrow">NETRA BUSINESS · CONSUMER INTELLIGENCE</span><div class="brand-consumer-tabs">'+tabs.map(function(x){return '<button class="'+(tab===x?'active':'')+'" data-action="brand-consumer-tab" data-value="'+x+'">'+x+'</button>';}).join("")+'</div><small>● COMMERCIAL INTELLIGENCE　·　Live Ingestion</small><h1>'+ (opinion?'What People Think':tab==="Content"?'Content Performance':tab==="Behaviour"?'Consumer Behaviour':tab==="Journey"?'Consumer Journey':'Consumers')+'</h1><p>'+ (opinion?'Structured commercial intelligence from real consumers discovering your products and Bites.':tab==="Content"?'See which stories and Bites move people from discovery to product interest.':'Understand what people do after they discover your brand.')+'</p></div><div class="brand-filter-row"><button>▣ Last 30 days　⌄</button><button>▧ All Content　⌄</button><button>Export　↓</button></div>'+
    (opinion?'<section class="brand-opinion-score"><span>T</span><div><small>PLATFORM VERIFIED TRUST SIGNAL</small><h2>92 <small>/100</small></h2><p>Synthesized from commercial transparency, catalog truth, and verified buyer discussions.</p></div><b>✦<small>High Trust</small></b></section><div class="brand-filter-pills">'+["All 184","Positive 142","Questions 23","Concerns 11"].map(function(x,i){return '<button class="'+(!i?'active':'')+'">'+x+'</button>';}).join("")+'</div><section class="brand-section"><div class="brand-section-line"><h2>Verified Consumer Stream</h2><span>Sort: Relevance</span></div><article class="brand-consumer-comment"><span class="brand-user-face">PC</span><div><b>@priya_curates　✦ <small>2h ago</small></b><p>“The dual-boiler thermal stability at this price point is insane. Does the group head fit standard 58mm portafilters?”</p><div class="brand-comment-tags"><span>Product Inquiry</span><span>Buying Intent: High</span></div><button data-action="brand-reply">▣ Direct Reply as Brand</button><button data-action="brand-insight">＋ Save as Product Insight</button></div></article><article class="brand-consumer-comment"><span class="brand-user-face violet">KK</span><div><b>@karthik_crafts　✦ <small>5h ago</small></b><p>“Loved the founder behind-the-scenes Bite. It convinced me to bookmark the drop for next payday.”</p><div class="brand-comment-tags"><span>Content Resonance</span><span>Remember It Saved</span></div><button data-action="brand-insight">♡ Acknowledge</button></div></article></section><section class="brand-critique-card"><span class="eyebrow">NETRA LABS · AD CRITIQUE</span><h2>Launch Consumer Ad Critique</h2><p>Ask real consumers to record honest feedback on your upcoming campaign before wide distribution.</p><button class="cta full" data-action="brand-critique">Launch Ad Critique Bounty (₹2,500)</button></section>':
    '<section class="brand-section"><div class="brand-section-line"><h2>Cohort Diagnostics</h2><b>30D Rollup</b></div><div class="brand-cohort-grid">'+[['Total Reached','482.6k','↑ +14.2%'],['Discoveries','126.4k','↑ +22.8%'],['Engaged','54.8k','↑ +18.1%'],['Product Interest','18.4k','↑ +31.0%'],['Product Memory','6,240','↑ +44.2%'],['Conversions','684','31.3% of considered']].map(function(x){return '<article><small>'+x[0]+'</small><strong>'+x[1]+'</strong><b>'+x[2]+'</b></article>';}).join('')+'</div></section><section class="brand-section brand-journey"><div class="brand-section-line"><h2>Your NETRA Consumer Journey</h2><span>Active Window</span></div>'+[['REACHED','482,600','Organic Bites, Explorer Feed, Ad Games, Creators',100],['DISCOVERED','126,400','First-time encounter; watched >50% or brand tap',72],['ENGAGED','54,820','Liked, trusted, shared, comments',50],['PRODUCT EXPLORED','18,420','Interacted with attached product tag / catalog spec',39],['REMEMBERED','6,240','Saved to personal NETRA Product Memory',25],['CONSIDERED','2,184','Repeated visits, trust ledger checks, comparison',17],['CONVERTED','684','₹32.8L tracked gross revenue',100]].map(function(x,i){return '<div class="brand-journey-step"><span>'+(i+1)+'</span><div><b>'+x[0]+'</b><small>'+x[2]+'</small></div><strong>'+x[1]+'</strong><i><em style="width:'+x[3]+'%"></em></i></div>';}).join('')+'</section><section class="brand-section"><div class="brand-section-line"><h2>Where Did Consumers Discover You?</h2><small>ATTRIBUTION PATHS</small></div>'+[['Bites Reels',46],['Home Stream',22],['Creator Content',14],['Ad Games',8],['Search & Curated',6],['Brand Profile Direct',4]].map(function(x){return '<div class="brand-attribution"><span>'+x[0]+'</span><i><em style="width:'+x[1]+'%"></em></i><b>'+x[1]+'%</b></div>';}).join('')+'</section><section class="brand-memory-list"><div class="brand-section-line"><h2>What Are People Remembering?</h2><b>LONG-TERM RESONANCE</b></div>'+[['Forma Espresso Unit','3,420 saved','assets/espresso.jpg'],['Vatten Smart Kettle','1,890 saved','assets/kettle.jpg'],['Kvarn Burr Grinder','930 saved','assets/lamp.jpg']].map(function(x){return '<article><img src="'+x[2]+'" alt=""/><span><b>'+x[0]+'</b><small>High intent product memory</small></span><strong>'+x[1]+'</strong></article>';}).join('')+'</section>')+'</div></div>';
}
function brandProfilePage() {
  const brand=esc(state.brandName||"Aura Home Studio"), allProducts=products.concat(additionalProducts), ids=state.brandCatalogIds||["espresso","kettle","flask","lamp"], catalog=ids.map(function(id){return allProducts.find(function(p){return p.id===id;});}).filter(Boolean);
  const verificationStatus=state.businessVerificationStatus||"UNVERIFIED";
  const verificationCard='<section class="brand-access-card brand-verification-card"><div><span class="eyebrow">NETRA BUSINESS VERIFICATION</span><b>'+(verificationStatus==="VERIFIED"?"NETRA VERIFIED BRAND":verificationStatus==="PENDING"?"Verification request under review":verificationStatus==="REJECTED"?"More information is needed to verify this business":"Build trust with a verified business profile")+'</b></div>'+(verificationStatus==="UNVERIFIED"||verificationStatus==="REJECTED"?'<button class="outline-button full" data-action="request-business-verification">Request business verification</button>':verificationStatus==="PENDING"?'<small>NETRA will email the business contact when the review status changes.</small>':'<span class="pill blue-soft">✓ Verified by NETRA</span>')+'</section>';
  return '<div class="screen-scroll brand-page"><div class="brand-content brand-profile-content"><div class="brand-profile-top"><span>'+logo()+' NETRA <small>BUSINESS SUITE</small></span><button data-action="settings">'+icon("settings",17)+'</button></div><section class="brand-profile-cover"><img src="assets/espresso.jpg" alt="Coffee tools from the brand catalog"/><div class="brand-cover-overline">● LIVE STUDIO PORTAL　　◈ VIEWING AS OWNER</div><div class="brand-profile-avatar">'+(state.brandLogoData?'<img src="'+esc(state.brandLogoData)+'" alt="Brand logo"/>':esc(initials(brand)))+'</div><div class="brand-profile-trust">◈ 96 TRUST SCORE</div><h1>'+brand+'</h1><p>@'+esc(state.brandHandle||"aurahomestudio")+'　·　Design &amp; Hardware</p><div class="brand-profile-stats"><span>ACTIVE REELS<b>18</b></span><span>STORE CONVERSIONS<b>14.8%</b></span><span>CO-CREATORS<b>24</b></span></div></section>'+verificationCard+'<section class="brand-access-card"><div><span class="eyebrow">◷ EPHEMERAL COLLAB ACCESS</span><b>Advertisers and Content Creators can draft video reels and propose live campaign hooks with your mandatory sign-off at every milestone.</b></div><p>🔗 netra.biz/access/'+esc(state.brandHandle||"aurahomestudio")+' <button data-action="brand-copy-link">COPY</button></p><div class="brand-mode-row"><span>ADVERTISER MODE <b>Pitch Commercial Bites</b></span><button class="brand-toggle on" data-action="brand-mode-toggle"></button></div><div class="brand-mode-row"><span>CREATOR MODE <b>Draft Reels Sandbox</b></span><button class="brand-toggle on" data-action="brand-mode-toggle"></button></div></section><div class="brand-profile-actions"><button data-action="brand-new-campaign">⊕ NEW CAMPAIGN</button><button data-action="nav" data-tab="create">▣ ALL BITES</button><button data-action="brand-drafts">▧ DRAFTS (2)</button><button data-action="brand-invite">♙ INVITE TALENT</button></div><section class="brand-section"><div class="brand-section-line"><h2>Brand Story Feature</h2><span>FEATURED REEL</span></div><article class="brand-profile-feature"><img src="assets/kettle.jpg" alt="Brand story product still"/><span>120S BRAND REEL</span><b>Vision &amp; craft · Behind the silence</b><small>84% Completion</small></article></section><section class="brand-section"><div class="brand-section-line"><h2>Published Bites Gallery</h2><span>PUBLIC CATALOG</span></div>'+(state.brandAddProduct?'<div class="brand-add-catalog"><b>Add a catalog item</b><button data-action="brand-catalog-done">Done</button><div>'+allProducts.filter(function(p){return !ids.includes(p.id);}).slice(0,8).map(function(p){return '<button data-action="brand-catalog-add" data-value="'+p.id+'"><img src="'+p.img+'" alt=""/><span>'+esc(p.name)+'</span><b>＋ Add</b></button>';}).join('')+'</div></div>':'')+'<button class="brand-add-product-button" data-action="brand-add-product">＋ Add Product</button><div class="brand-product-grid">'+catalog.map(function(p){return '<article><img src="'+p.img+'" alt="'+esc(p.name)+'"/><span class="pill violet">◈ '+p.trust+' Trust</span><b>'+esc(p.name)+'</b><small>'+p.price+'</small><em>IN STOCK <i class="brand-toggle on"></i></em></article>';}).join('')+'</div></section><section class="brand-narrative-preview"><div class="brand-section-line"><h2>▧ The '+brand+' Narrative</h2><button data-action="brand-edit-profile">EDIT ↗</button></div><p>“'+esc(state.brandManifesto||"Crafting sensory objects that outlive trends. We eliminate cosmetic distractions to elevate the morning ritual of mindful extraction and tactile culinary focus.")+'”</p><div><span>#NORDICDESIGN</span><span>#ZERONOISECRAFT</span><span>#TACTILEKITCHEN</span></div></section><article class="brand-audit-note">▣　Creator Reels Awaiting Approval <b>2</b><button data-action="brand-audit">AUDIT NOW</button></article></div></div>';
}
function brandMessagesPage() {
  return '<div class="screen-scroll brand-page"><div class="brand-content"><div class="brand-section-line"><h1>Messages</h1><span class="eyebrow">BRAND INBOX</span></div><div class="brand-cfund-tabs"><button class="active">Consumers</button><button>Creators</button><button>Business</button></div><article class="brand-inbox-item"><span class="brand-user-face">AM</span><span><b>@ananya_m　· Verified Buyer</b><small>Does the kettle work on induction?</small></span><em>2m ago</em><button data-action="brand-reply">Reply</button></article><article class="brand-inbox-item"><span class="brand-user-face violet">DV</span><span><b>@dev_design　· Creator</b><small>My Bite draft is ready for review.</small></span><em>1h ago</em><button data-action="brand-reply">Open</button></article><article class="brand-inbox-item"><span class="brand-user-face teal">NF</span><span><b>NordicForm Official</b><small>Catalog partnership invitation</small></span><em>Yesterday</em><button data-action="brand-reply">View</button></article></div></div>';
}
function messagesPage() {
  if(state.profileMode==="brand") return brandMessagesPage();
  return '<div class="screen-scroll"><div class="content"><div class="message-tabs">'+["Friends","Businesses","Approaches"].map(function(t,i){return '<button class="'+(state.activeMessage===t.toLowerCase()?'active':'')+'" data-action="message-tab" data-value="'+t.toLowerCase()+'">'+t+(i===0?'　2':i===1?'　1':'　New')+'</button>';}).join("")+'</div>'+
    (state.activeMessage==="friends"?
      '<article class="message-card card"><div class="message-head"><span class="mini-avatar">RK</span><span class="grow"><strong>Rohan K. <span class="pill gray">Close circle</span></strong><small>● Shared a verified Bite</small></span><small>3m ago</small></div><p>Dude check the sound test at 0:24, thinking of getting this for my desk setup! 🔊✨</p><div class="shared-bite"><div class="bite-cover"><img src="assets/flask.jpg" alt="" /><div class="cover-top"><span class="cover-tag">@AURA · Shared Bite</span><span class="trust-pill"><i class="t-mark">t</i>89</span></div><div class="cover-bottom"><span>ACOUSTIC MORNING REEL</span><strong>AURA Audio Flask</strong></div></div><div class="shared-actions"><button data-action="like" data-id="shared">'+icon("heart",14)+' Like</button><button data-action="message-thread" data-id="rohan">'+icon("comment",14)+' Reply</button><button data-action="share">'+icon("share",14)+' Share</button><span class="spacer"></span><button class="small-button red" data-action="buy" data-id="flask">Buy now ↗</button></div></div></article>'+
      '<article class="message-card card" data-action="message-thread" data-id="kavya"><div class="message-head"><span class="mini-avatar" style="background:linear-gradient(135deg,#574c47,#d5a47d)">KP</span><span class="grow"><strong>Kavya Patel</strong><small>Voted Brushed Clay on that SolSkin…</small></span><small>14m ago</small></div><p><span class="pill violet">SolSkin Poll</span> <span class="muted">Unread question</span></p></article>'+
      '<article class="message-card card" data-action="message-thread" data-id="nordic"><div class="message-head"><span class="business-logo nord">NF</span><span class="grow"><strong>NordicForm Official · ✓</strong><small>Your replacement gasket for the Mini-Press V2 has been dispatched via…</small></span><small>2h ago</small></div><p><span class="pill violet">♧ In transit</span> <span class="muted">98% Trust Merchant</span></p></article>':
      state.activeMessage==="businesses"?
      '<div class="empty-state card"><div class="empty-icon">⌂</div>Your product and brand conversations will appear here. Messages stay tied to the things you discover.</div>':
      '<article class="approach-card card"><span class="pill violet">✦ New commercial approach</span><span class="pill">Bounty · ₹18,000</span><h3>Kinfolk Aromatics · Summer Discovery Reel</h3><p>Inviting you to pilot the Cold-Pressed Cedar Diffuser. Fast-tracked creative direction with full commercial license.</p><div class="button-row" style="justify-content:flex-end;margin-top:12px"><button class="small-button" data-action="decline">Decline</button><button class="cta black" style="min-height:37px;font-size:10px" data-action="terms">Review terms</button></div></article>')+
    '<button class="cta full" style="margin-top:12px" data-action="share-bite">Share a Bite with a friend '+icon("arrow",14)+'</button></div></div>';
}
function searchPage() {
  return '<div class="screen-scroll"><div class="content"><label class="search-box">'+icon("search")+'<input id="global-search" data-action="global-search" value="'+esc(searchQuery)+'" placeholder="Search brands, products and creators..." autofocus /><button class="search-tune" data-action="noop">'+icon("tune")+'</button></label><div id="search-results">'+searchResults(searchQuery)+'</div></div></div>';
}
function searchResults(q) {
  if (!q) return '<div class="section">'+sectionHeader("Start with a curiosity","What are you looking for?")+'<div class="chip-list">'+["Coffee","New launches","Design","Skincare","Indian startups"].map(function(x){return '<button class="chip" data-action="search-term" data-value="'+x+'">'+x+'</button>';}).join("")+'</div></div>';
  const query=q.toLowerCase();
  const found=products.concat(additionalProducts).filter(function(p){return (p.brand+" "+p.name+" "+p.label).toLowerCase().includes(query);});
  const foundBusinesses=businesses.filter(function(b){return (b.name+" "+b.category).toLowerCase().includes(query);});
  return '<section class="section">'+sectionHeader("Discovery results",found.length+foundBusinesses.length+" things to explore")+
    found.map(function(p){return '<button class="editorial-card card" style="width:100%;text-align:left" data-action="product" data-id="'+p.id+'"><span class="editorial-thumb"><img src="'+p.img+'" alt="" /></span><span><span class="eyebrow">'+p.brand+'</span><h3>'+p.name+'</h3><p>'+p.price+' · NETRA Trust T '+p.trust+'</p></span></button>';}).join("")+
    foundBusinesses.map(function(b){return '<button class="profile-nav-card card" style="width:100%;text-align:left" data-action="business" data-id="'+b.id+'"><span class="business-logo '+b.id+'">'+b.initials+'</span><span><strong>'+b.name+'</strong><small>'+b.category+' · T '+b.trust+'</small></span><span class="arrow">→</span></button>';}).join("")+
    (!found.length&&!foundBusinesses.length?'<div class="empty-state card">No exact match yet. Try a product, brand, or category.</div>':'')+'</section>';
}
function modalView() {
  if (!modal) return "";
  if (modal.type==="business-verification") {
    return '<div class="overlay" data-action="modal-backdrop"><section class="sheet" role="dialog" aria-modal="true"><div class="sheet-handle"></div><div class="sheet-top"><span><small>NETRA BUSINESS VERIFICATION</small><h2>Verify your business</h2></span><button class="close-button" data-action="close" aria-label="Close">×</button></div><p class="detail-summary">Share the business contact details NETRA should use for review. Only NETRA can change your verification status.</p><form data-form="business-verification" class="auth-card account-fields"><label>Business contact email<input name="businessEmail" type="email" autocomplete="email" placeholder="business@example.com" required maxlength="254" /></label><label>Business website <span class="pill">Optional</span><input name="businessWebsite" type="url" placeholder="https://example.com" maxlength="2048" /></label><label>Registration ID <span class="pill">Optional</span><input name="registrationId" placeholder="Business registration number" minlength="3" maxlength="120" /></label><button class="cta full">Submit verification request</button></form></section></div>';
  }
  if (modal.type==="profile-menu") {
    return '<div class="overlay" data-action="modal-backdrop"><section class="sheet profile-menu-sheet" role="dialog" aria-modal="true"><div class="sheet-handle"></div><div class="sheet-top"><span><small>YOUR NETRA</small><h2>Quick menu</h2></span><button class="close-button" data-action="close" aria-label="Close">×</button></div><div class="menu-grid"><button class="menu-tile" data-action="profile-tab" data-value="memory">'+icon("bookmark",19)+'<b>Product Memory</b><small>Saved finds</small></button><button class="menu-tile" data-action="profile-tab" data-value="rewards">'+icon("spark",19)+'<b>NETRA Coins</b><small>'+state.coins.toLocaleString()+' coins</small></button><button class="menu-tile" data-action="edit-intent">'+icon("tune",19)+'<b>Personalize</b><small>Shape your feed</small></button><button class="menu-tile" data-action="settings">'+icon("settings",19)+'<b>Settings</b><small>Make NETRA yours</small></button><button class="menu-tile theme-tile" data-action="theme-cycle"><span class="theme-swatch"></span><b>Theme color</b><small>'+esc(state.theme||"warm")+' · tap to change</small></button></div><div class="menu-account"><div class="menu-section-title"><span>Switch profile</span><small>Same account</small></div><div class="mode-switcher">'+[["consumer","Consumer"],["creator","Creator"],["brand","Brand"]].map(function(m){return '<button class="'+(state.profileMode===m[0]?'active':'')+'" data-action="switch-mode" data-value="'+m[0]+'">'+m[1]+'</button>';}).join("")+'</div>'+(serverMe?'<button class="outline-button full" data-action="signout">Sign out of NETRA</button>':'<button class="outline-button full" data-action="account">Sign in to NETRA</button>')+'</div></section></div>';
  }
  if (modal.type==="comments") {
    const posts=(state.biteComments&&state.biteComments[modal.id])||[];
    const attachment=state.commentAttachment;
    return '<div class="overlay" data-action="modal-backdrop"><section class="sheet comment-sheet" role="dialog" aria-modal="true"><div class="sheet-handle"></div><div class="sheet-top"><span><small class="comment-eyebrow">THE CONVERSATION</small><h2>What people think</h2></span><button class="close-button" data-action="close">×</button></div><p class="muted comment-intro">Real reactions, useful questions, and the occasional hot take.</p><div class="comment-thread"><div class="comment-row"><span class="mini-avatar">KP</span><p><strong>Kavya Patel <span class="trust-pill"><i class="t-mark">t</i>88</span></strong>Love how the design keeps the counter uncluttered. Would like to hear how loud it is, though.</p></div><div class="comment-row"><span class="mini-avatar">AM</span><p><strong>Arjun Mehta <span class="pill">Coffee at home</span></strong>The story made me look up the materials. Does the handle stay cool?</p></div><div class="comment-row"><span class="mini-avatar">SK</span><p><strong>Sana Kapoor</strong>Useful to see the product in a real morning routine instead of a studio shot.</p></div>'+posts.map(function(post){return '<div class="comment-row comment-row-own"><span class="mini-avatar">'+initials(state.name)+'</span><div class="own-comment"><strong>'+esc(state.name||"You")+' <span>YOU</span></strong>'+(post.text?'<p>'+esc(post.text)+'</p>':'')+(post.attachment?'<img class="comment-post-media" src="'+esc(post.attachment.url)+'" alt="Shared '+esc(post.attachment.kind)+'" />':'')+'</div></div>';}).join("")+'</div><form data-form="comment" class="comment-input comment-composer-form">'+(attachment?'<div class="comment-attachment-preview"><img src="'+esc(attachment.url)+'" alt="Selected '+esc(attachment.kind)+'" /><span><b>'+esc(attachment.kind)+' ready</b><small>'+esc(attachment.name)+'</small></span><button type="button" data-action="comment-remove" aria-label="Remove attachment">×</button></div>':'')+'<div class="comment-compose"><input name="comment" value="'+esc(state.commentDraft||"")+'" placeholder="honestly bata de bhai" aria-label="Write a comment" /><button class="cta comment-send" aria-label="Post comment">'+icon("send",16)+'</button></div><div class="comment-toolbar"><span><button type="button" class="comment-media-button" data-action="comment-gallery">'+icon("image",16)+' Gallery</button><button type="button" class="comment-media-button gif-button" data-action="comment-gif">GIF</button></span><small>Photo or GIF, your call.</small></div><input id="comment-gallery-input" class="comment-media-input" data-media-kind="gallery" type="file" accept="image/*" aria-label="Choose an image" /><input id="comment-gif-input" class="comment-media-input" data-media-kind="gif" type="file" accept="image/gif,.gif" aria-label="Choose a GIF" /></form></section></div>';
  }
  if (modal.type==="product" || modal.type==="buy") {
    const p=productById(modal.id);
    return '<div class="overlay" data-action="modal-backdrop"><section class="sheet" role="dialog" aria-modal="true"><div class="sheet-handle"></div><div class="sheet-top"><h2>More about the product</h2><button class="close-button" data-action="close">×</button></div><div class="product-detail-hero"><img src="'+p.img+'" alt="'+esc(p.name)+'" /></div><div class="detail-price"><div><span class="product-brand">'+p.brand+'</span><h2 style="margin:3px 0 0;font:700 17px Plus Jakarta Sans,sans-serif">'+p.name+'</h2></div><strong>'+p.price+'</strong></div><div class="button-row"><span class="trust-pill"><i class="t-mark">T</i>'+p.trust+' Trust signal</span><span class="pill">✦ Product story</span></div><p class="detail-summary">'+p.note+'</p><h3 style="font:700 13px Plus Jakarta Sans,sans-serif">What people are saying</h3><p class="detail-summary">“Thoughtful details, and it feels made for everyday use.” · Sample community opinion<br/><br/>Trust reflects aggregate NETRA user signals and is not a guarantee about this product.</p><ul class="detail-list"><li>Materials and maker details from the brand</li><li>Creator opinions and Bites in the NETRA feed</li><li>Related products and the brand story</li></ul><div class="button-row"><button class="cta" data-action="external-buy" data-id="'+p.id+'">Shop with brand ↗</button><button class="outline-button" data-action="remember" data-id="'+p.id+'">'+(selectedProductIds().includes(p.id)?'✓ Remembered':'⌑ Remember it')+'</button></div><p class="muted" style="font-size:9px">Brand store links and purchases are not connected in this local prototype.</p></section></div>';
  }
  if (modal.type==="critique") {
    return '<div class="overlay" data-action="modal-backdrop"><section class="sheet" role="dialog" aria-modal="true"><div class="sheet-handle"></div><div class="sheet-top"><h2>Your honest opinion</h2><button class="close-button" data-action="close">×</button></div><span class="pill red">AURA Audio · ₹300 reward + 2 NETRA Coins</span><p class="detail-summary">Watch the unreleased spot, then share a short candid reaction. The reward is for your time and honest feedback; it does not depend on whether you like the product.</p><div class="critique-prompt"><span style="font-size:20px">🎙</span><span>Video capture and rewards are not connected in this local prototype. Share a written reaction to preview the feedback flow.</span></div><textarea id="critique-text" class="text-area" placeholder="What felt clear, confusing, or memorable?"></textarea><p class="muted" style="font-size:9px">The brand may review feedback and contact consumers through NETRA when those services are connected.</p><button class="cta full" data-action="submit-critique">Submit honest feedback</button></section></div>';
  }
  if (modal.type==="challenge") {
    const game=modal.id;
    const titles={spot:"Spot the difference",deal:"Beat the deal",thisor:"This or that",guess:"Guess the price"};
    return '<div class="overlay" data-action="modal-backdrop"><section class="sheet" role="dialog" aria-modal="true"><div class="sheet-handle"></div><div class="sheet-top"><h2>'+titles[game]+'</h2><button class="close-button" data-action="close">×</button></div>'+
      (game==="spot"?'<p class="detail-summary">Compare both product details and tap each part you think changed. Select all three to complete this sample round.</p><div class="compare-images"><div class="compare-image"><img src="assets/espresso.jpg" alt="Prototype" /><span>V1</span></div><div class="compare-image alternate-finish"><img src="assets/espresso.jpg" alt="Final" /><span>V2</span></div></div><div class="chip-list"><button class="chip '+(state.gamePicks.spot.includes("finish")?"active":"")+'" data-action="spot-choice" data-value="finish">Finish</button><button class="chip '+(state.gamePicks.spot.includes("handle")?"active":"")+'" data-action="spot-choice" data-value="handle">Handle</button><button class="chip '+(state.gamePicks.spot.includes("base")?"active":"")+'" data-action="spot-choice" data-value="base">Base</button></div>':
      game==="deal"?'<p class="detail-summary">Build a desk setup that stays under ₹2,000. Pick two or more items and keep the total within budget.</p><div class="chip-list">'+[{key:"pad",label:"Leather desk pad · ₹899"},{key:"pen",label:"Brass pen · ₹449"},{key:"dock",label:"Cable dock · ₹599"},{key:"notebook",label:"Notebook · ₹299"}].map(function(item){return '<button class="chip '+(state.gamePicks.deal.includes(item.key)?"active":"")+'" data-action="deal-pick" data-value="'+item.key+'">'+item.label+'</button>';}).join("")+'</div>':
      game==="thisor"?'<p class="detail-summary">Your vote is part of the product conversation. Pick the finish you’d choose.</p><div class="two-choice"><button class="choice alternate-finish" data-action="vote" data-value="A"><img src="assets/flask.jpg" alt="" /><span>Matte Obsidian</span></button><button class="choice" data-action="vote" data-value="B"><img src="assets/flask.jpg" alt="" /><span>Brushed Clay</span></button></div>':
      '<p class="detail-summary">A quick market intuition check. Choose your estimate for the UrbanKettle gooseneck kettle.</p><div class="price-choices">'+["₹2,499","₹3,299","₹4,200"].map(function(v,i){return '<button class="choice" data-action="guess" data-value="'+i+'">'+v+'</button>';}).join("")+'</div>')+
      '<button class="cta full" style="margin-top:13px" data-action="complete-game" data-id="'+game+'">'+(state.completedGames.includes(game)?"Round completed":"Finish round · +2 demo coins")+'</button><p class="muted" style="font-size:9px;text-align:center">NETRA Coins are platform rewards, not cash. Demo reward is stored in this browser.</p></section></div>';
  }
  if (modal.type==="thread") {
    const isBrandReply=modal.id==="brand-consumer";
    const who=isBrandReply?"@ananya_m":modal.id==="rohan"?"Rohan K.":modal.id==="kavya"?"Kavya Patel":"NordicForm Official";
    const messages=isBrandReply?(state.brandReplies||[]):(state.replies||[]);
    return '<div class="overlay" data-action="modal-backdrop"><section class="sheet" role="dialog" aria-modal="true"><div class="sheet-handle"></div><div class="sheet-top"><h2>'+who+'</h2><button class="close-button" data-action="close">×</button></div><div class="comment-row"><span class="mini-avatar">'+(isBrandReply?'AM':'RK')+'</span><p><strong>'+who+'</strong>'+(isBrandReply?'The weighted handle feels so balanced during slow pours. Does this kettle work with induction?':'That Bite was interesting — what did you think about it?')+'</p></div>'+messages.map(function(r){return '<div class="comment-row" style="justify-content:flex-end"><p style="background:#f1ece7;padding:9px 12px;border-radius:12px">'+esc(r)+'</p></div>';}).join("")+'<form data-form="reply" class="comment-input"><input name="reply" placeholder="Reply as '+esc(state.brandName||"your brand")+'..." required /><button class="cta" style="min-height:38px;padding:0 12px">'+icon("send",15)+'</button></form></section></div>';
  }
  if (modal.type==="notifications") {
    state.notificationRead=true; persist();
    return '<div class="overlay" data-action="modal-backdrop"><section class="sheet" role="dialog" aria-modal="true"><div class="sheet-handle"></div><div class="sheet-top"><h2>Notifications</h2><button class="close-button" data-action="close">×</button></div><div class="profile-nav-card card"><span class="tile-icon">✦</span><span><strong>NordicForm shared a new Bite</strong><small>2 creators you follow are talking about this.</small></span></div><div class="profile-nav-card card"><span class="tile-icon">♧</span><span><strong>Your coins are ready to use</strong><small>You have '+state.coins.toLocaleString()+' NETRA Coins.</small></span></div><div class="profile-nav-card card"><span class="tile-icon">♥</span><span><strong>New opinions on your saved flask</strong><small>Three people shared what they think.</small></span></div></section></div>';
  }
  if (modal.type==="settings") {
    return '<div class="overlay" data-action="modal-backdrop"><section class="sheet" role="dialog" aria-modal="true"><div class="sheet-handle"></div><div class="sheet-top"><h2>Profile settings</h2><button class="close-button" data-action="close">×</button></div><p class="detail-summary">Your current discovery settings. Update them any time.</p><button class="profile-nav-card card" data-action="edit-intent"><span class="tile-icon">'+icon("spark",18)+'</span><span><strong>Active intent</strong><small>'+esc(state.intent)+'</small></span><span class="arrow">→</span></button><div class="flow-card"><h2>Interests</h2>'+chips(["Technology","Fashion","Coffee","Beauty","Travel","Gaming","Startups","Home"],state.interests,"interests")+'</div><div class="flow-card"><h2>Discovery style</h2><p>Current: '+esc(state.discoveryMode||"Interactive")+'</p></div><div class="profile-mode-card card"><h3>Profile type</h3><p>Switch between your Consumer and Creator profile on the same NETRA account. Your saved products and activity stay with your consumer profile.</p><button class="cta full" data-action="switch-profile">Switch to '+(state.profileMode==="creator"?"Consumer":"Creator")+' profile</button></div></section></div>';
  }
  if (modal.type==="fund-help") return '<div class="overlay" data-action="modal-backdrop"><section class="sheet"><div class="sheet-handle"></div><div class="sheet-top"><h2>How CFund works</h2><button class="close-button" data-action="close">×</button></div><p class="detail-summary">A business publishes the creative brief, campaign-specific fund, participant limit, deadline, eligibility and reward distribution up front. Creators compete by making work. Consumers can discover and respond to the resulting Bites.</p><div class="trust-note"><span class="badge">✦</span><span>CFund budgets are ceilings, not hidden creator deductions. Creator Points, NETRA Coins and cash rewards are separate systems.</span></div></section></div>';
  return "";
}
let storyTimer = 0;
let storyFinishing = false;
function storyPage() {
  return '<section class="netra-story" id="netra-story" aria-label="NETRA cinematic introduction" tabindex="0">'+
    '<div class="story-deck">'+netraStorySlides.map(function(slide,index){return '<figure class="story-slide" data-story-index="'+index+'" aria-hidden="true"><img class="story-backdrop" data-story-src="'+slide.image+'" alt="" aria-hidden="true" /><img class="story-poster" data-story-src="'+slide.image+'" alt="'+esc(slide.alt)+'" draggable="false" /></figure>';}).join("")+'</div>'+ 
    '<div class="story-vignette" aria-hidden="true"></div>'+ 
    '<button class="story-skip" data-action="story-skip" aria-label="Skip NETRA introduction">Skip <span aria-hidden="true">→</span></button>'+ 
    '<footer class="story-footer"><div class="story-dots" role="group" aria-label="Story slides">'+netraStorySlides.map(function(slide,index){return '<button class="story-dot" data-action="story-go" data-index="'+index+'" aria-label="Go to story slide '+(index+1)+' of '+netraStorySlides.length+'" aria-current="'+(index===0?'step':'false')+'"><span></span></button>';}).join("")+'</div><button class="story-launch" data-action="story-launch" aria-label="Launch NETRA and continue to onboarding"><span>Launch NETRA</span><b aria-hidden="true">→</b></button></footer>'+ 
    '<span class="story-slide-status" aria-live="polite" aria-atomic="true">Slide 1 of '+netraStorySlides.length+'</span>'+ 
    '</section>';
}
function hydrateStorySlides(activeIndex) {
  [activeIndex-1,activeIndex,activeIndex+1].forEach(function(index){
    if(index<0||index>=netraStorySlides.length)return;
    const slide=document.querySelector('.story-slide[data-story-index="'+index+'"]');
    if(!slide)return;
    slide.querySelectorAll('[data-story-src]').forEach(function(img){if(!img.hasAttribute("src"))img.src=img.dataset.storySrc;});
  });
}
function startStoryTimer() {
  clearTimeout(storyTimer);
  if(state.screen!=="story"||state.storyIndex>=netraStorySlides.length-1)return;
  storyTimer=setTimeout(function(){setStorySlide(state.storyIndex+1,false);},4500);
}
function setStorySlide(index, isManual) {
  const next=Math.max(0,Math.min(netraStorySlides.length-1,index));
  state.storyIndex=next;
  hydrateStorySlides(next);
  document.querySelectorAll(".story-slide").forEach(function(slide){
    const slideIndex=Number(slide.dataset.storyIndex);
    slide.classList.toggle("is-active",slideIndex===next);
    slide.classList.toggle("is-before",slideIndex<next);
    slide.classList.toggle("is-after",slideIndex>next);
    slide.setAttribute("aria-hidden",slideIndex===next?"false":"true");
  });
  document.querySelectorAll(".story-dot").forEach(function(dot,dotIndex){
    dot.classList.toggle("active",dotIndex===next);
    dot.setAttribute("aria-current",dotIndex===next?"step":"false");
  });
  const status=document.querySelector(".story-slide-status");
  if(status)status.textContent="Slide "+(next+1)+" of "+netraStorySlides.length;
  startStoryTimer();
}
function setupStorySlideshow() {
  clearTimeout(storyTimer);
  hydrateStorySlides(state.storyIndex||0);
  setStorySlide(state.storyIndex||0,false);
  const stage=document.getElementById("netra-story");
  if(!stage)return;
  let startX=null;
  stage.addEventListener("pointerdown",function(event){
    clearTimeout(storyTimer);
    if(event.target.closest("button")){startX=null;return;}
    startX=event.clientX;
    try{stage.setPointerCapture(event.pointerId);}catch(e){}
  });
  stage.addEventListener("pointerup",function(event){
    if(startX===null)return;
    const delta=event.clientX-startX;startX=null;
    if(Math.abs(delta)>46)setStorySlide(state.storyIndex+(delta<0?1:-1),true);
    else startStoryTimer();
  });
  stage.addEventListener("pointercancel",function(){startX=null;startStoryTimer();});
  stage.addEventListener("keydown",function(event){
    if(event.key==="ArrowRight"){event.preventDefault();setStorySlide(state.storyIndex+1,true);}
    if(event.key==="ArrowLeft"){event.preventDefault();setStorySlide(state.storyIndex-1,true);}
  });
}
function finishStory() {
  if(storyFinishing)return;
  storyFinishing=true;
  clearTimeout(storyTimer);
  state.hasSeenNetraStory=true;
  state.storyIndex=0;
  state.screen="welcome";
  state.tab="home";
  persist();
  const stage=document.getElementById("netra-story");
  if(stage){
    stage.classList.add("is-exiting");
    setTimeout(function(){modal=null;render();storyFinishing=false;},240);
  }else{modal=null;render();storyFinishing=false;}
}
function fitDailyMixVideoRegion() {
  const video=document.querySelector(".daily-mix-video");
  const region=video&&video.closest(".daily-mix-region");
  if(!video||!region||!video.videoWidth||!video.videoHeight)return;
  const height=Math.round(region.clientWidth*video.videoHeight/video.videoWidth);
  if(height>0){region.style.minHeight="0px";region.style.height=height+"px";}
}
window.addEventListener("resize",fitDailyMixVideoRegion);
function render() {
  const existingDailyVideo=document.querySelector(".daily-mix-video");
  const previousVideoTime=existingDailyVideo?existingDailyVideo.currentTime:null;
  const prevScroll=document.querySelector(".screen-scroll");
  const oldScroll=prevScroll?prevScroll.scrollTop:0;
  if (state.screen==="story") { app.innerHTML=storyPage(); setupStorySlideshow(); }
  else if (state.screen==="welcome") app.innerHTML=welcomePage();
  else if (state.screen==="account") app.innerHTML=accountPage();
  else if (state.screen==="onboarding") app.innerHTML=onboardingPage();
  else if (state.screen==="business") app.innerHTML=header("Business")+businessPage()+bottomNav();
  else if (state.screen==="search") app.innerHTML=(state.profileMode==="creator"?creatorHeader("Search"):header("Search"))+searchPage()+bottomNav();
  else if (state.screen==="messages") app.innerHTML=(state.profileMode==="creator"?creatorHeader("Messages"):header("Messages"))+messagesPage()+bottomNav();
  else if (state.screen==="app") {
    const creator=state.profileMode==="creator";
    const brand=state.profileMode==="brand";
    const meta=creator?{home:["Home","CREATOR COMMAND CENTER"],create:["Create","CREATOR CREATE"],bites:["Bites","BITES FEED"],cfund:["CFund","CREATOR CFUND"],consumer:["Consumer","CONSUMER INTELLIGENCE"],profile:["Profile","CREATOR PROFILE"]}:brand?{home:["Home","BRAND SUITE"],create:["Create","CREATE A BITE"],bites:["Bites","BITES FEED"],cfund:["CFund","CFUND CAMPAIGNS"],consumer:["Consumers","CONSUMER INTELLIGENCE"],profile:["Profile","BUSINESS PROFILE"]}:{home:["Home",""],create:["Create","Consumer participation"],bites:["Bites","Bites feed"],cfund:["CFund","Creative fund"],consumer:["Consumer","Discovery"],profile:["Profile","Curator"]};
    const page=creator?(state.tab==="home"?homePage():state.tab==="create"?creatorStudioPage():state.tab==="bites"?bitePage():state.tab==="cfund"?creatorFundPage():state.tab==="consumer"?creatorConsumerPage():creatorProfilePage()):brand?(state.tab==="home"?brandHomePage():state.tab==="create"?brandCreatePage():state.tab==="bites"?bitePage():state.tab==="cfund"?brandFundPage():state.tab==="consumer"?brandConsumersPage():brandProfilePage()):(state.tab==="home"?homePage():state.tab==="create"?createPage():state.tab==="bites"?bitePage():state.tab==="cfund"?cfundPage():state.tab==="consumer"?consumerPage():profilePage());
    app.innerHTML=(state.tab==="bites"?"":(creator?creatorHeader(meta[state.tab][1]):header(meta[state.tab][1])))+page+bottomNav();
  }
  if (modal) app.insertAdjacentHTML("beforeend",modalView());
  if (prevScroll && document.querySelector(".screen-scroll")) document.querySelector(".screen-scroll").scrollTop=oldScroll;
  const dailyVideo=document.querySelector(".daily-mix-video");
  if(dailyVideo){
    dailyVideo.muted=true;
    dailyVideo.playsInline=true;
    dailyVideo.addEventListener("loadedmetadata",fitDailyMixVideoRegion,{once:true});
    fitDailyMixVideoRegion();
    const resumeVideo=function(){
      if(previousVideoTime!==null&&Number.isFinite(previousVideoTime)&&Number.isFinite(dailyVideo.duration)&&dailyVideo.duration>0){
        try{dailyVideo.currentTime=previousVideoTime%dailyVideo.duration;}catch(e){}
      }
      const playback=dailyVideo.play();
      if(playback&&typeof playback.catch==="function")playback.catch(function(){});
    };
    if(previousVideoTime!==null&&dailyVideo.readyState<1)dailyVideo.addEventListener("loadedmetadata",resumeVideo,{once:true});
    else resumeVideo();
  }
  const feed=document.querySelector(".bite-feed");
  if(feed) requestAnimationFrame(function(){
    feed.scrollTop=(state.biteIndex||0)*feed.clientHeight;
    setupBiteVideoObserver();
  });
}
function navigate(tab) { setScreen("app",tab); }
function launchSelectedExperience() {
  if(serverMe&&state.screen==="onboarding"){
    (async function(){
      try{
        clearTimeout(onboardingSaveTimer);
        await apiRequest("/api/v1/me/onboarding",{method:"PATCH",body:JSON.stringify({step:"complete",data:onboardingData()})});
        if(state.profileMode==="consumer")await apiRequest("/api/v1/me/preferences",{method:"PUT",body:JSON.stringify({interests:state.interests||[],contentPreferences:state.contents||[],activeIntent:state.intent||"I’m exploring",discoveryMode:state.discoveryMode||"Interactive",buyingCapacity:state.budget||"₹3,000 / month",radar:state.radar||""})});
        const profileUpdate={};if(state.name)profileUpdate.name=state.name;if(state.username)profileUpdate.username=state.username;if(state.profileMode==="consumer"&&state.about!==undefined)profileUpdate.about=state.about;
        if(Object.keys(profileUpdate).length)await apiRequest("/api/v1/me/profile",{method:"PATCH",body:JSON.stringify(profileUpdate)});
        await apiRequest("/api/v1/me/onboarding/complete",{method:"POST",body:"{}"});
        await refreshServerMe();state.onboardingComplete=true;state.screen="app";state.tab="home";modal=null;persist();render();showNotice("You’re in. Your profile setup has been saved.");
      }catch(error){showNotice(error.message||"Your profile could not be saved. Please try again.");}
    })();return;
  }
  state.profileMode=uiProfile(backendProfile(state.selectedRole));
  state.screen="app";
  state.tab="home";
  modal=null;
  persist();render();
}
function remember(id) {
  const bite = bitesFeed.find(b => b.id === id);
  if (bite) {
    if(!serverMe) { showNotice("Sign in to save this Bite."); return; }
    const isSaving = !bite.hasSaved;
    bite.hasSaved = isSaving;
    bite.saveCount = (bite.saveCount || 0) + (isSaving ? 1 : -1);
    render(); showNotice(isSaving ? "Saved to Memory" : "Removed from Memory");
    (async () => {
      try {
        if(isSaving) await apiRequest("/api/v1/bites/" + id + "/interactions", { method: "POST", body: JSON.stringify({ type: "SAVE" }) });
        else await apiRequest("/api/v1/bites/" + id + "/interactions/SAVE", { method: "DELETE" });
      } catch (err) {
        bite.hasSaved = !isSaving;
        bite.saveCount = (bite.saveCount || 0) + (!isSaving ? 1 : -1);
        render(); showNotice(err.message || "Failed to update save status.");
      }
    })();
  } else {
    const ids=selectedProductIds().slice();
    if(ids.includes(id)){state.saved=ids.filter(function(x){return x!==id;});showNotice("Removed from Product Memory");}
    else {state.saved=ids.concat(id);showNotice("Added to Product Memory");}
    persist(); render();
  }
}
function openSearch(term) {
  searchQuery=term||""; state.screen="search"; modal=null; render(true);
  setTimeout(function(){const field=document.getElementById("global-search");if(field&&searchQuery){field.focus();field.setSelectionRange(searchQuery.length,searchQuery.length);}},10);
}
function openProduct(id, type) { modal={type:type||"product",id:id}; render(); }
function addCoins(id) {
  if(!state.completedGames.includes(id)){state.completedGames.push(id);state.coins+=2;persist();showNotice("+2 NETRA Coins · demo reward saved");}
  else showNotice("This sample round is already complete");
  modal=null;render();
}
function doAction(action, el, clickEvent) {
  const id=el.dataset.id, value=el.dataset.value;
  if(action==="story-launch"||action==="story-skip"){finishStory();}
  else if(action==="story-go"){setStorySlide(Number(el.dataset.index),true);}
  else if(action==="role"){state.selectedRole=el.dataset.role;render();}
  else if(action==="continue"){state.accountMode="signup";setScreen("account");}
  else if(action==="account"){state.accountMode="signin";setScreen("account");}
  else if(action==="account-mode"){state.accountMode=state.accountMode==="signup"?"signin":"signup";state.accountPendingEmail="";render();}
  else if(action==="forgot-password"){state.accountEmailDraft=document.querySelector('[data-form="signin"] input[name="email"]')?.value||state.accountEmailDraft||"";state.accountMode="reset-request";render();}
  else if(action==="signout"){(async function(){try{await apiRequest("/api/auth/sign-out",{method:"POST",body:"{}"});serverMe=null;state.authenticated=false;state.name="";state.username="";state.email="";state.profilePhoto="";state.screen="welcome";state.selectedRole="consumer";state.profileMode="consumer";state.tab="home";modal=null;persist();render();showNotice("You’re signed out.");}catch(error){showNotice(error.message);}})();}
  else if(action==="password-toggle"){const input=document.getElementById(el.dataset.target);if(input){const showing=input.type==="password";input.type=showing?"text":"password";el.setAttribute("aria-pressed",String(showing));el.setAttribute("aria-label",showing?"Hide password":"Show password");el.innerHTML=icon(showing?"eyeOff":"eye",19);}}
  else if(action==="google"){state.screen="onboarding";state.onboardingStep=1;persist();render();showNotice("Demo profile ready · personalize your feed");}
  else if(action==="back"){if(state.screen==="account")setScreen("welcome");else if(state.screen==="onboarding"){if(state.selectedRole==="brand"&&state.onboardingStep>1){state.onboardingStep--;render();}else if(state.selectedRole!=="brand"&&state.onboardingStep>1){state.onboardingStep--;render();}else setScreen("account");}else if(state.screen==="search")setScreen("app","home");else setScreen("welcome");}
  else if(action==="skip"){launchSelectedExperience();}
  else if(action==="onboard-next"){const lastStep=state.selectedRole==="creator"?4:3;if(state.onboardingStep<lastStep){state.onboardingStep++;persist();render(true);}else{if(serverMe)launchSelectedExperience();else{launchSelectedExperience();showNotice("You’re in. Take a look around.");}}}
  else if(action==="brand-onboard-next"){if(Number(state.onboardingStep||1)<2){state.onboardingStep=2;persist();render(true);}else{state.profileMode="brand";state.selectedRole="brand";if(serverMe)launchSelectedExperience();else{state.onboardingComplete=true;state.screen="app";state.tab="home";persist();render();showNotice("Brand setup complete. Welcome to your Brand Suite.");}}}
  else if(action==="brand-save-draft"){persist();showNotice("Brand draft saved in this browser.");}
  else if(action==="nav"){state.screen="app";state.tab=el.dataset.tab||"home";modal=null;if(state.tab==="bites"&&!bitesFeed.length&&!bitesLoading)fetchBitesFeed();persist();render();}
  else if(action==="bite-open"){state.biteIndex=Number(el.dataset.index)||0;state.genre="";state.screen="app";state.tab="bites";modal=null;if(!bitesFeed.length&&!bitesLoading)fetchBitesFeed();persist();render();}
  else if(action==="play-clip"){state.playingBite=state.playingBite===id?null:id;render();const v=document.querySelector('video.bite-video[data-bite-id="'+id+'"]');if(v){if(state.playingBite===id)v.pause();else v.play().catch(function(){});}}
  else if(action==="retry-bites"||action==="refresh-bites"){fetchBitesFeed(true);}
  else if(action==="bite-mode"){state.biteMode=value;state.biteIndex=0;render();}
  else if(action==="genre"){state.genre=value;state.biteIndex=0;state.screen="app";state.tab="bites";modal=null;persist();render();}
  else if(action==="topic"){state.topic=value;state.genre="";state.screen="app";state.tab="bites";state.biteIndex=0;modal=null;persist();render();}
  else if(action==="your-story"){showNotice("Story sharing will be ready when posting is connected.");}
  else if(action==="messages"){state.screen="messages";modal=null;persist();render();}
  else if(action==="back-to-bites"){state.screen="app";state.tab="bites";persist();render();}
  else if(action==="search-open"){openSearch("");}
  else if(action==="search-term"){openSearch(value);}
  else if(action==="noop"){}
  else if(action==="chip"){const group=el.dataset.group;const list=(state[group]||[]).slice();state[group]=list.includes(value)?list.filter(function(x){return x!==value;}):list.concat(value);persist();render();}
  else if(action==="intent"){state.intent=value;persist();render();}
  else if(action==="mode"){state.discoveryMode=value;persist();render();}
  else if(action==="budget"){state.budget=value;persist();render();}
  else if(action==="remember"){remember(id);}
  else if(action==="buy"||action==="product"){openProduct(id,action==="buy"?"buy":"product");}
  else if(action==="inquire"){state.inquiryProduct=id||"flask";state.screen="business";modal=null;persist();render();}
  else if(action==="external-buy"){showNotice("Brand store link is not connected in this prototype.");}
  else if(action==="like"){
    if(!serverMe) { showNotice("Sign in to like this Bite."); return; }
    const bite = bitesFeed.find(b => b.id === id);
    if(bite) {
      const isLiking = !bite.hasLiked;
      bite.hasLiked = isLiking;
      bite.likeCount = (bite.likeCount || 0) + (isLiking ? 1 : -1);
      render();
      (async () => {
        try {
          if(isLiking) await apiRequest("/api/v1/bites/" + id + "/interactions", { method: "POST", body: JSON.stringify({ type: "LIKE" }) });
          else await apiRequest("/api/v1/bites/" + id + "/interactions/LIKE", { method: "DELETE" });
        } catch (err) {
          bite.hasLiked = !isLiking;
          bite.likeCount = (bite.likeCount || 0) + (!isLiking ? 1 : -1);
          render(); showNotice(err.message || "Failed to update like.");
        }
      })();
    } else {
      state.liked[id]=!state.liked[id];persist();render();
    }
  }
  else if(action==="trust"){state.trusted[id]=!state.trusted[id];persist();showNotice(state.trusted[id]?"Your trust signal is recorded":"Your trust signal was removed");render();}
  else if(action==="comments"){
    if(state.commentAttachment&&state.commentAttachment.url)URL.revokeObjectURL(state.commentAttachment.url);
    modal={type:"comments",id:id||products[0].id};
    state.commentAttachment=null;
    state.commentDraft="";
    render();
    if (id) {
      apiRequest("/api/v1/bites/" + id + "/comments").then(function(data) {
        if(!state.biteComments) state.biteComments = {};
        state.biteComments[id] = data.items;
        if(modal && modal.type === "comments" && modal.id === id) render();
      }).catch(function(err){});
    }
  }
  else if(action==="comment-gallery"||action==="comment-gif"){const picker=document.getElementById(action==="comment-gif"?"comment-gif-input":"comment-gallery-input");if(picker)picker.click();}
  else if(action==="comment-remove"){if(state.commentAttachment&&state.commentAttachment.url)URL.revokeObjectURL(state.commentAttachment.url);state.commentAttachment=null;render();}
  else if(action==="share"||action==="share-profile"||action==="share-bite"){if(navigator.clipboard){navigator.clipboard.writeText(location.href).then(function(){showNotice("NETRA link copied to clipboard");}).catch(function(){showNotice("Ready to share this NETRA discovery");});}else showNotice("Ready to share this NETRA discovery");}
  else if(action==="follow"){state.followed[id]=!state.followed[id];persist();render();showNotice(state.followed[id]?"Following on NETRA":"Unfollowed");}
  else if(action==="notifications"){modal={type:"notifications"};render();}
  else if(action==="profile-tab"){state.profileSubtab=value;state.screen="app";state.tab="profile";modal=null;persist();render();}
  else if(action==="profile-menu"){modal={type:"profile-menu"};render();}
  else if(action==="switch-mode"){if(serverMe){enterProfile(value,!serverMe.activatedProfiles.includes(uiProfile(backendProfile(value)))).catch(function(error){showNotice(error.message);});}else{state.profileMode=value;state.selectedRole=value;state.screen="app";state.tab="home";modal=null;persist();render();showNotice((value.charAt(0).toUpperCase()+value.slice(1))+" profile is now active.");}}
  else if(action==="theme-cycle"){const themes=["warm","berry","ocean"];state.theme=themes[(themes.indexOf(state.theme||"warm")+1)%themes.length];document.documentElement.dataset.theme=state.theme;persist();modal={type:"profile-menu"};render();showNotice("Theme: "+state.theme);}
  else if(action==="edit-intent"){state.screen="onboarding";state.onboardingStep=1;persist();modal=null;render();}
  else if(action==="settings"){modal={type:"settings"};render();}
  else if(action==="request-business-verification"){if(!serverMe||state.profileMode!=="brand"){showNotice("Sign in and activate your Brand/Business profile first.");}else{modal={type:"business-verification"};render();}}
  else if(action==="switch-profile"){const next=state.profileMode==="creator"?"consumer":"creator";if(serverMe)enterProfile(next,!serverMe.activatedProfiles.includes(uiProfile(backendProfile(next)))).catch(function(error){showNotice(error.message);});else{state.profileMode=next;state.selectedRole=next;state.screen="app";state.tab="home";modal=null;persist();render();showNotice(state.profileMode==="creator"?"Creator profile is now active.":"Consumer profile is now active.");}}
  else if(action==="creator-start"){showNotice("Creator publishing and opportunities connect in a later prototype step.");}
  else if(action==="creator-discipline"){const list=(state.creatorDisciplines||[]).slice();state.creatorDisciplines=list.includes(value)?list.filter(function(x){return x!==value;}):list.concat(value);persist();render();}
  else if(action==="creator-style"){const list=(state.creatorStyles||[]).slice();state.creatorStyles=list.includes(value)?list.filter(function(x){return x!==value;}):list.concat(value);persist();render();}
  else if(action==="creator-goal"){const list=(state.creatorGoals||[]).slice();state.creatorGoals=list.includes(value)?list.filter(function(x){return x!==value;}):list.concat(value);persist();render();}
  else if(action==="creator-experience"){state.creatorExperience=value;persist();render();}
  else if(action==="creator-rank"){const list=(state.creatorRankOrder||["Filmmaking","Storytelling","Video Editing"]).slice(),index=list.indexOf(value),next=index+(el.dataset.direction==="up"?-1:1);if(index>=0&&next>=0&&next<list.length){const move=list.splice(index,1)[0];list.splice(next,0,move);state.creatorRankOrder=list;persist();render();}}
  else if(action==="creator-connect"){state.creatorConnected=!state.creatorConnected;persist();render();showNotice(state.creatorConnected?"Creator profile connected":"Creator profile disconnected");}
  else if(action==="creator-availability"){state.creatorAvailability=!state.creatorAvailability;persist();render();showNotice(state.creatorAvailability?"Brand collaboration requests are on":"Brand collaboration requests are paused");}
  else if(action==="creator-platform"){showNotice("Add your portfolio link from Creator Profile settings.");}
  else if(action==="creator-google"){showNotice("Google identity linking is not connected in this local preview.");}
  else if(action==="creator-format"){state.creatorFormat=value;persist();render();}
  else if(action==="creator-audit"){const list=(state.creatorAudit||[]).slice();state.creatorAudit=list.includes(value)?list.filter(function(x){return x!==value;}):list.concat(value);persist();render();}
  else if(action==="creator-upload"){const picker=document.getElementById("creator-media-input");if(picker)picker.click();}
  else if(action==="creator-preview"){showNotice("Safe-zone preview is ready for this sample master.");}
  else if(action==="creator-save"){state.creatorDraftSaved=true;persist();showNotice("Working draft saved in this browser.");}
  else if(action==="creator-submit"){
    if(!(state.creatorIdea||"").trim()){showNotice("Add your core creative idea before submitting.");return;}
    if(!state.creatorDraftBiteId){showNotice("Upload media first.");return;}
    (async () => {
      try {
        await apiRequest("/api/v1/bites/" + state.creatorDraftBiteId, { method: "PATCH", body: JSON.stringify({ title: "Creator Bite", description: state.creatorIdea }) });
        await apiRequest("/api/v1/bites/" + state.creatorDraftBiteId + "/publish", { method: "POST" });
        state.creatorSubmissions=(state.creatorSubmissions||0)+1;
        state.creatorDraftSaved=false;
        state.creatorDraftBiteId=null;
        state.creatorDraftMediaUrl=null;
        state.creatorMediaName=null;
        state.creatorIdea="";
        persist();
        render();
        showNotice("Entry submitted and published.");
      } catch (err) { showNotice(err.message || "Failed to publish."); }
    })();
  }
  else if(action==="creator-original"){state.creatorBrief="Original Work";state.tab="create";render();showNotice("Original work draft started.");}
  else if(action==="creator-fund-filter"){state.creatorFundFilter=value;persist();render();}
  else if(action==="creator-analytics-tab"){state.creatorAnalyticsTab=value;persist();render();}
  else if(action==="creator-fund-enter"){state.creatorBrief="Make Urban Living Impossible to Ignore";state.tab="create";state.screen="app";persist();render();showNotice("CFund brief added to Create Studio.");}
  else if(action==="creator-feed"||action==="creator-review"){showNotice("Creator submission preview opened.");}
  else if(action==="creator-portfolio"){showNotice("Your audited portfolio is up to date.");}
  else if(action==="creator-withdraw"){showNotice("Payout request is ready when UPI is connected.");}
  else if(action==="creator-inquiry"){modal={type:"thread",id:"nordic-inquiry"};render();}
  else if(action==="creator-counter"){showNotice("Counter-offer tools will open with account services.");}
  else if(action==="creator-accept"){showNotice("Brief accepted · escrow terms are ready for review.");}
  else if(action==="creator-range"){showNotice("Showing the last 30 days.");}
  else if(action==="creator-content-filter"){showNotice("All creator content is included.");}
  else if(action==="creator-export"){showNotice("Analytics export is being prepared.");}
  else if(action==="brand-start"){state.screen="onboarding";state.selectedRole="brand";state.onboardingStep=1;persist();render();}
  else if(action==="brand-discipline"){state.brandDiscipline=value;persist();render();}
  else if(action==="brand-color"){state.brandColor=value;persist();render();}
  else if(action==="brand-polish"){showNotice("Your brand story is ready for an editorial polish.");}
  else if(action==="brand-create-type"){state.brandCreateType=value;persist();render();}
  else if(action==="brand-tone"){state.brandTone=value;persist();render();}
  else if(action==="brand-campaign-aim"){state.brandCampaignAim=value;persist();render();}
  else if(action==="brand-budget"){state.brandBudget=value;persist();render();}
  else if(action==="brand-create-upload"){const picker=document.querySelector(".brand-bite-picker");if(picker)picker.click();}
  else if(action==="brand-publish"){
    if(!state.brandDraftBiteId){showNotice("Upload media first.");return;}
    (async () => {
      try {
        const desc = document.querySelector('textarea[data-field="brandAudience"]')?.value || "Brand Bite";
        await apiRequest("/api/v1/bites/" + state.brandDraftBiteId, { method: "PATCH", body: JSON.stringify({ title: "Brand Bite", description: desc }) });
        await apiRequest("/api/v1/bites/" + state.brandDraftBiteId + "/publish", { method: "POST" });
        state.brandPublishedBites=(state.brandPublishedBites||0)+1;
        state.brandDraftBiteId=null;
        state.brandDraftMediaUrl=null;
        state.brandBiteMediaName=null;
        state.brandAudience="";
        persist();
        render();
        showNotice("Bite published successfully.");
      } catch (err) { showNotice(err.message || "Failed to publish."); }
    })();
  }
  else if(action==="brand-catalog"){const all=products.concat(additionalProducts),index=all.findIndex(function(p){return p.id===(state.brandCatalog||"kettle");});state.brandCatalog=(all[(index+1)%all.length]||products[2]).id;persist();render();showNotice("Catalog item changed.");}
  else if(action==="brand-add-product"){state.screen="app";state.tab="profile";state.brandAddProduct=true;persist();render();showNotice("Choose a product to add to your catalog.");}
  else if(action==="brand-catalog-add"){const list=(state.brandCatalogIds||["espresso","kettle","flask","lamp"]).slice();if(!list.includes(value))list.push(value);state.brandCatalogIds=list;persist();render();showNotice("Product added to your catalog.");}
  else if(action==="brand-catalog-done"){state.brandAddProduct=false;persist();render();}
  else if(action==="brand-story-upload"){state.screen="onboarding";state.selectedRole="brand";state.onboardingStep=2;persist();render();setTimeout(function(){const picker=document.querySelector(".brand-story-picker");if(picker)picker.click();},30);}
  else if(action==="brand-reply"){modal={type:"thread",id:"brand-consumer"};render();}
  else if(action==="brand-trust-ledger"){showNotice("Brand Trust Ledger opened.");}
  else if(action==="brand-consumer-tab"){state.brandConsumerTab=value;persist();render();}
  else if(action==="brand-insight"){state.brandInsights=(state.brandInsights||0)+1;persist();showNotice("Consumer signal saved as a product insight.");}
  else if(action==="brand-critique"){modal={type:"critique"};render();}
  else if(action==="brand-fund-filter"){state.brandFundFilter=value;persist();render();}
  else if(action==="brand-fund-detail"){state.brandFundView="detail";persist();render();}
  else if(action==="brand-fund-back"){state.brandFundView="hub";persist();render();}
  else if(action==="brand-create-fund"){state.brandFundView="create";persist();render();}
  else if(action==="brand-fund-save"){state.brandFundView="hub";state.brandFundFilter="Drafts";state.brandDraftCount=(state.brandDraftCount||0)+1;persist();render();showNotice("CFund brief saved as a draft.");}
  else if(action==="brand-license"){showNotice("License terms are ready for review.");}
  else if(action==="brand-share-fund"){if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(function(){showNotice("CFund link copied.");}).catch(function(){showNotice("CFund link ready to share.");});else showNotice("CFund link ready to share.");}
  else if(action==="brand-copy-link"){if(navigator.clipboard)navigator.clipboard.writeText(location.origin+"/"+(state.brandHandle||"aurahomestudio")).then(function(){showNotice("Brand access link copied.");}).catch(function(){showNotice("Brand link ready to share.");});else showNotice("Brand link ready to share.");}
  else if(action==="brand-mode-toggle"){showNotice("Collaboration access updated.");}
  else if(action==="brand-new-campaign"){state.tab="create";state.screen="app";persist();render();}
  else if(action==="brand-drafts"){state.tab="create";state.screen="app";persist();render();showNotice("Your working drafts are ready.");}
  else if(action==="brand-invite"){showNotice("Creator invitations are ready to send from your campaign workspace.");}
  else if(action==="brand-edit-profile"){state.screen="onboarding";state.selectedRole="brand";state.onboardingStep=2;persist();render();}
  else if(action==="brand-audit"){showNotice("Two creator reels are waiting for your review.");}
  else if(action==="critique"){modal={type:"critique"};render();}
  else if(action==="submit-critique"){const text=document.getElementById("critique-text");if(!text||text.value.trim().length<8){showNotice("Add a few words about your honest reaction first.");return;}state.critiqueSubmitted=text.value.trim();persist();modal=null;render();showNotice("Feedback saved in this browser prototype.");}
  else if(action==="game"){modal={type:"challenge",id:el.dataset.game};render();}
  else if(action==="complete-game"){
    if(id==="spot" && state.gamePicks.spot.length<3){showNotice("Find all three marked details before finishing this round.");return;}
    if(id==="deal"){
      const price={pad:899,pen:449,dock:599,notebook:299};
      const picks=state.gamePicks.deal;
      const total=picks.reduce(function(sum,key){return sum+(price[key]||0);},0);
      if(picks.length<2){showNotice("Pick at least two products for your desk setup.");return;}
      if(total>2000){showNotice("That setup is over the ₹2,000 budget. Change your picks.");return;}
    }
    if(id==="thisor" && !state.votes.thisor){showNotice("Choose a product finish before submitting your vote.");return;}
    if(id==="guess" && state.votes.guess==null){showNotice("Choose a price before submitting your guess.");return;}
    addCoins(id);
  }
  else if(action==="vote"){state.votes.thisor=value;persist();showNotice("Vote added · honest opinions help shape products");render();}
  else if(action==="guess"){state.votes.guess=value;persist();render();}
  else if(action==="submit-guess"){if(state.votes.guess==null){showNotice("Choose a price before locking in your guess.");return;}addCoins("guess");}
  else if(action==="spot-choice"){const list=state.gamePicks.spot.slice();state.gamePicks.spot=list.includes(value)?list.filter(function(x){return x!==value;}):list.concat(value);persist();render();}
  else if(action==="deal-pick"){const list=state.gamePicks.deal.slice();state.gamePicks.deal=list.includes(value)?list.filter(function(x){return x!==value;}):list.concat(value);persist();render();}
  else if(action==="message-tab"){state.activeMessage=value;persist();render();}
  else if(action==="message-thread"){modal={type:"thread",id:id};render();}
  else if(action==="decline"){showNotice("Approach declined");}
  else if(action==="terms"){showNotice("Terms and account services are not connected in this prototype.");}
  else if(action==="fund-help"){modal={type:"fund-help"};render();}
  else if(action==="fund"){showNotice("Opening creator work for this challenge");}
  else if(action==="business"){state.biteIndex=Math.max(0,businesses.findIndex(function(b){return b.id===id;}))%biteClips.length;state.genre="";state.screen="app";state.tab="bites";persist();render();}
  else if(action==="discovery-filter"){document.querySelectorAll(".discovery-chips button").forEach(function(b){b.classList.toggle("active",b.dataset.value===value);});showNotice(value+" discovery selected");}
  else if(action==="avatar"||action==="creator-avatar-upload"){const picker=document.getElementById("profile-photo-input");if(picker)picker.click();}
  else if(action==="skip-avatar"){showNotice("You can add a photo later in Profile settings.");}
  else if(action==="close"){if(modal&&modal.type==="comments"&&state.commentAttachment&&state.commentAttachment.url)URL.revokeObjectURL(state.commentAttachment.url);state.commentAttachment=null;state.commentDraft="";modal=null;render();}
  else if(action==="modal-backdrop" && el===clickEvent.target){if(modal&&modal.type==="comments"&&state.commentAttachment&&state.commentAttachment.url)URL.revokeObjectURL(state.commentAttachment.url);state.commentAttachment=null;state.commentDraft="";modal=null;render();}
}
app.addEventListener("click",function(event){
  const clickTarget=event.target.closest("button,a");
  if(clickTarget){const rect=clickTarget.getBoundingClientRect(),burst=document.createElement("span");burst.className="tap-burst";burst.style.left=(rect.left+rect.width/2)+"px";burst.style.top=(rect.top+rect.height/2)+"px";document.body.appendChild(burst);setTimeout(function(){burst.remove();},760);}
  const el=event.target.closest("[data-action]");if(!el)return;
  if(el.tagName==="A")event.preventDefault();
  doAction(el.dataset.action,el,event);
});
document.addEventListener("visibilitychange",function(){
  const video=document.querySelector(".daily-mix-video");
  const biteVideos=document.querySelectorAll("video.bite-video");
  if(document.hidden){
    clearTimeout(storyTimer);
    if(video)video.pause();
    biteVideos.forEach(function(v){v.pause();});
  }else{
    if(state.screen==="story")startStoryTimer();
    if(video){const playback=video.play();if(playback&&typeof playback.catch==="function")playback.catch(function(){});}
    if(state.tab==="bites")setupBiteVideoObserver();
  }
});
app.addEventListener("scroll",function(event){
  const feed=event.target.closest&&event.target.closest(".bite-feed");
  if(feed&&feed.clientHeight){
    state.biteIndex=Math.round(feed.scrollTop/feed.clientHeight);
    if(feed.scrollTop+feed.clientHeight*1.8>=feed.scrollHeight&&bitesHasMore&&!bitesLoadingMore){
      loadNextBitesPage();
    }
  }
},true);
app.addEventListener("input",function(event){
  const field=event.target.dataset.field;
  if(field){state[field]=event.target.value;persist();}
  if(event.target.name==="comment"&&event.target.closest("form[data-form='comment']"))state.commentDraft=event.target.value;
  if(event.target.dataset.action==="global-search"){
    searchQuery=event.target.value;
    const container=document.getElementById("search-results");if(container)container.innerHTML=searchResults(searchQuery);
    const fresh=document.getElementById("global-search");if(fresh){fresh.focus();fresh.setSelectionRange(searchQuery.length,searchQuery.length);}
  }
  if(event.target.dataset.action==="home-search" && event.target.value.length>1){searchQuery=event.target.value;openSearch(searchQuery);}
});
app.addEventListener("change",function(event){
  const picker=event.target;
  if(picker.classList.contains("profile-photo-picker")){
    const photo=picker.files&&picker.files[0];
    if(!photo)return;
    if(!photo.type.startsWith("image/")){showNotice("Choose an image for your profile photo.");return;}
    if(!serverMe){showNotice("Sign in and verify your email before adding a profile photo.");return;}
    (async function(){
      try{
        showNotice("Uploading your profile photo…");
        const intent=await apiRequest("/api/v1/media/upload-intents",{method:"POST",body:JSON.stringify({fileName:photo.name,contentType:photo.type,byteSize:photo.size,purpose:"profile_avatar"})});
        const uploaded=await fetch(intent.uploadUrl,{method:intent.uploadMethod,headers:intent.uploadHeaders,body:photo,credentials:"same-origin"});
        if(!uploaded.ok)throw new Error("The photo could not be uploaded. Please try again.");
        const completed=await apiRequest("/api/v1/media/"+intent.id+"/complete",{method:"POST",body:"{}"});
        await apiRequest("/api/v1/me/profile",{method:"PATCH",body:JSON.stringify({avatarMediaId:completed.id})});
        await refreshServerMe();persist();render();showNotice("Profile photo saved to your NETRA account.");
      }catch(error){showNotice(error.message||"The profile photo could not be saved.");}
      finally{picker.value="";}
    })();return;
  }
  if(picker.classList.contains("creator-media-picker") || picker.classList.contains("brand-bite-picker")){
    const isBrand = picker.classList.contains("brand-bite-picker");
    const media=picker.files&&picker.files[0];
    if(!media)return;
    if(!media.type.startsWith("video/")&&!(isBrand && media.type.startsWith("image/"))){showNotice("Choose a valid file format.");return;}

    (async () => {
      try {
        if(isBrand) { state.brandBiteMediaName = "Uploading..."; state.brandDraftBiteId = null; state.brandDraftMediaUrl = null; }
        else { state.creatorMediaName = "Uploading..."; state.creatorDraftBiteId = null; state.creatorDraftMediaUrl = null; }
        render();

        const draftBite = await apiRequest("/api/v1/bites", { method: "POST", body: JSON.stringify({ title: isBrand ? "Brand Draft" : "Creator Draft", description: "" }) });
        const intent = await apiRequest("/api/v1/media/upload-intents", { method: "POST", body: JSON.stringify({ filename: media.name, contentType: media.type, sizeBytes: media.size, purpose: "bite" }) });
        const putRes = await fetch(intent.uploadUrl, { method: "PUT", headers: { "content-type": media.type }, body: media });
        if(!putRes.ok) throw new Error("Upload failed.");
        const completed = await apiRequest("/api/v1/media/" + intent.mediaAssetId + "/complete", { method: "POST" });
        await apiRequest("/api/v1/bites/" + draftBite.id, { method: "PATCH", body: JSON.stringify({ mediaAssetId: completed.id }) });

        if(isBrand) { state.brandBiteMediaName = media.name; state.brandDraftBiteId = draftBite.id; state.brandDraftMediaUrl = completed.url; }
        else { state.creatorMediaName = media.name; state.creatorDraftBiteId = draftBite.id; state.creatorDraftMediaUrl = completed.url; }
        persist(); render(); showNotice("Media uploaded and ready for review.");
      } catch (err) {
        if(isBrand) { state.brandBiteMediaName = null; } else { state.creatorMediaName = null; }
        render(); showNotice(err.message || "Upload failed.");
      }
    })();
    return;
  }
  if(picker.classList.contains("brand-logo-picker")){
    const photo=picker.files&&picker.files[0];if(!photo)return;
    if(!photo.type.startsWith("image/")){showNotice("Choose an image file for your brand logo.");return;}
    const reader=new FileReader();reader.onload=function(){const image=new Image();image.onload=function(){const side=280,canvas=document.createElement("canvas");canvas.width=side;canvas.height=side;const context=canvas.getContext("2d");context.clearRect(0,0,side,side);const scale=Math.min(side/image.width,side/image.height),w=image.width*scale,h=image.height*scale;context.drawImage(image,(side-w)/2,(side-h)/2,w,h);state.brandLogoData=canvas.toDataURL("image/png");state.brandLogoName=photo.name;persist();render();showNotice("Business logo uploaded.");};image.onerror=function(){showNotice("This logo could not be opened. Try another image.");};image.src=reader.result;};reader.readAsDataURL(photo);return;
  }
  if(picker.classList.contains("brand-story-picker")){
    const media=picker.files&&picker.files[0];if(!media)return;
    if(!media.type.startsWith("video/")){showNotice("Choose a video for your Brand Story.");return;}
    state.brandStoryName=media.name;persist();render();showNotice("Brand Story added to your draft.");return;
  }
  if(!picker.classList.contains("comment-media-input"))return;
  const file=picker.files&&picker.files[0];
  if(!file)return;
  const isGif=file.type==="image/gif"||/\.gif$/i.test(file.name);
  if(!file.type.startsWith("image/")&&!isGif){showNotice("Choose an image or GIF file.");return;}
  if(state.commentAttachment&&state.commentAttachment.url)URL.revokeObjectURL(state.commentAttachment.url);
  state.commentAttachment={url:URL.createObjectURL(file),name:file.name,kind:picker.dataset.mediaKind==="gif"||isGif?"GIF":"Image"};
  render();
});
app.addEventListener("submit",async function(event){
  event.preventDefault();
  const type=event.target.dataset.form;
  if(type==="signup"){
    if(event.target.elements.password.value!==event.target.elements.confirmPassword.value){showNotice("Those passwords don’t match yet.");event.target.elements.confirmPassword.focus();return;}
    const name=event.target.elements.name.value.trim(),username=event.target.elements.username.value.trim().replace(/^@/,""),email=event.target.elements.email.value.trim();
    if(event.target.elements.password.value.length<10){showNotice("Use a password with at least 10 characters.");return;}
    let accountCreated=false;
    try{
      authBusy=true;const profile=backendProfile(state.selectedRole);
      await apiRequest("/api/auth/sign-up/email",{method:"POST",body:JSON.stringify({name,email,username,password:event.target.elements.password.value,callbackURL:accountCallbackUrl(profile)})});
      accountCreated=true;
      await refreshServerMe();
      if(profile!=="consumer"&&!(serverMe.activatedProfiles||[]).includes(profile)){
        await apiRequest("/api/v1/me/profiles/"+profile+"/activate",{method:"POST",body:"{}"});
        await refreshServerMe();
      }
      const data=serverMe;state.screen=isProfileComplete(data,data.activeProfile)?"app":"onboarding";state.onboardingStep=onboardingStepFor(data,data.activeProfile);state.tab="home";state.accountEmailDraft="";persist();render();authBusy=false;showNotice("Account created. Let’s set up your profile.");
    }catch(error){authBusy=false;if(accountCreated){state.screen="onboarding";state.onboardingStep=1;render();}showNotice(error.message||"Could not create your account.");}
  }
  if(type==="signin"){
    const email=event.target.elements.email.value.trim(),password=event.target.elements.password.value;
    try{
      authBusy=true;await apiRequest("/api/auth/sign-in/email",{method:"POST",body:JSON.stringify({email,password,callbackURL:location.origin+"/"})});
      await refreshServerMe();const data=serverMe;state.screen=isProfileComplete(data,data.activeProfile)?"app":"onboarding";state.onboardingStep=onboardingStepFor(data,data.activeProfile);state.tab="home";state.accountEmailDraft="";persist();render();authBusy=false;showNotice("Welcome back, "+(data.user.name||""));
    }catch(error){authBusy=false;showNotice(error.message||"Could not sign in.");}
  }
  if(type==="request-password-reset"){
    const email=event.target.elements.email.value.trim();state.accountEmailDraft=email;
    try{authBusy=true;await apiRequest("/api/auth/request-password-reset",{method:"POST",body:JSON.stringify({email,redirectTo:location.origin+"/?reset=1"})});state.accountMode="signin";render();authBusy=false;showNotice("If that email is registered, a reset link is on its way.");}
    catch(error){authBusy=false;showNotice(error.message||"Could not request a password reset.");}
  }
  if(type==="reset-password"){
    const token=event.target.elements.token.value,newPassword=event.target.elements.newPassword.value;
    try{authBusy=true;await apiRequest("/api/auth/reset-password",{method:"POST",body:JSON.stringify({token,newPassword})});state.resetToken="";state.accountMode="signin";history.replaceState({},"",location.pathname);render();authBusy=false;showNotice("Password updated. Sign in with your new password.");}
    catch(error){authBusy=false;showNotice(error.message||"Could not update your password.");}
  }
  if(type==="business-verification"){
    const businessEmail=event.target.elements.businessEmail.value.trim(),businessWebsite=event.target.elements.businessWebsite.value.trim(),registrationId=event.target.elements.registrationId.value.trim(),body={businessEmail};
    if(businessWebsite)body.businessWebsite=businessWebsite;if(registrationId)body.registrationId=registrationId;
    try{const result=await apiRequest("/api/v1/business/verification-requests",{method:"POST",body:JSON.stringify(body)});await refreshServerMe();modal=null;render();showNotice(result.message||"Verification request saved.");}
    catch(error){showNotice(error.message||"Could not submit the verification request.");}
  }
  if(type==="comment"){
    const input=event.target.elements.comment,text=input.value.trim(),attachment=state.commentAttachment;
    if(!text&&!attachment){showNotice("Add a thought, photo, or GIF first.");return;}
    const biteId=(modal&&modal.id)||products[0].id;
    if (bitesFeed.some(b => b.id === biteId)) {
      if(!serverMe) { showNotice("Sign in to join the conversation."); return; }
      if(attachment) { showNotice("Attachments not supported in V1 yet."); return; }
      input.disabled = true;
      const btn = event.target.querySelector("button");
      if(btn) btn.disabled = true;
      apiRequest("/api/v1/bites/" + biteId + "/comments", { method: "POST", body: JSON.stringify({ text: text }) })
      .then(function(newComment) {
        if(!state.biteComments)state.biteComments={};
        state.biteComments[biteId]=(state.biteComments[biteId]||[]).concat([{text: text, user: serverMe.user}]);
        const bite = bitesFeed.find(b => b.id === biteId);
        if (bite) bite.commentCount = (bite.commentCount || 0) + 1;
        state.commentAttachment=null;state.commentDraft="";
        render();showNotice("Your take is in the conversation.");
      })
      .catch(function(err){
        showNotice(err.message || "Could not post comment.");
        input.disabled = false;
        if(btn) btn.disabled = false;
      });
    } else {
      if(!state.biteComments)state.biteComments={};
      state.biteComments[biteId]=(state.biteComments[biteId]||[]).concat([{text:text,attachment:attachment}]);
      state.commentAttachment=null;state.commentDraft="";render();showNotice("Your take is in the conversation.");
    }
  }
  if(type==="business-chat"){
    const text=event.target.elements.message.value.trim();if(!text)return;
    const product=productById(state.inquiryProduct||"flask"),business=businessForProduct(product);
    if(!state.businessChats)state.businessChats={};
    const thread=(state.businessChats[business.id]||[{from:"business",text:"Hi! Ask us anything about "+product.name+". We’re here to help.",time:"Now"}]).slice();
    thread.push({from:"you",text:text,time:"Just now"});
    thread.push({from:"business",text:"Thanks for asking! "+product.name+" is listed at "+product.price+". We’ve saved your question for the "+business.name+" team.",time:"Sample reply"});
    state.businessChats[business.id]=thread;persist();render();showNotice("Your message and a sample reply are ready.");
  }
  if(type==="reply"){const input=event.target.elements.reply;if(input.value.trim()){if(modal&&modal.id==="brand-consumer")state.brandReplies=(state.brandReplies||[]).concat(input.value.trim());else state.replies=(state.replies||[]).concat(input.value.trim());const threadId=modal&&modal.id;persist();modal={type:"thread",id:threadId};render();}}
});
render();
restoreServerSession();
